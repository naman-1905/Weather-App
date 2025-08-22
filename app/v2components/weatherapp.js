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
  MapPin,
  Calendar,
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

export default function WeatherDashboard() {
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
    <div className="min-h-screen bg-[#0b132b] text-white flex items-center justify-center p-6">
      <div className="bg-[#1c2541] rounded-2xl shadow-lg w-full max-w-6xl grid grid-cols-1 md:grid-cols-3">
        
        {/* --- LEFT PANEL --- */}
        <div className="col-span-1 flex flex-col justify-between p-6 bg-[#1c2541] rounded-l-2xl">
          {leftPanelLoading ? (
            <Spinner size={50} />
          ) : (
            <>
              <div>
                <div className="text-lg font-semibold flex items-center justify-between">
                  <span>Weather App </span>
                  <span
                    className={`${getAqiColor(
                      aqi
                    )} text-xs px-2 py-1 rounded-2xl font-semibold`}
                  >
                    AQI {Math.round(aqi)}
                  </span>
                </div>

                <h1 className="text-8xl font-bold mt-6 tracking-tight">
                  {temp}°C
                </h1>
                <p className="text-xl mt-2">{location.city}</p>
                <p className="text-sm text-white">{location.country}</p>
              </div>

              {/* Humidity */}
              <div className="mt-6 text-lg text-white font-semibold flex items-center gap-2">
                <Droplet size={20} className="text-blue-300" />
                <span>Humidity: {humidity}%</span>
              </div>
            </>
          )}
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className="col-span-2 bg-[#0f172a] rounded-r-2xl p-6 flex flex-col">
          
          {/* Location + Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2 tracking-tight">
              <MapPin size={16} /> {location.city || "Loading..."}
            </h2>
            <p className="text-white text-lg flex items-center gap-2 tracking-tight">
              <Calendar size={14} /> <DateTimeDisplay />
            </p>
          </div>

          {/* --- 24 Hour Forecast --- */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-2">24-Hour Forecast</h2>
            {hourly.hourlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={hourly.hourlyData.map((h) => ({
                    time: new Date(h.time).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }),
                    temp: h.temp_c,
                  }))}
                  margin={{ top: 30, right: 40, left: 30, bottom: 30 }}
                >
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

                  <XAxis
                    dataKey="time"
                    stroke="#94a3b8"
                    interval={2}
                    padding={{ left: 16, right: 16 }}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    tickFormatter={(val) => `${val}°`}
                    domain={["dataMin - 2", "dataMax + 2"]}
                    padding={{ top: 20, bottom: 20 }}
                  />

                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", border: "none" }}
                    labelStyle={{ color: "#e2e8f0" }}
                    formatter={(value) => [`${value}°C`, "Temp"]}
                  />

                  {/* Gradient area highlight */}
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="none"
                    fill="url(#tempGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#38bdf8"
                    strokeWidth={2}
                    dot={{ fill: "#38bdf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[350px] flex items-center justify-center">
                <Spinner size={40} />
              </div>
            )}
          </div>

          {/* --- 7 Day Forecast --- */}
          <div>
            <h2 className="text-lg font-semibold mb-4">7-Day Forecast</h2>
            {history7d.length > 0 ? (
              <div className="grid grid-cols-7 gap-3">
                {history7d.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1c2541] rounded-xl px-3 py-4 text-center"
                  >
                    <p className="text-sm text-gray-300">
                      {new Date(day.date).toLocaleDateString([], {
                        weekday: "short",
                      })}
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
        {/* END RIGHT PANEL */}
      </div>
    </div>
  );
}
