// src/components/checkout/CheckoutClient.js
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import CheckoutInfo from './CheckoutInfo';
import { decodeParams } from '../../utils/decodeParams';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../firebase';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutContent() {
  const [location, setLocation] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [bookingCount, setBookingCount] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const encodedData = searchParams.get('data');
    if (encodedData) {
      const decodedParams = decodeParams(encodedData);
      setLocation(decodedParams);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location) {
      fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          locationId: location.id,
          locationName: location.name,
          price: location.price
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret));
    }
  }, [location]);

  useEffect(() => {
    if (location) {
      const q = query(
        collection(firestore, 'bookings'),
        where('locationId', '==', location.id)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        setBookingCount(querySnapshot.size);
      });

      return () => unsubscribe();
    }
  }, [location]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (!location || !clientSecret) {
    return <div>Loading...</div>;
  }

  const isSoldOut = bookingCount >= location.capacity;

  return (
    <div className="container mx-auto p-6">
      <CheckoutInfo location={location} bookingCount={bookingCount} />
      {isSoldOut ? (
        <div className="text-red-500 text-center text-2xl font-bold mt-4">Sold Out</div>
      ) : (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm location={location} clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}

export default function CheckoutClient() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
