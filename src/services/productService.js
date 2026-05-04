// src/services/productService.js
// All API calls for the Product Data page — no UI, no mock data.
// Flip USE_MOCK = false in useProductData.js to activate.

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';
const get  = async (path) => {
  const res = await fetch(`${BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
  if (!res.ok) throw new Error(`[productService] ${res.status} ${res.statusText} — ${path}`);
  return res.json();
};
const post = async (path, body) => {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`[productService] ${res.status} ${res.statusText} — ${path}`);
  return res.json();
};

export const fetchMetrics         = ()        => get('/api/products/metrics');
export const fetchHourlyVolume    = ()        => get('/api/products/volume/hourly');
export const fetchMonthlyTrend    = ()        => get('/api/products/volume/monthly-trend');
export const fetchProducts        = ()        => get('/api/products');
export const createProduct        = (payload) => post('/api/products', payload);
export const fetchPerformance     = ()        => get('/api/products/performance');
export const fetchAvgDealValues   = ()        => get('/api/products/avg-deal-values');
export const fetchOrigins         = ()        => get('/api/products/origins');
export const fetchCoinBreakdown   = ()        => get('/api/products/coins');
export const fetchBuySellSplit    = ()        => get('/api/products/buy-sell-split');