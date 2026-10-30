import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { TicketCard } from '../components/request/TicketCard';
import { 
  PlusCircle, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests } = useRequests();

  // Student's personal requests
  const myRequests = requests.filter(r => r.residentId === (currentUser?.id || ''));

  const openCount = myRequests.filter(r => r.status === 'submitted' || r.status === 'under_review').length;
  const inProgressCount = myRequests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length;
  const resolvedCount = myRequests.filter(r => r.status === 'resolved').length;
  const closedCount = myRequests.filter(r => r.status === 'closed').length;

  const recentRequests = [...myRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Recent activity across student's tickets
  const recentEvents = myRequests
    .flatMap(r => r.timeline.map(t => ({ ...t, ticketId: r.id, ticketTitle: r.title })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Welcome & Quick Action Header */}
      <div className="bg-gradient-to-r from-[#7A1528] to-[#9e1a3d] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold text-amber-200">
            <Building className="w-3.5 h-3.5" />
            <span>{currentUser?.hostel || 'Campus Bhawan'} • Room {currentUser?.room || 'R-314'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Welcome back, {currentUser?.name || 'Resident'}
          </h1>
          <p className="text-stone-200 text-xs sm:text-sm max-w-xl leading-relaxed">
            Report any electrical, plumbing, carpentry, or network faults in your room. Track active repairs and review technician sign-offs.
          </p>
        </div>

        <div className="flex-shrink-0 relative z-10">
          <Link
            to="/requests/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-[#7A1528] text-xs font-bold rounded-2xl shadow-sm hover:shadow transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#7A1528]" />
            <span>Report a Problem</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Awaiting Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900 font-display">
            {openCount}
          </div>
          <p className="text-[11px] text-stone-500">In intake queue</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Wrench className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900 font-display">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-stone-500">Technician dispatched</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Needs Attention</span>
            <AlertCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 font-display">
            {resolvedCount}
          </div>
          <p className="text-[11px] text-stone-500">Awaiting your sign-off</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-stone-400" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900 font-display">
            {closedCount}
          </div>
          <p className="text-[11px] text-stone-500">Archived fixes</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Requests (Left) & Activity Timeline + FAQs (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): My Recent Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              My Active Room Requests ({myRequests.length})
            </h2>
            <Link
              to="/requests"
              className="text-xs font-bold text-[#7A1528] hover:underline inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FDF2F4] text-[#7A1528] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">No open requests for your room</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Everything in room {currentUser?.room || 'your room'} looks good! If you ever notice an issue, tap below to report it.
              </p>
              <Link
                to="/requests/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A1528] text-white text-xs font-semibold rounded-xl"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Log Maintenance Request</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentRequests.map(req => (
                <TicketCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Activity Timeline & FAQ */}
        <div className="space-y-6">
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-100 pb-2">
              Recent Ticket Activity
            </h3>

            {recentEvents.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No recent timeline events yet.</p>
            ) : (
              <div className="space-y-3">
                {recentEvents.map(event => (
                  <div key={event.id} className="text-xs border-b border-stone-100 last:border-0 pb-2.5 last:pb-0">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-0.5">
                      <Link to={`/requests/${event.ticketId}`} className="font-mono font-bold text-[#7A1528] hover:underline">
                        {event.ticketId}
                      </Link>
                      <span>
                        {new Date(event.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="font-semibold text-stone-800">{event.action}</p>
                    {event.note && (
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Hostel Guidelines */}
          <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 space-y-2.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <HelpCircle className="w-4 h-4 text-[#7A1528]" />
              <span>Hostel Maintenance Tips</span>
            </div>
            <ul className="space-y-1.5 text-stone-600 text-[11px] list-disc list-inside">
              <li>Always mention your exact room number & wing clearly.</li>
              <li>Attaching photos speeds up technician diagnosis by 40%.</li>
              <li>Emergency numbers are reserved for hazards (water leaks, sparks).</li>
              <li>You can reopen any ticket within 7 days if the fix fails.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
