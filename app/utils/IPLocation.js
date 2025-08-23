"use client";

import { useEffect, useState } from 'react';

function useIPLocation() {
  const [location, setLocation] = useState({
    city: '',
    country: '',
    lat: null,
    lon: null,
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ip-api.com/json/', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Weather-App' // Identify your application
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setLocation({
            city: data.city,
            country: data.country,
            lat: data.lat,
            lon: data.lon,
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        // Fallback to a default location or show error state
        setLocation({
          city: 'Unknown',
          country: 'Unknown',
          lat: null,
          lon: null,
        });
      }
    };

    fetchLocation();
  }, []);

  return location;
}

export default useIPLocation;