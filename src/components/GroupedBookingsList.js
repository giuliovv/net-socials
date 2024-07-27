// components/GroupedBookingsList.js
"use client"

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';

const GroupedBookingsList = () => {
  const [groupedBookings, setGroupedBookings] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(firestore, 'bookings');
        const querySnapshot = await getDocs(bookingsCollection);
        const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const grouped = bookingsList.reduce((acc, booking) => {
          const date = new Date(booking.date.seconds * 1000).toLocaleDateString();
          if (!acc[date]) acc[date] = {};
          if (!acc[date][booking.locationName]) acc[date][booking.locationName] = [];
          acc[date][booking.locationName].push(booking);
          return acc;
        }, {});

        setGroupedBookings(grouped);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Registered People</h2>
      {Object.keys(groupedBookings).map(date => (
        <details key={date} className="mb-2">
          <summary className="cursor-pointer bg-gray-700 text-white p-2 rounded">{date}</summary>
          {Object.keys(groupedBookings[date]).map(location => (
            <details key={location} className="ml-4 mb-2">
              <summary className="cursor-pointer bg-gray-600 text-white p-2 rounded">{location}</summary>
              <ul className="ml-4 list-disc list-inside">
                {groupedBookings[date][location].map(booking => (
                  <li key={booking.id} className="text-white">
                    Name: {booking.person.name}, Level: {booking.person.level}
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