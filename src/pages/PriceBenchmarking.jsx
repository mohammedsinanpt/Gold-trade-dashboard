// src/pages/PriceBenchmarking.jsx
// Layer 5 · Fixing & Price Benchmarking — UI only.
// All data comes from usePriceBenchmarkingData. This file never imports
// from mockData, the service, or any data file directly.

import React, { useState, useRef, useEffect, useId } from 'react';
import {
  Activity, BarChart2, Globe2, TrendingUp,
  AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight,
  Calendar, ChevronRight,
} from 'lucide-react';

import { Card, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SectionDivider } from '../components/ui/Buttons';
import { C } from '../constants/tokens';
import { usePriceBenchmarkingData } from '../hooks/usePriceBenchmarkingData';

// ─── Metal palettes ───────────────────────────────────────────────────────────
// Silver: three clearly distinct, high-contrast colors so no two lines compete.
//   benchmark → deep navy   (#1E3A8A)  — dashed, cool authoritative
//   market    → vivid violet (#7C3AED) — solid bold, unmistakably different
//   spread    → deep magenta (#BE185D) — dashed, warm contrast on right axis

const METAL_PALETTE = {
  gold: {
    benchmark:   '#1A6FBF',  // deep blue        — dashed
    market:      '#C0390E',  // deep red-orange   — solid
    spread:      '#0F6E56',  // deep teal-green   — right axis dashed
    toggleBg:    '#FFF8ED',
    toggleBorder:'#F59E0B',
    toggleText:  '#92400E',
    accentBg:    '#FFF8ED',
    label:       'Gold',
    symbol:      'XAU',
    icon:        '◆',
  },
  silver: {
    benchmark:   '#1E3A8A',  // deep navy         — dashed
    market:      '#7C3AED',  // vivid violet       — solid
    spread:      '#BE185D',  // deep magenta       — right axis dashed
    toggleBg:    '#F0F4FF',
    toggleBorder:'#818CF8',
    toggleText:  '#312E81',
    accentBg:    '#F5F3FF',
    label:       'Silver',
    symbol:      'XAG',
    icon:        '◇',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n, dp = 2) =>
  typeof n === 'number'
    ? n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
    : '—';

const dealBadgeColor = (s) =>
  s === 'Premium' ? 'emerald' : s === 'Discount' ? 'rose' : s === 'At Fix' ? 'indigo' : 'slate';

const tierBadgeColor = (t) =>
  t === 'Corporate' ? 'indigo' : t === 'HNI' ? 'amber' : 'slate';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

// ─── Error banner ─────────────────────────────────────────────────────────────

function ErrorBanner({ message }) {
  return (
    <div className="flex items-center space-x-3 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl">
      <AlertTriangle size={14} className="text-rose-500 flex-none" />
      <p className="text-xs font-bold text-rose-600">{message}</p>
    </div>
  );
}

// ─── Enhanced MetricCard ──────────────────────────────────────────────────────

function EnhancedMetricCard({ label, value, trend, trendUp, icon: Icon, sub, borderColor, iconBg, iconColor, bg }) {
  return (
    <div className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ background: bg, borderLeft: `3px solid ${borderColor}` }}>
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-xl" style={{ background: iconBg }}>
            <Icon size={17} style={{ color: iconColor }} />
          </div>
          {trend && (
            <div className="flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg"
              style={{ background: trendUp ? '#ECFDF5' : '#FFF1F2', color: trendUp ? C.emerald : C.rose }}>
              {trend}
              {trendUp
                ? <ArrowUpRight size={11} className="ml-0.5" />
                : <ArrowDownRight size={11} className="ml-0.5" />}
            </div>
          )}
        </div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tight" style={{ color: borderColor }}>{value}</p>
        {sub && <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Metal Toggle ─────────────────────────────────────────────────────────────

function MetalToggle({ activeMetal, onChange }) {
  return (
    <div className="flex items-center p-1 rounded-xl border border-slate-200 bg-slate-50 gap-1">
      {['gold', 'silver'].map((m) => {
        const pal    = METAL_PALETTE[m];
        const active = activeMetal === m;
        return (
          <button key={m} onClick={() => onChange(m)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all"
            style={{
              background:  active ? pal.toggleBg    : 'transparent',
              color:       active ? pal.toggleText   : C.slate400,
              border:      active ? `1px solid ${pal.toggleBorder}` : '1px solid transparent',
              boxShadow:   active ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
            }}>
            <span style={{ fontSize: 10 }}>{pal.icon}</span>
            <span>{pal.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Time Range Selector ──────────────────────────────────────────────────────

const RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y'];

function TimeRangeSelector({ activeRange, onRange, onCustomApply }) {
  const [showCustom, setShowCustom] = useState(false);
  const [fromVal,    setFromVal]    = useState('');
  const [toVal,      setToVal]      = useState('');
  const [fromErr,    setFromErr]    = useState(false);
  const [toErr,      setToErr]      = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!showCustom) return;
    function onOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setShowCustom(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [showCustom]);

  function handleApply() {
    const from = new Date(fromVal);
    const to   = new Date(toVal);
    const fErr = !fromVal || isNaN(from);
    const tErr = !toVal   || isNaN(to) || to <= from;
    setFromErr(fErr);
    setToErr(tErr);
    if (fErr || tErr) return;
    onCustomApply(from, to);
    setShowCustom(false);
  }

  return (
    <div className="flex items-center gap-1 relative">
      <div className="flex items-center p-1 rounded-xl border border-slate-200 bg-slate-50 gap-0.5">
        {RANGES.map((r) => (
          <button key={r}
            onClick={() => { onRange(r); setShowCustom(false); }}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all"
            style={{
              background: activeRange === r && !showCustom ? C.indigo : 'transparent',
              color:      activeRange === r && !showCustom ? '#fff'   : C.slate400,
            }}>
            {r}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowCustom((v) => !v)}
        className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-[11px] font-black transition-all"
        style={{
          background: showCustom ? C.indigoLight : '#F8FAFC',
          color:      showCustom ? C.indigo       : C.slate500,
          border:     `1px solid ${showCustom ? C.indigo : '#E2E8F0'}`,
        }}>
        <Calendar size={12} />
        <span>Custom</span>
      </button>

      {showCustom && (
        <div ref={panelRef}
          className="absolute right-0 top-11 z-50 rounded-2xl border border-slate-200 bg-white shadow-xl"
          style={{ minWidth: 280, padding: '18px 20px' }}>

          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Calendar size={12} className="text-indigo-600" />
            </div>
            <p className="text-[11px] font-black text-slate-700 uppercase tracking-[0.15em]">Custom Range</p>
          </div>

          <div className="mb-3">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">From</label>
            <input type="date" value={fromVal}
              onChange={(e) => { setFromVal(e.target.value); setFromErr(false); }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold outline-none transition-all"
              style={{
                border:     `1.5px solid ${fromErr ? C.rose : fromVal ? C.indigo : '#E2E8F0'}`,
                background: fromErr ? '#FFF1F2' : '#F8FAFC',
                color:      C.slate800,
              }} />
            {fromErr && <p className="text-[9px] text-rose-500 font-bold mt-1">Please select a valid start date</p>}
          </div>

          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center space-x-2 text-slate-300">
              <div className="h-px w-8 bg-slate-200" />
              <ChevronRight size={12} />
              <div className="h-px w-8 bg-slate-200" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">To</label>
            <input type="date" value={toVal}
              onChange={(e) => { setToVal(e.target.value); setToErr(false); }}
              className="w-full px-3 py-2 rounded-xl text-xs font-bold outline-none transition-all"
              style={{
                border:     `1.5px solid ${toErr ? C.rose : toVal ? C.indigo : '#E2E8F0'}`,
                background: toErr ? '#FFF1F2' : '#F8FAFC',
                color:      C.slate800,
              }} />
            {toErr && <p className="text-[9px] text-rose-500 font-bold mt-1">End date must be after start date</p>}
          </div>

          <p className="text-[9px] text-slate-400 font-medium mb-3 leading-relaxed">
            Range snaps to the nearest standard period for display.
          </p>

          <button onClick={handleApply}
            className="w-full py-2.5 rounded-xl text-xs font-black text-white transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${C.indigo}, #6366F1)` }}>
            Apply Range
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Legend line ──────────────────────────────────────────────────────────────

function LegendLine({ color, dashed, label }) {
  return (
    <div className="flex items-center space-x-2">
      <svg width="24" height="10">
        <line x1="0" y1="5" x2="24" y2="5"
          stroke={color} strokeWidth="2"
          strokeDasharray={dashed ? '5 3' : '0'}
          strokeLinecap="round" />
      </svg>
      <p className="text-[9px] font-black uppercase tracking-[0.15em]" style={{ color: '#55555A' }}>{label}</p>
    </div>
  );
}

// ─── Deviation Bar ────────────────────────────────────────────────────────────

function DeviationBar({ label, deviation, maxDev = 15 }) {
  const pct    = Math.min(Math.abs(deviation) / maxDev, 1) * 100;
  const isPos  = deviation > 0;
  const isZero = deviation === 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg"
          style={{
            color:      isZero ? C.slate500 : isPos ? C.emerald : C.rose,
            background: isZero ? C.slate100 : isPos ? '#ECFDF5' : '#FFF1F2',
          }}>
          {isZero ? '±$0.00' : (isPos ? '+' : '-') + '$' + fmt(Math.abs(deviation))} / oz
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: C.slate100 }}>
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: isZero ? C.slate400 : isPos ? C.emerald : C.rose }} />
      </div>
      <p className="text-[9px] font-medium text-slate-400">
        {isPos  ? 'Spot trading above fix — bullish divergence'
        : isZero ? 'Spot at parity with fix'
                 : 'Spot trading below fix — bearish pressure'}
      </p>
    </div>
  );
}

// ─── Price Chart ──────────────────────────────────────────────────────────────

function PriceChart({ data, isLoading, palette }) {
  const uid        = useId();
  const wrapRef    = useRef(null);
  const svgRef     = useRef(null);
  const tooltipRef = useRef(null);

  // Responsive width via ResizeObserver
  useEffect(() => {
    if (!wrapRef.current || !svgRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width || 720;
      svgRef.current?.setAttribute('viewBox', `0 0 ${w} 230`);
      svgRef.current?.setAttribute('data-width', String(w));
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  const H   = 230;
  const PAD = { t: 20, r: 62, b: 40, l: 72 }; // l=72 to fit "$2,318" labels
  const W   = 720;
  const iw  = W - PAD.l - PAD.r;
  const ih  = H - PAD.t - PAD.b;

  if (isLoading || data.length === 0) {
    return (
      <div ref={wrapRef} style={{ height: H }} className="flex items-center justify-center">
        <Loader2 size={20} className="animate-spin text-slate-300" />
      </div>
    );
  }

  const benchmarks = data.map((d) => d.benchmark);
  const markets    = data.map((d) => d.uaeMarket);
  const spreads    = data.map((d) => Math.abs(d.uaeMarket - d.benchmark));

  const allPrices  = [...benchmarks, ...markets];
  const isGold     = allPrices[0] > 100;
  const priceMin   = Math.min(...allPrices) - (isGold ? 8 : 0.3);
  const priceMax   = Math.max(...allPrices) + (isGold ? 8 : 0.3);
  const priceRange = priceMax - priceMin;
  const spreadMax  = Math.max(...spreads) * 1.6 || 1;
  const dpFmt      = isGold ? 0 : 2; // gold = whole numbers, silver = 2dp

  const cx  = (i) => PAD.l + (i / (data.length - 1)) * iw;
  const cyL = (v) => PAD.t + ih - ((v - priceMin) / priceRange) * ih;
  const cyR = (v) => PAD.t + ih - (v / spreadMax) * ih;

  const polyPts = (arr, cyFn) => arr.map((v, i) => `${cx(i)},${cyFn(v)}`).join(' ');
  const yGrids  = Array.from({ length: 5 }, (_, i) => priceMin + (i / 4) * priceRange);
  const xStep   = data.length > 10 ? Math.ceil(data.length / 8) : 1;

  function handleMouseMove(e) {
    const svg = svgRef.current;
    const tip = tooltipRef.current;
    if (!svg || !tip) return;
    const rect   = svg.getBoundingClientRect();
    const scaleX = parseFloat(svg.getAttribute('data-width') || W) / rect.width;
    const mx     = (e.clientX - rect.left) * scaleX - PAD.l;
    const i      = Math.max(0, Math.min(data.length - 1, Math.round((mx / iw) * (data.length - 1))));
    const pt     = data[i];
    const spread = pt.uaeMarket - pt.benchmark;
    const fluct  = pt.fluctuation;

    const tipLeft = Math.min(
      Math.max((cx(i) / parseFloat(svg.getAttribute('data-width') || W)) * rect.width - 92, 0),
      rect.width - 196,
    );
    tip.style.left    = `${tipLeft}px`;
    tip.style.top     = '10px';
    tip.style.display = 'block';
    tip.innerHTML = `
      <p style="font-size:10px;font-weight:800;color:#55555A;margin-bottom:8px;letter-spacing:0.08em">${pt.t}</p>
      ${[
        { l: 'LBMA Benchmark', v: '$' + fmt(pt.benchmark, dpFmt), c: palette.benchmark },
        { l: 'UAE Market',     v: '$' + fmt(pt.uaeMarket,  dpFmt), c: palette.market    },
        { l: 'Spread',         v: (spread >= 0 ? '+' : '') + '$' + fmt(Math.abs(spread), dpFmt), c: palette.spread },
        { l: 'Fluctuation',    v: (fluct  >= 0 ? '+' : '') + '$' + fmt(Math.abs(fluct),  dpFmt), c: fluct >= 0 ? C.emerald : C.rose },
      ].map(r => `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
          <span style="font-size:9px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em">${r.l}</span>
          <span style="font-size:11px;font-weight:900;color:${r.c};margin-left:14px">${r.v}</span>
        </div>`).join('')}`;

    const ch = svg.querySelector('.tt-ch');
    const dm = svg.querySelector('.tt-dm');
    const db = svg.querySelector('.tt-db');
    if (ch) { ch.setAttribute('x1', cx(i)); ch.setAttribute('x2', cx(i)); ch.style.display = ''; }
    if (dm) { dm.setAttribute('cx', cx(i)); dm.setAttribute('cy', cyL(pt.uaeMarket)); dm.style.display = ''; }
    if (db) { db.setAttribute('cx', cx(i)); db.setAttribute('cy', cyL(pt.benchmark)); db.style.display = ''; }
  }

  function handleMouseLeave() {
    if (tooltipRef.current) tooltipRef.current.style.display = 'none';
    ['tt-ch', 'tt-dm', 'tt-db'].forEach((cls) => {
      const el = svgRef.current?.querySelector(`.${cls}`);
      if (el) el.style.display = 'none';
    });
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <svg ref={svgRef}
        viewBox={`0 0 ${W} ${H}`} data-width={W}
        style={{ display: 'block', width: '100%', overflow: 'visible' }}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

        <defs>
          <clipPath id={`${uid}-clip`}>
            <rect x={PAD.l} y={PAD.t} width={iw} height={ih} />
          </clipPath>
        </defs>

        {/* Y grid + left axis — with $ prefix */}
        {yGrids.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} y1={cyL(v)} x2={W - PAD.r} y2={cyL(v)}
              stroke="rgba(0,0,0,0.07)" strokeWidth="1" />
            <text x={PAD.l - 6} y={cyL(v) + 4} textAnchor="end"
              fontSize="9" fontWeight="700" fill="#55555A">
              ${fmt(v, dpFmt)}
            </text>
          </g>
        ))}

        {/* Right axis — spread with $ prefix */}
        {[0, 0.5, 1].map((r, i) => (
          <text key={i} x={W - PAD.r + 8} y={cyR(r * spreadMax) + 4}
            textAnchor="start" fontSize="9" fontWeight="700" fill={palette.spread}>
            ${fmt(r * spreadMax, dpFmt)}
          </text>
        ))}
        <text x={W - PAD.r + 10} y={PAD.t - 6}
          fontSize="8" fontWeight="800" fill={palette.spread} textAnchor="start">
          Spread $
        </text>

        {/* Benchmark line — dashed */}
        <polyline points={polyPts(benchmarks, cyL)} fill="none"
          stroke={palette.benchmark} strokeWidth="2"
          strokeDasharray="6 4" strokeLinejoin="round" strokeLinecap="round"
          clipPath={`url(#${uid}-clip)`} />

        {/* Market line — solid */}
        <polyline points={polyPts(markets, cyL)} fill="none"
          stroke={palette.market} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round"
          clipPath={`url(#${uid}-clip)`} />

        {/* Spread line — dashed, right axis */}
        <polyline points={spreads.map((v, i) => `${cx(i)},${cyR(v)}`).join(' ')} fill="none"
          stroke={palette.spread} strokeWidth="1.5"
          strokeDasharray="4 3" strokeLinejoin="round" strokeLinecap="round"
          clipPath={`url(#${uid}-clip)`} />

        {/* X-axis labels */}
        {data.map((d, i) => i % xStep === 0 ? (
          <text key={i} x={cx(i)} y={H - PAD.b + 14}
            textAnchor="middle" fontSize="9" fontWeight="700" fill="#55555A">
            {d.t}
          </text>
        ) : null)}

        {/* Tooltip SVG elements — hidden until hover */}
        <line className="tt-ch" x1={0} y1={PAD.t} x2={0} y2={H - PAD.b}
          stroke="#55555A" strokeWidth="1" strokeDasharray="3 2" strokeOpacity="0.4"
          style={{ display: 'none' }} />
        <circle className="tt-dm" cx={0} cy={0} r="4.5"
          fill={palette.market} stroke="#fff" strokeWidth="2"
          style={{ display: 'none' }} />
        <circle className="tt-db" cx={0} cy={0} r="3.5"
          fill={palette.benchmark} stroke="#fff" strokeWidth="2"
          style={{ display: 'none' }} />
      </svg>

      {/* Tooltip HTML card */}
      <div ref={tooltipRef} style={{
        display: 'none', position: 'absolute', pointerEvents: 'none',
        background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12,
        padding: '12px 16px', boxShadow: '0 6px 24px rgba(0,0,0,0.09)',
        minWidth: 190, top: 10,
      }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PriceBenchmarking() {
  const {
    activeMetal, setActiveMetal,
    activeRange,  setActiveRange,
    applyCustomRange,
    fixing, spot, fx,
    chartData,
    deals,
    isLoading, isChartLoading,
    error,
  } = usePriceBenchmarkingData();

  const pal       = METAL_PALETTE[activeMetal];
  const spotUpDay = spot.change >= 0;

  // 4 page-level KPI cards — accent colours follow active metal
  const metricDefs = [
    {
      label: `Spot Price · ${pal.symbol}/USD`,
      value: `$${fmt(spot.price)}`,
      trend: `${spotUpDay ? '+' : ''}${spot.changePct.toFixed(2)}%`,
      trendUp: spotUpDay,
      icon: Activity,
      sub: `Δ ${spotUpDay ? '+' : ''}$${fmt(spot.change)} today`,
      borderColor: pal.market,    iconBg: pal.toggleBg,  iconColor: pal.market,    bg: `${pal.toggleBg}CC`,
    },
    {
      label: `LBMA AM Fix · ${pal.symbol}`,
      value: `$${fmt(fixing.am.price)}`,
      trend: `+${fixing.am.changePct.toFixed(2)}%`,
      trendUp: true,
      icon: TrendingUp,
      sub: `Set ${fixing.am.time}`,
      borderColor: pal.benchmark, iconBg: pal.accentBg,  iconColor: pal.benchmark, bg: `${pal.accentBg}CC`,
    },
    {
      label: `LBMA PM Fix · ${pal.symbol}`,
      value: `$${fmt(fixing.pm.price)}`,
      trend: `+${fixing.pm.changePct.toFixed(2)}%`,
      trendUp: true,
      icon: BarChart2,
      sub: `Set ${fixing.pm.time}`,
      borderColor: pal.spread,    iconBg: '#F0FDF9',     iconColor: pal.spread,    bg: '#F7FDFBCC',
    },
    {
      label: 'Spot Price · AED',
      value: `AED ${fmt(fx.spotAED, 0)}`,
      trend: fx.fxImpactPerOz >= 0 ? `+AED ${fmt(fx.fxImpactPerOz, 2)}` : `AED ${fmt(fx.fxImpactPerOz, 2)}`,
      trendUp: fx.fxImpactPerOz >= 0,
      icon: Globe2,
      sub: `1 USD = ${fx.rate} AED`,
      borderColor: '#0EA5E9',     iconBg: '#F0F9FF',     iconColor: '#0EA5E9',     bg: '#F8FBFFCC',
    },
  ];

  // Deal aggregates
  const premiumDeals  = deals.filter((d) => d.status === 'Premium');
  const discountDeals = deals.filter((d) => d.status === 'Discount');
  const avgPremium    = premiumDeals.length  ? premiumDeals.reduce((s, d) => s + d.premium, 0)  / premiumDeals.length  : 0;
  const avgDiscount   = discountDeals.length ? discountDeals.reduce((s, d) => s + d.premium, 0) / discountDeals.length : 0;
  const totalVolume   = deals.reduce((s, d) => s + d.qty, 0);
  const totalValue    = deals.reduce((s, d) => s + Number(d.totalUSD), 0);

  return (
    <div className="space-y-6">

      <SectionDivider label="LBMA · London Bullion Market Association · Price Benchmarking" />

      {error && <ErrorBanner message={error} />}

      {/* ── 1 · PAGE-LEVEL KPI CARDS ── */}
      {isLoading ? (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((k) => <Skeleton key={k} className="h-36" />)}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {metricDefs.map((m) => <EnhancedMetricCard key={m.label} {...m} />)}
        </div>
      )}

      {/* ── 2 · SPOT vs FIXING + CURRENCY IMPACT ── */}
      <div className="grid grid-cols-3 gap-4">

        <Card className="col-span-2">
          <CardHeader title="Spot vs Fixing" sub="Real-time price deviation from LBMA benchmark rates" />
          <div className="px-6 py-5 space-y-5">
            {isLoading ? (
              <>
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((k) => <Skeleton key={k} className="h-14" />)}
                </div>
              </>
            ) : (
              <>
                <DeviationBar label="Spot vs AM Fix · 10:30 AM GMT" deviation={spot.vsAMFix} />
                <DeviationBar label="Spot vs PM Fix · 03:00 PM GMT" deviation={spot.vsPMFix} />
                <div className="grid grid-cols-4 gap-3 pt-1">
                  {[
                    { label: 'Day Open', value: `$${fmt(spot.open)}`, accent: C.slate500 },
                    { label: 'Day High', value: `$${fmt(spot.high)}`, accent: C.emerald  },
                    { label: 'Day Low',  value: `$${fmt(spot.low)}`,  accent: C.rose     },
                    { label: 'Range',    value: `$${fmt(spot.high - spot.low)}`, accent: C.amber },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                      <p className="text-sm font-black mt-1" style={{ color: s.accent }}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Currency Impact" sub="USD → AED conversion on pricing"
            action={<Badge color="sky">Live</Badge>} />
          <div className="px-6 py-5">
            {isLoading ? <Skeleton className="h-44" /> : (
              [
                { label: 'USD / AED Rate',       value: fx.rate.toFixed(4),                 note: 'AED fixed peg'    },
                { label: 'Rate Δ vs Prev Close', value: `+${fx.delta.toFixed(4)}`,           note: 'Overnight'        },
                { label: 'AM Fix in AED / oz',   value: `AED ${fmt(fx.amFixAED, 0)}`,        note: 'Base rate'        },
                { label: 'PM Fix in AED / oz',   value: `AED ${fmt(fx.pmFixAED, 0)}`,        note: 'Base rate'        },
                { label: 'Spot in AED / oz',     value: `AED ${fmt(fx.spotAED, 0)}`,         note: 'Current market'   },
                { label: 'FX Impact per oz',     value: `+AED ${fmt(fx.fxImpactPerOz, 2)}`,  note: 'vs prev close'    },
              ].map((row, i, arr) => (
                <div key={row.label}
                  className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{row.label}</p>
                    <p className="text-[9px] font-medium text-slate-300 mt-0.5">{row.note}</p>
                  </div>
                  <p className="text-[13px] font-black text-slate-800">{row.value}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* ── 3 · PRICE TREND CHART ── */}
      <Card>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
          <div className="flex items-center space-x-4">
            <MetalToggle activeMetal={activeMetal} onChange={setActiveMetal} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">Price Trend</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{pal.label} · {pal.symbol}/USD</p>
            </div>
          </div>
          <TimeRangeSelector
            activeRange={activeRange}
            onRange={setActiveRange}
            onCustomApply={applyCustomRange}
          />
        </div>

        <div className="px-6 pt-4 pb-6 space-y-4">
          <div className="flex items-center space-x-6">
            <LegendLine color={pal.benchmark} dashed        label="LBMA Benchmark"     />
            <LegendLine color={pal.market}    dashed={false} label="UAE Market Price"   />
            <LegendLine color={pal.spread}    dashed        label="Spread (right axis)" />
          </div>
          <PriceChart data={chartData} isLoading={isChartLoading} palette={pal} />
        </div>
      </Card>

      {/* ── 4 · PREMIUM / DISCOUNT TABLE ── */}
      <Card>
        <CardHeader
          title="Premium / Discount vs Fix"
          sub="Margin applied above or below LBMA fixing price in today's executed deals"
          action={
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Avg Premium</p>
                <p className="text-sm font-black" style={{ color: C.emerald }}>+${fmt(avgPremium)}</p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Avg Discount</p>
                <p className="text-sm font-black" style={{ color: C.rose }}>${fmt(avgDiscount)}</p>
              </div>
            </div>
          }
        />

        {isLoading ? (
          <div className="px-6 py-4 space-y-2">
            {[1, 2, 3, 4, 5].map((k) => <Skeleton key={k} className="h-10" />)}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['ID', 'Client', 'Tier', 'Qty (oz)', 'Fix Ref', 'Base Fix', 'Prem / Disc',
                      'Final (USD/oz)', 'Final (AED/oz)', 'Deal Total', 'Time', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deals.map((deal) => (
                    <tr key={deal.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-black text-indigo-600 whitespace-nowrap">{deal.id}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-800 whitespace-nowrap">{deal.client}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><Badge color={tierBadgeColor(deal.tier)}>{deal.tier}</Badge></td>
                      <td className="px-4 py-3.5 font-bold text-slate-700 whitespace-nowrap">{deal.qty.toLocaleString()}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><Badge color={deal.fixRef === 'AM' ? 'amber' : 'sky'}>{deal.fixRef} Fix</Badge></td>
                      <td className="px-4 py-3.5 font-bold text-slate-700 whitespace-nowrap">${fmt(deal.baseFix)}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-black"
                          style={{ color: deal.premium > 0 ? C.emerald : deal.premium < 0 ? C.rose : C.slate500 }}>
                          {deal.premium === 0 ? '—' : (deal.premium > 0 ? '+' : '') + '$' + fmt(Math.abs(deal.premium))}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-black text-slate-900 whitespace-nowrap">${fmt(deal.finalUSD)}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-600 whitespace-nowrap">{fmt(deal.finalAED, 2)}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-700 whitespace-nowrap">${Number(deal.totalUSD).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-slate-400 font-bold whitespace-nowrap">{deal.time}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap"><Badge color={dealBadgeColor(deal.status)}>{deal.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 grid grid-cols-4 gap-4 bg-slate-50 rounded-b-2xl">
              {[
                { label: 'Total Volume',   value: `${totalVolume.toLocaleString()} oz`,        accent: C.slate800 },
                { label: 'Total Value',    value: `$${(totalValue / 1_000_000).toFixed(2)}M`,  accent: C.indigo   },
                { label: 'Premium Deals', value: `${premiumDeals.length} of ${deals.length}`,  accent: C.emerald  },
                { label: 'Discount Deals',value: `${discountDeals.length} of ${deals.length}`, accent: C.rose     },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                  <p className="text-base font-black mt-0.5" style={{ color: s.accent }}>{s.value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

    </div>
  );
}