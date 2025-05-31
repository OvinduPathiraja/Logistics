import React from 'react';
import ShipmentChart from './components/ShipmentChart';
import FinanceStats from './components/FinanceStats';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">

      <FinanceStats/>
      <ShipmentChart />

    </div>
  );
};

export default DashboardPage;