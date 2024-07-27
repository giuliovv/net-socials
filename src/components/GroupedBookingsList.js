// src/components/GroupedBookingsList.js
"use client"

import { useEffect, useState } from 'react';
import { useBookings } from '../context/BookingsContext';

const GroupedBookingsList = () => {
  const { bookings, timeFrame, setTimeFrame } = useBookings();
  const [groupedBookings, setGroupedBookings] = useState({});

  useEffect(() => {
    const groupBookings = (bookingsList) => {
      const grouped = bookingsList.reduce((acc, booking) => {
        const date = new Date(booking.date.seconds * 1000).toLocaleDateString();
        if (!acc[date]) acc[date] = {};
        if (!acc[date][booking.locationName]) acc[date][booking.locationName] = [];
        acc[date][booking.locationName].push(booking);
        return acc;
      }, {});
      setGroupedBookings(grouped);
    };

    groupBookings(bookings);
  }, [bookings]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registered People</h2>
      <div className="mb-4">
        <label className="block text-white mb-2">Show Bookings:</label>
        <select
          value={timeFrame}
          onChange={handleTimeFrameChange}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="future">Future Bookings</option>
          <option value="1">Last 1 Month</option>
          <option value="3">Last 3 Months</option>
          <option value="6">Last 6 Months</option>
          <option value="12">Last 12 Months</option>
        </select>
      </div>
      {Object.keys(groupedBookings).map(date => (
        <details key={date} className="mb-2">
          <summary className="cursor-pointer bg-gray-700 text-white p-2 rounded">{date}</summary>
          {Object.keys(groupedBookings[date]).map(location => (
            <details key={location} className="ml-4 mb-2">
              <summary className="cursor-pointer bg-gray-600 text-white p-2 rounded">{location}</summary>
              <ul className="ml-4 list-disc list-inside">
                {groupedBookings[date][location].map(booking => (
                  <li key={booking.id} className="text-white">
                    {booking.person.name} | {booking.person.level}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </details>
      ))}
    </div>
  );
};

export default GroupedBookingsList;
