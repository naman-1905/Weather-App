'use client'


import Navbar from "./components/Navbar"
import WeatherChart from "./components/24HData";
import WeatherSummary from "./components/WeatherSummary";
import SevenDayHistory from "./components/7DayHistory";
export default function Home() {

  return (
    <div>
       <Navbar/>
       <WeatherSummary/>
       <WeatherChart />
       <SevenDayHistory/>
    </div>
  );
}
