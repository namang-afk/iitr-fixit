import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { CATEGORIES, IITR_HOSTELS } from '../constants';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { 
  Wrench, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Building, 
  Flame,
  ThumbsUp,
  FileText,
  LogIn,
  UserCheck,
  Shield,
  LayoutDashboard
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentRole, currentUser } = useAuth();
  const { requests } = useRequests();
  const [trackId, setTrackId] = useState('');

  const totalResolved = requests.filter(r => r.status === 'resolved' || r.status === 'closed').length;
  const totalActive = requests.filter(r => r.status !== 'resolved' && r.status !== 'closed').length;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    navigate(`/track?id=${encodeURIComponent(trackId.trim())}`);
  };

  const steps = [
    {
      num: '01',
      title: 'Report in 60 Seconds',
      desc: 'Pick your bhawan and room, choose the category, describe the problem, and attach a photo.',
      icon: <FileText className="w-5 h-5 text-[#7A1528]" />
    },
    {
      num: '02',
      title: 'Smart Prioritization',
      desc: 'Automatic routing to the right estate wing (Electrical, Water Works, Carpentry, or ICC).',
      icon: <Zap className="w-5 h-5 text-amber-600" />
    },
    {
      num: '03',
      title: 'Technician Dispatched',
      desc: 'Assigned specialist visits during your chosen time slot. Live status updates at every stage.',
      icon: <Wrench className="w-5 h-5 text-blue-600" />
    },
    {
      num: '04',
      title: 'Verified Sign-Off',
      desc: 'Inspect the fix, provide a 1–5 star rating, or reopen the ticket with one click if needed.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-stone-200/80 bg-gradient-to-b from-[#FDF2F4]/40 via-[#FAF9F6] to-[#FAF9F6]">
        {/* Subtle background decorative grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#7A1528_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#f9d0d9] shadow-xs text-xs font-semibold text-[#7A1528] animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="w-2 h-2 rounded-full bg-[#7A1528] animate-pulse" />
              <span>IIT Roorkee Centralized Estate & Maintenance Service</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] font-display">
              Campus maintenance, <br className="hidden sm:inline" />
              <span className="text-[#7A1528]">without the follow-up.</span>
            </h1>

            {/* Explanation */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              A transparent, centralized repair portal for IIT Roorkee residents. Report room issues, track real-time progress from submission to resolution, and communicate directly with estate technicians.
            </p>

            {/* Main CTAs & Role Portals */}
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7A1528] hover:bg-[#621323] text-white font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95 text-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-300" />
                  <span>Open {currentRole === 'student' ? 'Resident' : currentRole === 'staff' ? 'Staff' : 'Warden'} Dashboard</span>
                </Link>

                {currentRole !== 'staff' ? (
                  <Link
                    to="/requests/new"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs hover:border-stone-400 transition-all text-sm"
                  >
                    <PlusCircle className="w-4 h-4 text-[#7A1528]" />
                    <span>Report New Issue</span>
                  </Link>
                ) : (
                  <Link
                    to="/requests"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs hover:border-stone-400 transition-all text-sm"
                  >
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>View Assigned Work Orders</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7A1528] hover:bg-[#621323] text-white font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-95 text-sm"
                  >
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Sign In with IITR Mail</span>
                  </Link>

                  <Link
                    to="/track"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-2xs hover:border-stone-400 transition-all text-sm"
                  >
                    <Search className="w-4 h-4 text-stone-500" />
                    <span>Track a Request</span>
                  </Link>
                </div>

                {/* Role portal shortcut gateways */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-2xl mx-auto text-left">
                  <Link
                    to="/login?role=student"
                    className="p-3 bg-white/90 hover:bg-white border border-stone-200 hover:border-emerald-300 rounded-xl transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-700">Resident / Student</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Report room issues & track repairs in your Bhawan</p>
                  </Link>

                  <Link
                    to="/login?role=staff"
                    className="p-3 bg-white/90 hover:bg-white border border-stone-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-xs">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 group-hover:text-blue-700">Maintenance Staff</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Manage work queues & update resolution milestones</p>
                  </Link>

                  <Link
                    to="/login?role=admin"
                    className="p-3 bg-white/90 hover:bg-white border border-stone-200 hover:border-purple-300 rounded-xl transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center text-xs">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-stone-900 group-hover:text-purple-700">Warden / Estate</span>
                    </div>
                    <p className="text-[11px] text-stone-500">Campus-wide overview, dispatch technicians & SLAs</p>
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Track Input Bar */}
            <div className="pt-4 max-w-md mx-auto">
              <form onSubmit={handleTrackSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  placeholder="Enter Ticket ID (e.g. FIX-2026-001)"
                  className="w-full pl-4 pr-24 py-3 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!trackId.trim()}
                  className="absolute right-1.5 px-3 py-1.5 bg-stone-900 hover:bg-[#7A1528] text-white rounded-lg text-xs font-semibold transition-colors disabled:bg-stone-300 disabled:cursor-not-allowed"
                >
                  Lookup
                </button>
              </form>
            </div>
          </div>

          {/* Stats Metrics Banner */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1528] font-display">
                {totalResolved}+
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-1">Repairs Completed</p>
              <p className="text-[11px] text-stone-500">Across campus bhawans</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                4.2 hrs
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-1">Average Response</p>
              <p className="text-[11px] text-stone-500">First staff assessment</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                14 Bhawans
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-1">Unified Coverage</p>
              <p className="text-[11px] text-stone-500">All UG, PG & Scholars</p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">
                98.4%
              </div>
              <p className="text-xs font-semibold text-stone-700 mt-1">Resident Rating</p>
              <p className="text-[11px] text-stone-500">Verified student feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7A1528] bg-[#FDF2F4] px-3 py-1 rounded-full border border-[#f9d0d9]">
            Transparent Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3 font-display">
            How IITR FixIt Works
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Eliminating physical register logs and unrecorded verbal complaints with an accountable 4-step workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-6 border border-stone-200/90 hover:border-stone-300 hover:shadow-sm transition-all duration-200 relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-stone-200 font-display group-hover:text-[#7A1528]/30 transition-colors">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Repair Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A1528] bg-[#FDF2F4] px-3 py-1 rounded-full border border-[#f9d0d9]">
              Specialized Units
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-2 font-display">
              Repair & Maintenance Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Work orders dispatched to specialized teams across the IIT Roorkee Estate & Works Directorate.
            </p>
          </div>

          <Link
            to="/requests/new"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1528] hover:text-[#621323] hover:underline"
          >
            <span>Submit a request in any category</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#7A1528]/40 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">
                    <CategoryIcon category={cat.id} className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    SLA: {cat.slaHours}h
                  </span>
                </div>

                <h3 className="text-sm font-bold text-stone-900 mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 mb-3 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Typical issues:</p>
                <p className="text-[11px] text-stone-600 line-clamp-1 italic">
                  {cat.examples.slice(0, 2).join(' • ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SLA & Service Commitments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1528] text-white text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              Estate Charter & SLAs
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
              Guaranteed turnaround times based on issue severity.
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Every submitted request is bound to campus SLA standards. Wardens and Estate Supervisors monitor pending tickets to eliminate overdue bottlenecks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase mb-1">
                  <Flame className="w-4 h-4" />
                  <span>Emergency</span>
                </div>
                <div className="text-xl font-bold font-display">&lt; 2 Hours</div>
                <p className="text-[11px] text-stone-400 mt-1">Immediate on-site response for sparks, gas, floods</p>
              </div>

              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
                  <Clock className="w-4 h-4" />
                  <span>High Priority</span>
                </div>
                <div className="text-xl font-bold font-display">Within 24h</div>
                <p className="text-[11px] text-stone-400 mt-1">Total fan stop in summer, main switch failure</p>
              </div>

              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Normal Priority</span>
                </div>
                <div className="text-xl font-bold font-display">24 – 48 Hours</div>
                <p className="text-[11px] text-stone-400 mt-1">Standard furniture repairs, tap drips, LAN issues</p>
              </div>

              <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700">
                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Low Priority</span>
                </div>
                <div className="text-xl font-bold font-display">3 – 5 Days</div>
                <p className="text-[11px] text-stone-400 mt-1">Aesthetic touchups, minor peeling, curtain rods</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to report CTA banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-[#FDF2F4] border border-[#f9d0d9] rounded-3xl p-8 sm:p-10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7A1528] font-display">
            Need something fixed in your room today?
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
            Log your request now. You will receive a permanent ticket ID to track progress, receive staff remarks, and inspect completion.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/requests/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>Submit Request Now</span>
            </Link>
            <Link
              to="/requests"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 shadow-2xs transition-all"
            >
              <span>View Open Tickets</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
