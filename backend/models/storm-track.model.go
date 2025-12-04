package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type StormTrack struct {
	ID               primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	StormID          string             `json:"storm_id" bson:"STORM ID"`
	StormName        string             `json:"storm_name" bson:"STORM NAME"`
	StormStartDate   string             `json:"storm_start_date" bson:"STORM START DATE"`
	StormEndDate     string             `json:"storm_end_date" bson:"STORM END DATE"`
	Plots            string             `json:"plots" bson:"PLOTS"`
	StormTrackStatus string             `json:"storm_track_status" bson:"STORM TRACK STATUS"`
	Basin            string             `json:"basin" bson:"BASIN"`
	Year             int                `json:"year" bson:"YEAR"`
	Nature           string             `json:"nature" bson:"NATURE"`
	Lat              float64            `json:"lat" bson:"LAT"`
	SubBasin         string             `json:"subbasin" bson:"SUBBASIN"`
	ISOTime          primitive.DateTime `json:"iso_time" bson:"ISO TIME"`
	Lon              float64            `json:"lon" bson:"LON"`
	USASSHS          int                `json:"usa_sshs" bson:"USA SSHS"`
	IFlag            string             `json:"iflag" bson:"IFLAG"`
	Dist2Land        int                `json:"dist2land" bson:"DIST2LAND"`
	StormDir         float64            `json:"storm_dir" bson:"STORM DIR"`
	StormSpeed       float64            `json:"storm_speed" bson:"STORM SPEED"`
}
