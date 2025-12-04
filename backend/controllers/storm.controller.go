package controllers

import (
	"context"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"

	"github.com/GiaAn1603/AeroStorm/backend/config"
	"github.com/GiaAn1603/AeroStorm/backend/models"
)

func GetStormTracks(c *fiber.Ctx) error {
	stormTrackCollection := config.DB.Collection("StormTracks")
	stormID := c.Params("stormID")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := stormTrackCollection.Find(ctx, bson.M{"STORM ID": stormID})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to query database"})
	}
	defer cursor.Close(ctx)

	var stormTracks []models.StormTrack
	if err = cursor.All(ctx, &stormTracks); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve storm track data"})
	}

	if len(stormTracks) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No tracking data found for this storm"})
	}

	return c.Status(fiber.StatusOK).JSON(stormTracks)
}

func GetStormsListByYear(c *fiber.Ctx) error {
	stormsCollection := config.DB.Collection("Storms")
	yearParam := c.Params("year")

	year, err := strconv.Atoi(yearParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid year format"})
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := stormsCollection.Find(ctx, bson.M{"YEAR": year})
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to query database"})
	}
	defer cursor.Close(ctx)

	var storms []models.Storm
	if err = cursor.All(ctx, &storms); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to retrieve storm track data"})
	}

	if len(storms) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No storm track data found for this year"})
	}

	return c.Status(fiber.StatusOK).JSON(storms)
}
