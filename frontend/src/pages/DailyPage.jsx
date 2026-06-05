// ─── DailyPage ────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DailyPage() {
  const { language, t: translate } = useLanguage();
  const [done, setDone] = useState({ grammar: 2, vocab: 3, pronunciation: 5 });

  const tasks = [
    {
      key: 'grammar',
      icon: '📖',
      title: language === 'english' ? 'Grammar Practice' : 'వ్యాకరణ సాధన',
      goal: 5,
      color: 'blue',
      items: language === 'english'
        ? ['Identify 5 nouns in a paragraph', 'Complete a tense exercise', 'Write 3 sentences with adjectives']
        : ['ఒక పేరాలో 5 నామవాచకాలను గుర్తించండి', 'ఒక టెన్స్ వ్యాయామాన్ని పూర్తి చేయండి', 'విశేషణాలతో 3 వాక్యాలను రాయండి']
    },
    {
      key: 'vocab',
      icon: '📚',
      title: language === 'english' ? 'Vocabulary Learning' : 'పదజాలం నేర్చుకోవడం',
      goal: 5,
      color: 'emerald',
      items: language === 'english'
        ? ['Learn 5 new English words', 'Use each word in a sentence', 'Practice pronunciation of new words']
        : ['5 కొత్త ఇంగ్లీష్ పదాలను నేర్చుకోండి', 'ప్రతి పదాన్ని ఒక వాక్యంలో ఉపయోగించండి', 'కొత్త పదాల ఉచ్ఛారణను సాధన చేయండి']
    },
    {
      key: 'pronunciation',
      icon: '🎤',
      title: language === 'english' ? 'Pronunciation Practice' : 'ఉచ్ఛారణ సాధన',
      goal: 10,
      color: 'purple',
      items: language === 'english'
        ? ['Repeat 10 English words clearly', 'Record and compare your voice', 'Practice 3 tongue twisters']
        : ['10 ఇంగ్లీష్ పదాలను స్పష్టంగా పలకండి', 'మీ వాయిస్ రికార్డ్ చేసి సరిపోల్చండి', '3 టంగ్ ట్విస్టర్లను సాధన చేయండి']
    },
  ];

  const total = tasks.reduce((a, t) => a + t.goal, 0);
  const completed = Object.values(done).reduce((a, v) => a + v, 0);
  const overall = Math.round((completed / total) * 100);
  const inc = (key, goal) => setDone(d => ({ ...d, [key]: Math.min(d[key] + 1, goal) }));
  const colors = { blue: 'bg-blue-600', emerald: 'bg-emerald-500', purple: 'bg-purple-600' };
  const bgs    = { blue: 'bg-blue-50 border-blue-200 text-blue-700', emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700', purple: 'bg-purple-50 border-purple-200 text-purple-700' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl p-6 border-b-4 border-blue-600 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          🎯 {translate('daily.header_title')}
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-semibold">
          {translate('daily.header_sub')} 🔥
        </p>
      </div>

      <div className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-800">
            🔥 {language === 'english' ? "Today's Progress" : 'నేటి పురోగతి'}
          </span>
          <span className={`font-black text-lg ${overall >= 80 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {overall}%
          </span>
        </div>
        <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-2 shadow-inner">
          <div className="h-4 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500" style={{ width: `${overall}%` }} />
        </div>
        <p className="text-xs text-slate-400 font-semibold">
          {language === 'english'
            ? `${completed} of ${total} tasks completed`
            : `${total} పనులలో ${completed} పనులు పూర్తయ్యాయి`}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {tasks.map(t => (
          <div key={t.key} className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <span className="text-xl">{t.icon}</span>
                <h3 className="font-bold text-sm text-slate-800">{t.title}</h3>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mb-1 font-semibold">
                <span>{language === 'english' ? 'Progress' : 'పురోగతి'}</span>
                <b>{done[t.key]}/{t.goal}</b>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4 shadow-inner">
                <div className={`h-2 ${colors[t.color]} rounded-full transition-all duration-500`} style={{ width: `${(done[t.key] / t.goal) * 100}%` }} />
              </div>
              <div className="space-y-1.5">
                {t.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                    <span className={`text-sm shrink-0 ${i < done[t.key] ? 'text-emerald-500' : 'text-slate-300'}`}>{i < done[t.key] ? '✅' : '⭕'}</span>
                    <span className={`text-xs font-medium ${i < done[t.key] ? 'line-through text-slate-400 font-normal' : 'text-slate-600'}`}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => inc(t.key, t.goal)} disabled={done[t.key] >= t.goal}
              className={`w-full mt-4 py-2 rounded-xl text-xs font-bold border shadow-sm transition-all transform hover:scale-[1.02] active:scale-95 disabled:scale-100 ${done[t.key] >= t.goal ? 'bg-emerald-100 text-emerald-700 border-emerald-200 cursor-default' : `${bgs[t.color]} border`}`}>
              {done[t.key] >= t.goal
                ? (language === 'english' ? '✅ Completed!' : '✅ పూర్తయింది!')
                : (language === 'english' ? '➕ Mark Progress' : '➕ పురోగతిని గుర్తించు')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
