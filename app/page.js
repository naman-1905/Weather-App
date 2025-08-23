'use client';

import WeatherDashboard from "./v2components/weatherapp";
import WeatherDashboardMobile from "./v2components/weathermobile";

export default function Home() {
  return (
    <div>
      {/* Desktop Dashboard: hidden on small screens */}
      <div className="hidden sm:block">
        <WeatherDashboard />
      </div>

      {/* Mobile Dashboard: only visible on small screens */}
      <div className="block sm:hidden">
        <WeatherDashboardMobile />
      </div>
    </div>
  );
}
