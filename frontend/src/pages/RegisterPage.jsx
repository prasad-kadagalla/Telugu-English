import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, School, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CLASSES = ['5th', '6th', '7th', '8th', '9th', '10th'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    school: '', class: '8th',
  });
  const [show,    setShow]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all required fields.'); return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.'); return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password, school: form.school, class: form.class });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📚</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join thousands of Telugu students</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Name */}
          <Field label="Full Name *" icon={<User size={15} />}>
            <input name="name" value={form.name} onChange={handle}
              placeholder="Your full name"
              className="input-base pl-8" />
          </Field>

          {/* Email */}
          <Field label="Email Address *" icon={<Mail size={15} />}>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@example.com"
              className="input-base pl-8" />
          </Field>

          {/* Password */}
          <Field label="Password *" icon={<Lock size={15} />}>
            <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handle}
              placeholder="Min. 6 characters"
              className="input-base pl-8 pr-9" />
            <button type="button" onClick={() => setShow(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </Field>

          {/* Confirm */}
          <Field label="Confirm Password *" icon={<Lock size={15} />}>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handle}
              placeholder="Repeat password"
              className="input-base pl-8" />
          </Field>

          {/* School */}
          <Field label="School Name" icon={<School size={15} />}>
            <input name="school" value={form.school} onChange={handle}
              placeholder="e.g. ZP High School"
              className="input-base pl-8" />
          </Field>

          {/* Class */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1.5">
              <BookOpen size={13} className="inline mr-1" /> Class
            </label>
            <select name="class" value={form.class} onChange={handle}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
              {CLASSES.map(c => <option key={c} value={c}>{c} Class</option>)}
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition mt-2">
            {loading ? <span className="animate-spin">⏳</span> : '🎓'}
            {loading ? 'Creating account…' : 'Register Free'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}

// Small helper wrapper
function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}
