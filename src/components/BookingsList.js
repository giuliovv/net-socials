// components/BookingsList.js
"use client"

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsCollection = collection(firestore, "bookings");
        const querySnapshot = await getDocs(bookingsCollection);
        const bookingsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsList);
      } catch (error) {
        console.error("Error fetching bookings: ", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h2>Registered People</h2>
      <ul>
        {bookings.map(booking => (
          <li key={booking.id}>
            Name: {booking.person.name}, Level: {booking.person.level}, Location: {booking.locationName}, Date: {new Date(booking.date.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingsList;

