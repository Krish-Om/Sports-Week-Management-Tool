import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  Trophy,
  UserCircle,
  LogOut,
  UsersRound,
  Calendar,
  Gamepad2,
} from 'lucide-react'

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/faculties', label: 'Faculties', icon: UsersRound },
    { to: '/admin/games', label: 'Games', icon: Gamepad2 },
    { to: '/admin/teams', label: 'Teams', icon: Users },
    { to: '/admin/players', label: 'Players', icon: UserCircle },
    { to: '/admin/matches', label: 'Matches', icon: Calendar },
    { to: '/admin/users', label: 'Users', icon: Trophy },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary transition px-3 py-2 rounded-md text-sm font-medium"
              >
                Public View
              </Link>
              <div className="flex items-center space-x-2 text-sm">
                <UserCircle className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">{user?.username}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition px-3 py-2 rounded-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent hover:border-primary text-gray-600 hover:text-gray-900 whitespace-nowrap transition"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
