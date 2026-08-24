import React from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  views: number;
  className?: string;
  showIcon?: boolean;
}

/**
 * Formats numbers into readable counts like 1.2k, 45.8k, or 850
 */
export function formatViewCount(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

export const ViewCounter: React.FC<ViewCounterProps> = ({
  views,
  className = '',
  showIcon = true,
}) => {
  const formatted = formatViewCount(views || 0);

  return (
    <div className={`text-slate-500 text-sm flex items-center gap-1.5 font-medium ${className}`}>
      {showIcon && <Eye className="w-4 h-4 text-slate-400 shrink-0" />}
      <span>{formatted}</span>
    </div>
  );
};

export default ViewCounter;
