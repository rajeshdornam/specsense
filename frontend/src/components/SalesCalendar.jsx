import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { miscApi } from '../services/api';

export default function SalesCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await miscApi.getSalesEvents();
        if (res.success) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error('Failed to load sales events:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#1D4ED8]" />
            <h3 className="text-sm font-bold text-slate-900">Upcoming Seasonal Sales & Historical Cycles</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Synchronize gadget purchases with verified retailer sale periods to avoid temporary markups.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#1D4ED8]" />
            <span className="text-slate-600">Historically Recurring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-[#059669]" />
            <span className="text-slate-600">Scheduled</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500">Loading sales calendar...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {events.map((event) => {
            const isRecurring = event.type === 'Historically Recurring';

            return (
              <div
                key={event.id}
                className="p-3.5 rounded border border-[#E2E8F0] bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isRecurring
                          ? 'bg-blue-50 text-[#1D4ED8] border border-blue-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      {event.discount_range}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-1">{event.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{event.period}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Stores: Amazon & Flipkart</span>
                  <span className="text-[#1D4ED8] font-semibold flex items-center gap-1 text-[10px] uppercase tracking-wider">
                    Timing Advice <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
