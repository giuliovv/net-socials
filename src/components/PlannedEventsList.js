// src/components/PlannedEventsList.js
"use client"

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useBookings } from '../context/BookingsContext';

const PlannedEventsList = ({ refresh }) => {
  const [events, setEvents] = useState([]);
  const { bookings } = useBookings();

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date();
      const eventsCollection = collection(firestore, 'events');
      const q = query(eventsCollection, where('date', '>=', Timestamp.fromDate(today)));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const eventsWithBookingCount = eventsList.map((event) => {
        const bookingCount = bookings.filter(booking => booking.locationId === event.location.id).length;
        return {
          ...event,
          bookingCount,
        };
      });

      setEvents(eventsWithBookingCount);
    };

    fetchEvents();
  }, [bookings, refresh]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Planned Events</h2>
      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="p-4 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold">{event.location.name}</h3>
              <p className="text-sm">{new Date(event.date.seconds * 1000).toLocaleString()}</p>
              <p className="text-sm">Price: £{event.location.price}</p>
              <p className="text-sm">Capacity: {event.location.capacity}</p>
              <p className="text-sm">Booked: {event.bookingCount}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events planned at the moment.</p>
      )}
    </div>
  );
};

export default PlannedEventsList;
