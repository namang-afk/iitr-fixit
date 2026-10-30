import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { RequestItem, RequestStatus } from '../types';
import { STATUS_META, PRIORITY_META } from '../constants';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building, 
  AlertTriangle, 
  ChevronRight, 
  Play, 
  UserPlus, 
  MessageSquare,
  Flame,
  X
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, updateStatus, assignStaff, addComment, staffMembers } = useRequests();

  const [activeTab, setActiveTab] = useState<'assigned_to_me' | 'unassigned' | 'emergency' | 'all'>('assigned_to_me');
  const [search, setSearch] = useState('');
  const [resolveModalItem, setResolveModalItem] = useState<RequestItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Find my staff record
  const myStaffRecord = staffMembers.find(s => s.name.toLowerCase() === (currentUser?.name || '').toLowerCase()) || staffMembers[0];

  // Tab filtering
  const filteredJobs = useMemo(() => {
    return requests.filter(req => {
      // Tab filter
      if (activeTab === 'assigned_to_me') {
        if (req.assignedStaffId !== myStaffRecord.id && req.assignedStaffName !== currentUser?.name) {
          return false;
        }
      } else if (activeTab === 'unassigned') {
        if (req.assignedStaffId || req.status === 'resolved' || req.status === 'closed') {
          return false;
        }
      } else if (activeTab === 'emergency') {
        if (req.priority !== 'emergency' && req.priority !== 'high') {
          return false;
        }
      }

      // Search
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches = 
          req.id.toLowerCase().includes(query) ||
          req.title.toLowerCase().includes(query) ||
          req.hostel.toLowerCase().includes(query) ||
          req.roomNumber.toLowerCase().includes(query) ||
          req.residentName.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => {
      // Emergency on top
      if (a.priority === 'emergency' && b.priority !== 'emergency') return -1;
      if (b.priority === 'emergency' && a.priority !== 'emergency') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [requests, activeTab, search, myStaffRecord, currentUser?.name]);

  const assignedCount = requests.filter(r => r.assignedStaffId === myStaffRecord.id && r.status !== 'closed').length;
  const unassignedCount = requests.filter(r => !r.assignedStaffId && r.status !== 'resolved' && r.status !== 'closed').length;
  const emergencyCount = requests.filter(r => (r.priority === 'emergency' || r.priority === 'high') && r.status !== 'closed').length;

  const handleClaimJob = (item: RequestItem) => {
    assignStaff(item.id, myStaffRecord.id);
  };

  const handleStartWork = (item: RequestItem) => {
    updateStatus(item.id, 'in_progress', 'Technician started active diagnostic and repair on-site.');
  };

  const handleOpenResolve = (item: RequestItem) => {
    setResolveModalItem(item);
    setResolutionNotes('');
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveModalItem || !resolutionNotes.trim()) return;
    updateStatus(resolveModalItem.id, 'resolved', 'Repairs completed on site.', resolutionNotes.trim());
    setResolveModalItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Staff Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
              <Wrench className="w-3 h-3 text-blue-600" />
              Estate Technician Portal
            </span>
            <span className="text-xs text-stone-500">
              Department: {currentUser?.department || 'Estate & Works – Electrical Unit'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Technician Work Queue
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Claim open jobs, report diagnostic status, order spare parts, and sign off completed repairs.
          </p>
        </div>

        {/* Quick search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search work orders..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('assigned_to_me')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'assigned_to_me'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>My Assigned Jobs</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] ${activeTab === 'assigned_to_me' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {assignedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('unassigned')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'unassigned'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>Unassigned Pool</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] ${activeTab === 'unassigned' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-700'}`}>
            {unassignedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'emergency'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>High & Emergency</span>
          <span className={`px-2 py-0.2 rounded-full text-[10px] ${activeTab === 'emergency' ? 'bg-rose-800 text-white' : 'bg-rose-200 text-rose-900'}`}>
            {emergencyCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>All Campus Orders ({requests.length})</span>
        </button>
      </div>

      {/* Work Orders List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No jobs in this queue</h3>
            <p className="text-xs text-stone-500">
              All tasks in this filter have been completed or reassigned.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isAssignedToMe = job.assignedStaffId === myStaffRecord.id;
            const isEmergency = job.priority === 'emergency';
            const created = new Date(job.createdAt).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs hover:shadow-sm ${
                  isEmergency
                    ? 'border-rose-300 ring-2 ring-rose-100'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Job Meta & Title */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#7A1528] bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                        {job.id}
                      </span>
                      <PriorityBadge priority={job.priority} size="sm" />
                      <StatusBadge status={job.status} size="sm" />
                      <span className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
                        <Building className="w-3.5 h-3.5 text-stone-400" />
                        {job.hostel} • {job.block} • Room {job.roomNumber}
                      </span>
                    </div>

                    <Link to={`/requests/${job.id}`} className="block group">
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-[#7A1528] transition-colors leading-snug">
                        {job.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-500 pt-1">
                      <span>Resident: <strong className="text-stone-700">{job.residentName}</strong> ({job.residentPhone})</span>
                      <span>Slot: <strong className="text-stone-700 capitalize">{job.preferredAccessTime}</strong></span>
                      <span>Logged: <strong className="text-stone-700">{created}</strong></span>
                      {job.comments.length > 0 && (
                        <span className="flex items-center gap-1 text-[#7A1528]">
                          <MessageSquare className="w-3 h-3" />
                          {job.comments.length} message(s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                    <div className="flex items-center gap-2">
                      {/* Claim Job if unassigned */}
                      {!job.assignedStaffId && (
                        <button
                          onClick={() => handleClaimJob(job)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Claim Work Order</span>
                        </button>
                      )}

                      {/* Start Work if assigned */}
                      {job.status === 'assigned' && (
                        <button
                          onClick={() => handleStartWork(job)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Start Inspection</span>
                        </button>
                      )}

                      {/* Mark Resolved if in progress */}
                      {job.status === 'in_progress' && (
                        <button
                          onClick={() => handleOpenResolve(job)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Fixed</span>
                        </button>
                      )}

                      <Link
                        to={`/requests/${job.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {job.assignedStaffName && (
                      <span className="text-[11px] text-stone-500">
                        Assigned to: <strong className="text-stone-800">{job.assignedStaffName}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Notes Modal */}
      {resolveModalItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Complete Repair: #{resolveModalItem.id}
              </h3>
              <button onClick={() => setResolveModalItem(null)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3.5 text-xs">
              <p className="text-stone-600">
                Record actions taken and spare parts utilized for estate store inventory.
              </p>
              <textarea
                rows={4}
                required
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Replaced leaking Teflon seal and brass ball valve; tested continuous flow at full mains pressure..."
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalItem(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resolutionNotes.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs disabled:bg-stone-300"
                >
                  Confirm & Notify Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
