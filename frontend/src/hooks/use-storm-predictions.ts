import { useCallback, useState } from "react";
import { MODEL_CONFIG } from "@/api/config";
import type { PredictionPoint, PredictionsResponse, StormDataResponse } from "@/api/types";

interface UseStormPredictionsReturn {
  stormData: StormDataResponse | null;
  stormDataLoading: boolean;
  stormDataError: string | null;

  predictions: PredictionPoint[];
  isPredicting: boolean;
  predictionError: string | null;
  predictionResult: PredictionsResponse | null;

  fetchStormData: (stormId: string) => Promise<StormDataResponse | null>;
  predictStorm: (stormId: string) => Promise<PredictionsResponse | null>;
  resetAll: () => void;
}

export const useStormPredictions = (): UseStormPredictionsReturn => {
  const [stormData, setStormData] = useState<StormDataResponse | null>(null);
  const [stormDataLoading, setStormDataLoading] = useState<boolean>(false);
  const [stormDataError, setStormDataError] = useState<string | null>(null);

  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PredictionsResponse | null>(null);

  const fetchStormData = useCallback(async (stormId: string): Promise<StormDataResponse | null> => {
    if (!stormId) {
      setStormDataError("Storm ID is required");
      return null;
    }

    setStormDataLoading(true);
    setStormDataError(null);

    try {
      const response = await fetch(
        `${MODEL_CONFIG.BASE_URL}${MODEL_CONFIG.ENDPOINTS.STORM(stormId)}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch storm data: ${response.status} - ${errorText}`);
      }

      const data: StormDataResponse = await response.json();
      setStormData(data);
      return data;
    } catch (error) {
      console.error("Storm data fetch error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch storm data";
      setStormDataError(errorMessage);
      return null;
    } finally {
      setStormDataLoading(false);
    }
  }, []);

  const predictStorm = useCallback(async (stormId: string): Promise<PredictionsResponse | null> => {
    if (!stormId) {
      setPredictionError("Storm ID is required");
      return null;
    }

    setIsPredicting(true);
    setPredictionError(null);

    try {
      const response = await fetch(`${MODEL_CONFIG.BASE_URL}${MODEL_CONFIG.ENDPOINTS.PREDICT()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storm_id: stormId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prediction failed: ${response.status} - ${errorText}`);
      }

      const data: PredictionsResponse = await response.json();
      setPredictionResult(data);
      return data;
    } catch (error) {
      console.error("Prediction error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to predict storm path";
      setPredictionError(errorMessage);
      return null;
    } finally {
      setIsPredicting(false);
    }
  }, []);

  const resetAll = useCallback(() => {
    setStormData(null);
    setStormDataError(null);
    setPredictionError(null);
    setPredictionResult(null);
  }, []);

  return {
    stormData,
    stormDataLoading,
    stormDataError,

    predictions: predictionResult?.predictions || [],
    isPredicting,
    predictionError,
    predictionResult,

    fetchStormData,
    predictStorm,
    resetAll,
  };
};
