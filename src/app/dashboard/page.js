// src/pages/dashboard.js
import PrivateRoute from '../../components/PrivateRoute';
import GroupedBookingsList from '../../components/GroupedBookingsList';
import CreateEventForm from '../../components/CreateEventForm';

const DashboardPage = () => {
  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="p-4 bg-gray-800">
          <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>
        </header>
        <main className="p-4">
          <GroupedBookingsList />
          <CreateEventForm />
        </main>
      </div>
    </PrivateRoute>
  );
};

export default DashboardPage;
