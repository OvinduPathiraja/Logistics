import React, { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { useAuth } from 'react-oidc-context';

const StatCards: React.FC = () => {
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email ?? '';

  const [works, setWorks] = useState(0);
  const [sales, setSales] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        const userShipments = parsedBody.filter((item: any) => item['Email'] === userEmail);

        const totalWorks = userShipments.length;
        const totalSales = userShipments.filter((item: any) => item['Status'] === 'Delivered').length;
        const totalEarnings = userShipments.reduce((sum: number, item: any) => sum + parseFloat(item['Logistic Cost'] || '0'), 0);
        const uniqueUsers = new Set(userShipments.map((item: any) => item['Client Name'])).size;

        setWorks(totalWorks);
        setSales(totalSales);
        setEarnings(totalEarnings);
        setUsers(uniqueUsers);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    if (userEmail) {
      fetchStats();
    }
  }, [userEmail]);

  const stats = [
    {
      title: 'Works',
      value: works.toString(),
      icon: <Package className="h-10 w-10 text-white" />,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Sales',
      value: sales.toString(),
      icon: <ShoppingCart className="h-10 w-10 text-white" />,
      bgColor: 'bg-green-500',
    },
    {
      title: 'Earnings',
      value: `$${earnings.toFixed(2)}`,
      icon: <DollarSign className="h-10 w-10 text-white" />,
      bgColor: 'bg-orange-500',
    },
    {
      title: 'Users',
      value: users.toString(),
      icon: <Users className="h-10 w-10 text-white" />,
      bgColor: 'bg-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
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
