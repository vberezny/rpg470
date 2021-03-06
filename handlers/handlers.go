package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
	"sfu.ca/apruner/cmpt470finalprojectrpg/helpers"
	"sfu.ca/apruner/cmpt470finalprojectrpg/shared"

	"fmt"
	"log"
	"os"
)

var Database *sql.DB

var config Config

type Config struct {
	Protocol string `json:"protocol"`
	Local    bool   `json:"local"`
}

func SetupConfig() {
	production := os.Getenv("HEROKU")
	if production != "" {
		config.Local = false
		config.Protocol = "wss://"
	} else {
		config.Local = true
		config.Protocol = "ws://"
	}
}

// TODO: Figure out if Cors is/should be enabled for production
// Development needs it for now
func EnableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func HandleConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var err error
	bytes, err := json.Marshal(config)

	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("handleConfig error: %v", err), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(bytes)
}

func TestDatabase(w http.ResponseWriter, r *http.Request) {
	_, err := Database.Query("SELECT 1 FROM Users")
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("Database is not connected! error %v", err), http.StatusInternalServerError)
		return
	}
	responseToEncode := shared.Response{"Database is connected!!"}
	encodedResponse, err := json.Marshal(responseToEncode)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf("testDatabase error: %v", err)
	}

}

// TODO: Maybe refactor so that there is less copy paste between this and the other user endpoints
func HandleUserExists(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	username := mux.Vars(r)["username"]
	queryUser := shared.User{}
	row := Database.QueryRow("SELECT id, username, fullname FROM users WHERE username = $1", username)
	err := row.Scan(&queryUser.Id, &queryUser.Username, &queryUser.FullName)

	if err != nil {
		var strErr string
		var header int
		if err == sql.ErrNoRows {
			strErr = fmt.Sprintf("error querying database (user doesn't exist): %v", err)
			header = http.StatusNotFound
		} else {
			strErr = fmt.Sprintf("error querying database (other sql error): %v", err)
			log.Printf(strErr)
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}

	resp, err := json.Marshal(queryUser)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

func HandleUserLogout(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User was not authenticated! error: %v", err), http.StatusForbidden)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   "",
		Path:    "/api/",
		Expires: time.Now().AddDate(-1, 0, 0),
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "username",
		Value:   "",
		Path:    "/api/",
		Expires: time.Now().AddDate(-1, 0, 0),
	})

	w.WriteHeader(http.StatusOK)
	responseToEncode := shared.Response{"User logged out successfully"}
	encodedResponse, err := json.Marshal(responseToEncode)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}
}

func HandleUserLogin(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	requestUser := shared.User{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&requestUser)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not process JSON body!", http.StatusBadRequest)
		return
	}
	queryUser := shared.User{}
	var passwordHash string
	var passwordSalt string
	row := Database.QueryRow("SELECT id, username, fullname, passwordhash, passwordsalt FROM users WHERE username = $1", requestUser.Username)
	err = row.Scan(&queryUser.Id, &queryUser.Username, &queryUser.FullName, &passwordHash, &passwordSalt)
	if err != nil {
		strErr := fmt.Sprintf("error querying database: %v", err)
		header := http.StatusNotFound
		if err != sql.ErrNoRows {
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(requestUser.Password+passwordSalt))
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Password was incorrect!", http.StatusForbidden)
		return
	}

	sessionToken := uuid.New().String()
	sessionHash, err := bcrypt.GenerateFromPassword([]byte(sessionToken+passwordSalt), bcrypt.MinCost)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, err.Error(), http.StatusInternalServerError)
	}
	selectUserIdStatement := `SELECT 1 FROM usersessions WHERE userid = $1`
	row = Database.QueryRow(selectUserIdStatement, queryUser.Id)
	var temp int
	err = row.Scan(&temp)
	if err == sql.ErrNoRows {
		sqlStatement := `INSERT INTO usersessions (sessionkey, userid, logintime, lastseentime)
			VALUES ($1, $2, $3, $4)`
		_, err = Database.Exec(sqlStatement, sessionHash, queryUser.Id, time.Now(), time.Now())
		if err != nil {
			strErr := fmt.Sprintf("Could not insert into database error: %v", err)
			helpers.LogAndSendErrorMessage(w, strErr, http.StatusInternalServerError)
			return
		}
	} else {
		sqlStatement := `UPDATE usersessions SET sessionkey = $1, logintime = $2, lastseentime = $3 WHERE userid = $4`
		_, err = Database.Exec(sqlStatement, sessionHash, time.Now(), time.Now(), queryUser.Id)
		if err != nil {
			strErr := fmt.Sprintf("Could not insert into database error: %v", err)
			helpers.LogAndSendErrorMessage(w, strErr, http.StatusInternalServerError)
			return
		}
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "session_token",
		Value: string(sessionToken),
		Path:  "/api/",
		//TODO probably should expire: Expires: time.Now().Add(3600 * time.Second),
	})
	http.SetCookie(w, &http.Cookie{
		Name:  "username",
		Value: string(queryUser.Username),
		Path:  "/api/",
		//TODO probably should expire: Expires: time.Now().Add(3600 * time.Second),
	})
	resp, err := json.Marshal(queryUser)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write([]byte(resp))
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

func HandleTestUserLoggedIn(w http.ResponseWriter, r *http.Request) {
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}
	responseToEncode := shared.Response{"User is logged in"}
	encodedResponse, err := json.Marshal(responseToEncode)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

func HandleUserCreate(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	user := shared.User{}
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&user)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not process JSON body!", http.StatusBadRequest)
		return
	}
	user.Username = strings.ToLower(user.Username) // Lowercase the username
	row := Database.QueryRow("SELECT 1 FROM users WHERE username = $1", user.Username)
	var temp int
	err = row.Scan(&temp)
	if err != sql.ErrNoRows {
		strErr := fmt.Sprintf("user already exists. error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusConflict)
		return
	}

	passwordSalt := uuid.New().String()
	passwordHash, err := bcrypt.GenerateFromPassword([]byte(user.Password+passwordSalt), bcrypt.MinCost)
	sqlStatement := `INSERT INTO Users (username, fullname, passwordhash, passwordsalt)
			VALUES ($1, $2, $3, $4)`
	_, err = Database.Exec(sqlStatement, user.Username, user.FullName, passwordHash, passwordSalt)
	if err != nil {
		strErr := fmt.Sprintf("Could not insert into database error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	responseToEncode := shared.Response{"Successfully created user"}
	encodedResponse, err := json.Marshal(responseToEncode)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

// HandleCharacterCreate takes name and uid values
func HandleCharacterCreate(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	username, err := helpers.GetUsername(r)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, err.Error(), http.StatusUnauthorized)
	}
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}
	character := shared.Character{
		Level: 1,
	}

	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&character) // store uid and name
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not process JSON body!", http.StatusBadRequest)
		return
	}

	err = character.Validate()
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("character invalid, err: %v", err),
			http.StatusBadRequest)
		return
	}

	character.CalculateStats()

	var userId int
	row := Database.QueryRow(`SELECT id  FROM users WHERE username = $1`, username)
	err = row.Scan(&userId)
	if err != nil {
		var strErr string
		var header int
		if err == sql.ErrNoRows {
			strErr = fmt.Sprintf("error querying database (user doesn't exist): %v", err)
			header = http.StatusNotFound
		} else {
			strErr = fmt.Sprintf("error querying database (other sql error): %v", err)
			log.Printf(strErr)
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}

	sqlStatement := `INSERT INTO Characters (charactername, characterlevel, attack, defense, magic_attack, magic_defense, health, stamina, strength, agility, wisdom, charisma, userid)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`
	_, err = Database.Exec(sqlStatement, character.CharacterName, character.Level, character.Attack,
		character.Defense, character.MagicAttack, character.MagicDefense, character.Health,
		character.Stamina, character.Strength, character.Agility, character.Wisdom, character.Charisma, userId)

	if err != nil {
		strErr := fmt.Sprintf("Could not insert into database error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusBadRequest)
		return
	}

	sqlStatement = `SELECT characterid FROM Characters WHERE charactername = $1`
	row = Database.QueryRow(sqlStatement, character.CharacterName)
	err = row.Scan(&character.CharacterId)
	if err != nil {
		var strErr string
		var header int
		if err == sql.ErrNoRows {
			strErr = fmt.Sprintf("error querying database (user doesn't exist): %v", err)
			header = http.StatusNotFound
		} else {
			strErr = fmt.Sprintf("error querying database (other sql error): %v", err)
			log.Printf(strErr)
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}

	// give each starting character 3 potions
	sqlStatement = `INSERT INTO Inventory (characterid, itemid, numheld) VALUES ($1, $2, $3)`
	_, err = Database.Exec(sqlStatement, character.CharacterId, 9, 3)

	if err != nil {
		strErr := fmt.Sprintf("Could not insert into database error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusBadRequest)
		return
	}

	character.UserId = userId
	w.WriteHeader(http.StatusCreated)
	encodedResponse, err := json.Marshal(character)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

func HandleUserCharacters(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}
	username, err := helpers.GetUsername(r)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, err.Error(), http.StatusUnauthorized)
	}

	var userId int
	row := Database.QueryRow(`SELECT id  FROM users WHERE username = $1`, username)
	err = row.Scan(&userId)
	if err != nil {
		var strErr string
		var header int
		if err == sql.ErrNoRows {
			strErr = fmt.Sprintf("error querying database (user doesn't exist): %v", err)
			header = http.StatusNotFound
		} else {
			strErr = fmt.Sprintf("error querying database (other sql error): %v", err)
			log.Printf(strErr)
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}

	rows, err := Database.Query(`SELECT characterid, charactername, characterlevel, attack, defense, magic_attack, 
										magic_defense, health, userid, stamina, strength, agility, wisdom, charisma
										FROM characters WHERE userid = $1`, userId)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("error querying rows: %v", err), http.StatusInternalServerError)
		return
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			log.Println("error closing rows in HandleUserCharacters: ", err)
		}
	}()

	characters := shared.Characters{[]shared.Character{}}
	for rows.Next() {
		character := shared.Character{}
		err := rows.Scan(&character.CharacterId, &character.CharacterName, &character.Level, &character.Attack,
			&character.Defense, &character.MagicAttack, &character.MagicDefense, &character.Health, &character.UserId,
			&character.Stamina, &character.Strength, &character.Agility, &character.Wisdom, &character.Charisma)
		if err != nil {
			msg := fmt.Sprintf("error scanning row, aborting. error: %v", err)
			helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
			return
		}
		characters.Characters = append(characters.Characters, character)
	}

	resp, err := json.Marshal(characters)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}

func HandleGetNPCs(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	rows, err := Database.Query(`SELECT id, name, type, level, description, attack, 
										defense, health, magic_attack, magic_defense
										FROM npcs`)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("error querying rows: %v", err), http.StatusInternalServerError)
		return
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			log.Println("error closing rows in HandleGetNPCs: ", err)
		}
	}()

	npcs := shared.NPCs{[]shared.NPC{}}
	for rows.Next() {
		npc := shared.NPC{}
		err := rows.Scan(&npc.Id, &npc.Name, &npc.Type, &npc.Level, &npc.Description, &npc.Attack, &npc.Defense,
			&npc.Health, &npc.MagicAttack, &npc.MagicDefense)
		if err != nil {
			msg := fmt.Sprintf("error scanning row, aborting. error: %v", err)
			helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
			return
		}
		npcs.NPCs = append(npcs.NPCs, npc)
	}

	resp, err := json.Marshal(npcs)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}
}

func HandleSaveBattle(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	_, err := helpers.GetUsername(r)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, err.Error(), http.StatusUnauthorized)
	}
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}

	battle := shared.Battle{}
	decoder := json.NewDecoder(r.Body)
	err = decoder.Decode(&battle)
	if err != nil {
		strErr := fmt.Sprintf("Could not process JSON body! Error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusBadRequest)
		return
	}

	// TODO: figure out validation for battle data (or if it is even needed)

	sqlStatement := `INSERT INTO Battles (characterid, won, escaped, opponent, log, battletime)
			VALUES ($1, $2, $3, $4, $5, $6)`
	_, err = Database.Exec(sqlStatement, battle.CharacterId, battle.Won, battle.Escaped, battle.Opponent,
		pq.Array(battle.Log), time.Now())
	if err != nil {
		strErr := fmt.Sprintf("Could not insert into database error: %v", err)
		helpers.LogAndSendErrorMessage(w, strErr, http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
	encodedResponse, err := json.Marshal(battle)
	if err != nil {
		log.Printf(helpers.JsonEncodingErrorFormatString, err)
	}
	_, err = w.Write(encodedResponse)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}
}

func HandleCharacterInventory(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}

	characterName := mux.Vars(r)["character_name"]

	var userId int
	username, err := helpers.GetUsername(r)
	query := `SELECT id FROM users WHERE username = $1`
	row := Database.QueryRow(query, username)
	err = row.Scan(&userId)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("error querying rows: %v", err), http.StatusInternalServerError)
		return
	}

	var characterId int
	rowCharacter := Database.QueryRow(`SELECT characterid FROM characters WHERE charactername = $1 AND userid = $2`, characterName, userId)

	err = rowCharacter.Scan(&characterId)
	if err != nil {
		var strErr string
		var header int
		if err == sql.ErrNoRows {
			strErr = fmt.Sprintf("error querying database (character doesn't exist): %v", err)
			header = http.StatusNotFound
		} else {
			strErr = fmt.Sprintf("error querying database (other sql error): %v", err)
			log.Printf(strErr)
			header = http.StatusInternalServerError
		}
		helpers.LogAndSendErrorMessage(w, strErr, header)
		return
	}

	inventoryQuery := `
	WITh inventory_items_subquery AS (
		WITH inventory_subquery AS (
			SELECT itemid, numheld
			FROM inventory
			WHERE characterid = $1
		)
		SELECT inventory_subquery.itemid as itemid, inventory_subquery.numheld as numheld, items.typeref, items.subref
		FROM items,
			 inventory_subquery
		WHERE items.id = inventory_subquery.itemid
	) SELECT inventory_items_subquery.itemid, inventory_items_subquery.numheld, itemtypes.typename, inventory_items_subquery.subref
	FROM itemtypes, inventory_items_subquery WHERE inventory_items_subquery.typeref = itemtypes.id;
	`

	rows, err := Database.Query(inventoryQuery, characterId)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("error querying rows: %v", err), http.StatusInternalServerError)
		return
	}
	defer func() {
		err := rows.Close()
		if err != nil {
			log.Println("error closing rows in HandleCharacterInventory: ", err)
		}
	}()
	var itemId int
	var numHeld int
	var typename string
	var subref int
	weapons := []shared.Weapon{}
	consumables := []shared.Consumable{}
	armours := []shared.Armour{}
	for rows.Next() {
		err := rows.Scan(&itemId, &numHeld, &typename, &subref)
		if err != nil {
			msg := fmt.Sprintf("error scanning row, aborting. error: %v", err)
			helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
			return
		}
		switch typename {
		case "Weapon":
			weapon := shared.Weapon{}
			row := Database.QueryRow("SELECT id, name, damage, speed, critchance, magic_damage FROM weapons WHERE id = $1", subref)
			err := row.Scan(&weapon.Id, &weapon.Name, &weapon.Damage, &weapon.Speed, &weapon.CritChance, &weapon.MagicDamage)
			if err != nil {
				msg := fmt.Sprintf("error scanning weapons row, aborting. error: %v", err)
				helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
				return
			}
			for i := 0; i < numHeld; i ++ {
				weapons = append(weapons, weapon)
			}
		case "Armour":
			armour := shared.Armour{}
			row := Database.QueryRow("SELECT id, name, defense, weight, magic_defense FROM armour WHERE id = $1", subref)
			err := row.Scan(&armour.Id, &armour.Name, &armour.Defense, &armour.Weight, &armour.MagicDefense)
			if err != nil {
				msg := fmt.Sprintf("error scanning armours row, aborting. error: %v", err)
				helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
				return
			}
			for i := 0; i < numHeld; i ++ {
				armours = append(armours, armour)
			}
		case "Consumables":
			consumable := shared.Consumable{}
			row := Database.QueryRow("SELECT id, name, healing, damage FROM consumables WHERE id = $1", subref)
			err := row.Scan(&consumable.Id, &consumable.Name, &consumable.Healing, &consumable.Damage)
			if err != nil {
				msg := fmt.Sprintf("error scanning consumables row, aborting. error: %v", err)
				helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
				return
			}
			for i := 0; i < numHeld; i ++ {
				consumables = append(consumables, consumable)
			}
		default:
			msg := fmt.Sprintf("itemtype: %v unknown", typename)
			helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
			return
		}

	}
	inventory := shared.Inventory{
		Weapons: weapons,
		Consumables: consumables,
		Armours: armours,
	}
	resp, err := json.Marshal(inventory)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}
}

func HandleCharacterBattles(w http.ResponseWriter, r *http.Request) {
	EnableCors(&w)

	_, err := helpers.GetUsername(r)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, err.Error(), http.StatusUnauthorized)
	}
	if _, err := helpers.UserLoggedIn(r); err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("User not authenticated, please log in! error: %v", err), http.StatusForbidden)
		return
	}

	characterId := mux.Vars(r)["character_id"]
	sqlStatement := `SELECT won, escaped, opponent, log, battletime FROM Battles WHERE characterid = $1`
	rows, err := Database.Query(sqlStatement, characterId)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, fmt.Sprintf("error querying rows: %v", err), http.StatusInternalServerError)
		return
	}

	defer func() {
		err := rows.Close()
		if err != nil {
			log.Println("error closing rows in HandleCharacterBattles: ", err)
		}
	}()

	battles := shared.Battles{[]shared.Battle{}}

	for rows.Next() {
		battle := shared.Battle{}
		err := rows.Scan(&battle.Won, &battle.Escaped, &battle.Opponent, pq.Array(&battle.Log), &battle.TimeStamp)
		if err != nil {
			msg := fmt.Sprintf("error scanning row, aborting. error: %v", err)
			helpers.LogAndSendErrorMessage(w, msg, http.StatusInternalServerError)
			return
		}
		battles.Battles = append(battles.Battles, battle)
	}

	resp, err := json.Marshal(battles)
	if err != nil {
		helpers.LogAndSendErrorMessage(w, "Could not marshal JSON body!", http.StatusInternalServerError)
		return
	}

	_, err = w.Write(resp)
	if err != nil {
		log.Printf(helpers.WritingErrorFormatString, err)
	}

}
