// src/data/productMockData.js
// Delete this file only after the real API is confirmed working.

export const mockMetrics = {
  totalKgMonth: { value: '284 KG', trend: '+9%', sub: 'vs last month' },
  todayVolume:  { value: '9.4 KG', trend: '+4%', sub: 'sold today'    },
  bestSeller:   { value: '24K Bars',              sub: 'PAMP Swiss · 38% of revenue' },
  skusTracked:  { value: '48',                    sub: 'across all categories'        },
};

export const mockHourly = [
  { h: '9am',  kg: 1.2 }, { h: '10am', kg: 2.1 }, { h: '11am', kg: 0.8 },
  { h: '12pm', kg: 1.6 }, { h: '1pm',  kg: 0.4 }, { h: '2pm',  kg: 1.8 },
  { h: '3pm',  kg: 1.5 },
];

export const mockProductTypes = [
  { type: 'Bars',   kg: 127, pct: 55, sub: '1g – 1 KG range'          },
  { type: 'Coins',  kg: 42,  pct: 27, sub: 'Commemorative & bullion'  },
  { type: 'Rounds', kg: 28,  pct: 18, sub: 'Investment & collectible' },
];

export const mockOrigins = [
  { brand: 'PAMP (Swiss)', kg: '96 KG', pct: 34 },
  { brand: 'Valcambi',     kg: '68 KG', pct: 24 },
  { brand: 'Royal Mint',   kg: '42 KG', pct: 15 },
  { brand: 'Perth Mint',   kg: '36 KG', pct: 13 },
  { brand: 'Local UAE',    kg: '42 KG', pct: 14 },
];

export const mockCoins = [
  { name: 'Britannia',  mint: 'Royal Mint',  origin: 'UK',           kg: '18 KG', type: 'Bullion'       },
  { name: 'Krugerrand', mint: 'SA Mint',     origin: 'South Africa', kg: '12 KG', type: 'Bullion'       },
  { name: 'UAE Falcon', mint: 'Central Bank',origin: 'UAE',          kg: '8 KG',  type: 'Commemorative' },
  { name: 'Kangaroo',   mint: 'Perth Mint',  origin: 'Australia',    kg: '4 KG',  type: 'Investment'    },
];

export const mockMonthlyTrend = [
  { m: 'Oct', bars: 90,  coins: 28, rounds: 18 },
  { m: 'Nov', bars: 105, coins: 33, rounds: 22 },
  { m: 'Dec', bars: 98,  coins: 30, rounds: 20 },
  { m: 'Jan', bars: 112, coins: 38, rounds: 24 },
  { m: 'Feb', bars: 120, coins: 40, rounds: 26 },
  { m: 'Mar', bars: 127, coins: 42, rounds: 28 },
];

export const mockAvgDeal = [
  { label: 'Bar 1 KG',   aed: 285000, usd: 77600 },
  { label: 'Bar 100g',   aed: 28500,  usd: 7760  },
  { label: 'Coin',       aed: 6420,   usd: 1748  },
  { label: 'Inv. Round', aed: 3800,   usd: 1034  },
];

export const mockProducts = [
  { id:'PRD-001', name:'Bullion Bar (1 KG)',   category:'Bars',   subCategory:'1 KG Bar',    productType:'Bars / Bullion', brand:'PAMP (Swiss)', purity:'24K (99.9%)', isScrap:false, today:'2.8 KG', month:'85 KG',  rev:'$5.4M', currency:'AED/USD', side:'Sell-Side', revShare:38 },
  { id:'PRD-002', name:'Bullion Bar (100g)',   category:'Bars',   subCategory:'100g Bar',    productType:'Bars / Bullion', brand:'Valcambi',     purity:'24K (99.9%)', isScrap:false, today:'1.4 KG', month:'42 KG',  rev:'$2.7M', currency:'USD',     side:'Sell-Side', revShare:19 },
  { id:'PRD-003', name:'Commemorative Coin',   category:'Coins',  subCategory:'Commemorative',productType:'Bars / Bullion',brand:'Royal Mint',   purity:'24K (99.9%)', isScrap:false, today:'0.9 KG', month:'28 KG',  rev:'$1.8M', currency:'AED',     side:'Buy-Side',  revShare:13 },
  { id:'PRD-004', name:'Investment Round',     category:'Rounds', subCategory:'Investment',  productType:'Bars / Bullion', brand:'Perth Mint',   purity:'24K (99.9%)', isScrap:false, today:'0.6 KG', month:'18 KG',  rev:'$1.1M', currency:'USD',     side:'Buy-Side',  revShare:8  },
  { id:'PRD-005', name:'Scrap Gold (Mixed)',   category:'Scrap',  subCategory:'Mixed Scrap', productType:'Scrap',          brand:'Local UAE',    purity:'18K (75.0%)', isScrap:true,  today:'0.8 KG', month:'22 KG',  rev:'$0.9M', currency:'AED',     side:'Buy-Side',  revShare:6  },
];

export const mockPerformance = [
  { sku:'GLD-BAR-1KG',  name:'Bullion Bar 1KG',  category:'Bar',   revShare:38, units:85, rank:1 },
  { sku:'GLD-BAR-100G', name:'Bullion Bar 100g',  category:'Bar',   revShare:19, units:42, rank:2 },
  { sku:'COIN-BRIT',    name:'Britannia Coin',    category:'Coin',  revShare:13, units:28, rank:3 },
  { sku:'RND-INV-1OZ',  name:'Investment Round',  category:'Round', revShare:8,  units:18, rank:4 },
];

export const mockBuySell = {
  sell: { kg: '198 KG', pct: 70, deals: 198 },
  buy:  { kg: '86 KG',  pct: 30, deals: 86  },
  aedPct: 68, aedDeals: 194,
  usdPct: 32, usdDeals: 90,
  avgDealAed: 'AED 71,400',
  avgDealUsd: '$19,440',
};

// ── Form option lists (used by AddProductModal) ──────────────────────────────
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

export const BRAND_OPTIONS  = ['PAMP (Swiss)', 'Valcambi', 'Royal Mint', 'Perth Mint', 'Local UAE', 'SA Mint', 'Central Bank UAE', 'Italian'];
export const PURITY_OPTIONS = ['24K (99.9%)', '22K (91.6%)', '18K (75.0%)', '14K (58.5%)', '9K (37.5%)'];