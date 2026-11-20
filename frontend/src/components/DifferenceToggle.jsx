import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function DifferenceToggle({ enabled, onToggle }) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-white border border-[#CBD5E1] px-3 py-1.5 rounded shadow-2xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#1D4ED8]" />
        <span>Differences Only</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onToggle(!enabled)}
        className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-150 ease-in-out focus:outline-hidden ${
          enabled ? 'bg-[#1D4ED8]' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-2xs transition duration-150 ease-in-out ${
            enabled ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
