import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { ProtectedRoute } from './components/common/ProtectedRoute'
import { ConnectionBanner } from './components/common/ConnectionBanner'
import { LoginPage } from './pages/auth/LoginPage'
import { PublicDashboard } from './pages/public/PublicDashboard'
import { AdminLayout } from './components/layout/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { UsersPage } from './pages/admin/UsersPage'
import FacultiesPage from './pages/admin/FacultiesPage'
import GamesPage from './pages/admin/GamesPage'
import TeamsPage from './pages/admin/TeamsPage'
import PlayersPage from './pages/admin/PlayersPage'
import MatchesPage from './pages/admin/MatchesPage'
import ManagerLayout from './layouts/ManagerLayout'
import ManagerDashboard from './pages/manager/ManagerDashboard'
import ManagerLeaderboard from './pages/manager/ManagerLeaderboard'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <ConnectionBanner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicDashboard />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="faculties" element={<FacultiesPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route path="players" element={<PlayersPage />} />
              <Route path="matches" element={<MatchesPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <ManagerLayout>
                    <ManagerDashboard />
                  </ManagerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <ManagerLayout>
                    <ManagerDashboard />
                  </ManagerLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/leaderboard"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <ManagerLayout>
                    <ManagerLeaderboard />
                  </ManagerLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App
