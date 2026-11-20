import React from 'react';
import { 
  TrendingUp, 
  Database, 
  ShieldCheck, 
  Code2, 
  FileCheck, 
  Layers, 
  CheckCircle2
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Architecture & Methodology
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          SpecSense Methodology & Engineering Reference
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Production-style full-stack price intelligence and specification benchmarking system.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 space-y-2.5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">The Problem We Solve</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Modern electronics retailers use automated repricing algorithms, pre-sale markups, and promotional jargon to maximize margins. Most consumers do not know whether a current price is a genuine deal or a temporary peak.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>SpecSense</strong> combines 90 days of daily cross-retailer empirical data (Amazon, Flipkart, Brand Stores) with normalized hardware specification scoring and rule-based purchase timing algorithms.
        </p>
      </div>

      {/* Mathematical Models */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mathematical Models & Algorithms</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">1. Moving Average (MA)</h3>
            <p className="text-xs text-slate-500">
              Calculates 30-day and 90-day moving averages across daily retailer observations:
            </p>
            <div className="bg-slate-50 p-2.5 rounded font-mono text-xs text-slate-800 border border-slate-200">
              MA(n) = &Sigma;(Price<sub>i</sub>) / n
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">2. Price Deviation Percentage</h3>
            <p className="text-xs text-slate-500">
              Measures how far current pricing has drifted from the 90-day baseline:
            </p>
            <div className="bg-slate-50 p-2.5 rounded font-mono text-xs text-slate-800 border border-slate-200">
              Deviation (%) = ((Current - MA<sub>90</sub>) / MA<sub>90</sub>) &times; 100
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">3. Best-Time-To-Buy Logic</h3>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• <strong>Great Deal:</strong> Deviation &le; -5.0% AND within 10% of 90d low.</li>
              <li>• <strong>Wait:</strong> Deviation &gt; +5.0% above 90d average.</li>
              <li>• <strong>Fair:</strong> Fluctuating within &plusmn;5.0% corridor.</li>
            </ul>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-900">4. Value-For-Money (VFM) Score</h3>
            <p className="text-xs text-slate-500">
              Normalizes hardware parameters (CPU benchmarks, display, battery, sensors) scaled against price-to-spec efficiency between 0 and 100 with category-specific weights.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded p-5 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technology Stack</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-0.5">Frontend</span>
            <p className="text-slate-500">React 18, Vite, Tailwind CSS, Lucide React, Recharts</p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-0.5">Backend</span>
            <p className="text-slate-500">Node.js, Express.js REST APIs, Zod, date-fns</p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-0.5">Database</span>
            <p className="text-slate-500">SQLite with sql.js persistent storage, multi-index tables</p>
          </div>

          <div className="p-3 rounded bg-slate-50 border border-slate-100">
            <span className="font-bold text-slate-900 block mb-0.5">Reporting</span>
            <p className="text-slate-500">html2canvas & jsPDF for downloadable comparison sheets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
