// components/AQI.js
"use client";

import { useEffect, useState } from 'react';

export default function useAQI(lat, lon) {
  const [aqi, setAqi] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    // REMOVED: No longer need the API key on the client
    // const apiKey = process.env.NEXT_PUBLIC_WEATHER_KEY;

    const fetchAQI = async () => {
      try {
        // UPDATED: The fetch URL now points to our proxy and includes the 'aqi=yes' param
        const response = await fetch(
          `/api/weather?endpoint=current.json&q=${lat},${lon}&aqi=yes`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }

        const data = await response.json();

        const pm2_5 = data.current.air_quality.pm2_5;
        setAqi(pm2_5);
        setCategory(mapAQICategory(pm2_5));

      } catch (err) {
        console.error("Failed to fetch AQI:", err);
      }
    };

    fetchAQI();
  }, [lat, lon]);

  return { aqi, category };
}

function mapAQICategory(pm) {
  if (pm <= 12) return "Good";
  if (pm <= 35.4) return "Moderate";
  if (pm <= 55.4) return "Unhealthy (Sensitive)";
  if (pm <= 150.4) return "Unhealthy";
  if (pm <= 250.4) return "Very Unhealthy";
  return "Hazardous";
}
