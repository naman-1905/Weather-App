"use client";

import { useEffect, useState } from "react";
import useIPLocation from "../utils/IPLocation";
import { fetch24HHistory } from "../utils/fetch24HHistory";

function WeatherChart() {
  const location = useIPLocation();
  const [historicalData, setHistoricalData] = useState([]);
  const [chartDate, setChartDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.lat && location.lon) {
      const loadData = async () => {
        setLoading(true);
        const { chartDate, hourlyData } = await fetch24HHistory(location);
        setChartDate(chartDate);
        setHistoricalData(hourlyData);
        setLoading(false);
      };
      loadData();
    }
  }, [location]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-1 text-center text-white">
        Hourly History for {location.city || "your location"}
      </h2>
      <p className="text-md text-gray-300 text-center mb-4">{chartDate}</p>

      {loading && (
        <div className="text-white mt-4">Loading historical data...</div>
      )}

      {!loading && historicalData.length === 0 && (
        <div className="text-red-400 mt-4">
          Could not load historical weather data. The API plan may not include history, or data may be unavailable.
        </div>
      )}

      <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4">
        {historicalData.map((hour, index) => {
          const date = new Date(hour.time_epoch * 1000);
          const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return (
            <div
              key={index}
              className="flex-shrink-0 w-28 bg-[#1E1E1E] bg-opacity-50 rounded-lg p-4 text-center shadow-md text-white"
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
