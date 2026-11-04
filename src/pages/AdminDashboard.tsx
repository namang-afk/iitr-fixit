import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { 
  CATEGORIES, 
  IITR_HOSTELS, 
  STATUS_META, 
  PRIORITY_META 
} from '../constants';
import { RequestCategory, RequestPriority, RequestStatus, StaffMember } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Building, 
  Users, 
  Download, 
  Filter, 
  Wrench, 
  ChevronRight,
  Flame,
  Search,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { requests, staffMembers, assignStaff, updatePriority } = useRequests();

  // Filters State
  const [selectedHostel, setSelectedHostel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'queue' | 'staff' | 'hostels'>('analytics');
  const [search, setSearch] = useState('');

  // Quick assignment modal state
  const [assignModalReqId, setAssignModalReqId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  // Filtered requests for the admin view
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (selectedHostel !== 'all' && r.hostel !== selectedHostel) return false;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.hostel.toLowerCase().includes(q) ||
          r.roomNumber.toLowerCase().includes(q) ||
          r.residentName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [requests, selectedHostel, selectedCategory, selectedStatus, search]);

  // Derived Analytics KPIs
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'submitted' || r.status === 'under_review').length;
  const resolvedRequests = requests.filter(r => r.status === 'resolved' || r.status === 'closed').length;
  const resolutionRate = totalRequests > 0 ? Math.round((resolvedRequests / totalRequests) * 100) : 0;
  
  // Overdue check (tickets in submitted/under_review > 48h)
  const now = new Date().getTime();
  const overdueRequests = requests.filter(r => {
    if (r.status === 'resolved' || r.status === 'closed') return false;
    const createdTime = new Date(r.createdAt).getTime();
    const diffHours = (now - createdTime) / (1000 * 60 * 60);
    return diffHours > 48;
  }).length;

  // Chart Data 1: Category Distribution
  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      name: cat.name.split(' ')[0], // short label
      fullName: cat.name,
      count: requests.filter(r => r.category === cat.id).length
    })).filter(c => c.count > 0);
  }, [requests]);

  // Chart Data 2: Status Breakdown Donut
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });

    const colors: Record<string, string> = {
      submitted: '#64748b',
      under_review: '#f59e0b',
      assigned: '#3b82f6',
      in_progress: '#8b5cf6',
      resolved: '#10b981',
      closed: '#78716c'
    };

    return Object.entries(counts).map(([key, count]) => ({
      name: STATUS_META[key as RequestStatus]?.label || key,
      value: count,
      color: colors[key] || '#94a3b8'
    }));
  }, [requests]);

  // Chart Data 3: Hostel Volume Comparison
  const hostelData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => {
      const shortName = r.hostel.replace(' Bhawan', '');
      counts[shortName] = (counts[shortName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);
  }, [requests]);

  // Chart Data 4: Daily timeline trends
  const trendData = useMemo(() => {
    return [
      { day: 'Oct 21', received: 4, resolved: 3 },
      { day: 'Oct 22', received: 6, resolved: 5 },
      { day: 'Oct 23', received: 5, resolved: 4 },
      { day: 'Oct 24', received: 8, resolved: 6 },
      { day: 'Oct 25', received: 7, resolved: 7 },
      { day: 'Oct 26', received: 9, resolved: 8 },
      { day: 'Oct 27', received: requests.length, resolved: resolvedRequests }
    ];
  }, [requests.length, resolvedRequests]);

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalReqId || !selectedStaffId) return;
    assignStaff(assignModalReqId, selectedStaffId);
    setAssignModalReqId(null);
    setSelectedStaffId('');
  };

  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Hostel', 'Room', 'Resident', 'Assigned Staff', 'Created At'];
    const rows = requests.map(r => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      r.category,
      r.priority,
      r.status,
      r.hostel,
      r.roomNumber,
      r.residentName,
      r.assignedStaffName || 'Unassigned',
      r.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `iitr_fixit_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Admin Command Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Council of Wardens / Estate Directorate
            </span>
            <span className="text-xs text-stone-500">
              Welcome, {currentUser?.name || 'Administrator'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Warden & Estate Command Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Monitor campus-wide turnaround times, manage technician loads, calibrate priorities, and track SLAs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            to="/requests/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <span>+ Admin Work Order</span>
          </Link>
        </div>
      </div>

      {/* 5 High-Level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Logged</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">{totalRequests}</div>
          <p className="text-[11px] text-stone-500">Across {IITR_HOSTELS.length} Bhawans</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending Review</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">{pendingRequests}</div>
          <p className="text-[11px] text-stone-500">Awaiting assignment</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">Overdue SLA</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-display">{overdueRequests}</div>
          <p className="text-[11px] text-stone-500">&gt; 48h unaddressed</p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Resolution Rate</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display">{resolutionRate}%</div>
          <p className="text-[11px] text-stone-500">{resolvedRequests} closed tickets</p>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A1528]">Avg Turnaround</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#7A1528] font-display">4.2 hrs</div>
          <p className="text-[11px] text-stone-500">Campus benchmark: 24h</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'analytics'
              ? 'bg-[#7A1528] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          Visual Analytics & SLAs
        </button>
        <button
          onClick={() => setActiveAdminTab('queue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'queue'
              ? 'bg-[#7A1528] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>Priority Dispatch Queue</span>
          <span className="bg-stone-200 text-stone-700 px-2 py-0.2 rounded-full text-[10px]">
            {filteredRequests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveAdminTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeAdminTab === 'staff'
              ? 'bg-[#7A1528] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          <span>Technicians & Staff Load</span>
          <span className="bg-stone-200 text-stone-700 px-2 py-0.2 rounded-full text-[10px]">
            {staffMembers.length}
          </span>
        </button>
        <button
          onClick={() => setActiveAdminTab('hostels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'hostels'
              ? 'bg-[#7A1528] text-white shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          Hostels Directory ({IITR_HOSTELS.length})
        </button>
      </div>

      {/* Tab 1: Visual Charts & Analytics */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Requests by Category */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-stone-900">Work Orders by Trade Category</h3>
                <span className="text-[11px] text-stone-400">Estate units</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} interval={0} angle={-20} textAnchor="end" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#7A1528" radius={[6, 6, 0, 0]} name="Tickets" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Status Breakdown Donut */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-stone-900">Current Status Distribution</h3>
                <span className="text-[11px] text-stone-400">Live breakdown</span>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Requests over time / Intake vs Resolution */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-stone-900">Intake vs Resolution Trends</h3>
                <span className="text-[11px] text-stone-400">Weekly rate</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7A1528" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7A1528" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="received" stroke="#7A1528" fillOpacity={1} fill="url(#colorRec)" name="New Requests" />
                    <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorRes)" name="Resolved" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Top Hostels by Maintenance Demand */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="text-sm font-bold text-stone-900">Highest Volume Bhawans</h3>
                <span className="text-[11px] text-stone-400">Hostel demand</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hostelData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#78716c' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '12px' }} />
                    <Bar dataKey="count" fill="#475569" radius={[0, 6, 6, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Priority Dispatch Queue */}
      {activeAdminTab === 'queue' && (
        <div className="space-y-4">
          {/* Quick Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket, hostel, resident..."
                className="w-full pl-9 pr-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-800"
            >
              <option value="all">All Hostels</option>
              {IITR_HOSTELS.map(h => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-800"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-800"
            >
              <option value="all">All Statuses</option>
              {Object.entries(STATUS_META).map(([k, meta]) => (
                <option key={k} value={k}>{meta.label}</option>
              ))}
            </select>
          </div>

          {/* Queue Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Title & Resident</th>
                    <th className="py-3 px-4">Hostel / Room</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Assigned Tech</th>
                    <th className="py-3 px-4 text-right">Warden Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#7A1528]">
                        <Link to={`/requests/${req.id}`} className="hover:underline">
                          {req.id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <Link to={`/requests/${req.id}`} className="font-bold text-stone-900 hover:text-[#7A1528] block line-clamp-1">
                          {req.title}
                        </Link>
                        <span className="text-[11px] text-stone-400">
                          {req.residentName} ({req.residentPhone})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-stone-800">
                        {req.hostel} • {req.roomNumber}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={req.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={req.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {req.assignedStaffName ? (
                          <span className="font-semibold text-stone-800">{req.assignedStaffName}</span>
                        ) : (
                          <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setAssignModalReqId(req.id);
                              setSelectedStaffId(req.assignedStaffId || '');
                            }}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
                          >
                            Assign Tech
                          </button>
                          <Link
                            to={`/requests/${req.id}`}
                            className="px-2.5 py-1 bg-[#7A1528] hover:bg-[#621323] text-white rounded-lg text-xs font-bold"
                          >
                            Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Staff Technicians Load Directory */}
      {activeAdminTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Estate Technicians Directory & Workload</h3>
              <p className="text-xs text-stone-500">Live technician roster across electrical, plumbing, carpentry, and network divisions.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {staffMembers.filter(s => s.status === 'available').length} Technicians Available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 px-4">Technician Name</th>
                  <th className="py-3 px-4">Specialty Unit</th>
                  <th className="py-3 px-4">Phone / Contact</th>
                  <th className="py-3 px-4">Active Jobs</th>
                  <th className="py-3 px-4">Resolved Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {staffMembers.map(staff => (
                  <tr key={staff.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {staff.name}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <div className="flex items-center gap-1.5">
                        <CategoryIcon category={staff.specialty} className="w-4 h-4" />
                        <span>{staff.specialty.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {staff.phone}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                        {staff.activeJobsCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {staff.completedJobsCount} repairs
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        staff.status === 'available'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {staff.status === 'available' ? 'Available' : 'On Site Job'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Hostels Directory */}
      {activeAdminTab === 'hostels' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Configured Campus Bhawans & Hostels</h3>
            <p className="text-xs text-stone-500">Unified residential coverage across IIT Roorkee campus.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IITR_HOSTELS.map(h => {
              const count = requests.filter(r => r.hostel.toLowerCase() === h.name.toLowerCase()).length;
              return (
                <div key={h.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs">{h.name}</h4>
                    <span className="text-[10px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                      {h.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <span>Capacity: {h.capacity}</span>
                    <span className="font-bold text-[#7A1528]">{count} Active Tickets</span>
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    Wings: {h.wings.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Assign Modal */}
      {assignModalReqId && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <h3 className="font-bold text-stone-900 text-sm">
              Assign Work Order: #{assignModalReqId}
            </h3>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1.5">
                  Select Specialized Technician:
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-xl border border-stone-300 text-xs text-stone-900"
                >
                  <option value="">Select Technician...</option>
                  {staffMembers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.specialty} • {s.activeJobsCount} active jobs)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalReqId(null)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedStaffId}
                  className="px-4 py-2 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl font-bold shadow-xs disabled:bg-stone-300"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
