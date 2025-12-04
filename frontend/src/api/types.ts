export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  coord: Coordinates;
  weather: WeatherCondition[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
  dt: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: WeatherData["main"];
    weather: WeatherData["weather"];
    wind: WeatherData["wind"];
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface Storm {
  id: string;
  storm_id: string;
  storm_name: string;
  storm_start_date: string;
  storm_end_date: string;
  year: number;
}

export interface StormTrack {
  id: string;
  storm_id: string;
  storm_name: string;
  storm_start_date: string;
  storm_end_date: string;
  plots:
    | string
    | {
        track: string;
        intensity: string;
        radial: string;
      };
  storm_track_status: string;
  basin: string;
  year: number;
  nature: string;
  lat: number;
  subbasin: string;
  iso_time: string;
  lon: number;
  usa_sshs: number;
  iflag: string;
  dist2land: number;
  storm_dir: number;
  storm_speed: number;
}

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface StormDataResponse {
  storm_id: string;
  input_count: number;
  input_data: Array<[number, number]>;
  input_times: string[];
  actual_count: number;
  actual_data: Array<[number, number]>;
  actual_times: string[];
}

export interface PredictionPoint {
  lat: number;
  lon: number;
  point_index: number;
}

export interface PredictionsResponse {
  predictions: PredictionPoint[];
}

export interface ErrorResponse {
  error: string;
}
