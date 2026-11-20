import React, { useState } from 'react';
import { Bell, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

export default function PriceAlertForm({ products = [], selectedProductId, onAlertCreated }) {
  const { addAlert } = useAlerts();
  const [productId, setProductId] = useState(selectedProductId || (products[0]?.id || ''));
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState('shopper@specsense.io');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const currentProduct = products.find(p => p.id === Number(productId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !targetPrice) {
      setError('Please select a gadget and specify your target price.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);

      const res = await addAlert({
        productId: Number(productId),
        targetPrice: Number(targetPrice),
        userEmail: email
      });

      if (res.success) {
        setMessage(res.message || 'Price alert activated!');
        setTargetPrice('');
        if (onAlertCreated) onAlertCreated(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create target alert');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuggestTarget = (discountPct) => {
    if (currentProduct) {
      const discounted = Math.round(currentProduct.current_price * (1 - discountPct / 100));
      setTargetPrice(discounted);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-[#1D4ED8]" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Configure Target Price Alert</h3>
          <p className="text-[11px] text-slate-500">Receive instant notification upon market price hit</p>
        </div>
      </div>

      {message && (
        <div className="mb-3 p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-3 p-2.5 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Tracked Electronic Gadget
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Current: ₹{p.current_price?.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
        </div>

        {currentProduct && (
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Current Market Price:</span>
            <span className="font-bold text-slate-900 tabular-nums">₹{currentProduct.current_price?.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Target Price (₹ INR)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="e.g. 59999"
              min="1000"
              required
              className="w-full pl-7 pr-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8] tabular-nums"
            />
          </div>

          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Presets:</span>
            <button
              type="button"
              onClick={() => handleSuggestTarget(5)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              -5% Dip
            </button>
            <button
              type="button"
              onClick={() => handleSuggestTarget(10)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              -10% Drop
            </button>
            <button
              type="button"
              onClick={() => handleSuggestTarget(15)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            >
              -15% Major Deal
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Notification Dispatch Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-slate-900 focus:outline-hidden focus:border-[#1D4ED8]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-3 rounded text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{submitting ? 'Activating...' : 'Activate Price Drop Alert'}</span>
        </button>
      </form>
    </div>
  );
}
