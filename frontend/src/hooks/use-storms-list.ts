import { useCallback, useEffect, useState } from "react";
import { stormAPI } from "@/api/storm";
import type { Storm } from "@/api/types";

export function useStormsList(year: string | number) {
  const [storms, setStorms] = useState<Storm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchStorms = useCallback(async () => {
    if (!year) return;

    try {
      setIsLoading(true);
      setError("");
      const data = await stormAPI.getStormsListByYear(year);
      setStorms(data);
    } catch (err) {
      setError("Failed to fetch storms data");
      console.error("Error fetching storms:", err);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchStorms();
  }, [fetchStorms]);

  return {
    storms,
    isLoading,
    error,
    refetch: fetchStorms,
  };
}
