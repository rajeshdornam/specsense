import React from 'react';
import { TrendingDown, TrendingUp, Minus, Store, ExternalLink } from 'lucide-react';

export default function PriceSummary({ metrics, retailers = [] }) {
  if (!metrics) return null;

  const {
    currentPrice = 0,
    ma30 = 0,
    ma90 = 0,
    lowestPrice = 0,
    highestPrice = 0,
    deviation90 = 0,
    deviation30 = 0
  } = metrics;

  const isBelowAverage = deviation90 < 0;
  const isAboveAverage = deviation90 > 0;

  return (
    <div className="space-y-4">
      {/* 6 Clean Statistical Metric Cells */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {/* Current Best Price */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Current Best Price</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block tabular-nums">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Cross-retailer low</span>
        </div>

        {/* 30-Day Moving Average */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">30-Day Avg (MA30)</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block tabular-nums">
            ₹{ma30.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500 tabular-nums">
            {deviation30 <= 0 ? `${Math.abs(deviation30)}% under MA30` : `+${deviation30}% over MA30`}
          </span>
        </div>

        {/* 90-Day Moving Average */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">90-Day Avg (MA90)</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block tabular-nums">
            ₹{ma90.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Quarterly baseline</span>
        </div>

        {/* Historical 90-Day Low */}
        <div className="bg-[#F0FDF4] border border-[#86EFAC] rounded p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 block">Historical 90D Low</span>
          <span className="text-lg font-bold text-emerald-800 mt-1 block tabular-nums">
            ₹{lowestPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-700">90-day floor record</span>
        </div>

        {/* Historical 90-Day High */}
        <div className="bg-white border border-[#E2E8F0] rounded p-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Historical 90D High</span>
          <span className="text-lg font-bold text-slate-900 mt-1 block tabular-nums">
            ₹{highestPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-400">Peak recorded rate</span>
        </div>

        {/* Deviation Percentage */}
        <div className={`border rounded p-3 ${
          isBelowAverage 
            ? 'bg-[#F0FDF4] border-[#86EFAC]' 
            : isAboveAverage 
            ? 'bg-[#FFFBEB] border-[#FDE68A]' 
            : 'bg-white border-[#E2E8F0]'
        }`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">Deviation vs MA90</span>
          <div className="flex items-center gap-1 mt-1">
            {isBelowAverage ? (
              <TrendingDown className="w-4 h-4 text-emerald-700" />
            ) : isAboveAverage ? (
              <TrendingUp className="w-4 h-4 text-amber-700" />
            ) : (
              <Minus className="w-4 h-4 text-slate-600" />
            )}
            <span className={`text-lg font-bold tabular-nums ${
              isBelowAverage ? 'text-emerald-800' : isAboveAverage ? 'text-amber-800' : 'text-slate-800'
            }`}>
              {deviation90 > 0 ? `+${deviation90}%` : `${deviation90}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500">
            {isBelowAverage ? 'Under 90d baseline' : isAboveAverage ? 'Above 90d baseline' : 'At baseline'}
          </span>
        </div>
      </div>

      {/* Retailer Verified Listings Strip */}
      {retailers && retailers.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded p-4">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Multi-Retailer Price Comparison</span>
            </h4>
            <span className="text-[11px] text-slate-400">Updated daily at 00:00 UTC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {retailers.map((r) => {
              const retailerPrice = r.price || r.latest_price;
              const isBest = retailerPrice === Math.min(...retailers.map(x => x.price || x.latest_price));

              return (
                <div
                  key={r.retailer_id || r.name}
                  className={`p-3 rounded border flex items-center justify-between ${
                    isBest ? 'border-emerald-300 bg-emerald-50/40' : 'border-[#E2E8F0] bg-slate-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{r.retailer_name || r.name}</span>
                      {isBest && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase">
                          Best Price
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Direct Retail Listing</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      ₹{retailerPrice?.toLocaleString('en-IN')}
                    </span>
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-end gap-1 text-[10px] text-[#1D4ED8] hover:underline font-medium mt-0.5"
                    >
                      <span>Store link</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
