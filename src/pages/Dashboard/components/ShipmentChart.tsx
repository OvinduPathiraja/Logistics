import React, { useEffect, useState } from 'react';

const ShipmentChart: React.FC = () => {
  const [totalShipments, setTotalShipments] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const [inTransit, setInTransit] = useState(0);
  const [chartData, setChartData] = useState<number[]>([]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const result = await response.json();
        const shipments = JSON.parse(result.body);

        const total = shipments.length;
        const deliveredCount = shipments.filter((s: any) => s['Status'] === 'Delivered').length;
        const inTransitCount = shipments.filter((s: any) => s['Status'] === 'In Transit').length;

        setTotalShipments(total);
        setDelivered(deliveredCount);
        setInTransit(inTransitCount);

        // Simulate 9 bars (months) using random groupings
        const groupSize = Math.ceil(total / 9);
        const counts: number[] = [];

        for (let i = 0; i < 9; i++) {
          const group = shipments.slice(i * groupSize, (i + 1) * groupSize);
          counts.push(group.length);
        }

        setChartData(counts);
      } catch (error) {
        console.error('Failed to fetch shipment data:', error);
      }
    };

    fetchShipments();
  }, []);

  const maxValue = Math.max(...chartData, 1);

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

      <div className="mt-6">
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full flex items-end">
            {chartData.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-6 bg-blue-500 rounded-t-md mb-2"
                  style={{
                    height: `${(value / maxValue) * 90}%`,
                    opacity: 0.7 + (index / chartData.length) * 0.3,
                  }}
                ></div>
                <span className="text-xs text-gray-500">{months[index]}</span>
              </div>
            ))}
          </div>
        </div>
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
