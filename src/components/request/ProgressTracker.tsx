import React from 'react';
import { RequestStatus, RequestTimelineEvent } from '../../types';
import { STATUS_META } from '../../constants';
import { Check, Clock, AlertCircle, Wrench, FileSearch, Archive } from 'lucide-react';

interface ProgressTrackerProps {
  currentStatus: RequestStatus;
  timeline: RequestTimelineEvent[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStatus, timeline }) => {
  const steps: { status: RequestStatus; label: string; icon: React.ReactNode }[] = [
    { status: 'submitted', label: 'Submitted', icon: <Clock className="w-3.5 h-3.5" /> },
    { status: 'under_review', label: 'Under Review', icon: <FileSearch className="w-3.5 h-3.5" /> },
    { status: 'assigned', label: 'Assigned', icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { status: 'in_progress', label: 'In Progress', icon: <Wrench className="w-3.5 h-3.5" /> },
    { status: 'resolved', label: 'Resolved', icon: <Check className="w-3.5 h-3.5" /> },
    { status: 'closed', label: 'Closed', icon: <Archive className="w-3.5 h-3.5" /> },
  ];

  const currentStepNum = STATUS_META[currentStatus]?.step || 1;

  // Find latest timestamp for each status in timeline
  const getStatusTimestamp = (status: RequestStatus) => {
    const match = timeline.find(t => t.toStatus === status || (status === 'submitted' && !t.fromStatus));
    if (match) {
      const date = new Date(match.timestamp);
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-stone-900 tracking-tight">Request Lifecycle Progress</h3>
          <p className="text-xs text-stone-500">Live progress tracking from submission to sign-off</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDF2F4] text-[#7A1528] border border-[#f9d0d9]">
            Step {currentStepNum} of {steps.length}: {STATUS_META[currentStatus]?.label}
          </span>
        </div>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="relative">
        {/* Track Line */}
        <div className="hidden md:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-stone-100 z-0 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="hidden md:block absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-[#7A1528] z-0 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${Math.max(0, ((currentStepNum - 1) / (steps.length - 1)) * 92)}%` }}
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-2 relative z-10">
          {steps.map((step) => {
            const stepNum = STATUS_META[step.status].step;
            const isCompleted = stepNum < currentStepNum;
            const isCurrent = stepNum === currentStepNum;
            const time = getStatusTimestamp(step.status);

            let nodeClass = 'bg-white border-stone-200 text-stone-400';
            let labelClass = 'text-stone-400 font-medium';

            if (isCompleted) {
              nodeClass = 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
              labelClass = 'text-stone-800 font-semibold';
            } else if (isCurrent) {
              nodeClass = 'bg-[#7A1528] border-[#7A1528] text-white ring-4 ring-[#7A1528]/15 shadow-sm';
              labelClass = 'text-[#7A1528] font-bold';
            }

            return (
              <div key={step.status} className="flex flex-col items-center text-center group">
                <div 
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 mb-2 ${nodeClass}`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.icon}
                </div>
                <span className={`text-xs tracking-tight ${labelClass}`}>
                  {step.label}
                </span>
                {time ? (
                  <span className="text-[10px] text-stone-500 mt-0.5 font-mono">
                    {time}
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-300 mt-0.5">
                    Pending
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
