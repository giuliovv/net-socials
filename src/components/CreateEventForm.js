// src/components/CreateEventForm.js
"use client"

import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { locations } from '../utils/constants';
import { slugify } from '../utils/slugify';

const CreateEventForm = () => {
  const user = auth.currentUser;
  const [date, setDate] = useState('');
  const [useSuggestedLocation, setUseSuggestedLocation] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(locations[0].id);
  const [locationDetails, setLocationDetails] = useState(locations[0]);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationImage, setNewLocationImage] = useState(locations[0].image);
  const [newLocationCoordinates, setNewLocationCoordinates] = useState({ x: 0, y: 0 });
  const [newLocationPrice, setNewLocationPrice] = useState(0);
  const [capacity, setCapacity] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    if (useSuggestedLocation) {
      const location = locations.find(loc => loc.id === selectedLocation);
      setLocationDetails(location);
      setCapacity(location.capacity);
      setNewLocationImage(location.image);
    }
  }, [selectedLocation, useSuggestedLocation]);

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
        locationData = { ...locationDetails, capacity };
      } else {
        locationData = {
          id: slugify(newLocationName),
          name: newLocationName,
          image: newLocationImage,
          coordinates: newLocationCoordinates,
          price: newLocationPrice,
          capacity,
        };
      }

      await addDoc(collection(firestore, 'events'), {
        date: new Date(date),
        location: locationData,
        createdBy: user.uid,
      });

      setDate('');
      setNewLocationName('');
      setNewLocationImage(locations[0].image);
      setNewLocationCoordinates({ x: 0, y: 0 });
      setNewLocationPrice(0);
      setCapacity(capacity);
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
        <>
          <div className="mb-2">
            <label className="block text-white">Select Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-white">Location Name:</label>
            <input
              type="text"
              value={locationDetails.name}
              onChange={(e) => setLocationDetails({ ...locationDetails, name: e.target.value })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div className="mb-2">
            <label className="block text-white">Location Image:</label>
            <select
              value={locationDetails.image}
              onChange={(e) => setLocationDetails({ ...locationDetails, image: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              {locations.map((location) => (
                <option key={location.image} value={location.image}>
                  {location.name}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <img src={locationDetails.image} alt="Location Preview" className="w-full h-48 object-cover rounded-lg" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-white">Coordinates:</label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={locationDetails.coordinates.x}
                onChange={(e) => setLocationDetails({ ...locationDetails, coordinates: { ...locationDetails.coordinates, x: Number(e.target.value) } })}
                required
                placeholder="X"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <input
                type="number"
                value={locationDetails.coordinates.y}
                onChange={(e) => setLocationDetails({ ...locationDetails, coordinates: { ...locationDetails.coordinates, y: Number(e.target.value) } })}
                required
                placeholder="Y"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-white">Price:</label>
            <input
              type="number"
              value={locationDetails.price}
              onChange={(e) => setLocationDetails({ ...locationDetails, price: Number(e.target.value) })}
              required
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
        </>
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
            <label className="block text-white">Location Image:</label>
            <select
              value={newLocationImage}
              onChange={(e) => setNewLocationImage(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              {locations.map((location) => (
                <option key={location.image} value={location.image}>
                  {location.name}
                </option>
              ))}
            </select>
            <div className="mt-2">
              <img src={newLocationImage} alt="Location Preview" className="w-full h-48 object-cover rounded-lg" />
            </div>
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
      <div className="mb-2">
        <label className="block text-white">Capacity:</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          required
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>
      <button type="submit" className="mt-2 px-4 py-2 bg-white text-black font-bold rounded">
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
