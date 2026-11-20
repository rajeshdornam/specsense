import React from 'react';
import { Link } from 'react-router-dom';
import { Star, SlidersHorizontal, TrendingUp, Clock, Check } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onQuickCompare, 
  isCompared = false 
}) {
  const {
    id,
    name,
    brand,
    category,
    image_url,
    current_price,
    refurbished_price,
    rating = 4.5,
    processor,
    display,
    benchmark_score
  } = product;

  // Format short spec highlights
  const specSnippet = [processor?.split('(')[0]?.trim(), display?.split('(')[0]?.trim()].filter(Boolean).join(' • ');

  return (
    <div className="group bg-white border border-[#E2E8F0] rounded-md p-4 flex flex-col justify-between hover:border-slate-400 hover:shadow-card transition-all duration-150">
      <div>
        {/* Brand & Category Row */}
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="font-semibold text-slate-600 tracking-wider uppercase text-[10px]">{brand}</span>
          <span className="text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{category}</span>
        </div>

        {/* Clean Product Photography Box */}
        <div className="relative w-full h-44 my-2 flex items-center justify-center p-3 bg-white rounded border border-slate-100 group-hover:border-slate-200 transition-colors">
          <img
            src={image_url}
            alt={name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-xs sm:text-sm text-slate-900 line-clamp-2 h-10 mt-2 leading-snug" title={name}>
          {name}
        </h3>

        {/* Rating & Benchmarks */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{rating}</span>
          </div>
          <span className="text-slate-300">•</span>
          {benchmark_score && (
            <span className="text-[11px] text-slate-500 tabular-nums">
              Score: <strong className="text-slate-800 font-semibold">{Math.round(benchmark_score / 1000)}k</strong>
            </span>
          )}
        </div>

        {/* Spec snippet */}
        {specSnippet && (
          <p className="text-[11px] text-slate-500 truncate mt-1.5" title={specSnippet}>
            {specSnippet}
          </p>
        )}
      </div>

      {/* Pricing and Action CTAs */}
      <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Best Verified Price</span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{current_price?.toLocaleString('en-IN')}
            </span>
          </div>
          {refurbished_price && (
            <div className="text-right">
              <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-medium tabular-nums block">
                Refurb: ₹{refurbished_price?.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onQuickCompare && onQuickCompare(product)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-semibold border transition-colors ${
              isCompared
                ? 'bg-blue-50 text-[#1D4ED8] border-[#1D4ED8]'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
            }`}
          >
            {isCompared ? <Check className="w-3.5 h-3.5 text-[#1D4ED8]" /> : <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isCompared ? 'Added' : 'Compare'}</span>
          </button>

          <Link
            to={`/tracker?productId=${id}`}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Price Trend</span>
          </Link>
        </div>

        <Link
          to={`/timing-hack?productId=${id}`}
          className="mt-2 w-full flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#1D4ED8] transition-colors py-0.5"
        >
          <Clock className="w-3 h-3 text-[#1D4ED8]" />
          <span>Timing Hack: Buy or Wait?</span>
        </Link>
      </div>
    </div>
  );
}
