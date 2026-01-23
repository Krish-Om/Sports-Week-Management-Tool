import React, { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { api } from '../../config/api'
import { Calendar, Clock, MapPin, Loader } from 'lucide-react'

interface Match {
  id: string
  gameId: string
  game: {
    name: string
  }
  startTime: string
  venue: string
  status: 'UPCOMING' | 'LIVE' | 'FINISHED'
  participants: any[]
}

export const PublicFixtures: React.FC = () => {
  const { isConnected } = useSocket()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await api.get('/matches')
      const allMatches = response.data.data || []
      
      // Fetch detailed match info for each match
      const detailedMatches = await Promise.all(
        allMatches.map(async (match: Match) => {
          try {
            const detailResponse = await api.get(`/matches/${match.id}`)
            return detailResponse.data.data
          } catch (err) {
            console.error(`Failed to fetch details for match ${match.id}:`, err)
            return match
          }
        })
      )

      setMatches(detailedMatches)
    } catch (err: any) {
      console.error('Failed to fetch matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Upcoming</span>
      case 'LIVE':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Live
          </span>
        )
      case 'FINISHED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Finished</span>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading fixtures...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Fixtures</h1>
              <p className="text-gray-600 mt-1">All scheduled matches</p>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No matches scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer"
              >
                <button
                  onClick={() => setExpandedMatchId(expandedMatchId === match.id ? null : match.id)}
                  className="w-full p-4 text-left hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{match.game?.name || 'Unknown Game'}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(match.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(match.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{match.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(match.status)}
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedMatchId === match.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedMatchId === match.id && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-3">Participants</h4>
                    <div className="space-y-2">
                      {match.participants && match.participants.length > 0 ? (
                        match.participants.map((participant, idx) => (
                          <div key={participant.id} className="flex items-center justify-between bg-white p-3 rounded">
                            <span className="text-sm text-gray-900">
                              {idx + 1}. {participant.team?.name || participant.player?.name || 'Unknown'}
                            </span>
                            {match.status === 'FINISHED' && (
                              <span className="text-sm font-semibold text-gray-600">
                                Score: {participant.score}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">No participants added yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
