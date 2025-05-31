import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const ShipmentChart: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [methodData, setMethodData] = useState<{ method: string; count: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [timeData, setTimeData] = useState<{ month: string; count: number }[]>([]);
  const [countryData, setCountryData] = useState<{ country: string; count: number }[]>([]);

  const [summary, setSummary] = useState({
    total: 0,
    delivered: 0,
    inTransit: 0,
    cancelled: 0,
    avgWeight: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
      const result = await response.json();
      const data = JSON.parse(result.body);

      setShipments(data);

      // Key metrics
      const total = data.length;
      const delivered = data.filter((d: any) => d.Status === 'Delivered').length;
      const inTransit = data.filter((d: any) => d.Status === 'In Transit').length;
      const cancelled = data.filter((d: any) => d.Status === 'Cancelled').length;
      const avgWeightRaw = data.reduce((sum: number, d: any) => sum + parseFloat(d['Weight (kg)'] || 0), 0) / total;
      const avgWeight = Math.round(avgWeightRaw * 100) / 100;

      setSummary({ total, delivered, inTransit, cancelled, avgWeight });

      // Method Chart
      const methodMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const method = d['Transport Method'] || 'Unknown';
        methodMap[method] = (methodMap[method] || 0) + 1;
      });
      setMethodData(Object.entries(methodMap).map(([method, count]) => ({ method, count })));

      // Status Pie Chart
      const statusMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const status = d['Status'] || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      setStatusData(Object.entries(statusMap).map(([status, count]) => ({ name: status, value: count })));

      // Time Chart (monthly - assuming 'Date' field is like '2024-12-20')
      const timeMap: Record<string, number> = {};
      data.forEach((d: any) => {
        const date = new Date(d.Date || d['Shipment Date']);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        timeMap[key] = (timeMap[key] || 0) + 1;
      });
      setTimeData(Object.entries(timeMap).map(([month, count]) => ({ month, count })));

      // Country Chart
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
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card label="Total" value={summary.total} color="bg-blue-100" />
        <Card label="Delivered" value={summary.delivered} color="bg-green-100" />
        <Card label="In Transit" value={summary.inTransit} color="bg-yellow-100" />
        <Card label="Cancelled" value={summary.cancelled} color="bg-red-100" />
        <Card label="Avg Weight (kg)" value={summary.avgWeight} color="bg-gray-100" />
      </div>

      {/* Method Chart */}
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

      {/* Status Pie Chart */}
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

      {/* Shipment Trend Chart */}
      <ChartCard title="Monthly Shipment Trend">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Top Countries Chart */}
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
    </div>
  );
};

export default ShipmentChart;

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
