import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Layout & Components
import Navbar from './components/Navbar';
import AlertBanner from './components/AlertBanner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearningModule from './pages/LearningModule';
import QuizView from './pages/QuizView';
import IncidentReportForm from './pages/IncidentReportForm';
import MapView from './pages/MapView';

// Axios defaults
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col pt-16 font-sans bg-slate-50 text-slate-800">
          <Navbar />
          <AlertBanner />
          <div className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/learn"
                element={
                  <ProtectedRoute>
                    <LearningModule />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/quiz/:contentId"
                element={
                  <ProtectedRoute>
                    <QuizView />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/report"
                element={
                  <ProtectedRoute>
                    <IncidentReportForm />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapView />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
