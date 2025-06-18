import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';

interface FinanceRecord {
  clientName: string;
  email: string;
  company: string;
  logisticCost: number;
  packageCost: number;
  transportationCost: number;
  tax: number;
  totalValue: number;
}

const FinanceDetails: React.FC = () => {
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email ?? '';
  const isAdmin = (auth.user?.profile?.['cognito:groups'] as string[] | undefined)?.includes('Admins');

  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const data = await response.json();
        const parsed = JSON.parse(data.body);

        const userRecords = parsed
          .filter((entry: any) => isAdmin || entry['Email']?.toLowerCase() === userEmail.toLowerCase())
          .map((entry: any) => {
            const logisticCost = parseFloat(entry['Logistic Cost'] || '0');
            const packageCost = parseFloat(entry['Package Cost'] || '0');
            const transportCost = parseFloat(entry['Transportation Cost'] || '0');
            const tax = parseFloat(entry['Tax'] || '0');

            return {
              clientName: entry['Client Name'],
              email: entry['Email'],
              company: entry['Company'],
              logisticCost,
              packageCost,
              transportationCost: transportCost,
              tax,
              totalValue: parseFloat((logisticCost + packageCost + transportCost + tax).toFixed(2)),
            };
          });

        setRecords(userRecords);
      } catch (error) {
        console.error('Finance data fetch failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchFinanceData();
    }
  }, [userEmail, isAdmin]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading ? (
        <div className="text-center py-6">
          <p className="text-gray-500">Loading finance records...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    'Client Name',
                    'Company',
                    'Logistic Cost',
                    'Package Cost',
                    'Transport Cost',
                    'Tax',
                    'Total Value',
                  ].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((rec, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{rec.clientName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{rec.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${rec.logisticCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${rec.packageCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${rec.transportationCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${rec.tax.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-700">${rec.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {records.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No finance data available.</p>
            </div>
          )}

          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {records.length} finance records
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

export default FinanceDetails;
