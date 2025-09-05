import React from 'react';
import { getWeatherInfo } from '../utils/weatherUtils';
import { WeatherData } from '../types';

interface DailyForecastProps {
  data: WeatherData['daily'];
}

const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.time.map((day, index) => {
        if (index === 0) return null; // Skip today, it's shown in current weather
        
        const { emoji } = getWeatherInfo(data.weather_code[index]);
        const date = new Date(day);
        // The API provides dates in UTC. We convert to local time for the correct day name.
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
        
        return (
          <div key={day} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
            <p className="font-medium w-1/3">{dayName}</p>
            <span className="text-2xl">{emoji}</span>
            <p className="font-light text-right w-1/3">
              <span className="font-semibold">{Math.round(data.temperature_2m_max[index])}°</span>
              <span className="text-white/70"> / {Math.round(data.temperature_2m_min[index])}°</span>
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DailyForecast;
