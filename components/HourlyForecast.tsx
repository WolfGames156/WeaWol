import React from 'react';
import { getWeatherInfo } from '../utils/weatherUtils';
import { WeatherData } from '../types';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
  timezone: string;
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, timezone }) => {
    // We only want to show the next 24 hours from now.
    const now = new Date();
    const startIndex = data.time.findIndex(t => new Date(t) > now);

    if (startIndex === -1) {
        return <p className="text-center text-white/80">No future hourly data available.</p>;
    }
    const next24HoursTime = data.time.slice(startIndex, startIndex + 24);
    const next24HoursTemp = data.temperature_2m.slice(startIndex, startIndex + 24);
    const next24HoursCode = data.weather_code.slice(startIndex, startIndex + 24);


  return (
    <div className="overflow-x-auto -mx-1">
      <div className="flex space-x-4 p-1">
        {next24HoursTime.map((time, index) => {
          const { emoji } = getWeatherInfo(next24HoursCode[index]);
          const date = new Date(time);
          const hour = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: timezone });

          return (
            <div key={time} className="flex-shrink-0 flex flex-col items-center justify-between p-3 bg-white/10 rounded-lg w-24 h-32">
              <p className="text-sm font-medium">{hour}</p>
              <span className="text-3xl my-1">{emoji}</span>
              <p className="text-lg font-bold">{Math.round(next24HoursTemp[index])}°C</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
