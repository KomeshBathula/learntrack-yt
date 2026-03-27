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

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  if (!googleClientId) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md text-center">
          <h1 className="text-red-500 font-bold text-xl mb-2">Configuration Error</h1>
          <p className="text-zinc-400">
            Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
