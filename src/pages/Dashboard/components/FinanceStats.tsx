import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const FinanceStats: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [methodData, setMethodData] = useState<{ method: string; count: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [countryData, setCountryData] = useState<{ country: string; count: number }[]>([]);

  const [summary, setSummary] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    cancelled: 0,
    avgWeight: 0,
  });

  const [totalValue, setTotalValue] = useState(0);
  const [avgValue, setAvgValue] = useState(0);
  const [revenueMethodData, setRevenueMethodData] = useState<{ method: string; revenue: number }[]>([]);
  const [topShipments, setTopShipments] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
      const result = await response.json();
      const data = JSON.parse(result.body);

      setShipments(data);

      const total = data.length;
      const delivered = data.filter((d: any) => d.Status === 'Delivered').length;
      const inTransit = data.filter((d: any) => d.Status === 'In Transit').length;
      const cancelled = data.filter((d: any) => d.Status === 'Cancelled').length;
      const avgWeight =
        data.reduce((sum: number, d: any) => sum + parseFloat(d['Weight (kg)'] || 0), 0) / total;

      setSummary({ total, delivered, inTransit, cancelled, avgWeight: parseFloat(avgWeight.toFixed(2))
 });

      const methodMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const method = d['Transport Method'] || 'Unknown';
        methodMap[method] = (methodMap[method] || 0) + 1;
      });
      setMethodData(Object.entries(methodMap).map(([method, count]) => ({ method, count })));

      const statusMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const status = d['Status'] || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      setStatusData(Object.entries(statusMap).map(([status, count]) => ({ name: status, value: count })));

      const countryMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const country = d['Country Shipped From'] || 'Unknown';
        countryMap[country] = (countryMap[country] || 0) + 1;
      });
      const sortedCountries = Object.entries(countryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([country, count]) => ({ country, count }));
      setCountryData(sortedCountries);

      const values = data.map((d: any) => parseFloat(d['Shipment Value'] || d['Value (USD)'] || 0));
      const totalValue = values.reduce((sum: number, val: number) => sum + val, 0);
      const avgValue = Math.round((totalValue / values.length) * 100) / 100;

      const revenueByMethod: Record<string, number> = {};
      data.forEach((d: any) => {
        const method = d['Transport Method'] || 'Unknown';
        const value = parseFloat(d['Shipment Value'] || d['Value (USD)'] || 0);
        revenueByMethod[method] = (revenueByMethod[method] || 0) + value;
      });
      const revenueMethodData = Object.entries(revenueByMethod).map(([method, revenue]) => ({
        method,
        revenue: Math.round(revenue * 100) / 100,
      }));

      const topShipments = [...data]
        .sort((a, b) => parseFloat(b['Shipment Value'] || 0) - parseFloat(a['Shipment Value'] || 0))
        .slice(0, 5);

      setTotalValue(Math.round(totalValue * 100) / 100);
      setAvgValue(avgValue);
      setRevenueMethodData(revenueMethodData);
      setTopShipments(topShipments);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card label="Total" value={summary.total} color="bg-blue-100" />
        <Card label="Delivered" value={summary.delivered} color="bg-green-100" />
        <Card label="In Transit" value={summary.inTransit} color="bg-yellow-100" />
        <Card label="Cancelled" value={summary.cancelled} color="bg-red-100" />
        <Card label="Avg Weight (kg)" value={summary.avgWeight} color="bg-gray-100" />
      </div>

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

      <ChartCard title="Status Distribution">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              fill="#8884d8"
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

      <h2 className="text-xl font-bold text-gray-800 mt-10">Finance Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <Card label="Total Shipment Value ($)" value={totalValue} color="bg-purple-100" />
        <Card label="Avg Shipment Value ($)" value={avgValue} color="bg-indigo-100" />
      </div>

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
                  <td className="p-2">{parseFloat(s['Shipment Value'] || 0).toFixed(2)}</td>
                  <td className="p-2">{s['Date'] || s['Shipment Date']}</td>
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

const Card = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className={`p-4 rounded shadow ${color}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-md font-semibold mb-4 text-gray-700">{title}</h2>
    {children}
  </div>
);
