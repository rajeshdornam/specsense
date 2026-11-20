import React from 'react';
import { Clock, Tag, Lightbulb } from 'lucide-react';
import SalesCalendar from '../components/SalesCalendar';

export default function SalesCalendarPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Seasonal Shopping Cycles
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Electronics Sale Calendar & Historical Schedule
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track verified sales cycles across Amazon, Flipkart, and brand stores to maximize your savings.
        </p>
      </div>

      {/* Main Calendar Component */}
      <SalesCalendar />

      {/* Timing Hack Advice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-1.5">
          <div className="w-7 h-7 rounded bg-blue-50 text-[#1D4ED8] flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Flagship Release Cycles</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Apple releases new iPhones in September, triggering immediate 12–18% price drops on previous generations. Samsung launches the Galaxy S series annually in January/February.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-1.5">
          <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Bank Instant Discounts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            During major festivals (Diwali, Republic Day), instant bank cards (HDFC, ICICI, SBI) reduce prices by an extra ₹1,500 to ₹7,500 on top of the list price.
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-1.5">
          <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Pre-Sale Price Creep</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Retailers frequently raise prices 14 days before promotional events, creating the illusion of deep discounts. SpecSense 90-day tracking identifies this behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
