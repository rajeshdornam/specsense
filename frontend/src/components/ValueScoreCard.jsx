import React from 'react';
import { Cpu, Battery, Eye, Camera, DollarSign, Info } from 'lucide-react';

const METRIC_ICONS = {
  'Performance & Architecture': Cpu,
  'Display & Visuals': Eye,
  'Battery & Charging Speed': Battery,
  'Optics & Sensing Suite': Camera,
  'Price-to-Spec Efficiency': DollarSign
};

export default function ValueScoreCard({ vfmData }) {
  if (!vfmData) return null;

  const {
    totalScore = 0,
    tier = 'Good Value',
    tierColor = '#1D4ED8',
    category = 'Smartphones',
    breakdown = [],
    formulaExplanation
  } = vfmData;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
            Hardware vs Price Efficiency Index
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">Value-For-Money (VFM) Score</h3>
          <p className="text-[11px] text-slate-500">
            Normalized benchmark in {category}
          </p>
        </div>

        {/* Big Score Box */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ color: tierColor, backgroundColor: `${tierColor}15` }}
            >
              {tier}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Category-Weighted</span>
          </div>
          <div 
            className="w-13 h-13 rounded flex items-center justify-center font-bold text-xl text-white shadow-2xs tabular-nums"
            style={{ backgroundColor: tierColor }}
          >
            {totalScore}
            <span className="text-[10px] font-normal opacity-80 ml-0.5">/100</span>
          </div>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Component Benchmark Weights
        </h4>

        <div className="divide-y divide-slate-100">
          {breakdown.map((item) => {
            const Icon = METRIC_ICONS[item.metric] || Cpu;
            const barWidth = Math.min(100, Math.max(5, item.score));

            return (
              <div key={item.metric} className="py-2.5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-slate-600" />
                    <span className="font-semibold text-slate-900 text-xs">{item.metric}</span>
                    <span className="text-[10px] text-slate-400">
                      ({item.weightPct}% weight)
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums text-xs">{item.score} / 100</span>
                </div>

                {/* Clean progress bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.score >= 80 ? '#15803D' : item.score >= 60 ? '#1D4ED8' : '#B45309'
                    }}
                  />
                </div>

                <p className="text-[10px] text-slate-500 mt-1">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#E2E8F0] flex items-start gap-1.5 text-[10px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p>{formulaExplanation}</p>
      </div>
    </div>
  );
}
