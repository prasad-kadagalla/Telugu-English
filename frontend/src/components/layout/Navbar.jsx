import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const navLinks = [
  { path: '/',             labelKey: 'nav.home',          icon: '🏠' },
  { path: '/pronunciation',labelKey: 'nav.pronunciation',  icon: '🔊' },
  { path: '/grammar',      labelKey: 'nav.grammar',        icon: '📖' },
  { path: '/quiz',         labelKey: 'nav.quiz',           icon: '🧠' },
  { path: '/vocabulary',   labelKey: 'nav.vocabulary',     icon: '📚' },
  { path: '/daily',        labelKey: 'nav.daily',          icon: '🎯' },
  { path: '/leaderboard',  labelKey: 'nav.leaderboard',    icon: '🏆' },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'telugu' : 'english');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg shrink-0">
            <span className="text-xl">🌟</span>
            <span className="hidden sm:block">
              {language === 'english' ? 'Telugu→English' : 'తెలుగు→ఇంగ్లీష్'}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive(l.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                {t(l.labelKey)}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 bg-white shadow-sm"
              title={language === 'english' ? 'Switch to Telugu' : 'Switch to English'}
            >
              🌐 {language === 'english' ? 'తెలుగు' : 'English'}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin"
                    className="hidden sm:block text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors">
                    {t('nav.admin')}
                  </Link>
                )}
                <Link to="/dashboard"
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:block">{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={logout}
                  className="text-sm text-slate-500 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login"  className="btn-outline text-sm px-3 py-1.5 rounded-lg hidden sm:block">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-sm px-3 py-1.5 rounded-lg">{t('nav.register')}</Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pb-4">
          <div className="grid grid-cols-2 gap-2 pt-3">
            {navLinks.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(l.path) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <span>{l.icon}</span>{t(l.labelKey)}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="flex-1 text-center btn-outline text-sm py-2 rounded-lg">{t('nav.login')}</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center btn-primary text-sm py-2 rounded-lg">{t('nav.register')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
