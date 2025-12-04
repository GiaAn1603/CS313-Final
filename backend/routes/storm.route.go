package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/GiaAn1603/AeroStorm/backend/controllers"
)

func StormRoutes(app *fiber.App) {
	router := app.Group("/api/storms-list/")
	router.Get("/storm-tracks/:stormID", controllers.GetStormTracks)
	router.Get("/:year", controllers.GetStormsListByYear)
}
