// src/context/BookingsContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

const BookingsContext = createContext();

export const useBookings = () => {
  return useContext(BookingsContext);
};

export const BookingsProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [timeFrame, setTimeFrame] = useState('future');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(firestore, 'bookings');
        let q;

        if (timeFrame === 'future') {
          q = query(bookingsCollection, where('date', '>=', Timestamp.fromDate(new Date())));
        } else {
          const pastDate = new Date();
          pastDate.setMonth(pastDate.getMonth() - Number(timeFrame));
          q = query(bookingsCollection, where('date', '>=', Timestamp.fromDate(pastDate)));
        }

        const querySnapshot = await getDocs(q);
        const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsList);
      } catch (error) {
        console.error('Error fetching bookings: ', error);
      }
    };

    fetchBookings();
  }, [timeFrame]);

  const value = {
    bookings,
    timeFrame,
    setTimeFrame,
  };

  return (
    <BookingsContext.Provider value={value}>
      {children}
    </BookingsContext.Provider>
  );
};
