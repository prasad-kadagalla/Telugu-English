import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useDashboardSummary, useWeeklyProgress } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { PageHeader, StatCard, PageLoader } from '../components/common';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

Chart.register(...registerables);

const getAchievements = (lang) => [
  { id:'first_quiz',  icon:'🎯', title: lang === 'english' ? 'First Quiz' : 'మొదటి క్విజ్',    desc: lang === 'english' ? 'Complete first quiz' : 'మొదటి క్విజ్ పూర్తి చేయండి',      color:'amber' },
  { id:'bookworm',    icon:'📚', title: lang === 'english' ? 'Bookworm' : 'పుస్తకాల పురుగు',    desc: lang === 'english' ? 'Complete 10 lessons' : '10 పాఠాలు పూర్తి చేయండి',      color:'blue'  },
  { id:'speaker',     icon:'🎤', title: lang === 'english' ? 'Speaker' : 'స్పీకర్',        desc: lang === 'english' ? '10 pronunciation sessions' : '10 ఉచ్ఛారణ సెషన్లు',color:'green' },
  { id:'quiz_star',   icon:'⭐', title: lang === 'english' ? 'Quiz Star' : 'క్విజ్ స్టార్',      desc: lang === 'english' ? 'Score 90%+ in quiz' : 'క్విజ్‌లో 90%+ మార్కులు',       color:'amber' },
  { id:'champion',    icon:'🏆', title: lang === 'english' ? 'Champion' : 'ఛాంపియన్',       desc: lang === 'english' ? 'Reach Top 3 on leaderboard' : 'లీడర్‌బోర్డ్‌లో టాప్ 3లో నిలవండి',color:'purple'},
  { id:'7_day_streak',icon:'🔥', title: lang === 'english' ? '7-Day Streak' : '7 రోజుల స్ట్రీక్',   desc: lang === 'english' ? 'Practice 7 days in a row' : 'వరుసగా 7 రోజులు ప్రాక్టీస్', color:'red'   },
];

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { data: summaryData, loading: sumLoading } = useDashboardSummary();
  const { data: weeklyData,  loading: weekLoading } = useWeeklyProgress();

  const barRef  = useRef(null);
  const pieRef  = useRef(null);
  const barChart = useRef(null);
  const pieChart = useRef(null);

  const s = summaryData?.summary;
  const weekly = weeklyData?.chartData || [];

  const achievementsList = getAchievements(language);

  useEffect(() => {
    if (!weekly.length || weekLoading) return;

    if (barChart.current) barChart.current.destroy();
    if (barRef.current) {
      barChart.current = new Chart(barRef.current, {
        type: 'bar',
        data: {
          labels: weekly.map(d => d.day),
          datasets: [
            { label: language === 'english' ? 'Lessons' : 'పాఠాలు', data: weekly.map(d => d.lessons),  backgroundColor: '#2563EB', borderRadius: 4 },
            { label: language === 'english' ? 'Quizzes' : 'క్విజ్‌లు', data: weekly.map(d => d.quizzes),  backgroundColor: '#10B981', borderRadius: 4 },
            { label: language === 'english' ? 'Pronunciation' : 'ఉచ్ఛారణ', data: weekly.map(d => d.pronunciation), backgroundColor: '#F59E0B', borderRadius: 4 },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } },
      });
    }

    if (pieChart.current) pieChart.current.destroy();
    if (pieRef.current && s) {
      pieChart.current = new Chart(pieRef.current, {
        type: 'doughnut',
        data: {
          labels: language === 'english'
            ? ['Grammar', 'Vocabulary', 'Pronunciation', 'Quizzes']
            : ['వ్యాకరణం', 'పదజాలం', 'ఉచ్ఛారణ', 'క్విజ్‌లు'],
          datasets: [{ data: [35, 30, 20, 15], backgroundColor: ['#2563EB', '#10B981', '#7c3aed', '#F59E0B'], borderWidth: 0 }],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
      });
    }

    return () => { barChart.current?.destroy(); pieChart.current?.destroy(); };
  }, [weekly, s, language]);

  if (sumLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <PageHeader icon="📊" title={t('dashboard.header_title')} />
        <PageLoader />
      </div>
    );
  }

  const earnedIds = new Set((user?.badges || []).map(b => b.id));

  const welcomeSubtitle = language === 'english'
    ? `Welcome, ${user?.name} · ${user?.school || 'School'} · Class ${user?.class || '—'}`
    : `స్వాగతం, ${user?.name} · ${user?.school || 'పాఠశాల'} · ${user?.class || '—'} తరగతి`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader
        icon="📊"
        title={t('dashboard.header_title')}
        subtitle={welcomeSubtitle}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
        <StatCard icon="📖" value={s?.totalLessons || 0}   label={language === 'english' ? 'Lessons Completed' : 'పూర్తయిన పాఠాలు'}  color="border-blue-500"   bg="bg-blue-50"   textColor="text-blue-600" />
        <StatCard icon="🧠" value={s?.totalQuizzes || 0}   label={language === 'english' ? 'Quizzes Attempted' : 'రాసిన క్విజ్‌లు'}  color="border-emerald-500"bg="bg-emerald-50"textColor="text-emerald-600"/>
        <StatCard icon="📊" value={`${s?.avgScore || 0}%`} label={language === 'english' ? 'Average Score' : 'సగటు స్కోరు'}      color="border-purple-500" bg="bg-purple-50" textColor="text-purple-600"/>
        <StatCard icon="🔥" value={`${s?.streak?.current || 0}d`} label={language === 'english' ? 'Learning Streak' : 'నిరంతర అభ్యాసం (Streak)'}  color="border-amber-500"  bg="bg-amber-50"  textColor="text-amber-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <div className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            📈 {language === 'english' ? 'Weekly Progress' : 'వారపు పురోగతి'}
          </h3>
          <div className="h-52"><canvas ref={barRef} /></div>
        </div>
        <div className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            🍩 {language === 'english' ? 'Study Distribution' : 'అభ్యాస విభజన'}
          </h3>
          <div className="h-52"><canvas ref={pieRef} /></div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          🏅 {t('dashboard.badges')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {achievementsList.map(a => {
            const earned = earnedIds.has(a.id);
            return (
              <div key={a.id} className={`rounded-xl p-3 text-center border-2 transition-all shadow-sm ${earned ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="font-extrabold text-xs text-slate-800 mb-0.5">{a.title}</div>
                <div className="text-[10px] text-slate-400 leading-tight font-medium h-8 flex items-center justify-center">{a.desc}</div>
                <div className={`text-[10px] font-bold mt-1.5 ${earned ? 'text-amber-600' : 'text-slate-400'}`}>
                  {earned
                    ? (language === 'english' ? '✓ Earned' : '✓ సాధించారు')
                    : (language === 'english' ? '🔒 Locked' : '🔒 లాక్ చేయబడింది')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          ['🔊', language === 'english' ? 'Practice Pronunciation' : 'ఉచ్ఛారణ సాధన', '/pronunciation'],
          ['🧠', language === 'english' ? 'Take a Quiz' : 'క్విజ్ రాయండి', '/quiz'],
          ['📚', language === 'english' ? 'Learn Vocabulary' : 'పదజాలం నేర్చుకోండి', '/vocabulary']
        ].map(([icon, label, path]) => (
          <Link key={path} to={path} className="card bg-white p-5 border border-slate-200 shadow-sm text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer rounded-2xl flex flex-col items-center justify-center">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="font-bold text-slate-700 text-sm">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
