"use client";

import React from 'react';
import { SunMedium, MapPin, CloudIcon } from 'lucide-react';
import DateTimeDisplay from './DayDate';
import useIPLocation from './IPLocation';
import useWeather from './LocationTemp';
import useAQI from './AQI';

export default function Navbar() {
  const { city, country, lat, lon } = useIPLocation();
  const temperature = useWeather(lat, lon);
  const { aqi, category } = useAQI(lat, lon);

  return (
    <nav className="shadow-sm sticky top-0 bg-white w-full px-4 py-4 z-50">
      <div className="relative h-[80px] w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        
        {/* Weather Icon */}
        <div className="absolute left-4 flex items-center gap-2">
          <h2 className="text-gray-600 text-2xl flex justify-start font-bold whitespace-nowrap">
            Half Skirmish Weather App
          </h2>
          <SunMedium className="text-orange-300 h-16 w-16" />
        </div>

        <div className="mx-auto">
          <DateTimeDisplay />
        </div>

        <div className="absolute right-4 flex items-center gap-3">
          <MapPin className="text-black h-6 w-6" />
          
          <div className="flex flex-col">
            <span className="text-black font-bold whitespace-nowrap">
              {city ? `${city}, ${country}` : country || 'Loading...'}
            </span>

           <span className="font-semibold text-blue-500">
            Temperature: {temperature !== null ? `${temperature}°C` : 'Loading...'}
          </span>
          <span className="font-semibold text-green-600">
            AQI: {aqi !== null ? `${Math.round(aqi)} (${category})` : 'Loading...'}
          </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
