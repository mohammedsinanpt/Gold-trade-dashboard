import React, { useState } from 'react';
import {
  DollarSign, BarChart3, TrendingUp, TrendingDown,
  Award, Users, Zap, Package, Calendar, Activity,
  ArrowUpRight, ArrowDownRight, Target, Star
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line,
  ComposedChart, RadialBarChart, RadialBar, Cell, PieChart, Pie,
  Legend,
} from 'recharts';

import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { revData, TOP_CLIENTS } from '../data/mockData';

/* ─── Design tokens ──────────────────────────────────────── */
const C = {
  indigo:   '#4F46E5',
  indigoLt: '#818CF8',
  sky:      '#0EA5E9',
  emerald:  '#10B981',
  amber:    '#F59E0B',
  rose:     '#F43F5E',
  slate8:   '#1E293B',
  slate6:   '#475569',
  slate4:   '#94A3B8',
  slate1:   '#F8FAFC',
};

const tipStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 700,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
};

/* ─── Helpers ────────────────────────────────────────────── */
const Chip = ({ up, children }) => (
  <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full
    ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
    {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
    {children}
  </span>
);

const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400 mb-4">{children}</p>
);

const StatRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-[10px] font-bold text-slate-400">{label}</span>
    <span className={`text-[11px] font-black ${accent || 'text-indigo-600'}`}>{value}</span>
  </div>
);

/* ─── Extended mock data ─────────────────────────────────── */
const TOP_CLIENTS_10 = [
  { rank: 1,  name: 'Marcus Weber',       city: 'Dubai',     tier: 'Corporate', revenue: '$850k',  txCount: 12, lastTx: '2 hrs ago',   growth: '+18%' },
  { rank: 2,  name: 'Priya Kapoor',       city: 'Mumbai',    tier: 'HNI',       revenue: '$620k',  txCount: 9,  lastTx: 'Yesterday',    growth: '+11%' },
  { rank: 3,  name: 'Al Farsi Holdings',  city: 'Abu Dhabi', tier: 'Corporate', revenue: '$540k',  txCount: 6,  lastTx: '3 days ago',   growth: '+27%' },
  { rank: 4,  name: 'Chen Wei',           city: 'Singapore', tier: 'HNI',       revenue: '$390k',  txCount: 14, lastTx: '5 hrs ago',    growth: '+9%'  },
  { rank: 5,  name: 'Lena Müller',        city: 'Zurich',    tier: 'HNI',       revenue: '$310k',  txCount: 7,  lastTx: 'Today',        growth: '+14%' },
  { rank: 6,  name: 'Gulf Star LLC',      city: 'Riyadh',    tier: 'Corporate', revenue: '$280k',  txCount: 4,  lastTx: '1 week ago',   growth: '+6%'  },
  { rank: 7,  name: 'Raj Malhotra',       city: 'Delhi',     tier: 'HNI',       revenue: '$240k',  txCount: 11, lastTx: '2 days ago',   growth: '-2%'  },
  { rank: 8,  name: 'Nour Al-Hassan',     city: 'Kuwait',    tier: 'HNI',       revenue: '$195k',  txCount: 8,  lastTx: 'Today',        growth: '+22%' },
  { rank: 9,  name: 'Sunrise Imports',    city: 'Hong Kong', tier: 'Corporate', revenue: '$160k',  txCount: 3,  lastTx: '4 days ago',   growth: '+5%'  },
  { rank: 10, name: 'Sophie Bernard',     city: 'Geneva',    tier: 'Retail',    revenue: '$98k',   txCount: 19, lastTx: 'Yesterday',    growth: '+31%' },
];

const DAILY_TX_DATA = [
  { day: 'Mon', txns: 28, revenue: 3.8 },
  { day: 'Tue', txns: 34, revenue: 4.5 },
  { day: 'Wed', txns: 29, revenue: 3.6 },
  { day: 'Thu', txns: 41, revenue: 5.2 },
  { day: 'Fri', txns: 38, revenue: 5.8 },
  { day: 'Sat', txns: 52, revenue: 7.1 },
  { day: 'Sun', txns: 34, revenue: 4.2 },
];

const KG_MONTHLY = [
  { n: 'Jan', kg: 180 }, { n: 'Feb', kg: 210 }, { n: 'Mar', kg: 195 },
  { n: 'Apr', kg: 240 }, { n: 'May', kg: 225 }, { n: 'Jun', kg: 268 },
  { n: 'Jul', kg: 252 }, { n: 'Aug', kg: 291 }, { n: 'Sep', kg: 280 },
  { n: 'Oct', kg: 310 }, { n: 'Nov', kg: 298 }, { n: 'Dec', kg: 284 },
];

const PRODUCT_MARGIN = [
  { cat: 'Bullion Bars', rev: '$5.4M', pct: 64, margin: 8.4,  color: C.indigo,   bg: 'bg-indigo-600' },
  { cat: 'Coins',        rev: '$0.8M', pct: 10, margin: 12.1, color: C.sky,      bg: 'bg-sky-500'    },
  { cat: 'Rounds',       rev: '$0.4M', pct: 5,  margin: 6.8,  color: C.indigoLt, bg: 'bg-indigo-300' },
];

/* ─── Radial progress ring ───────────────────────────────── */
const Ring = ({ pct, color, size = 56 }) => {
  const r = 22, cx = 28, cy = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={5} />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={10} fontWeight={900} fill={color}>{pct}%</text>
    </svg>
  );
};

/* ══════════════════════════════════════════════════════════ */
const RevenueAnalytics = () => {
  const [activePeriod, setActivePeriod] = useState('month');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── 1. KPI METRIC CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <DollarSign size={16} className="text-indigo-600" />
            </div>
            <Chip up>+12%</Chip>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today</p>
          <p className="text-xl font-black text-slate-800">$420k</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">vs $375k yesterday</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <BarChart3 size={16} className="text-sky-500" />
            </div>
            <Chip up>+9%</Chip>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">This Week</p>
          <p className="text-xl font-black text-slate-800">$2.1M</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Mon–Fri rolling</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Calendar size={16} className="text-emerald-500" />
            </div>
            <Chip up>+18%</Chip>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">This Month</p>
          <p className="text-xl font-black text-slate-800">$8.4M</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">vs $7.1M last month</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Target size={16} className="text-amber-500" />
            </div>
            <Chip up>+21%</Chip>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">This Quarter</p>
          <p className="text-xl font-black text-slate-800">$24.6M</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1">Q1 2026 • on track</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
              <ArrowUpRight size={10} />+24.2% YoY
            </span>
          </div>
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">YTD 2026</p>
          <p className="text-xl font-black text-white">$42.8M</p>
          <p className="text-[10px] font-bold text-indigo-300 mt-1">vs $34.5M Jan–Apr '25</p>
        </div>
      </div>

      {/* ── 2. GOLD VOLUME SNAPSHOT (TODAY + MONTHLY) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: 'Gold Sold Today', value: '18.4 KG', sub: '591 troy oz', icon: '🥇', color: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100', txt: 'text-amber-700' },
          { label: 'Gold This Month', value: '284 KG',  sub: '9,131 troy oz', icon: '📦', color: 'bg-slate-50 border-slate-100', iconBg: 'bg-slate-100', txt: 'text-slate-700' },
          { label: 'Silver Today',    value: '142 KG',  sub: '4,563 troy oz', icon: '🥈', color: 'bg-slate-50 border-slate-100', iconBg: 'bg-slate-100', txt: 'text-slate-500' },
          { label: 'Active Spot',     value: '$3,284/oz',sub: 'XAU/USD live', icon: '📈', color: 'bg-emerald-50 border-emerald-100', iconBg: 'bg-emerald-100', txt: 'text-emerald-700' },
        ].map(m => (
          <div key={m.label} className={`${m.color} border rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 ${m.iconBg} rounded-xl flex items-center justify-center text-xl`}>{m.icon}</div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
              <p className={`text-lg font-black ${m.txt}`}>{m.value}</p>
              <p className="text-[10px] font-bold text-slate-400">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. REVENUE TREND + YoY COMPARISON ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-slate-800">Revenue Trend</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">12-Month Performance vs Same Month Last Year</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-600 rounded-full inline-block" />2026</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-300 rounded-full inline-block border-dashed" />2025</span>
            </div>
          </div>
          <div className="px-6 py-4 h-60">
            <ResponsiveContainer>
              <ComposedChart data={revData}>
                <defs>
                  <linearGradient id="gCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.indigo} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="n" tick={{ fontSize: 10, fontWeight: 700, fill: C.slate4 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tipStyle} formatter={(v, name) => [`$${(v / 1000).toFixed(0)}k`, name === 'v' ? '2026' : '2025']} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Area type="monotone" dataKey="v"    stroke={C.indigo}  fill="url(#gCurr)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="prev" stroke={C.slate4}  strokeWidth={1.5} dot={false} strokeDasharray="4 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* YoY comparison strip */}
          <div className="px-6 pb-5 grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
            {[
              { label: 'vs Last Month',     val: '+18%', up: true },
              { label: 'vs Same Month \'25', val: '+24.2%', up: true },
              { label: 'Best Month (\'26)',   val: 'Oct $1.1M', up: true },
            ].map(c => (
              <div key={c.label} className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{c.label}</p>
                <Chip up={c.up}>{c.val}</Chip>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Channel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-black text-slate-800 mb-0.5">Revenue by Channel</p>
          <p className="text-[10px] font-bold text-slate-400 mb-5">Walk-in · App · Phone · E-com</p>
          <div className="space-y-4">
            {[
              { ch: 'Walk-in',       rev: '$3.2M', pct: 38, color: 'bg-indigo-600', dot: 'bg-indigo-600' },
              { ch: 'App',           rev: '$2.1M', pct: 25, color: 'bg-indigo-400', dot: 'bg-indigo-400' },
              { ch: 'Phone / Call',  rev: '$1.8M', pct: 21, color: 'bg-sky-500',    dot: 'bg-sky-500'    },
              { ch: 'E-commerce',    rev: '$1.3M', pct: 16, color: 'bg-emerald-500',dot: 'bg-emerald-500'},
            ].map(c => (
              <div key={c.ch}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className="text-[11px] font-bold text-slate-600">{c.ch}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-800">{c.rev}</span>
                    <span className="text-[9px] font-bold text-slate-400">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full transition-all duration-700`} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. PRODUCT TYPE + CUSTOMER TIER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Product Type (Bars, Coins, Rounds) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-black text-slate-800 mb-0.5">Revenue by Product Type</p>
          <p className="text-[10px] font-bold text-slate-400 mb-5">Bars · Coins · Rounds — with margin</p>
          <div className="space-y-5">
            {PRODUCT_MARGIN.map(r => (
              <div key={r.cat}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Ring pct={r.pct} color={r.color} size={44} />
                    <div>
                      <p className="text-[11px] font-black text-slate-700">{r.cat}</p>
                      <p className="text-[10px] font-bold text-slate-400">{r.rev}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Margin</p>
                    <span className="text-[13px] font-black text-emerald-600">{r.margin}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${r.bg} rounded-full`} style={{ width: `${r.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Tier */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-black text-slate-800 mb-0.5">Revenue by Customer Tier</p>
          <p className="text-[10px] font-bold text-slate-400 mb-5">Retail · HNI · Corporate</p>
          <div className="space-y-4 mb-5">
            {[
              { tier: 'Corporate & Bulk', rev: '$4.2M', pct: 50, color: 'bg-sky-500', count: '18 clients' },
              { tier: 'HNI',             rev: '$3.0M', pct: 36, color: 'bg-indigo-500', count: '47 clients' },
              { tier: 'Retail',          rev: '$1.2M', pct: 14, color: 'bg-slate-400', count: '312 clients' },
            ].map(t => (
              <div key={t.tier}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-[11px] font-bold text-slate-700">{t.tier}</p>
                    <p className="text-[9px] font-bold text-slate-400">{t.count}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-800">{t.rev}</span>
                    <span className="text-[9px] font-bold text-slate-400">{t.pct}%</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 space-y-0">
            <StatRow label="🏆 Highest Deal (Month)"      value="$850k — Marcus Weber" />
            <StatRow label="📊 Avg Transaction Value"      value="$125,000" />
            <StatRow label="⚡ Transactions Today"         value="34 deals" />
            <StatRow label="🏢 Revenue / Sq Ft"           value="$2,840 / sqft" />
          </div>
        </div>
      </div>

      {/* ── 5. DAILY TRANSACTIONS + DEAL METRICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Transactions per Day */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-black text-slate-800">Daily Transactions</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">Number of deals closed per day · This week</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-indigo-600 inline-block" />Transactions</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />Revenue ($M)</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <ComposedChart data={DAILY_TX_DATA} barCategoryGap="28%">
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700, fill: C.slate4 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left"  hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip contentStyle={tipStyle} formatter={(v, name) => [name === 'txns' ? `${v} deals` : `$${v}M`, name === 'txns' ? 'Transactions' : 'Revenue']} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Bar    yAxisId="left"  dataKey="txns"    fill={C.indigo}   radius={[6,6,0,0]} />
                <Line  yAxisId="right" dataKey="revenue" stroke={C.emerald} strokeWidth={2.5} dot={{ r: 4, fill: C.emerald, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[
              { label: 'Avg/Day', val: '36.6' },
              { label: 'Peak Day', val: 'Saturday' },
              { label: 'Deals Today', val: '34' },
              { label: 'Avg Value', val: '$125k' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deal Metrics + Top Rep */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-black text-slate-800 mb-0.5">Deal Metrics</p>
          <p className="text-[10px] font-bold text-slate-400 mb-4">Margin · Velocity · Top Rep</p>

          {/* Top rep highlight */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Star size={12} className="text-amber-900" fill="currentColor" />
              <p className="text-[9px] font-black text-amber-900 uppercase tracking-widest">Deal of the Month</p>
            </div>
            <p className="text-base font-black text-white">$850,000</p>
            <p className="text-[10px] font-black text-amber-100">Marcus Weber · Dubai</p>
            <p className="text-[10px] font-bold text-amber-200 mt-1">100 KG Bullion Bars — 14 Apr '26</p>
          </div>

          <div className="space-y-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Margin by Category</p>
            {[
              { cat: 'Coins',  margin: 12.1, color: 'bg-sky-500'    },
              { cat: 'Bars',   margin: 8.4,  color: 'bg-indigo-600' },
              { cat: 'Rounds', margin: 6.8,  color: 'bg-indigo-300' },
            ].map(m => (
              <div key={m.cat}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-600">{m.cat}</span>
                  <span className="text-[10px] font-black text-emerald-600">{m.margin}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${(m.margin / 20) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 space-y-0">
            <StatRow label="Avg Transaction"  value="$125,000" />
            <StatRow label="Highest (Month)"  value="$850,000" />
            <StatRow label="Avg Margin"       value="9.1%" accent="text-emerald-600" />
            <StatRow label="Close Rate"       value="72%" accent="text-indigo-600" />
          </div>
        </div>
      </div>

      {/* ── 6. TOP 10 CLIENTS ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-50">
          <div>
            <p className="text-sm font-black text-slate-800">Top 10 Clients by Revenue</p>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Ranked by total contribution this month</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <Users size={12} />
            <span>377 active clients</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {['Rank', 'Client', 'City', 'Tier', 'Revenue', 'Tx Count', 'Growth', 'Last Tx'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TOP_CLIENTS_10.map(c => (
                <tr key={c.rank} className="hover:bg-slate-50/70 transition-all group">
                  <td className="px-5 py-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black
                      ${c.rank === 1 ? 'bg-amber-100 text-amber-700' :
                        c.rank <= 3  ? 'bg-indigo-50 text-indigo-600' :
                                       'bg-slate-100 text-slate-500'}`}>
                      {c.rank === 1 ? '🥇' : c.rank === 2 ? '🥈' : c.rank === 3 ? '🥉' : c.rank}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-black text-slate-800">{c.name}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">{c.city}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[9px] font-black px-2 py-1 rounded-full
                      ${c.tier === 'HNI' ? 'bg-indigo-50 text-indigo-600' :
                        c.tier === 'Corporate' ? 'bg-sky-50 text-sky-600' :
                                                  'bg-slate-100 text-slate-500'}`}>
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-black text-indigo-600">{c.revenue}</td>
                  <td className="px-5 py-3.5 text-xs font-bold text-slate-600">{c.txCount} deals</td>
                  <td className="px-5 py-3.5">
                    <Chip up={!c.growth.startsWith('-')}>{c.growth}</Chip>
                  </td>
                  <td className="px-5 py-3.5 text-[10px] font-bold text-slate-400">{c.lastTx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 7. GOLD VOLUME CHART + SPOT PRICE IMPACT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-sm font-black text-slate-800 mb-0.5">Gold Volume Sold</p>
          <p className="text-[10px] font-bold text-slate-400 mb-4">KG per Month · 2026</p>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={KG_MONTHLY} barCategoryGap="30%">
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: C.slate4, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tipStyle} formatter={v => [`${v} KG`, 'Volume']} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Bar dataKey="kg" radius={[6,6,0,0]}>
                  {KG_MONTHLY.map((entry, index) => (
                    <Cell key={index} fill={index === KG_MONTHLY.length - 3 ? C.emerald : C.indigo} fillOpacity={0.8 + (index / KG_MONTHLY.length) * 0.2} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[
              { label: 'Total YTD',  val: '2,813 KG' },
              { label: 'Peak Month', val: 'Oct 310 KG' },
              { label: 'MoM Change', val: '+4.3%' },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-[11px] font-black text-slate-800 mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden relative">
          {/* background glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <p className="text-sm font-black text-white mb-0.5 relative">Gold Spot Price Impact</p>
          <p className="text-[10px] font-bold text-slate-400 mb-5 relative">Price movement vs Revenue & Volume</p>

          <div className="relative space-y-1">
            {[
              { s: 'Gold +5%',  revImpact: '+$1.2M',  volImpact: '−4% vol',  revUp: true  },
              { s: 'Gold −5%',  revImpact: '−$1.2M',  volImpact: '+5% vol',  revUp: false },
              { s: 'Gold +10%', revImpact: '+$2.8M',  volImpact: '−9% vol',  revUp: true  },
              { s: 'Gold −10%', revImpact: '−$2.8M',  volImpact: '+11% vol', revUp: false },
              { s: 'Gold +15%', revImpact: '+$4.5M',  volImpact: '−15% vol', revUp: true  },
              { s: 'Gold −15%', revImpact: '−$4.5M',  volImpact: '+18% vol', revUp: false },
            ].map(s => (
              <div key={s.s} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${s.revUp ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span className="text-xs font-bold text-slate-300">{s.s}</span>
                </div>
                <div className="flex items-center gap-5">
                  <span className={`text-xs font-black ${s.revUp ? 'text-emerald-400' : 'text-rose-400'}`}>{s.revImpact}</span>
                  <span className="text-[10px] font-bold text-slate-500 w-20 text-right">{s.volImpact}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Sensitivity</p>
              <p className="text-sm font-black text-emerald-400 mt-1">$240k / 1%</p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Volume Sensitivity</p>
              <p className="text-sm font-black text-sky-400 mt-1">−0.9% / 1%</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RevenueAnalytics;