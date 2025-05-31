import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { 
  LayoutDashboard, 
  Package, 
  Map, 
  BarChart3, 
  ShoppingCart, 
  Users, 
  LogOut, 
  Menu,
  X,
  Bell,
  PackageOpen,
  ChevronDown
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  
  const signOutRedirect = () => {
    auth.signoutRedirect({
    post_logout_redirect_uri: "https://logistics-one-nu.vercel.app/",
  });
    const clientId = "3up0p11te2v4br2jgamahgqc5p";
  const logoutUri = "https://logistics-one-nu.vercel.app/";
  const cognitoDomain = "https://eu-north-1iaaubnabo.auth.eu-north-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};


  const menuItems = [
    { icon: <LayoutDashboard size={20} />, name: "Dashboard", path: "/dashboard" },
    { icon: <Package size={20} />, name: "Logistics", path: "/logistics" },
    { icon: <Map size={20} />, name: "Map", path: "/map" },
    { icon: <BarChart3 size={20} />, name: "Finance", path: "/dashboard/finance" },
    { icon: <ShoppingCart size={20} />, name: "Inventory", path: "/dashboard/inventory" },
    { icon: <Users size={20} />, name: "Customers", path: "/dashboard/customers" },
  ];

  const userEmail = auth.user?.profile.email;
  const userName = auth.user?.profile.name || userEmail?.split('@')[0];
  const userPhone = auth.user?.profile.phone_number;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-[#1e293b] text-white transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <PackageOpen className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">XYZ Logistics</span>
          </div>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 mb-1 transition-colors rounded-md ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </NavLink>
          ))}

          <hr className="my-4 border-gray-700" />

          <button 
            onClick={signOutRedirect}
            className="flex w-full items-center px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span className="ml-3">Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow z-10">
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center ml-auto">
            <div className="relative">
              <button className="relative p-2">
                <Bell size={20} />
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  3
                </span>
              </button>
            </div>
            <div className="relative ml-4">
              <button 
                className="flex items-center space-x-3"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{userName}</p>
                  <p className="text-xs text-gray-500">{userEmail}</p>
                </div>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">{userName}</p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                    {userPhone && (
                      <p className="text-xs text-gray-500 mt-1">{userPhone}</p>
                    )}
                  </div>
                  <div className="px-4 py-2">
                    <button
                      onClick={signOutRedirect}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-red-600"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;