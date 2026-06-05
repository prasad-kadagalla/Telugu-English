import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, BookOpen, Brain, Star, TrendingUp, Plus,
  Pencil, Trash2, LogOut, RefreshCw, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab,      setTab]      = useState('overview');
  const [stats,    setStats]    = useState(null);
  const [students, setStudents] = useState([]);
  const [lessons,  setLessons]  = useState([]);
  const [quizzes,  setQuizzes]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [s, stu, les, qui] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/students?limit=50'),
        api.get('/lessons?limit=50'),
        api.get('/quizzes?limit=50'),
      ]);
      setStats(s.data.stats);
      setStudents(stu.data.students || []);
      setLessons(les.data.data || []);
      setQuizzes(qui.data.data || []);
    } catch {
      toast.error('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    await api.delete(`/lessons/${id}`);
    setLessons(l => l.filter(x => x._id !== id));
    toast.success('Lesson deleted.');
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/quizzes/${id}`);
    setQuizzes(q => q.filter(x => x._id !== id));
    toast.success('Question deleted.');
  };

  const toggleStudent = async (id) => {
    const { data } = await api.put(`/admin/students/${id}/toggle-status`);
    setStudents(s => s.map(u => u._id === id ? { ...u, isActive: data.isActive } : u));
    toast.success(data.message);
  };

  const tabs = [
    { id: 'overview', label: 'Overview',  icon: <TrendingUp size={15} /> },
    { id: 'students', label: 'Students',  icon: <Users size={15} /> },
    { id: 'lessons',  label: 'Lessons',   icon: <BookOpen size={15} /> },
    { id: 'quizzes',  label: 'Quizzes',   icon: <Brain size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Nav */}
      <div className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Shield size={20} className="text-yellow-400" />
          Admin Panel
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-300">👤 {user?.name}</span>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
                ${tab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
              {t.icon} {t.label}
            </button>
          ))}
          <button onClick={fetchAll}
            className="ml-auto flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 text-lg">⏳ Loading admin data…</div>
        ) : (
          <>
            {tab === 'overview' && <OverviewTab stats={stats} />}
            {tab === 'students' && <StudentsTab students={students} onToggle={toggleStudent} />}
            {tab === 'lessons'  && <LessonsTab  lessons={lessons}   onDelete={deleteLesson} />}
            {tab === 'quizzes'  && <QuizzesTab  quizzes={quizzes}   onDelete={deleteQuiz} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Overview ────────────────────────────────────────────────────────────────
function OverviewTab({ stats }) {
  if (!stats) return null;
  const cards = [
    { label: 'Total Students', value: stats.totalUsers,       color: 'border-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-600' },
    { label: 'Total Lessons',  value: stats.totalLessons,     color: 'border-green-500',  bg: 'bg-green-50',  text: 'text-green-600' },
    { label: 'Total Quizzes',  value: stats.totalQuizzes,     color: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Total Vocab',    value: stats.totalVocab,       color: 'border-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-600' },
    { label: 'New This Week',  value: stats.newUsersThisWeek, color: 'border-pink-500',   bg: 'bg-pink-50',   text: 'text-pink-600' },
    { label: 'Active Today',   value: stats.activeToday,      color: 'border-teal-500',   bg: 'bg-teal-50',   text: 'text-teal-600' },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <div key={i} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${c.color}`}>
          <div className={`text-3xl font-bold ${c.text}`}>{c.value}</div>
          <div className="text-sm text-slate-500 mt-1">{c.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ─── Students ────────────────────────────────────────────────────────────────
function StudentsTab({ students, onToggle }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="font-bold text-slate-700 mb-4">Students ({students.length})</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              {['Name', 'Email', 'School', 'Class', 'Points', 'Joined', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(s => (
              <tr key={s._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.email}</td>
                <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">{s.school || '—'}</td>
                <td className="px-4 py-3">{s.class || '—'}</td>
                <td className="px-4 py-3 font-bold text-blue-600">{s.totalPoints}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onToggle(s._id)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${s.isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600' : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700'}`}>
                    {s.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length === 0 && <p className="text-center py-10 text-slate-400">No students yet.</p>}
      </div>
    </motion.div>
  );
}

// ─── Lessons ─────────────────────────────────────────────────────────────────
function LessonsTab({ lessons, onDelete }) {
  const CATEGORY_COLORS = {
    grammar: 'bg-blue-100 text-blue-700',
    tenses:  'bg-purple-100 text-purple-700',
    articles:'bg-amber-100 text-amber-700',
    vocabulary: 'bg-green-100 text-green-700',
    sentences:  'bg-pink-100 text-pink-700',
    pronunciation: 'bg-teal-100 text-teal-700',
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-700">Lessons ({lessons.length})</h2>
        <span className="text-xs text-slate-400">Add lessons via API or seeder</span>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              {['Title', 'Category', 'Level', 'Views', 'Completions', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {lessons.map(l => (
              <tr key={l._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[220px] truncate">{l.title}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${CATEGORY_COLORS[l.category] || 'bg-slate-100 text-slate-600'}`}>
                    {l.category}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-slate-500">{l.level}</td>
                <td className="px-4 py-3 text-slate-500">{l.viewCount}</td>
                <td className="px-4 py-3 text-slate-500">{l.completionCount}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(l._id)}
                    className="text-red-400 hover:text-red-600 transition p-1">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lessons.length === 0 && <p className="text-center py-10 text-slate-400">No lessons. Run the seeder.</p>}
      </div>
    </motion.div>
  );
}

// ─── Quizzes ──────────────────────────────────────────────────────────────────
function QuizzesTab({ quizzes, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-700">Quiz Questions ({quizzes.length})</h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <tr>
              {['Question', 'Category', 'Type', 'Difficulty', 'Points', 'Answered', 'Action'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quizzes.map(q => (
              <tr key={q._id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800 max-w-[250px] truncate">{q.question}</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-semibold">{q.category}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 uppercase text-xs">{q.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold
                    ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      q.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-600'}`}>
                    {q.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 font-bold text-blue-600">{q.points}</td>
                <td className="px-4 py-3 text-slate-500">{q.timesAnswered}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(q._id)}
                    className="text-red-400 hover:text-red-600 transition p-1">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {quizzes.length === 0 && <p className="text-center py-10 text-slate-400">No quiz questions. Run the seeder.</p>}
      </div>
    </motion.div>
  );
}
