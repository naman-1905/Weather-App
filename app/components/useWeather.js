// useWeather.js

"use client";

import { useEffect, useState } from 'react';

export default function useWeather(lat, lon) {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        setTemperature(data.main.temp);
      } catch (err) {
        console.error("Failed to fetch temperature:", err);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return temperature;
}
