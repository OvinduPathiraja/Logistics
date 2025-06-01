import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface Shipment {
  Status?: string;
  'Weight (kg)'?: string;
  'Transport Method'?: string;
  'Country Shipped From'?: string;
  'Shipment Value'?: string;
  'Value (USD)'?: string;
  'Client Name'?: string;
  'Date'?: string;
  'Shipment Date'?: string;
}

interface CardProps {
  label: string;
  value: string | number;
  color: string;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const FinanceStats: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [methodData, setMethodData] = useState<{ method: string; count: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [countryData, setCountryData] = useState<{ country: string; count: number }[]>([]);
  const [revenueMethodData, setRevenueMethodData] = useState<{ method: string; revenue: number }[]>([]);
  const [topShipments, setTopShipments] = useState<Shipment[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    cancelled: 0,
    avgWeight: 0,
  });
  const [totalValue, setTotalValue] = useState(0);
  const [avgValue, setAvgValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const json = await res.json();
        const data: Shipment[] = JSON.parse(json.body);
        setShipments(data);

        const total = data.length;
        const delivered = data.filter(s => s.Status === 'Delivered').length;
        const inTransit = data.filter(s => s.Status === 'In Transit').length;
        const cancelled = data.filter(s => s.Status === 'Cancelled').length;

        const avgWeight = data.reduce((sum, s) => sum + parseFloat(s['Weight (kg)'] || '0'), 0) / total;

        setSummary({
          total,
          delivered,
          inTransit,
          cancelled,
          avgWeight: parseFloat(avgWeight.toFixed(2)),
        });

        // Method count
        const methodMap: Record<string, number> = {};
        data.forEach(s => {
          const method = s['Transport Method'] || 'Unknown';
          methodMap[method] = (methodMap[method] || 0) + 1;
        });
        setMethodData(Object.entries(methodMap).map(([method, count]) => ({ method, count })));

        // Status distribution
        const statusMap: Record<string, number> = {};
        data.forEach(s => {
          const status = s.Status || 'Unknown';
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

        // Country origin
        const countryMap: Record<string, number> = {};
        data.forEach(s => {
          const country = s['Country Shipped From'] || 'Unknown';
          countryMap[country] = (countryMap[country] || 0) + 1;
        });
        const topCountries = Object.entries(countryMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, count]) => ({ country, count }));
        setCountryData(topCountries);

        // Shipment values
        const values = data.map(s => parseFloat(s['Shipment Value'] || s['Value (USD)'] || '0'));
        const totalVal = values.reduce((sum, v) => sum + v, 0);
        const avgVal = totalVal / values.length;

        setTotalValue(parseFloat(totalVal.toFixed(2)));
        setAvgValue(parseFloat(avgVal.toFixed(2)));

        // Revenue by method
        const revenueMap: Record<string, number> = {};
        data.forEach(s => {
          const method = s['Transport Method'] || 'Unknown';
          const val = parseFloat(s['Shipment Value'] || s['Value (USD)'] || '0');
          revenueMap[method] = (revenueMap[method] || 0) + val;
        });
        const revenueData = Object.entries(revenueMap).map(([method, revenue]) => ({
          method,
          revenue: parseFloat(revenue.toFixed(2)),
        }));
        setRevenueMethodData(revenueData);

        // Top 5 high-value shipments
        const top = [...data]
          .sort((a, b) =>
            parseFloat(b['Shipment Value'] || '0') - parseFloat(a['Shipment Value'] || '0')
          )
          .slice(0, 5);
        setTopShipments(top);
      } catch (err) {
        console.error('Failed to fetch shipment data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card label="Total" value={summary.total} color="bg-blue-100" />
        <Card label="Delivered" value={summary.delivered} color="bg-green-100" />
        <Card label="In Transit" value={summary.inTransit} color="bg-yellow-100" />
        <Card label="Cancelled" value={summary.cancelled} color="bg-red-100" />
        <Card label="Avg Weight (kg)" value={summary.avgWeight} color="bg-gray-100" />
        <Card label="Total Value ($)" value={totalValue} color="bg-purple-100" />
        <Card label="Avg Value ($)" value={avgValue} color="bg-indigo-100" />
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <ChartCard title="By Transport Method">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={methodData}>
                <XAxis dataKey="method" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="w-full md:w-1/2">
          <ChartCard title="Status Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Top 5 Origin Countries">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={countryData}>
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Revenue by Transport Method">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={revenueMethodData}>
            <XAxis dataKey="method" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 5 High-Value Shipments">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Client</th>
                <th className="p-2">Method</th>
                <th className="p-2">Value ($)</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {topShipments.map((s, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{s['Client Name'] || 'N/A'}</td>
                  <td className="p-2">{s['Transport Method'] || 'Unknown'}</td>
                  <td className="p-2">{parseFloat(s['Shipment Value'] || '0').toFixed(2)}</td>
                  <td className="p-2">{s.Date || s['Shipment Date'] || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

export default FinanceStats;

const Card: React.FC<CardProps> = ({ label, value, color }) => (
  <div className={`p-4 rounded shadow ${color}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-md font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
  </div>
);
