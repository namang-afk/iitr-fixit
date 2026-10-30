import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, LogOut, LayoutDashboard, UserCheck, Wrench, ShieldCheck } from 'lucide-react';

interface UnauthorizedPageProps {
  allowedRoles?: UserRole[];
  currentRole?: UserRole | null;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ allowedRoles, currentRole }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleLabel = (r?: UserRole | null) => {
    switch (r) {
      case 'student': return 'Resident / Student';
      case 'staff': return 'Maintenance Staff';
      case 'admin': return 'Warden / Administrator';
      default: return 'Guest';
    }
  };

  const allowedListText = allowedRoles?.map(getRoleLabel).join(' or ') || 'Authorized Personnel';

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
        <ShieldAlert className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          403 • Role Access Restricted
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
          Access Denied
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          In accordance with IIT Roorkee campus data security rules, this portal page is strictly restricted to <strong className="text-stone-900">{allowedListText}</strong>.
        </p>
      </div>

      {/* Role State Banner */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs text-xs text-left space-y-2">
        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
          <span className="text-stone-500">Your Current Session:</span>
          <span className="font-bold text-[#7A1528]">{getRoleLabel(currentRole)}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-600">
          <span>Logged In Account:</span>
          <span className="font-mono">{currentUser?.email || 'Unknown'}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-stone-600">
          <span>Name & Dept:</span>
          <span>{currentUser?.name} ({currentUser?.department || currentUser?.hostel})</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to My Dashboard</span>
        </Link>

        <button
          onClick={handleSwitchAccount}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold rounded-xl border border-stone-300 transition-colors"
        >
          <LogOut className="w-4 h-4 text-stone-500" />
          <span>Login with Different Role</span>
        </button>
      </div>
    </div>
  );
};
