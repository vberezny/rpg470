package main

import (
	"database/sql"
	h "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"sfu.ca/apruner/cmpt470finalprojectrpg/db"
	"sfu.ca/apruner/cmpt470finalprojectrpg/handlers"
	"sfu.ca/apruner/cmpt470finalprojectrpg/helpers"

	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

const BUILD = "./frontend/build"
const ASSETS = "./frontend/public/assets"

func loggingMiddleware(next http.Handler) http.Handler {
	return h.CombinedLoggingHandler(os.Stdout, next)
}

func healthCheck(database *sql.DB, server *http.Server) {
	const maxTicks = 100
	var currentTicks int64 = 0
	for {
		_, err := database.Query("SELECT 1 FROM Battles")
		if err == nil {
			break
		} else if currentTicks >= maxTicks {
			log.Fatalf("Could not connect to database successfully")
		}
		log.Printf("Time since start: %v seconds\n", currentTicks*2)
		log.Printf("error: %v\n", err)

		time.Sleep(2 * time.Second)
		currentTicks += 1

	}
	err := server.Close()
	log.Println(err)
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Server is starting!"))
	if err != nil {
		log.Println(err)
	}
}

func getServer(router *mux.Router) *http.Server {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
		log.Printf("no port supplied. defaulting to %v\n", port)
	}
	host := os.Getenv("HOST")
	if host == "" {
		host = "0.0.0.0"
		log.Printf("no HOST supplied. defaulting to %v\n", host)
	}
	log.Printf("http server created on %v:%v\n", host, port)

	return &http.Server{
		Handler:      router,
		Addr:         fmt.Sprintf("%v:%v", host, port),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

}

func main() {
	database := db.OpenDb()
	handlers.Database = database
	helpers.Database = database
	r := mux.NewRouter()
	r.PathPrefix("/").HandlerFunc(healthCheckHandler)
	srv := getServer(r)
	go func() {
		log.Println(srv.ListenAndServe())
	}()
	healthCheck(database, srv)

	r = mux.NewRouter()
	if production := os.Getenv("HEROKU"); production == "" {
		r.Use(loggingMiddleware)
	}
	r.HandleFunc("/config.json", handlers.HandleConfig)
	r.HandleFunc("/channels.json", handlers.GetChannels)
	r.HandleFunc("/channel", handlers.CreateChannel)
	r.HandleFunc("/database.html", handlers.TestDatabase)
	// Configure websocket route
	r.HandleFunc("/{name}/ws", handlers.HandleConnections)
	r.HandleFunc("/chat/{name}", handlers.HandleChatroom)

	// Non chat backend API endpoints
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/users/exists/{username}", handlers.HandleUserExists).Methods("GET")
	api.HandleFunc("/users/login", handlers.HandleUserLogin).Methods("POST")
	api.HandleFunc("/users/logout", handlers.HandleUserLogout).Methods("POST")
	api.HandleFunc("/users/logged_in", handlers.HandleTestUserLoggedIn).Methods("GET")
	api.HandleFunc("/users/create", handlers.HandleUserCreate).Methods("POST")
	api.HandleFunc("/characters/create", handlers.HandleCharacterCreate).Methods("POST")
	api.HandleFunc("/characters", handlers.HandleUserCharacters).Methods("GET")
	api.HandleFunc("/characters/{character_name}/inventory", handlers.HandleCharacterInventory).Methods("GET")
	api.HandleFunc("/npcs", handlers.HandleGetNPCs).Methods("GET")
	api.HandleFunc("/battles", handlers.HandleSaveBattle).Methods("POST")
	api.HandleFunc("/battles/{character_id}", handlers.HandleCharacterBattles).Methods("GET")

	if os.Getenv("DISABLE_STATIC_FILE_SERVER") != "true" {
		r.PathPrefix("/assets").Handler(http.StripPrefix("/assets", http.FileServer(http.Dir(ASSETS))))
		r.PathPrefix("").Handler(http.StripPrefix("", http.FileServer(http.Dir(BUILD))))
	}

	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("." + STATIC)))

	// Start listening for incoming chat messages
	//go handlers.HandleMessages()

	handlers.SetupConfig()

	// Configure websocket route
	srv = getServer(r)

	log.Fatal(srv.ListenAndServe())
}
