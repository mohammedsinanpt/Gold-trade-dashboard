// src/services/revenueAnalyticsService.js
// All API calls for the RevenueAnalytics page.
// Nothing else lives here — no business logic, no UI, no mock data.
// To connect to a real backend, implement each function below.

/**
 * Fetch all KPI card data (today / week / month / quarter / YTD).
 * @returns {Promise<{ kpiCards: Array, ytdCard: Object }>}
 */
export async function fetchKpiCards() {
  const res = await fetch('/api/revenue/kpis');
  if (!res.ok) throw new Error(`fetchKpiCards failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch gold & silver volume snapshot tiles.
 * @returns {Promise<Array>}
 */
export async function fetchVolumeTiles() {
  const res = await fetch('/api/revenue/volume-tiles');
  if (!res.ok) throw new Error(`fetchVolumeTiles failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch 12-month revenue trend data including prior-year comparison.
 * @returns {Promise<Array<{ n: string, v: number, prev: number }>>}
 */
export async function fetchRevenueTrend() {
  const res = await fetch('/api/revenue/trend');
  if (!res.ok) throw new Error(`fetchRevenueTrend failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch year-over-year comparison chips.
 * @returns {Promise<Array<{ label: string, val: string, up: boolean }>>}
 */
export async function fetchYoyComparisons() {
  const res = await fetch('/api/revenue/yoy');
  if (!res.ok) throw new Error(`fetchYoyComparisons failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch revenue breakdown by sales channel.
 * @returns {Promise<Array>}
 */
export async function fetchChannels() {
  const res = await fetch('/api/revenue/channels');
  if (!res.ok) throw new Error(`fetchChannels failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch revenue and margin breakdown by product type.
 * @returns {Promise<Array>}
 */
export async function fetchProductMargins() {
  const res = await fetch('/api/revenue/product-margins');
  if (!res.ok) throw new Error(`fetchProductMargins failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch revenue breakdown by customer tier.
 * @returns {Promise<Array>}
 */
export async function fetchCustomerTiers() {
  const res = await fetch('/api/revenue/customer-tiers');
  if (!res.ok) throw new Error(`fetchCustomerTiers failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch deal summary stats (highest deal, avg transaction, etc.)
 * @returns {Promise<Array<{ label: string, value: string }>>}
 */
export async function fetchDealSummaryStats() {
  const res = await fetch('/api/revenue/deal-summary');
  if (!res.ok) throw new Error(`fetchDealSummaryStats failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch top 10 clients ranked by revenue contribution.
 * @returns {Promise<Array>}
 */
export async function fetchTopClients() {
  const res = await fetch('/api/revenue/top-clients');
  if (!res.ok) throw new Error(`fetchTopClients failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch daily transaction counts and revenue for the current week.
 * @returns {Promise<Array<{ day: string, txns: number, revenue: number }>>}
 */
export async function fetchDailyTransactions() {
  const res = await fetch('/api/revenue/daily-transactions');
  if (!res.ok) throw new Error(`fetchDailyTransactions failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch deal metrics: top deal, margin by category, summary stats.
 * @returns {Promise<Object>}
 */
export async function fetchDealMetrics() {
  const res = await fetch('/api/revenue/deal-metrics');
  if (!res.ok) throw new Error(`fetchDealMetrics failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch monthly gold volume sold in KG.
 * @returns {Promise<Array<{ n: string, kg: number }>>}
 */
export async function fetchKgMonthly() {
  const res = await fetch('/api/revenue/kg-monthly');
  if (!res.ok) throw new Error(`fetchKgMonthly failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch gold spot price impact scenarios.
 * @returns {Promise<{ scenarios: Array, sensitivity: Array }>}
 */
export async function fetchSpotScenarios() {
  const res = await fetch('/api/revenue/spot-scenarios');
  if (!res.ok) throw new Error(`fetchSpotScenarios failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch bullion certification KPI strip.
 * @returns {Promise<Array>}
 */
export async function fetchCertKpi() {
  const res = await fetch('/api/revenue/cert/kpi');
  if (!res.ok) throw new Error(`fetchCertKpi failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch bullion brand breakdown table data.
 * @returns {Promise<Array>}
 */
export async function fetchBrandData() {
  const res = await fetch('/api/revenue/cert/brands');
  if (!res.ok) throw new Error(`fetchBrandData failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch certification rule pass/fail list.
 * @returns {Promise<Array<{ rule: string, pass: boolean, count: string }>>}
 */
export async function fetchCertRules() {
  const res = await fetch('/api/revenue/cert/rules');
  if (!res.ok) throw new Error(`fetchCertRules failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch daily certification rate timeline for current month.
 * @returns {Promise<Array<{ date: string, rate: number, value: number }>>}
 */
export async function fetchCertTimeline() {
  const res = await fetch('/api/revenue/cert/timeline');
  if (!res.ok) throw new Error(`fetchCertTimeline failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch certification summary stats and config (current rate, target, etc.)
 * @returns {Promise<{ summaryStats: Array, config: Object }>}
 */
export async function fetchCertSummary() {
  const res = await fetch('/api/revenue/cert/summary');
  if (!res.ok) throw new Error(`fetchCertSummary failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch list of blocked/pending bullion deals requiring action.
 * @returns {Promise<Array>}
 */
export async function fetchBlockedDeals() {
  const res = await fetch('/api/revenue/cert/blocked-deals');
  if (!res.ok) throw new Error(`fetchBlockedDeals failed: ${res.status}`);
  return res.json();
}