import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  TrendingUp, 
  Bell, 
  Menu, 
  X,
  ShieldCheck,
  ChevronRight,
  Database
} from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

export default function Navbar() {
  const location = useLocation();
  const { triggeredCount, alerts } = useAlerts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Compare Specs', path: '/compare?ids=4,3' },
    { name: 'Price Tracker', path: '/tracker?productId=4' },
    { name: 'Best Time to Buy', path: '/timing-hack?productId=4' },
    { name: 'Value for Money', path: '/value-score?productId=4' },
    { name: 'Price Alerts', path: '/alerts' },
    { name: 'Sales Calendar', path: '/sales' },
    { name: 'Refurbished', path: '/refurbished' },
    { name: 'Methodology', path: '/about' },
  ];

  const isActive = (path) => {
    const basePath = path.split('?')[0];
    if (basePath === '/' && location.pathname !== '/') return false;
    return location.pathname === basePath || (basePath !== '/' && location.pathname.startsWith(basePath));
  };

  const triggeredAlerts = alerts.filter(a => a.status === 'TRIGGERED');

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-[#E2E8F0] transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}>
      {/* Top Utility Bar with Clear Sample-Data Label */}
      <div className="navbar-gradient text-slate-200 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Multi-Store Data (Amazon, Flipkart, Brand Stores)
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-400">90-Day Moving Average Intelligence</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            {/* Clear Sample Data Label */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px] font-semibold">
              <Database className="w-3 h-3 text-amber-400" />
              <span>Sample & Simulated Dataset (Hackathon Demo Mode)</span>
            </span>

            <Link to="/about" className="hover:text-white transition-colors underline decoration-slate-600 hidden sm:inline">
              Methodology
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded bg-[#1D4ED8] flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform duration-200">
              <TrendingUp className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#0F172A]">SpecSense</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  BestBuy Timing Hack
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-none mt-0.5">Electronics Benchmark & Price Trends</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 h-16">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`h-16 flex items-center px-3 text-xs font-medium transition-colors border-b-2 ${
                    active
                      ? 'border-[#1D4ED8] text-[#1D4ED8] font-semibold bg-slate-50/50'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                aria-label="View Price Drop Alerts"
              >
                <Bell className="w-4 h-4" />
                {triggeredCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[14px] h-[14px] px-1 text-[9px] font-bold text-white bg-red-600 rounded-full animate-pulse">
                    {triggeredCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-md shadow-dropdown py-2 z-50 anim-scale-in">
                  <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Price Drop Alerts ({triggeredCount} Triggered)
                    </span>
                    <Link 
                      to="/alerts" 
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs text-[#1D4ED8] hover:underline font-medium"
                    >
                      Manage All
                    </Link>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0]">
                    {triggeredAlerts.length === 0 ? (
                      <div className="px-4 py-6 text-center text-xs text-slate-500">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-1.5 opacity-80" />
                        No triggered alerts. All tracked gadgets are above target thresholds.
                      </div>
                    ) : (
                      triggeredAlerts.map(alert => (
                        <div key={alert.id} className="p-3 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <img 
                              src={alert.product_image_url} 
                              alt={alert.product_name} 
                              className="w-10 h-10 object-contain rounded bg-white p-1 border border-[#E2E8F0]" 
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 truncate">{alert.product_name}</p>
                              <p className="text-[11px] text-emerald-700 font-medium">
                                Target Hit: ₹{alert.product_current_price?.toLocaleString('en-IN')} (Target: ₹{alert.target_price?.toLocaleString('en-IN')})
                              </p>
                              <span className="text-[10px] text-slate-500">
                                {new Date(alert.triggered_at || alert.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Demo 1-Click Launch Button */}
            <Link
              to="/compare?ids=4,3"
              className="btn-press inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Demo: OnePlus 12 vs Pixel 8</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 pt-2 pb-4 space-y-1 shadow-md anim-fade-up">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded text-xs font-medium ${
                  active
                    ? 'text-[#1D4ED8] bg-blue-50/70 font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
