'use client'


import Navbar from "./components/Navbar"
import WeatherChart from "./components/24HData";
import SixDayHistory from "./components/6DayHistory";
import WeatherSummary from "./components/WeatherSummary";
export default function Home() {

  return (
    <div>
       <Navbar/>
       <WeatherSummary/>
       <WeatherChart />
       <SixDayHistory />
    </div>
  );
}
