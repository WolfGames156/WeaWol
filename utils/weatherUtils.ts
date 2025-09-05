export interface WeatherInfo {
  emoji: string;
  description: string;
  recommendation: string;
  background: string;
}

const weatherMapping: Record<number, Omit<WeatherInfo, 'background'>> = {
  0: { emoji: '☀️', description: 'Clear sky', recommendation: 'Perfect day for outdoor activities!' },
  1: { emoji: '🌤️', description: 'Mainly clear', recommendation: 'Great day to be outside.' },
  2: { emoji: '🌥️', description: 'Partly cloudy', recommendation: 'A good day with some clouds.' },
  3: { emoji: '☁️', description: 'Overcast', recommendation: 'A bit gloomy, but still a decent day.' },
  45: { emoji: '🌫️', description: 'Fog', recommendation: 'Drive carefully, visibility is low.' },
  48: { emoji: '🌫️', description: 'Depositing rime fog', recommendation: 'Be cautious of slippery surfaces.' },
  51: { emoji: '💧', description: 'Light drizzle', recommendation: 'A light jacket might be useful.' },
  53: { emoji: '💧', description: 'Moderate drizzle', recommendation: 'Bring a light raincoat.' },
  55: { emoji: '💧', description: 'Dense drizzle', recommendation: 'An umbrella is a good idea.' },
  56: { emoji: '🥶', description: 'Light freezing drizzle', recommendation: 'Watch out for icy patches.' },
  57: { emoji: '🥶', description: 'Dense freezing drizzle', recommendation: 'Very slippery conditions, be careful!' },
  61: { emoji: '🌧️', description: 'Slight rain', recommendation: 'Don\'t forget your umbrella.' },
  63: { emoji: '🌧️', description: 'Moderate rain', recommendation: 'A good day to stay indoors.' },
  65: { emoji: '🌧️', description: 'Heavy rain', recommendation: 'Avoid going out if possible.' },
  66: { emoji: '🥶🌧️', description: 'Light freezing rain', recommendation: 'Be extremely careful of ice.' },
  67: { emoji: '🥶🌧️', description: 'Heavy freezing rain', recommendation: 'Hazardous conditions, stay safe.' },
  71: { emoji: '❄️', description: 'Slight snow fall', recommendation: 'Enjoy the gentle snow!' },
  73: { emoji: '❄️', description: 'Moderate snow fall', recommendation: 'Perfect for a snow day.' },
  75: { emoji: '❄️', description: 'Heavy snow fall', recommendation: 'Stay warm and cozy inside.' },
  77: { emoji: '❄️', description: 'Snow grains', recommendation: 'Light snow, dress warmly.' },
  80: { emoji: '🌦️', description: 'Slight rain showers', recommendation: 'You might see a rainbow!' },
  81: { emoji: '🌦️', description: 'Moderate rain showers', recommendation: 'Intermittent rain, keep an umbrella handy.' },
  82: { emoji: '⛈️', description: 'Violent rain showers', recommendation: 'Take shelter during the downpour.' },
  85: { emoji: '🌨️', description: 'Slight snow showers', recommendation: 'Light and fluffy snow showers.' },
  86: { emoji: '🌨️', description: 'Heavy snow showers', recommendation: 'Heavy snow, drive safely.' },
  95: { emoji: '⛈️', description: 'Thunderstorm', recommendation: 'Stay indoors and stay safe.' },
  96: { emoji: '⛈️', description: 'Thunderstorm with slight hail', recommendation: 'Possible hail, protect your vehicle.' },
  99: { emoji: '⛈️', description: 'Thunderstorm with heavy hail', recommendation: 'Severe weather, take cover.' },
};

const dayBackgrounds: Record<number, string> = {
  0: 'bg-gradient-to-br from-sky-400 to-blue-600',
  1: 'bg-gradient-to-br from-sky-300 to-blue-500',
  2: 'bg-gradient-to-br from-sky-400 via-gray-400 to-sky-600',
  3: 'bg-gradient-to-br from-gray-500 to-gray-700',
};

const nightBackgrounds: Record<number, string> = {
  0: 'bg-gradient-to-br from-gray-800 via-indigo-900 to-black',
  1: 'bg-gradient-to-br from-gray-700 via-indigo-800 to-black',
  2: 'bg-gradient-to-br from-gray-600 via-slate-800 to-black',
  3: 'bg-gradient-to-br from-slate-700 to-slate-900',
};

const defaultWeather = {
  emoji: '🤷',
  description: 'Unknown',
  recommendation: 'Check again later.',
};

const defaultBackground = 'bg-gradient-to-br from-gray-600 to-gray-800';

export const getWeatherInfo = (code: number | undefined, isDay: boolean = true): WeatherInfo => {
    if (code === undefined) {
        return { ...defaultWeather, background: defaultBackground };
    }

    const weather = weatherMapping[code] || defaultWeather;
    let background = defaultBackground;

    const codeGroup = Math.floor(code / 10);
    
    if (code <= 3) {
      background = isDay ? dayBackgrounds[code] : nightBackgrounds[code];
    } else if (codeGroup >= 4 && codeGroup < 7) { // Fog/Drizzle/Rain
      background = 'bg-gradient-to-br from-slate-400 to-slate-600';
    } else if (codeGroup >= 7 && codeGroup < 9) { // Snow/Showers
      background = 'bg-gradient-to-br from-blue-300 to-gray-500';
    } else if (codeGroup >= 9) { // Thunderstorm
      background = 'bg-gradient-to-br from-gray-700 via-purple-900 to-gray-900';
    }
    
    return { ...weather, background };
};