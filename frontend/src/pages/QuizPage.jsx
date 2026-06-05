import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../hooks/useApi';
import api from '../utils/api';
import { PageHeader, PageLoader, Tag } from '../components/common';
import { useLanguage } from '../context/LanguageContext';

const TIMER_SECS = 30;

export default function QuizPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const { data, loading, error, refetch } = useQuiz(10, category);
  const quizzes = data?.quizzes || [];

  const [idx,       setIdx]      = useState(0);
  const [selected,  setSelected] = useState(null);
  const [answered,  setAnswered] = useState(false);
  const [result,    setResult]   = useState(null);
  const [score,     setScore]    = useState(0);
  const [done,      setDone]     = useState(false);
  const [time,      setTime]     = useState(TIMER_SECS);
  const [history,   setHistory]  = useState([]);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTime(TIMER_SECS);
    timerRef.current = setInterval(() => {
      setTime(tVal => {
        if (tVal <= 1) { clearInterval(timerRef.current); autoNext(); return 0; }
        return tVal - 1;
      });
    }, 1000);
  };

  const autoNext = () => {
    setHistory(h => [...h, { selected: null, correct: false }]);
    if (idx < quizzes.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setResult(null);
    } else {
      setDone(true);
    }
  };

  useEffect(() => {
    if (!done && quizzes.length) startTimer();
    return () => clearInterval(timerRef.current);
  }, [idx, quizzes.length, done]);

  const handleSelect = async (optIdx) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setSelected(optIdx);
    setAnswered(true);
    try {
      const res = await api.post(`/quizzes/${quizzes[idx]._id}/answer`, {
        selectedAnswer: optIdx,
        timeTaken: TIMER_SECS - time
      });
      setResult(res.data);
      if (res.data.isCorrect) setScore(s => s + 1);
      setHistory(h => [...h, { selected: optIdx, correct: res.data.isCorrect }]);
    } catch {
      // fallback (offline/demo)
      const correct = optIdx === quizzes[idx].correctAnswer;
      if (correct) setScore(s => s + 1);
      setHistory(h => [...h, { selected: optIdx, correct }]);
      setResult({
        isCorrect: correct,
        correctAnswer: quizzes[idx].correctAnswer,
        correctOption: quizzes[idx].options[quizzes[idx].correctAnswer],
        explanation: quizzes[idx].explanation,
        explanationTelugu: quizzes[idx].explanationTelugu || quizzes[idx].explanation,
      });
    }
  };

  const next = () => {
    if (idx < quizzes.length - 1) {
      setIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setResult(null);
    } else {
      setDone(true);
    }
  };

  const reset = () => {
    setIdx(0);
    setSelected(null);
    setAnswered(false);
    setResult(null);
    setScore(0);
    setDone(false);
    setHistory([]);
    refetch();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PageHeader icon="🧠" title={t('quiz.header_title')} />
        <PageLoader />
      </div>
    );
  }

  const pct = done ? Math.round((score / quizzes.length) * 100) : 0;
  const q   = quizzes[idx];

  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PageHeader icon="🏅" title={language === 'english' ? 'Quiz Results' : 'క్విజ్ ఫలితాలు'} />
        <div className="card bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <div className={`w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center mx-auto mb-5 ${pct >= 80 ? 'border-emerald-500' : pct >= 60 ? 'border-amber-400' : 'border-red-400'}`}>
            <div className={`text-3xl font-bold ${pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-500' : 'text-red-500'}`}>{pct}%</div>
            <div className="text-xs text-slate-400 font-semibold">{score}/{quizzes.length}</div>
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {pct >= 80
              ? (language === 'english' ? '🎉 Excellent!' : '🎉 అద్భుతం!')
              : pct >= 60
                ? (language === 'english' ? '👍 Good Job!' : '👍 మంచి ప్రయత్నం!')
                : (language === 'english' ? '💪 Keep Practicing!' : '💪 ప్రాక్టీస్ చేస్తూ ఉండండి!')}
          </h2>
          <p className="text-slate-500 mb-6 font-medium">
            {language === 'english'
              ? `You answered ${score} of ${quizzes.length} questions correctly.`
              : `మీరు ${quizzes.length} ప్రశ్నలలో ${score} ప్రశ్నలకు సరిగ్గా సమాధానం ఇచ్చారు.`}
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
            <div className="card py-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="text-xl font-bold text-emerald-600">{score}</div>
              <div className="text-xs text-slate-400 font-semibold">{language === 'english' ? 'Correct' : 'సరైనవి'}</div>
            </div>
            <div className="card py-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="text-xl font-bold text-red-500">{quizzes.length - score}</div>
              <div className="text-xs text-slate-400 font-semibold">{language === 'english' ? 'Wrong' : 'తప్పులు'}</div>
            </div>
            <div className="card py-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="text-xl font-bold text-blue-600">{pct}%</div>
              <div className="text-xs text-slate-400 font-semibold">{language === 'english' ? 'Score' : 'స్కోరు'}</div>
            </div>
          </div>
          <button className="btn-primary mx-auto shadow-md transform hover:scale-105 active:scale-95" onClick={reset}>
            🔁 {language === 'english' ? 'Try Again' : 'మళ్ళీ రాయండి'}
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        icon="🧠"
        title={t('quiz.header_title')}
        subtitle={t('quiz.header_sub')}
      />

      <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <Tag variant="blue">Q {idx + 1} / {quizzes.length}</Tag>
          <Tag variant={time <= 10 ? 'red' : 'amber'}>⏱ {time}s</Tag>
          <Tag variant="green">{language === 'english' ? 'Score' : 'స్కోరు'}: {score}</Tag>
        </div>

        {/* Progress */}
        <div className="h-2 bg-slate-100 rounded-full mb-5">
          <div className="h-2 bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${(idx / quizzes.length) * 100}%` }} />
        </div>

        <Tag variant="purple" className="mb-3 uppercase font-bold tracking-wider text-[10px]">{q.category}</Tag>
        
        <p className="text-lg font-bold text-slate-800 mb-5 leading-relaxed">
          {language === 'telugu' && q.questionTelugu ? q.questionTelugu : q.question}
        </p>

        {/* Options */}
        <div className="space-y-2 mb-5">
          {q.options.map((opt, i) => {
            let cls = 'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 font-semibold text-sm ';
            if (!answered) cls += 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:translate-x-0.5';
            else if (i === (result?.correctAnswer ?? q.correctAnswer)) cls += 'border-emerald-400 bg-emerald-50 text-emerald-800';
            else if (i === selected && !result?.isCorrect) cls += 'border-red-400 bg-red-50 text-red-800';
            else cls += 'border-slate-200 text-slate-400 cursor-default';

            return (
              <div key={i} className={cls} onClick={() => handleSelect(i)}>
                <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && i === (result?.correctAnswer ?? q.correctAnswer) && <span className="text-emerald-500 text-lg font-bold">✓</span>}
                {answered && i === selected && i !== (result?.correctAnswer ?? q.correctAnswer) && <span className="text-red-500 text-lg font-bold">✗</span>}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {answered && result && (
          <div className={`p-4 rounded-xl text-sm mb-4 border fade-in font-medium ${result.isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {result.isCorrect ? '✅' : '❌'}{' '}
            <b>
              {result.isCorrect
                ? t('quiz.correct')
                : `${t('quiz.wrong')} ${language === 'english' ? 'Correct Answer' : 'సరైన సమాధానం'}: ${result.correctOption}`}
            </b>
            <div className="mt-1.5 pt-1.5 border-t border-current/10 font-normal">
              <b>{t('quiz.explanation')}: </b>
              {language === 'telugu' && result.explanationTelugu ? result.explanationTelugu : result.explanation}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-2">
          <select
            className="input-field w-40 text-sm bg-white border border-slate-200 rounded-lg px-2 py-1.5"
            value={category}
            onChange={e => { setCategory(e.target.value); reset(); }}
          >
            <option value="">{language === 'english' ? 'All Topics' : 'అన్ని అంశాలు'}</option>
            <option value="grammar">{language === 'english' ? 'Grammar' : 'వ్యాకరణం'}</option>
            <option value="tenses">{language === 'english' ? 'Tenses' : 'కాలాలు (Tenses)'}</option>
            <option value="articles">{language === 'english' ? 'Articles' : 'ఆర్టికల్స్'}</option>
            <option value="vocabulary">{language === 'english' ? 'Vocabulary' : 'పదజాలం'}</option>
          </select>
          <button
            className="btn-primary shadow-md transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
            onClick={next}
            disabled={!answered}
          >
            {idx < quizzes.length - 1 ? t('quiz.next') : (language === 'english' ? 'Finish ✓' : 'పూర్తి చేయి ✓')}
          </button>
        </div>
      </div>
    </div>
  );
}
