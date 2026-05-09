// src/data/productMockData.js
// Page-specific mock data for ProductData (Dealings) page.
// Delete only after real API is confirmed working.

// ─── Metrics ──────────────────────────────────────────────────────────────────
export const mockMetrics = {
  totalKgMonth:       { value: '284 KG',    trend: '+9%',  sub: 'vs last month'              },
  todayVolume:        { value: '9.4 KG',    trend: '+4%',  sub: 'sold today'                 },
  totalRevMonth:      { value: 'AED 4.2M',  trend: '+12%', sub: '+12% vs last month'         },
  dealsMonth:         { value: '186',                      sub: '112 sell · 74 buy'           },
  pendingSettlement:  { value: '7 Deals',                  sub: 'AED 1.28M unsettled'        },
  avgPremium:         { value: '+2.4%',                    sub: 'over DGCX spot · sell-side' },
};

// ─── Hourly volume ────────────────────────────────────────────────────────────
export const mockHourly = [
  { h: '9am',  kg: 1.2 }, { h: '10am', kg: 2.1 }, { h: '11am', kg: 0.8 },
  { h: '12pm', kg: 1.6 }, { h: '1pm',  kg: 0.4 }, { h: '2pm',  kg: 1.8 },
  { h: '3pm',  kg: 1.5 },
];

// ─── Product types ────────────────────────────────────────────────────────────
export const mockProductTypes = [
  { type: 'Bars',   kg: 127, pct: 55, sub: '1g – 1 KG range'          },
  { type: 'Coins',  kg: 42,  pct: 27, sub: 'Commemorative & bullion'  },
  { type: 'Rounds', kg: 28,  pct: 18, sub: 'Investment & collectible' },
];

// ─── Revenue by product type ──────────────────────────────────────────────────
export const mockRevenueByType = [
  { type: 'Bars',   aed: 2100000, pct: 52 },
  { type: 'Coins',  aed: 1200000, pct: 30 },
  { type: 'Rounds', aed:  740000, pct: 18 },
];

// ─── Origins / brands ─────────────────────────────────────────────────────────
export const mockOrigins = [
  { brand: 'PAMP Suisse',   kg: '18.4', pct: 34, revenue: 'AED 1.84M', deals: 42, avgPremium: '+2.3%' },
  { brand: 'Valcambi',      kg: '14.2', pct: 28, revenue: 'AED 1.42M', deals: 31, avgPremium: '+1.8%' },
  { brand: 'Emirates Gold', kg: '10.1', pct: 19, revenue: 'AED 1.01M', deals: 24, avgPremium: '+0.9%' },
  { brand: 'Perth Mint',    kg: '6.8',  pct: 12, revenue: 'AED 680K',  deals: 18, avgPremium: '-0.4%' },
  { brand: 'Kaloti',        kg: '3.7',  pct:  7, revenue: 'AED 370K',  deals: 29, avgPremium: '-2.1%' },
];

// ─── Coin breakdown ───────────────────────────────────────────────────────────
export const mockCoins = [
  { name: 'Britannia',  mint: 'Royal Mint',   origin: 'UK',           kg: '18 KG', type: 'Bullion'       },
  { name: 'Krugerrand', mint: 'SA Mint',       origin: 'South Africa', kg: '12 KG', type: 'Bullion'       },
  { name: 'UAE Falcon', mint: 'Central Bank',  origin: 'UAE',          kg: '8 KG',  type: 'Commemorative' },
  { name: 'Kangaroo',   mint: 'Perth Mint',    origin: 'Australia',    kg: '4 KG',  type: 'Investment'    },
];

// ─── Monthly trend (enhanced with revenue) ────────────────────────────────────
export const mockMonthlyTrend = [
  { m: 'Jan', bars: 42, coins: 18, rounds: 11, revenue: 3.2 },
  { m: 'Feb', bars: 38, coins: 21, rounds:  9, revenue: 2.9 },
  { m: 'Mar', bars: 51, coins: 24, rounds: 14, revenue: 3.8 },
  { m: 'Apr', bars: 47, coins: 19, rounds: 12, revenue: 3.5 },
  { m: 'May', bars: 55, coins: 28, rounds: 16, revenue: 4.1 },
  { m: 'Jun', bars: 61, coins: 31, rounds: 18, revenue: 4.6 },
];

// ─── Products catalogue ───────────────────────────────────────────────────────
export const mockProducts = [
  {
    id: 'PRD-001', name: 'Bullion Bar (1 KG)',
    category: 'Bars', subCategory: '1 KG Bar', productType: 'Bars / Bullion',
    brand: 'PAMP Suisse', purity: '999.9', isScrap: false,
    today: '2.8 KG', month: '85 KG', rev: 'AED 5.4M', currency: 'AED/USD',
    side: 'Sell-Side', revShare: 38, premium: 6.80, spread: 1.40,
  },
  {
    id: 'PRD-002', name: 'Bullion Bar (100g)',
    category: 'Bars', subCategory: '100g Bar', productType: 'Bars / Bullion',
    brand: 'Valcambi', purity: '999.9', isScrap: false,
    today: '1.4 KG', month: '42 KG', rev: 'AED 2.7M', currency: 'AED',
    side: 'Sell-Side', revShare: 19, premium: 5.20, spread: 1.20,
  },
  {
    id: 'PRD-003', name: 'Commemorative Coin',
    category: 'Coins', subCategory: 'Commemorative', productType: 'Bars / Bullion',
    brand: 'Emirates Gold', purity: '999', isScrap: false,
    today: '0.9 KG', month: '28 KG', rev: 'AED 1.8M', currency: 'AED',
    side: 'Buy-Side', revShare: 13, premium: 3.60, spread: 0.90,
  },
  {
    id: 'PRD-004', name: 'Investment Round',
    category: 'Rounds', subCategory: 'Investment', productType: 'Bars / Bullion',
    brand: 'Perth Mint', purity: '999.9', isScrap: false,
    today: '0.6 KG', month: '18 KG', rev: 'AED 1.1M', currency: 'AED/USD',
    side: 'Buy-Side', revShare: 8, premium: -1.20, spread: 0.80,
  },
  {
    id: 'PRD-005', name: 'Scrap Gold (Mixed)',
    category: 'Scrap', subCategory: 'Mixed Scrap', productType: 'Scrap',
    brand: 'Kaloti', purity: '995', isScrap: true,
    today: '0.8 KG', month: '22 KG', rev: 'AED 0.9M', currency: 'AED',
    side: 'Buy-Side', revShare: 6, premium: null, spread: null,
  },
];

// ─── SKU Performance ranking ──────────────────────────────────────────────────
export const mockPerformance = [
  { sku: 'GLD-BAR-1KG',  name: 'Bullion Bar 1KG',  category: 'Bar',   revShare: 38, units: 85, rank: 1 },
  { sku: 'GLD-BAR-100G', name: 'Bullion Bar 100g',  category: 'Bar',   revShare: 19, units: 42, rank: 2 },
  { sku: 'COIN-BRIT',    name: 'Britannia Coin',    category: 'Coin',  revShare: 13, units: 28, rank: 3 },
  { sku: 'RND-INV-1OZ',  name: 'Investment Round',  category: 'Round', revShare: 8,  units: 18, rank: 4 },
];

// ─── Buy / Sell split ─────────────────────────────────────────────────────────
export const mockBuySell = {
  sell: { kg: '198 KG', pct: 70, deals: 198 },
  buy:  { kg: '86 KG',  pct: 30, deals: 86  },
};

// ─── Premium Intelligence ─────────────────────────────────────────────────────
export const mockPerDealPremium = [
  { deal: 'GD-1037', client: 'Al Futtaim Gold', baseValue: 1048000, premiumValue: 28400 },
  { deal: 'GD-1041', client: 'Emirates NBD',    baseValue:  812000, premiumValue: 19600 },
  { deal: 'GD-1038', client: 'Malabar Gold',    baseValue:  836000, premiumValue: 14800 },
  { deal: 'GD-1040', client: 'Damas LLC',       baseValue:  524000, premiumValue: 11200 },
  { deal: 'GD-1039', client: 'Joy Alukkas',     baseValue:  298000, premiumValue:  8600 },
];

export const mockPremiumSplit = {
  sell:  { aed: 54200, pct: 66 },
  buy:   { aed: 28400, pct: 34 },
  total: 82600,
};

export const mockScatterDeals = [
  { deal: 'GD-1037', client: 'Al Futtaim Gold', side: 'sell', spot: 285.4, premium: 8.2, kg: 3.6 },
  { deal: 'GD-1038', client: 'Malabar Gold',    side: 'sell', spot: 286.1, premium: 7.8, kg: 2.9 },
  { deal: 'GD-1041', client: 'Emirates NBD',    side: 'sell', spot: 284.8, premium: 9.1, kg: 2.8 },
  { deal: 'GD-1044', client: 'Damas LLC',       side: 'sell', spot: 287.2, premium: 6.4, kg: 2.2 },
  { deal: 'GD-1046', client: 'Joy Alukkas',     side: 'sell', spot: 285.9, premium: 8.8, kg: 1.8 },
  { deal: 'GD-1048', client: 'Kaloti',          side: 'sell', spot: 288.0, premium: 7.2, kg: 4.1 },
  { deal: 'GD-1039', client: 'Malabar Gold',    side: 'buy',  spot: 284.2, premium: 4.1, kg: 1.4 },
  { deal: 'GD-1040', client: 'Damas LLC',       side: 'buy',  spot: 283.8, premium: 3.8, kg: 1.8 },
  { deal: 'GD-1043', client: 'Emirates NBD',    side: 'buy',  spot: 285.0, premium: 4.6, kg: 2.1 },
  { deal: 'GD-1045', client: 'Al Futtaim Gold', side: 'buy',  spot: 284.5, premium: 3.2, kg: 1.2 },
];

// ─── Deal pipeline — committed vs settled ─────────────────────────────────────
export const mockPipelineData = [
  { day:'Apr 24', committed:8.4,  settledKg:6.1,  committedAed:2394000,  settledAed:1738000  },
  { day:'Apr 25', committed:9.1,  settledKg:7.4,  committedAed:2594350,  settledAed:2108900  },
  { day:'Apr 26', committed:7.8,  settledKg:6.8,  committedAed:2221300,  settledAed:1937200  },
  { day:'Apr 27', committed:10.2, settledKg:8.9,  committedAed:2906970,  settledAed:2535690  },
  { day:'Apr 28', committed:11.4, settledKg:9.6,  committedAed:3248490,  settledAed:2735040  },
  { day:'Apr 29', committed:9.8,  settledKg:8.2,  committedAed:2791690,  settledAed:2335420  },
  { day:'Apr 30', committed:12.1, settledKg:10.4, committedAed:3448285,  settledAed:2961640  },
  { day:'May 01', committed:10.6, settledKg:9.1,  committedAed:3019610,  settledAed:2591585  },
  { day:'May 02', committed:13.2, settledKg:11.8, committedAed:3760620,  settledAed:3361330  },
  { day:'May 03', committed:11.8, settledKg:10.2, committedAed:3361330,  settledAed:2906970  },
  { day:'May 04', committed:14.1, settledKg:12.6, committedAed:4017285,  settledAed:3589410  },
  { day:'May 05', committed:12.4, settledKg:11.1, committedAed:3532540,  settledAed:3162735  },
  { day:'May 06', committed:15.2, settledKg:13.4, committedAed:4330420,  settledAed:3816890  },
  { day:'May 07', committed:13.8, settledKg:11.9, committedAed:3931830,  settledAed:3390215  },
];

export const mockPipelineStats = {
  avgLagDays:    1.8,
  unsettledAed:  1280000,
  clearanceRate: 94.2,
};

// ─── Form option lists ────────────────────────────────────────────────────────
export const PRODUCT_TYPE_OPTIONS = ['Bars / Bullion', 'Scrap'];

export const CATEGORY_OPTIONS = {
  'Bars / Bullion': ['Bars', 'Coins', 'Rounds'],
  'Scrap':          ['Mixed Scrap', 'Hallmarked Scrap', 'Industrial Scrap'],
};

export const SUB_CATEGORY_OPTIONS = {
  'Bars':             ['1g Bar', '5g Bar', '10g Bar', '50g Bar', '100g Bar', '250g Bar', '500g Bar', '1 KG Bar'],
  'Coins':            ['Bullion Coin', 'Commemorative', 'Investment'],
  'Rounds':           ['Investment Round', 'Collectible Round'],
  'Mixed Scrap':      ['Gold Scrap', 'Silver Scrap'],
  'Hallmarked Scrap': ['UAE Hallmarked', 'International Hallmarked'],
  'Industrial Scrap': ['Electronic', 'Dental', 'Industrial'],
};

export const BRAND_OPTIONS  = ['PAMP Suisse', 'Valcambi', 'Emirates Gold', 'Perth Mint', 'Kaloti'];
export const PURITY_OPTIONS = ['999.9', '999', '995', '22K', '21K'];