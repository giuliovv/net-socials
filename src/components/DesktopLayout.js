// src/components/DesktopLayout.js

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
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

export default function DesktopLayout() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const today = new Date();
      const nextFriday = getNextFriday(today);
      const q = query(
        collection(firestore, 'bookings'),
        where('date', '>=', Timestamp.fromDate(nextFriday))
      );
      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => doc.data());
      setBookings(bookingsList);
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    cursor.style.left = `${mousePosition.x}px`;
    cursor.style.top = `${mousePosition.y}px`;
  }, [mousePosition]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    console.log(`Selected location: ${location.name}`);
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
    const bookingCount = getBookingCountForLocation(locationId);
    if (bookingCount === 0) {
      return <p>Be the first to book this week!</p>;
    } else if (bookingCount === 1) {
      return <p>{bookingCount} person has booked.</p>;
    } else {
      return <p>{bookingCount} people have booked.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div ref={cursorRef} className="custom-cursor"></div>
      
      <Header />

      <main className="relative h-screen flex">
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-9xl font-extrabold opacity-5 select-none">PLAY</h2>
        </div>

        <div className="relative z-10 w-1/2 h-full flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 p-4">
            {locations.map((location) => (
              <div
                key={location.id}
                className="location-card"
                onMouseEnter={() => setSelectedLocation(location)}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="relative w-64 h-64 overflow-hidden">
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    style={{objectFit:"cover"}}
                    className="transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-2xl font-bold">{location.name}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNowClick();
                      }}
                      className="mt-4 px-4 py-2 bg-white text-black font-bold hover:bg-opacity-80 transition-colors duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 w-1/2 h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src="/images/london-map.jpg"
              alt="London Map"
              fill
              style={{objectFit:"contain"}}
            />
            {locations.map((location) => (
              <div
                key={location.id}
                className={`absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-all duration-300 ${selectedLocation === location ? 'scale-150' : 'scale-100'}`}
                style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
                onMouseEnter={() => setSelectedLocation(location)}
                onClick={() => handleLocationSelect(location)}
              ></div>
            ))}
          </div>
        </div>
      </main>

      {selectedLocation && (
        <div className="fixed bottom-8 left-8 z-50 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">{selectedLocation.name}</h3>
          <p>{selectedLocation.name}, ADDRESS, DATE</p>
          {generateDescription(selectedLocation.id)}
        </div>
      )}

      <Footer />
    </div>
  );
}
