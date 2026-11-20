import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PriceAlertForm from '../components/PriceAlertForm';
import AlertList from '../components/AlertList';
import { productApi } from '../services/api';

export default function PriceAlertsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const preselectedProductId = parseInt(searchParams.get('productId'), 10) || null;

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success) setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
          Target Price Alerts
        </span>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
          Automated Price Drop Alert Service
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure target prices on any gadget. SpecSense monitors multi-retailer inventory daily and notifies you instantly when your target is reached.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Create Form */}
        <div className="lg:col-span-1">
          <PriceAlertForm
            products={products}
            selectedProductId={preselectedProductId}
          />
        </div>

        {/* Right Column: Alerts List and Simulator */}
        <div className="lg:col-span-2 space-y-4">
          <AlertList />
        </div>
      </div>
    </div>
  );
}
