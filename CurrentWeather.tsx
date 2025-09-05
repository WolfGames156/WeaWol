import React from 'react';
import { getWeatherInfo } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  data: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
  locationName: string;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, locationName }) => {
  const { emoji, description, recommendation } = getWeatherInfo(data.weather_code, data.is_day === 1);
  const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });

  return (
    <div className="text-center p-6 rounded-lg animate-fade-in-down">
      <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-lg">{locationName}</h1>
      <p className="text-lg text-white/80 mt-1">{today}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
        <span className="text-7xl sm:text-8xl drop-shadow-lg">{emoji}</span>
        <div>
            <p className="text-7xl sm:text-8xl font-bold drop-shadow-lg">{Math.round(data.temperature_2m)}°C</p>
            <p className="text-2xl text-white/90 capitalize drop-shadow-md">{description}</p>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4 mt-4">
        <p className="text-lg italic">"{recommendation}"</p>
      </div>
    </div>
  );
};

export default CurrentWeather;