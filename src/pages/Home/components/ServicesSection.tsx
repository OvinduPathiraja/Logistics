import React from 'react';
import { Truck, Ship, Plane, Package, BarChart, Clock } from 'lucide-react';

const services = [
  {
    icon: <Truck className="h-12 w-12 text-blue-600" />,
    title: 'Road Freight',
    description: 'Efficient road transportation solutions for domestic and international deliveries with tracking capabilities.'
  },
  {
    icon: <Ship className="h-12 w-12 text-blue-600" />,
    title: 'Sea Freight',
    description: 'Reliable sea freight services for international shipping with competitive rates and flexible schedules.'
  },
  {
    icon: <Plane className="h-12 w-12 text-blue-600" />,
    title: 'Air Freight',
    description: 'Fast and secure air freight options for time-sensitive shipments to destinations worldwide.'
  },
  {
    icon: <Package className="h-12 w-12 text-blue-600" />,
    title: 'Warehousing',
    description: 'Modern warehousing facilities with inventory management systems for efficient storage and distribution.'
  },
  {
    icon: <BarChart className="h-12 w-12 text-blue-600" />,
    title: 'Supply Chain',
    description: 'End-to-end supply chain management solutions to optimize your logistics operations.'
  },
  {
    icon: <Clock className="h-12 w-12 text-blue-600" />,
    title: 'Express Delivery',
    description: 'Priority handling and expedited delivery services for urgent shipments with guaranteed timelines.'
  }
];

const ServicesSection: React.FC = () => {
  return (
    <section id="services\" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg">
            We offer comprehensive logistics solutions tailored to meet your specific needs,
            ensuring your cargo reaches its destination safely and on time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;