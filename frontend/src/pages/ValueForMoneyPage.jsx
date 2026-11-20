import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Info } from 'lucide-react';
import ValueScoreCard from '../components/ValueScoreCard';
import { productApi, recommendationApi } from '../services/api';

export default function ValueForMoneyPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [primaryId, setPrimaryId] = useState(1);
  const [secondaryId, setSecondaryId] = useState(2);
  const [vfmA, setVfmA] = useState(null);
  const [vfmB, setVfmB] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success) {
          setProducts(res.data);
          const paramId = parseInt(searchParams.get('productId'), 10);
          if (paramId) {
            setPrimaryId(paramId);
            setSecondaryId(paramId === 1 ? 2 : 1);
          }
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, [searchParams]);

  useEffect(() => {
    async function fetchScores() {
      if (!primaryId || !secondaryId) return;
      try {
        setLoading(true);
        const [resA, resB] = await Promise.all([
          recommendationApi.getValueScore(primaryId),
          recommendationApi.getValueScore(secondaryId)
        ]);
        if (resA.success) setVfmA(resA.data);
        if (resB.success) setVfmB(resB.data);
      } catch (err) {
        console.error('Failed to load VFM scores:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScores();
  }, [primaryId, secondaryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Normalized Index
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Value-for-Money (VFM) Scoring Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Multi-factor normalized model (0–100) weighing processor benchmarks, displays, optics, and battery against market price points.
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-white border border-[#E2E8F0] rounded p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          Select Two Gadgets to Compare Value Index
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Device A:</label>
            <select
              value={primaryId}
              onChange={(e) => setPrimaryId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === secondaryId}>
                  {p.name} (₹{p.current_price?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Device B:</label>
            <select
              value={secondaryId}
              onChange={(e) => setSecondaryId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} disabled={p.id === primaryId}>
                  {p.name} (₹{p.current_price?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Score Cards Side by Side */}
      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded p-16 text-center text-xs text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#1D4ED8] mx-auto mb-2" />
          <span>Normalizing hardware metrics and calculating category weight distributions...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vfmA && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-0.5">
                <span>{vfmA.productName}</span>
                <span className="text-[#1D4ED8] tabular-nums">₹{vfmA.currentPrice?.toLocaleString('en-IN')}</span>
              </div>
              <ValueScoreCard vfmData={vfmA} />
            </div>
          )}

          {vfmB && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-0.5">
                <span>{vfmB.productName}</span>
                <span className="text-[#1D4ED8] tabular-nums">₹{vfmB.currentPrice?.toLocaleString('en-IN')}</span>
              </div>
              <ValueScoreCard vfmData={vfmB} />
            </div>
          )}
        </div>
      )}

      {/* Methodology documentation */}
      <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#1D4ED8]" />
          <span>Scoring Rules & Categorical Weighting</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The Value-for-Money metric balances raw technical prowess with price efficiency. Each category uses custom weights:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <li className="p-2 rounded bg-slate-50 border border-slate-100">
            <strong>Smartphones:</strong> Performance (25%), Display (20%), Camera (20%), Battery (15%), Price Efficiency (20%)
          </li>
          <li className="p-2 rounded bg-slate-50 border border-slate-100">
            <strong>Laptops:</strong> Performance (35%), Display (20%), Price Efficiency (25%), Battery (15%), Webcam (5%)
          </li>
          <li className="p-2 rounded bg-slate-50 border border-slate-100">
            <strong>Headphones:</strong> ANC & Microphones (20%), Playtime Battery (25%), Chip Processor (20%), Price Efficiency (30%)
          </li>
          <li className="p-2 rounded bg-slate-50 border border-slate-100">
            <strong>Smartwatches:</strong> Display (25%), Biometric Sensors (15%), Battery (20%), Chip (20%), Price Efficiency (20%)
          </li>
        </ul>
      </div>
    </div>
  );
}
