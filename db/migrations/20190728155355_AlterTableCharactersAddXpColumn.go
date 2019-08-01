
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190728155355(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE characters ADD COLUMN Experience INT NOT NULL DEFAULT 0;`)

	if err != nil {
		log.Fatalf("fatal error while running add xp column to character table migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190728155355(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE characters DROP COLUMN Experience;`)

	if err != nil {
		log.Fatalf("fatal error while running add xp column to character table migration %v", err)
	}
}
