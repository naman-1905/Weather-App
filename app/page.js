'use client'


import Navbar from "./components/Navbar"
import WeatherChart from "./components/24HData";
import SixDayHistory from "./components/6DayHistory";
export default function Home() {

  return (
    <div>
       <Navbar/>
       <WeatherChart />
       <SixDayHistory />
    </div>
  );
}
