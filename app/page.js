'use client'


import Navbar from "./components/Navbar"
import WeatherChart from "./components/WeatherChart";
export default function Home() {

  return (
    <div>
       <Navbar/>
       <WeatherChart />
    </div>
  );
}
