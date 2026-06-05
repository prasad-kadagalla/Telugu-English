import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const featuresList = [
  { icon: '🔊', titleKey: 'home.feat_pron_title', descKey: 'home.feat_pron_desc', path: '/pronunciation', color: 'border-blue-400 hover:bg-blue-50' },
  { icon: '📖', titleKey: 'home.feat_gram_title', descKey: 'home.feat_gram_desc', path: '/grammar', color: 'border-emerald-400 hover:bg-emerald-50' },
  { icon: '🧠', titleKey: 'home.feat_quiz_title', descKey: 'home.feat_quiz_desc', path: '/quiz', color: 'border-amber-400 hover:bg-amber-50' },
  { icon: '📚', titleKey: 'home.feat_vocab_title', descKey: 'home.feat_vocab_desc', path: '/vocabulary', color: 'border-purple-400 hover:bg-purple-50' },
  { icon: '🎯', titleKey: 'home.feat_daily_title', descKey: 'home.feat_daily_desc', path: '/daily', color: 'border-pink-400 hover:bg-pink-50' },
  { icon: '🏆', titleKey: 'home.feat_leader_title', descKey: 'home.feat_leader_desc', path: '/leaderboard', color: 'border-orange-400 hover:bg-orange-50' },
];

const getTestimonials = (lang) => [
  {
    name: lang === 'english' ? 'Sravani, Class 9' : 'శ్రావణి, 9వ తరగతి',
    school: lang === 'english' ? 'ZP High School, Vizag' : 'ZP హైస్కూల్, వైజాగ్',
    text: lang === 'english'
      ? 'This app helped me speak English confidently! I learned 50 new words in one week.'
      : 'ఈ యాప్ నేను నమ్మకంగా ఇంగ్లీష్ మాట్లాడటానికి సహాయపడింది! నేను ఒక్క వారంలో 50 కొత్త పదాలు నేర్చుకున్నాను.',
    stars: 5
  },
  {
    name: lang === 'english' ? 'Harish, Class 8' : 'హరీష్, 8వ తరగతి',
    school: lang === 'english' ? 'MPP School, Kurnool' : 'MPP స్కూల్, కర్నూలు',
    text: lang === 'english'
      ? 'Grammar lessons explained in Telugu are so easy to understand. I got A grade in English!'
      : 'తెలుగులో వివరించిన వ్యాకరణ పాఠాలు అర్థం చేసుకోవడం చాలా సులభం. నాకు ఇంగ్లీషులో ఎ గ్రేడ్ వచ్చింది!',
    stars: 5
  },
  {
    name: lang === 'english' ? 'Priya, Class 10' : 'ప్రియ, 10వ తరగతి',
    school: lang === 'english' ? 'Govt School, Nellore' : 'ప్రభుత్వ పాఠశాల, నెల్లూరు',
    text: lang === 'english'
      ? 'The pronunciation practice feature is amazing. My English teacher is very happy with me!'
      : 'ఉచ్ఛారణ సాధన ఫీచర్ అద్భుతంగా ఉంది. మా ఇంగ్లీష్ టీచర్ నా పట్ల చాలా సంతోషంగా ఉన్నారు!',
    stars: 5
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const testimonials = getTestimonials(language);

  const stats = [
    ['500+', t('home.stats_students')],
    ['12', t('home.stats_grammar')],
    ['18+', t('home.stats_quizzes')],
    ['100%', t('home.stats_free')],
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="relative rounded-2xl bg-gradient-to-br from-blue-800 via-blue-600 to-sky-500 text-white text-center p-10 mb-10 overflow-hidden shadow-lg">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full animate-pulse" />
        <div className="absolute -bottom-12 -left-8 w-36 h-36 bg-white/5 rounded-full" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 backdrop-blur-sm">
            {t('home.free_tag')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight tracking-tight">
            {t('home.title_part1')}<br />{t('home.title_part2')}
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-7 max-w-xl mx-auto font-medium">
            {t('home.subtitle')}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/grammar" className="bg-white text-blue-700 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2">
              {t('home.get_started')}
            </Link>
            <Link to="/quiz" className="bg-white/20 border-2 border-white/40 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
              {t('home.take_quiz')}
            </Link>
          </div>
          {!user && (
            <p className="mt-5 text-blue-200 text-sm">
              {t('home.login_prompt')}{' '}
              <Link to="/login" className="text-white font-semibold underline hover:text-blue-100 transition-colors">
                {t('home.login_here')}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map(([v, l]) => (
          <div key={l} className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-2xl font-bold text-blue-600">{v}</div>
            <div className="text-xs text-slate-500 mt-1 font-semibold">{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        {t('home.features_header')}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {featuresList.map((f) => (
          <Link key={f.path} to={f.path}
            className={`bg-white rounded-xl p-5 border-l-4 ${f.color} shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-slate-800 mb-1">{t(f.titleKey)}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{t(f.descKey)}</p>
            <span className="text-blue-600 text-xs font-semibold mt-2 block hover:underline">{t('home.open')}</span>
          </Link>
        ))}
      </div>

      {/* Testimonials */}
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        {t('home.testi_header')}
      </h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {testimonials.map((tItem, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-amber-400 mb-2">{'★'.repeat(tItem.stars)}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-3 italic">"{tItem.text}"</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                {tItem.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-800">{tItem.name}</div>
                <div className="text-xs text-slate-400">{tItem.school}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl text-white text-center p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-2">{t('home.cta_title')}</h2>
          <p className="text-blue-100 mb-5 text-sm font-medium">{t('home.cta_desc')}</p>
          <Link to="/register" className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 active:scale-95 shadow-md inline-block">
            {t('home.cta_button')}
          </Link>
        </div>
      )}
    </div>
  );
}
