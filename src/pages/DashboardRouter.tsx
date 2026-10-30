import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { StaffDashboard } from './StaffDashboard';
import { AdminDashboard } from './AdminDashboard';
import { UserCheck, Wrench, ShieldCheck, Lock } from 'lucide-react';

export const DashboardRouter: React.FC = () => {
  const { currentRole, currentUser } = useAuth();

  return (
    <div>
      {/* Role-Authenticated Header Bar */}
      <div className="bg-white border-b border-stone-200 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="font-semibold text-stone-800">Authorized Portal:</span>
            <span className="capitalize font-bold text-[#7A1528] bg-[#FDF2F4] px-2.5 py-0.5 rounded-full border border-[#f9d0d9] flex items-center gap-1.5">
              {currentRole === 'student' && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
              {currentRole === 'staff' && <Wrench className="w-3.5 h-3.5 text-blue-600" />}
              {currentRole === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />}
              <span>
                {currentRole === 'student' ? 'Resident Maintenance Portal' : currentRole === 'staff' ? 'Technician Work Queue' : 'Warden & Estate Command Center'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <Lock className="w-3 h-3 text-stone-400" />
            <span>Role-Gated Session: <strong>{currentUser?.email}</strong></span>
          </div>
        </div>
      </div>

      {/* Strictly Render User's Authorized Role Dashboard */}
      {currentRole === 'student' && <StudentDashboard />}
      {currentRole === 'staff' && <StaffDashboard />}
      {currentRole === 'admin' && <AdminDashboard />}
    </div>
  );
};
