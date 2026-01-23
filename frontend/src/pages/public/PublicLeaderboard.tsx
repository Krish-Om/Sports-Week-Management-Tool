import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { api } from '../../config/api'
import { Trophy, Loader, TrendingUp } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  type: 'TEAM' | 'PLAYER' | 'FACULTY'
  wins: number
  losses: number
  draws: number
  points: number
  gamesPlayed: number
}

export const PublicLeaderboard: React.FC = () => {
  const { isConnected, socket } = useSocket()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'teams' | 'faculties'>('all')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchLeaderboard()
  }, [refreshTrigger, filter])

  useEffect(() => {
    if (!socket) return

    socket.on('matchStatusChange', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    socket.on('matchWinnerSet', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    return () => {
      socket.off('matchStatusChange')
      socket.off('matchWinnerSet')
    }
  }, [socket])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await api.get('/matches')
      const matches = response.data.data || []

      // Calculate leaderboard from finished matches
      const statsMap = new Map<string, LeaderboardEntry>()

      for (const match of matches) {
        if (match.status !== 'FINISHED' || !match.participants) continue

        // Match already has full details from the list endpoint
        for (const participant of match.participants || []) {
          const key = participant.teamId || participant.playerId
          const name = participant.team?.name || participant.player?.name || 'Unknown'

          if (!statsMap.has(key)) {
            statsMap.set(key, {
              id: key,
              name,
              type: participant.teamId ? 'TEAM' : 'PLAYER',
              wins: 0,
              losses: 0,
              draws: 0,
              points: 0,
              gamesPlayed: 0,
            })
          }

          const entry = statsMap.get(key)!
          entry.gamesPlayed++

          if (match.winnerId === key) {
            entry.wins++
            entry.points += 3
          } else if (participant.result === 'DRAW') {
            entry.draws++
            entry.points += 1
          } else if (participant.result === 'LOSS') {
            entry.losses++
          }

          entry.points += participant.pointsEarned || 0
        }
      }

      let entries = Array.from(statsMap.values())

      // Apply filter
      if (filter === 'teams') {
        entries = entries.filter((e) => e.type === 'TEAM')
      } else if (filter === 'faculties') {
        entries = entries.filter((e) => e.type === 'FACULTY')
      }

      // Sort by points descending, then by wins
      entries.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        return b.wins - a.wins
      })

      setLeaderboard(entries)
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
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
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
                <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
              </div>
              <p className="text-gray-600 mt-1">Faculty and team standings</p>
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
        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {['all', 'teams', 'faculties'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-primary'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No matches completed yet</p>
            <p className="text-gray-500 text-sm mt-2">Leaderboard will be populated as matches are finished</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Played</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Wins</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Draws</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Losses</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((entry, idx) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gray-50 transition ${
                      idx === 0 ? 'bg-yellow-50' : idx === 1 ? 'bg-gray-50' : idx === 2 ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {idx === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {idx === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                        {idx === 2 && <Trophy className="w-5 h-5 text-orange-500" />}
                        <span className="font-semibold text-gray-900">#{idx + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{entry.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{entry.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-900 font-medium">{entry.gamesPlayed}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {entry.wins}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                        {entry.draws}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                        {entry.losses}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-lg font-bold text-primary">{entry.points}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
