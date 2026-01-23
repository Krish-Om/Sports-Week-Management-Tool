import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Calendar, TrendingUp, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '../../config/api'
import { PageTransition, CardTransition, StaggerContainer } from '../../components/animations'

interface Match {
  id: string
  game: {
    name: string
  }
  startTime: string
  venue: string
  status: string
  participants: any[]
}

export const PublicDashboard: React.FC = () => {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUpcomingMatches()
  }, [])

  const fetchUpcomingMatches = async () => {
    try {
      setLoading(true)
      const response = await api.get('/matches')
      const allMatches = response.data.data || []

      // Filter upcoming matches and sort by date
      const upcoming = allMatches
        .filter((m: Match) => m.status === 'UPCOMING')
        .sort((a: Match, b: Match) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 3)

      setUpcomingMatches(upcoming)
    } catch (err: any) {
      console.error('Failed to fetch upcoming matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

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
        <PageTransition>
          <div className="grid md:grid-cols-3 gap-6">
            <CardTransition index={0}>
              <Link
                to="/fixtures"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer block"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="bg-blue-50 p-3 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Fixtures</h3>
                    <p className="text-gray-600">View all matches</p>
                  </div>
                </div>
              </Link>
            </CardTransition>

            <CardTransition index={1}>
              <Link
                to="/live"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer block relative overflow-hidden"
              >
                <div className="absolute top-2 right-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="bg-red-50 p-3 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Trophy className="w-8 h-8 text-red-500" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Live Matches</h3>
                    <p className="text-gray-600">Real-time scores</p>
                  </div>
                </div>
              </Link>
            </CardTransition>

            <CardTransition index={2}>
              <Link
                to="/leaderboard"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer block"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="bg-blue-50 p-3 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Leaderboard</h3>
                    <p className="text-gray-600">Faculty standings</p>
                  </div>
                </div>
              </Link>
            </CardTransition>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Matches</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : upcomingMatches.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No upcoming matches at the moment
              </div>
            ) : (
              <StaggerContainer staggerDelay={0.05}>
                {upcomingMatches.map((match, idx) => (
                  <motion.div 
                    key={match.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{match.game?.name}</h3>
                      <p className="text-sm text-gray-600">{match.venue}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatDate(match.startTime)}</p>
                      <motion.span 
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mt-1"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.05 + 0.1, duration: 0.2 }}
                      >
                        Upcoming
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </StaggerContainer>
            )}
          </div>
        </PageTransition>
      </main>
    </div>
  )
}
