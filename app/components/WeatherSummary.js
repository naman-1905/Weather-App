"use client";

import React from "react";
import useIPLocation from "../utils/IPLocation";
import useWeather from "./LocationTemp"; // updated to return temp, humidity, wind

export default function WeatherSummary() {
  const { city, country, lat, lon } = useIPLocation();
  const { temp, humidity } = useWeather(lat, lon);

  return (
    <div className="flex justify-center px-4 mt-4">
      <div className="w-full max-w-sm bg-[#1E1E1E] rounded-2xl p-6 flex flex-col items-center text-[#E0E0E0]">
        
        {/* Temperature */}
        <span className="text-6xl font-bold">
          {temp !== null ? `${Math.round(temp)}°C` : "..."}
        </span>

        {/* Location */}
        <span className="text-lg font-medium mt-2 text-[#A0A0A0]">
          {city && country ? `${city}, ${country}` : "Loading location..."}
        </span>

        {/* Humidity */}
        <span className="text-sm font-light mt-1 text-[#A0A0A0]">
          Humidity: {humidity !== null ? `${humidity}%` : "..."}
        </span>
      </div>
    </div>
  );
}
