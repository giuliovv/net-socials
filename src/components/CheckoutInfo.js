// src/components/CheckoutInfo.js
export default function CheckoutInfo({ location, bookingCount }) {
  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg mb-6">
      <h2 className="text-3xl font-bold mb-4">Event Details</h2>
      <p className="text-lg mb-2"><span className="font-bold">Location:</span> {location.name}</p>
      <p className="text-lg mb-2"><span className="font-bold">Date:</span> {new Date(location.date).toLocaleDateString()}</p>
      <p className="text-lg mb-2"><span className="font-bold">Price:</span> £{location.price}</p>
      <p className="text-lg mb-2"><span className="font-bold">Booked:</span> {bookingCount} / {location.capacity}</p>
    </div>
  );
}
