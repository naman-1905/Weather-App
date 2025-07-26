"use client";
import React from 'react';
import { SunMedium, MapPin, LocateFixed } from 'lucide-react';
import DateTimeDisplay from './DayDate';
import useIPLocation from './IPLocation';

export default function Navbar() {
  const { city, country } = useIPLocation();

  return (
    <nav className="shadow-sm sticky top-0 bg-white w-full px-4 py-4 z-50">
      <div className="relative h-[80px] w-full max-w-screen-xl mx-auto px-4 flex items-center justify-between">
        
        {/* LEFT: Logo + Sun */}
        <div className="absolute left-4 flex items-center gap-2">
          <h2 className="text-gray-600 text-2xl flex justify-start font-bold whitespace-nowrap">
            Half Skirmish Weather App
          </h2>
          <SunMedium className="text-orange-300 h-16 w-16" />
        </div>

        {/* CENTER: Date & Time */}
        <div className="mx-auto">
          <DateTimeDisplay />
        </div>

        {/* RIGHT: Location + Search */}
        <div className="absolute right-4 flex items-center gap-3">
          <MapPin className="text-black h-6 w-6" />
          <span className="text-black font-bold whitespace-nowrap">
            {city ? `${city}, ${country}` : country || 'Loading...'}
          </span>
        </div>
      </div>
    </nav>
  );
}
