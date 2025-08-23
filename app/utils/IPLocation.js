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
        const response = await fetch('https://ipapi.co/json/', {
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLocation({
          city: data.city,
          country: data.country_name,
          lat: data.latitude,
          lon: data.longitude,
        });
      } catch (error) {
        console.error('Error fetching location:', error);
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