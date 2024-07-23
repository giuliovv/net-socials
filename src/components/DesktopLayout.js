import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { locations } from '../utils/constants'

export default function DesktopLayout() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div ref={cursorRef} className="custom-cursor"></div>
      
      <header className="fixed top-0 left-0 w-full z-50 p-8">
      <Image src="/images/logo-white.png" alt="NET SOCIAL Logo" width={100} height={50} />
      </header>

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
                // onMouseLeave={() => setSelectedLocation(null)}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="relative w-64 h-64 overflow-hidden">
                  <Image
                    src={location.image}
                    alt={location.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <span className="text-2xl font-bold">{location.name}</span>
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
              layout="fill"
              objectFit="contain"
            />
            {locations.map((location) => (
              <div
                key={location.id}
                className={`absolute w-4 h-4 bg-red-500 rounded-full cursor-pointer transition-all duration-300 ${selectedLocation === location ? 'scale-150' : 'scale-100'}`}
                style={{ left: `${location.coordinates.x}%`, top: `${location.coordinates.y}%` }}
                onMouseEnter={() => setSelectedLocation(location)}
                onMouseLeave={() => setSelectedLocation(null)}
                onClick={() => handleLocationSelect(location)}
              ></div>
            ))}
          </div>
        </div>
      </main>

      {selectedLocation && (
        <div className="fixed bottom-8 left-8 z-50">
          <h3 className="text-2xl font-bold">{selectedLocation.name}</h3>
          <a href={selectedLocation.link}>
            <button className="mt-2 px-4 py-2 bg-white text-black font-bold hover:bg-opacity-80 transition-colors duration-300">
              Book Now
            </button>
          </a>
        </div>
      )}

      {/* <style jsx global>{`
        body {
          cursor: none;
        }
        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          transition: all 0.1s ease;
          transform: translate(-50%, -50%);
        }
        .location-card:hover ~ .custom-cursor,
        .absolute:hover ~ .custom-cursor {
          transform: translate(-50%, -50%) scale(1.5);
          background-color: white;
          mix-blend-mode: difference;
        }
      `}</style> */}
    </div>
  );
}