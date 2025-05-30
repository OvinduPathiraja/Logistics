import React from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';

const stats = [
  {
    title: 'Works',
    value: '543',
    icon: <Package className="h-10 w-10 text-white" />,
    bgColor: 'bg-blue-500',
  },
  {
    title: 'Sales',
    value: '3510',
    icon: <ShoppingCart className="h-10 w-10 text-white" />,
    bgColor: 'bg-green-500',
  },
  {
    title: 'Earnings',
    value: '$43,567.53',
    icon: <DollarSign className="h-10 w-10 text-white" />,
    bgColor: 'bg-orange-500',
  },
  {
    title: 'New Users',
    value: '11',
    icon: <Users className="h-10 w-10 text-white" />,
    bgColor: 'bg-pink-500',
  },
];

const StatCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              {stat.icon}
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center">
              <span className="text-green-500 text-sm font-medium">+3.5%</span>
              <span className="text-gray-500 text-sm ml-2">from last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;