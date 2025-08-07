// useWeather.js

"use client";

import { useEffect, useState } from 'react';

export default function useWeather(lat, lon) {
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    // Don't fetch if latitude or longitude are not available
    if (!lat || !lon) return;

    // Ensure your API key is in the .env.local file
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;
    if (!apiKey) {
      console.error("Weather API key is not set.");
      return;
    }

    const fetchWeather = async () => {
      try {
        // Construct the URL for WeatherAPI.com
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
        );

        if (!response.ok) {
          // Handle API errors (e.g., invalid key, bad request)
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }

        const data = await response.json();
        
        // Update the state with the temperature from the new data structure
        setTemperature(data.current.temp_c); 

      } catch (err) {
        console.error("Failed to fetch temperature:", err);
      }
    };

    fetchWeather();
  }, [lat, lon]); // Re-run the effect if lat or lon changes

  return temperature;
}