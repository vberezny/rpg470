
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190804130210(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Battles DROP COLUMN BattleLog; ALTER TABLE Battles ADD COLUMN Log text[]`)

	if err != nil {
		log.Fatalf("fatal error while running alter columns in battles  migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190804130210(txn *sql.Tx) {
	_, err := txn.Exec(`ALTER TABLE Battles DROP COLUMN Log; ALTER TABLE Battles ADD COLUMN BattleLog JSONB;`)

	if err != nil {
		log.Fatalf("fatal error while running alter columns in battles  migration %v", err)
	}
}
