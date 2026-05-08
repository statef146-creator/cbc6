import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import TeacherDashboard from './components/dashboard/TeacherDashboard'
import StudentDashboard from './components/dashboard/StudentDashboard'
import ParentDashboard from './components/dashboard/ParentDashboard'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to={`/${user.role}-dashboard`} replace /> : <Register />} />
          
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <div className="dashboard-layout">
                <Sidebar role="teacher" />
                <div className="dashboard-content">
                  <TeacherDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <div className="dashboard-layout">
                <Sidebar role="student" />
                <div className="dashboard-content">
                  <StudentDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/parent-dashboard" element={
            <ProtectedRoute allowedRoles={['parent']}>
              <div className="dashboard-layout">
                <Sidebar role="parent" />
                <div className="dashboard-content">
                  <ParentDashboard />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App