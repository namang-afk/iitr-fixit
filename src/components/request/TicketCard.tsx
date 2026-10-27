import React from 'react';
import { Link } from 'react-router-dom';
import { RequestItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { CategoryIcon } from '../common/CategoryIcon';
import { 
  Building, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Image as ImageIcon, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface TicketCardProps {
  request: RequestItem;
}

export const TicketCard: React.FC<TicketCardProps> = ({ request }) => {
  const date = new Date(request.createdAt);
  const formattedDate = date.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header: ID, Category & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center">
              <CategoryIcon category={request.category} className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#7A1528] tracking-tight">
                {request.id}
              </span>
              <p className="text-[11px] text-stone-500 capitalize">
                {request.category.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <PriorityBadge priority={request.priority} size="sm" />
            <StatusBadge status={request.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <Link 
          to={`/requests/${request.id}`}
          className="block group-hover:text-[#7A1528] transition-colors"
        >
          <h4 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2 mb-1.5">
            {request.title}
          </h4>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 mb-3.5 leading-relaxed">
          {request.description}
        </p>
      </div>

      {/* Meta Footer */}
      <div className="pt-3.5 border-t border-stone-100 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Building className="w-3.5 h-3.5 text-stone-400" />
            <span>{request.hostel} • {request.roomNumber}</span>
          </div>

          <div className="flex items-center gap-1 font-mono text-stone-400">
            <Clock className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Assigned Tech or Unassigned status */}
          <div className="text-[11px]">
            {request.assignedStaffName ? (
              <span className="inline-flex items-center gap-1 text-stone-600 font-medium">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{request.assignedStaffName}</span>
              </span>
            ) : (
              <span className="text-stone-400 italic">Unassigned</span>
            )}
          </div>

          {/* Right badges & arrow link */}
          <div className="flex items-center gap-3">
            {request.photos.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500" title={`${request.photos.length} photos attached`}>
                <ImageIcon className="w-3.5 h-3.5 text-stone-400" />
                <span>{request.photos.length}</span>
              </span>
            )}

            {request.comments.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-stone-500" title={`${request.comments.length} comments`}>
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                <span>{request.comments.length}</span>
              </span>
            )}

            <Link
              to={`/requests/${request.id}`}
              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#7A1528] group-hover:translate-x-0.5 transition-transform"
            >
              <span>View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
