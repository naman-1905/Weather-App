// IPLocation.js
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
    fetch('https://ip-api.com/json/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setLocation({
            city: data.city,
            country: data.country,
            lat: data.lat,
            lon: data.lon,
          });
        }
      })
      .catch(console.error);
  }, []);

  return location;
}

export default useIPLocation;
