import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { alertApi } from '../services/api';

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);
  const [triggeredCount, setTriggeredCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await alertApi.getAll();
      if (res.success) {
        setAlerts(res.data);
        setTriggeredCount(res.triggeredCount);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const addAlert = async (data) => {
    const res = await alertApi.create(data);
    await fetchAlerts();
    return res;
  };

  const removeAlert = async (id) => {
    const res = await alertApi.delete(id);
    await fetchAlerts();
    return res;
  };

  const simulatePriceDrop = async (productId) => {
    const res = await alertApi.simulateCheck({ simulateDropProductId: productId });
    await fetchAlerts();
    if (res.newlyTriggeredCount > 0) {
      setLatestNotification(`Alert Triggered! ${res.newlyTriggered[0].productName} reached target price!`);
    }
    return res;
  };

  const clearNotification = () => setLatestNotification(null);

  return (
    <AlertContext.Provider value={{
      alerts,
      triggeredCount,
      loading,
      fetchAlerts,
      addAlert,
      removeAlert,
      simulatePriceDrop,
      latestNotification,
      clearNotification
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
}
