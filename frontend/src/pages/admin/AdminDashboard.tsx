import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { Trophy, Users, Calendar, Wifi, WifiOff } from 'lucide-react'

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const { isConnected } = useSocket()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <Wifi className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <WifiOff className="w-5 h-5" />
              <span className="text-sm font-medium">Disconnected</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Faculties</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Teams</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full">
              <Users className="w-8 h-8 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Upcoming Matches</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left">
            <h3 className="font-semibold text-gray-900">Add New Game</h3>
            <p className="text-sm text-gray-600 mt-1">Create a new game for the sports week</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left">
            <h3 className="font-semibold text-gray-900">Schedule Match</h3>
            <p className="text-sm text-gray-600 mt-1">Schedule a new match between teams</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left">
            <h3 className="font-semibold text-gray-900">Add Players</h3>
            <p className="text-sm text-gray-600 mt-1">Register players for their faculties</p>
          </button>
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition text-left">
            <h3 className="font-semibold text-gray-900">View Leaderboard</h3>
            <p className="text-sm text-gray-600 mt-1">Check current faculty standings</p>
          </button>
        </div>
      </div>
    </div>
  )
}
