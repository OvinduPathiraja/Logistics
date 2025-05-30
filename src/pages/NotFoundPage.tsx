import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
        <PackageX className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          to="/dashboard"
          className="inline-block py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;