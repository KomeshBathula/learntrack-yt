import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import PlaylistDetail from './pages/PlaylistDetail';
import Profile from './pages/Profile';
import AiLearning from './pages/AiLearning';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import AboutCreators from './pages/AboutCreators';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/" /> : children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      {/* Redirect old routes to new auth page */}
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/register" element={<Navigate to="/auth" replace />} />
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
      <Route path="/ai-learning" element={
        <ProtectedRoute>
          <Layout>
            <AiLearning />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/about-creators" element={
        <ProtectedRoute>
          <Layout>
            <AboutCreators />
          </Layout>
        </ProtectedRoute>
      } />
    </>
  )
);

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
