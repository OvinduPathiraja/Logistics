import React from 'react';
import FinanceStats from './components/FinanceStats';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">

      <FinanceStats/>

    </div>
  );
};

export default DashboardPage;