import React, { useState } from 'react';
import { Trash2, CheckCircle, Clock, Play, Database } from 'lucide-react';
import { useAlerts } from '../context/AlertContext';

export default function AlertList() {
  const { alerts, loading, removeAlert, simulatePriceDrop } = useAlerts();
  const [filter, setFilter] = useState('ALL');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ACTIVE') return a.status === 'ACTIVE';
    if (filter === 'TRIGGERED') return a.status === 'TRIGGERED';
    return true;
  });

  // Specifically target Google Pixel 8 (Product ID 3) if active, or any active alert
  const demoTargetAlert = alerts.find(a => a.status === 'ACTIVE' && a.product_id === 3) || alerts.find(a => a.status === 'ACTIVE');

  const handleSimulate = async () => {
    try {
      setSimulating(true);
      setSimResult(null);
      const targetProductId = demoTargetAlert ? demoTargetAlert.product_id : 3;
      const res = await simulatePriceDrop(targetProductId);
      setSimResult(`Flash Price Drop simulated on ${demoTargetAlert?.product_name || 'selected gadget'}! ${res.newlyTriggeredCount} alert(s) triggered.`);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5 space-y-4">
      {/* Header and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Configured Price Alerts</h3>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded flex items-center gap-1">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Simulated Alerts Engine</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Persistent database records in SQLite</p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-[#CBD5E1]">
          {['ALL', 'ACTIVE', 'TRIGGERED'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'TRIGGERED' ? 'Triggered' : tab === 'ACTIVE' ? 'Active' : 'All Alerts'}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Bar Tailored for Demo */}
      <div className="p-3.5 rounded bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-xs font-bold text-blue-950 block">Live Hackathon Trigger Simulator</span>
          <span className="text-[11px] text-slate-600">
            Click to simulate a 10% flash price cut on <strong>{demoTargetAlert ? demoTargetAlert.product_name : 'Google Pixel 8'}</strong> to trigger the active target alert live!
          </span>
        </div>

        <button
          type="button"
          disabled={simulating || !demoTargetAlert}
          onClick={handleSimulate}
          className="px-3.5 py-1.5 rounded text-xs font-bold bg-[#1D4ED8] hover:bg-[#1E40AF] text-white transition-colors flex items-center justify-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>{simulating ? 'Simulating Drop...' : 'Trigger Pixel 8 Flash Drop'}</span>
        </button>
      </div>

      {simResult && (
        <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{simResult}</span>
        </div>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Loading alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="py-10 text-center text-slate-500 border border-dashed border-slate-200 rounded">
          <Clock className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs">No alerts under status "{filter}".</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2E8F0]">
          {filteredAlerts.map((alert) => {
            const isTriggered = alert.status === 'TRIGGERED';
            const priceDifference = (alert.product_current_price || 0) - alert.target_price;

            return (
              <div key={alert.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <img
                      src={alert.product_image_url}
                      alt={alert.product_name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-semibold text-slate-900 truncate" title={alert.product_name}>
                      {alert.product_name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Brand: <strong className="text-slate-700">{alert.product_brand}</strong></span>
                      <span>•</span>
                      <span>Current: <strong className="text-slate-800 tabular-nums">₹{alert.product_current_price?.toLocaleString('en-IN')}</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-[#1D4ED8] tabular-nums">₹{alert.target_price?.toLocaleString('en-IN')}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                  {isTriggered ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#15803D] border border-green-200 uppercase">
                      <CheckCircle className="w-3 h-3" />
                      <span>Triggered</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-[#1D4ED8] border border-blue-200 tabular-nums">
                      <Clock className="w-3 h-3" />
                      <span>₹{priceDifference.toLocaleString('en-IN')} away</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
