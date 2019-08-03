
package main

import (
	"database/sql"
	"log"
)

// Up is executed when this migration is applied
func Up_20190803143046(txn *sql.Tx) {
	_, err := txn.Exec(`CREATE TABLE IF NOT EXISTS Battles(
					 CharacterID int not null,
					 Won bool not null default false,
					 Opponent text not null,
					 BattleLog jsonb,
					 BattleTime timestamp not null,
					 foreign key (CharacterID) references Characters(CharacterID)
					)`)

	if err != nil {
		log.Fatalf("fatal error while running battles migration %v", err)
	}
}

// Down is executed when this migration is rolled back
func Down_20190803143046(txn *sql.Tx) {
	_, err := txn.Exec(`DROP TABLE Battles`)
	if err != nil {
		log.Fatalf("fatal error while running battles migration %v", err)
	}
}
