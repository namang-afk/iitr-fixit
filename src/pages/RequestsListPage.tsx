import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { FilterOptions, RequestStatus, RequestPriority, RequestCategory } from '../types';
import { CATEGORIES, IITR_HOSTELS, STATUS_META, PRIORITY_META } from '../constants';
import { TicketCard } from '../components/request/TicketCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List as ListIcon, 
  PlusCircle, 
  X, 
  ArrowUpDown, 
  RotateCcw,
  Building,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export const RequestsListPage: React.FC = () => {
  const { currentRole, currentUser } = useAuth();
  const { requests, getFilteredRequests, reopenRequest } = useRequests();

  // Filters State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [hostel, setHostel] = useState('all');
  const [assignedToMe, setAssignedToMe] = useState(currentRole === 'student');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority_desc' | 'status'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter options object
  const filterOptions: FilterOptions = useMemo(() => ({
    search,
    status,
    category,
    priority,
    hostel,
    assignedToMe,
    sortBy
  }), [search, status, category, priority, hostel, assignedToMe, sortBy]);

  const filteredRequests = useMemo(() => {
    return getFilteredRequests(filterOptions);
  }, [getFilteredRequests, filterOptions]);

  const hasActiveFilters = search || status !== 'all' || category !== 'all' || priority !== 'all' || hostel !== 'all';

  const clearFilters = () => {
    setSearch('');
    setStatus('all');
    setCategory('all');
    setPriority('all');
    setHostel('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A1528] bg-[#FDF2F4] px-2.5 py-0.5 rounded-full border border-[#f9d0d9]">
              Maintenance Central
            </span>
            <span className="text-xs text-stone-500">
              Showing {filteredRequests.length} of {requests.length} total tickets
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            {currentRole === 'student' ? 'My Campus Requests' : 'Estate Work Orders Queue'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Track repair tickets across all hostels, inspect assignments, and review status milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/requests/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Scope Selector Tabs for Students */}
      {currentRole === 'student' && (
        <div className="inline-flex rounded-xl bg-stone-200/70 p-1 border border-stone-200">
          <button
            onClick={() => setAssignedToMe(true)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              assignedToMe
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Room Tickets ({requests.filter(r => r.residentId === currentUser.id).length})
          </button>
          <button
            onClick={() => setAssignedToMe(false)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !assignedToMe
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Campus Tickets ({requests.length})
          </button>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, title, room, hostel, or staff..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50/60 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50/60 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-[#7A1528]"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_META).map(([key, meta]) => (
                <option key={key} value={key}>{meta.label}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50/60 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-[#7A1528]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50/60 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-[#7A1528]"
            >
              <option value="all">All Priorities</option>
              <option value="emergency">Emergency (&lt; 2h)</option>
              <option value="high">High (&lt; 24h)</option>
              <option value="normal">Normal (24–48h)</option>
              <option value="low">Low (3–5d)</option>
            </select>
          </div>
        </div>

        {/* Second Row: Hostel, Sort and View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-500 font-medium">Filter by Hostel:</span>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-300 text-xs text-stone-800"
            >
              <option value="all">All Hostels / Bhawans</option>
              {IITR_HOSTELS.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 text-stone-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-semibold text-stone-800 focus:outline-hidden"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="priority_desc">Highest Priority</option>
                <option value="status">By Status</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-600'}`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-400 hover:text-stone-600'}`}
                title="Table view"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Display */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">No requests match your current filters</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your search query, status, or clear all applied filters.
            </p>
          </div>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          ) : (
            <Link
              to="/requests/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A1528] text-white rounded-xl text-xs font-bold hover:bg-[#621323] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Request</span>
            </Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => (
            <TicketCard key={req.id} request={req} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Issue Title</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRequests.map((req) => {
                  const created = new Date(req.createdAt).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <tr key={req.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#7A1528]">
                        <Link to={`/requests/${req.id}`} className="hover:underline">
                          {req.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link to={`/requests/${req.id}`} className="font-bold text-stone-900 hover:text-[#7A1528] line-clamp-1">
                          {req.title}
                        </Link>
                        <p className="text-[11px] text-stone-400 line-clamp-1">{req.description}</p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-stone-700">
                        {req.hostel} • {req.roomNumber}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 capitalize">
                          <CategoryIcon category={req.category} className="w-3.5 h-3.5" />
                          <span>{req.category.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={req.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {req.assignedStaffName ? (
                          <span className="font-medium text-stone-800">{req.assignedStaffName}</span>
                        ) : (
                          <span className="text-stone-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-stone-500">
                        {created}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/requests/${req.id}`}
                          className="inline-flex items-center gap-1 font-bold text-[#7A1528] hover:underline"
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
