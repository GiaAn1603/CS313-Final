import type { Storm } from "@/api/types";
import { extractStormName } from "@/helpers/extract-name";
import { Card, CardContent, CardTitle } from "./ui/card";

interface StormCardProps {
  storm: Storm;
}

export function StormCard({ storm }: StormCardProps) {
  return (
    <Card
      key={storm.id}
      className="group h-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
    >
      <CardContent className="text-center">
        <CardTitle className="text-lg">{extractStormName(storm.storm_name)}</CardTitle>
        <div className="my-2 text-sm">{storm.storm_id}</div>
        <div className="space-y-1 text-left text-sm">
          <p>
            <span className="font-medium">Start Date:</span>{" "}
            {storm.storm_start_date.replace(/\s\d{2}Z$/, "")}
          </p>
          <p>
            <span className="font-medium">End Date:</span>{" "}
            {storm.storm_end_date.replace(/\s\d{2}Z$/, "")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
