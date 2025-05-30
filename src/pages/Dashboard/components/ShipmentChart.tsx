import React from 'react';

const ShipmentChart: React.FC = () => {
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const data = [30, 40, 35, 50, 49, 60, 70, 91, 125];
  const maxValue = Math.max(...data);
  
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
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-8 h-full flex items-end">
            {data.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-6 bg-blue-500 rounded-t-md mb-2" 
                  style={{ 
                    height: `${(value / maxValue) * 90}%`,
                    opacity: 0.7 + (index / data.length) * 0.3 
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
          <p className="text-xl font-semibold text-gray-800">1,245</p>
        </div>
        <div className="p-3 bg-green-50 rounded-md">
          <p className="text-sm text-gray-500">Delivered</p>
          <p className="text-xl font-semibold text-gray-800">1,190</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-md">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="text-xl font-semibold text-gray-800">55</p>
        </div>
      </div>
    </div>
  );
};

export default ShipmentChart;