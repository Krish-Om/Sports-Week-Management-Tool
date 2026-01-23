import { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { Loader, Trophy, TrendingUp } from 'lucide-react';
import api from '../../config/api';

interface Faculty {
  id: string;
  name: string;
  totalPoints: number;
}

export default function ManagerLeaderboard() {
  const { socket } = useSocket();
  const [leaderboard, setLeaderboard] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Auto-refresh leaderboard every 5 seconds for live updates
  useEffect(() => {
    fetchLeaderboard();
    
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Listen for real-time leaderboard updates via Socket.io
  useEffect(() => {
    if (!socket) return;

    socket.on('leaderboardUpdate', (data) => {
      console.log('🏅 Leaderboard update received:', data);
      fetchLeaderboard();
    });

    socket.on('pointsCalculated', () => {
      console.log('📊 Points calculated, refreshing leaderboard');
      fetchLeaderboard();
    });

    return () => {
      socket.off('leaderboardUpdate');
      socket.off('pointsCalculated');
    };
  }, [socket]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/points/leaderboard');
      const leaderboardData = Array.isArray(response.data) ? response.data : response.data.data || [];
      setLeaderboard(leaderboardData);
      setLastUpdated(new Date());
      if (loading) setLoading(false);
      setError('');
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.response?.data?.error || 'Failed to fetch leaderboard');
      if (loading) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Leaderboard</h1>
            <p className="text-gray-600 mt-2">Live standings for Sports Week</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </div>
            {lastUpdated && (
              <p className="text-xs text-gray-500">
                Updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No faculty standings yet. Complete matches to populate the leaderboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Faculty</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((faculty, idx) => (
                    <tr
                      key={faculty.id}
                      className={`border-b transition-all ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              idx === 0
                                ? 'bg-yellow-500'
                                : idx === 1
                                ? 'bg-gray-400'
                                : idx === 2
                                ? 'bg-orange-600'
                                : 'bg-gray-300'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          {idx === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                          {idx === 1 && <Trophy className="w-5 h-5 text-gray-400" />}
                          {idx === 2 && <Trophy className="w-5 h-5 text-orange-600" />}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          idx === 0 ? 'text-yellow-700' : 'text-gray-900'
                        }`}>
                          {faculty.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-lg font-bold ${
                          idx === 0
                            ? 'text-yellow-600'
                            : idx === 1
                            ? 'text-gray-600'
                            : idx === 2
                            ? 'text-orange-600'
                            : 'text-blue-600'
                        }`}>
                          {faculty.totalPoints}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Live Updates:</strong> This leaderboard updates automatically every 5 seconds and in real-time when matches are completed. 
            Points are awarded immediately when you mark a match as finished and set the winner.
          </p>
        </div>
      </div>
    </div>
  );
}
