import type { StormTrack } from "@/api/types";
import { extractStormName } from "@/helpers/extract-name";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface StormInfoProps {
  track: StormTrack;
}

export function StormInfo({ track }: StormInfoProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex items-center justify-center py-4">
        <CardTitle className="text-2xl font-bold">{extractStormName(track.storm_name)}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1 text-left text-base">
        <p>
          <span className="font-medium">Start Date:</span>{" "}
          {track.storm_start_date.replace(/\s\d{2}Z$/, "")}
        </p>
        <p>
          <span className="font-medium">End Date:</span>{" "}
          {track.storm_end_date.replace(/\s\d{2}Z$/, "")}
        </p>
        <p>
          <span className="font-medium">Basin:</span> {track.basin}
        </p>
        <p>
          <span className="font-medium">Track Status:</span> {track.storm_track_status}
        </p>
      </CardContent>
    </Card>
  );
}
