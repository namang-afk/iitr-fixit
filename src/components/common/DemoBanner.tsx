import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { UserRole } from '../../types';
import { 
  UserCheck, 
  Wrench, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  LogOut, 
  LogIn, 
  ShieldAlert,
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentRole, currentUser, isAuthenticated, logout } = useAuth();
  const { resetDemoData } = useRequests();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getRoleLabel = (r?: UserRole | null) => {
    switch (r) {
      case 'student': return 'Resident / Student';
      case 'staff': return 'Maintenance Staff';
      case 'admin': return 'Warden / Admin';
      default: return 'Guest';
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside 
      aria-label="Campus authorization and demo controls"
      className="bg-stone-900 text-stone-200 border-b border-stone-800 text-xs px-3 sm:px-6 py-2 transition-all relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Authentication / Session Status */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-[#7A1528] text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3 text-amber-300" />
            IITR Auth
          </span>

          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-2 text-[11px] text-stone-300">
              <span className="text-stone-400">Authenticated:</span>
              <strong className="text-white">{currentUser.name}</strong>
              <span className="text-stone-400 hidden sm:inline">({currentUser.email})</span>
              <span className="bg-stone-800 text-amber-300 px-1.5 py-0.2 rounded font-mono text-[10px]">
                {getRoleLabel(currentRole)}
              </span>
            </div>
          ) : (
            <span className="text-stone-300 text-[11px]">
              Institutional room repair portal • Please authenticate with your IITR email to access role features.
            </span>
          )}

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-stone-400 hover:text-white p-1 ml-auto"
            title="Toggle session controls"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Actions */}
        {isExpanded && (
          <div className="flex flex-wrap items-center gap-2 justify-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-rose-300 hover:text-white bg-stone-800 hover:bg-rose-900/40 rounded-md border border-stone-700 transition-colors"
                  title="Sign out of current account"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign Out</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition-colors"
                  title="Switch to another persona"
                >
                  <span>Switch Role</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-white bg-[#7A1528] hover:bg-[#621323] rounded-md shadow-2xs transition-colors"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign in with IITR Mail</span>
              </Link>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset all demo requests and staff records to default seed data?')) {
                  resetDemoData();
                }
              }}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-stone-400 hover:text-stone-200 bg-stone-800/60 hover:bg-stone-800 rounded-md border border-stone-700/80 transition-colors"
              title="Reset sample data back to original state"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Seed Data</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
