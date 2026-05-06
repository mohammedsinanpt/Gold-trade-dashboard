// src/data/revenueAnalyticsMockData.js
// Page-specific mock data for RevenueAnalytics.jsx
// Delete this file only after real API is confirmed working for this page.

import { C } from '../constants/tokens';

export const KPI_CARDS = [
  {
    id: 'today',
    label: 'Today',
    value: '$420k',
    sub: 'vs $375k yesterday',
    trend: '+12%',
    up: true,
    iconColor: 'bg-indigo-50 text-indigo-600',
    hoverColor: 'group-hover:bg-indigo-100',
    icon: 'DollarSign',
  },
  {
    id: 'week',
    label: 'This Week',
    value: '$2.1M',
    sub: 'Mon–Fri rolling',
    trend: '+9%',
    up: true,
    iconColor: 'bg-sky-50 text-sky-500',
    hoverColor: 'group-hover:bg-sky-100',
    icon: 'BarChart3',
  },
  {
    id: 'month',
    label: 'This Month',
    value: '$8.4M',
    sub: 'vs $7.1M last month',
    trend: '+18%',
    up: true,
    iconColor: 'bg-emerald-50 text-emerald-500',
    hoverColor: 'group-hover:bg-emerald-100',
    icon: 'Calendar',
  },
  {
    id: 'quarter',
    label: 'This Quarter',
    value: '$24.6M',
    sub: 'Q1 2026 • on track',
    trend: '+21%',
    up: true,
    iconColor: 'bg-amber-50 text-amber-500',
    hoverColor: 'group-hover:bg-amber-100',
    icon: 'Target',
  },
];

export const YTD_CARD = {
  value: '$42.8M',
  trend: '+24.2% YoY',
  sub: "vs $34.5M Jan–Apr '25",
};

export const VOLUME_TILES = [
  { label: 'Gold Sold Today', value: '18.4 KG',   sub: '591 troy oz',    icon: '🥇', color: 'bg-amber-50 border-amber-100',    txt: 'text-amber-700'   },
  { label: 'Gold This Month', value: '284 KG',     sub: '9,131 troy oz',  icon: '📦', color: 'bg-slate-50 border-slate-100',    txt: 'text-slate-700'   },
  { label: 'Silver Today',    value: '142 KG',     sub: '4,563 troy oz',  icon: '🥈', color: 'bg-slate-50 border-slate-100',    txt: 'text-slate-500'   },
  { label: 'Active Spot',     value: '$3,284/oz',  sub: 'XAU/USD live',   icon: '📈', color: 'bg-emerald-50 border-emerald-100', txt: 'text-emerald-700' },
];

export const YOY_COMPARISONS = [
  { label: 'vs Last Month',     val: '+18%',      up: true },
  { label: "vs Same Month '25", val: '+24.2%',    up: true },
  { label: "Best Month ('26)",  val: 'Oct $1.1M', up: true },
];

export const CHANNELS = [
  { ch: 'Walk-in',      rev: '$3.2M', pct: 38, color: 'bg-indigo-600' },
  { ch: 'App',          rev: '$2.1M', pct: 25, color: 'bg-indigo-400' },
  { ch: 'Phone / Call', rev: '$1.8M', pct: 21, color: 'bg-sky-500'    },
  { ch: 'E-commerce',   rev: '$1.3M', pct: 16, color: 'bg-emerald-500'},
];

export const PRODUCT_MARGIN = [
  { cat: 'Bullion Bars', rev: '$5.4M', pct: 64, margin: 8.4,  color: C.indigo,   bg: 'bg-indigo-600' },
  { cat: 'Coins',        rev: '$0.8M', pct: 10, margin: 12.1, color: C.sky,      bg: 'bg-sky-500'    },
  { cat: 'Rounds',       rev: '$0.4M', pct: 5,  margin: 6.8,  color: C.indigoLt, bg: 'bg-indigo-300' },
];

export const CUSTOMER_TIERS = [
  { tier: 'Corporate & Bulk', rev: '$4.2M', pct: 50, color: 'bg-sky-500',   count: '18 clients'  },
  { tier: 'HNI',              rev: '$3.0M', pct: 36, color: 'bg-indigo-500', count: '47 clients' },
  { tier: 'Retail',           rev: '$1.2M', pct: 14, color: 'bg-slate-400', count: '312 clients' },
];

export const DEAL_SUMMARY_STATS = [
  { label: '🏆 Highest Deal (Month)',  value: '$850k — Marcus Weber' },
  { label: '📊 Avg Transaction Value', value: '$125,000'             },
  { label: '⚡ Transactions Today',    value: '34 deals'             },
  { label: '🏢 Revenue / Sq Ft',       value: '$2,840 / sqft'        },
];

export const TOP_CLIENTS_10 = [
  { rank: 1,  name: 'Marcus Weber',       city: 'Dubai',      tier: 'Corporate', revenue: '$850k', txCount: 12, lastTx: '2 hrs ago',  growth: '+18%' },
  { rank: 2,  name: 'Priya Kapoor',       city: 'Mumbai',     tier: 'HNI',       revenue: '$620k', txCount: 9,  lastTx: 'Yesterday',   growth: '+11%' },
  { rank: 3,  name: 'Al Farsi Holdings',  city: 'Abu Dhabi',  tier: 'Corporate', revenue: '$540k', txCount: 6,  lastTx: '3 days ago',  growth: '+27%' },
  { rank: 4,  name: 'Chen Wei',           city: 'Singapore',  tier: 'HNI',       revenue: '$390k', txCount: 14, lastTx: '5 hrs ago',   growth: '+9%'  },
  { rank: 5,  name: 'Lena Müller',        city: 'Zurich',     tier: 'HNI',       revenue: '$310k', txCount: 7,  lastTx: 'Today',       growth: '+14%' },
  { rank: 6,  name: 'Gulf Star LLC',      city: 'Riyadh',     tier: 'Corporate', revenue: '$280k', txCount: 4,  lastTx: '1 week ago',  growth: '+6%'  },
  { rank: 7,  name: 'Raj Malhotra',       city: 'Delhi',      tier: 'HNI',       revenue: '$240k', txCount: 11, lastTx: '2 days ago',  growth: '-2%'  },
  { rank: 8,  name: 'Nour Al-Hassan',     city: 'Kuwait',     tier: 'HNI',       revenue: '$195k', txCount: 8,  lastTx: 'Today',       growth: '+22%' },
  { rank: 9,  name: 'Sunrise Imports',    city: 'Hong Kong',  tier: 'Corporate', revenue: '$160k', txCount: 3,  lastTx: '4 days ago',  growth: '+5%'  },
  { rank: 10, name: 'Sophie Bernard',     city: 'Geneva',     tier: 'Retail',    revenue: '$98k',  txCount: 19, lastTx: 'Yesterday',   growth: '+31%' },
];

export const DAILY_TX_DATA = [
  { day: 'Mon', txns: 28, revenue: 3.8 },
  { day: 'Tue', txns: 34, revenue: 4.5 },
  { day: 'Wed', txns: 29, revenue: 3.6 },
  { day: 'Thu', txns: 41, revenue: 5.2 },
  { day: 'Fri', txns: 38, revenue: 5.8 },
  { day: 'Sat', txns: 52, revenue: 7.1 },
  { day: 'Sun', txns: 34, revenue: 4.2 },
];

export const DAILY_TX_STATS = [
  { label: 'Avg/Day',     val: '36.6'      },
  { label: 'Peak Day',    val: 'Saturday'  },
  { label: 'Deals Today', val: '34'        },
  { label: 'Avg Value',   val: '$125k'     },
];

export const DEAL_METRICS = {
  topDeal: {
    amount: '$850,000',
    client: 'Marcus Weber · Dubai',
    detail: "100 KG Bullion Bars — 14 Apr '26",
  },
  marginByCategory: [
    { cat: 'Coins',  margin: 12.1, color: 'bg-sky-500'    },
    { cat: 'Bars',   margin: 8.4,  color: 'bg-indigo-600' },
    { cat: 'Rounds', margin: 6.8,  color: 'bg-indigo-300' },
  ],
  summaryStats: [
    { label: 'Avg Transaction', value: '$125,000', accent: null               },
    { label: 'Highest (Month)', value: '$850,000', accent: null               },
    { label: 'Avg Margin',      value: '9.1%',     accent: 'text-emerald-600' },
    { label: 'Close Rate',      value: '72%',      accent: 'text-indigo-600'  },
  ],
};

export const KG_MONTHLY = [
  { n: 'Jan', kg: 180 }, { n: 'Feb', kg: 210 }, { n: 'Mar', kg: 195 },
  { n: 'Apr', kg: 240 }, { n: 'May', kg: 225 }, { n: 'Jun', kg: 268 },
  { n: 'Jul', kg: 252 }, { n: 'Aug', kg: 291 }, { n: 'Sep', kg: 280 },
  { n: 'Oct', kg: 310 }, { n: 'Nov', kg: 298 }, { n: 'Dec', kg: 284 },
];

export const KG_SUMMARY_STATS = [
  { label: 'Total YTD',  val: '2,813 KG'   },
  { label: 'Peak Month', val: 'Oct 310 KG' },
  { label: 'MoM Change', val: '+4.3%'      },
];

export const SPOT_SCENARIOS = [
  { s: 'Gold +5%',  revImpact: '+$1.2M', volImpact: '−4% vol',  revUp: true  },
  { s: 'Gold −5%',  revImpact: '−$1.2M', volImpact: '+5% vol',  revUp: false },
  { s: 'Gold +10%', revImpact: '+$2.8M', volImpact: '−9% vol',  revUp: true  },
  { s: 'Gold −10%', revImpact: '−$2.8M', volImpact: '+11% vol', revUp: false },
  { s: 'Gold +15%', revImpact: '+$4.5M', volImpact: '−15% vol', revUp: true  },
  { s: 'Gold −15%', revImpact: '−$4.5M', volImpact: '+18% vol', revUp: false },
];

export const SPOT_SENSITIVITY = [
  { label: 'Revenue Sensitivity', val: '$240k / 1%', accent: 'text-emerald-400' },
  { label: 'Volume Sensitivity',  val: '−0.9% / 1%', accent: 'text-sky-400'    },
];

// ── Bullion Certification Board ────────────────────────────
// Strictly bullion deals only. 47 total this month, 4 currently blocked.

export const CERT_KPI = [
  {
    label: 'Bullion Volume',
    value: '214 KG',
    sub: '6,878 troy oz · bullion only',
    icon: '🏅',
    color: 'bg-amber-50 border-amber-100',
    txt: 'text-amber-700',
  },
  {
    label: 'Certification Rate',
    value: '94.2%',
    sub: '0.8 pts below 95% target',
    icon: '✅',
    color: 'bg-indigo-50 border-indigo-100',
    txt: 'text-indigo-700',
  },
  {
    label: 'Certified Value',
    value: '$7.9M',
    sub: 'of $8.4M bullion revenue',
    icon: '🔒',
    color: 'bg-emerald-50 border-emerald-100',
    txt: 'text-emerald-700',
  },
  {
    label: 'Pending / Blocked',
    value: '$486k',
    sub: '4 deals need action',
    icon: '⏳',
    color: 'bg-rose-50 border-rose-100',
    txt: 'text-rose-700',
  },
];

// Every bullion brand traded this month with volume, purity, type, LBMA status.
// Local UAE is non-LBMA → flags manual review immediately.
export const BRAND_DATA = [
  {
    brand: 'PAMP Suisse',
    origin: 'Switzerland',
    type: 'Minted',
    purity: '999.9',
    volume: '68 KG',
    volumeKg: 68,
    lbma: true,
    status: 'pass',
    deals: 18,
  },
  {
    brand: 'Valcambi',
    origin: 'Switzerland',
    type: 'Minted',
    purity: '999.9',
    volume: '54 KG',
    volumeKg: 54,
    lbma: true,
    status: 'pass',
    deals: 14,
  },
  {
    brand: 'Emirates Gold',
    origin: 'UAE',
    type: 'Cast',
    purity: '999.5',
    volume: '42 KG',
    volumeKg: 42,
    lbma: true,
    status: 'pass',
    deals: 9,
  },
  {
    brand: 'Al Etihad Gold',
    origin: 'UAE',
    type: 'Cast',
    purity: '995.0',
    volume: '28 KG',
    volumeKg: 28,
    lbma: true,
    status: 'pass',
    deals: 6,
  },
  {
    brand: 'Local UAE',
    origin: 'UAE',
    type: 'Cast',
    purity: '916.0',
    volume: '22 KG',
    volumeKg: 22,
    lbma: false,
    status: 'review',
    deals: 3,
    // Non-LBMA: below 995 purity threshold — triggers mandatory senior review
    flag: 'Non-LBMA · Purity below 995 std — Senior review required',
  },
];

// 8 rules that run automatically on every bullion deal.
// Fix window breach (rule 6) and premium cap (rule 7) are the two currently failing.
// Those failing deals surface directly in BLOCKED_DEALS below.
export const CERT_RULES = [
  { rule: 'LBMA-accredited brand',       pass: true,  count: '43/47', detail: 'Non-LBMA brands route to manual review'     },
  { rule: 'Purity ≥ 995.0 (std bars)',   pass: true,  count: '41/47', detail: 'Sub-standard purity requires assay override' },
  { rule: 'Weight tolerance ±0.1g',      pass: true,  count: '47/47', detail: 'All bars within tolerance this month'        },
  { rule: 'Assay certificate attached',  pass: true,  count: '47/47', detail: 'All deals have valid assay docs'             },
  { rule: 'Serial number logged',        pass: true,  count: '47/47', detail: 'Full serial traceability confirmed'          },
  { rule: 'Fix window ≤ 5 min',          pass: false, count: '44/47', detail: '3 deals exceeded the AM/PM fix window'      },
  { rule: 'Premium cap ≤ 1.5%',          pass: false, count: '45/47', detail: '2 deals priced above the 1.5% cap'         },
  { rule: 'Senior sign-off ≥ $500k',     pass: true,  count: '12/12', detail: 'All large deals have senior approval'       },
];

// Daily cert rate (%) vs certified value ($M) across April.
// Dashed reference line in chart = 95% target.
export const CERT_TIMELINE = [
  { date: 'Apr 1',  rate: 91, value: 0.28 },
  { date: 'Apr 3',  rate: 93, value: 0.31 },
  { date: 'Apr 5',  rate: 90, value: 0.26 },
  { date: 'Apr 8',  rate: 95, value: 0.38 },
  { date: 'Apr 10', rate: 96, value: 0.41 },
  { date: 'Apr 12', rate: 94, value: 0.35 },
  { date: 'Apr 15', rate: 97, value: 0.44 },
  { date: 'Apr 17', rate: 93, value: 0.32 },
  { date: 'Apr 20', rate: 95, value: 0.39 },
  { date: 'Apr 22', rate: 92, value: 0.29 },
  { date: 'Apr 24', rate: 94, value: 0.36 },
  { date: 'Apr 26', rate: 94, value: 0.34 },
  { date: 'Apr 28', rate: 95, value: 0.40 },
  { date: 'Apr 30', rate: 94, value: 0.37 },
];

export const CERT_SUMMARY_STATS = [
  { label: 'Total Bullion Deals', value: '47 deals', accent: null               },
  { label: 'Auto-certified',      value: '41 deals', accent: 'text-emerald-600' },
  { label: 'Manual Review',       value: '2 deals',  accent: 'text-amber-600'   },
  { label: 'Blocked',             value: '4 deals',  accent: 'text-rose-500'    },
  { label: 'Certified Value',     value: '$7.9M',    accent: 'text-indigo-600'  },
  { label: 'Blocked Value',       value: '$486k',    accent: 'text-rose-500'    },
  { label: 'Avg Cert Time',       value: '4.2 min',  accent: null               },
  { label: 'SLA Breach Rate',     value: '6.4%',     accent: 'text-amber-600'   },
];

// Only the 4 bullion deals currently blocked from certification.
// Fix window breach and premium cap are the two rule failures.
// Non-LBMA brand (Local UAE) and senior sign-off are the other two blockers.
export const BLOCKED_DEALS = [
  {
    id: 'BUL-2841',
    client: 'Al Farsi Holdings',
    brand: 'PAMP Suisse',
    kg: '12 KG',
    value: '$124k',
    issue: 'Fix Window Breach',
    issueDetail: 'Priced 8 min after AM fix — 3 min over limit',
    severity: 'high',
    action: 'Re-fix Price',
    ruleRef: 'Rule 6',
  },
  {
    id: 'BUL-2839',
    client: 'Marcus Weber',
    brand: 'Valcambi',
    kg: '8 KG',
    value: '$82k',
    issue: 'Premium Cap Exceeded',
    issueDetail: 'Premium at 1.8% — 0.3% above 1.5% cap',
    severity: 'high',
    action: 'Adjust Premium',
    ruleRef: 'Rule 7',
  },
  {
    id: 'BUL-2835',
    client: 'Gulf Star LLC',
    brand: 'Local UAE',
    kg: '22 KG',
    value: '$218k',
    issue: 'Non-LBMA Brand',
    issueDetail: 'Local UAE cast bar — purity 916, non-accredited',
    severity: 'medium',
    action: 'Manual Review',
    ruleRef: 'Rule 1',
  },
  {
    id: 'BUL-2830',
    client: 'Nour Al-Hassan',
    brand: 'Emirates Gold',
    kg: '6 KG',
    value: '$62k',
    issue: 'Senior Sign-off Req.',
    issueDetail: 'Deal value $62k — threshold crossed, awaiting GM',
    severity: 'low',
    action: 'Request Approval',
    ruleRef: 'Rule 8',
  },
];

export const CERT_CONFIG = {
  currentRate:  94.2,
  targetRate:   95,
  daysLeft:     2,
  blockedValue: '$486k',
  blockedCount: 4,
};