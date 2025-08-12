// components/LocationTemp.js
"use client";

import { useEffect, useState } from 'react';

export default function useWeather(lat, lon) {
  const [weather, setWeather] = useState({ temp: null, humidity: null });

  useEffect(() => {
    if (!lat || !lon) return;

    // REMOVED: No longer need the API key on the client
    // const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

    const fetchWeather = async () => {
      try {
        // UPDATED: The fetch URL now points to our proxy
        const response = await fetch(
          `/api/weather?endpoint=current.json&q=${lat},${lon}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }

        const data = await response.json();

        setWeather({
          temp: data?.current?.temp_c ?? null,
          humidity: data?.current?.humidity ?? null
        });

      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return weather;
}
