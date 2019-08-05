
package main

import (
	"database/sql"
	"log"
)

type Weapon struct {
	Name        string
	Damage      int
	Speed       int
	CritChance  int
	MagicDamage int
}

var weapon1 = Weapon {
	Name: "Sword",
	Damage: 3,
	Speed: 10,
	CritChance: 10,
	MagicDamage: 0,
}

var weapon2 = Weapon {
	Name: "Spear",
	Damage: 4,
	Speed: 9,
	CritChance: 15,
	MagicDamage: 0,
}

var weapon3 = Weapon {
	Name: "War Axe",
	Damage: 6,
	Speed: 4,
	CritChance: 10,
	MagicDamage: 0,
}

var weapon4 = Weapon {
	Name: "Staff",
	Damage: 0,
	Speed: 0,
	CritChance: 10,
	MagicDamage: 5,
}

var weapons = []Weapon{weapon1, weapon2, weapon3, weapon4}

// Up is executed when this migration is applied
func Up_20190805002301(txn *sql.Tx) {
	sqlStatement := `INSERT INTO weapons(name, damage, speed, critchance, magic_damage)
		VALUES ($1, $2, $3, $4, $5)`
	for _, weapon := range weapons {
		_, err := txn.Exec(sqlStatement, weapon.Name, weapon.Damage, weapon.Speed, weapon.CritChance, weapon.MagicDamage)

		if err != nil {
			log.Fatalf("fatal error while running weapons population migration %v", err)
		}
	}
}

// Down is executed when this migration is rolled back
func Down_20190805002301(txn *sql.Tx) {
	sqlStatement := `DELETE FROM weapons WHERE name = $1;`
	for _, weapon := range weapons {
		_, err := txn.Exec(sqlStatement, weapon.Name)

		if err != nil {
			log.Fatalf("fatal error while running weapons population migration %v", err)
		}
	}
}
