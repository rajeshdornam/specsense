import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import RecommendationBadge from './RecommendationBadge';

export default function RecommendationCard({ recommendationData }) {
  if (!recommendationData) return null;

  const {
    recommendation,
    badgeType,
    metrics = {},
    explanation,
    keyDrivers = [],
    disclaimer
  } = recommendationData;

  const {
    currentPrice = 0,
    ma90 = 0,
    ma30 = 0,
    historicalLow = 0,
    historicalHigh = 0,
    priceDeviationPct = 0,
    distanceToLowPct = 0
  } = metrics;

  const isBuyNow = badgeType === 'deal';
  const isWait = badgeType === 'wait';

  return (
    <div className={`border rounded p-5 space-y-4 ${
      isBuyNow 
        ? 'bg-[#F0FDF4] border-[#86EFAC]' 
        : isWait 
        ? 'bg-[#FFFBEB] border-[#FDE68A]' 
        : 'bg-white border-[#E2E8F0]'
    }`}>
      {/* Top Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Algorithmic Purchase Timing Model
          </span>
          <div className="flex items-center gap-2.5">
            <RecommendationBadge recommendation={recommendation} badgeType={badgeType} size="lg" />
            <span className="text-xs text-slate-600 font-medium">
              {isBuyNow ? 'Empirical Low Window' : isWait ? 'Above Standard Price Corridor' : 'Standard Market Range'}
            </span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="sm:text-right">
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Verified Price</span>
          <div className="flex items-baseline sm:justify-end gap-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            <span className={`text-xs font-bold px-1.5 py-0.2 rounded tabular-nums ${
              priceDeviationPct < 0 
                ? 'bg-emerald-100 text-emerald-800' 
                : priceDeviationPct > 0 
                ? 'bg-amber-100 text-amber-900' 
                : 'bg-blue-100 text-blue-900'
            }`}>
              {priceDeviationPct > 0 ? `+${priceDeviationPct}%` : `${priceDeviationPct}%`} vs MA90
            </span>
          </div>
        </div>
      </div>

      {/* Rationale Explanation Box */}
      <div className="bg-white p-3.5 rounded border border-slate-200/90 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Empirical Rationale</span>
        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
          {explanation}
        </p>
      </div>

      {/* Numerical Drivers and Metric Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Key Drivers */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3.5">
          <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Decision Drivers
          </h5>
          <ul className="space-y-1.5">
            {keyDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                <ChevronRight className="w-3.5 h-3.5 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Statistical Benchmarks */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3.5">
          <h5 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Quantitative Benchmarks
          </h5>
          <div className="divide-y divide-slate-100 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">90-Day Moving Average:</span>
              <span className="font-semibold text-slate-900 tabular-nums">₹{ma90.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">30-Day Moving Average:</span>
              <span className="font-semibold text-slate-900 tabular-nums">₹{ma30.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Historical 90-Day Low:</span>
              <span className="font-bold text-emerald-700 tabular-nums">₹{historicalLow.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Distance to Low:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{distanceToLowPct}% above lowest point</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pt-2 border-t border-slate-200/80 flex items-start gap-1.5 text-[10px] text-slate-500">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>{disclaimer}</p>
      </div>
    </div>
  );
}
