// components/AQI.js
"use client";

import { useEffect, useState } from 'react';

export default function useAQI(lat, lon) {
  const [aqi, setAqi] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchAQI = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=7a559a0e1aec4d6cbc8143504250708&q=${lat},${lon}&aqi=yes`
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
  if (pm <= 150.4) return "Unhealthy";
  if (pm <= 250.4) return "Very Unhealthy";
  return "Hazardous";
}
