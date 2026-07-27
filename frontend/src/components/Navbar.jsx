import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Sprout, LogOut, User, Search, Cpu, ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'farmer': return '/farmer/dashboard';
      case 'transport': return '/transport/dashboard';
      case 'warehouse': return '/warehouse/dashboard';
      case 'retailer': return '/retailer/dashboard';
      case 'admin': return '/admin/panel';
      default: return '/verify';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-500 flex items-center justify-center text-white shadow-agri group-hover:scale-105 transition-transform duration-300">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-agri-700 via-agri-600 to-agri-500 bg-clip-text text-transparent dark:from-agri-400 dark:to-agri-300">
              AgriChain
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-agri-100 dark:bg-agri-950 text-agri-700 dark:text-agri-300 border border-agri-200 dark:border-agri-800">
              Web3 Supply Chain
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link 
            to="/" 
            className={`transition-colors hover:text-agri-600 dark:hover:text-agri-400 ${location.pathname === '/' ? 'text-agri-600 dark:text-agri-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            Home
          </Link>
          <Link 
            to="/verify" 
            className={`flex items-center gap-1.5 transition-colors hover:text-agri-600 dark:hover:text-agri-400 ${location.pathname === '/verify' ? 'text-agri-600 dark:text-agri-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            <ShieldCheck className="w-4 h-4 text-agri-600" />
            Verify Product
          </Link>
          <Link 
            to="/explorer" 
            className={`flex items-center gap-1.5 transition-colors hover:text-agri-600 dark:hover:text-agri-400 ${location.pathname === '/explorer' ? 'text-agri-600 dark:text-agri-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            <Search className="w-4 h-4 text-agri-600" />
            Blockchain Explorer
          </Link>
          <Link 
            to="/future-scope" 
            className={`flex items-center gap-1.5 transition-colors hover:text-agri-600 dark:hover:text-agri-400 ${location.pathname === '/future-scope' ? 'text-agri-600 dark:text-agri-400 font-semibold' : 'text-slate-600 dark:text-slate-300'}`}
          >
            <Cpu className="w-4 h-4 text-amber-500" />
            Future Scope
          </Link>
        </nav>

        {/* Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
              <Link 
                to={getDashboardPath()}
                className="hidden sm:flex flex-col text-right cursor-pointer group"
              >
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-agri-600 transition-colors">
                  {user.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-agri-600 dark:text-agri-400">
                  {user.role} Dashboard
                </span>
              </Link>
              
              <Link
                to={getDashboardPath()}
                className="w-9 h-9 rounded-xl bg-agri-100 dark:bg-agri-950 text-agri-700 dark:text-agri-300 flex items-center justify-center font-bold text-sm border border-agri-300 dark:border-agri-700 hover:ring-2 hover:ring-agri-500 transition-all"
                title="Go to Dashboard"
              >
                {user.name.charAt(0).toUpperCase()}
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-agri-600 dark:hover:text-agri-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-agri-600 hover:bg-agri-700 rounded-xl shadow-md hover:shadow-agri transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
