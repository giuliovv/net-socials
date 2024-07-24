// src/components/MobileLayout.js

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { locations } from '../utils/constants';
import Header from './Header';
import Footer from './Footer';

export default function MobileLayout() {
  const [selectedLocation, setActiveLocation] = useState(null);
  const router = useRouter();

  const handleLocationClick = (location) => {
    setActiveLocation(selectedLocation === location ? null : location);
  };

  const handleBookNowClick = () => {
    if (selectedLocation) {
      router.push(`/checkout?id=${selectedLocation.id}`);
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
                  <p>Details about {location.name}</p>
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
