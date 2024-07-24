// src/components/MobileLayout.js

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase'; // Make sure this import is correct
import { locations } from '../utils/constants';
import Header from './Header';
import Footer from './Footer';

const getNextFriday = (date) => {
  const dayOfWeek = date.getUTCDay();
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
  const nextFriday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  nextFriday.setUTCDate(date.getUTCDate() + daysUntilFriday);
  nextFriday.setUTCHours(23, 30, 0, 0); // Set time to 11:30 PM UTC
  return nextFriday;
};

export default function MobileLayout() {
  const [selectedLocation, setActiveLocation] = useState(null);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const today = new Date();
      const nextFriday = getNextFriday(today);
      const q = query(
        collection(firestore, 'bookings'), // Use firestore here
        where('date', '>=', Timestamp.fromDate(nextFriday))
      );
      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => doc.data());
      setBookings(bookingsList);
    };

    fetchBookings();
  }, []);

  const handleLocationClick = (location) => {
    setActiveLocation(selectedLocation === location ? null : location);
  };

  const handleBookNowClick = () => {
    if (selectedLocation) {
      router.push(`/checkout?id=${selectedLocation.id}`);
    }
  };

  const getBookingCountForLocation = (locationId) => {
    return bookings.filter(booking => booking.locationId === locationId).length;
  };

  const generateDescription = (locationId) => {
    const bookingCount = getBookingCountForLocation(locationId)
    if (bookingCount === 0) {
      return <p>Be the first to book this week!</p>
    } else if (bookingCount === 1) {
      return <p>{getBookingCountForLocation(locationId)} person has booked.</p>
    } else {
      return <p>{getBookingCountForLocation(locationId)} people have booked.</p>
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="p-4 mt-32">
        <h2 className="text-5xl font-bold mb-6 text-center opacity-50">PLAY</h2>
        
        <div className="space-y-4">
          {locations.map((location) => (
            <div key={location.id} className="relative">
              <div 
                className="relative h-48 overflow-hidden rounded-lg"
                onClick={() => handleLocationClick(location)}
              >
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  style={{objectFit:"cover"}}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="text-2xl font-bold">{location.name}</span>
                </div>
              </div>
              {selectedLocation === location && (
                <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                  <p>ADDRESS, DATE</p>
                  <>{generateDescription(location.id)}</>
                  <button onClick={handleBookNowClick} className="mt-2 px-4 py-2 bg-white text-black font-bold rounded">
                    Book Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
