"use client";

import React from "react";
import useIPLocation from "./IPLocation";
import useWeather from "./LocationTemp"; // updated to return both temp & humidity

export default function WeatherSummary() {
  const { city, country, lat, lon } = useIPLocation();
  const { temp, humidity } = useWeather(lat, lon);

  return (
    <div className="w-full px-4 mt-4">
      <div className="w-full bg-gray-900 rounded-2xl p-6 flex flex-col items-center text-white">
        {/* Temperature */}
        <span className="text-6xl font-bold">
          {temp !== null ? `${Math.round(temp)}°C` : "..."}
        </span>

        {/* Location */}
        <span className="text-lg font-medium mt-2">
          {city && country ? `${city}, ${country}` : "Loading location..."}
        </span>

        {/* Humidity */}
        <span className="text-sm font-light mt-1">
          Humidity: {humidity !== null ? `${humidity}%` : "..."}
        </span>
      </div>
    </div>
  );
}
