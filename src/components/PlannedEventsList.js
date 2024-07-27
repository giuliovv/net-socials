// src/components/PlannedEventsList.js
"use client"

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { FaTrash } from 'react-icons/fa';

const PlannedEventsList = ({ refresh }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date();
      const eventsCollection = collection(firestore, 'events');
      const q = query(eventsCollection, where('date', '>=', Timestamp.fromDate(today)));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    fetchEvents();
  }, [refresh]);

  const deleteEvent = async (eventId) => {
    try {
      await deleteDoc(doc(firestore, 'events', eventId));
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event: ', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Planned Events</h2>
      {events.length > 0 ? (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="p-4 bg-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{event.location.name}</h3>
                <p className="text-sm">{new Date(event.date.seconds * 1000).toLocaleString()}</p>
                <p className="text-sm">Price: £{event.location.price}</p>
                <p className="text-sm">Capacity: {event.location.capacity}</p>
              </div>
              <button
                onClick={() => deleteEvent(event.id)}
                className="ml-4 p-2 text-red-500 hover:text-red-600"
                aria-label="Delete event"
              >
                <FaTrash size={20} />
              </button>
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
