// src/components/CreateEventForm.js
"use client"

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { locations } from '../utils/constants';

const CreateEventForm = () => {
  const user = auth.currentUser;
  const [date, setDate] = useState('');
  const [useSuggestedLocation, setUseSuggestedLocation] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationImage, setNewLocationImage] = useState('');
  const [newLocationCoordinates, setNewLocationCoordinates] = useState({ x: 0, y: 0 });
  const [newLocationLink, setNewLocationLink] = useState('');
  const [newLocationPrice, setNewLocationPrice] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create an event.');
      return;
    }

    try {
      let locationData;
      if (useSuggestedLocation) {
        const location = locations.find(loc => loc.id === selectedLocation);
        locationData = location;
      } else {
        locationData = {
          id: new Date().getTime(), // Simple way to generate a unique ID
          name: newLocationName,
          image: newLocationImage,
          coordinates: newLocationCoordinates,
          link: newLocationLink,
          price: newLocationPrice,
        };
      }

      await addDoc(collection(firestore, 'events'), {
        date: new Date(date),
        location: locationData,
        createdBy: user.uid, // Optionally store the user ID who created the event
      });

      setDate('');
      setNewLocationName('');
      setNewLocationImage('');
      setNewLocationCoordinates({ x: 0, y: 0 });
      setNewLocationLink('');
      setNewLocationPrice(0);
    } catch (error) {
      setError('Error creating event: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 rounded-lg mt-4">
      <h2 className="text-2xl font-bold mb-4">Create New Tennis Event</h2>
      {error && <p className="mb-4 text-red-500">{error}</p>}
      <div className="mb-2">
        <label className="block text-white">Date:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <div className="mb-2">
        <label className="block text-white">Location:</label>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="suggested"
            name="location"
            checked={useSuggestedLocation}
            onChange={() => setUseSuggestedLocation(true)}
            className="mr-2"
          />
          <label htmlFor="suggested" className="text-white">Suggested Location</label>
        </div>
        <div className="flex items-center mb-2">
          <input
            type="radio"
            id="custom"
            name="location"
            checked={!useSuggestedLocation}
            onChange={() => setUseSuggestedLocation(false)}
            className="mr-2"
          />
          <label htmlFor="custom" className="text-white">New Location</label>
        </div>
      </div>
      {useSuggestedLocation ? (
        <div className="mb-2">
          <label className="block text-white">Select Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <label className="block text-white">Location Name:</label>
            <input
              type="text"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Location Image URL:</label>
            <input
              type="text"
              value={newLocationImage}
              onChange={(e) => setNewLocationImage(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Coordinates:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={newLocationCoordinates.x}
                onChange={(e) => setNewLocationCoordinates({ ...newLocationCoordinates, x: Number(e.target.value) })}
                required
                placeholder="X"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <input
                type="number"
                value={newLocationCoordinates.y}
                onChange={(e) => setNewLocationCoordinates({ ...newLocationCoordinates, y: Number(e.target.value) })}
                required
                placeholder="Y"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-white">Link:</label>
            <input
              type="text"
              value={newLocationLink}
              onChange={(e) => setNewLocationLink(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Price:</label>
            <input
              type="number"
              value={newLocationPrice}
              onChange={(e) => setNewLocationPrice(Number(e.target.value))}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </>
      )}
      <button type="submit" className="mt-2 px-4 py-2 bg-white text-black font-bold rounded">
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
