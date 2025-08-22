"use client";

import { useEffect, useState } from "react";
import useIPLocation from "../utils/IPLocation";
import { fetch7DayHistory } from "../utils/fetch7DayHistory";

const DayCard = ({ dayData }) => {
  if (!dayData?.day) return null;

  const { date } = dayData;
  const { avgtemp_c, maxtemp_c, mintemp_c, condition } = dayData.day;

  const formattedDate = new Date(date).toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-[#121212] bg-opacity-60 border border-gray-900 rounded-lg p-4 text-center shadow-lg text-white flex flex-col justify-between h-full">
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

function SevenDayHistory() {
  const location = useIPLocation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location.lat || !location.lon) {
      setLoading(false);
      return;
    }

    const loadHistory = async () => {
      try {
        setLoading(true);
        const dailyData = await fetch7DayHistory(location);
        setHistoryData(dailyData);
      } catch (err) {
        console.error("Failed to fetch 7-day history:", err);
        setError(err.error?.message || "Could not load historical data.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [location]);

  return (
    <div className="p-6">
      {loading && <div className="text-white mt-4 text-center">Loading 7-day history...</div>}
      {error && (
        <div className="text-red-400 mt-4 bg-red-900 bg-opacity-50 p-4 rounded-lg">{error}</div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {historyData.map((day, index) => (
            <DayCard key={index} dayData={day} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SevenDayHistory;
