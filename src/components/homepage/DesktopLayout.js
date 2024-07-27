import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';
import { encodeParams } from '../../utils/encodeParams';
import Header from './Header';
import Footer from './Footer';

export default function DesktopLayout() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(firestore, 'events');
      const today = new Date();
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
    if (cursor) {
      cursor.style.left = `${mousePosition.x}px`;
      cursor.style.top = `${mousePosition.y}px`;
    }
  }, [mousePosition]);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    console.log(`Selected event: ${event.location.name}`);
  };

  const handleBookNowClick = () => {
    if (!selectedEvent) return;

    const location = selectedEvent.location;
    const params = {
      id: location.id,
      name: location.name,
      price: location.price,
      date: new Date(selectedEvent.date.seconds * 1000),
      capacity: location.capacity
    };
    const encodedParams = encodeParams(params);
    router.push(`/checkout?data=${encodedParams}`);
  };

  const getBookingCountForLocation = (locationId) => {
    return bookings.filter(booking => booking.locationId === locationId).length;
  };

  const isEventSoldOut = (event) => {
    const bookingCount = getBookingCountForLocation(event.location.id);
    return bookingCount >= event.location.capacity;
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
          {events.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 p-4">
              {events.map((event) => (
                <div
                  key={event.location.id}
                  className="location-card"
                  onMouseEnter={() => setSelectedEvent(event)}
                  onClick={() => handleEventSelect(event)}
                >
                  <div className="relative w-64 h-64 overflow-hidden">
                    <Image
                      src={event.location.image}
                      alt={event.location.name}
                      fill
                      style={{objectFit:"cover"}}
                      className="transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <span className="text-2xl font-bold">{event.location.name}</span>
                      {isEventSoldOut(event) ? (
                        <span className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded">Sold Out</span>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookNowClick();
                          }}
                          className="mt-4 px-4 py-2 bg-white text-black font-bold hover:bg-opacity-80 transition-colors duration-300"
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold">No events planned for now, stay tuned!</p>
            </div>
          )}
        </div>

        <div className="relative z-10 w-1/2 h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src="/images/london-map.jpg"
              alt="London Map"
              fill
              style={{objectFit:"contain"}}
            />
            {events.map((event) => (
              <div
                key={event.location.id}
                className={`absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-all duration-300 ${selectedEvent === event ? 'scale-150' : 'scale-100'}`}
                style={{ left: `${event.location.coordinates.x}%`, top: `${event.location.coordinates.y}%` }}
                onMouseEnter={() => setSelectedEvent(event)}
                onClick={() => handleEventSelect(event)}
              ></div>
            ))}
          </div>
        </div>
      </main>

      {selectedEvent && (
        <div className="fixed bottom-8 left-8 z-50 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-2xl font-bold mb-6">{selectedEvent.location.name}</h3>
          <p>{selectedEvent.location.name}, {new Date(selectedEvent.date.seconds * 1000).toLocaleString()}</p>
          {generateDescription(selectedEvent.location.id)}
        </div>
      )}

      <Footer />
    </div>
  );
}
