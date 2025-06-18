import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from 'react-oidc-context';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

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

const FinanceStats: React.FC = () => {
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email ?? '';
  const isAdmin = (auth.user?.profile?.['cognito:groups'] as string[] | undefined)?.includes('Admins');

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
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const result = await response.json();
        const data = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;

        const userShipments = isAdmin
          ? data
          : data.filter((d: any) =>
              d['Email']?.toLowerCase() === userEmail.toLowerCase()
            );

        const total = userShipments.length;
        const delivered = userShipments.filter((d: any) => d.Status === 'Delivered').length;
        const inTransit = userShipments.filter((d: any) => d.Status === 'In Transit').length;
        const cancelled = userShipments.filter((d: any) => d.Status === 'Cancelled').length;
        const avgWeight = userShipments.reduce((sum: number, d: any) =>
          sum + parseFloat(d['Weight (kg)'] || '0'), 0) / (total || 1);

        setSummary({
          total,
          delivered,
          inTransit,
          cancelled,
          avgWeight: parseFloat(avgWeight.toFixed(2)),
        });

        const methodMap: Record<string, number> = {};
        const revenueByMethod: Record<string, number> = {};
        const values: number[] = [];

        userShipments.forEach((d: any) => {
          const method = d['Transport Method'] || 'Unknown';
          const value =
            parseFloat(d['Package Cost'] || '0') +
            parseFloat(d['Logistic Cost'] || '0') +
            parseFloat(d['Transportation Cost'] || '0') +
            parseFloat(d['Tax'] || '0');

          values.push(value);
          methodMap[method] = (methodMap[method] || 0) + 1;
          revenueByMethod[method] = (revenueByMethod[method] || 0) + value;
        });

        setMethodData(Object.entries(methodMap).map(([method, count]) => ({ method, count })));
        setRevenueMethodData(
          Object.entries(revenueByMethod).map(([method, revenue]) => ({
            method,
            revenue: Math.round(revenue * 100) / 100,
          }))
        );

        const statusMap: Record<string, number> = {};
        userShipments.forEach((d: any) => {
          const status = d['Status'] || 'Unknown';
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));

        const countryMap: Record<string, number> = {};
        userShipments.forEach((d: any) => {
          const country = d['Country Shipped From'] || 'Unknown';
          countryMap[country] = (countryMap[country] || 0) + 1;
        });
        const sortedCountries = Object.entries(countryMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([country, count]) => ({ country, count }));
        setCountryData(sortedCountries);

        const totalVal = values.reduce((sum, val) => sum + val, 0);
        const avgVal = totalVal / (values.length || 1);
        setTotalValue(Math.round(totalVal * 100) / 100);
        setAvgValue(Math.round(avgVal * 100) / 100);

        const top = [...userShipments]
          .filter((d: any) => d['Status']?.toLowerCase() !== 'cancelled')
          .map((d: any) => ({
            ...d,
            _shipmentValue:
              parseFloat(d['Package Cost'] || '0') +
              parseFloat(d['Logistic Cost'] || '0') +
              parseFloat(d['Transportation Cost'] || '0') +
              parseFloat(d['Tax'] || '0'),
          }))
          .sort((a, b) => b._shipmentValue - a._shipmentValue)
          .slice(0, 5);

        setTopShipments(top);
      } catch (err) {
        console.error('Failed to fetch shipment data:', err);
      }
    };

    if (userEmail) fetchData();
  }, [userEmail, isAdmin]);

  return (
    <div className="space-y-8 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Shipments" value={summary.total} color="bg-blue-100" />
        <Card label="Delivered" value={summary.delivered} color="bg-green-100" />
        <Card label="In Transit" value={summary.inTransit} color="bg-yellow-100" />
        <Card label="Cancelled" value={summary.cancelled} color="bg-red-100" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard title="Shipments by Method">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={methodData}>
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Shipment Status Breakdown">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 5 Shipment Origins">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryData}>
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue by Transport Method">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueMethodData}>
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card label="Total Shipment Value (USD)" value={totalValue} color="bg-purple-100" />
        <Card label="Average Shipment Value (USD)" value={avgValue} color="bg-indigo-100" />
        <Card label="Average Weight (kg)" value={summary.avgWeight} color="bg-pink-100" />
      </div>

      <ChartCard title="Top 5 Highest Value Shipments">
        <ul className="divide-y divide-gray-200">
          {topShipments.map((shipment, index) => (
            <li key={index} className="py-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{shipment['Client Name'] || 'Unknown ID'}</span>
                <span>${shipment._shipmentValue.toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500">
                {shipment['Transport Method']}, {shipment['Status']}
              </div>
            </li>
          ))}
        </ul>
      </ChartCard>
    </div>
  );
};

export default FinanceStats;
