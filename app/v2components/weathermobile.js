"use client";

import { useEffect, useState } from "react";
import useIPLocation from "../utils/IPLocation";
import useWeather from "../utils/LocationTemp";
import useAQI from "../utils/AQI";
import { fetch24HHistory } from "../utils/fetch24HHistory";
import { fetch7DayHistory } from "../utils/fetch7DayHistory";
import DateTimeDisplay from "../utils/DayDate";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Droplet,
  Loader2,
} from "lucide-react";

// --- Spinner Component ---
function Spinner({ size = 40 }) {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader2 className="animate-spin text-gray-300" size={size} />
    </div>
  );
}

// --- Weather Icon Mapper ---
function getWeatherIcon(condition) {
  const text = condition.toLowerCase();
  if (text.includes("sun") || text.includes("clear"))
    return <Sun className="mx-auto text-yellow-400" size={20} />;
  if (text.includes("cloud"))
    return <Cloud className="mx-auto text-gray-400" size={20} />;
  if (text.includes("rain") || text.includes("shower"))
    return <CloudRain className="mx-auto text-blue-400" size={20} />;
  if (text.includes("partly"))
    return <CloudSun className="mx-auto text-orange-300" size={20} />;
  return <Cloud className="mx-auto text-gray-400" size={20} />;
}

// --- AQI Badge Color ---
function getAqiColor(aqi) {
  if (aqi <= 50) return "bg-green-600";
  if (aqi <= 100) return "bg-yellow-500";
  if (aqi <= 150) return "bg-orange-500";
  if (aqi <= 200) return "bg-red-500";
  if (aqi <= 300) return "bg-purple-500";
  return "bg-rose-700";
}

export default function WeatherDashboardMobile() {
  const location = useIPLocation();
  const { temp, humidity } = useWeather(location.lat, location.lon);
  const { aqi } = useAQI(location.lat, location.lon);

  const [hourly, setHourly] = useState({ chartDate: "", hourlyData: [] });
  const [history7d, setHistory7d] = useState([]);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetch24HHistory(location).then(setHourly);
      fetch7DayHistory(location).then(setHistory7d);
    }
  }, [location.lat, location.lon]);

  const leftPanelLoading =
    !location.city || temp === null || humidity === null || !aqi;

  return (
    <div className="min-h-screen bg-[#0b132b] text-white p-4 space-y-6">
      
      {/* --- LEFT PANEL --- */}
      <div className="bg-[#1c2541] rounded-2xl p-6 shadow-lg">
        {leftPanelLoading ? (
          <Spinner size={50} />
        ) : (
          <>
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold flex items-center justify-center gap-2">
                <span>Weather App</span>
                <span
                  className={`${getAqiColor(aqi)} text-xs px-2 py-1 rounded-2xl font-semibold`}
                >
                  AQI {Math.round(aqi)}
                </span>
              </div>

              <h1 className="text-6xl font-bold mt-6 tracking-tight text-center">
                {temp}°C
              </h1>

              <p className="text-xl mt-2 text-center">{location.city}</p>
              <p className="text-sm text-white text-center">{location.country}</p>
            </div>

            <div className="mt-6 text-lg text-white font-semibold flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Droplet size={20} className="text-blue-300" />
                <span>Humidity: {humidity}%</span>
              </div>
            </div>
          </>
        )}
      </div>

        {/* --- 24-HOUR FORECAST BOXES --- */}
        <div className="bg-[#0f172a] rounded-2xl p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-center">24-Hour Forecast</h2>
        {hourly.hourlyData.length > 0 ? (
            <div className="flex overflow-x-auto gap-4 py-2">
            {hourly.hourlyData.map((h, idx) => (
                <div
                key={idx}
                className="flex-shrink-0 w-28 bg-[#1c2541] rounded-xl p-3 text-center"
                >
                <p className="text-sm text-gray-300 font-medium">
                    {new Date(h.time).toLocaleTimeString([], { hour: "numeric", hour12: true })}
                </p>
                {getWeatherIcon(h.condition?.text || "")}
                <p className="text-lg font-bold mt-2">{h.temp_c}°</p>
                </div>
            ))}
            </div>
        ) : (
            <div className="h-[150px] flex items-center justify-center">
            <Spinner size={40} />
            </div>
        )}
        </div>



      {/* --- 7-DAY FORECAST --- */}
      <div className="bg-[#1c2541] rounded-2xl p-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">7-Day Forecast</h2>
        {history7d.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {history7d.map((day, idx) => (
              <div
                key={idx}
                className="bg-[#0f172a] rounded-xl px-3 py-4 text-center"
              >
                <p className="text-sm text-gray-300">
                  {new Date(day.date).toLocaleDateString([], { weekday: "short" })}
                </p>
                {getWeatherIcon(day.day.condition.text)}
                <p className="text-lg font-bold mt-1">{day.day.avgtemp_c}°</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[120px] flex items-center justify-center">
            <Spinner size={30} />
          </div>
        )}
      </div>
    </div>
  );
}
