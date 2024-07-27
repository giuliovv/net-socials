// src/app/checkout/page.js

import CheckoutClient from '../../components/CheckoutClient';
import Header from '../../components/homepage/Header';
import Footer from '../../components/homepage/Footer';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-16 mb-16 pt-20 pb-20 p-4">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <CheckoutClient />
      </main>
      <Footer />
    </div>
  );
}
