import React, { useState } from 'react';
import ShipmentTable from './components/ShipmentTable';
import ShipmentFilters from './components/ShipmentFilters';

const LogisticsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    clientName: '',
    company: '',
    status: 'All Statuses'
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Logistics Management</h1>
        <div className="mt-4 md:mt-0">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => window.location.href = '/logistics/new-shipment'}>
            + New Shipment
          </button>
        </div>
      </div>

      <ShipmentFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      <ShipmentTable filters={filters} />
    </div>
  );
};

export default LogisticsPage;