// components/WeatherChart.js
"use client";

import { useEffect, useState } from "react";
import useIPLocation from "./IPLocation"; // Assuming this hook provides { lat, lon, city, country }

function WeatherChart() {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;
  const location = useIPLocation();
  const [historicalData, setHistoricalData] = useState([]);
  const [chartDate, setChartDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.lat && location.lon && API_KEY) {
      const fetchHistory = async () => {
        try {
          // 1. Get yesterday's date in YYYY-MM-DD format for the history API
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(today.getDate() - 1);
          const dateString = yesterday.toISOString().split("T")[0];
          setChartDate(yesterday.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

          // 2. Construct the history API URL for WeatherAPI.com
          const res = await fetch(
            `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${location.lat},${location.lon}&dt=${dateString}`
          );

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error.message || "Failed to fetch data");
          }

          const data = await res.json();
          
          // 3. Extract hourly data from the new structure: data.forecast.forecastday[0].hour
          if (data && data.forecast && data.forecast.forecastday && data.forecast.forecastday[0]) {
            setHistoricalData(data.forecast.forecastday[0].hour);
          } else {
            console.error("Unexpected API response structure:", data);
            setHistoricalData([]); // Ensure it's an empty array on failure
          }

        } catch (error) {
          console.error("Weather API error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [location, API_KEY]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-1 text-white">
        Hourly History for {location.city || 'your location'}
      </h2>
      <p className="text-md text-gray-300 mb-4">{chartDate}</p>

      {loading && (
        <div className="text-white mt-4">Loading historical data...</div>
      )}

      {!loading && historicalData.length === 0 && (
        <div className="text-red-400 mt-4">Could not load historical weather data. The API plan may not include history, or data may be unavailable.</div>
      )}

      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
        {historicalData.map((hour, index) => {
          // 4. Use the correct fields from the new API response
          const date = new Date(hour.time_epoch * 1000);
          const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
            key={index}
            className="flex-shrink-0 w-28 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg p-4 text-center shadow-md text-white"
          >
              <div className="font-semibold text-sm">{time}</div>
              <img src={hour.condition.icon} alt={hour.condition.text} className="mx-auto my-1" />
              <div className="text-lg font-bold">{Math.round(hour.temp_c)}°C</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherChart;