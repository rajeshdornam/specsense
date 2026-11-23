import React from 'react';
import { ShoppingBag, Scale, Clock } from 'lucide-react';

export default function RecommendationBadge({ recommendation, badgeType, size = 'md' }) {
  const isDeal = badgeType === 'deal' || (recommendation && recommendation.includes('BUY NOW'));
  const isWait = badgeType === 'wait' || (recommendation && recommendation.includes('WAIT'));
  
  let bg = 'bg-blue-50 text-[#1D4ED8] border-blue-200';
  let Icon = Scale;
  let label = recommendation || 'FAIR PRICE';

  if (isDeal) {
    bg = 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]';
    Icon = ShoppingBag;
  } else if (isWait) {
    bg = 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
    Icon = Clock;
  }

  const sizeClasses = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 gap-1 font-semibold' 
    : size === 'lg' 
    ? 'text-xs px-3 py-1.5 gap-1.5 font-bold tracking-wide' 
    : 'text-[11px] px-2.5 py-1 gap-1.5 font-semibold';

  return (
    <span className={`inline-flex items-center rounded-sm border uppercase tracking-wider ${bg} ${sizeClasses} ${isDeal ? 'badge-deal' : isWait ? 'badge-wait' : 'badge-fair'}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-3.5 h-3.5' : 'w-3 h-3'} />
      <span>{label}</span>
    </span>
  );
}
