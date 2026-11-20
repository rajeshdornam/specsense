import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] mt-16 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-2.5 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-xs">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-sm">SpecSense</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Cross-retailer price intelligence and technical specification benchmarking platform designed to help consumers make smarter electronics purchasing decisions.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 pt-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Amazon • Flipkart • Direct Brand Stores</span>
            </div>
          </div>

          {/* Decision Engines */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-2.5">Decision Engines</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/compare" className="hover:text-[#1D4ED8] transition-colors">Specification Comparison</Link>
              </li>
              <li>
                <Link to="/tracker" className="hover:text-[#1D4ED8] transition-colors">90-Day Price Tracker</Link>
              </li>
              <li>
                <Link to="/timing-hack" className="hover:text-[#1D4ED8] transition-colors">Buy / Wait Recommendation</Link>
              </li>
              <li>
                <Link to="/value-score" className="hover:text-[#1D4ED8] transition-colors">Value-for-Money Index (VFM)</Link>
              </li>
              <li>
                <Link to="/alerts" className="hover:text-[#1D4ED8] transition-colors">Target Price Drop Alerts</Link>
              </li>
            </ul>
          </div>

          {/* Smart Shopping Tools */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-2.5">Shopping Tools</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/sales" className="hover:text-[#1D4ED8] transition-colors">Sales Calendar</Link>
              </li>
              <li>
                <Link to="/refurbished" className="hover:text-[#1D4ED8] transition-colors">Refurbished vs Brand New</Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#1D4ED8] transition-colors">PDF Export Reports</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#1D4ED8] transition-colors">Pricing Methodology</Link>
              </li>
            </ul>
          </div>

          {/* Data Integrity & Architecture */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-900 mb-2.5">Data Integrity</h4>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Price trends and recommendations reflect 90 days of empirical cross-retailer observations. SpecSense operates without affiliate bias.
            </p>
            <div className="pt-1.5">
              <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium border border-slate-200">
                Persistent SQLite Engine
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} SpecSense – BestBuy Timing Hack. Production-style e-commerce intelligence.</p>
          <div className="flex items-center gap-3">
            <span>Inter Typography</span>
            <span>•</span>
            <span>Clean Commerce</span>
            <span>•</span>
            <span>Zero Affiliate Bias</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
