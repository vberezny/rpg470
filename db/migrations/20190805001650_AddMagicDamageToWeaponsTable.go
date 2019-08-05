
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190805001650(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Weapons ADD COLUMN magic_damage int not null;`)

	if err != nil {
		log.Fatalf("fatal error while running weapons magic damage migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190805001650(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Weapons DROP COLUMN magic_damage;`)
	if err != nil {
		log.Fatalf("fatal error while running weapons magic damage migration %v", err)
	}
}
