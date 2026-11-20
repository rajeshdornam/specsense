import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  SlidersHorizontal, 
  Clock, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Award,
  Zap,
  Database
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import SalesCalendar from '../components/SalesCalendar';
import RefurbishedSection from '../components/RefurbishedSection';
import { productApi } from '../services/api';

const POPULAR_COMPARISONS = [
  {
    title: 'OnePlus 12 vs. Google Pixel 8',
    subtitle: 'Official Hackathon Live Demo Scenario: Snapdragon 8 Gen 3 vs. Tensor G3',
    category: 'Smartphones',
    ids: [4, 3],
    imageA: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80',
    tag: 'Live Demo Showcase',
    isDemo: true
  },
  {
    title: 'Apple iPhone 15 vs. Samsung Galaxy S23',
    subtitle: 'Compact Premium Showdown',
    category: 'Smartphones',
    ids: [1, 2],
    imageA: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
    tag: 'Flagship Battle'
  },
  {
    title: 'MacBook Air M2 vs. ThinkPad E14',
    subtitle: 'macOS Portability vs. Windows Enterprise Workhorse',
    category: 'Laptops',
    ids: [5, 6],
    imageA: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80',
    tag: 'Productivity'
  }
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [comparedIds, setComparedIds] = useState([4, 3]); // Default to demo pair: OnePlus 12 & Pixel 8
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGadgets() {
      try {
        setLoading(true);
        const res = await productApi.getAll({
          category: category !== 'All' ? category : undefined
        });
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGadgets();
  }, [category]);

  const handleQuickCompare = (prod) => {
    if (comparedIds.includes(prod.id)) {
      navigate(`/compare?ids=${comparedIds.join(',')}`);
    } else {
      const next = [...comparedIds.slice(-2), prod.id];
      navigate(`/compare?ids=${next.join(',')}`);
    }
  };

  const categoryCounts = {
    All: products.length,
    Smartphones: products.filter(p => p.category === 'Smartphones').length,
    Laptops: products.filter(p => p.category === 'Laptops').length,
    Headphones: products.filter(p => p.category === 'Headphones').length,
    Smartwatches: products.filter(p => p.category === 'Smartwatches').length
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Clean Commerce Hero Header */}
      <section className="bg-white border-b border-[#E2E8F0] pt-9 pb-11 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>SpecSense – BestBuy Timing Hack</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
            Electronics Price Intelligence & <br className="hidden sm:inline" />
            <span className="text-[#1D4ED8]">Specification Benchmarking</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            Side-by-side technical specification benchmarking across 14 hardware parameters, 90-day cross-store price tracking (Amazon, Flipkart, Brand Stores), and rule-based purchase timing guidance.
          </p>

          {/* Autocomplete Search Bar */}
          <div className="max-w-2xl mx-auto pt-2">
            <SearchBar />
          </div>

          {/* Dedicated Live Hackathon Demo Banner */}
          <div className="max-w-2xl mx-auto mt-4 p-3 rounded border border-blue-200 bg-blue-50/70 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.2 rounded bg-[#1D4ED8] text-white text-[9px] font-bold uppercase tracking-wider">
                  Live Demonstration Scenario
                </span>
                <span className="text-[11px] font-bold text-slate-900">OnePlus 12 vs. Google Pixel 8</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Witness OnePlus 12 (<span className="text-emerald-700 font-bold">BUY NOW</span>, 84 VFM) vs Pixel 8 (<span className="text-blue-700 font-bold">FAIR PRICE</span>, 66 VFM) with live simulated price alert trigger.
              </p>
            </div>

            <Link
              to="/compare?ids=4,3"
              className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Launch Live Demo</span>
            </Link>
          </div>

          {/* Transparency Seals */}
          <div className="flex flex-wrap items-center justify-center gap-5 pt-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified 90-Day Moving Averages</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Multi-Factor Value-For-Money Scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Persistent SQLite Engine (16 Products)</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Popular Comparisons Section */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Popular Product Comparisons</h2>
              <p className="text-xs text-slate-500">Launch direct 14-point specification difference tables</p>
            </div>
            <Link
              to="/compare?ids=4,3"
              className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1"
            >
              <span>Custom Compare Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {POPULAR_COMPARISONS.map((comp, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/compare?ids=${comp.ids.join(',')}`)}
                className={`group bg-white border rounded p-4 hover:border-slate-400 hover:shadow-card cursor-pointer transition-all flex flex-col justify-between ${
                  comp.isDemo ? 'border-[#1D4ED8] bg-blue-50/20' : 'border-[#E2E8F0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-1.5">
                    <span className={`uppercase tracking-wider ${comp.isDemo ? 'text-[#1D4ED8] font-bold' : 'text-[#1D4ED8]'}`}>
                      {comp.tag}
                    </span>
                    <span className="text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">{comp.category}</span>
                  </div>

                  <h3 className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#1D4ED8] transition-colors">
                    {comp.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{comp.subtitle}</p>

                  {/* Thumbnail Pair */}
                  <div className="flex items-center justify-center gap-4 py-3 my-2.5 bg-slate-50 rounded border border-slate-100">
                    <img src={comp.imageA} alt="Device A" className="w-14 h-14 object-contain" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">VS</span>
                    <img src={comp.imageB} alt="Device B" className="w-14 h-14 object-contain" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1D4ED8]">
                  <span>{comp.isDemo ? 'Launch Official Demo' : 'View Full Comparison'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Step Methodology Section */}
        <section className="bg-white border border-[#E2E8F0] rounded p-5 sm:p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">How the Timing Hack Methodology Operates</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Three algorithmic layers defending your budget from retail repricing surges.
              </p>
            </div>
            <span className="text-[10px] font-medium text-slate-400 border border-slate-200 px-2 py-0.5 rounded">
              Rule-Based Algorithms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded bg-slate-50/50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider block">Step 01</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Normalized Hardware Benchmarking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Compare 2–3 gadgets across displays, chipsets, battery life, and cameras. Fades identical specs and highlights true differences.
              </p>
            </div>

            <div className="p-3.5 rounded bg-slate-50/50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider block">Step 02</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">90-Day Moving Average Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tracks daily price points across Amazon, Flipkart, and Direct Brand Stores. Calculates 30-day and 90-day moving averages and historical lows.
              </p>
            </div>

            <div className="p-3.5 rounded bg-slate-50/50 border border-slate-100 space-y-1.5">
              <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider block">Step 03</span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Buy Now vs. Wait Decision Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empirical rules classify current prices into Great Deal (Buy Now), Fair Price, or Wait. Set target alerts to catch flash discounts.
              </p>
            </div>
          </div>
        </section>

        {/* Electronics Catalog Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Electronics Product Catalog</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Sample Data persisting in SQLite
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                16 verified gadgets with 90-day price history and value-for-money scores
              </p>
            </div>

            <CategoryFilter
              activeCategory={category}
              onSelectCategory={setCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No gadgets found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {products.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isCompared={comparedIds.includes(prod.id)}
                  onQuickCompare={handleQuickCompare}
                />
              ))}
            </div>
          )}
        </section>

        {/* Clean Enterprise CTA Banner */}
        <section className="bg-[#0F172A] rounded p-6 sm:p-7 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Interactive Decision Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Evaluate hardware specifications head-to-head
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare processors, displays, battery life, cameras, and 90-day retailer price history side by side. Export a clean, printable PDF report.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/compare?ids=4,3"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Launch Compare (OnePlus 12 vs Pixel 8)</span>
            </Link>
          </div>
        </section>

        {/* Upcoming Sales Preview */}
        <section>
          <SalesCalendar />
        </section>

        {/* Refurbished Preview */}
        <section>
          <RefurbishedSection />
        </section>
      </div>
    </div>
  );
}
