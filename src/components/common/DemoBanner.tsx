import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRequests } from '../../context/RequestContext';
import { UserRole } from '../../types';
import { UserCheck, Wrench, ShieldCheck, RotateCcw, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentRole, switchRole } = useAuth();
  const { resetDemoData } = useRequests();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      label: 'Resident',
      desc: 'Aarav Sharma (Rajendra R-314)',
      icon: <UserCheck className="w-3.5 h-3.5" />
    },
    {
      role: 'staff',
      label: 'Staff',
      desc: 'Rajesh Kumar (Electrical)',
      icon: <Wrench className="w-3.5 h-3.5" />
    },
    {
      role: 'admin',
      label: 'Warden / Admin',
      desc: 'Dr. P. K. Sen (Estate)',
      icon: <ShieldCheck className="w-3.5 h-3.5" />
    }
  ];

  return (
    <aside 
      aria-label="Demo environment controls"
      className="bg-stone-900 text-stone-200 border-b border-stone-800 text-xs px-3 sm:px-6 py-2 transition-all relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Disclaimer & Title */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-[#7A1528] text-white font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded">
            <Sparkles className="w-3 h-3" />
            Demo Mode
          </span>
          <span className="text-stone-300 hidden sm:inline text-[11px]">
            Interactive prototype for IIT Roorkee campus maintenance. LocalStorage data persistence.
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden text-stone-400 hover:text-white p-1"
            title="Toggle role switcher"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right: Role Switcher & Reset Button */}
        {isExpanded && (
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="text-[11px] text-stone-400 font-medium hidden lg:inline">
              Switch Persona:
            </span>
            <div className="inline-flex rounded-lg bg-stone-800 p-0.5 border border-stone-700">
              {roles.map(({ role, label, desc, icon }) => {
                const isActive = currentRole === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    title={`Switch view to ${desc}`}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      isActive
                        ? 'bg-[#7A1528] text-white shadow-xs font-semibold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-700/50'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo requests and staff records to default seed data?')) {
                  resetDemoData();
                }
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-md border border-stone-700 transition-colors"
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
