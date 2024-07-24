// src/components/CheckoutClient.js
"use client"

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';
import { locations } from '../utils/constants';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function CheckoutContent() {
  const [location, setLocation] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const selectedLocation = locations.find(loc => loc.id === parseInt(id));
      setLocation(selectedLocation);
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

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}

export default function CheckoutClient() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
