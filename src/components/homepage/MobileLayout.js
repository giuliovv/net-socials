// src/components/MobileLayout.js
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { encodeParams } from '../../utils/encodeParams';
import Header from './Header';
import Footer from './Footer';

export default function MobileLayout() {
  const [selectedLocation, setActiveLocation] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date();
      const eventsCollection = collection(firestore, 'events');
      const q = query(eventsCollection, where('date', '>=', Timestamp.fromDate(today)));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsList);
    };

    const fetchBookings = async () => {
      const today = new Date();
      const bookingsCollection = collection(firestore, 'bookings');
      const q = query(bookingsCollection, where('date', '>=', Timestamp.fromDate(today)));
      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => doc.data());
      setBookings(bookingsList);
    };

    fetchEvents();
    fetchBookings();
  }, []);

  const handleLocationClick = (location) => {
    setActiveLocation(selectedLocation === location ? null : location);
  };

  const handleBookNowClick = (selectedEvent) => {
    if (!selectedEvent) return;

    const location = selectedEvent.location;
    const params = {
      id: location.id,
      name: location.name,
      price: location.price,
      date: new Date(selectedEvent.date.seconds * 1000),
    };
    const encodedParams = encodeParams(params);
    router.push(`/checkout?data=${encodedParams}`);
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
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="p-4 mt-32">
        <h2 className="text-5xl font-bold mb-6 text-center opacity-50">PLAY</h2>
        
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.location.id} className="relative">
                <div 
                  className="relative h-48 overflow-hidden rounded-lg"
                  onClick={() => handleLocationClick(event.location)}
                >
                  <Image
                    src={event.location.image}
                    alt={event.location.name}
                    fill
                    style={{objectFit:"cover"}}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <span className="text-2xl font-bold">{event.location.name}</span>
                  </div>
                </div>
                {selectedLocation === event.location && (
                  <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                    <p>{event.location.name}, {new Date(event.date.seconds * 1000).toLocaleString()}</p>
                    {generateDescription(event.location.id)}
                    <button onClick={() => handleBookNowClick(event)} className="mt-2 px-4 py-2 bg-white text-black font-bold rounded">
                      Book Now
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold">No events planned for now, stay tuned!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
