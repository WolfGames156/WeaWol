import type { GeocodingResult, WeatherData } from '../types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const searchCity = async (cityName: string): Promise<GeocodingResult[]> => {
  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`);
  if (!response.ok) {
    throw new Error('Failed to fetch city data');
  }
  const data = await response.json();
  return data.results || [];
};

// Fetches only the core weather data
export const getWeatherData = async (latitude: number, longitude: number): Promise<Omit<WeatherData, 'pollen'>> => {
    const params = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m',
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
    };
    
    const url = new URL(WEATHER_API_URL);
    Object.keys(params).forEach(key => url.searchParams.append(key, (params as any)[key]));

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
};

// Fetches only pollen data and fails gracefully
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const getPollenData = async (
  latitude: number,
    longitude: number
    ): Promise<WeatherData['pollen'] | null> => {
      const pollenVars = [
          'alder_pollen',
              'birch_pollen',
                  'grass_pollen',
                      'mugwort_pollen',
                          'olive_pollen',
                              'ragweed_pollen',
                                ].join(',');

                                  const params = {
                                      latitude: latitude.toString(),
                                          longitude: longitude.toString(),
                                              hourly: pollenVars,
                                                  timezone: 'auto',
                                                    };

                                                      try {
                                                          const url = new URL(AIR_QUALITY_API_URL);
                                                              Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

                                                                  const response = await fetch(url.toString());
                                                                      if (!response.ok) {
                                                                            console.error('Pollen API failed status:', response.status);
                                                                                  return null;
                                                                                      }

                                                                                          const data = await response.json();
                                                                                              console.log('Pollen API raw response:', data);

                                                                                                  if (data.hourly && data.hourly.time) {
                                                                                                        return data.hourly;
                                                                                                            }
                                                                                                                return null;

                                                                                                                  } catch (error) {
                                                                                                                      console.error('Failed to fetch pollen data:', error);
                                                                                                                          return null;
                                                                                                                            }
                                                                                                                            };