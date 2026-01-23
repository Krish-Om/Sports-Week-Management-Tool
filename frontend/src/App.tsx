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
              <Route path="faculties" element={<div className="text-2xl">Faculties Page - Coming Soon</div>} />
              <Route path="games" element={<div className="text-2xl">Games Page - Coming Soon</div>} />
              <Route path="teams" element={<div className="text-2xl">Teams Page - Coming Soon</div>} />
              <Route path="players" element={<div className="text-2xl">Players Page - Coming Soon</div>} />
              <Route path="matches" element={<div className="text-2xl">Matches Page - Coming Soon</div>} />
              <Route path="users" element={<UsersPage />} />
            </Route>

            {/* Manager Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute requiredRole="MANAGER">
                  <div>Manager Dashboard - Coming Soon</div>
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
