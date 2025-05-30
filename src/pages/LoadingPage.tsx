import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-gray-700">Loading XYZ Logistics</h2>
      <p className="text-gray-500 mt-2">Please wait while we authenticate your session...</p>
    </div>
  );
};

export default LoadingPage;