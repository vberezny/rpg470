
package main

import (
	"database/sql"
	"log"
)

type Consumable struct {
	Name    string
	Healing int
	Damage  int
}

var consumable1 = Consumable{
	Name:    "Potion",
	Healing: 5,
	Damage:  0,
}

var consumable2 = Consumable{
	Name:    "Golden Apple",
	Healing: 10,
	Damage:  0,
}

var consumable3 = Consumable{
	Name:    "Posion",
	Healing: 0,
	Damage:  5,
}

var consumables = []Consumable{consumable1, consumable2, consumable3}

// Up is executed when this migration is applied
func Up_20190805005248(txn *sql.Tx) {
	sqlStatement := `INSERT INTO consumables(name, healing, damage)
		VALUES ($1, $2, $3)`
	for _, consumable := range consumables {
		_, err := txn.Exec(sqlStatement, consumable.Name, consumable.Healing, consumable.Damage)

		if err != nil {
			log.Fatalf("fatal error while running consumables population migration %v", err)
		}
	}
}

// Down is executed when this migration is rolled back
func Down_20190805005248(txn *sql.Tx) {
	sqlStatement := `DELETE FROM consumables WHERE name = $1;`
	for _, consumable := range consumables {
		_, err := txn.Exec(sqlStatement, consumable.Name)

		if err != nil {
			log.Fatalf("fatal error while running consumables population migration %v", err)
		}
	}
}
