"use client";

import { useEffect, useState } from 'react';

function useIPLocation() {
  const [location, setLocation] = useState({ city: '', country: '' });

  useEffect(() => {
    fetch('http://ip-api.com/json/')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setLocation({ city: data.city, country: data.country });
        }
      })
      .catch(console.error);
  }, []);

  return location;
}

export default useIPLocation;
