import React, { useState } from 'react';
import { useVocabulary } from '../hooks/useApi';
import { useSubmit } from '../hooks/useApi';
import { PageHeader, PageLoader, EmptyState } from '../components/common';
import { useLanguage } from '../context/LanguageContext';

const speak = (word) => {
  if (!window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(word);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
};

export default function VocabPage() {
  const { language, t } = useLanguage();
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [playing,  setPlaying]  = useState(null);
  const [learned,  setLearned]  = useState(new Set());
  const { submit } = useSubmit();

  const { data, loading } = useVocabulary({ search, category, limit: 50 });
  const words = data?.data || [];

  const handlePlay = (word, i) => {
    speak(word);
    setPlaying(i);
    setTimeout(() => setPlaying(null), 1500);
  };

  const handleLearn = async (id, i) => {
    await submit('post', `/vocabulary/${id}/learned`);
    setLearned(s => new Set([...s, id]));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader
        icon="📚"
        title={t('vocab.header_title')}
        subtitle={t('vocab.header_sub')}
      />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-5">
        <input
          className="input-field max-w-xs"
          placeholder={t('vocab.search_placeholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="input-field w-48 bg-white border border-slate-200 rounded-lg px-3 py-1.5"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">{t('vocab.all_categories')}</option>
          {['school', 'family', 'nature', 'animals', 'food', 'places', 'common', 'feelings', 'actions'].map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading && <PageLoader />}

      {!loading && words.length === 0 && (
        <EmptyState icon="📭" title="No words found" message="Try a different search or category." />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
        {words.map((v, i) => (
          <div key={v._id || i} className={`card bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md ${learned.has(v._id) ? 'border-emerald-300 bg-emerald-50/10' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-extrabold text-blue-700">{v.word}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{v.phonetic}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePlay(v.word, i)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all shadow-sm ${playing === i ? 'bg-emerald-500 text-white scale-95' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105 active:scale-95'}`}>
                  {playing === i ? '🔊' : '▶️'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs">🇮🇳</span>
              <span className="text-emerald-700 font-semibold text-sm telugu-text">{v.meaning}</span>
            </div>

            {v.pronunciation && (
              <div className="text-xs text-slate-400 mb-2 font-medium">
                {t('vocab.pronunciation')}: <b className="text-slate-600">{v.pronunciation}</b>
              </div>
            )}

            <div className="bg-slate-50 rounded-lg px-3 py-2.5 mb-3 border-l-4 border-blue-400 shadow-sm">
              <p className="text-xs text-blue-500 font-bold mb-0.5 uppercase tracking-wider">{t('vocab.example')}</p>
              <p className="text-sm text-slate-700 italic font-medium">{v.exampleSentence}</p>
            </div>

            {v.exampleTelugu && language === 'telugu' && (
              <p className="text-xs text-purple-600 telugu-text font-medium mb-3">{v.exampleTelugu}</p>
            )}

            <button
              onClick={() => handleLearn(v._id, i)}
              disabled={learned.has(v._id)}
              className={`w-full text-sm py-2 rounded-xl font-bold transition-all shadow-sm ${learned.has(v._id) ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-95'}`}>
              {learned.has(v._id) ? t('vocab.learned') : t('vocab.mark_learned')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
