// components/SixDayHistory.js
"use client";

import { useEffect, useState } from "react";
import useIPLocation from "./IPLocation"; // Assuming this hook provides { lat, lon, city, country }

// A smaller component to render the card for a single day's history
const DayCard = ({ dayData }) => {
  if (!dayData || !dayData.day) {
    return null; // Don't render if data is incomplete
  }

  const { date } = dayData;
  const { avgtemp_c, maxtemp_c, mintemp_c, condition } = dayData.day;

  const formattedDate = new Date(date).toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 bg-opacity-60 border border-gray-600 rounded-lg p-4 text-center shadow-lg text-white flex flex-col justify-between h-full">
      <div>
        <p className="font-bold text-md">{formattedDate}</p>
        <img src={condition.icon} alt={condition.text} className="mx-auto my-2 h-16 w-16" />
        <p className="text-2xl font-bold mb-2">{Math.round(avgtemp_c)}°C</p>
      </div>
      <div>
        <p className="text-sm text-gray-300">{condition.text}</p>
        <p className="text-xs text-gray-400 mt-1">
          H: {Math.round(maxtemp_c)}° / L: {Math.round(mintemp_c)}°
        </p>
      </div>
    </div>
  );
};


function SixDayHistory() {
  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;
  const location = useIPLocation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't run if we don't have the required info
    if (!location.lat || !location.lon || !API_KEY) {
      setLoading(false);
      return;
    }

    const fetch6DayHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const datePromises = [];
        // Loop to create fetch promises for the last 6 days
        for (let i = 1; i <= 6; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split("T")[0];
          
          const promise = fetch(
            `https://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${location.lat},${location.lon}&dt=${dateString}`
          ).then(res => {
            if (!res.ok) {
              // If a single request fails, throw an error to be caught by Promise.all
              return res.json().then(err => Promise.reject(err));
            }
            return res.json();
          });
          datePromises.push(promise);
        }

        // Wait for all 6 API calls to complete
        const results = await Promise.all(datePromises);
        
        // Extract the relevant forecast day data from each result
        const dailyData = results.map(result => result.forecast.forecastday[0]);
        setHistoryData(dailyData);

      } catch (err) {
        console.error("Failed to fetch 6-day history:", err);
        setError(err.error?.message || "Could not load historical data. Your API plan may not support this feature.");
      } finally {
        setLoading(false);
      }
    };

    fetch6DayHistory();
  }, [location, API_KEY]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">
        Last 6 Days History for {location.city || 'your location'}
      </h2>

      {loading && (
        <div className="text-white mt-4 text-center">Loading 6-day history...</div>
      )}

      {error && (
        <div className="text-red-400 mt-4 bg-red-900 bg-opacity-50 p-4 rounded-lg">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {historyData.map((day, index) => (
            <DayCard key={index} dayData={day} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SixDayHistory;
