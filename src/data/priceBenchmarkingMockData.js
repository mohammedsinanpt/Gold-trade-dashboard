// src/data/priceBenchmarkingMockData.js
// Page-specific mock data for Layer 5 · Fixing & Price Benchmarking.
// Delete this file only after the real API is confirmed working
// and USE_MOCK is flipped to false in usePriceBenchmarkingData.js.

// ─── LBMA AM / PM fixing ──────────────────────────────────────────────────────

export const LBMA_FIXING = {
  gold: {
    am: { price: 2318.50, change: +4.20, changePct: +0.18, time: '10:30 AM GMT', session: 'AM' },
    pm: { price: 2321.75, change: +7.45, changePct: +0.32, time: '03:00 PM GMT', session: 'PM' },
  },
  silver: {
    am: { price: 29.42, change: +0.18, changePct: +0.62, time: '10:30 AM GMT', session: 'AM' },
    pm: { price: 29.68, change: +0.44, changePct: +1.51, time: '03:00 PM GMT', session: 'PM' },
  },
};

// ─── Real-time spot price ──────────────────────────────────────────────────────

export const SPOT = {
  gold: {
    price: 2324.10, change: +2.35, changePct: +0.10,
    vsAMFix: 2324.10 - 2318.50,
    vsPMFix: 2324.10 - 2321.75,
    open: 2308.40, high: 2324.10, low: 2306.80,
  },
  silver: {
    price: 29.84, change: +0.16, changePct: +0.54,
    vsAMFix: 29.84 - 29.42,
    vsPMFix: 29.84 - 29.68,
    open: 29.10, high: 29.90, low: 29.05,
  },
};

// ─── FX — USD to AED ──────────────────────────────────────────────────────────

export const FX_USD_AED = {
  rate:      3.6725,
  prevClose: 3.6710,
  delta:     3.6725 - 3.6710,
  gold: {
    spotAED:       +(2324.10 * 3.6725).toFixed(2),
    amFixAED:      +(2318.50 * 3.6725).toFixed(2),
    pmFixAED:      +(2321.75 * 3.6725).toFixed(2),
    fxImpactPerOz: +((3.6725 - 3.6710) * 2324.10).toFixed(2),
  },
  silver: {
    spotAED:       +(29.84 * 3.6725).toFixed(2),
    amFixAED:      +(29.42 * 3.6725).toFixed(2),
    pmFixAED:      +(29.68 * 3.6725).toFixed(2),
    fxImpactPerOz: +((3.6725 - 3.6710) * 29.84).toFixed(2),
  },
};

// ─── Gold chart data ──────────────────────────────────────────────────────────
// Shape per point: { t, benchmark, uaeMarket, fluctuation }
//   t           — x-axis label
//   benchmark   — LBMA official fixing price (USD/oz)
//   uaeMarket   — actual UAE traded price (USD/oz)
//   fluctuation — uaeMarket minus previous point's uaeMarket (signed, USD/oz)
//
// Live API: GET /api/v1/gold/chart?range=1D
// Replace array contents only — chart component shape stays the same.

export const GOLD_CHART_DATA = {
  '1D': [
    { t: '00:00', benchmark: 2318.50, uaeMarket: 2319.80, fluctuation:  0.00  },
    { t: '02:00', benchmark: 2318.50, uaeMarket: 2317.40, fluctuation: -2.40  },
    { t: '04:00', benchmark: 2318.50, uaeMarket: 2315.20, fluctuation: -2.20  },
    { t: '06:00', benchmark: 2318.50, uaeMarket: 2320.60, fluctuation: +5.40  },
    { t: '08:00', benchmark: 2318.50, uaeMarket: 2322.90, fluctuation: +2.30  },
    { t: '10:00', benchmark: 2318.50, uaeMarket: 2321.40, fluctuation: -1.50  },
    { t: '12:00', benchmark: 2321.75, uaeMarket: 2319.80, fluctuation: -1.60  },
    { t: '14:00', benchmark: 2321.75, uaeMarket: 2323.50, fluctuation: +3.70  },
    { t: '15:00', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation: +0.60  },
    { t: '16:00', benchmark: 2321.75, uaeMarket: 2322.30, fluctuation: -1.80  },
    { t: '18:00', benchmark: 2321.75, uaeMarket: 2325.60, fluctuation: +3.30  },
    { t: '20:00', benchmark: 2321.75, uaeMarket: 2323.90, fluctuation: -1.70  },
    { t: '22:00', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation: +0.20  },
  ],
  '1W': [
    { t: 'Mon Apr 21', benchmark: 2290.50, uaeMarket: 2293.80, fluctuation:  0.00 },
    { t: 'Tue Apr 22', benchmark: 2298.10, uaeMarket: 2301.40, fluctuation: +7.60 },
    { t: 'Wed Apr 23', benchmark: 2305.30, uaeMarket: 2308.70, fluctuation: +7.30 },
    { t: 'Thu Apr 24', benchmark: 2312.70, uaeMarket: 2315.90, fluctuation: +7.20 },
    { t: 'Fri Apr 25', benchmark: 2318.50, uaeMarket: 2324.10, fluctuation: +8.20 },
  ],
  '1M': [
    { t: 'Apr 1',  benchmark: 2180.00, uaeMarket: 2183.50, fluctuation:   0.00 },
    { t: 'Apr 3',  benchmark: 2191.00, uaeMarket: 2194.80, fluctuation:  +5.60 },
    { t: 'Apr 7',  benchmark: 2204.00, uaeMarket: 2200.60, fluctuation:  -0.70 },
    { t: 'Apr 8',  benchmark: 2210.25, uaeMarket: 2214.90, fluctuation: +14.30 },
    { t: 'Apr 10', benchmark: 2224.00, uaeMarket: 2228.70, fluctuation: +13.30 },
    { t: 'Apr 14', benchmark: 2240.00, uaeMarket: 2237.80, fluctuation:  +3.60 },
    { t: 'Apr 16', benchmark: 2256.25, uaeMarket: 2259.80, fluctuation:  +7.70 },
    { t: 'Apr 22', benchmark: 2275.50, uaeMarket: 2279.30, fluctuation: +17.90 },
    { t: 'Apr 25', benchmark: 2305.50, uaeMarket: 2309.40, fluctuation: +11.60 },
    { t: 'Apr 28', benchmark: 2312.75, uaeMarket: 2316.20, fluctuation:  +6.80 },
    { t: 'Apr 30', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation:  +2.20 },
  ],
  '3M': [
    { t: 'Feb 1',  benchmark: 2020.00, uaeMarket: 2024.20, fluctuation:   0.00 },
    { t: 'Feb 10', benchmark: 2048.50, uaeMarket: 2052.80, fluctuation: +28.60 },
    { t: 'Feb 20', benchmark: 2075.30, uaeMarket: 2079.40, fluctuation: +26.60 },
    { t: 'Mar 1',  benchmark: 2100.00, uaeMarket: 2103.60, fluctuation: +24.20 },
    { t: 'Mar 10', benchmark: 2138.75, uaeMarket: 2142.30, fluctuation: +38.70 },
    { t: 'Mar 20', benchmark: 2168.40, uaeMarket: 2172.10, fluctuation: +29.80 },
    { t: 'Apr 1',  benchmark: 2180.00, uaeMarket: 2183.50, fluctuation: +11.40 },
    { t: 'Apr 10', benchmark: 2224.00, uaeMarket: 2228.70, fluctuation: +45.20 },
    { t: 'Apr 20', benchmark: 2268.50, uaeMarket: 2272.40, fluctuation: +43.70 },
    { t: 'Apr 30', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation: +51.70 },
  ],
  '6M': [
    { t: 'Nov 1',  benchmark: 1820.00, uaeMarket: 1823.40, fluctuation:   0.00 },
    { t: 'Nov 15', benchmark: 1862.50, uaeMarket: 1866.10, fluctuation: +42.70 },
    { t: 'Dec 1',  benchmark: 1910.00, uaeMarket: 1913.80, fluctuation: +47.70 },
    { t: 'Dec 15', benchmark: 1948.75, uaeMarket: 1952.40, fluctuation: +38.60 },
    { t: 'Jan 1',  benchmark: 1980.00, uaeMarket: 1983.60, fluctuation: +31.20 },
    { t: 'Jan 15', benchmark: 2010.50, uaeMarket: 2014.20, fluctuation: +30.60 },
    { t: 'Feb 1',  benchmark: 2020.00, uaeMarket: 2024.20, fluctuation: +10.00 },
    { t: 'Feb 15', benchmark: 2062.25, uaeMarket: 2066.10, fluctuation: +41.90 },
    { t: 'Mar 1',  benchmark: 2100.00, uaeMarket: 2103.60, fluctuation: +37.50 },
    { t: 'Mar 15', benchmark: 2148.60, uaeMarket: 2152.30, fluctuation: +48.70 },
    { t: 'Apr 1',  benchmark: 2180.00, uaeMarket: 2183.50, fluctuation: +31.20 },
    { t: 'Apr 15', benchmark: 2248.50, uaeMarket: 2252.10, fluctuation: +68.60 },
    { t: 'Apr 30', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation: +72.00 },
  ],
  '1Y': [
    { t: 'May 25', benchmark: 1680.00, uaeMarket: 1683.20, fluctuation:    0.00 },
    { t: 'Jun 25', benchmark: 1720.50, uaeMarket: 1724.10, fluctuation:  +40.90 },
    { t: 'Jul 25', benchmark: 1758.00, uaeMarket: 1761.80, fluctuation:  +37.70 },
    { t: 'Aug 25', benchmark: 1792.25, uaeMarket: 1796.40, fluctuation:  +34.60 },
    { t: 'Sep 25', benchmark: 1751.00, uaeMarket: 1754.60, fluctuation:  -41.80 },
    { t: 'Oct 25', benchmark: 1782.50, uaeMarket: 1786.20, fluctuation:  +31.60 },
    { t: 'Nov 25', benchmark: 1820.00, uaeMarket: 1823.40, fluctuation:  +37.20 },
    { t: 'Dec 25', benchmark: 1948.75, uaeMarket: 1952.40, fluctuation: +129.00 },
    { t: 'Jan 26', benchmark: 1980.00, uaeMarket: 1983.60, fluctuation:  +31.20 },
    { t: 'Feb 26', benchmark: 2020.00, uaeMarket: 2024.20, fluctuation:  +40.60 },
    { t: 'Mar 26', benchmark: 2100.00, uaeMarket: 2103.60, fluctuation:  +79.40 },
    { t: 'Apr 26', benchmark: 2321.75, uaeMarket: 2324.10, fluctuation: +220.50 },
  ],
};

// ─── Silver chart data ────────────────────────────────────────────────────────
// Same shape as GOLD_CHART_DATA. Prices in USD/oz (realistic ~$18–30 range).
// Live API: GET /api/v1/silver/chart?range=1D

export const SILVER_CHART_DATA = {
  '1D': [
    { t: '00:00', benchmark: 29.42, uaeMarket: 29.54, fluctuation:  0.00 },
    { t: '02:00', benchmark: 29.42, uaeMarket: 29.38, fluctuation: -0.16 },
    { t: '04:00', benchmark: 29.42, uaeMarket: 29.22, fluctuation: -0.16 },
    { t: '06:00', benchmark: 29.42, uaeMarket: 29.48, fluctuation: +0.26 },
    { t: '08:00', benchmark: 29.42, uaeMarket: 29.62, fluctuation: +0.14 },
    { t: '10:00', benchmark: 29.42, uaeMarket: 29.55, fluctuation: -0.07 },
    { t: '12:00', benchmark: 29.68, uaeMarket: 29.46, fluctuation: -0.09 },
    { t: '14:00', benchmark: 29.68, uaeMarket: 29.71, fluctuation: +0.25 },
    { t: '15:00', benchmark: 29.68, uaeMarket: 29.80, fluctuation: +0.09 },
    { t: '16:00', benchmark: 29.68, uaeMarket: 29.72, fluctuation: -0.08 },
    { t: '18:00', benchmark: 29.68, uaeMarket: 29.85, fluctuation: +0.13 },
    { t: '20:00', benchmark: 29.68, uaeMarket: 29.79, fluctuation: -0.06 },
    { t: '22:00', benchmark: 29.68, uaeMarket: 29.84, fluctuation: +0.05 },
  ],
  '1W': [
    { t: 'Mon Apr 21', benchmark: 28.90, uaeMarket: 29.02, fluctuation:  0.00 },
    { t: 'Tue Apr 22', benchmark: 29.08, uaeMarket: 29.20, fluctuation: +0.18 },
    { t: 'Wed Apr 23', benchmark: 29.22, uaeMarket: 29.35, fluctuation: +0.15 },
    { t: 'Thu Apr 24', benchmark: 29.38, uaeMarket: 29.52, fluctuation: +0.17 },
    { t: 'Fri Apr 25', benchmark: 29.42, uaeMarket: 29.84, fluctuation: +0.32 },
  ],
  '1M': [
    { t: 'Apr 1',  benchmark: 27.80, uaeMarket: 27.94, fluctuation:  0.00 },
    { t: 'Apr 3',  benchmark: 28.02, uaeMarket: 28.16, fluctuation: +0.22 },
    { t: 'Apr 7',  benchmark: 28.24, uaeMarket: 28.18, fluctuation: -0.04 },
    { t: 'Apr 8',  benchmark: 28.40, uaeMarket: 28.56, fluctuation: +0.38 },
    { t: 'Apr 10', benchmark: 28.62, uaeMarket: 28.78, fluctuation: +0.22 },
    { t: 'Apr 14', benchmark: 28.88, uaeMarket: 28.74, fluctuation: -0.06 },
    { t: 'Apr 16', benchmark: 29.04, uaeMarket: 29.18, fluctuation: +0.44 },
    { t: 'Apr 22', benchmark: 29.18, uaeMarket: 29.34, fluctuation: +0.16 },
    { t: 'Apr 25', benchmark: 29.38, uaeMarket: 29.62, fluctuation: +0.28 },
    { t: 'Apr 28', benchmark: 29.42, uaeMarket: 29.72, fluctuation: +0.10 },
    { t: 'Apr 30', benchmark: 29.68, uaeMarket: 29.84, fluctuation: +0.12 },
  ],
  '3M': [
    { t: 'Feb 1',  benchmark: 24.80, uaeMarket: 24.96, fluctuation:  0.00 },
    { t: 'Feb 10', benchmark: 25.40, uaeMarket: 25.58, fluctuation: +0.62 },
    { t: 'Feb 20', benchmark: 26.00, uaeMarket: 26.18, fluctuation: +0.60 },
    { t: 'Mar 1',  benchmark: 26.60, uaeMarket: 26.78, fluctuation: +0.60 },
    { t: 'Mar 10', benchmark: 27.20, uaeMarket: 27.38, fluctuation: +0.60 },
    { t: 'Mar 20', benchmark: 27.80, uaeMarket: 27.96, fluctuation: +0.58 },
    { t: 'Apr 1',  benchmark: 27.80, uaeMarket: 27.94, fluctuation: -0.02 },
    { t: 'Apr 10', benchmark: 28.62, uaeMarket: 28.78, fluctuation: +0.84 },
    { t: 'Apr 20', benchmark: 29.10, uaeMarket: 29.26, fluctuation: +0.48 },
    { t: 'Apr 30', benchmark: 29.68, uaeMarket: 29.84, fluctuation: +0.58 },
  ],
  '6M': [
    { t: 'Nov 1',  benchmark: 21.40, uaeMarket: 21.54, fluctuation:  0.00 },
    { t: 'Nov 15', benchmark: 22.10, uaeMarket: 22.26, fluctuation: +0.72 },
    { t: 'Dec 1',  benchmark: 22.90, uaeMarket: 23.06, fluctuation: +0.80 },
    { t: 'Dec 15', benchmark: 23.60, uaeMarket: 23.78, fluctuation: +0.72 },
    { t: 'Jan 1',  benchmark: 24.20, uaeMarket: 24.38, fluctuation: +0.60 },
    { t: 'Jan 15', benchmark: 24.80, uaeMarket: 24.96, fluctuation: +0.58 },
    { t: 'Feb 1',  benchmark: 24.80, uaeMarket: 24.96, fluctuation:  0.00 },
    { t: 'Feb 15', benchmark: 25.70, uaeMarket: 25.88, fluctuation: +0.92 },
    { t: 'Mar 1',  benchmark: 26.60, uaeMarket: 26.78, fluctuation: +0.90 },
    { t: 'Mar 15', benchmark: 27.40, uaeMarket: 27.58, fluctuation: +0.80 },
    { t: 'Apr 1',  benchmark: 27.80, uaeMarket: 27.94, fluctuation: +0.36 },
    { t: 'Apr 15', benchmark: 28.88, uaeMarket: 29.04, fluctuation: +1.10 },
    { t: 'Apr 30', benchmark: 29.68, uaeMarket: 29.84, fluctuation: +0.80 },
  ],
  '1Y': [
    { t: 'May 25', benchmark: 18.20, uaeMarket: 18.34, fluctuation:  0.00 },
    { t: 'Jun 25', benchmark: 18.80, uaeMarket: 18.96, fluctuation: +0.62 },
    { t: 'Jul 25', benchmark: 19.40, uaeMarket: 19.56, fluctuation: +0.60 },
    { t: 'Aug 25', benchmark: 19.90, uaeMarket: 20.06, fluctuation: +0.50 },
    { t: 'Sep 25', benchmark: 19.20, uaeMarket: 19.36, fluctuation: -0.70 },
    { t: 'Oct 25', benchmark: 20.00, uaeMarket: 20.18, fluctuation: +0.82 },
    { t: 'Nov 25', benchmark: 21.40, uaeMarket: 21.54, fluctuation: +1.36 },
    { t: 'Dec 25', benchmark: 23.60, uaeMarket: 23.78, fluctuation: +2.24 },
    { t: 'Jan 26', benchmark: 24.20, uaeMarket: 24.38, fluctuation: +0.60 },
    { t: 'Feb 26', benchmark: 24.80, uaeMarket: 24.96, fluctuation: +0.58 },
    { t: 'Mar 26', benchmark: 26.60, uaeMarket: 26.78, fluctuation: +1.82 },
    { t: 'Apr 26', benchmark: 29.68, uaeMarket: 29.84, fluctuation: +3.06 },
  ],
};

// ─── Benchmark deals (premium / discount vs LBMA fixing) ─────────────────────
// Live API: GET /api/v1/gold/deals/today

export const BENCHMARK_DEALS = [
  {
    id: 'TXN-8841', client: 'Fatima Al-Zahra', tier: 'Corporate',
    qty: 500,  unit: 'oz', fixRef: 'AM', baseFix: 2318.50,
    premium: +3.20, finalUSD: 2321.70,
    finalAED: +(2321.70 * 3.6725).toFixed(2),
    totalUSD: +(2321.70 * 500).toFixed(0),
    status: 'Premium', time: '11:14 AM',
  },
  {
    id: 'TXN-8842', client: 'Marcus Weber', tier: 'Corporate',
    qty: 1200, unit: 'oz', fixRef: 'PM', baseFix: 2321.75,
    premium: -1.50, finalUSD: 2320.25,
    finalAED: +(2320.25 * 3.6725).toFixed(2),
    totalUSD: +(2320.25 * 1200).toFixed(0),
    status: 'Discount', time: '03:22 PM',
  },
  {
    id: 'TXN-8843', client: 'Hassan Al-Mahmoud', tier: 'HNI',
    qty: 80,   unit: 'oz', fixRef: 'AM', baseFix: 2318.50,
    premium: +5.75, finalUSD: 2324.25,
    finalAED: +(2324.25 * 3.6725).toFixed(2),
    totalUSD: +(2324.25 * 80).toFixed(0),
    status: 'Premium', time: '10:48 AM',
  },
  {
    id: 'TXN-8844', client: 'Priya Sharma', tier: 'HNI',
    qty: 320,  unit: 'oz', fixRef: 'PM', baseFix: 2321.75,
    premium: 0.00, finalUSD: 2321.75,
    finalAED: +(2321.75 * 3.6725).toFixed(2),
    totalUSD: +(2321.75 * 320).toFixed(0),
    status: 'At Fix', time: '03:05 PM',
  },
  {
    id: 'TXN-8845', client: 'John Stevens', tier: 'Retail',
    qty: 20,   unit: 'oz', fixRef: 'AM', baseFix: 2318.50,
    premium: -2.80, finalUSD: 2315.70,
    finalAED: +(2315.70 * 3.6725).toFixed(2),
    totalUSD: +(2315.70 * 20).toFixed(0),
    status: 'Discount', time: '11:52 AM',
  },
];