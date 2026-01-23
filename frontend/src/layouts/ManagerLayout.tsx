import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Gauge, BarChart3 } from 'lucide-react';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Sports Week</h1>
          <p className="text-gray-400 text-sm mt-1">Manager Panel</p>
        </div>

        <nav className="mt-8">
          <Link
            to="/manager/dashboard"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Gauge className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/manager/leaderboard"
            className="flex items-center gap-3 px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Leaderboard</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-800">
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Logged in as</p>
            <p className="text-sm font-semibold text-white mt-1">{user?.username}</p>
            <p className="text-xs text-gray-400 mt-1">Manager</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
