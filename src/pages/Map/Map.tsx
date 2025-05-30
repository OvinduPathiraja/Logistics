import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from 'react-oidc-context';

interface Shipment {
  country: string;
  email: string;
}

const countryCoordinates: Record<string, [number, number]> = {
  'Germany': [51.1657, 10.4515],
  'USA': [37.0902, -95.7129],
  'India': [20.5937, 78.9629],
  'China': [35.8617, 104.1954],
  'UK': [55.3781, -3.4360],
  'Canada': [56.1304, -106.3468],
  'Brazil': [-14.2350, -51.9253],
  'Australia': [-25.2744, 133.7751],
};


const MapPage: React.FC = () => {
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email ?? '';
  const [shipmentsByCountry, setShipmentsByCountry] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await fetch('https://corsproxy.io/?url=https://xa4rzy5lkg.execute-api.eu-north-1.amazonaws.com/prod');
        const data = await response.json();
        const parsedBody = JSON.parse(data.body);

        const filtered = parsedBody.filter((item: any) => item['Email'] === userEmail);
        const countryCounts: Record<string, number> = {};

        filtered.forEach((item: any) => {
          const country = item['Country Shipped From'];
          if (country) {
            countryCounts[country] = (countryCounts[country] || 0) + 1;
          }
        });

        setShipmentsByCountry(countryCounts);
      } catch (err) {
        console.error('Error fetching shipments for map:', err);
      }
    };

    if (userEmail) fetchShipments();
  }, [userEmail]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Shipments by Country</h1>
      <div className="h-[600px] rounded-lg overflow-hidden shadow">
        <MapContainer
  center={[20, 0]}
  zoom={1.5}
  style={{ height: "500px", width: "100%" }}
  scrollWheelZoom={false}
  doubleClickZoom={false}
  zoomControl={false}
  dragging={false}
  touchZoom={false}
  boxZoom={false}
  keyboard={false}
>

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {Object.entries(shipmentsByCountry).map(([country, count]) => {
            const coords = countryCoordinates[country];
            if (!coords) return null;

            return (
              <CircleMarker key={country} center={coords} radius={5 + count} color="blue" fillOpacity={0.5}>
                <Tooltip>{`${country}: ${count} shipments`}</Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
