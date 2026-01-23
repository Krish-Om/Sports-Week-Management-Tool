import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { useToast } from '../../contexts/ToastContext'
import { Trophy, Users, Calendar, Wifi, WifiOff, TrendingUp } from 'lucide-react'
import { api } from '../../config/api'
import { StatsSkeleton, LeaderboardSkeleton } from '../../components/Skeleton'

interface Faculty {
  id: string
  name: string
  totalPoints: number
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth()
  const { isConnected, socket } = useSocket()
  const { error: errorToast } = useToast()
  const [stats, setStats] = useState({
    faculties: 0,
    teams: 0,
    upcomingMatches: 0,
  })
  const [leaderboard, setLeaderboard] = useState<Faculty[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [loading, setLoading] = useState(true)
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const [facultiesRes, teamsRes, matchesRes] = await Promise.all([
          api.get('/faculties'),
          api.get('/teams'),
          api.get('/matches'),
        ])

        const faculties = facultiesRes.data.data || []
        const teams = teamsRes.data.data || []
        const matches = matchesRes.data.data || []

        const upcomingMatches = matches.filter(
          (match: any) => match.status === 'UPCOMING'
        ).length

        setStats({
          faculties: faculties.length,
          teams: teams.length,
          upcomingMatches,
        })
      } catch (err) {
        console.error('Failed to fetch stats:', err)        errorToast('Failed to load dashboard statistics')      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Fetch leaderboard
  useEffect(() => {
    fetchLeaderboard()
  }, [refreshTrigger])

  useEffect(() => {
    if (!socket) return

    socket.on('leaderboardUpdate', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    return () => {
      socket.off('leaderboardUpdate')
    }
  }, [socket])

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardLoading(true)
      const response = await api.get('/points/leaderboard')
      setLeaderboard(response.data.data || [])
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
      errorToast('Failed to load leaderboard')
    } finally {
      setLeaderboardLoading(false)
    }
  }

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
        {loading ? (
          <>
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Faculties</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.faculties}</p>
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
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.teams}</p>
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
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingMatches}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </>
        )}
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

      {/* Faculty Leaderboard */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Faculty Leaderboard
          </h2>
          {isConnected && (
            <span className="text-xs text-green-600 font-medium">Live Updates</span>
          )}
        </div>
        {leaderboardLoading ? (
          <LeaderboardSkeleton />
        ) : leaderboard.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No standings available yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((faculty, idx) => {
              const medalEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  '
              const bgColor =
                idx === 0
                  ? 'bg-yellow-50'
                  : idx === 1
                    ? 'bg-gray-50'
                    : idx === 2
                      ? 'bg-orange-50'
                      : ''

              return (
                <div key={faculty.id} className={`flex items-center justify-between p-3 rounded-lg ${bgColor}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{medalEmoji}</span>
                    <span className="font-semibold text-gray-900">{idx + 1}. {faculty.name}</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{faculty.totalPoints} pts</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
