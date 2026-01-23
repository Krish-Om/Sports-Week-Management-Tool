import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Calendar, TrendingUp } from 'lucide-react'

export const PublicDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🏆 Samriddhi College Sports Week
          </h1>
          <p className="text-gray-600 mt-2">3-Day Athletic Championship</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/fixtures"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Fixtures</h3>
                <p className="text-gray-600">View all matches</p>
              </div>
            </div>
          </Link>

          <Link
            to="/live"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-2 right-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-full">
                <Trophy className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Live Matches</h3>
                <p className="text-gray-600">Real-time scores</p>
              </div>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Leaderboard</h3>
                <p className="text-gray-600">Faculty standings</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h2>
          <div className="text-center text-gray-500 py-8">
            No upcoming matches at the moment
          </div>
        </div>
      </main>
    </div>
  )
}
