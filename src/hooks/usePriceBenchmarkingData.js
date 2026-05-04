// src/hooks/usePriceBenchmarkingData.js
// Data hook for Layer 5 · Fixing & Price Benchmarking.
// Owns all state: activeMetal, activeRange, data, loading, error.
//
// ─── To connect to the real backend ──────────────────────────────────────────
// 1. Flip USE_MOCK to false below.
// 2. Update fetch functions in priceBenchmarkingService.js with real endpoints.
// 3. Delete priceBenchmarkingMockData.js once API is confirmed working.
// Nothing else changes — hook interface and component stay identical.

import { useState, useEffect, useCallback } from 'react';
import {
  fetchFixing,
  fetchSpot,
  fetchFxUsdAed,
  fetchChartData,
  fetchBenchmarkDeals,
  snapToRange,
} from '../services/priceBenchmarkingService';

export const USE_MOCK = true; // ← flip to false when real API is ready

// ─── Safe defaults (prevent crashes if API returns null) ──────────────────────

const DEFAULT_FIXING = {
  am: { price: 0, change: 0, changePct: 0, time: '—', session: 'AM' },
  pm: { price: 0, change: 0, changePct: 0, time: '—', session: 'PM' },
};

const DEFAULT_SPOT = {
  price: 0, change: 0, changePct: 0,
  vsAMFix: 0, vsPMFix: 0,
  open: 0, high: 0, low: 0,
};

const DEFAULT_FX_METAL = {
  spotAED: 0, amFixAED: 0, pmFixAED: 0, fxImpactPerOz: 0,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePriceBenchmarkingData() {
  const [activeMetal, setActiveMetal] = useState('gold');  // 'gold' | 'silver'
  const [activeRange,  setActiveRange]  = useState('1D');  // '1D'|'1W'|'1M'|'3M'|'6M'|'1Y'

  const [fixing,    setFixing]    = useState(DEFAULT_FIXING);
  const [spot,      setSpot]      = useState(DEFAULT_SPOT);
  const [fx,        setFx]        = useState({ rate: 0, prevClose: 0, delta: 0, ...DEFAULT_FX_METAL });
  const [deals,     setDeals]     = useState([]);
  const [chartData, setChartData] = useState([]);

  const [isLoading,      setIsLoading]      = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [error,          setError]          = useState(null);

  // Reload fixing, spot, fx, deals whenever metal switches
  useEffect(() => {
    let cancelled = false;
    async function loadStatic() {
      setIsLoading(true);
      setError(null);
      const [fixingRes, spotRes, fxRes, dealsRes] = await Promise.all([
        fetchFixing(activeMetal),
        fetchSpot(activeMetal),
        fetchFxUsdAed(),
        fetchBenchmarkDeals(),
      ]);
      if (cancelled) return;
      const firstError = fixingRes.error ?? spotRes.error ?? fxRes.error ?? dealsRes.error ?? null;
      if (fixingRes.data) setFixing(fixingRes.data);
      if (spotRes.data)   setSpot(spotRes.data);
      if (fxRes.data) {
        // Flatten metal-specific FX fields so component reads fx.spotAED directly
        const metalFx = fxRes.data[activeMetal] ?? DEFAULT_FX_METAL;
        setFx({ rate: fxRes.data.rate, prevClose: fxRes.data.prevClose, delta: fxRes.data.delta, ...metalFx });
      }
      if (dealsRes.data)  setDeals(dealsRes.data);
      if (firstError)     setError(firstError);
      setIsLoading(false);
    }
    loadStatic();
    return () => { cancelled = true; };
  }, [activeMetal]);

  // Reload chart whenever metal or range changes
  const loadChart = useCallback(async (metal, range) => {
    setIsChartLoading(true);
    const { data, error: chartErr } = await fetchChartData(metal, range);
    setChartData(data ?? []);
    if (chartErr) setError(chartErr);
    setIsChartLoading(false);
  }, []);

  useEffect(() => {
    loadChart(activeMetal, activeRange);
  }, [activeMetal, activeRange, loadChart]);

  // Apply a custom date range — snaps to nearest standard key
  const applyCustomRange = useCallback((fromDate, toDate) => {
    setActiveRange(snapToRange(fromDate, toDate));
    // Live API: pass fromDate + toDate directly to fetchChartData instead
  }, []);

  return {
    activeMetal, setActiveMetal,
    activeRange,  setActiveRange,
    applyCustomRange,
    fixing, spot, fx,
    chartData, deals,
    isLoading, isChartLoading, error,
  };
}