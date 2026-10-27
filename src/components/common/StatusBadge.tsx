import React from 'react';
import { RequestStatus } from '../../types';
import { STATUS_META } from '../../constants';
import { Clock, CheckCircle2, AlertCircle, Wrench, FileSearch, Archive } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const meta = STATUS_META[status] || STATUS_META.submitted;

  const getIcon = () => {
    switch (status) {
      case 'submitted':
        return <Clock className="w-3.5 h-3.5" />;
      case 'under_review':
        return <FileSearch className="w-3.5 h-3.5" />;
      case 'assigned':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'in_progress':
        return <Wrench className="w-3.5 h-3.5" />;
      case 'resolved':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'closed':
        return <Archive className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
