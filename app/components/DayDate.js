'use client';

import React, { useEffect, useState } from 'react';

function DateTimeDisplay() {
  const [dateTime, setDateTime] = useState(null);

  useEffect(() => {
    setDateTime(new Date());

    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!dateTime) return null;

  const day = dateTime.toLocaleDateString('en-US', { weekday: 'long' });
  const date = dateTime.toLocaleDateString('en-US'); // fix locale explicitly
  const time = dateTime.toLocaleTimeString('en-US'); // fix locale explicitly

  return (
    <span className="text-gray-700 text-lg items-center flex flex-col gap-1">
      <span><strong>Day:</strong> {day}</span>
      <span><strong>Date:</strong> {date}</span>
      <span><strong>Time:</strong> {time}</span>
    </span>
  );
}

export default DateTimeDisplay;
