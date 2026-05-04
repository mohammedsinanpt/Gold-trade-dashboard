// src/services/priceBenchmarkingService.js
// All API calls for Layer 5 · Fixing & Price Benchmarking.
// To go live: flip USE_MOCK to false in usePriceBenchmarkingData.js.
// This file: swap mock returns for real fetch() calls per function.
//
// Live endpoints:
//   fetchFixing(metal)          → GET /api/v1/{metal}/fixing/today
//   fetchSpot(metal)            → GET /api/v1/{metal}/spot
//   fetchFxUsdAed()             → GET /api/v1/fx/usd-aed
//   fetchChartData(metal,range) → GET /api/v1/{metal}/chart?range=1D
//   fetchBenchmarkDeals()       → GET /api/v1/gold/deals/today

import {
  LBMA_FIXING,
  SPOT,
  FX_USD_AED,
  GOLD_CHART_DATA,
  SILVER_CHART_DATA,
  BENCHMARK_DEALS,
} from '../data/priceBenchmarkingMockData';

// Snaps a custom date range to the nearest available standard key.
// Replace with a real parameterised API call when live.
export function snapToRange(fromDate, toDate) {
  const days = Math.round((toDate - fromDate) / 86_400_000);
  if (days <= 1)   return '1D';
  if (days <= 7)   return '1W';
  if (days <= 31)  return '1M';
  if (days <= 92)  return '3M';
  if (days <= 183) return '6M';
  return '1Y';
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// @param {'gold'|'silver'} metal
export async function fetchFixing(metal = 'gold') {
  try {
    await delay(250);
    // Live: const res = await fetch(`/api/v1/${metal}/fixing/today`);
    //       return { data: await res.json(), error: null };
    return { data: LBMA_FIXING[metal], error: null };
  } catch (err) {
    return { data: null, error: err.message ?? 'Failed to fetch fixing.' };
  }
}

// @param {'gold'|'silver'} metal
export async function fetchSpot(metal = 'gold') {
  try {
    await delay(250);
    // Live: const res = await fetch(`/api/v1/${metal}/spot`);
    //       return { data: await res.json(), error: null };
    return { data: SPOT[metal], error: null };
  } catch (err) {
    return { data: null, error: err.message ?? 'Failed to fetch spot price.' };
  }
}

export async function fetchFxUsdAed() {
  try {
    await delay(200);
    // Live: const res = await fetch('/api/v1/fx/usd-aed');
    //       return { data: await res.json(), error: null };
    return { data: FX_USD_AED, error: null };
  } catch (err) {
    return { data: null, error: err.message ?? 'Failed to fetch FX data.' };
  }
}

// @param {'gold'|'silver'} metal
// @param {'1D'|'1W'|'1M'|'3M'|'6M'|'1Y'} range
export async function fetchChartData(metal = 'gold', range = '1D') {
  try {
    await delay(350);
    // Live: const res = await fetch(`/api/v1/${metal}/chart?range=${range}`);
    //       return { data: await res.json(), error: null };
    const source = metal === 'silver' ? SILVER_CHART_DATA : GOLD_CHART_DATA;
    return { data: source[range] ?? source['1D'], error: null };
  } catch (err) {
    return { data: null, error: err.message ?? 'Failed to fetch chart data.' };
  }
}

export async function fetchBenchmarkDeals() {
  try {
    await delay(300);
    // Live: const res = await fetch('/api/v1/gold/deals/today');
    //       return { data: await res.json(), error: null };
    return { data: BENCHMARK_DEALS, error: null };
  } catch (err) {
    return { data: null, error: err.message ?? 'Failed to fetch deal data.' };
  }
}