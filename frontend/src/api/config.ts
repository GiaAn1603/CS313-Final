export const WEATHER_CONFIG = {
  BASE_URL: "https://api.openweathermap.org/data/2.5",
  GEO: "https://api.openweathermap.org/geo/1.0",
  API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  DEFAULT_PARAMS: {
    units: "metric",
    appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
  },
};

export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_BE_BASE_URL,
  ENDPOINTS: {
    STORM_TRACKS: (stormID: string) => `/storm-tracks/${stormID}`,
    STORMS_LIST: (year: string | number) => `/${year}`,
  },
};

export const MODEL_CONFIG = {
  BASE_URL: import.meta.env.VITE_MODEL_API_URL || "http://localhost:8000",
  ENDPOINTS: {
    PREDICT: () => "/predict",
    STORM: (stormID: string) => `/storm/${stormID}`,
  },
};
