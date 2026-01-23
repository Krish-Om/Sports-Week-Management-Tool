import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { api } from '../../config/api'
import { Clock, Trophy, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition, CardTransition } from '../../components/animations'

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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Live Matches</h1>
              </div>
              <p className="text-gray-600 mt-1">Real-time scores and updates</p>
            </motion.div>
            {isConnected && (
              <motion.div 
                className="flex items-center gap-2 text-green-600"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">Connected</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PageTransition>
          {matches.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No live matches right now</p>
              <p className="text-gray-500 text-sm mt-2">Check back later for live action!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <CardTransition key={match.id} index={idx}>
                  <motion.div 
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Compact Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative flex h-2 w-2 flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </div>
                          <h2 className="text-lg font-bold text-white truncate drop-shadow-lg">
                            {match.game?.name || 'Unknown Game'}
                          </h2>
                        </div>
                        <span className="text-xs font-semibold whitespace-nowrap bg-white/20 px-2 py-1 rounded">LIVE</span>
                      </div>
                    </div>

                    {/* Compact Score Display */}
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {match.participants && match.participants.length > 0 ? (
                          match.participants.map((participant, pidx) => (
                            <motion.div
                              key={participant.id}
                              className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-400 transition-colors text-center"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + pidx * 0.05, duration: 0.2 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <p className="text-xs font-semibold text-gray-700 truncate flex-1">
                                  {participant.team?.name || participant.player?.name || 'Unknown'}
                                </p>
                                {match.status === 'FINISHED' && getWinnerName(match) === (participant.team?.name || participant.player?.name) && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                  >
                                    <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                  </motion.div>
                                )}
                              </div>

                              <motion.div 
                                className="text-2xl font-bold text-gray-900 mb-1"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.25 + pidx * 0.05, duration: 0.3 }}
                              >
                                {participant.score}
                              </motion.div>

                              <div className="text-xs text-gray-600 space-y-0.5">
                                {participant.pointsEarned !== undefined && (
                                  <p>Pts: <span className="font-semibold">{participant.pointsEarned}</span></p>
                                )}
                                {participant.result && (
                                  <p className="text-blue-600 font-semibold">{participant.result}</p>
                                )}
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <p className="col-span-2 md:col-span-4 text-gray-600 text-sm py-4 text-center">No participants added yet</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </CardTransition>
              ))}
            </div>
          )}
        </PageTransition>
      </main>
    </div>
  )
}
