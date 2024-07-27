// src/pages/dashboard.js
"use client"

import { useState } from 'react';
import PrivateRoute from '../../components/PrivateRoute';
import GroupedBookingsList from '../../components/GroupedBookingsList';
import CreateEventForm from '../../components/CreateEventForm';
import PlannedEventsList from '../../components/PlannedEventsList';

const DashboardPage = () => {
  const [refreshEvents, setRefreshEvents] = useState(false);

  const handleEventCreated = () => {
    setRefreshEvents(!refreshEvents);
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-4 bg-gray-800">
          <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        </header>
        <main className="p-4">
          <PlannedEventsList refresh={refreshEvents} />
          <GroupedBookingsList />
          <CreateEventForm onEventCreated={handleEventCreated} />
        </main>
      </div>
    </PrivateRoute>
  );
};

export default DashboardPage;
