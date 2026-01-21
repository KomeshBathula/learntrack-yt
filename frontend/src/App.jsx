import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import PlaylistDetail from './pages/PlaylistDetail';
import Profile from './pages/Profile';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/courses" element={
          <ProtectedRoute>
            <Layout>
              <MyCourses />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/playlist/:id" element={
          <ProtectedRoute>
            <Layout>
              <PlaylistDetail />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
