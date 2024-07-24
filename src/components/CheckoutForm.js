// src/components/CheckoutForm.js

import { useState } from 'react';
import { useStripe, useElements, CardElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

export default function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [name, setName] = useState('');
  const [tennisLevel, setTennisLevel] = useState('beginner');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name,
      },
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message);
      setLoading(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod.id,
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // Redirect to success page
      router.push('/success');
    }

    // Reset form
    setName('');
    setTennisLevel('beginner');
    setLoading(false);
  };

  const cardStyle = {
    style: {
      base: {
        color: '#ffffff', // Set text color to white
        backgroundColor: '#000000', // Set background color to black
        '::placeholder': {
          color: '#a0aec0', // Set placeholder color
        },
      },
      invalid: {
        color: '#ff6b6b', // Set text color for invalid input
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-black text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="tennisLevel" className="block text-sm font-medium text-white">Tennis Level</label>
        <select
          id="tennisLevel"
          value={tennisLevel}
          onChange={(e) => setTennisLevel(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-black text-white"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label htmlFor="card" className="block text-sm font-medium text-white">Credit Card</label>
        <CardElement id="card" options={cardStyle} className="mt-1 p-2 border border-gray-300 rounded-md bg-black text-white" />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full p-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}
