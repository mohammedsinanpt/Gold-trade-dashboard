// src/hooks/useProductData.js
// ► Flip USE_MOCK = false to connect to the real backend — nothing else changes.

import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/productService';
import {
  mockMetrics, mockHourly, mockProductTypes, mockOrigins, mockCoins,
  mockMonthlyTrend, mockAvgDeal, mockProducts, mockPerformance, mockBuySell,
} from '../data/productMockData';

const USE_MOCK   = true;          // ← flip to false when API is ready
const MOCK_DELAY = 500;
const wait       = (ms) => new Promise((r) => setTimeout(r, ms));

const EMPTY = {
  metrics: null, hourly: [], productTypes: [], origins: [], coins: [],
  monthlyTrend: [], avgDeal: [], products: [], performance: [], buySell: null,
};

export const useProductData = () => {
  const [data,    setData]    = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      if (USE_MOCK) {
        await wait(MOCK_DELAY);
        setData({
          metrics: mockMetrics, hourly: mockHourly, productTypes: mockProductTypes,
          origins: mockOrigins, coins: mockCoins, monthlyTrend: mockMonthlyTrend,
          avgDeal: mockAvgDeal, products: mockProducts, performance: mockPerformance,
          buySell: mockBuySell,
        });
      } else {
        const [metrics, hourly, monthlyTrend, products, performance, avgDeal, origins, coins, buySell] =
          await Promise.all([
            svc.fetchMetrics(), svc.fetchHourlyVolume(), svc.fetchMonthlyTrend(),
            svc.fetchProducts(), svc.fetchPerformance(), svc.fetchAvgDealValues(),
            svc.fetchOrigins(), svc.fetchCoinBreakdown(), svc.fetchBuySellSplit(),
          ]);
        setData({
          metrics, hourly, monthlyTrend, origins, coins, avgDeal, buySell,
          productTypes: products.typeBreakdown ?? [],
          products:     products.items        ?? products,
          performance,
        });
      }
    } catch (err) {
      console.error('[useProductData]', err);
      setError(err.message ?? 'Failed to load product data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  return { data, loading, error, refetch: load };
};