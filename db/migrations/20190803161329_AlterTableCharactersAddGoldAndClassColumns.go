
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190803161329(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE characters ADD COLUMN Gold int not null DEFAULT 0, ADD COLUMN Class text;`)

	if err != nil {
		log.Fatalf("fatal error while running add gold and class columns to character table migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190803161329(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE characters DROP COLUMN Gold, DROP COLUMN Class;`)

	if err != nil {
		log.Fatalf("fatal error while running add gold and class columns to character table migration %v", err)
	}
}
