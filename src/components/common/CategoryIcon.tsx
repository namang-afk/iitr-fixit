import React from 'react';
import { RequestCategory } from '../../types';
import { 
  Zap, 
  Droplets, 
  Hammer, 
  Wifi, 
  Sparkles, 
  Bug, 
  Building2, 
  HelpCircle 
} from 'lucide-react';

interface CategoryIconProps {
  category: RequestCategory;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  switch (category) {
    case 'electrical':
      return <Zap className={`${className} text-amber-600`} />;
    case 'plumbing':
      return <Droplets className={`${className} text-blue-600`} />;
    case 'carpentry':
      return <Hammer className={`${className} text-amber-700`} />;
    case 'internet':
      return <Wifi className={`${className} text-indigo-600`} />;
    case 'cleaning':
      return <Sparkles className={`${className} text-emerald-600`} />;
    case 'pest_control':
      return <Bug className={`${className} text-orange-600`} />;
    case 'civil_works':
      return <Building2 className={`${className} text-stone-700`} />;
    case 'other':
    default:
      return <HelpCircle className={`${className} text-stone-600`} />;
  }
};
