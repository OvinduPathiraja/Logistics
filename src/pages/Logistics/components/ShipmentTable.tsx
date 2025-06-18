import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash } from 'lucide-react';
import { useAuth } from 'react-oidc-context'; 

interface ShipmentFilters {
  clientName: string;
  company: string;
  status: string;
}

interface ShipmentProps {
  filters: ShipmentFilters;
}

interface Shipment {
  id: string;
  email: string;
  clientName: string;
  status: string;
  method: string;
  package: string;
  country: string;
  weight: number;
  dimensions: string;
  cost: string;
}

const ShipmentTable: React.FC<ShipmentProps> = ({ filters }) => {
  const auth = useAuth(); 
  const userEmail = auth.user?.profile?.email ?? ''; 

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        const formattedShipments: Shipment[] = parsedBody.map((item: any) => ({
          id: item['Shipment Number'],
          email: item['Email'],
          clientName: item['Client Name'],
          status: item['Status'],
          method: item['Transport Method'],
          package: item['Package Type'],
          country: item['Country Shipped From'],
          weight: parseFloat(item['Weight (kg)']),
          dimensions: item['Dimensions'],
          cost: `$${parseFloat(item['Logistic Cost']).toFixed(2)}`,
        }));

        const isAdmin = (auth.user?.profile?.['cognito:groups'] as string[] | undefined)?.includes('Admins');
        const userShipments = isAdmin
          ? formattedShipments
          : formattedShipments.filter(shipment => shipment.email === userEmail);

        setShipments(userShipments);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchShipments();
    }
  }, [userEmail]);


  const filteredShipments = shipments.filter((shipment) => {
    const matchesClient = filters.clientName
      ? shipment.clientName.toLowerCase().includes(filters.clientName.toLowerCase())
      : true;

    const matchesStatus = filters.status === 'All Statuses' || !filters.status
      ? true
      : shipment.status === filters.status;

    return matchesClient && matchesStatus;
  });

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'In Transit':
        return 'bg-blue-500 text-white';
      case 'Delivered':
        return 'bg-green-500 text-white';
      case 'Shipped':
        return 'bg-blue-600 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'Cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading shipments...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Shipment ID',
                    'Client Name',
                    'Status',
                    'Method',
                    'Package',
                    'Country',
                    'Weight',
                    'Dimensions',
                    'Cost',
                    'Actions',
                  ].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{shipment.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.clientName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClassName(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.method}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.package}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.country}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.weight}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.dimensions}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{shipment.cost}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900"><Eye className="h-4 w-4" /></button>
                        <button className="text-green-600 hover:text-green-900"><Edit className="h-4 w-4" /></button>
                        <button className="text-red-600 hover:text-red-900"><Trash className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredShipments.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No shipments found matching your filters.</p>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredShipments.length} of {shipments.length} shipments
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShipmentTable;