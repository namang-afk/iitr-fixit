import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { StaffDashboard } from './StaffDashboard';
import { AdminDashboard } from './AdminDashboard';
import { UserCheck, Wrench, ShieldCheck } from 'lucide-react';

export const DashboardRouter: React.FC = () => {
  const { currentRole, switchRole } = useAuth();

  return (
    <div>
      {/* Dynamic View Indicator */}
      <div className="bg-stone-100/80 border-b border-stone-200 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="font-semibold text-stone-800">Current Dashboard View:</span>
            <span className="capitalize font-bold text-[#7A1528] bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
              {currentRole === 'student' ? 'Resident Portal' : currentRole === 'staff' ? 'Maintenance Technician' : 'Warden & Estate Admin'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-stone-400 mr-1 hidden sm:inline">Switch Perspective:</span>
            <button
              onClick={() => switchRole('student')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-[#7A1528] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              Resident
            </button>
            <button
              onClick={() => switchRole('staff')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === 'staff'
                  ? 'bg-[#7A1528] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-[#7A1528] text-white shadow-2xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              Warden / Admin
            </button>
          </div>
        </div>
      </div>

      {/* Render Role-Specific Dashboard */}
      {currentRole === 'student' && <StudentDashboard />}
      {currentRole === 'staff' && <StaffDashboard />}
      {currentRole === 'admin' && <AdminDashboard />}
    </div>
  );
};
