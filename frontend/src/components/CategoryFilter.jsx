import React from 'react';
import { Smartphone, Laptop, Headphones, Watch, Grid } from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Electronics', icon: Grid },
  { id: 'Smartphones', label: 'Smartphones', icon: Smartphone },
  { id: 'Laptops', label: 'Laptops', icon: Laptop },
  { id: 'Headphones', label: 'Audio & Headphones', icon: Headphones },
  { id: 'Smartwatches', label: 'Smartwatches', icon: Watch },
];

export default function CategoryFilter({ activeCategory, onSelectCategory, categoryCounts = {} }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = activeCategory === cat.id;
        const count = categoryCounts[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors border ${
              isSelected
                ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] font-semibold'
                : 'bg-white text-slate-700 border-[#CBD5E1] hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
            {count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold tabular-nums ${
                  isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
