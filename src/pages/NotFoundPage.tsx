import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <div className="text-6xl font-black text-[#7A1528] font-display">404</div>
      <h1 className="text-xl font-bold text-stone-900">Page Not Found</h1>
      <p className="text-xs text-stone-600 leading-relaxed">
        The maintenance portal page you are looking for does not exist or has been relocated.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A1528] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#621323] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </Link>
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-800 border border-stone-300 rounded-xl text-xs font-semibold hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View Requests</span>
        </Link>
      </div>
    </div>
  );
};
