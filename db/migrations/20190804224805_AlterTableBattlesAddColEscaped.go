
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190804224805(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Battles ADD COLUMN Escaped bool not null default false`)

	if err != nil {
		log.Fatalf("fatal error while running alter columns in battles migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190804224805(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Battles DROP COLUMN Escaped;`)

	if err != nil {
		log.Fatalf("fatal error while running alter columns in battles migration %v", err)
	}
}
