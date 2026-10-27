import React from 'react';
import { RequestTimelineEvent } from '../../types';
import { Clock, User, Shield, Wrench, CheckCircle } from 'lucide-react';

interface TimelineViewProps {
  events: RequestTimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  const getActorBadge = (role: string) => {
    switch (role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <User className="w-3 h-3" /> Resident
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
            <Wrench className="w-3 h-3" /> Staff
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
            <Shield className="w-3 h-3" /> Warden
          </span>
        );
      default:
        return null;
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => {
          const date = new Date(event.timestamp);
          const formattedDate = date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <li key={event.id || eventIdx}>
              <div className="relative pb-8">
                {eventIdx !== sortedEvents.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-stone-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-600 shadow-xs">
                      <Clock className="w-4 h-4 text-[#7A1528]" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {event.action}
                        </span>
                        {getActorBadge(event.actorRole)}
                      </div>
                      <time className="text-[11px] font-mono text-stone-600">
                        {formattedDate} at {formattedTime}
                      </time>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 rounded-lg p-2.5 border border-stone-200/60 mt-1">
                      <span className="font-medium text-stone-800">{event.actorName}: </span>
                      {event.note || 'Status updated.'}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
