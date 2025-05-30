import React from 'react';
import { Package, ShoppingBag, FileText, Clock, User, CheckCircle } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: <Package className="h-4 w-4 text-blue-500" />,
    title: 'New shipment created',
    time: '2 hours ago',
    color: 'bg-blue-100',
  },
  {
    id: 2,
    icon: <ShoppingBag className="h-4 w-4 text-green-500" />,
    title: 'Order #35791 delivered',
    time: '3 hours ago',
    color: 'bg-green-100',
  },
  {
    id: 3,
    icon: <FileText className="h-4 w-4 text-purple-500" />,
    title: 'Invoice #4752 paid',
    time: '5 hours ago',
    color: 'bg-purple-100',
  },
  {
    id: 4,
    icon: <Clock className="h-4 w-4 text-yellow-500" />,
    title: 'Shipment delay reported',
    time: '6 hours ago',
    color: 'bg-yellow-100',
  },
  {
    id: 5,
    icon: <User className="h-4 w-4 text-indigo-500" />,
    title: 'New client registered',
    time: '8 hours ago',
    color: 'bg-indigo-100',
  },
  {
    id: 6,
    icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    title: 'Task completed',
    time: '10 hours ago',
    color: 'bg-green-100',
  },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className={`p-2 rounded-full ${activity.color} mr-3`}>
                {activity.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-6 text-center text-sm text-blue-600 hover:text-blue-700">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;