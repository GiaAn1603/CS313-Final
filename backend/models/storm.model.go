package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Storm struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	StormID        string             `json:"storm_id" bson:"STORM ID"`
	StormName      string             `json:"storm_name" bson:"STORM NAME"`
	StormStartDate string             `json:"storm_start_date" bson:"STORM START DATE"`
	StormEndDate   string             `json:"storm_end_date" bson:"STORM END DATE"`
	Year           int                `json:"year" bson:"YEAR"`
}
