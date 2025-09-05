import React from 'react';
import { getWeatherInfo } from '../utils/weatherUtils';

interface AnimatedBackgroundProps {
    weatherCode: number | undefined;
    isDay: boolean | undefined;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ weatherCode, isDay }) => {
    const { background } = getWeatherInfo(weatherCode, isDay);

    return (
        <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${background}`} />
    );
};

export default AnimatedBackground;
