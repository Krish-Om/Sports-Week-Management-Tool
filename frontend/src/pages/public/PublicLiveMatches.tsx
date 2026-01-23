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

      <main className="max-w-7xl mx-auto px-3 py-3">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {matches.map((match, idx) => (
                <CardTransition key={match.id} index={idx}>
                  <motion.div
                    className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-400 transition-all overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {/* Header with Game Name and LIVE */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-3 py-2 flex items-center justify-between">
                      <h3 className="text-sm font-bold truncate flex-1">
                        {match.game?.name || 'Unknown'}
                      </h3>
                      <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                        <div className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </div>
                        <span className="text-xs font-semibold">LIVE</span>
                      </div>
                    </div>

                    {/* Match Content */}
                    <div className="p-3">
                      {match.participants && match.participants.length >= 2 ? (
                        <div className="flex items-center justify-between gap-2">
                          {/* Team A */}
                          <motion.div
                            className="flex-1 text-center"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <p className="text-xs font-semibold text-gray-700 truncate mb-1">
                              {(match.participants[0].team?.name || match.participants[0].player?.name || 'Team A').substring(0, 10)}
                            </p>
                            <motion.div
                              className="text-3xl font-bold text-blue-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15, duration: 0.3 }}
                            >
                              {match.participants[0].score}
                            </motion.div>
                            <p className="text-[10px] text-gray-600 mt-0.5">
                              Pts: {match.participants[0].pointsEarned || 0}
                            </p>
                            {match.status === 'FINISHED' && getWinnerName(match) === (match.participants[0].team?.name || match.participants[0].player?.name) && (
                              <motion.div
                                className="flex justify-center mt-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <Trophy className="w-4 h-4 text-yellow-500" />
                              </motion.div>
                            )}
                          </motion.div>

                          {/* VS Divider */}
                          <div className="text-center px-1">
                            <p className="text-xs font-bold text-gray-400">VS</p>
                          </div>

                          {/* Team B */}
                          <motion.div
                            className="flex-1 text-center"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                          >
                            <p className="text-xs font-semibold text-gray-700 truncate mb-1">
                              {(match.participants[1].team?.name || match.participants[1].player?.name || 'Team B').substring(0, 10)}
                            </p>
                            <motion.div
                              className="text-3xl font-bold text-blue-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.15, duration: 0.3 }}
                            >
                              {match.participants[1].score}
                            </motion.div>
                            <p className="text-[10px] text-gray-600 mt-0.5">
                              Pts: {match.participants[1].pointsEarned || 0}
                            </p>
                            {match.status === 'FINISHED' && getWinnerName(match) === (match.participants[1].team?.name || match.participants[1].player?.name) && (
                              <motion.div
                                className="flex justify-center mt-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                              >
                                <Trophy className="w-4 h-4 text-yellow-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-xs py-4 text-center">Waiting for participants...</p>
                      )}
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
