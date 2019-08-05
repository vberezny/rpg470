
package main

import (
	"database/sql"
	"log"
)

type Armour struct {
	Name         string
	Defense      int
	Weight       int
	MagicDefense int
}

var armour1 = Armour{
	Name:         "Chest Plate",
	Defense:      5,
	Weight:       15,
	MagicDefense: 0,
}

var armour2 = Armour{
	Name:         "Plated Leggings",
	Defense:      4,
	Weight:       10,
	MagicDefense: 0,
}

var armour3 = Armour{
	Name:         "Heavy Helmet",
	Defense:      3,
	Weight:       7,
	MagicDefense: 0,
}

var armour4 = Armour{
	Name:         "Wizard Robe",
	Defense:      0,
	Weight:       2,
	MagicDefense: 7,
}

var armours = []Armour{armour1, armour2, armour3, armour4}

// Up is executed when this migration is applied
func Up_20190805003648(txn *sql.Tx) {
	sqlStatement := `INSERT INTO armour(name, defense, weight, magic_defense)
		VALUES ($1, $2, $3, $4)`
	for _, armour := range armours {
		_, err := txn.Exec(sqlStatement, armour.Name, armour.Defense, armour.Weight, armour.MagicDefense)

		if err != nil {
			log.Fatalf("fatal error while running armours population migration %v", err)
		}
	}
}

// Down is executed when this migration is rolled back
func Down_20190805003648(txn *sql.Tx) {
	sqlStatement := `DELETE FROM armour WHERE name = $1;`
	for _, armour := range armours {
		_, err := txn.Exec(sqlStatement, armour.Name)

		if err != nil {
			log.Fatalf("fatal error while running armours population migration %v", err)
		}
	}
}
