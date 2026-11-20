import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Download, 
  Plus, 
  Loader2,
  AlertCircle,
  Database,
  Zap,
  CheckCircle2
} from 'lucide-react';
import CompareTable from '../components/CompareTable';
import DifferenceToggle from '../components/DifferenceToggle';
import ProductSelectorModal from '../components/ProductSelectorModal';
import ValueScoreCard from '../components/ValueScoreCard';
import RecommendationBadge from '../components/RecommendationBadge';
import { compareApi } from '../services/api';
import { exportComparisonPdf } from '../utils/pdfExport';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productIds, setProductIds] = useState(() => {
    const idsFromUrl = searchParams.get('ids');
    if (idsFromUrl) {
      return idsFromUrl.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
    }
    return [4, 3]; // Default to Official Hackathon Demo Scenario: OnePlus 12 & Google Pixel 8
  });

  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replaceTargetId, setReplaceTargetId] = useState(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    if (productIds.length >= 2) {
      setSearchParams({ ids: productIds.join(',') }, { replace: true });
    }
  }, [productIds, setSearchParams]);

  useEffect(() => {
    async function fetchComparison() {
      if (productIds.length < 2) {
        setCompareData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await compareApi.compare(productIds);
        if (res.success) {
          setCompareData(res.data);
        }
      } catch (err) {
        console.error('Failed to load comparison:', err);
        setError(err.response?.data?.error || 'Unable to load comparison matrix for the selected devices.');
      } finally {
        setLoading(false);
      }
    }

    fetchComparison();
  }, [productIds]);

  const handleRemoveProduct = (idToRemove) => {
    if (productIds.length <= 2) {
      alert('Comparison requires at least 2 gadgets.');
      return;
    }
    setProductIds(prev => prev.filter(id => id !== idToRemove));
  };

  const handleStartReplace = (idToReplace) => {
    setReplaceTargetId(idToReplace);
    setIsModalOpen(true);
  };

  const handleStartAdd = () => {
    if (productIds.length >= 3) {
      alert('You can compare a maximum of 3 gadgets at once.');
      return;
    }
    setReplaceTargetId(null);
    setIsModalOpen(true);
  };

  const handleSelectModalProduct = (selectedProduct) => {
    if (replaceTargetId) {
      setProductIds(prev => prev.map(id => (id === replaceTargetId ? selectedProduct.id : id)));
    } else {
      if (!productIds.includes(selectedProduct.id) && productIds.length < 3) {
        setProductIds(prev => [...prev, selectedProduct.id]);
      }
    }
    setIsModalOpen(false);
    setReplaceTargetId(null);
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      await exportComparisonPdf('printable-comparison-section', `SpecSense-Compare-${productIds.join('-')}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExportingPdf(false);
    }
  };

  const isDemoPair = productIds.includes(4) && productIds.includes(3) && productIds.length === 2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Deep Specification Analysis
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Sample & Simulated Dataset</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Product Specification & Pricing Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare 2–3 gadgets across 14 technical parameters with difference highlighting.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <DifferenceToggle
            enabled={showDifferencesOnly}
            onToggle={setShowDifferencesOnly}
          />

          {productIds.length < 3 && (
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-slate-800 bg-white border border-[#CBD5E1] hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#1D4ED8]" />
              <span>Add 3rd Device</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exportingPdf || loading || !compareData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors shadow-2xs disabled:opacity-50"
          >
            {exportingPdf ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{exportingPdf ? 'Generating PDF...' : 'Export PDF Report'}</span>
          </button>
        </div>
      </div>

      {/* Live Demo Scenario Alert Banner */}
      {isDemoPair && (
        <div className="p-3.5 rounded border border-blue-200 bg-blue-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#1D4ED8] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-950 block">
                Hackathon Live Demo Scenario: OnePlus 12 vs. Google Pixel 8
              </span>
              <p className="text-slate-700 text-[11px] mt-0.5">
                Notice the contrast: <strong>OnePlus 12</strong> triggers <span className="font-bold text-emerald-800 bg-emerald-100 px-1 rounded">GREAT DEAL – BUY NOW</span> (price ₹64,999 is 6.3% below its 90d average of ₹69,349 and within 2.4% of its 90d low) with an 84 VFM score. Meanwhile, <strong>Google Pixel 8</strong> is classified as <span className="font-bold text-blue-800 bg-blue-100 px-1 rounded">FAIR PRICE</span> (-0.9% deviation) with a 66 VFM score.
              </p>
            </div>
          </div>
          <span className="flex-shrink-0 text-[10px] font-semibold text-blue-800 bg-white border border-blue-200 px-2 py-1 rounded">
            Verified Scenario
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Printable Section for PDF export */}
      <div id="printable-comparison-section" className="space-y-6 bg-white p-2 sm:p-4 rounded border border-slate-200">
        {loading ? (
          <div className="bg-white border border-[#E2E8F0] rounded p-16 text-center text-xs text-slate-500">
            <Loader2 className="w-6 h-6 animate-spin text-[#1D4ED8] mx-auto mb-2" />
            <span>Calculating hardware differences and multi-store metrics...</span>
          </div>
        ) : (
          compareData && (
            <CompareTable
              products={compareData.products}
              specMatrix={compareData.specMatrix}
              highlights={compareData.highlights}
              showDifferencesOnly={showDifferencesOnly}
              onRemoveProduct={handleRemoveProduct}
              onReplaceProduct={handleStartReplace}
              onAddProduct={productIds.length < 3 ? handleStartAdd : undefined}
            />
          )
        )}

        {/* Side-by-Side Value-for-Money and Price Comparisons */}
        {compareData && (
          <section className="space-y-4 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Value-For-Money & Timing Analysis</h2>
                <p className="text-xs text-slate-500">
                  Category-weighted benchmark indices and 90-day purchase recommendations
                </p>
              </div>
              <span className="text-[10px] text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
                Simulated 90-Day Trends
              </span>
            </div>

            <div className={`grid grid-cols-1 ${compareData.products.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3.5`}>
              {compareData.products.map((prod) => (
                <div key={prod.id} className="space-y-3">
                  <div className="bg-white border border-[#E2E8F0] rounded p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{prod.brand}</span>
                      <RecommendationBadge
                        recommendation={prod.recommendation?.recommendation}
                        badgeType={prod.recommendation?.badgeType}
                        size="sm"
                      />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 line-clamp-1">{prod.name}</h3>
                    <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-500">Best Price:</span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">₹{prod.current_price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <ValueScoreCard vfmData={prod.valueForMoney} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Product Selector Modal */}
      <ProductSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectProduct={handleSelectModalProduct}
        currentProductIds={productIds}
        title={replaceTargetId ? "Replace Comparison Gadget" : "Add Gadget to Compare"}
      />
    </div>
  );
}
