import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { api } from '../../config/api'
import { Trophy, Loader } from 'lucide-react'

interface FacultyLeaderboard {
  id: string
  name: string
  totalPoints: number
}

export const PublicLeaderboard: React.FC = () => {
  const { isConnected, socket } = useSocket()
  const [leaderboard, setLeaderboard] = useState<FacultyLeaderboard[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchLeaderboard()
  }, [refreshTrigger])

  useEffect(() => {
    if (!socket) return

    // Listen for real-time leaderboard updates
    socket.on('leaderboardUpdate', () => {
      console.log('📊 Leaderboard updated via Socket.io')
      setRefreshTrigger((prev) => prev + 1)
    })

    // Also listen for match status changes that might affect leaderboard
    socket.on('matchStatusChange', (data) => {
      // Only refresh if match is now FINISHED
      if (data?.status === 'FINISHED') {
        setRefreshTrigger((prev) => prev + 1)
      }
    })

    return () => {
      socket.off('leaderboardUpdate')
      socket.off('matchStatusChange')
    }
  }, [socket])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/points/leaderboard')
      setLeaderboard(response.data.data || [])
    } catch (err: any) {
      console.error('Failed to fetch leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-3xl font-bold text-gray-900">Faculty Leaderboard</h1>
              </div>
              <p className="text-gray-600 mt-1">Overall standings across all games</p>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Leaderboard Table */}
        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No faculties available yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Faculty</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Total Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((faculty, idx) => {
                  const medalEmoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  '
                  const bgColor =
                    idx === 0
                      ? 'bg-yellow-50'
                      : idx === 1
                        ? 'bg-gray-100'
                        : idx === 2
                          ? 'bg-orange-50'
                          : ''

                  return (
                    <tr key={faculty.id} className={`hover:bg-opacity-75 transition ${bgColor}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{medalEmoji}</span>
                          <span className="font-bold text-lg text-gray-900">#{idx + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-lg">{faculty.name}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-2xl font-bold text-blue-600">{faculty.totalPoints}</p>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
