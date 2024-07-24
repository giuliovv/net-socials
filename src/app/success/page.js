"use client"

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../firebase'; // Ensure this path is correct

export default function Success() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
      // Verify the session with Stripe (you should implement this on your server)
      // For simplicity, we're assuming the payment was successful
      logTransaction(session_id);
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

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your booking.</p>
    </div>
  );
}