'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (session_id) {
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

  return null; // This component doesn't render anything visible
}

export default function SuccessClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}