import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Truck,
  Warehouse,
  ShoppingBag,
  QrCode,
  Users,
  Search,
  User,
  Settings,
  LogOut,
  Cpu
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user.role.toLowerCase();

  const getRoleNavLinks = () => {
    switch (role) {
      case 'farmer':
        return [
          { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
          { name: 'Add Batch', path: '/farmer/add-batch', icon: PlusCircle },
          { name: 'My Batches', path: '/farmer/my-batches', icon: Package },
        ];
      case 'transport':
        return [
          { name: 'Dashboard', path: '/transport/dashboard', icon: LayoutDashboard },
          { name: 'Shipment Tracking', path: '/transport/dashboard#shipments', icon: Truck },
          { name: 'Scan Batch QR', path: '/transport/dashboard#scan', icon: QrCode },
        ];
      case 'warehouse':
        return [
          { name: 'Dashboard', path: '/warehouse/dashboard', icon: LayoutDashboard },
          { name: 'Receive Batch', path: '/warehouse/dashboard#receive', icon: QrCode },
          { name: 'Inventory Table', path: '/warehouse/dashboard#inventory', icon: Warehouse },
        ];
      case 'retailer':
        return [
          { name: 'Dashboard', path: '/retailer/dashboard', icon: LayoutDashboard },
          { name: 'Receive Product', path: '/retailer/dashboard#receive', icon: QrCode },
          { name: 'Store Inventory', path: '/retailer/dashboard#inventory', icon: ShoppingBag },
        ];
      case 'admin':
        return [
          { name: 'Admin Overview', path: '/admin/panel', icon: LayoutDashboard },
          { name: 'Manage Users', path: '/admin/panel#users', icon: Users },
          { name: 'Blockchain Explorer', path: '/explorer', icon: Search },
        ];
      default:
        return [
          { name: 'Verify Product', path: '/verify', icon: Search },
        ];
    }
  };

  const navLinks = getRoleNavLinks();

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        
        {/* User Info Header */}
        <div className="p-3 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-agri-600 text-white flex items-center justify-center font-bold text-base shadow-agri">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{user.name}</h4>
              <span className="text-[11px] font-semibold text-agri-600 dark:text-agri-400 capitalize px-2 py-0.5 rounded-full bg-agri-50 dark:bg-agri-950/60 border border-agri-200 dark:border-agri-800 inline-block mt-0.5">
                {user.role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Role Navigation Menu */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
            Main Menu
          </span>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-agri-600 text-white shadow-agri font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-agri-600 dark:hover:text-agri-400'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* System Utilities */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 block mb-2">
            Utilities
          </span>
          <nav className="space-y-1">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-600 text-white shadow-agri'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-agri-600 dark:hover:text-agri-400'
                }`
              }
            >
              <User className="w-5 h-5" />
              Profile
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-600 text-white shadow-agri'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-agri-600 dark:hover:text-agri-400'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              Settings
            </NavLink>
            <NavLink
              to="/future-scope"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-600 text-white shadow-agri'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-500 dark:hover:text-amber-400'
                }`
              }
            >
              <Cpu className="w-5 h-5 text-amber-500" />
              Future Scope
            </NavLink>
          </nav>
        </div>

      </div>

      {/* Logout Footer Button */}
      <button
        onClick={handleLogout}
        className="w-full mt-6 flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </aside>
  );
}
