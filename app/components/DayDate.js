'use client';

import React, { useEffect, useState } from 'react';

function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {

    
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options = { weekday: 'long' };
  const day = dateTime.toLocaleDateString(undefined, options);
  const date = dateTime.toLocaleDateString(); 
  const time = dateTime.toLocaleTimeString(); 

  return (
    <span className="text-gray-700 text-lg items-center flex flex-col gap-1">
      <span><strong>Day:</strong> {day}</span>
      <span><strong>Date:</strong> {date}</span>
      <span><strong>Time:</strong> {time}</span>
    </span>
  );
}

export default DateTimeDisplay;
