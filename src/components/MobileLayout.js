import { useState } from 'react';
import Image from 'next/image';
import { locations } from '../utils/constants';

export default function MobileLayout() {
  const [activeLocation, setActiveLocation] = useState(null);

  const handleLocationClick = (location) => {
    setActiveLocation(activeLocation === location ? null : location);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 flex items-center justify-center mt-4"> {/* Added mt-4 for top margin */}
        <div className="relative w-40 h-20"> {/* Adjust width and height as needed */}
          <Image 
            src="/images/logo-white.png" 
            alt="NET SOCIAL Logo" 
            layout="fill" 
            objectFit="contain" 
          />
        </div>
      </header>

      <main className="p-4">
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
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <span className="text-2xl font-bold">{location.name}</span>
                </div>
              </div>
              {activeLocation === location && (
                <div className="mt-2 p-4 bg-gray-800 rounded-lg">
                  <p>Details about {location.name}</p>
                  <a href={location.link}>
                    <button className="mt-2 px-4 py-2 bg-white text-black font-bold rounded">
                      Book Now
                    </button>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
