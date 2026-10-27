import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useRequests } from '../context/RequestContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { ProgressTracker } from '../components/request/ProgressTracker';
import { 
  Search, 
  ArrowRight, 
  Building, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const QuickTrackPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getRequestById, requests } = useRequests();

  const [ticketInput, setTicketInput] = useState(searchParams.get('id') || '');
  const [searchedId, setSearchedId] = useState(searchParams.get('id') || '');

  useEffect(() => {
    const idFromParam = searchParams.get('id');
    if (idFromParam) {
      setTicketInput(idFromParam);
      setSearchedId(idFromParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setSearchedId(ticketInput.trim());
    setSearchParams({ id: ticketInput.trim() });
  };

  const matchedRequest = searchedId ? getRequestById(searchedId) : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7A1528] bg-[#FDF2F4] px-3 py-1 rounded-full border border-[#f9d0d9]">
          Direct Ticket Verification
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight font-display">
          Track Your Maintenance Ticket
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your 12-digit ticket reference ID to see current technician dispatch and stage milestones.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="pt-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="e.g. FIX-2026-001, FIX-2026-002..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10 shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={!ticketInput.trim()}
            className="px-6 py-3 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:bg-stone-300 disabled:cursor-not-allowed"
          >
            Track
          </button>
        </form>

        {/* Sample tickets shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-stone-500">
          <span>Try sample tickets:</span>
          {requests.slice(0, 3).map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setTicketInput(r.id);
                setSearchedId(r.id);
                setSearchParams({ id: r.id });
              }}
              className="font-mono font-bold text-[#7A1528] hover:underline bg-stone-100 px-2 py-0.5 rounded"
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      {searchedId && (
        <div>
          {matchedRequest ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in duration-200">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-extrabold text-[#7A1528]">
                      {matchedRequest.id}
                    </span>
                    <PriorityBadge priority={matchedRequest.priority} size="sm" />
                    <StatusBadge status={matchedRequest.status} size="sm" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                    {matchedRequest.title}
                  </h2>
                </div>

                <Link
                  to={`/requests/${matchedRequest.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto"
                >
                  <span>Open Full Ticket Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Progress Tracker */}
              <ProgressTracker
                currentStatus={matchedRequest.status}
                timeline={matchedRequest.timeline}
              />

              {/* Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-stone-400 block mb-1">Location:</span>
                  <p className="font-bold text-stone-900">{matchedRequest.hostel}</p>
                  <p className="text-stone-600">{matchedRequest.block} • Room {matchedRequest.roomNumber}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-stone-400 block mb-1">Assigned Technician:</span>
                  <p className="font-bold text-stone-900">
                    {matchedRequest.assignedStaffName || 'Under Review / Unassigned'}
                  </p>
                  <p className="text-stone-600">{matchedRequest.assignedStaffRole || 'Pending allocation'}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="text-stone-400 block mb-1">Preferred Time Window:</span>
                  <p className="font-bold text-stone-900 capitalize">{matchedRequest.preferredAccessTime}</p>
                  <p className="text-stone-600">Resident: {matchedRequest.residentName}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">Ticket Not Found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No record found matching <span className="font-mono font-bold text-stone-800">"{searchedId}"</span>. Please verify the ticket ID and try again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
