
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190805001953(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Armour ADD COLUMN magic_defense int not null;`)

	if err != nil {
		log.Fatalf("fatal error while running armour magic defense migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190805001953(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Armour DROP COLUMN magic_defense;`)
	if err != nil {
		log.Fatalf("fatal error while running armour magic defense migration %v", err)
	}
}
