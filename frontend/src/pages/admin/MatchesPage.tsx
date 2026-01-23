import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react';
import api from '../../config/api';

interface Match {
  id: string;
  gameId: string;
  startTime: string;
  venue: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  createdAt: string;
  updatedAt: string;
  participants?: MatchParticipant[];
}

interface MatchParticipant {
  id?: string;
  teamId?: string | null;
  playerId?: string | null;
  score: number;
  pointsEarned: number;
}

interface Game {
  id: string;
  name: string;
  type: 'TEAM' | 'INDIVIDUAL';
}

interface Team {
  id: string;
  name: string;
  facultyId: string;
}

interface Player {
  id: string;
  name: string;
  facultyId: string;
}

interface MatchFormData {
  gameId: string;
  startTime: string;
  venue: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  participants: Array<{ teamId?: string; playerId?: string }>;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [formData, setFormData] = useState<MatchFormData>({
    gameId: '',
    startTime: '',
    venue: '',
    status: 'UPCOMING',
    participants: [],
  });
  const [selectedGameType, setSelectedGameType] = useState<'TEAM' | 'INDIVIDUAL' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMatches();
    fetchGames();
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/matches');
      setMatches(response.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch games:', err);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch teams:', err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      setPlayers(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch players:', err);
    }
  };

  const openModal = (match?: Match) => {
    if (match) {
      setEditingMatch(match);
      const game = games.find(g => g.id === match.gameId);
      setSelectedGameType(game?.type || null);
      
      // Fetch full match details including participants
      api.get(`/matches/${match.id}`).then(response => {
        const fullMatch = response.data.data;
        setFormData({
          gameId: fullMatch.gameId,
          startTime: new Date(fullMatch.startTime).toISOString().slice(0, 16),
          venue: fullMatch.venue,
          status: fullMatch.status,
          participants: fullMatch.participants?.map((p: any) => ({
            teamId: p.teamId || undefined,
            playerId: p.playerId || undefined,
          })) || [],
        });
      }).catch(err => {
        console.error('Failed to load match details:', err);
        setFormData({
          gameId: match.gameId,
          startTime: new Date(match.startTime).toISOString().slice(0, 16),
          venue: match.venue,
          status: match.status,
          participants: [],
        });
      });
    } else {
      setEditingMatch(null);
      setSelectedGameType(null);
      setFormData({
        gameId: '',
        startTime: '',
        venue: '',
        status: 'UPCOMING',
        participants: [],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
    setSelectedGameType(null);
    setFormData({
      gameId: '',
      startTime: '',
      venue: '',
      status: 'UPCOMING',
      participants: [],
    });
  };

  const handleGameChange = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    setSelectedGameType(game?.type || null);
    setFormData({ ...formData, gameId, participants: [] });
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [...formData.participants, selectedGameType === 'TEAM' ? { teamId: '' } : { playerId: '' }],
    });
  };

  const removeParticipant = (index: number) => {
    const newParticipants = formData.participants.filter((_, i) => i !== index);
    setFormData({ ...formData, participants: newParticipants });
  };

  const updateParticipant = (index: number, field: 'teamId' | 'playerId', value: string) => {
    const newParticipants = [...formData.participants];
    newParticipants[index] = { [field]: value };
    setFormData({ ...formData, participants: newParticipants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gameId || !formData.startTime || !formData.venue) {
      setError('Game, start time, and venue are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const payload = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
      };

      if (editingMatch) {
        await api.put(`/matches/${editingMatch.id}`, payload);
      } else {
        await api.post('/matches', payload);
      }

      await fetchMatches();
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save match');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (match: Match) => {
    if (!confirm(`Are you sure you want to delete this match?`)) {
      return;
    }

    try {
      setError('');
      await api.delete(`/matches/${match.id}`);
      await fetchMatches();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete match');
    }
  };

  const getGameName = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.name : 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'FINISHED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Matches</h1>
          <p className="text-gray-600 mt-1">Manage match schedules</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Match
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No matches found. Click "Add Match" to create one.
          </div>
        ) : (
          matches.map((match) => (
            <div key={match.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{getGameName(match.gameId)}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}>
                  {match.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(match.startTime).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {match.venue}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(match)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(match)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingMatch ? 'Edit Match' : 'Add Match'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Game *
                  </label>
                  <select
                    value={formData.gameId}
                    onChange={(e) => handleGameChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">-- Select Game --</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name} ({game.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="LIVE">Live</option>
                    <option value="FINISHED">Finished</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Venue *
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Main Ground, Hall A"
                    required
                  />
                </div>
              </div>

              {selectedGameType && (
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-gray-700">
                      Participants ({selectedGameType === 'TEAM' ? 'Teams' : 'Players'})
                    </label>
                    <button
                      type="button"
                      onClick={addParticipant}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add {selectedGameType === 'TEAM' ? 'Team' : 'Player'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={selectedGameType === 'TEAM' ? participant.teamId : participant.playerId}
                          onChange={(e) => updateParticipant(index, selectedGameType === 'TEAM' ? 'teamId' : 'playerId', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select {selectedGameType === 'TEAM' ? 'Team' : 'Player'} --</option>
                          {selectedGameType === 'TEAM'
                            ? teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                              ))
                            : players.map(player => (
                                <option key={player.id} value={player.id}>{player.name}</option>
                              ))
                          }
                        </select>
                        <button
                          type="button"
                          onClick={() => removeParticipant(index)}
                          className="px-3 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : editingMatch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
