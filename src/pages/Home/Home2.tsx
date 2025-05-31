import React from 'react';
import Header from './components/Header';



const Home2: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to Logistics One</h1>
            <p className="text-lg text-center text-gray-700">
              Your one-stop solution for efficient logistics management.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home2;