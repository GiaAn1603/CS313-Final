package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	PORT        string
	MONGO_URI   string
	DB_NAME     string
	FE_BASE_URL string
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env file:", err)
	}

	PORT = os.Getenv("PORT")
	MONGO_URI = os.Getenv("MONGO_URI")
	DB_NAME = os.Getenv("DB_NAME")
	FE_BASE_URL = os.Getenv("FE_BASE_URL")

	log.Println("Enviroment variables loaded successfully")
}
