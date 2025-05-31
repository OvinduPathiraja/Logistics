import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LogisticsPage from './pages/Logistics/LogisticsPage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingPage from './pages/LoadingPage';
import MapPage from './pages/Map/Map';
import CsvUploadForm from './pages/Logistics/components/NewShipment';
import Home2 from './pages/Home/Home2';

// Auth components
import AuthGuard from './components/auth/AuthGuard';

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <LoadingPage />;
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{auth.error.message}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition duration-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Home2 />} />
      
      {/* Redirect to dashboard if authenticated */}
      
      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/logistics/new-shipment" element={<CsvUploadForm />} />
        </Route>
      </Route>

      
      {/* Catch-all route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;