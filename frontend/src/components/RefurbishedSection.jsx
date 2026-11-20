import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, CheckCircle } from 'lucide-react';
import { miscApi } from '../services/api';

export default function RefurbishedSection() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await miscApi.getRefurbishedDeals();
        if (res.success) {
          setDeals(res.data);
        }
      } catch (err) {
        console.error('Failed to load refurbished deals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#1D4ED8]" />
            <h3 className="text-sm font-bold text-slate-900">Certified Refurbished vs. Brand New Economics</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Compare retail MSRP against 40-point diagnostics certified refurbished units with full warranty.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Includes 6–12 Mo. Warranty</span>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Loading refurbished benchmarks...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {deals.slice(0, 6).map((deal) => (
            <div
              key={deal.id}
              className="border border-[#E2E8F0] rounded p-3.5 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700 uppercase tracking-wider">{deal.brand}</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded tabular-nums">
                    Save {deal.savings_pct}%
                  </span>
                </div>

                <div className="w-full h-24 my-1 flex items-center justify-center p-1">
                  <img
                    src={deal.image_url}
                    alt={deal.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <h4 className="font-semibold text-xs text-slate-900 line-clamp-1 mt-1" title={deal.name}>
                  {deal.name}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between items-center text-slate-500 text-[11px]">
                  <span>Brand New:</span>
                  <span className="line-through tabular-nums">₹{deal.new_price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">Certified Refurb:</span>
                  <span className="font-bold text-emerald-700 text-xs tabular-nums">
                    ₹{deal.refurbished_price?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-dashed border-slate-200 text-emerald-800 font-semibold">
                  <span>Net Savings:</span>
                  <span className="tabular-nums">₹{deal.savings_amount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>Refurbished prices verified from Amazon Renewed & Flipkart Refurbished diagnostic grades.</span>
        </div>
        <span className="font-medium text-slate-400">Persisted Dataset</span>
      </div>
    </div>
  );
}
