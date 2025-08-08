"use client";

import React from 'react';
import { SunMedium, MapPin } from 'lucide-react';
import useIPLocation from './IPLocation';
import useWeather from './LocationTemp';
import useAQI from './AQI';

export default function Navbar() {
  const { city, country, lat, lon } = useIPLocation();
  const temperature = useWeather(lat, lon);
  const { aqi, category } = useAQI(lat, lon);

  // Format date like (Friday, January 4)
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <nav className="shadow-sm sticky top-0 bg-black w-full px-4 py-4 z-50">
      <div className="relative h-[80px] w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <SunMedium className="text-orange-300 h-12 w-12 md:h-16 md:w-16" />
          <h2 className="hidden md:flex text-white text-2xl font-bold whitespace-nowrap">
            Half Skirmish Weather App
          </h2>
          <h2 className="flex md:hidden text-white text-xl font-bold whitespace-nowrap">
            Weather
          </h2>
        </div>

        {/* Center Section — Location & Date */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-white" />
          <span className="font-bold">
            {city && country ? `${city}, ${country}` : country || 'Loading...'}
          </span>
          <span className="text-white font-bold">
            ({formattedDate})
          </span>
        </div>

        {/* Right Section — Weather & AQI */}
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
