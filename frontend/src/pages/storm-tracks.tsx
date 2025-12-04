import { AlertTriangle, RefreshCw } from "lucide-react";
import { useParams } from "react-router-dom";
import { WeatherSkeleton } from "@/components/loading-skeleton";
import { StormInfo } from "@/components/storm-info";
import { StormPlots } from "@/components/storm-plots";
import { TracksTable } from "@/components/tracks-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useStormTracks } from "@/hooks/use-storm-tracks";

export function StormTracks() {
  const { stormID } = useParams<{ stormID: string }>();
  const { tracks, isLoading, error, refetch } = useStormTracks(stormID || "");
  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{error}.</p>
          <Button variant="outline" onClick={handleRefresh} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <WeatherSkeleton />;
  }

  return (
    <>
      {tracks.length > 0 && (
        <div className="flex h-full flex-col gap-6">
          <div className="flex min-h-[400px] flex-col gap-6 md:flex-row">
            <div className="md:w-1/3">
              <StormInfo track={tracks[0]} />
            </div>

            <div className="md:w-2/3">
              <StormPlots track={tracks[0]} />
            </div>
          </div>

          <div>
            <TracksTable tracks={tracks} />
          </div>
        </div>
      )}
    </>
  );
}
