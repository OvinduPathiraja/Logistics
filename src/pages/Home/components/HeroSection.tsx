import React from 'react';
import { useAuth } from 'react-oidc-context';
import { Search, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated }) => {
  const auth = useAuth();
  
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundPosition: "center",
          filter: "brightness(50%)"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in">
            Delivering Your Cargo <span className="text-orange-500">Worldwide</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 animate-fade-in delay-100">
            Reliable, efficient, and secure logistics solutions for businesses of all sizes. Track your shipments in real-time and ensure on-time delivery.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in delay-200">
            {isAuthenticated ? (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center sm:justify-start"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => auth.signinRedirect()}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center sm:justify-start"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            )}
            <a
              href="#services"
              className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300 text-center sm:text-left"
            >
              Our Services
            </a>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-lg animate-fade-in delay-300">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter tracking number
                </label>
                <input
                  type="text"
                  id="tracking"
                  placeholder="e.g., SHP123456789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="mt-4 sm:mt-auto px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center">
                <Search className="mr-2 h-4 w-4" />
                Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;