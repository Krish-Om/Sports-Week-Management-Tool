import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { api } from '../../config/api'
import { Clock, Trophy, Loader } from 'lucide-react'

interface Match {
  id: string
  gameId: string
  game: {
    name: string
  }
  status: 'UPCOMING' | 'LIVE' | 'FINISHED'
  participants: any[]
  winnerId?: string | null
}

export const PublicLiveMatches: React.FC = () => {
  const { isConnected, socket } = useSocket()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchMatches()
  }, [refreshTrigger])

  useEffect(() => {
    if (!socket) return

    // Listen for real-time updates
    socket.on('scoreUpdate', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    socket.on('matchStatusChange', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    socket.on('matchWinnerSet', () => {
      setRefreshTrigger((prev) => prev + 1)
    })

    return () => {
      socket.off('scoreUpdate')
      socket.off('matchStatusChange')
      socket.off('matchWinnerSet')
    }
  }, [socket])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await api.get('/matches')
      const allMatches = response.data.data || []

      // Filter only LIVE matches
      const liveMatches = allMatches.filter((m: Match) => m.status === 'LIVE')

      setMatches(liveMatches)
    } catch (err: any) {
      console.error('Failed to fetch live matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const getWinnerName = (match: Match) => {
    if (!match.winnerId || !match.participants) return null
    const winner = match.participants.find(
      (p) => p.teamId === match.winnerId || p.playerId === match.winnerId
    )
    return winner ? winner.team?.name || winner.player?.name : null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading live matches...</p>
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
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Live Matches</h1>
              </div>
              <p className="text-gray-600 mt-1">Real-time scores and updates</p>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Connected</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No live matches right now</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for live action!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div key={match.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
                  <h2 className="text-2xl font-bold">{match.game?.name || 'Unknown Game'}</h2>
                  <div className="flex items-center gap-2 mt-2 text-sm opacity-90">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </div>
                    <span>LIVE NOW</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {match.participants && match.participants.length > 0 ? (
                      match.participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-primary transition"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">
                              {participant.team?.name || participant.player?.name || 'Unknown'}
                            </h3>
                            {match.status === 'FINISHED' && getWinnerName(match) === (participant.team?.name || participant.player?.name) && (
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            )}
                          </div>

                          <div className="text-4xl font-bold text-gray-900 mb-3">{participant.score}</div>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-white p-2 rounded">
                              <p className="text-gray-600 text-xs">Points Earned</p>
                              <p className="font-semibold text-gray-900">{participant.pointsEarned || 0}</p>
                            </div>
                            {participant.result && (
                              <div className="bg-white p-2 rounded">
                                <p className="text-gray-600 text-xs">Result</p>
                                <p className="font-semibold text-gray-900">{participant.result}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-2 text-gray-600">No participants added yet</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
