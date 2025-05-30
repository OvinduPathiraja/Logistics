import React from 'react';
import { MapPin, Users, BarChart2, Package } from 'lucide-react';

const stats = [
  {
    icon: <Package className="h-8 w-8 text-blue-600" />,
    value: '1.2M+',
    label: 'Shipments Delivered'
  },
  {
    icon: <MapPin className="h-8 w-8 text-blue-600" />,
    value: '120+',
    label: 'Countries Served'
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600" />,
    value: '15,000+',
    label: 'Happy Customers'
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-blue-600" />,
    value: '98.7%',
    label: 'On-time Delivery'
  }
];

const StatsSection: React.FC = () => {
  return (
    <section id="about\" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Worldwide</h2>
          <p className="text-gray-600 text-lg">
            With our global network and experienced team, we've been delivering excellence in logistics 
            services for over two decades. Here's what we've accomplished so far:
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                {stat.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">About XYZ Logistics</h3>
              <p className="text-gray-600 mb-4">
                Founded in 2005, XYZ Logistics has grown from a small local courier service to a global 
                logistics provider. Our mission is to simplify complex supply chains and provide reliable, 
                cost-effective solutions that help businesses thrive in today's fast-paced global market.
              </p>
              <p className="text-gray-600 mb-6">
                With strategically located distribution centers and a robust technology platform, 
                we offer end-to-end visibility and control over your shipments. Our dedicated team 
                of professionals is committed to delivering exceptional service and ensuring your 
                complete satisfaction.
              </p>
              <a 
                href="#contact" 
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                Contact Us
              </a>
            </div>
            <div className="relative h-64 lg:h-auto overflow-hidden rounded-lg">
              <img
                src="https://images.pexels.com/photos/1427541/pexels-photo-1427541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Logistics warehouse"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;