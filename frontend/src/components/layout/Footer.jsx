import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">🌟 Telugu→English</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Free English learning platform for Telugu medium government school students. Learn pronunciation, grammar, and vocabulary with ease.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-slate-200">Modules</h4>
          <div className="space-y-2">
            {[['Pronunciation', '/pronunciation'], ['Grammar', '/grammar'], ['Vocabulary', '/vocabulary'], ['Quiz', '/quiz'], ['Daily Practice', '/daily']].map(([label, path]) => (
              <Link key={path} to={path} className="block text-slate-400 text-sm hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-slate-200">For Students</h4>
          <div className="space-y-1 text-slate-400 text-sm">
            <p>📚 Classes 5th to 10th</p>
            <p>🏫 Telugu medium schools</p>
            <p>🎉 Completely free</p>
            <p>📱 Works on mobile</p>
            <p>🔊 Audio pronunciation</p>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-slate-500 text-sm">
        Made with ❤️ for Telugu students | © {new Date().getFullYear()} English Learning Assistant
      </div>
    </footer>
  );
}
