import React from 'react';

interface FiltersProps {
  filters: {
    clientName: string;
    company: string;
    status: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

const ShipmentFilters: React.FC<FiltersProps> = ({ filters, onFilterChange }) => {
  const statusOptions = [
    'All Statuses',
    'In Transit',
    'Delivered',
    'Shipped',
    'Pending',
    'Cancelled'
  ];

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <input
          type="text"
          placeholder="Filter by Client Name"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.clientName}
          onChange={(e) => onFilterChange('clientName', e.target.value)}
        />
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Filter by Company"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.company}
          onChange={(e) => onFilterChange('company', e.target.value)}
        />
      </div>
      <div>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ShipmentFilters;