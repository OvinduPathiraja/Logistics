import React from 'react';
import StatCards from './components/StatCards';
import TasksBoard from './components/TasksBoard';
import RecentActivity from './components/RecentActivity';
import ShipmentChart from './components/ShipmentChart';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">

      {/* <StatCards />
      <TasksBoard /> */}
      <ShipmentChart />

    </div>
  );
};

export default DashboardPage;