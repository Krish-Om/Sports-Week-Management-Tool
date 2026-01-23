import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { Loader, AlertCircle } from 'lucide-react';
import api from '../../config/api';

interface Game {
  id: string;
  name: string;
  type: 'TEAM' | 'INDIVIDUAL';
  pointWeight: number;
  managerId: string | null;
}

interface Match {
  id: string;
  gameId: string;
  startTime: string;
  venue: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  winnerId?: string | null;
  participants?: MatchParticipant[];
}

interface MatchParticipant {
  id: string;
  matchId: string;
  teamId?: string | null;
  playerId?: string | null;
  score: number;
  pointsEarned: number;
  team?: { name: string; id: string };
  player?: { name: string; id: string };
}

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [assignedGames, setAssignedGames] = useState<Game[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  useEffect(() => {
    fetchAssignedGames();
  }, [user?.id]);

  useEffect(() => {
    if (selectedGameId) {
      fetchMatches(selectedGameId);
    }
  }, [selectedGameId]);

  // Listen for real-time score updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('scoreUpdate', () => {
      fetchMatches(selectedGameId);
    });

    socket.on('matchStatusChange', () => {
      fetchMatches(selectedGameId);
    });

    socket.on('matchWinnerSet', () => {
      fetchMatches(selectedGameId);
    });

    return () => {
      socket.off('scoreUpdate');
      socket.off('matchStatusChange');
      socket.off('matchWinnerSet');
    };
  }, [socket, selectedGameId]);

  const fetchAssignedGames = async () => {
    try {
      setLoading(true);
      const response = await api.get('/games');
      const games = response.data.data;

      // Filter games assigned to current manager
      const managerGames = games.filter((game: Game) => game.managerId === user?.id);
      setAssignedGames(managerGames);

      if (managerGames.length > 0) {
        setSelectedGameId(managerGames[0].id);
      }
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch assigned games');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (gameId: string) => {
    try {
      const response = await api.get('/matches');
      const allMatches = response.data.data;

      // Filter matches for the selected game
      const gameMatches = allMatches.filter((match: Match) => match.gameId === gameId);
      
      // Fetch detailed match info (with participants) for each match
      const detailedMatches = await Promise.all(
        gameMatches.map(async (match: Match) => {
          try {
            const detailResponse = await api.get(`/matches/${match.id}`);
            return detailResponse.data.data;
          } catch (err) {
            console.error(`Failed to fetch details for match ${match.id}:`, err);
            return match;
          }
        })
      );
      
      setMatches(detailedMatches);
    } catch (err: any) {
      console.error('Failed to fetch matches:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your games...</p>
        </div>
      </div>
    );
  }

  if (assignedGames.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-md mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-yellow-600 mb-2" />
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">No Games Assigned</h2>
            <p className="text-yellow-800">
              You don't have any games assigned yet. Contact the admin to assign games to your
              account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your assigned games and update match scores</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Game Selection */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedGames.map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGameId(game.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGameId === game.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-blue-400'
                }`}
              >
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{game.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Type: <span className="font-medium">{game.type}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Points Weight: <span className="font-medium">{game.pointWeight}x</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Matches for {assignedGames.find((g) => g.id === selectedGameId)?.name}
          </h2>

          {matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No matches found for this game</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onUpdate={() => fetchMatches(selectedGameId)}
                  socket={socket}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  onUpdate: () => void;
  socket: any;
}

function MatchCard({ match, onUpdate, socket }: MatchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize scores from participants
    if (match.participants) {
      const initialScores: Record<string, number> = {};
      match.participants.forEach((p) => {
        initialScores[p.id] = p.score;
      });
      setScores(initialScores);
    }
  }, [match.participants, isExpanded]);

  const handleScoreChange = (participantId: string, newScore: number) => {
    setScores({ ...scores, [participantId]: newScore });
  };

  const handleSaveScores = async () => {
    try {
      setIsUpdating(true);

      // Update each participant's score
      for (const participant of match.participants || []) {
        if (scores[participant.id] !== participant.score) {
          await api.put(`/match-participants/${participant.id}`, {
            score: scores[participant.id],
          });
        }
      }

      // Emit Socket.io event for live updates
      if (socket) {
        socket.emit('scoreUpdate', {
          matchId: match.id,
          gameId: match.gameId,
          participants: match.participants?.map((p) => ({
            id: p.id,
            score: scores[p.id] || p.score,
            name: p.team?.name || p.player?.name,
          })),
        });
      }

      onUpdate();
      setIsExpanded(false);
    } catch (err: any) {
      console.error('Failed to update scores:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: 'UPCOMING' | 'LIVE' | 'FINISHED') => {
    try {
      setIsUpdating(true);
      await api.put(`/matches/${match.id}`, { status: newStatus });

      // Emit Socket.io event
      if (socket) {
        socket.emit('matchStatusChange', {
          matchId: match.id,
          gameId: match.gameId,
          newStatus,
        });
      }

      onUpdate();
    } catch (err: any) {
      console.error('Failed to update match status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWinnerChange = async (winnerId: string) => {
    try {
      setIsUpdating(true);
      await api.put(`/matches/${match.id}`, { winnerId: winnerId || null });

      // Emit Socket.io event
      if (socket) {
        socket.emit('matchWinnerSet', {
          matchId: match.id,
          gameId: match.gameId,
          winnerId,
        });
      }

      onUpdate();
    } catch (err: any) {
      console.error('Failed to update match winner:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'LIVE':
        return 'bg-green-100 text-green-800';
      case 'FINISHED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWinnerName = () => {
    if (!match.winnerId || !match.participants) return null;
    const winner = match.participants.find(
      (p) => p.teamId === match.winnerId || p.playerId === match.winnerId
    );
    return winner ? (winner.team?.name || winner.player?.name) : null;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900">
                {new Date(match.startTime).toLocaleString()}
              </h3>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}>
                {match.status}
              </span>
              {match.status === 'FINISHED' && getWinnerName() && (
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                  🏆 {getWinnerName()} Won
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">📍 {match.venue}</p>
          </div>
          <div className="ml-4">
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-4">
          {/* Status Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Match Status</label>
            <div className="flex gap-2">
              {['UPCOMING', 'LIVE', 'FINISHED'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status as any)}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    match.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-400'
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Participants and Scores */}
          {match.participants && match.participants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scores</label>
              <div className="space-y-2">
                {match.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {participant.team?.name || participant.player?.name || 'Unknown'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleScoreChange(
                            participant.id,
                            Math.max(0, (scores[participant.id] || 0) - 1)
                          )
                        }
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={scores[participant.id] ?? participant.score}
                        onChange={(e) =>
                          handleScoreChange(participant.id, parseInt(e.target.value) || 0)
                        }
                        className="w-12 text-center px-2 py-1 border border-gray-300 rounded"
                        disabled={isUpdating}
                      />
                      <button
                        onClick={() =>
                          handleScoreChange(participant.id, (scores[participant.id] || 0) + 1)
                        }
                        className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Winner Selection (only for FINISHED matches) */}
          {match.status === 'FINISHED' && match.participants && match.participants.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Match Winner</label>
              <select
                value={match.winnerId || ''}
                onChange={(e) => handleWinnerChange(e.target.value)}
                disabled={isUpdating}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm disabled:opacity-50"
              >
                <option value="">Select Winner...</option>
                {match.participants.map((participant) => (
                  <option key={participant.id} value={participant.teamId || participant.playerId || ''}>
                    {participant.team?.name || participant.player?.name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSaveScores}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isUpdating ? 'Updating...' : 'Save Scores'}
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
