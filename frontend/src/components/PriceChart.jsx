import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { Info } from 'lucide-react';

const RETAILER_COLORS = {
  Amazon: '#D97706',
  Flipkart: '#1D4ED8',
  'Direct Brand Store': '#059669',
};

export default function PriceChart({ timeline = [], currentPrice = 0, historicalLow = 0, averagePrice = 0 }) {
  const [selectedRange, setSelectedRange] = useState(90);
  const [visibleRetailers, setVisibleRetailers] = useState({
    Amazon: true,
    Flipkart: true,
    'Direct Brand Store': true,
    averageLine: true
  });

  const toggleRetailer = (key) => {
    setVisibleRetailers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return timeline.slice(-selectedRange);
  }, [timeline, selectedRange]);

  const { minY, maxY } = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return { minY: 0, maxY: 100000 };
    const allPrices = [];
    filteredData.forEach(d => {
      if (d.Amazon) allPrices.push(d.Amazon);
      if (d.Flipkart) allPrices.push(d.Flipkart);
      if (d['Direct Brand Store']) allPrices.push(d['Direct Brand Store']);
    });
    if (allPrices.length === 0) return { minY: 0, maxY: 100000 };
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    const padding = (max - min) * 0.1 || 1000;
    return {
      minY: Math.floor((min - padding) / 500) * 500,
      maxY: Math.ceil((max + padding) / 500) * 500
    };
  }, [filteredData]);

  // Clean Financial Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#CBD5E1] rounded shadow-md p-2.5 text-xs z-50">
          <p className="font-semibold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
            {label ? new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
          </p>
          <div className="space-y-1">
            {payload.map((item) => (
              <div key={item.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}:</span>
                </div>
                <span className="font-bold text-slate-900 tabular-nums">
                  ₹{Number(item.value).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5 space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        {/* Series Visibility Legend */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Series:</span>

          <button
            type="button"
            onClick={() => toggleRetailer('Amazon')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              visibleRetailers.Amazon 
                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                : 'bg-white text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-[#D97706]" />
            <span>Amazon</span>
          </button>

          <button
            type="button"
            onClick={() => toggleRetailer('Flipkart')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              visibleRetailers.Flipkart 
                ? 'bg-blue-50 text-blue-900 border-blue-300' 
                : 'bg-white text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-[#1D4ED8]" />
            <span>Flipkart</span>
          </button>

          <button
            type="button"
            onClick={() => toggleRetailer('Direct Brand Store')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              visibleRetailers['Direct Brand Store'] 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                : 'bg-white text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-xs bg-[#059669]" />
            <span>Brand Store</span>
          </button>

          <button
            type="button"
            onClick={() => toggleRetailer('averageLine')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border transition-colors ${
              visibleRetailers.averageLine 
                ? 'bg-slate-100 text-slate-800 border-slate-300' 
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <span className="w-2 h-0.5 bg-slate-400" />
            <span>MA Baseline</span>
          </button>
        </div>

        {/* Time Horizon Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-[#CBD5E1]">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setSelectedRange(days)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                selectedRange === days
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 12, right: 12, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
              }}
              minTickGap={25}
            />
            <YAxis
              domain={[minY, maxY]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference Line for 90-day Average */}
            {visibleRetailers.averageLine && averagePrice > 0 && (
              <ReferenceLine
                y={averagePrice}
                stroke="#64748B"
                strokeDasharray="4 4"
                label={{
                  value: `90d MA: ₹${averagePrice.toLocaleString('en-IN')}`,
                  position: 'insideTopRight',
                  fill: '#64748B',
                  fontSize: 10
                }}
              />
            )}

            {/* Reference Line for Historical Low */}
            {historicalLow > 0 && (
              <ReferenceLine
                y={historicalLow}
                stroke="#15803D"
                strokeDasharray="3 3"
                label={{
                  value: `90d Low: ₹${historicalLow.toLocaleString('en-IN')}`,
                  position: 'insideBottomRight',
                  fill: '#15803D',
                  fontSize: 10
                }}
              />
            )}

            {/* Retailer Lines */}
            {visibleRetailers.Amazon && (
              <Line
                type="monotone"
                dataKey="Amazon"
                name="Amazon"
                stroke={RETAILER_COLORS.Amazon}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}

            {visibleRetailers.Flipkart && (
              <Line
                type="monotone"
                dataKey="Flipkart"
                name="Flipkart"
                stroke={RETAILER_COLORS.Flipkart}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}

            {visibleRetailers['Direct Brand Store'] && (
              <Line
                type="monotone"
                dataKey="Direct Brand Store"
                name="Direct Brand Store"
                stroke={RETAILER_COLORS['Direct Brand Store']}
                strokeWidth={1.8}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Notes */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#15803D]" />
            <span>Green dash: 90-day historical low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#64748B]" />
            <span>Grey dash: 90-day moving average</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Info className="w-3.5 h-3.5" />
          <span>Cross-store daily verified recordings in SpecSense SQLite database</span>
        </div>
      </div>
    </div>
  );
}
