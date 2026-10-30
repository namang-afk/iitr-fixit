import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { RequestStatus, RequestPriority } from '../types';
import { STATUS_META, PRIORITY_META, CATEGORIES } from '../constants';
import { StatusBadge } from '../components/common/StatusBadge';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { ProgressTracker } from '../components/request/ProgressTracker';
import { TimelineView } from '../components/request/TimelineView';
import { CommentSection } from '../components/request/CommentSection';
import { 
  Building, 
  MapPin, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Star, 
  X, 
  Send, 
  Wrench, 
  ShieldCheck, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';

export const RequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentRole, currentUser } = useAuth();
  const { 
    getRequestById, 
    updateStatus, 
    assignStaff, 
    updatePriority, 
    addComment, 
    reopenRequest, 
    submitFeedback,
    staffMembers 
  } = useRequests();

  const request = id ? getRequestById(id) : undefined;

  // Modals & form state
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Request Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested ticket ID <span className="font-mono font-bold text-stone-700">#{id}</span> does not exist or was removed.
        </p>
        <Link
          to="/requests"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Return to All Requests</span>
        </Link>
      </div>
    );
  }

  const isStaffOrAdmin = currentRole === 'staff' || currentRole === 'admin';
  const isAuthor = currentUser ? request.residentId === currentUser.id : false;

  const handleStatusChange = (newStatus: RequestStatus, note?: string) => {
    if (newStatus === 'resolved') {
      setIsResolveModalOpen(true);
      return;
    }
    updateStatus(request.id, newStatus, note);
  };

  const handleConfirmResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) return;
    updateStatus(request.id, 'resolved', 'Repairs completed by technician on-site.', resolutionNotes.trim());
    setIsResolveModalOpen(false);
    setResolutionNotes('');
  };

  const handleConfirmReopen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reopenReason.trim()) return;
    reopenRequest(request.id, reopenReason.trim());
    setIsReopenModalOpen(false);
    setReopenReason('');
  };

  const handleConfirmFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback(request.id, rating, feedbackText.trim());
    setIsFeedbackModalOpen(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    assignStaff(request.id, selectedStaffId);
    setSelectedStaffId('');
  };

  const createdDate = new Date(request.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            to="/requests"
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
            title="Back to Requests"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-[#7A1528]">
                {request.id}
              </span>
              <PriorityBadge priority={request.priority} size="sm" />
              <StatusBadge status={request.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-display mt-0.5">
              {request.title}
            </h1>
          </div>
        </div>

        {/* Action Controls for Staff / Admin or Resident */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Staff Workflow Actions */}
          {isStaffOrAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              {request.status === 'submitted' && (
                <button
                  onClick={() => handleStatusChange('under_review', 'Reviewed by estate supervisor; verified on campus schedule.')}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Approve Review
                </button>
              )}

              {(request.status === 'submitted' || request.status === 'under_review' || request.status === 'assigned') && (
                <button
                  onClick={() => handleStatusChange('in_progress', 'Technician arrived at hostel with tools and replacement parts.')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Start Work (In Progress)
                </button>
              )}

              {request.status === 'in_progress' && (
                <button
                  onClick={() => setIsResolveModalOpen(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              )}

              {request.status === 'resolved' && (
                <button
                  onClick={() => handleStatusChange('closed', 'Ticket closed by Estate administration.')}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Archive / Close Ticket
                </button>
              )}
            </div>
          )}

          {/* Student Actions: Reopen or Rate */}
          {request.status === 'resolved' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReopenModalOpen(true)}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Ticket</span>
              </button>

              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5" />
                <span>Sign Off & Rate (5★)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6-Step Visual Progress Tracker */}
      <ProgressTracker 
        currentStatus={request.status} 
        timeline={request.timeline} 
      />

      {/* Main Grid: Details Left, Meta & Timeline Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Details, Photos, Resolution Notes, Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Description Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-sm font-bold text-stone-900">Issue Details</h3>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 capitalize">
                <CategoryIcon category={request.category} className="w-4 h-4" />
                <span>{request.category.replace('_', ' ')}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
              {request.description}
            </p>

            {/* Photos Lightbox Gallery */}
            {request.photos.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-stone-800 mb-2.5">
                  Attached Room Photos ({request.photos.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {request.photos.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhoto(url)}
                      className="aspect-video rounded-xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer group relative shadow-2xs"
                    >
                      <img
                        src={url}
                        alt={`Attachment ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        Click to view
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resolution Card if resolved */}
          {request.resolutionNotes && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Technician Resolution Report
                </span>
                {request.resolvedAt && (
                  <span className="text-[11px] font-mono text-emerald-700">
                    Completed on {new Date(request.resolvedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <p className="text-emerald-950 leading-relaxed bg-white/70 rounded-xl p-3 border border-emerald-200/60">
                {request.resolutionNotes}
              </p>
              {request.rating && (
                <div className="flex items-center gap-2 pt-1 text-emerald-900 font-semibold">
                  <span>Resident Rating:</span>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < (request.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} 
                      />
                    ))}
                  </div>
                  {request.feedbackComment && (
                    <span className="text-stone-600 italic">"{request.feedbackComment}"</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Communication & Comments Thread */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs">
            <CommentSection
              comments={request.comments}
              onAddComment={(text, isInternal) => addComment(request.id, text, isInternal)}
            />
          </div>
        </div>

        {/* Right Column (1 Col): Location Info, Assigned Tech, Quick Controls, Audit Timeline */}
        <div className="space-y-6">
          {/* Location & Resident Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3.5 text-xs">
            <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2">
              Room Location & Resident
            </h3>

            <div className="space-y-2 text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Hostel:</span>
                <span className="font-bold text-stone-900">{request.hostel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Wing / Block:</span>
                <span className="font-semibold">{request.block}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Room Number:</span>
                <span className="font-mono font-bold text-[#7A1528] bg-[#FDF2F4] px-2 py-0.5 rounded">
                  {request.roomNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Visit Window:</span>
                <span className="font-semibold capitalize text-stone-800">{request.preferredAccessTime}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 space-y-2 text-stone-600">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Resident:</span>
                <span className="font-bold text-stone-900">{request.residentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Enrollment No:</span>
                <span className="font-mono">{request.residentEnrollment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">Phone:</span>
                <span className="font-mono font-semibold text-stone-800">{request.residentPhone}</span>
              </div>
            </div>
          </div>

          {/* Assigned Technician Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-bold text-stone-900">Assigned Technician</h3>
              {isStaffOrAdmin && (
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                  Admin Action
                </span>
              )}
            </div>

            {request.assignedStaffName ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{request.assignedStaffName}</h4>
                    <p className="text-[11px] text-stone-500">{request.assignedStaffRole}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Direct Contact:</span>
                  <span className="font-mono font-bold text-stone-800">{request.assignedStaffPhone}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-stone-500">
                <p className="italic">No technician assigned yet.</p>
              </div>
            )}

            {/* Staff / Admin Quick Assignment Form */}
            {isStaffOrAdmin && (
              <form onSubmit={handleAssignSubmit} className="pt-2 border-t border-stone-100 space-y-2">
                <label className="block text-[11px] font-bold text-stone-700">
                  {request.assignedStaffName ? 'Reassign to another technician:' : 'Assign specialized technician:'}
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-300 text-xs text-stone-800 focus:outline-hidden"
                  >
                    <option value="">Select Technician...</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.specialty} • {s.activeJobsCount} active)
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!selectedStaffId}
                    className="px-3 py-1.5 bg-[#7A1528] hover:bg-[#621323] text-white rounded-lg text-xs font-semibold disabled:bg-stone-300 disabled:cursor-not-allowed"
                  >
                    Assign
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Audit Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs">
            <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-3 mb-4 text-xs">
              Status History & Audit Trail
            </h3>
            <TimelineView events={request.timeline} />
          </div>
        </div>
      </div>

      {/* Lightbox Photo Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-stone-900 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-white hover:bg-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto}
              alt="Full size attachment"
              className="max-h-[85vh] w-auto mx-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Mark Resolved Modal */}
      {isResolveModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Complete & Mark Resolved
              </h3>
              <button onClick={() => setIsResolveModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmResolve} className="space-y-3.5 text-xs">
              <p className="text-stone-600">
                Provide notes on parts replaced or repair actions taken for estate records and resident review.
              </p>
              <textarea
                rows={4}
                required
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Replaced capacitor and speed regulator; verified fan runs at speeds 1-5 without vibration..."
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 resize-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!resolutionNotes.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs disabled:bg-stone-300"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reopen Ticket Modal */}
      {isReopenModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                Reopen Request #{request.id}
              </h3>
              <button onClick={() => setIsReopenModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReopen} className="space-y-3.5 text-xs">
              <p className="text-stone-600">
                Tell the supervisor why this issue is not fully resolved so the technician can be re-dispatched.
              </p>
              <textarea
                rows={3}
                required
                value={reopenReason}
                onChange={(e) => setReopenReason(e.target.value)}
                placeholder="e.g. Fan is still making humming noise at speed 3, or tap began dripping again..."
                className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-hidden focus:border-rose-600 focus:ring-2 focus:ring-rose-100 resize-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReopenModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reopenReason.trim()}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs disabled:bg-stone-300"
                >
                  Reopen Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback & Star Rating Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                Rate Repair & Finalize Ticket
              </h3>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmFeedback} className="space-y-4 text-xs">
              <div className="text-center space-y-2">
                <span className="text-stone-500">How satisfied are you with the repair?</span>
                <div className="flex justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Resident remarks (Optional)
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Technician arrived promptly and was courteous. Issue resolved completely."
                  className="w-full p-3 bg-stone-50 rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#7A1528] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7A1528] hover:bg-[#621323] text-white rounded-xl font-bold shadow-xs"
                >
                  Submit & Close Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
