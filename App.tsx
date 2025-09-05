import React, { useState, useEffect } from 'react';
import type { Location, WeatherData } from './types';
// FIX: Import 'searchCity' to make it available for use in the handleSearch function.
import { getWeatherData, getPollenData, searchCity } from './services/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetails from './components/WeatherDetails';
import Loader from './components/Loader';
import AnimatedBackground from './components/AnimatedBackground';
import DraggableCard from './components/DraggableCard';

const App: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userLocation: Location = {
          name: 'Current Location',
          latitude,
          longitude,
        };
        setLocation(userLocation);
        setSearchQuery('Current Location');
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        const defaultLocation: Location = { name: 'London', latitude: 51.5072, longitude: -0.1276 };
        setLocation(defaultLocation);
        setSearchQuery('London');
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    let isMounted = true;
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch weather and pollen data in parallel for efficiency
        const [weatherResult, pollenResult] = await Promise.all([
          getWeatherData(location.latitude, location.longitude),
          getPollenData(location.latitude, location.longitude)
        ]);

        if (isMounted) {
          // Combine the results into a single state object
          const combinedData: WeatherData = {
            ...weatherResult,
            pollen: pollenResult || undefined
          };
          setWeatherData(combinedData);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Data fetch error:", err);
          setError('Failed to fetch weather data. Please try again.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    loadAllData();
    
    return () => {
      isMounted = false;
    };
  }, [location]);

  const handleSearch = async (city: string) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setSearchQuery(city);
    try {
      const results = await searchCity(city);
      if (results.length > 0) {
        const firstResult = results[0];
        const newLocation: Location = {
          name: firstResult.name,
          latitude: firstResult.latitude,
          longitude: firstResult.longitude,
        };
        setLocation(newLocation);
      } else {
        setError(`Could not find city: ${city}`);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to search for city. Please check your connection.');
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen font-sans text-white`}>
      <AnimatedBackground weatherCode={weatherData?.current.weather_code} isDay={weatherData?.current.is_day === 1} />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
              <h1 className="text-xl font-bold">WeaWol</h1>
              <p className="text-xs text-white/60">By WolfGames</p>
          </div>
          <div className="w-full md:max-w-lg">
            <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
          </div>
        </div>
        
        {loading && <Loader />}
        
        {error && <p className="text-center text-red-400 bg-red-900/50 rounded-lg p-4 mt-8 max-w-md mx-auto">{error}</p>}
        
        {weatherData && location && !loading && !error && (
          <div className="mt-8 animate-fade-in">
            <CurrentWeather data={weatherData.current} locationName={location.name} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <DraggableCard title="Hourly Forecast">
                <HourlyForecast data={weatherData.hourly} timezone={weatherData.timezone} />
              </DraggableCard>
              
              <DraggableCard title="Weather Details">
                <WeatherDetails current={weatherData.current} pollen={weatherData.pollen} />
              </DraggableCard>

              <DraggableCard title="Daily Forecast" className="md:col-span-2 lg:col-span-1">
                <DailyForecast data={weatherData.daily} />
              </DraggableCard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;