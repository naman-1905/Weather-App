'use client'


import Navbar from "./components/Navbar"
import WeatherChart from "./components/24HData";
export default function Home() {

  return (
    <div>
       <Navbar/>
       <WeatherChart />
    </div>
  );
}
