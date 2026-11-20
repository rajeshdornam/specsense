import React from 'react';
import RefurbishedSection from '../components/RefurbishedSection';

export default function RefurbishedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Sustainable Value Shopping
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Certified Refurbished vs. Brand New
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Save 20% to 35% on open-box and manufacturer-certified gadgets with warranty protection.
        </p>
      </div>

      {/* Main Refurbished Component */}
      <RefurbishedSection />

      {/* Trust & Diagnostic Criteria Checklist */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          What Does "Certified Refurbished" Mean in SpecSense?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-600">
          <div className="p-3 rounded bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">1. 40-Point Diagnostic Check</span>
            <p>Devices are tested for display responsiveness, battery health (minimum 85%+ capacity), camera autofocus, and motherboard integrity.</p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">2. Seller Warranty Included</span>
            <p>Eligible for 6-month to 1-year direct replacement or repair guarantees from authorized sellers like Amazon Renewed and Flipkart Refurbished.</p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-900 block">3. Sanitized & Repackaged</span>
            <p>Deep cleaned and repackaged with tested charging cables, adapters, and accessories.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
