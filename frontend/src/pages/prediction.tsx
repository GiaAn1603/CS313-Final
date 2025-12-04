import { AlertTriangle, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WeatherSkeleton } from "@/components/loading-skeleton";
import { MapCard } from "@/components/map-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStormPredictions } from "@/hooks/use-storm-predictions";

interface StormTrack {
  lat: number;
  lon: number;
  iso_time: string;
  storm_name?: string;
}

export function Prediction() {
  const [stormId, setStormId] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const commandRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    stormData,
    stormDataLoading,
    stormDataError,
    predictions,
    isPredicting,
    predictionError,
    predictStorm,
    fetchStormData,
    resetAll,
  } = useStormPredictions();

  const availableStorms = [
    "2025162N15114",
    "2025174N23146",
    "2025183N24148",
    "2025185N20119",
    "2025192N25140",
    "2025200N19123",
    "2025203N18133",
    "2025204N19121",
    "2025205N13144",
    "2025214N27137",
    "2025219N18148",
    "2025231N27128",
    "2025235N17117",
    "2025240N15116",
    "2025247N27132",
    "2025249N18117",
    "2025259N16124",
    "2025262N16133",
    "2025262N23163",
    "2025267N10134",
  ];

  const filteredStorms = stormId
    ? availableStorms.filter((stormIdItem) =>
        stormIdItem.toLowerCase().includes(stormId.toLowerCase())
      )
    : availableStorms;

  const tracks: StormTrack[] = [];
  if (stormData) {
    stormData.input_data.forEach((coord, index) => {
      tracks.push({
        lat: coord[0],
        lon: coord[1],
        iso_time: stormData.input_times[index] || `Input ${index + 1}`,
        storm_name: stormData.storm_id,
      });
    });

    stormData.actual_data.forEach((coord, index) => {
      tracks.push({
        lat: coord[0],
        lon: coord[1],
        iso_time: stormData.actual_times[index] || `Actual ${index + 1}`,
        storm_name: stormData.storm_id,
      });
    });
  }

  const handleRefresh = () => {
    if (stormId) {
      fetchStormData(stormId);
    }
  };

  const handleReset = () => {
    setStormId("");
    setShowDropdown(false);
    resetAll();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStormSelect = async (id: string) => {
    setStormId(id);
    setShowDropdown(false);
    resetAll();

    await fetchStormData(id);
  };

  const handlePredict = async () => {
    if (!stormId) return;
    await predictStorm(stormId);
  };

  if (stormDataLoading) return <WeatherSkeleton />;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Storm Path Predictions</h1>
        <p className="mx-auto max-w-2xl text-lg">
          Enter a storm ID to view its historical path and predict future trajectory
        </p>
      </div>

      {stormDataError && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Data Fetch Error</AlertTitle>
            <AlertDescription>{stormDataError}</AlertDescription>
          </Alert>
        </div>
      )}

      {predictionError && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Prediction Error</AlertTitle>
            <AlertDescription>{predictionError}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="relative w-full max-w-md" ref={commandRef}>
          <div className="relative">
            <Command className="w-full">
              <div className="relative">
                <CommandInput
                  ref={inputRef}
                  placeholder="Enter storm ID (e.g., 2025162N15114)..."
                  value={stormId}
                  onValueChange={(val: string) => {
                    setStormId(val);
                    setShowDropdown(val.length > 0);
                    if (val !== stormId) {
                      resetAll();
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="pr-10 text-base"
                  autoFocus
                />
                {stormId && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {showDropdown && filteredStorms.length > 0 && (
                <CommandList className="absolute top-full z-999 mt-1 w-full border bg-white shadow-lg dark:bg-gray-900">
                  <CommandGroup heading="Available Storms">
                    {filteredStorms.map((stormIdItem: string) => (
                      <CommandItem
                        key={stormIdItem}
                        value={stormIdItem}
                        onSelect={() => handleStormSelect(stormIdItem)}
                      >
                        {stormIdItem}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </div>
        </div>

        <Button variant="outline" onClick={handleReset} disabled={!stormId} className="h-10">
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>

        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={!stormId || stormDataLoading}
          className="h-10"
        >
          {stormDataLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </>
          )}
        </Button>

        <Button
          variant="default"
          onClick={handlePredict}
          disabled={!stormData || isPredicting}
          className="h-10"
        >
          {isPredicting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Predicting...
            </>
          ) : (
            "Predict Path"
          )}
        </Button>
      </div>

      <MapCard
        tracks={tracks}
        tracksLoading={stormDataLoading}
        predictionResult={predictions.length > 0 ? { predictions } : null}
      />

      {stormData && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold">Storm Information</h3>
            <p className="text-muted-foreground text-sm">ID: {stormData.storm_id}</p>
            <p className="text-muted-foreground text-sm">
              Total Points: {stormData.input_count + stormData.actual_count}
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold">Input Data</h3>
            <p className="text-muted-foreground text-sm">
              {stormData.input_count} historical points
            </p>
            <p className="text-muted-foreground text-sm">First: {stormData.input_times[0]}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold">Prediction</h3>
            <p className="text-muted-foreground text-sm">
              {predictions.length > 0
                ? `${predictions.length} predicted points`
                : "No predictions yet"}
            </p>
            {predictions.length > 0 && (
              <p className="text-muted-foreground text-sm">
                Next point: {predictions[0].lat.toFixed(2)}, {predictions[0].lon.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
