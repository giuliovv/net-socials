// src/components/SuccessClient.js
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { decodeParams } from '../utils/decodeParams'; // Ensure you have this utility
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      const decodedParams = decodeParams(encodedData);
      setLocation(decodedParams);
      logTransaction(decodedParams.session_id);
    }
  }, [searchParams]);

  const logTransaction = async (sessionId) => {
    try {
      await addDoc(collection(firestore, 'transactions'), {
        sessionId,
        timestamp: new Date(),
        // Add any other relevant information
      });
      console.log('Transaction logged successfully');
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  };

  if (!location) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Booking Successful!</h2>
      <h3 className="text-xl font-bold mb-4">Thank you for your booking, see you soon!</h3>
      <p className="text-lg mb-2"><span className="font-bold">Location:</span> {location.name}</p>
      <p className="text-lg mb-2"><span className="font-bold">Date:</span> {new Date(location.date).toLocaleDateString()}</p>
      <p className="text-lg mb-2"><span className="font-bold">Price:</span> £{location.price}</p>
      <p className="text-lg mb-2"><span className="font-bold">Capacity:</span> {location.capacity}</p>
    </div>
  );
}

export default function SuccessClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
