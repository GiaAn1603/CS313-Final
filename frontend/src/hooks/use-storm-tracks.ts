import { useCallback, useEffect, useState } from "react";
import { stormAPI } from "@/api/storm";
import type { StormTrack } from "@/api/types";

export function useStormTracks(stormID: string) {
  const [tracks, setTracks] = useState<StormTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!stormID) {
      setTracks([]);
      return;
    }

    let canceled = false;

    const fetchTracks = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await stormAPI.getStormTracksById(stormID);
        if (!canceled) setTracks(data);
      } catch (err) {
        if (!canceled) setError("Failed to fetch storm tracks data");
        console.error("Error fetching storm tracks:", err);
      } finally {
        if (!canceled) setIsLoading(false);
      }
    };

    fetchTracks();

    return () => {
      canceled = true;
    };
  }, [stormID]);

  const refetch = useCallback(() => {
    if (!stormID) return;
    setTracks([]);
    setIsLoading(true);
    stormAPI
      .getStormTracksById(stormID)
      .then((data) => setTracks(data))
      .catch(() => setError("Failed to fetch storm tracks data"))
      .finally(() => setIsLoading(false));
  }, [stormID]);

  return { tracks, isLoading, error, refetch };
}
