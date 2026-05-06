// src/pages/RevenueAnalytics.jsx
// UI only. No data fetching here — all data comes from useRevenueAnalyticsData().
// To connect to a real backend: flip USE_MOCK in src/hooks/useRevenueAnalyticsData.js

import React, { useState } from 'react';
import {
  DollarSign, BarChart3, TrendingUp, Calendar, Target,
  Star, Users, ShieldCheck, CheckCircle2, XCircle,
  AlertTriangle, AlertCircle, Clock, FileCheck,
  ArrowUpRight, ArrowDownRight, Zap, Award, Lock,
  ChevronRight, Info, RefreshCw,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, Line,
  ComposedChart, Cell, ReferenceLine,
} from 'recharts';

import { useRevenueAnalyticsData } from '../hooks/useRevenueAnalyticsData';
import { C } from '../constants/tokens';

/* ─── Shared tooltip style ───────────────────────────────── */
const tipStyle = {
  background: '#fff',
  border: '1px solid #E2E8F0',
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 700,
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
};

/* ─── Micro-components ───────────────────────────────────── */
const Chip = ({ up, children }) => (
  <span className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full
    ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
    {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
    {children}
  </span>
);

const StatRow = ({ label, value, accent }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-[10px] font-bold text-slate-400">{label}</span>
    <span className={`text-[11px] font-black ${accent || 'text-indigo-600'}`}>{value}</span>
  </div>
);

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ title, sub }) => (
  <div className="mb-0.5">
    <p className="text-sm font-black text-slate-800">{title}</p>
    {sub && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

/* ─── Radial ring ────────────────────────────────────────── */
const Ring = ({ pct, color, size = 44 }) => {
  const r = 22, cx = 28, cy = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" className="shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F5F9" strokeWidth={5} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform="rotate(-90 28 28)"
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={10} fontWeight={900} fill={color}>{pct}%</text>
    </svg>
  );
};

/* ─── KPI icon map ───────────────────────────────────────── */
const ICON_MAP = { DollarSign, BarChart3, Calendar, Target, TrendingUp };

/* ─── Loading skeleton ───────────────────────────────────── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

const LoadingState = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-2 h-72" />
      <Skeleton className="h-72" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
    <Skeleton className="h-96" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-56" />
      <Skeleton className="h-56" />
    </div>
  </div>
);

/* ─── Error state ────────────────────────────────────────── */
const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
      <AlertCircle size={24} className="text-rose-500" />
    </div>
    <p className="text-sm font-black text-slate-800 mb-1">Failed to load revenue data</p>
    <p className="text-[11px] font-bold text-slate-400 max-w-xs">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-5 px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-colors">
      Retry
    </button>
  </div>
);

/* ─── Empty state ────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
      <BarChart3 size={24} className="text-slate-300" />
    </div>
    <p className="text-sm font-black text-slate-800 mb-1">No revenue data available</p>
    <p className="text-[11px] font-bold text-slate-400">Check back once transactions have been recorded.</p>
  </div>
);

/* ─── Cert KPI Card ──────────────────────────────────────── */
const CertKpiCard = ({ m }) => (
  <div className={`${m.color} border rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
    <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-sm">
      {m.icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate mb-0.5">{m.label}</p>
      <p className={`text-xl font-black ${m.txt}`}>{m.value}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{m.sub}</p>
    </div>
  </div>
);

/* ─── Cert Rule Row ──────────────────────────────────────── */
const CertRuleRow = ({ rule, index }) => (
  <div
    className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 group
      ${rule.pass
        ? 'bg-slate-50/80 hover:bg-slate-100/80'
        : 'bg-rose-50 border border-rose-100 hover:bg-rose-100/70'}`}
  >
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
        ${rule.pass ? 'bg-emerald-100' : 'bg-rose-100'}`}>
        {rule.pass
          ? <CheckCircle2 size={12} className="text-emerald-600" />
          : <XCircle size={12} className="text-rose-600" />}
      </div>
      <div className="min-w-0">
        <span className={`text-[10px] font-bold block truncate
          ${rule.pass ? 'text-slate-600' : 'text-rose-700'}`}>
          {rule.rule}
        </span>
        {!rule.pass && (
          <span className="text-[9px] font-medium text-rose-400 block truncate mt-0.5">
            {rule.detail}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 shrink-0 ml-2">
      <span className={`text-[9px] font-black tabular-nums
        ${rule.pass ? 'text-slate-400' : 'text-rose-600'}`}>
        {rule.count}
      </span>
      {!rule.pass && (
        <span className="text-[8px] font-black px-1.5 py-0.5 bg-rose-200 text-rose-700 rounded-full">
          FAIL
        </span>
      )}
    </div>
  </div>
);

/* ─── Severity Badge ─────────────────────────────────────── */
const SeverityBadge = ({ severity }) => {
  const cfg = {
    high:   { cls: 'bg-rose-50 text-rose-600 border border-rose-200',   dot: 'bg-rose-500'   },
    medium: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    low:    { cls: 'bg-slate-100 text-slate-500 border border-slate-200', dot: 'bg-slate-400' },
  }[severity] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

/* ─── Action Button ──────────────────────────────────────── */
const ActionButton = ({ severity, action }) => {
  const cls = severity === 'high'
    ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200'
    : severity === 'medium'
    ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200'
    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200';
  return (
    <button className={`inline-flex items-center gap-1 text-[10px] font-black px-3.5 py-2 rounded-lg
      transition-all duration-150 active:scale-95 ${cls}`}>
      {action}
      <ChevronRight size={11} />
    </button>
  );
};

/* ─── Custom Tooltip for cert timeline ──────────────────── */
const CertTimelineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={tipStyle} className="px-3 py-2.5">
      <p className="text-[10px] font-black text-slate-500 mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] font-black">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-600">{p.name === 'rate' ? 'Cert Rate' : 'Value'}:</span>
          <span className="text-slate-900">{p.name === 'rate' ? `${p.value}%` : `$${p.value}M`}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  PAGE COMPONENT                                           */
/* ══════════════════════════════════════════════════════════ */
const RevenueAnalytics = () => {
  const { data, loading, error } = useRevenueAnalyticsData();
  const [expandedDeal, setExpandedDeal] = useState(null);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} />;
  if (!data)   return <EmptyState />;

  const {
    kpiCards, ytdCard, volumeTiles, revenueTrend, yoyComparisons,
    channels, productMargins, customerTiers, dealSummary,
    topClients, dailyTx, dailyTxStats, dealMetrics,
    kgMonthly, kgSummaryStats, spotScenarios, spotSensitivity,
    certKpi, brandData, certRules, certTimeline,
    certSummary, blockedDeals, certConfig,
  } = data;

  const passCount = certRules.filter(r => r.pass).length;
  const failCount = certRules.filter(r => !r.pass).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── 1. KPI CARDS ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map(card => {
          const Icon = ICON_MAP[card.icon];
          return (
            <div key={card.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconColor} ${card.hoverColor} transition-colors`}>
                  {Icon && <Icon size={16} />}
                </div>
                <Chip up={card.up}>{card.trend}</Chip>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
              <p className="text-xl font-black text-slate-800">{card.value}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{card.sub}</p>
            </div>
          );
        })}

        {/* YTD card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
              <ArrowUpRight size={10} />{ytdCard.trend}
            </span>
          </div>
          <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">YTD 2026</p>
          <p className="text-xl font-black text-white">{ytdCard.value}</p>
          <p className="text-[10px] font-bold text-indigo-300 mt-1">{ytdCard.sub}</p>
        </div>
      </div>

      {/* ── 2. VOLUME TILES ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {volumeTiles.map(m => (
          <div key={m.label} className={`${m.color} border rounded-2xl p-5 flex items-center gap-4`}>
            <div className="w-11 h-11 bg-white/60 rounded-xl flex items-center justify-center text-xl shrink-0">
              {m.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{m.label}</p>
              <p className={`text-lg font-black ${m.txt}`}>{m.value}</p>
              <p className="text-[10px] font-bold text-slate-400">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. REVENUE TREND + CHANNEL ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard className="lg:col-span-2 overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <CardTitle title="Revenue Trend" sub="12-Month Performance vs Same Month Last Year" />
            <div className="flex items-center gap-3 text-[10px] font-bold shrink-0 ml-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-600 rounded-full inline-block" />2026
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-slate-300 rounded-full inline-block" />2025
              </span>
            </div>
          </div>
          <div className="px-6 py-4 h-60">
            <ResponsiveContainer>
              <ComposedChart data={revenueTrend}>
                <defs>
                  <linearGradient id="gCurr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={C.indigo} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="n" tick={{ fontSize: 10, fontWeight: 700, fill: C.slate400 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tipStyle}
                  formatter={(v, name) => [`$${(v / 1000).toFixed(0)}k`, name === 'v' ? '2026' : '2025']} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Area type="monotone" dataKey="v"    stroke={C.indigo}   fill="url(#gCurr)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="prev" stroke={C.slate400} strokeWidth={1.5}  dot={false} strokeDasharray="4 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="px-6 pb-5 grid grid-cols-3 gap-4 border-t border-slate-50 pt-4">
            {yoyComparisons.map(c => (
              <div key={c.label} className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{c.label}</p>
                <Chip up={c.up}>{c.val}</Chip>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-6">
          <CardTitle title="Revenue by Channel" sub="Walk-in · App · Phone · E-com" />
          <div className="space-y-4 mt-5">
            {channels.map(c => (
              <div key={c.ch}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${c.color}`} />
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
        </SectionCard>
      </div>

      {/* ── 4. PRODUCT TYPE + CUSTOMER TIER ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard className="p-6">
          <CardTitle title="Revenue by Product Type" sub="Bars · Coins · Rounds — with margin" />
          <div className="space-y-5 mt-5">
            {productMargins.map(r => (
              <div key={r.cat}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <Ring pct={r.pct} color={r.color} />
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
        </SectionCard>

        <SectionCard className="p-6">
          <CardTitle title="Revenue by Customer Tier" sub="Retail · HNI · Corporate" />
          <div className="space-y-4 mt-5 mb-5">
            {customerTiers.map(t => (
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
          <div className="bg-slate-50 rounded-xl p-4">
            {dealSummary.map(s => (
              <StatRow key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ── 5. BULLION CERTIFICATION BOARD ─────────────────── */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Board header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-24 bg-emerald-500/5 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/40">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-base font-black text-white">Bullion Certification Board</p>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Quality control gate for all bullion deals · April 2026
              </p>
            </div>
          </div>

          <div className="lg:ml-auto flex flex-wrap items-center gap-2">
            {/* Pass pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              <span className="text-[11px] font-black text-emerald-300">
                {passCount} rules passing
              </span>
            </div>
            {/* Fail pill */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/25">
              <XCircle size={13} className="text-rose-400 shrink-0" />
              <span className="text-[11px] font-black text-rose-300">
                {failCount} rules failing
              </span>
            </div>
            {/* Blocked value */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25">
              <AlertTriangle size={13} className="text-amber-400 shrink-0" />
              <span className="text-[11px] font-black text-amber-300">
                {certConfig.blockedValue} at risk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 5a. Cert KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {certKpi.map(m => <CertKpiCard key={m.label} m={m} />)}
      </div>

      {/* 5b. Brand table + Rules panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Brand breakdown table */}
        <SectionCard className="lg:col-span-2 overflow-hidden">
          <div className="px-6 pt-5 pb-4 border-b border-slate-50 flex items-start justify-between">
            <CardTitle
              title="Bullion Brand Breakdown"
              sub="Volume · Purity · Type · LBMA Status — this month"
            />
            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0 ml-3">
              {brandData.length} brands
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  {['Brand', 'Origin', 'Type', 'Purity', 'Volume', 'LBMA', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {brandData.map(b => (
                  <tr key={b.brand} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-6 rounded-full shrink-0
                          ${b.status === 'pass' ? 'bg-emerald-400' : b.status === 'review' ? 'bg-amber-400' : 'bg-rose-400'}`}
                        />
                        <span className="text-xs font-black text-slate-800">{b.brand}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">{b.origin}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full
                        ${b.type === 'Minted'
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {b.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold tabular-nums
                        ${parseFloat(b.purity) >= 995 ? 'text-slate-700' : 'text-amber-600'}`}>
                        {b.purity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-xs font-black text-indigo-600">{b.volume}</span>
                        {b.deals && (
                          <span className="text-[9px] font-medium text-slate-400 block mt-0.5">
                            {b.deals} deals
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {b.lbma ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[9px] font-bold text-emerald-600">Yes</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <XCircle size={14} className="text-rose-400" />
                          <span className="text-[9px] font-bold text-rose-500">No</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full
                        ${b.status === 'pass'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : b.status === 'review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                        {b.status === 'pass' ? 'Auto-pass' : b.status === 'review' ? 'Manual Review' : 'Blocked'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Non-LBMA warning footer */}
          <div className="px-6 py-3.5 bg-amber-50 border-t border-amber-100 flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={11} className="text-amber-700" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-800">Non-LBMA Brand Flagged</p>
              <p className="text-[9px] font-medium text-amber-600 mt-0.5">
                Local UAE (22 KG · 916 purity) is below the 995 LBMA standard — 3 deals require mandatory senior review before certification can proceed.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Certification rules panel */}
        <SectionCard className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <CardTitle title="Certification Rules" sub="Auto-run on every bullion deal" />
            <div className="text-right shrink-0 ml-2">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-800">{passCount}</span>
                <span className="text-sm font-black text-slate-300">/{certRules.length}</span>
              </div>
              <p className="text-[9px] font-bold text-slate-400">rules passing</p>
            </div>
          </div>

          {/* Pass/fail visual bar */}
          <div className="mb-4 flex rounded-full overflow-hidden h-2 bg-slate-100">
            <div
              className="bg-emerald-500 h-full transition-all duration-700"
              style={{ width: `${(passCount / certRules.length) * 100}%` }}
            />
            <div
              className="bg-rose-400 h-full transition-all duration-700"
              style={{ width: `${(failCount / certRules.length) * 100}%` }}
            />
          </div>

          <div className="space-y-2 flex-1">
            {/* Failing rules first */}
            {[...certRules].sort((a, b) => (a.pass === b.pass ? 0 : a.pass ? 1 : -1)).map((rule, i) => (
              <CertRuleRow key={i} rule={rule} index={i} />
            ))}
          </div>

          {failCount > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-50">
              <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 flex items-start gap-2">
                <Zap size={11} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[9px] font-black text-rose-700">
                  {failCount} rule{failCount > 1 ? 's' : ''} failing — {certConfig.blockedCount} deals blocked from certification.
                  Fix to reach {certConfig.targetRate}% target.
                </p>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* 5c. Cert timeline + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Timeline chart + month-end progress */}
        <SectionCard className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-5">
            <CardTitle
              title="Certification Rate — April"
              sub="Daily rate (%) vs certified value ($M) · dashed = 95% target"
            />
            <div className="flex items-center gap-4 text-[10px] font-bold shrink-0 ml-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                Rate %
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Value $M
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-px bg-slate-300 border-t border-dashed border-slate-400 inline-block" />
                95% target
              </span>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer>
              <ComposedChart data={certTimeline}>
                <defs>
                  <linearGradient id="gRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={C.indigo} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fontWeight: 700, fill: C.slate400 }}
                  axisLine={false} tickLine={false} interval={2}
                />
                <YAxis yAxisId="left"  domain={[85, 100]} hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip content={<CertTimelineTooltip />} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                {/* 95% target dashed reference */}
                <ReferenceLine
                  yAxisId="left" y={95}
                  stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="5 4"
                />
                <Area
                  yAxisId="left" type="monotone" dataKey="rate"
                  stroke={C.indigo} fill="url(#gRate)" strokeWidth={2.5} dot={false}
                />
                <Line
                  yAxisId="right" type="monotone" dataKey="value"
                  stroke={C.emerald} strokeWidth={2}
                  dot={{ r: 3, fill: C.emerald, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Month-end close progress */}
          <div className="mt-5 pt-5 border-t border-slate-50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Clock size={12} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-700">April Month-End Close</p>
                  <p className="text-[9px] font-medium text-slate-400">Bullion certification progress</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black ${certConfig.currentRate >= certConfig.targetRate ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {certConfig.currentRate}%
                </span>
                <span className="text-[10px] font-bold text-slate-400">/ {certConfig.targetRate}%</span>
                <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                  {certConfig.daysLeft} days left
                </span>
              </div>
            </div>
            <div className="relative h-3.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full relative transition-all duration-1000"
                style={{
                  width: `${certConfig.currentRate}%`,
                  background: certConfig.currentRate >= certConfig.targetRate
                    ? 'linear-gradient(90deg, #10B981, #059669)'
                    : 'linear-gradient(90deg, #F59E0B, #D97706)',
                }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full" />
              </div>
              {/* Target marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
                style={{ left: `${certConfig.targetRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] font-bold text-slate-400">0%</span>
              <span className="text-[9px] font-bold text-slate-400">{certConfig.targetRate}% target</span>
              <span className="text-[9px] font-bold text-slate-400">100%</span>
            </div>
          </div>
        </SectionCard>

        {/* Cert summary */}
        <SectionCard className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <CardTitle title="Cert Summary" sub="April bullion deals" />
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Award size={14} className="text-indigo-600" />
            </div>
          </div>

          {/* Quick donut visual */}
          <div className="my-4 flex items-center gap-4">
            <div className="relative shrink-0">
              <svg width="72" height="72" viewBox="0 0 72 72">
                {/* Background */}
                <circle cx="36" cy="36" r="28" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                {/* Auto-certified: 41/47 */}
                <circle cx="36" cy="36" r="28" fill="none" stroke={C.emerald} strokeWidth="8"
                  strokeDasharray={`${(41/47)*2*Math.PI*28} ${2*Math.PI*28}`}
                  strokeLinecap="round" transform="rotate(-90 36 36)"
                  style={{ transition: 'stroke-dasharray 1s ease' }} />
                <text x="36" y="34" textAnchor="middle" dominantBaseline="middle"
                  fontSize="11" fontWeight="900" fill="#0F172A">41</text>
                <text x="36" y="46" textAnchor="middle" dominantBaseline="middle"
                  fontSize="8" fontWeight="700" fill="#94A3B8">of 47</text>
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                { label: 'Auto-cert', value: '41', color: 'bg-emerald-400' },
                { label: 'Manual',    value: '2',  color: 'bg-amber-400'   },
                { label: 'Blocked',   value: '4',  color: 'bg-rose-400'    },
                { label: 'Total',     value: '47', color: 'bg-indigo-400'  },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.color} mx-auto mb-1`} />
                  <p className="text-sm font-black text-slate-800">{s.value}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {certSummary.map(s => (
              <StatRow key={s.label} label={s.label} value={s.value} accent={s.accent} />
            ))}
          </div>

          {/* Action required callout */}
          <div className="mt-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileCheck size={11} className="text-white" />
              </div>
              <p className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Action Required</p>
            </div>
            <p className="text-[11px] font-black text-indigo-800 leading-relaxed">
              {certConfig.blockedCount} deals ({certConfig.blockedValue}) need immediate attention to hit {certConfig.targetRate}% before month-end.
            </p>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-indigo-500">
              <Clock size={9} />
              {certConfig.daysLeft} days remaining · April close
            </div>
          </div>
        </SectionCard>
      </div>

      {/* 5d. Blocked deals table */}
      <SectionCard className="overflow-hidden">
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <div className="w-6 h-6 bg-rose-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={13} className="text-rose-600" />
              </div>
              <p className="text-sm font-black text-slate-800">Deals Requiring Action</p>
            </div>
            <p className="text-[10px] font-bold text-slate-400 ml-8.5">
              Bullion deals currently blocked from certification
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
              {blockedDeals.length} blocked · {certConfig.blockedValue} at risk
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {['Deal ID', 'Client', 'Brand', 'Weight', 'Value', 'Issue', 'Severity', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.18em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blockedDeals.map(d => (
                <React.Fragment key={d.id}>
                  <tr
                    className={`transition-colors cursor-pointer
                      ${expandedDeal === d.id ? 'bg-slate-50' : 'hover:bg-slate-50/60'}`}
                    onClick={() => setExpandedDeal(expandedDeal === d.id ? null : d.id)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1 h-8 rounded-full shrink-0
                          ${d.severity === 'high' ? 'bg-rose-500' : d.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-300'}`}
                        />
                        <div>
                          <span className="text-xs font-black text-indigo-600">{d.id}</span>
                          <span className="text-[9px] font-bold text-slate-400 block">{d.ruleRef}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-800">{d.client}</td>
                    <td className="px-5 py-4 text-xs text-slate-500 font-medium">{d.brand}</td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600 tabular-nums">{d.kg}</td>
                    <td className="px-5 py-4 text-xs font-black text-slate-800 tabular-nums">{d.value}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={12} className={
                          d.severity === 'high'   ? 'text-rose-500 shrink-0'  :
                          d.severity === 'medium' ? 'text-amber-500 shrink-0' : 'text-slate-400 shrink-0'} />
                        <span className="text-[10px] font-bold text-slate-700">{d.issue}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <SeverityBadge severity={d.severity} />
                    </td>
                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                      <ActionButton severity={d.severity} action={d.action} />
                    </td>
                  </tr>

                  {/* Expandable detail row */}
                  {expandedDeal === d.id && (
                    <tr className="bg-indigo-50/50">
                      <td colSpan={8} className="px-6 py-3">
                        <div className="flex items-start gap-3">
                          <Info size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-indigo-800 mb-0.5">Issue Detail</p>
                            <p className="text-[10px] font-medium text-indigo-600">{d.issueDetail}</p>
                          </div>
                          <span className="text-[9px] font-black px-2 py-1 bg-indigo-100 text-indigo-600 rounded-lg">
                            {d.ruleRef}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer hint */}
        <div className="px-6 py-3 border-t border-slate-50 flex items-center gap-2">
          <ChevronRight size={11} className="text-slate-300" />
          <p className="text-[9px] font-bold text-slate-400">
            Click any row to expand issue details · Action buttons connect directly to the next workflow step
          </p>
        </div>
      </SectionCard>

      {/* ── 6. DAILY TRANSACTIONS + DEAL METRICS ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-4">
            <CardTitle title="Daily Transactions" sub="Number of deals closed per day · This week" />
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 shrink-0 ml-4">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-indigo-600 inline-block" />Transactions</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-400 inline-block" />Revenue $M</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer>
              <ComposedChart data={dailyTx} barCategoryGap="28%">
                <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700, fill: C.slate400 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left"  hide />
                <YAxis yAxisId="right" orientation="right" hide />
                <Tooltip contentStyle={tipStyle}
                  formatter={(v, name) => [
                    name === 'txns' ? `${v} deals` : `$${v}M`,
                    name === 'txns' ? 'Transactions' : 'Revenue',
                  ]} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Bar  yAxisId="left"  dataKey="txns"    fill={C.indigo}   radius={[6,6,0,0]} />
                <Line yAxisId="right" dataKey="revenue" stroke={C.emerald} strokeWidth={2.5} dot={{ r: 4, fill: C.emerald, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {dailyTxStats.map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-6">
          <CardTitle title="Deal Metrics" sub="Margin · Velocity · Top Rep" />
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl p-4 mt-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Star size={12} className="text-amber-900" fill="currentColor" />
              <p className="text-[9px] font-black text-amber-900 uppercase tracking-widest">Deal of the Month</p>
            </div>
            <p className="text-base font-black text-white">{dealMetrics.topDeal.amount}</p>
            <p className="text-[10px] font-black text-amber-100">{dealMetrics.topDeal.client}</p>
            <p className="text-[10px] font-bold text-amber-200 mt-1">{dealMetrics.topDeal.detail}</p>
          </div>
          <div className="space-y-3 mb-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Margin by Category</p>
            {dealMetrics.marginByCategory.map(m => (
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
          <div className="pt-4 border-t border-slate-50">
            {dealMetrics.summaryStats.map(s => (
              <StatRow key={s.label} label={s.label} value={s.value} accent={s.accent} />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* ── 7. TOP 10 CLIENTS ─────────────────────────────── */}
      <SectionCard className="overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-50">
          <CardTitle title="Top 10 Clients by Revenue" sub="Ranked by total contribution this month" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 shrink-0 ml-4">
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
              {topClients.map(c => (
                <tr key={c.rank} className="hover:bg-slate-50/70 transition-all">
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
                      ${c.tier === 'HNI'       ? 'bg-indigo-50 text-indigo-600' :
                        c.tier === 'Corporate' ? 'bg-sky-50 text-sky-600'       :
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
      </SectionCard>

      {/* ── 8. GOLD VOLUME + SPOT PRICE IMPACT ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard className="p-6">
          <CardTitle title="Gold Volume Sold" sub="KG per Month · 2026" />
          <div className="h-48 mt-4">
            <ResponsiveContainer>
              <BarChart data={kgMonthly} barCategoryGap="30%">
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: C.slate400, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={tipStyle} formatter={v => [`${v} KG`, 'Volume']} />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Bar dataKey="kg" radius={[6,6,0,0]}>
                  {kgMonthly.map((_, index) => (
                    <Cell key={index}
                      fill={index === kgMonthly.length - 3 ? C.emerald : C.indigo}
                      fillOpacity={0.75 + (index / kgMonthly.length) * 0.25} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {kgSummaryStats.map(s => (
              <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-[11px] font-black text-slate-800 mt-0.5">{s.val}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Spot price impact — dark card */}
        <div className="bg-slate-900 rounded-2xl p-6 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <p className="text-sm font-black text-white mb-0.5 relative">Gold Spot Price Impact</p>
          <p className="text-[10px] font-bold text-slate-400 mb-5 relative">Price movement vs Revenue &amp; Volume</p>
          <div className="relative space-y-1">
            {spotScenarios.map(s => (
              <div key={s.s} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.revUp ? 'bg-emerald-400' : 'bg-rose-400'}`} />
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
            {spotSensitivity.map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className={`text-sm font-black mt-1 ${s.accent}`}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default RevenueAnalytics;