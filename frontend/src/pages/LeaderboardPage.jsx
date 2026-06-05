import React from 'react';
import { useLeaderboard } from '../hooks/useApi';
import { PageHeader, PageLoader } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const MEDALS = ['🥇', '🥈', '🥉'];
const COLORS = ['#F59E0B', '#94a3b8', '#d97706'];

export default function LeaderboardPage() {
  const { language, t: translate } = useLanguage();
  const { data, loading } = useLeaderboard();
  const { user } = useAuth();
  const board = data?.leaderboard || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        icon="🏆"
        title={translate('leaderboard.header_title')}
        subtitle={translate('leaderboard.header_sub')}
        color="border-amber-500"
      />

      {loading && <PageLoader />}

      {!loading && (
        <div className="card bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-5">
          {board.map((s, i) => (
            <div key={s._id || i} className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-50 ${user?.name === s.name ? 'bg-blue-50/70 border border-blue-200' : ''}`}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-base shadow-sm" style={{ background: i < 3 ? `${COLORS[i]}22` : '#f1f5f9' }}>
                {i < 3 ? MEDALS[i] : i + 1}
              </div>
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {s.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">{s.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {s.school || (language === 'english' ? 'School' : 'పాఠశాల')} · {s.badges?.length || 0} {language === 'english' ? 'badges' : 'బ్యాడ్జ్‌లు'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-blue-600 text-sm">{s.totalPoints?.toLocaleString()} pts</p>
                <p className="text-xs text-slate-400 font-medium">🔥 {s.streak?.current || 0}{language === 'english' ? 'd streak' : ' రోజుల స్ట్రీక్'}</p>
              </div>
            </div>
          ))}
          {board.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-semibold">
                {language === 'english' ? 'No students yet. Be the first!' : 'ఇంకా ఏ విద్యార్థులు లేరు. మీరే మొదటి వ్యక్తి అవ్వండి!'}
              </p>
            </div>
          )}
        </div>
      )}

      {user && (
        <div className="card bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-2xl mb-1">📊</p>
          <h3 className="font-black text-slate-800 mb-1">
            {language === 'english' ? `Your Points: ${user.totalPoints || 0}` : `మీ పాయింట్లు: ${user.totalPoints || 0}`}
          </h3>
          <p className="text-sm text-slate-500 font-semibold">
            {language === 'english'
              ? 'Keep learning to climb the leaderboard!'
              : 'లీడర్‌బోర్డ్‌లో పైకి ఎదగడానికి నిరంతరం నేర్చుకుంటూ ఉండండి!'}
          </p>
        </div>
      )}
    </div>
  );
}
