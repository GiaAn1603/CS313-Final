import { AlertTriangle, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { WeatherSkeleton } from "@/components/loading-skeleton";
import { StormCard } from "@/components/storm-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useStormsList } from "@/hooks/use-storms-list";

export function StormsList() {
  const { year } = useParams<{ year: string }>();
  const { storms, isLoading, error, refetch } = useStormsList(year || "");
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
    <div className="container mx-auto px-6 py-10">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{year} Storms</h1>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {storms.map((storm) => (
          <Link key={storm.storm_id} to={`/data/storm-tracks/${storm.storm_id}`}>
            <StormCard key={storm.id} storm={storm} />
          </Link>
        ))}
      </div>
    </div>
  );
}
