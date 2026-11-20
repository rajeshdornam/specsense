import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import { productApi } from '../services/api';

export default function ProductSelectorModal({
  isOpen,
  onClose,
  onSelectProduct,
  currentProductIds = [],
  title = "Select a Gadget to Compare"
}) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadProducts() {
      try {
        setLoading(true);
        const res = await productApi.getAll({
          category: activeCategory !== 'All' ? activeCategory : undefined,
          search: search.trim() || undefined
        });
        if (res.success) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load products for modal:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadProducts, 150);
    return () => clearTimeout(timer);
  }, [isOpen, activeCategory, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-2xs animate-in fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-md shadow-dropdown w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-[11px] text-slate-500">Pick from 16 verified devices in SpecSense database</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[#E2E8F0] space-y-2.5 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model or brand (e.g. iPhone, ThinkPad, Pixel)..."
              className="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8]"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {['All', 'Smartphones', 'Laptops', 'Headphones', 'Smartwatches'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#1D4ED8] text-white'
                    : 'bg-white text-slate-600 border border-[#CBD5E1] hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-[#E2E8F0]">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading catalog...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No gadgets found.</div>
          ) : (
            products.map((p) => {
              const isSelected = currentProductIds.includes(p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => !isSelected && onSelectProduct(p)}
                  className={`p-2.5 flex items-center justify-between rounded transition-colors ${
                    isSelected
                      ? 'bg-blue-50/50 opacity-60 cursor-not-allowed'
                      : 'hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="font-medium text-slate-700">{p.brand}</span>
                        <span>•</span>
                        <span className="bg-slate-100 px-1 py-0.2 rounded text-[9px]">{p.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 pl-3">
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      ₹{p.current_price?.toLocaleString('en-IN')}
                    </span>

                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#1D4ED8] bg-blue-100 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded transition-colors"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
