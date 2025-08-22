"use client";

import React from 'react';
import { SunMedium, Cloud, CloudRain, Snowflake, MapPin } from 'lucide-react';
import useIPLocation from '../utils/IPLocation';
import useWeather from './LocationTemp';
import useAQI from './AQI';

export default function Navbar() {
  const { city, country, lat, lon } = useIPLocation();
  const temperature = useWeather(lat, lon);
  const { aqi, category } = useAQI(lat, lon);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const getWeatherIcon = () => {
    if (temperature === null) return <Cloud className="text-gray-300 h-8 w-8" />;
    if (temperature >= 30) return <SunMedium className="text-orange-400 h-8 w-8" />;
    if (temperature >= 20) return <Cloud className="text-blue-300 h-8 w-8" />;
    if (temperature >= 5) return <CloudRain className="text-blue-500 h-8 w-8" />;
    return <Snowflake className="text-cyan-300 h-8 w-8" />;
  };

  return (
    <nav className="shadow-sm sticky top-0 bg-black w-full px-4 py-4 z-50">
      <div className="relative h-[80px] w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-2">
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {getWeatherIcon()}
            <h2 className="text-white text-2xl font-bold whitespace-nowrap">
              Half Skirmish Weather App
            </h2>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            {getWeatherIcon()}
            <h2 className="text-white text-lg font-bold whitespace-nowrap">
              Weather App
            </h2>
          </div>
        </div>

        {/* Center Section — Location & Date (hidden on mobile) */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-white" />
          <span className="font-bold">
            {city && country ? `${city}, ${country}` : country || 'Loading...'}
          </span>
          <span className="text-white font-bold">
            ({formattedDate})
          </span>
        </div>

        {/* Right Section — AQI (always visible) */}
        <div className="flex items-center gap-3">
          {aqi !== null ? (
            <span
              className={`
                px-3 py-1 rounded-full font-semibold border
                ${
                  category === 'Good'
                    ? 'border-green-500 border-2 text-white'
                    : category === 'Moderate'
                    ? 'border-yellow-500 border-2 text-white'
                    : category === 'Unhealthy'
                    ? 'border-red-500 border-2 text-white'
                    : 'border-gray-500 border-2 text-white'
                }
              `}
            >
              AQI: {Math.round(aqi)} ({category})
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full border border-gray-400 text-gray-400 font-semibold">
              Loading...
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
