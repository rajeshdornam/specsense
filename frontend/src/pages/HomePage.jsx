import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Zap,
  Cpu,
  BarChart3,
  Bell
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
    subtitle: 'Snapdragon 8 Gen 3 vs. Tensor G3 — Hackathon Demo',
    category: 'Smartphones',
    ids: [4, 3],
    imageA: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80',
    tag: '🔥 Live Demo',
    isDemo: true,
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'iPhone 15 vs. Samsung Galaxy S23',
    subtitle: 'Compact Premium Flagship Showdown',
    category: 'Smartphones',
    ids: [1, 2],
    imageA: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80',
    tag: '⚡ Flagship Battle',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    title: 'MacBook Air M2 vs. ThinkPad E14',
    subtitle: 'macOS Portability vs. Windows Workhorse',
    category: 'Laptops',
    ids: [5, 6],
    imageA: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=300&q=80',
    imageB: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80',
    tag: '💼 Productivity',
    gradient: 'from-emerald-500 to-teal-600'
  }
];

const STEPS = [
  {
    num: '01',
    icon: Cpu,
    title: 'Normalized Hardware Benchmarking',
    desc: 'Compare 2–3 gadgets across displays, chipsets, battery, and cameras with difference highlighting.',
    color: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  {
    num: '02',
    icon: BarChart3,
    title: '90-Day Moving Average Tracking',
    desc: 'Daily price tracking across Amazon, Flipkart & Brand Stores with 30 & 90-day averages.',
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200'
  },
  {
    num: '03',
    icon: Bell,
    title: 'Buy Now vs. Wait Decision Engine',
    desc: 'Rule-based algorithm classifies prices as Great Deal, Fair Price, or Wait. Set target alerts.',
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  }
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [comparedIds, setComparedIds] = useState([4, 3]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGadgets() {
      try {
        setLoading(true);
        const res = await productApi.getAll({
          category: category !== 'All' ? category : undefined
        });
        if (res.success) setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGadgets();
  }, [category]);

  // Scroll reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
      );
      els.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);
    return () => clearTimeout(timer);
  }, [products]);

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
    <div className="pb-16">

      {/* ══════════════════════════════════════
          ANIMATED GRADIENT HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative hero-gradient-bg overflow-hidden pt-14 pb-16 px-4 sm:px-6 lg:px-8">

        {/* Floating Orbs */}
        <div className="hero-bg-mesh">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="orb orb-4" />
        </div>

        {/* Subtle dot-grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold anim-bounce-in">
            <TrendingUp className="w-3.5 h-3.5 anim-float" />
            <span>SpecSense – BestBuy Timing Hack</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-[10px] font-bold">LIVE</span>
          </div>

          {/* Animated Gradient Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight anim-fade-up anim-delay-100">
            <span className="gradient-text block">Electronics Price Intelligence</span>
            <span className="text-white/95 block mt-1">
              &amp; <span className="gradient-text">Spec Benchmarking</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed anim-fade-up anim-delay-200">
            90-day cross-store price tracking · 14-parameter spec comparison · Rule-based buy/wait guidance
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto anim-fade-up anim-delay-300">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm bg-white/10">
              <SearchBar />
            </div>
          </div>

          {/* Live Demo Banner */}
          <div className="max-w-2xl mx-auto anim-fade-up anim-delay-400">
            <div className="rounded-xl bg-white/15 backdrop-blur-md border border-white/25 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-white text-[#1D4ED8] text-[10px] font-bold uppercase tracking-wider">
                    🎯 Live Hackathon Demo
                  </span>
                  <span className="text-white text-xs font-bold">OnePlus 12 vs Pixel 8</span>
                </div>
                <p className="text-white/75 text-[11px]">
                  OnePlus 12 → <span className="text-emerald-300 font-bold">BUY NOW (84 VFM)</span> &nbsp;·&nbsp; Pixel 8 → <span className="text-sky-300 font-bold">FAIR PRICE (66 VFM)</span>
                </p>
              </div>
              <Link
                to="/compare?ids=4,3"
                className="btn-press flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#1D4ED8] hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Launch Live Demo
              </Link>
            </div>
          </div>

          {/* Trust Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 anim-fade-up anim-delay-500">
            {[
              '✓ 90-Day Moving Averages',
              '✓ Multi-Factor VFM Scoring',
              '✓ SQLite · 16 Products'
            ].map((seal, i) => (
              <span key={i} className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/85 text-xs font-medium">
                {seal}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STAT STRIP
      ══════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Products Tracked', value: '16', color: 'text-indigo-600' },
            { label: 'Price Records', value: '4,320', color: 'text-blue-600' },
            { label: 'Retailers', value: '3', color: 'text-violet-600' },
            { label: 'Spec Parameters', value: '14', color: 'text-emerald-600' }
          ].map((stat, i) => (
            <div key={i} className={`text-center anim-flip-in anim-delay-${i * 100 + 100}`}>
              <div className={`text-2xl font-extrabold tabular-nums ${stat.color} num-reveal`}>{stat.value}</div>
              <div className="text-[11px] text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mt-10">

        {/* ══════════════════════════════════════
            POPULAR COMPARISONS — Gradient Cards
        ══════════════════════════════════════ */}
        <section className="space-y-4 reveal">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Popular Comparisons</h2>
              <p className="text-xs text-slate-500">Launch direct 14-point spec difference tables</p>
            </div>
            <Link to="/compare?ids=4,3" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              Custom Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {POPULAR_COMPARISONS.map((comp, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/compare?ids=${comp.ids.join(',')}`)}
                className={`group relative bg-white border-2 rounded-xl p-0 cursor-pointer card-hover overflow-hidden reveal anim-delay-${(idx + 1) * 100} ${
                  comp.isDemo ? 'border-indigo-400' : 'border-slate-200'
                }`}
              >
                {/* Gradient top bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${comp.gradient}`} />

                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold mb-2">
                    <span className="text-slate-600 font-bold">{comp.tag}</span>
                    <span className="text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full text-[10px]">{comp.category}</span>
                  </div>

                  <h3 className={`font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors`}>
                    {comp.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{comp.subtitle}</p>

                  {/* Device image pair */}
                  <div className={`flex items-center justify-center gap-4 py-4 my-3 rounded-lg bg-gradient-to-br ${comp.gradient} bg-opacity-5`}
                       style={{ background: `linear-gradient(135deg, #f8fafc, #f1f5f9)` }}>
                    <img src={comp.imageA} alt="A" className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110" />
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${comp.gradient} flex items-center justify-center`}>
                      <span className="text-[9px] font-black text-white">VS</span>
                    </div>
                    <img src={comp.imageB} alt="B" className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>{comp.isDemo ? 'Launch Official Demo' : 'View Full Comparison'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            3-STEP METHODOLOGY — Gradient Steps
        ══════════════════════════════════════ */}
        <section className="reveal">
          <div className="border-b border-slate-200 pb-3 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">How the Timing Hack Works</h2>
              <p className="text-xs text-slate-500 mt-0.5">Three algorithmic layers defending your budget.</p>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 border border-slate-200 px-2 py-1 rounded-full">Rule-Based AI</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className={`relative p-5 rounded-xl border-2 ${step.border} ${step.bg} space-y-3 group hover:shadow-lg transition-shadow duration-300 reveal anim-delay-${(i + 1) * 100}`}>
                  {/* Step number badge */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      STEP {step.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>

                  {/* Bottom gradient line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════
            PRODUCT CATALOG GRID
        ══════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 reveal">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Electronics Catalog</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Sample · SQLite
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">16 products · 90-day price history · VFM scores</p>
            </div>
            <CategoryFilter
              activeCategory={category}
              onSelectCategory={setCategory}
              categoryCounts={categoryCounts}
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="skeleton-shimmer h-3 w-16 rounded-full" />
                  <div className="skeleton-shimmer h-40 w-full rounded-lg" />
                  <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
                  <div className="skeleton-shimmer h-3 w-1/2 rounded-full" />
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <div className="skeleton-shimmer h-8 flex-1 rounded-lg" />
                    <div className="skeleton-shimmer h-8 flex-1 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-slate-500">No gadgets found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((prod, i) => (
                <div key={prod.id} className="reveal" style={{ transitionDelay: `${i * 40}ms` }}>
                  <ProductCard
                    product={prod}
                    isCompared={comparedIds.includes(prod.id)}
                    onQuickCompare={handleQuickCompare}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════
            ANIMATED GRADIENT CTA BANNER
        ══════════════════════════════════════ */}
        <section className="reveal">
          <div className="relative cta-gradient rounded-2xl p-8 sm:p-10 overflow-hidden">
            {/* Orb decorations inside CTA */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-white" /> Interactive Decision Engine
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Evaluate specs head-to-head.
                  <br />
                  <span className="text-yellow-300">Know the perfect time to buy.</span>
                </h2>
                <p className="text-sm text-white/75 leading-relaxed">
                  Compare processors, displays, battery, cameras & 90-day retailer price history. Export a clean PDF report.
                </p>
              </div>

              <div className="flex-shrink-0 flex flex-col gap-3">
                <Link
                  to="/compare?ids=4,3"
                  className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-indigo-700 hover:bg-yellow-50 transition-colors shadow-xl"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Launch Comparison
                </Link>
                <Link
                  to="/timing-hack?productId=4"
                  className="btn-press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/30 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  Timing Hack Tool
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            SALES CALENDAR + REFURBISHED
        ══════════════════════════════════════ */}
        <section className="reveal">
          <SalesCalendar />
        </section>

        <section className="reveal">
          <RefurbishedSection />
        </section>

      </div>
    </div>
  );
}
