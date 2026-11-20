import React from 'react';
import { X, RefreshCw, Star, Award, SlidersHorizontal, Check } from 'lucide-react';
import RecommendationBadge from './RecommendationBadge';

export default function CompareTable({
  products = [],
  specMatrix = [],
  highlights = {},
  showDifferencesOnly = false,
  onRemoveProduct,
  onReplaceProduct,
  onAddProduct
}) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded p-12 text-center text-slate-500">
        <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-900">No Products Selected</h3>
        <p className="text-xs mt-1">Select 2 or 3 gadgets to generate dynamic comparison.</p>
      </div>
    );
  }

  const displayedRows = specMatrix.filter(row => {
    if (!showDifferencesOnly) return true;
    return row.isDifferent;
  });

  return (
    <div className="bg-white border border-[#E2E8F0] rounded shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs min-w-[620px]">
          {/* Header Row: Products cards */}
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/70">
              {/* Sticky first column header */}
              <th className="sticky left-0 bg-white sm:bg-slate-50 z-20 w-48 sm:w-56 p-4 border-r border-[#E2E8F0] align-top">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Specifications
                </span>
                <p className="text-[11px] text-slate-600 font-normal">
                  Comparing {products.length} of 3 devices
                </p>
                {showDifferencesOnly && (
                  <span className="inline-block mt-2 px-1.5 py-0.2 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200 text-[10px] font-semibold">
                    Differences Only
                  </span>
                )}
              </th>

              {/* Product columns */}
              {products.map((prod) => {
                const isLowestPrice = prod.id === highlights.lowestPriceId;
                const isBestVFM = prod.id === highlights.bestValueId;

                return (
                  <th key={prod.id} className="w-64 sm:w-72 p-4 align-top border-r border-[#E2E8F0] last:border-r-0 bg-white">
                    <div className="flex flex-col justify-between h-full space-y-3">
                      {/* Brand & Action Controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {prod.brand}
                        </span>
                        <div className="flex items-center gap-1">
                          {onReplaceProduct && (
                            <button
                              type="button"
                              onClick={() => onReplaceProduct(prod.id)}
                              title="Replace gadget"
                              className="p-1 rounded text-slate-500 hover:text-[#1D4ED8] hover:bg-slate-100"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {products.length > 2 && onRemoveProduct && (
                            <button
                              type="button"
                              onClick={() => onRemoveProduct(prod.id)}
                              title="Remove gadget"
                              className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Product Thumbnail */}
                      <div className="w-full h-32 flex items-center justify-center p-2 rounded bg-white border border-slate-100">
                        <img
                          src={prod.image_url}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Title & Badges */}
                      <div>
                        <h4 className="font-semibold text-xs text-slate-900 line-clamp-2 h-8 leading-snug" title={prod.name}>
                          {prod.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 text-slate-700 text-[11px] font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                            <span>{prod.rating || 4.5}</span>
                          </div>
                          {isLowestPrice && (
                            <span className="px-1.5 py-0.2 rounded bg-[#DCFCE7] text-[#15803D] text-[10px] font-bold uppercase">
                              Lowest Price
                            </span>
                          )}
                          {isBestVFM && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#1D4ED8] text-[10px] font-bold uppercase">
                              Best VFM
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Recommendation */}
                      <div className="pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Best Price</span>
                        <div className="text-base font-bold text-slate-900 tabular-nums">
                          ₹{prod.current_price?.toLocaleString('en-IN')}
                        </div>

                        {prod.recommendation && (
                          <div className="mt-1.5">
                            <RecommendationBadge
                              recommendation={prod.recommendation.recommendation}
                              badgeType={prod.recommendation.badgeType}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}

              {/* Add 3rd product slot if only 2 selected */}
              {products.length === 2 && onAddProduct && (
                <th className="w-64 sm:w-72 p-6 align-middle border-r border-[#E2E8F0] bg-slate-50/40 text-center">
                  <div className="border border-dashed border-slate-300 rounded p-6 flex flex-col items-center justify-center space-y-2">
                    <span className="text-xs font-semibold text-slate-800">Compare 3rd Gadget</span>
                    <p className="text-[11px] text-slate-500">Inspect 3-way hardware differences.</p>
                    <button
                      type="button"
                      onClick={onAddProduct}
                      className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors"
                    >
                      + Add Gadget
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          {/* Specifications Matrix Body */}
          <tbody className="divide-y divide-[#E2E8F0]">
            {displayedRows.map((spec) => {
              const isDiff = spec.isDifferent;

              return (
                <tr
                  key={spec.key}
                  className={`transition-colors ${
                    isDiff ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/30 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Sticky First Column */}
                  <td className="sticky left-0 bg-white sm:bg-slate-50 z-10 p-3 sm:p-3.5 border-r border-[#E2E8F0] font-semibold text-slate-800 align-middle">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">{spec.label}</span>
                      {isDiff && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" title="Specification differs" />
                      )}
                    </div>
                  </td>

                  {/* Product Values */}
                  {spec.values.map((val, idx) => {
                    const prod = products[idx];
                    const isWinner = 
                      (spec.key === 'benchmark_score' && prod?.id === highlights.highestPerformanceId) ||
                      (spec.key === 'processor' && prod?.id === highlights.highestPerformanceId);

                    return (
                      <td
                        key={idx}
                        className={`p-3 sm:p-3.5 border-r border-[#E2E8F0] last:border-r-0 align-middle ${
                          !isDiff && showDifferencesOnly ? 'opacity-35' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${isWinner ? 'font-bold text-emerald-800' : 'text-slate-800'}`}>
                            {spec.key === 'benchmark_score' && typeof val === 'number'
                              ? val.toLocaleString('en-IN')
                              : val}
                          </span>
                          {isWinner && (
                            <Award className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0 ml-1" title="Top performer" />
                          )}
                        </div>
                      </td>
                    );
                  })}

                  {/* Empty 3rd column filler */}
                  {products.length === 2 && onAddProduct && (
                    <td className="p-3 sm:p-3.5 bg-slate-50/30 text-center text-slate-300">
                      —
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
