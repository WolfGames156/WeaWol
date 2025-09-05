import React from 'react';
import { WeatherData } from '../types';

interface WeatherDetailsProps {
  current: WeatherData['current'];
  pollen: WeatherData['pollen'];
}

const DetailItem: React.FC<{ icon: string; label: string; value: string | number; unit: string }> = ({ icon, label, value, unit }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg text-center h-full">
        <i className={`fas ${icon} fa-2x text-sky-300 mb-2`}></i>
        <p className="text-sm text-white/80">{label}</p>
        <p className="text-xl font-bold">{value}<span className="text-sm font-normal">{unit}</span></p>
    </div>
);


const PollenCircle: React.FC<{ name: string; value: number; icon: string; }> = ({ name, value, icon }) => {
    // Convert raw API value to a 0-4 score and determine level/color.
    let level = 'None';
    let score = 0;
    let colorClass = 'stroke-gray-500'; 
    
    if (value > 75) {
        level = 'Very High';
        score = 4;
        colorClass = 'stroke-red-500';
    } else if (value > 30) {
        level = 'High';
        score = 3;
        colorClass = 'stroke-orange-400';
    } else if (value > 10) {
        level = 'Moderate';
        score = 2;
        colorClass = 'stroke-yellow-400';
    } else if (value > 0) { 
        level = 'Low';
        score = 1;
        colorClass = 'stroke-green-500';
    }

    // Calculate circumference and progress based on the 0-4 score.
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 4) * 100; // e.g., score 2 is 50% progress
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center p-3 bg-white/10 rounded-lg text-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 70 70">
                    <circle
                        className="text-white/10"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="35"
                        cy="35"
                    />
                    <circle
                        className={`${colorClass} transition-all duration-500`}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="35"
                        cy="35"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <i className={`fas ${icon} text-xl`}></i>
                    <span className="text-lg font-bold mt-1">{`${score}/4`}</span>
                </div>
            </div>
            <p className="text-sm font-semibold mt-2">{name}</p>
            <p className="text-xs text-white/70">{level}</p>
        </div>
    );
};


const WeatherDetails: React.FC<WeatherDetailsProps> = ({ current, pollen }) => {

  const getAggregatedPollenData = () => {
    if (!pollen || !pollen.time || pollen.time.length === 0) {
      // Always return the three categories, even with 0 value
      return [
        { name: 'Tree', icon: 'fa-tree', value: 0 },
        { name: 'Grass', icon: 'fa-spa', value: 0 },
        { name: 'Weed', icon: 'fa-leaf', value: 0 }
      ];
    }

    const now = new Date();
    let currentIndex = pollen.time.findIndex(t => new Date(t) > now);
    if (currentIndex === -1) currentIndex = pollen.time.length - 1;
    else if (currentIndex > 0) currentIndex -= 1;
    
    if (currentIndex < 0) currentIndex = 0;

    const getValue = (key: keyof typeof pollen) => {
        const value = pollen[key]?.[currentIndex];
        return typeof value === 'number' ? value : 0;
    }

    const categories = [
        {
            name: 'Tree',
            icon: 'fa-tree',
            value: getValue('birch_pollen') + getValue('alder_pollen') + getValue('olive_pollen'),
        },
        {
            name: 'Grass',
            icon: 'fa-spa',
            value: getValue('grass_pollen'),
        },
        {
            name: 'Weed',
            icon: 'fa-leaf',
            value: getValue('ragweed_pollen') + getValue('mugwort_pollen'),
        }
    ];
    
    return categories;
  };

  const aggregatedPollenData = getAggregatedPollenData();

  return (
    <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
            <DetailItem icon="fa-thermometer-half" label="Feels Like" value={Math.round(current.apparent_temperature)} unit="°C" />
            <DetailItem icon="fa-tint" label="Humidity" value={current.relative_humidity_2m} unit="%" />
            <DetailItem icon="fa-wind" label="Wind Speed" value={Math.round(current.wind_speed_10m)} unit=" km/h" />
            <DetailItem icon="fa-compress-arrows-alt" label="Pressure" value={Math.round(current.pressure_msl)} unit=" hPa" />
        </div>
        
        {aggregatedPollenData.length > 0 ? (
            <div>
                 <h3 className="text-md font-bold text-white/80 mb-3 text-center">Pollen Levels</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {aggregatedPollenData.map(p => (
                        <PollenCircle key={p.name} name={p.name} value={p.value} icon={p.icon} />
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-lg text-center h-full">
                <i className="fas fa-seedling fa-2x text-gray-400 mb-2"></i>
                <p className="text-sm text-white/80">Pollen</p>
                <p className="text-xl font-bold">No Data Available</p>
            </div>
        )}
    </div>
  );
};

export default WeatherDetails;