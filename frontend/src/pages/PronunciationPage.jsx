import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { PageHeader, ProgressBar } from '../components/common';
import { useLanguage } from '../context/LanguageContext';

const TELUGU_MAP = {
  'అమ్మ':    { english: 'Amma',       phonetic: 'uh-muh',       meaning: 'Mother',  meaningTelugu: 'తల్లి (Mother)' },
  'నాన్న':   { english: 'Nanna',      phonetic: 'nah-nuh',      meaning: 'Father',  meaningTelugu: 'తండ్రి (Father)' },
  'పాఠశాల': { english: 'Paathasaala',phonetic: 'paah-tha-saa-la',meaning:'School', meaningTelugu: 'బడి (School)' },
  'పుస్తకం': { english: 'Pustakam',   phonetic: 'pus-ta-kum',   meaning: 'Book',    meaningTelugu: 'గ్రంథం (Book)' },
  'నీళ్ళు':  { english: 'Neellu',     phonetic: 'neel-lu',      meaning: 'Water',   meaningTelugu: 'జలం (Water)' },
  'చెట్టు':  { english: 'Chettu',     phonetic: 'chet-tu',      meaning: 'Tree',    meaningTelugu: 'వృక్షం (Tree)' },
  'ఇల్లు':   { english: 'Illu',       phonetic: 'il-lu',        meaning: 'House',   meaningTelugu: 'గృహం (House)' },
  'కుక్క':   { english: 'Kukka',      phonetic: 'kuk-kuh',      meaning: 'Dog',     meaningTelugu: 'శ్వానం (Dog)' },
  'పక్షి':   { english: 'Pakshi',     phonetic: 'pak-shi',      meaning: 'Bird',    meaningTelugu: 'ఖగము (Bird)' },
  'నది':     { english: 'Nadi',       phonetic: 'nuh-di',       meaning: 'River',   meaningTelugu: 'ఏరు (River)' },
  'గ్రామం':  { english: 'Graamam',    phonetic: 'graa-mum',     meaning: 'Village', meaningTelugu: 'పల్లె (Village)' },
  'స్నేహితుడు':{ english:'Sneehitudu', phonetic:'sneh-hi-tu-du', meaning:'Friend',  meaningTelugu: 'మిత్రుడు (Friend)' },
};

const PRACTICE_WORDS = ['School', 'Book', 'Water', 'Apple', 'Teacher', 'Student', 'Friend', 'Hello', 'Thank you', 'Good morning'];

const speak = (text, rate = 0.85) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate; u.pitch = 1;
  window.speechSynthesis.speak(u);
};

const calcAccuracy = (target, spoken) => {
  if (!spoken) return 0;
  if (target === spoken) return 100;
  if (spoken.includes(target) || target.includes(spoken)) return 90;
  let common = 0;
  for (const c of target) if (spoken.includes(c)) common++;
  return Math.round((common / Math.max(target.length, spoken.length)) * 100);
};

export default function PronunciationPage() {
  const { language, t: translate } = useLanguage();
  const { user } = useAuth();
  const [teluguWord,  setTeluguWord]  = useState('అమ్మ');
  const [teluguResult,setTeluguResult]= useState(null);
  const [engWord,     setEngWord]     = useState('');
  const [engResult,   setEngResult]   = useState(null);
  const [targetWord,  setTargetWord]  = useState('School');
  const [recording,   setRecording]   = useState(false);
  const [userSaid,    setUserSaid]    = useState('');
  const [accuracy,    setAccuracy]    = useState(null);
  const recogRef = useRef(null);

  const handleTeluguLookup = () => {
    const r = TELUGU_MAP[teluguWord];
    setTeluguResult(r || { english: teluguWord, phonetic: 'Not in dictionary', meaning: '—', meaningTelugu: '—' });
  };

  const handleEngLookup = () => {
    const w = engWord.trim();
    if (!w) return;
    const PHONETICS = { school:'/skuːl/', book:'/bʊk/', water:'/ˈwɔːtər/', apple:'/ˈæpəl/', teacher:'/ˈtiːtʃər/', student:'/ˈstuːdənt/', friend:'/frɛnd/', mother:'/ˈmʌðər/', father:'/ˈfɑːðər/', happy:'/ˈhæpi/' };
    setEngResult({ word: w, phonetic: PHONETICS[w.toLowerCase()] || `/${w.toLowerCase()}/` });
    speak(w);
  };

  const startMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert(language === 'english' ? 'Speech recognition not supported in your browser. Try Chrome.' : 'మీ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ సపోర్ట్ లేదు. క్రోమ్ వాడండి.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    recogRef.current = rec;
    rec.start();
    setRecording(true); setUserSaid(''); setAccuracy(null);
    rec.onresult = async (e) => {
      const said = e.results[0][0].transcript.toLowerCase().trim();
      const target = targetWord.toLowerCase();
      const acc = calcAccuracy(target, said);
      setUserSaid(said);
      setAccuracy(acc);
      setRecording(false);
      if (user) {
        try { await api.post('/progress/pronunciation', { word: targetWord, accuracy: acc, feedback: acc >= 80 ? 'Good' : 'Needs practice' }); }
        catch (_) {}
      }
    };
    rec.onerror = () => setRecording(false);
    rec.onend   = () => setRecording(false);
  };

  const accuracyColor = accuracy >= 80 ? 'text-emerald-600' : accuracy >= 60 ? 'text-amber-500' : 'text-red-500';
  const accuracyBg    = accuracy >= 80 ? 'bg-emerald-600' : accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <PageHeader
        icon="🔊"
        title={translate('pron.header_title')}
        subtitle={translate('pron.header_sub')}
      />

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        {/* Telugu → English */}
        <div className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            {language === 'english' ? '🇮🇳 Telugu → English' : '🇮🇳 తెలుగు → ఇంగ్లీష్'}
          </h3>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            {language === 'english' ? 'Select Telugu word' : 'తెలుగు పదాన్ని ఎంచుకోండి'}
          </label>
          <select className="input-field mb-3 bg-white border border-slate-200 rounded-lg px-2 py-1.5" value={teluguWord} onChange={e => setTeluguWord(e.target.value)}>
            {Object.keys(TELUGU_MAP).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button className="btn-primary w-full justify-center shadow-sm" onClick={handleTeluguLookup}>
            🔍 {language === 'english' ? 'Get Pronunciation' : 'ఉచ్ఛారణను పొందండి'}
          </button>
          {teluguResult && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200 fade-in">
              <div className="text-2xl font-bold text-blue-700 mb-1">{teluguResult.english}</div>
              <div className="text-sm text-blue-500 mb-1">
                {translate('vocab.pronunciation')}: <b>{teluguResult.phonetic}</b>
              </div>
              <div className="text-sm text-emerald-600 mb-3 font-semibold">
                💡 {language === 'english' ? 'Meaning' : 'అర్థం'}: {language === 'english' ? teluguResult.meaning : teluguResult.meaningTelugu}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button className="btn-primary text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(teluguResult.english)}>▶️ {language === 'english' ? 'Play' : 'వినండి'}</button>
                <button className="btn-ghost bg-white border border-slate-200 text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(teluguResult.english, 0.5)}>🐢 {language === 'english' ? 'Slow' : 'మెల్లగా'}</button>
                <button className="btn-ghost bg-white border border-slate-200 text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(teluguResult.english)}>🔁 {language === 'english' ? 'Repeat' : 'మళ్లీ'}</button>
              </div>
            </div>
          )}
        </div>

        {/* English word */}
        <div className="card bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            {language === 'english' ? '🇬🇧 English Word Pronunciation' : '🇬🇧 ఇంగ్లీష్ పదాల ఉచ్ఛారణ'}
          </h3>
          <label className="text-xs font-semibold text-slate-500 block mb-1">
            {language === 'english' ? 'Enter English word' : 'ఇంగ్లీష్ పదాన్ని నమోదు చేయండి'}
          </label>
          <input className="input-field mb-3" placeholder="e.g. School, Apple, Teacher"
            value={engWord} onChange={e => setEngWord(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEngLookup()} />
          <button className="btn-primary w-full justify-center shadow-sm" onClick={handleEngLookup}>
            🔊 {language === 'english' ? 'Get Pronunciation' : 'ఉచ్ఛారణను పొందండి'}
          </button>
          {engResult && (
            <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200 fade-in">
              <div className="text-2xl font-bold text-blue-700 mb-1">{engResult.word}</div>
              <div className="text-sm text-blue-500 mb-3 font-mono">{engResult.phonetic}</div>
              <div className="flex gap-2 flex-wrap">
                <button className="btn-primary text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(engResult.word)}>▶️ {language === 'english' ? 'Play' : 'వినండి'}</button>
                <button className="btn-ghost bg-white border border-slate-200 text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(engResult.word, 0.5)}>🐢 {language === 'english' ? 'Slow' : 'మెల్లగా'}</button>
                <button className="btn-ghost bg-white border border-slate-200 text-sm px-3.5 py-1.5 rounded-lg shadow-sm" onClick={() => speak(engResult.word)}>🔁 {language === 'english' ? 'Repeat' : 'మళ్లీ'}</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Practice */}
      <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          {language === 'english' ? '🎤 Pronunciation Practice' : '🎤 ఉచ్ఛారణ సాధన'}
        </h3>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              {language === 'english' ? 'Target word' : 'లక్ష్య పదం'}
            </label>
            <select className="input-field mb-3 bg-white border border-slate-200 rounded-lg px-2 py-1.5" value={targetWord} onChange={e => { setTargetWord(e.target.value); setAccuracy(null); setUserSaid(''); }}>
              {PRACTICE_WORDS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            <button className="btn-ghost bg-slate-50 border border-slate-200 text-sm mb-4 w-full justify-center py-2 rounded-xl shadow-sm text-slate-700 font-semibold" onClick={() => speak(targetWord)}>
              👂 {language === 'english' ? 'Listen first' : 'ముందుగా వినండి'}
            </button>
            <div className="text-center bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm mb-3 font-semibold">
                {recording
                  ? (language === 'english' ? '🔴 Listening… say the word now!' : '🔴 వింటున్నాను… పదాన్ని పలకండి!')
                  : (language === 'english' ? 'Click the mic and say the word' : 'మైక్ క్లిక్ చేసి పదాన్ని చెప్పండి')}
              </p>
              <button
                onClick={startMic}
                className={`w-16 h-16 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center mx-auto hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-md ${recording ? 'mic-recording !bg-red-500' : ''}`}>
                🎙️
              </button>
              <p className="text-xs text-slate-400 mt-2 font-semibold">
                {language === 'english' ? 'Click to start recording' : 'రికార్డింగ్ ప్రారంభించడానికి క్లిక్ చేయండి'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
            <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">
              🎯 {language === 'english' ? 'Target Word' : 'లక్ష్య పదం'}
            </p>
            <p className="text-2xl font-black text-blue-700 mb-4">{targetWord}</p>
            {userSaid && (
              <div className="mb-3">
                <p className="text-xs text-slate-400 mb-1 font-bold uppercase tracking-wider">
                  🎤 {language === 'english' ? 'You said:' : 'మీరు పలికినది:'}
                </p>
                <p className="text-lg font-bold text-slate-800 capitalize">{userSaid}</p>
              </div>
            )}
            {accuracy !== null && (
              <div className="fade-in">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-600">{translate('pron.score')}</span>
                  <span className={`font-black ${accuracyColor}`}>{accuracy}%</span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-3 shadow-inner">
                  <div className={`h-3 ${accuracyBg} rounded-full transition-all duration-700`} style={{ width: `${accuracy}%` }} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {accuracy >= 90
                    ? translate('pron.excellent')
                    : accuracy >= 70
                      ? translate('pron.good')
                      : translate('pron.try_again')}
                </p>
              </div>
            )}
            {!userSaid && !recording && (
              <p className="text-slate-400 text-sm font-medium">
                {language === 'english'
                  ? 'Your result will appear here after recording.'
                  : 'రికార్డింగ్ తర్వాత మీ ఫలితం ఇక్కడ కనిపిస్తుంది.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
