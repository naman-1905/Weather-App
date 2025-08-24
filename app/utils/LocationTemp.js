// components/LocationTemp.js
"use client";

import { useEffect, useState } from 'react';

export default function useWeather(lat, lon) {
  const [weather, setWeather] = useState({ temp: null, humidity: null });

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=7a559a0e1aec4d6cbc8143504250708&q=${lat},${lon}`
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
}
