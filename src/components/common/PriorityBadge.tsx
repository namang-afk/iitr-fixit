import React from 'react';
import { RequestPriority } from '../../types';
import { PRIORITY_META } from '../../constants';
import { AlertTriangle, Flame, ArrowUp, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: RequestPriority;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showPulse = true }) => {
  const meta = PRIORITY_META[priority] || PRIORITY_META.normal;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-sm px-3 py-1 gap-1.5 font-medium',
  };

  const getIcon = () => {
    switch (priority) {
      case 'emergency':
        return <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />;
      case 'high':
        return <ArrowUp className="w-3.5 h-3.5 text-amber-600" />;
      case 'normal':
        return <Minus className="w-3.5 h-3.5 text-blue-600" />;
      case 'low':
        return <Minus className="w-3.5 h-3.5 text-stone-500" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${meta.bg} ${meta.text} ${meta.border} ${sizeClasses[size]}`}
    >
      {priority === 'emergency' && showPulse && (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
        </span>
      )}
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
};
