import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

import Navbar       from './components/layout/Navbar';
import Footer       from './components/layout/Footer';
import HomePage     from './pages/HomePage';
import PronunciationPage from './pages/PronunciationPage';
import GrammarPage  from './pages/GrammarPage';
import QuizPage     from './pages/QuizPage';
import VocabPage    from './pages/VocabPage';
import DashboardPage from './pages/DashboardPage';
import DailyPage    from './pages/DailyPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage    from './pages/AdminPage';

// ─── Route guards ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen text-blue-600 text-lg">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};

const PublicOnly = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ─── App shell ────────────────────────────────────────────────────────────────
const AppShell = () => (
  <div className="min-h-screen flex flex-col bg-slate-50">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/pronunciation" element={<PronunciationPage />} />
        <Route path="/grammar"      element={<GrammarPage />} />
        <Route path="/quiz"         element={<QuizPage />} />
        <Route path="/vocabulary"   element={<VocabPage />} />
        <Route path="/daily"        element={<DailyPage />} />
        <Route path="/leaderboard"  element={<LeaderboardPage />} />

        <Route path="/login"    element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/admin"     element={<AdminRoute><AdminPage /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
    <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
