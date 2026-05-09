// src/hooks/useProductData.js
// ► Flip USE_MOCK = false to connect to the real backend — nothing else changes.

import { useState, useEffect, useCallback } from 'react';
import * as svc from '../services/productService';
import {
  mockMetrics, mockHourly, mockProductTypes, mockRevenueByType,
  mockOrigins, mockCoins, mockMonthlyTrend, mockProducts,
  mockPerformance, mockBuySell, mockPerDealPremium, mockPremiumSplit,
  mockScatterDeals, mockPipelineData, mockPipelineStats,
} from '../data/productMockData';

const USE_MOCK   = true;       // ← flip to false when real API is ready
const MOCK_DELAY = 500;
const wait       = (ms) => new Promise((r) => setTimeout(r, ms));

const EMPTY = {
  metrics: null, hourly: [], productTypes: [], revenueByType: [],
  origins: [], coins: [], monthlyTrend: [], products: [],
  performance: [], buySell: null, perDealPremium: [], premiumSplit: null,
  scatterDeals: [], pipelineData: [], pipelineStats: null,
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
          metrics:       mockMetrics,
          hourly:        mockHourly,
          productTypes:  mockProductTypes,
          revenueByType: mockRevenueByType,
          origins:       mockOrigins,
          coins:         mockCoins,
          monthlyTrend:  mockMonthlyTrend,
          products:      mockProducts,
          performance:   mockPerformance,
          buySell:       mockBuySell,
          perDealPremium:mockPerDealPremium,
          premiumSplit:  mockPremiumSplit,
          scatterDeals:  mockScatterDeals,
          pipelineData:  mockPipelineData,
          pipelineStats: mockPipelineStats,
        });
      } else {
        const [
          metrics, hourly, monthlyTrend, products, performance,
          origins, coins, buySell, revenueByType,
          perDealPremium, premiumSplit, scatterDeals,
          pipelineData, pipelineStats,
        ] = await Promise.all([
          svc.fetchMetrics(),
          svc.fetchHourlyVolume(),
          svc.fetchMonthlyTrend(),
          svc.fetchProducts(),
          svc.fetchPerformance(),
          svc.fetchOrigins(),
          svc.fetchCoinBreakdown(),
          svc.fetchBuySellSplit(),
          svc.fetchRevenueByType(),
          svc.fetchPerDealPremium(),
          svc.fetchPremiumSplit(),
          svc.fetchScatterDeals(),
          svc.fetchPipelineData(),
          svc.fetchPipelineStats(),
        ]);
        setData({
          metrics, hourly, monthlyTrend, origins, coins, buySell,
          revenueByType, perDealPremium, premiumSplit, scatterDeals,
          pipelineData, pipelineStats, performance,
          productTypes: products.typeBreakdown ?? [],
          products:     products.items        ?? products,
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