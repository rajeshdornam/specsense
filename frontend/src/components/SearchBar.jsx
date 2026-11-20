import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { productApi } from '../services/api';

export default function SearchBar({ placeholder = "Search gadgets by model or brand (e.g. iPhone 15, ThinkPad, Pixel 8, Sony XM5)...", onSelectProduct }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await productApi.search(query.trim());
        if (res.success) {
          setResults(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (prod) => {
    setIsOpen(false);
    setQuery('');
    if (onSelectProduct) {
      onSelectProduct(prod);
    } else {
      navigate(`/tracker?productId=${prod.id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-slate-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#CBD5E1] rounded-md text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] shadow-2xs transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#1D4ED8]" /> : <X className="w-4 h-4 text-slate-400" />}
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-dropdown z-50 overflow-hidden divide-y divide-[#E2E8F0] max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No gadgets found matching "{query}". Try searching iPhone, ThinkPad, Sony, or Galaxy.
            </div>
          ) : (
            results.map((prod) => (
              <div
                key={prod.id}
                onClick={() => handleItemClick(prod)}
                className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 truncate">{prod.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">{prod.brand}</span>
                      <span>•</span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">{prod.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 pl-3">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    ₹{prod.current_price?.toLocaleString('en-IN')}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
