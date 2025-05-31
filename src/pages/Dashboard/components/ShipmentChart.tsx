import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Shipment {
  TransportationMethod: string;
  Status: string;
}

const ShipmentChart: React.FC = () => {
  const [chartData, setChartData] = useState<{ method: string; count: number }[]>([]);
  const [totalShipments, setTotalShipments] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [inTransit, setInTransit] = useState(0);

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

        // Count by transportation method
        const methodCountMap: Record<string, number> = {};
        for (const shipment of shipments) {
          const method = shipment.TransportationMethod || 'Unknown';
          methodCountMap[method] = (methodCountMap[method] || 0) + 1;
        }

        const chartFormatted = Object.entries(methodCountMap).map(([method, count]) => ({
          method,
          count,
        }));

        setChartData(chartFormatted);
      } catch (err) {
        console.error('Error fetching shipment data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Shipment by Transportation Method</h2>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
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
