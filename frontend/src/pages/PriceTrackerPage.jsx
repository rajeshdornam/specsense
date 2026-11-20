import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Bell, 
  ChevronDown, 
  Loader2,
  Database
} from 'lucide-react';
import PriceChart from '../components/PriceChart';
import PriceSummary from '../components/PriceSummary';
import RecommendationBadge from '../components/RecommendationBadge';
import { priceApi, productApi, recommendationApi } from '../services/api';

export default function PriceTrackerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(() => {
    return parseInt(searchParams.get('productId'), 10) || 4; // Default to OnePlus 12 for demo
  });

  const [historyData, setHistoryData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [recData, setRecData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load products list:', err);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductId) {
      setSearchParams({ productId: selectedProductId }, { replace: true });
    }
  }, [selectedProductId, setSearchParams]);

  useEffect(() => {
    async function loadPriceDetails() {
      try {
        setLoading(true);
        const [historyRes, summaryRes, recRes] = await Promise.all([
          priceApi.getHistory(selectedProductId, 90),
          priceApi.getSummary(selectedProductId),
          recommendationApi.getRecommendation(selectedProductId)
        ]);

        if (historyRes.success) setHistoryData(historyRes.data);
        if (summaryRes.success) setSummaryData(summaryRes.data);
        if (recRes.success) setRecData(recRes.data);
      } catch (err) {
        console.error('Failed to load price details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedProductId) {
      loadPriceDetails();
    }
  }, [selectedProductId]);

  const currentProduct = summaryData?.product || products.find(p => p.id === selectedProductId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header with Product Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Market Intelligence
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Sample 90-Day Records</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            90-Day Historical Price Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-retailer price movements across Amazon, Flipkart, and Direct Brand Stores.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="w-full md:w-80">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Select Tracked Gadget:
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
          <span>Compiling 90-day multi-store price timeline...</span>
        </div>
      ) : (
        <>
          {/* Overview Strip */}
          {currentProduct && (
            <div className="bg-white border border-[#E2E8F0] rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <img
                    src={currentProduct.image_url}
                    alt={currentProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{currentProduct.brand}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-500">{currentProduct.category}</span>
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">{currentProduct.name}</h2>
                  <div className="flex items-center gap-2.5 mt-1">
                    {recData && (
                      <RecommendationBadge
                        recommendation={recData.recommendation}
                        badgeType={recData.badgeType}
                        size="sm"
                      />
                    )}
                    <span className="text-xs text-slate-500">
                      Best verified price: <strong className="text-slate-900 tabular-nums">₹{currentProduct.current_price?.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/alerts?productId=${currentProduct.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors shadow-2xs"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Set Price Alert</span>
                </Link>

                <Link
                  to={`/timing-hack?productId=${currentProduct.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-800 bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Timing Hack</span>
                </Link>
              </div>
            </div>
          )}

          {/* Statistical Price Metrics */}
          {summaryData && (
            <PriceSummary
              metrics={summaryData.metrics}
              retailers={summaryData.retailers}
            />
          )}

          {/* Interactive 90-Day Chart */}
          {historyData && (
            <PriceChart
              timeline={historyData.timeline}
              currentPrice={summaryData?.metrics?.currentPrice}
              historicalLow={summaryData?.metrics?.lowestPrice}
              averagePrice={summaryData?.metrics?.ma90}
            />
          )}
        </>
      )}
    </div>
  );
}
