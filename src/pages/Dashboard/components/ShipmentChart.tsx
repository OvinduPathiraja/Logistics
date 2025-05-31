import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Shipment {
  Status: string;
}

const ShipmentChart: React.FC = () => {
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>([]);
  const [totalShipments, setTotalShipments] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [inTransit, setInTransit] = useState(0);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod'
        );
        const result = await response.json();
        const shipments: Shipment[] = JSON.parse(result.body);

        setTotalShipments(shipments.length);
        setDelivered(shipments.filter(s => s.Status === 'Delivered').length);
        setInTransit(shipments.filter(s => s.Status === 'In Transit').length);

        // Evenly divide shipments into 9 chunks to simulate monthly data
        const chunkSize = Math.ceil(shipments.length / 9);
        const grouped = Array.from({ length: 9 }, (_, i) => ({
          name: months[i],
          count: shipments.slice(i * chunkSize, (i + 1) * chunkSize).length,
        }));

        setChartData(grouped);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Shipment Overview</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md">Monthly</button>
          <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md">Quarterly</button>
          <button className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md">Yearly</button>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-gray-500">Total Shipments</p>
          <p className="text-xl font-semibold text-gray-800">{totalShipments}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-md">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-xl font-semibold text-gray-800">{delivered}</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="text-xl font-semibold text-gray-800">{inTransit}</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentChart;
