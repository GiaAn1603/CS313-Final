package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/GiaAn1603/AeroStorm/backend/config"
	"github.com/GiaAn1603/AeroStorm/backend/routes"
)

func main() {
	config.LoadEnv()
	config.ConnectDB()

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: config.FE_BASE_URL,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
	}))
	routes.StormRoutes(app)

	port := config.PORT
	if port == "" {
		port = "3000"
	}

	log.Printf("Server running at http://localhost:%s", port)
	err := app.Listen(fmt.Sprintf(":%s", port))
	if err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
