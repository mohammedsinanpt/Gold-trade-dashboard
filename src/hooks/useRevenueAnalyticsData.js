// src/hooks/useRevenueAnalyticsData.js
// Fetching logic for RevenueAnalytics page.
// To connect to the real backend: flip USE_MOCK to false — nothing else changes.

import { useState, useEffect } from 'react';

// ── All imports must be at the top (import/first rule) ─────
import {
  KPI_CARDS,
  YTD_CARD,
  VOLUME_TILES,
  YOY_COMPARISONS,
  CHANNELS,
  PRODUCT_MARGIN,
  CUSTOMER_TIERS,
  DEAL_SUMMARY_STATS,
  TOP_CLIENTS_10,
  DAILY_TX_DATA,
  DAILY_TX_STATS,
  DEAL_METRICS,
  KG_MONTHLY,
  KG_SUMMARY_STATS,
  SPOT_SCENARIOS,
  SPOT_SENSITIVITY,
  CERT_KPI,
  BRAND_DATA,
  CERT_RULES,
  CERT_TIMELINE,
  CERT_SUMMARY_STATS,
  BLOCKED_DEALS,
  CERT_CONFIG,
} from '../data/revenueAnalyticsMockData';

import { revData } from '../data/mockData';

// ── Real service (only called when USE_MOCK = false) ───────
import {
  fetchKpiCards,
  fetchVolumeTiles,
  fetchRevenueTrend,
  fetchYoyComparisons,
  fetchChannels,
  fetchProductMargins,
  fetchCustomerTiers,
  fetchDealSummaryStats,
  fetchTopClients,
  fetchDailyTransactions,
  fetchDealMetrics,
  fetchKgMonthly,
  fetchSpotScenarios,
  fetchCertKpi,
  fetchBrandData,
  fetchCertRules,
  fetchCertTimeline,
  fetchCertSummary,
  fetchBlockedDeals,
} from '../services/revenueAnalyticsService';

// ── Toggle this to switch between mock and real API ────────
// To go live: flip to false — nothing else in this file changes.
const USE_MOCK = true;

// ── Mock resolver — returns all data instantly ─────────────
async function resolveMock() {
  // Simulate a short network delay so loading state is visible in dev
  await new Promise(r => setTimeout(r, 400));

  return {
    kpiCards:        KPI_CARDS,
    ytdCard:         YTD_CARD,
    volumeTiles:     VOLUME_TILES,
    revenueTrend:    revData,
    yoyComparisons:  YOY_COMPARISONS,
    channels:        CHANNELS,
    productMargins:  PRODUCT_MARGIN,
    customerTiers:   CUSTOMER_TIERS,
    dealSummary:     DEAL_SUMMARY_STATS,
    topClients:      TOP_CLIENTS_10,
    dailyTx:         DAILY_TX_DATA,
    dailyTxStats:    DAILY_TX_STATS,
    dealMetrics:     DEAL_METRICS,
    kgMonthly:       KG_MONTHLY,
    kgSummaryStats:  KG_SUMMARY_STATS,
    spotScenarios:   SPOT_SCENARIOS,
    spotSensitivity: SPOT_SENSITIVITY,
    certKpi:         CERT_KPI,
    brandData:       BRAND_DATA,
    certRules:       CERT_RULES,
    certTimeline:    CERT_TIMELINE,
    certSummary:     CERT_SUMMARY_STATS,
    blockedDeals:    BLOCKED_DEALS,
    certConfig:      CERT_CONFIG,
  };
}

// ── Real API resolver — fires all calls in parallel ────────
async function resolveReal() {
  const [
    { kpiCards, ytdCard },
    volumeTiles,
    revenueTrend,
    yoyComparisons,
    channels,
    productMargins,
    customerTiers,
    dealSummary,
    topClients,
    dailyTx,
    dealMetrics,
    kgMonthly,
    { scenarios: spotScenarios, sensitivity: spotSensitivity },
    certKpi,
    brandData,
    certRules,
    certTimeline,
    { summaryStats: certSummary, config: certConfig },
    blockedDeals,
  ] = await Promise.all([
    fetchKpiCards(),
    fetchVolumeTiles(),
    fetchRevenueTrend(),
    fetchYoyComparisons(),
    fetchChannels(),
    fetchProductMargins(),
    fetchCustomerTiers(),
    fetchDealSummaryStats(),
    fetchTopClients(),
    fetchDailyTransactions(),
    fetchDealMetrics(),
    fetchKgMonthly(),
    fetchSpotScenarios(),
    fetchCertKpi(),
    fetchBrandData(),
    fetchCertRules(),
    fetchCertTimeline(),
    fetchCertSummary(),
    fetchBlockedDeals(),
  ]);

  return {
    kpiCards,
    ytdCard,
    volumeTiles,
    revenueTrend,
    yoyComparisons,
    channels,
    productMargins,
    customerTiers,
    dealSummary,
    topClients,
    dailyTx,
    dailyTxStats: [],   // derive from dailyTx if needed
    dealMetrics,
    kgMonthly,
    kgSummaryStats: [], // derive from kgMonthly if needed
    spotScenarios,
    spotSensitivity,
    certKpi,
    brandData,
    certRules,
    certTimeline,
    certSummary,
    blockedDeals,
    certConfig,
  };
}

// ── The hook ───────────────────────────────────────────────
export function useRevenueAnalyticsData() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await (USE_MOCK ? resolveMock() : resolveReal());
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load revenue data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}