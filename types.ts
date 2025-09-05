

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  pollen?: {
    time: string[];
    alder_pollen: (number|null)[];
    grass_pollen: (number|null)[];
    birch_pollen: (number|null)[];
    ragweed_pollen: (number|null)[];
    olive_pollen: (number|null)[];
    mugwort_pollen: (number|null)[];
  };
}