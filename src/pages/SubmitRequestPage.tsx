import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { 
  CATEGORIES, 
  IITR_HOSTELS, 
  ACCESS_TIME_SLOTS, 
  PRIORITY_META 
} from '../constants';
import { RequestCategory, RequestPriority, PreferredAccessTime } from '../types';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { PhotoUpload } from '../components/request/PhotoUpload';
import { EmergencyNoticeModal } from '../components/common/EmergencyNoticeModal';
import { 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Clock, 
  Building, 
  FileText, 
  Camera, 
  ArrowRight,
  Info
} from 'lucide-react';

export const SubmitRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { createRequest } = useRequests();

  // Form State
  const [category, setCategory] = useState<RequestCategory>('electrical');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hostel, setHostel] = useState(currentUser?.hostel || 'Rajendra Bhawan');
  const [block, setBlock] = useState('Wing C');
  const [roomNumber, setRoomNumber] = useState(currentUser?.room || 'R-314');
  const [priority, setPriority] = useState<RequestPriority>('normal');
  const [preferredAccessTime, setPreferredAccessTime] = useState<PreferredAccessTime>('afternoon');
  const [photos, setPhotos] = useState<string[]>([]);

  // Resident Contact info
  const [residentName, setResidentName] = useState(currentUser?.name || 'Aarav Sharma');
  const [residentPhone, setResidentPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [residentEnrollment, setResidentEnrollment] = useState(currentUser?.enrollmentNo || '22115042');
  const [residentEmail, setResidentEmail] = useState(currentUser?.email || 'resident@iitr.ac.in');

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const selectedCategoryMeta = CATEGORIES.find(c => c.id === category);

  const handlePrioritySelect = (p: RequestPriority) => {
    setPriority(p);
    if (p === 'emergency') {
      setEmergencyModalOpen(true);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter a clear title describing the maintenance issue.';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title should be at least 5 characters long.';
    }

    if (!description.trim()) {
      newErrors.description = 'Please provide details so the technician knows what tools to bring.';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description should be at least 15 characters long.';
    }

    if (!hostel) {
      newErrors.hostel = 'Please select your hostel or bhawan.';
    }

    if (!roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required for technician dispatch.';
    }

    if (!residentPhone.trim()) {
      newErrors.residentPhone = 'Contact phone number is required for dispatch calls.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = createRequest({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        hostel,
        block: block.trim() || 'Main Block',
        roomNumber: roomNumber.trim(),
        preferredAccessTime,
        photos,
        residentId: currentUser?.id || 'user_resident_1',
        residentName: residentName.trim(),
        residentEnrollment: residentEnrollment.trim(),
        residentPhone: residentPhone.trim(),
        residentEmail: residentEmail.trim()
      });

      setSubmittedTicketId(newRequest.id);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If submitted successfully, show confirmation screen
  if (submittedTicketId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-8 sm:p-12 space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Request Received & Logged
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
              Ticket #{submittedTicketId}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Your room maintenance request has been registered in the estate queue. An intake supervisor is reviewing the priority for dispatch.
            </p>
          </div>

          {/* Ticket Details Summary Card */}
          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 text-left space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Issue Title:</span>
              <span className="font-bold text-stone-900 text-right">{title}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Location:</span>
              <span className="font-semibold">{hostel}, {block} • Room {roomNumber}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200/70 pb-2">
              <span className="text-stone-500">Priority & SLA:</span>
              <span className="font-semibold capitalize text-[#7A1528]">{priority} ({PRIORITY_META[priority].sla})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Preferred Visit Window:</span>
              <span className="font-semibold capitalize">{preferredAccessTime}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/requests/${submittedTicketId}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95"
            >
              <span>Track Ticket Progress</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setSubmittedTicketId(null);
                setTitle('');
                setDescription('');
                setPhotos([]);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Another Problem</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link 
          to="/requests"
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 mb-2"
        >
          ← Back to Requests
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
          Report Room Maintenance Issue
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Provide accurate details to ensure our estate technicians bring the correct fixtures and tools.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Category Picker */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#7A1528] text-white flex items-center justify-center text-xs font-bold">1</span>
              Select Maintenance Category
            </h2>
            <span className="text-[11px] text-stone-500">
              Est. Resolution SLA: {selectedCategoryMeta?.slaHours} hours
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FDF2F4] border-[#7A1528] ring-2 ring-[#7A1528]/10 text-[#7A1528]'
                      : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <CategoryIcon category={cat.id} className="w-5 h-5" />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#7A1528]" />
                    )}
                  </div>
                  <span className="text-xs font-bold leading-tight block">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category tips */}
          {selectedCategoryMeta && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800">Common {selectedCategoryMeta.name} repairs: </span>
                <span>{selectedCategoryMeta.examples.join(', ')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Issue Details */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7A1528] text-white flex items-center justify-center text-xs font-bold">2</span>
            Describe the Problem
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Issue Summary / Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                placeholder="e.g., Ceiling fan regulator stuck, washbasin tap leaking, LAN port broken..."
                className={`w-full px-3.5 py-2.5 bg-stone-50/50 focus:bg-white rounded-xl border text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 transition-all ${
                  errors.title ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#7A1528] focus:ring-[#7A1528]/10'
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  {description.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Describe what happened, when it started, and any specific observations (e.g. humming sound, water dripping rate, burning odor)..."
                className={`w-full p-3.5 bg-stone-50/50 focus:bg-white rounded-xl border text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-2 transition-all resize-y ${
                  errors.description ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#7A1528] focus:ring-[#7A1528]/10'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.description}</p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Attach Room Photos (Optional but recommended)
              </label>
              <PhotoUpload photos={photos} onChange={setPhotos} />
            </div>
          </div>
        </div>

        {/* Section 3: Location & Access Timing */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7A1528] text-white flex items-center justify-center text-xs font-bold">3</span>
            Room Location & Preferred Visit Slot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hostel */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Hostel / Bhawan <span className="text-rose-500">*</span>
              </label>
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50/50 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10"
              >
                {IITR_HOSTELS.map(h => (
                  <option key={h.id} value={h.name}>
                    {h.name} ({h.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Block / Wing */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Block / Wing / Floor
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="e.g. Wing C, Floor 3"
                className="w-full px-3 py-2.5 bg-stone-50/50 focus:bg-white rounded-xl border border-stone-300 text-xs text-stone-900 focus:border-[#7A1528] focus:ring-2 focus:ring-[#7A1528]/10"
              />
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Room Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                  if (errors.roomNumber) setErrors(prev => ({ ...prev, roomNumber: '' }));
                }}
                placeholder="e.g. R-314, 204"
                className={`w-full px-3 py-2.5 bg-stone-50/50 focus:bg-white rounded-xl border text-xs text-stone-900 focus:outline-hidden focus:ring-2 ${
                  errors.roomNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-stone-300 focus:border-[#7A1528] focus:ring-[#7A1528]/10'
                }`}
              />
              {errors.roomNumber && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{errors.roomNumber}</p>
              )}
            </div>
          </div>

          {/* Preferred Access Slot */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              Preferred Technician Visit Window
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ACCESS_TIME_SLOTS.map((slot) => {
                const isSelected = preferredAccessTime === slot.id;
                return (
                  <label
                    key={slot.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FDF2F4] border-[#7A1528] text-stone-900'
                        : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accessTime"
                      checked={isSelected}
                      onChange={() => setPreferredAccessTime(slot.id as PreferredAccessTime)}
                      className="mt-0.5 text-[#7A1528] focus:ring-[#7A1528]"
                    />
                    <div>
                      <span className="text-xs font-bold block">{slot.label}</span>
                      <span className="text-[11px] text-stone-500">{slot.hint}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 4: Priority Calibration */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#7A1528] text-white flex items-center justify-center text-xs font-bold">4</span>
              Set Request Priority
            </h2>
            <span className="text-[11px] text-stone-500">
              SLA Guarantee: {PRIORITY_META[priority].sla}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['low', 'normal', 'high', 'emergency'] as RequestPriority[]).map((p) => {
              const meta = PRIORITY_META[p];
              const isSelected = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePrioritySelect(p)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? p === 'emergency'
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-300 text-rose-950 font-bold'
                        : 'bg-[#FDF2F4] border-[#7A1528] ring-2 ring-[#7A1528]/10 text-stone-900 font-bold'
                      : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span>
                    {p === 'emergency' && <Flame className="w-4 h-4 text-rose-600 animate-pulse" />}
                  </div>
                  <span className="text-[11px] text-stone-500 block">{meta.sla}</span>
                  <span className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-tight">
                    {meta.description}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Emergency callout */}
          {priority === 'emergency' && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Emergency tickets trigger immediate supervisor notification.</span>
              </div>
              <button
                type="button"
                onClick={() => setEmergencyModalOpen(true)}
                className="underline font-bold text-rose-800 text-xs whitespace-nowrap"
              >
                View Protocol Numbers
              </button>
            </div>
          )}
        </div>

        {/* Section 5: Resident Contact Info */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#7A1528] text-white flex items-center justify-center text-xs font-bold">5</span>
            Resident Contact & Enrollment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">Resident Full Name</label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50/50 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">Enrollment No. / Scholar ID</label>
              <input
                type="text"
                value={residentEnrollment}
                onChange={(e) => setResidentEnrollment(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50/50 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                Contact Mobile <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={residentPhone}
                onChange={(e) => {
                  setResidentPhone(e.target.value);
                  if (errors.residentPhone) setErrors(prev => ({ ...prev, residentPhone: '' }));
                }}
                className={`w-full px-3 py-2 bg-stone-50/50 rounded-xl border text-xs text-stone-900 ${
                  errors.residentPhone ? 'border-rose-400' : 'border-stone-300'
                }`}
              />
              {errors.residentPhone && (
                <p className="mt-1 text-[11px] text-rose-600">{errors.residentPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">Campus Email</label>
              <input
                type="email"
                value={residentEmail}
                onChange={(e) => setResidentEmail(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50/50 rounded-xl border border-stone-300 text-xs text-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
          <p className="text-[11px] text-stone-500">
            By submitting, your ticket will be saved to local storage with an audit timestamp and readable ID.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="w-1/2 sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#7A1528] hover:bg-[#621323] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:bg-stone-400"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              <span>{isSubmitting ? 'Registering...' : 'Log Ticket'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Emergency Notice Modal */}
      <EmergencyNoticeModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
      />
    </div>
  );
};
