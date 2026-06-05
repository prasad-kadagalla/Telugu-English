import React from 'react';

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${s} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
  );
};

export const PageLoader = () => (
  <div className="flex justify-center items-center py-20">
    <Spinner size="lg" />
  </div>
);

// ─── Page Header ─────────────────────────────────────────────────────────────
export const PageHeader = ({ icon, title, subtitle, color = 'border-blue-600' }) => (
  <div className={`bg-white rounded-xl p-5 border-b-4 ${color} mb-6 shadow-sm`}>
    <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2 mb-1">
      <span>{icon}</span> {title}
    </h2>
    {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, value, label, color = 'border-blue-600', bg = 'bg-blue-50', textColor = 'text-blue-600' }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${color}`}>
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-xl`}>{icon}</div>
      <div>
        <div className={`text-2xl font-bold ${textColor}`}>{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  </div>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = ({ icon = '📭', title, message }) => (
  <div className="text-center py-16 text-slate-400">
    <div className="text-5xl mb-3">{icon}</div>
    <h3 className="font-semibold text-slate-600 mb-1">{title}</h3>
    {message && <p className="text-sm">{message}</p>}
  </div>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, max, color = 'bg-blue-600', height = 'h-2' }) => {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${height}`}>
      <div
        className={`${height} ${color} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

// ─── Tag / Badge ──────────────────────────────────────────────────────────────
export const Tag = ({ children, variant = 'blue' }) => {
  const variants = {
    blue:   'bg-blue-50 text-blue-700',
    green:  'bg-emerald-50 text-emerald-700',
    amber:  'bg-amber-50 text-amber-700',
    purple: 'bg-purple-50 text-purple-700',
    red:    'bg-red-50 text-red-700',
    gray:   'bg-slate-100 text-slate-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant] || variants.blue}`}>
      {children}
    </span>
  );
};

// ─── Modal wrapper ────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md fade-in">
        {title && (
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
