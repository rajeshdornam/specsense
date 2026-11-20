import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Clock, 
  TrendingUp, 
  Bell, 
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  Database
} from 'lucide-react';
import RecommendationCard from '../components/RecommendationCard';
import { recommendationApi, productApi } from '../services/api';

export default function TimingHackPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(() => {
    return parseInt(searchParams.get('productId'), 10) || 4; // Default to OnePlus 12 for live BUY NOW demo
  });

  const [recData, setRecData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success) setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      setSearchParams({ productId: selectedProductId }, { replace: true });
    }
  }, [selectedProductId, setSearchParams]);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        setLoading(true);
        const res = await recommendationApi.getRecommendation(selectedProductId);
        if (res.success) {
          setRecData(res.data);
        }
      } catch (err) {
        console.error('Failed to load recommendation:', err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedProductId) {
      fetchRecommendation();
    }
  }, [selectedProductId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Timing Algorithm
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Sample Historical Models</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Best Time to Buy Purchase Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based algorithmic decision engine evaluating 90-day moving averages and historical bottoms.
          </p>
        </div>

        {/* Product Switcher */}
        <div className="w-full md:w-80">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Analyze Electronics Model:
          </label>
          <div className="relative">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full appearance-none px-3 py-2 text-xs font-semibold bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8] shadow-2xs pr-8"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.current_price?.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-[#E2E8F0] rounded p-16 text-center text-xs text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-[#1D4ED8] mx-auto mb-2" />
          <span>Evaluating moving averages and cross-retailer deviation thresholds...</span>
        </div>
      ) : (
        recData && (
          <div className="space-y-5">
            {/* Recommendation Component */}
            <RecommendationCard recommendationData={recData} />

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                to={`/tracker?productId=${selectedProductId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors shadow-2xs"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>View Full 90-Day Chart</span>
              </Link>

              <Link
                to={`/alerts?productId=${selectedProductId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-800 bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <Bell className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Set Target Price Alert</span>
              </Link>

              <Link
                to={`/compare?ids=${selectedProductId},${selectedProductId === 4 ? 3 : 4}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-800 bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Compare Specs</span>
              </Link>
            </div>

            {/* Decision Logic Box */}
            <div className="bg-white border border-[#E2E8F0] rounded p-4 space-y-2.5">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Decision Logic & Priority Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-emerald-50/50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-0.5">1. GREAT DEAL – BUY NOW</span>
                  <p className="text-[11px] text-slate-600">
                    Current price is &le; -5.0% below the 90-day average AND within 10% of the recorded 90-day low.
                  </p>
                </div>

                <div className="p-3 rounded bg-blue-50/50 border border-blue-200">
                  <span className="font-bold text-[#1D4ED8] block mb-0.5">2. FAIR PRICE</span>
                  <p className="text-[11px] text-slate-600">
                    Current price is fluctuating within the historical standard corridor between 5% below and 5% above the 90-day average.
                  </p>
                </div>

                <div className="p-3 rounded bg-amber-50/50 border border-amber-200">
                  <span className="font-bold text-amber-800 block mb-0.5">3. WAIT – LIKELY TO DROP</span>
                  <p className="text-[11px] text-slate-600">
                    Current price is &gt; 5% above the 90-day average, signaling temporary markup or upcoming promotional correction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
