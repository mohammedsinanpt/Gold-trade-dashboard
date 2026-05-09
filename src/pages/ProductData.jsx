// src/pages/ProductData.jsx
// Dealings page — UI only. All data from useProductData(). Never fetches directly.

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  Package, BarChart3, DollarSign, Activity, Clock, ArrowUpRight,
  Coins, CircleDot, ArrowDownLeft, AlertCircle, RefreshCw,
  Loader2, ChevronDown, TrendingUp, Plus,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  AreaChart, Area, ScatterChart, Scatter, ReferenceLine,
  ReferenceArea,
} from 'recharts';

import MetricCard                  from '../components/ui/MetricCard';
import Badge                       from '../components/ui/Badge';
import { Card, CardHeader }        from '../components/ui/Card';
import { IconBtn, SectionDivider } from '../components/ui/Buttons';
import { useProductData }          from '../hooks/useProductData';

// ─── Global constants ─────────────────────────────────────────────────────────
const CLIENT_COLORS = {
  'Al Futtaim Gold': '#4F46E5',
  'Emirates NBD':    '#059669',
  'Malabar Gold':    '#0284C7',
  'Damas LLC':       '#D97706',
  'Joy Alukkas':     '#7C3AED',
  'Kaloti':          '#E11D48',
  'Abu Dhabi Gold':  '#0891B2',
  'Default':         '#64748B',
};
const clientColor = (name) => CLIENT_COLORS[name] ?? CLIENT_COLORS['Default'];

const ZONE = {
  Strong:   { color: '#059669', bg: '#ECFDF5', label: 'Strong'   },
  Healthy:  { color: '#4F46E5', bg: '#EEF2FF', label: 'Healthy'  },
  Marginal: { color: '#D97706', bg: '#FFFBEB', label: 'Marginal' },
  Negative: { color: '#E11D48', bg: '#FFF1F2', label: 'Negative' },
};
const premiumZone = (p) =>
  p >= 8 ? ZONE.Strong : p >= 5 ? ZONE.Healthy : p >= 0 ? ZONE.Marginal : ZONE.Negative;

const MONO = { fontFamily: "'IBM Plex Mono', 'Courier New', monospace" };
const CATALOGUE_AVG_PREMIUM = 4.2;

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:  '#4F46E5', indigoL:  '#EEF2FF',
  amber:   '#D97706', amberL:   '#FFFBEB',
  sky:     '#0284C7', skyL:     '#F0F9FF',
  emerald: '#059669', emeraldL: '#ECFDF5',
  rose:    '#E11D48', roseL:    '#FFF1F2',
  slate:   '#64748B', slateL:   '#F8FAFC',
};

const TYPE_META = {
  Bars:   { color: C.indigo,  bg: C.indigoL,  icon: Package   },
  Coins:  { color: C.sky,     bg: C.skyL,     icon: Coins     },
  Rounds: { color: C.emerald, bg: C.emeraldL, icon: CircleDot },
  Scrap:  { color: C.rose,    bg: C.roseL,    icon: RefreshCw },
};
const typeMeta   = (t) => TYPE_META[t] ?? { color: C.slate, bg: C.slateL, icon: Package };
const karatColor = (k) => (k === '999.9' || k === '999') ? 'amber' : k === '995' ? 'indigo' : 'slate';
const sideColor  = (s) => s === 'Sell-Side' ? 'emerald' : 'sky';
const rankMedal  = (r) => ['🥇','🥈','🥉','4','5'][r - 1] ?? r;
const fmtAed     = (n) => `AED ${Number(n).toLocaleString()}`;

const GRID_TEXTURE = {
  backgroundImage: [
    'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(79,145,255,0.04) 39px, rgba(79,145,255,0.04) 40px)',
    'repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(79,145,255,0.04) 79px, rgba(79,145,255,0.04) 80px)',
  ].join(', '),
};

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const Pill = ({ color, bg, children, sm }) => (
  <span style={{
    background: bg, color, fontWeight: 800, borderRadius: 99,
    fontSize: sm ? 9 : 10, padding: sm ? '1px 6px' : '2px 9px',
    display: 'inline-flex', alignItems: 'center',
  }}>{children}</span>
);

const Bar2 = ({ pct, color, h = 5 }) => (
  <div style={{ height: h, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .5s ease' }} />
  </div>
);

const Dot = ({ color, pulse }) => (
  <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: color, flexShrink: 0,
    animation: pulse ? 'pulseAmber 2s infinite' : 'none',
    boxShadow: pulse ? `0 0 6px ${color}` : 'none',
  }} />
);

const HeatDot = ({ color }) => (
  <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
    background: color, flexShrink: 0, boxShadow: `0 0 5px ${color}60`,
  }} />
);

const Skel = ({ w = '100%', h = 14, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#F1F5F9 25%,#E8EDF3 50%,#F1F5F9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s ease infinite' }} />
);

// ─── MiniSparkline ────────────────────────────────────────────────────────────
const MiniSparkline = ({ data, color }) => {
  if (!data || data.length < 2) return <span style={{ color: '#94A3B8', fontSize: 9 }}>—</span>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 44; const H = 20;
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`
  ).join(' ');
  const lastX = W;
  const lastY = H - ((data[data.length - 1] - min) / range) * (H - 4) - 2;
  const sparkColor = data[data.length - 1] > data[0] ? '#059669' : data[data.length - 1] < data[0] ? '#E11D48' : '#D97706';
  const c = color ?? sparkColor;
  return (
    <svg width={W} height={H} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={c} />
    </svg>
  );
};

// ─── Scatter dot shapes ───────────────────────────────────────────────────────
// Sell-side: filled circle (exactly like screenshot — large solid blue circle)
// Buy-side:  filled diamond (exactly like screenshot — solid amber rotated square)
const SellDot = ({ cx, cy, payload }) => {
  if (!cx || !cy || !payload) return null;
  const color = clientColor(payload.client);
  const r = 9;
  return (
    <circle
      cx={cx} cy={cy} r={r}
      fill={color}
      stroke="#fff" strokeWidth={2.5}
      style={{ filter: `drop-shadow(0 2px 5px ${color}55)`, cursor: 'pointer' }}
    />
  );
};

const BuyDot = ({ cx, cy, payload }) => {
  if (!cx || !cy || !payload) return null;
  const color = clientColor(payload.client);
  const s = 8; // half-size of the diamond
  // Rotated square (diamond): top, right, bottom, left
  const pts = `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`;
  return (
    <polygon
      points={pts}
      fill={color}
      stroke="#fff" strokeWidth={2.5}
      style={{ filter: `drop-shadow(0 2px 5px ${color}55)`, cursor: 'pointer' }}
    />
  );
};

// ─── ScatterTooltip ───────────────────────────────────────────────────────────
const ScatterTooltip = ({ active, payload, avgSpotPrem }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const zone = premiumZone(d.premium);
  const vsAvg = (d.premium - parseFloat(avgSpotPrem)).toFixed(2);
  return (
    <div style={{
      background: '#0C1220', border: '1px solid rgba(79,145,255,0.25)',
      borderRadius: 8, padding: '12px 14px', fontSize: 11,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)', minWidth: 220, zIndex: 100,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ ...MONO, fontWeight: 900, fontSize: 12, color: '#E2E8F0' }}>{d.deal}</span>
        <span style={{ fontSize: 9, fontWeight: 800, color: zone.color, background: `${zone.color}20`, padding: '2px 8px', borderRadius: 3 }}>
          {zone.label.toUpperCase()}
        </span>
      </div>
      {[
        ['Client',   d.client,                                     '#E2E8F0'],
        ['LBMA Fix', `AED ${d.spot?.toFixed(2)}/g`,               '#94A8C8'],
        ['Premium',  `+AED ${d.premium?.toFixed(2)}/g`,            zone.color],
        ['Prem %',   `+${((d.premium / d.spot) * 100).toFixed(2)}%`, '#22D3A5'],
        ['Volume',   `${d.kg ?? '—'} KG`,                         '#94A8C8'],
        ['Side',     d.side === 'sell' ? 'Sell-Side' : 'Buy-Side', d.side === 'sell' ? '#4F46E5' : '#D97706'],
      ].map(([label, val, color]) => (
        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
          <span style={{ color: '#64748B', fontSize: 9 }}>{label}</span>
          <span style={{ color, fontWeight: 800, ...MONO, fontSize: 11 }}>{val}</span>
        </div>
      ))}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 8, paddingTop: 8 }}>
        <span style={{ color: '#64748B', fontSize: 9 }}>vs avg: </span>
        <span style={{ color: parseFloat(vsAvg) > 0 ? '#22D3A5' : '#E11D48', fontWeight: 800, ...MONO, fontSize: 10 }}>
          {parseFloat(vsAvg) > 0 ? '+' : ''}{vsAvg} AED/g
        </span>
      </div>
    </div>
  );
};

// ─── ProfitabilityTooltip ─────────────────────────────────────────────────────
const ProfitabilityTooltip = ({ active, payload, label, mode, normalizedDealBars, avgPremPct }) => {
  if (!active || !payload?.length) return null;
  const base = payload.find(p => p.dataKey === 'baseValue' || p.dataKey === 'basePct')?.value ?? 0;
  const prem = payload.find(p => p.dataKey === 'premiumValue' || p.dataKey === 'premPct')?.value ?? 0;
  const deal = normalizedDealBars.find(d => d.deal === label);
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: 12, fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minWidth: 200 }}>
      <p style={{ margin: '0 0 2px', fontWeight: 900, ...MONO, color: '#0F172A' }}>{label}</p>
      {deal && <p style={{ margin: '0 0 8px', fontSize: 10, color: '#64748B' }}>{deal.client}</p>}
      {mode === 'pct' ? (
        <>
          <p style={{ margin: '2px 0', color: '#64748B' }}>LBMA Base: <strong>{base.toFixed(1)}%</strong></p>
          <p style={{ margin: '2px 0', color: premiumZone(deal?.premiumPerGram ?? 0).color }}>
            Premium: <strong>{prem.toFixed(1)}% of deal value</strong>
          </p>
        </>
      ) : (
        <>
          <p style={{ margin: '2px 0', color: C.indigo }}>LBMA Base: <strong>AED {base.toLocaleString()}</strong></p>
          <p style={{ margin: '2px 0', color: C.amber  }}>Premium: <strong>AED {prem.toLocaleString()}</strong></p>
          <p style={{ margin: '2px 0', color: C.emerald }}>
            Premium %: <strong>{base > 0 ? ((prem / base) * 100).toFixed(2) : '—'}%</strong>
          </p>
        </>
      )}
      {deal && (
        <p style={{ margin: '6px 0 0', paddingTop: 6, borderTop: '1px solid #F1F5F9', fontSize: 9, color: '#94A3B8' }}>
          vs avg: <span style={{ color: deal.premPct > avgPremPct ? C.emerald : C.rose, fontWeight: 800 }}>
            {deal.premPct > avgPremPct ? '+' : ''}{(deal.premPct - avgPremPct).toFixed(2)}%
          </span>
        </p>
      )}
    </div>
  );
};

// ─── TrendDot ─────────────────────────────────────────────────────────────────
const TrendDot = ({ cx, cy, payload, dataKey, data }) => {
  if (!data || !payload) return null;
  const values = data.map(d => d[dataKey]).filter(v => v != null);
  const isMax = payload[dataKey] === Math.max(...values);
  const isMin = payload[dataKey] === Math.min(...values);
  if (!isMax && !isMin) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={4} fill={isMax ? C.emerald : C.rose} stroke="#fff" strokeWidth={2} />
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize={8} fill={isMax ? C.emerald : C.rose} fontWeight={700}>
        {isMax ? '▲ Peak' : '▼ Low'}
      </text>
    </g>
  );
};

// ─── Deal table data ──────────────────────────────────────────────────────────
const dealTable = [
  { id:'GD-1037', client:'Al Futtaim Gold', product:'Bullion Bar 1KG',  type:'Bars',   kg:3.6, spot:285.4, prem:8.2,  premPct:2.87, spread:1.4, finalSell:295.0, revenue:1076400, profit:'Strong',   settlement:'Settled', exposureAed:0       },
  { id:'GD-1041', client:'Emirates NBD',    product:'Bullion Bar 100g', type:'Bars',   kg:2.8, spot:284.8, prem:9.1,  premPct:3.20, spread:1.2, finalSell:295.1, revenue:831640,  profit:'Strong',   settlement:'Settled', exposureAed:0       },
  { id:'GD-1038', client:'Malabar Gold',    product:'Britannia Coin',   type:'Coins',  kg:2.9, spot:286.1, prem:7.8,  premPct:2.73, spread:1.5, finalSell:295.4, revenue:856660,  profit:'Healthy',  settlement:'Settled', exposureAed:0       },
  { id:'GD-1044', client:'Damas LLC',       product:'Bullion Bar 1KG',  type:'Bars',   kg:2.2, spot:287.2, prem:6.4,  premPct:2.23, spread:1.3, finalSell:294.9, revenue:648780,  profit:'Healthy',  settlement:'Pending', exposureAed:648780  },
  { id:'GD-1046', client:'Joy Alukkas',     product:'Investment Round', type:'Rounds', kg:1.8, spot:285.9, prem:8.8,  premPct:3.08, spread:1.1, finalSell:295.8, revenue:532440,  profit:'Strong',   settlement:'Settled', exposureAed:0       },
  { id:'GD-1048', client:'Kaloti',          product:'Bullion Bar 1KG',  type:'Bars',   kg:4.1, spot:288.0, prem:7.2,  premPct:2.50, spread:1.4, finalSell:296.6, revenue:1215660, profit:'Healthy',  settlement:'Pending', exposureAed:1215660 },
  { id:'GD-1039', client:'Malabar Gold',    product:'Commemorative',    type:'Coins',  kg:1.4, spot:284.2, prem:4.1,  premPct:1.44, spread:0.9, finalSell:289.2, revenue:404880,  profit:'Marginal', settlement:'Settled', exposureAed:0       },
  { id:'GD-1040', client:'Damas LLC',       product:'Bullion Bar 100g', type:'Bars',   kg:1.8, spot:283.8, prem:3.8,  premPct:1.34, spread:0.8, finalSell:288.4, revenue:519120,  profit:'Marginal', settlement:'Settled', exposureAed:0       },
  { id:'GD-1043', client:'Emirates NBD',    product:'Investment Round', type:'Rounds', kg:2.1, spot:285.0, prem:4.6,  premPct:1.61, spread:1.0, finalSell:290.6, revenue:610260,  profit:'Marginal', settlement:'Pending', exposureAed:610260  },
  { id:'GD-1045', client:'Al Futtaim Gold', product:'Bullion Bar 1KG',  type:'Bars',   kg:1.2, spot:284.5, prem:3.2,  premPct:1.12, spread:0.7, finalSell:288.4, revenue:346080,  profit:'Marginal', settlement:'Settled', exposureAed:0       },
];

// ─── DealIntelligenceTable ────────────────────────────────────────────────────
const DealIntelligenceTable = ({ clientSparklineData }) => {
  const profitColor = { Strong: C.emerald, Healthy: C.indigo, Marginal: C.amber };
  const settlColor  = { Settled: C.emerald, Pending: C.amber };
  return (
    <div style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ padding: '18px 24px 14px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Deal-Level Analysis</p>
          <p style={{ margin: '3px 0 0', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Premium Intelligence Table</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#22D3A5' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22D3A5', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            LIVE
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '4px 12px', borderRadius: 8 }}>
            {dealTable.length} deals
          </span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#FAFBFF' }}>
            <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
              {['', 'Deal ID', 'Client', 'LBMA Fix', 'Premium', 'Prem %', 'Spread', 'Final Sell', 'KG', 'Profitability', 'Trend', 'Client 7D', 'Settlement'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dealTable.map((d) => {
              const zone = premiumZone(d.prem);
              const pc = profitColor[d.profit] ?? C.slate;
              const sc = settlColor[d.settlement] ?? C.slate;
              const sparkData = clientSparklineData[d.client];
              const sparkColor = sparkData && sparkData.length >= 2
                ? (sparkData[sparkData.length - 1] > sparkData[0] ? C.emerald : C.rose)
                : C.amber;
              const trendIcon  = d.prem >= 7 ? '▲' : d.prem >= 4 ? '→' : '▼';
              const trendColor = d.prem >= 7 ? C.emerald : d.prem >= 4 ? C.amber : C.rose;
              const isHighExposure = d.settlement === 'Pending' && d.exposureAed > 100000;
              return (
                <tr key={d.id}
                  style={{ borderBottom: '1px solid #FAFAFA', borderLeft: `3px solid ${isHighExposure ? C.amber : 'transparent'}`, transition: 'background .12s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 10px 10px 14px' }}><HeatDot color={zone.color} /></td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, fontWeight: 800, color: C.indigo }}>{d.id}</td>
                  <td style={{ padding: '10px 12px', fontSize: 11, fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>{d.client}</td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, color: '#475569' }}>AED {d.spot.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, fontWeight: 900, color: zone.color }}>+AED {d.prem.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: zone.color, background: zone.bg, padding: '2px 7px', borderRadius: 99 }}>+{d.premPct.toFixed(2)}%</span>
                  </td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, color: C.indigo }}>{d.spread.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, fontWeight: 800, color: '#0F172A' }}>AED {d.finalSell.toFixed(2)}</td>
                  <td style={{ padding: '10px 12px', ...MONO, fontSize: 11, fontWeight: 700, color: '#334155' }}>{d.kg}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: pc, background: `${pc}15`, padding: '2px 9px', borderRadius: 99 }}>{d.profit}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: trendColor, fontWeight: 900 }}>{trendIcon}</td>
                  <td style={{ padding: '10px 12px' }}><MiniSparkline data={sparkData} color={sparkColor} /></td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: sc, background: `${sc}15`, padding: '2px 9px', borderRadius: 99 }}>{d.settlement}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── CaptureRateTrend ─────────────────────────────────────────────────────────
const Tip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ margin: 0, fontWeight: 700, color: '#475569' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0 0', color: p.color, fontWeight: 800 }}>{p.name}: {p.value}{unit}</p>
      ))}
    </div>
  );
};

const CaptureRateTrend = ({ captureRateByDay }) => {
  const latest   = captureRateByDay[captureRateByDay.length - 1]?.captureRate ?? 0;
  const avg7     = captureRateByDay.length
    ? +(captureRateByDay.reduce((s, d) => s + d.captureRate, 0) / captureRateByDay.length).toFixed(1)
    : 0;
  const improving = captureRateByDay.length >= 2
    && captureRateByDay[captureRateByDay.length - 1].captureRate > captureRateByDay[0].captureRate;
  const crColor = latest >= 90 ? C.emerald : latest >= 70 ? C.indigo : C.rose;

  return (
    <Card>
      <div style={{ padding: '18px 24px 12px', borderBottom: '1px solid #F8FAFC' }}>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Performance Intelligence</p>
        <p style={{ margin: '3px 0 0', fontSize: 15, fontWeight: 800, color: '#1E293B' }}>7-Day Premium Capture Rate</p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748B' }}>% of deals priced above LBMA Fix · Rolling 7 sessions</p>
      </div>
      <div style={{ padding: '16px 24px 8px', height: 230 }}>
        <ResponsiveContainer>
          <AreaChart data={captureRateByDay}>
            <defs>
              <linearGradient id="captureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.indigo} stopOpacity="0.18" />
                <stop offset="100%" stopColor={C.indigo} stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="premGradCr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.amber} stopOpacity="0.15" />
                <stop offset="100%" stopColor={C.amber} stopOpacity="0.01" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="cr" domain={[40, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={32} />
            <YAxis yAxisId="ap" orientation="right" tick={{ fontSize: 9, fill: C.amber }} axisLine={false} tickLine={false} width={36} />
            <ReferenceArea yAxisId="cr" y1={90} y2={100} fill="#05966906" />
            <ReferenceLine yAxisId="cr" y={90} stroke={C.emerald} strokeDasharray="6 3" strokeWidth={1.5}
              label={{ value: '90% target', position: 'insideTopRight', fontSize: 9, fill: C.emerald, fontWeight: 700 }} />
            <Tooltip content={<Tip unit="%" />} />
            <Area yAxisId="cr" type="monotone" dataKey="captureRate" name="Capture Rate"
              stroke={crColor} strokeWidth={2.5} fill="url(#captureGrad)"
              dot={{ r: 4, fill: crColor, stroke: '#fff', strokeWidth: 2 }} />
            <Area yAxisId="ap" type="monotone" dataKey="avgPrem" name="Avg Prem (AED/g)"
              stroke={C.amber} strokeWidth={1.5} fill="url(#premGradCr)"
              strokeDasharray="5 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: 16, padding: '12px 24px 20px', flexWrap: 'wrap' }}>
        {[
          { label: 'Current',    val: `${latest}%`,                                                color: crColor              },
          { label: '7D Avg',     val: `${avg7}%`,                                                  color: '#64748B'            },
          { label: 'Trend',      val: improving ? '▲ Improving' : '▼ Declining',                   color: improving ? C.emerald : C.rose },
          { label: 'vs Target',  val: `${(latest - 90).toFixed(1)}pp`,                             color: latest >= 90 ? C.emerald : C.rose },
        ].map(c => (
          <span key={c.label} style={{ fontSize: 10, fontWeight: 700, color: '#64748B' }}>
            {c.label}: <strong style={{ color: c.color }}>{c.val}</strong>
          </span>
        ))}
      </div>
    </Card>
  );
};

// ─── CataloguePopover ─────────────────────────────────────────────────────────
const CataloguePopover = ({ product, anchorRect, tableRef }) => {
  if (!product || !anchorRect) return null;
  const LBMA_FIX_AED = 285.40;
  const LBMA_FIX_USD = 77.72;
  const prem      = product.premium ?? 0;
  const spread    = product.spread  ?? 0;
  const finalBuy  = LBMA_FIX_AED + prem;
  const finalSell = finalBuy + spread;
  const premPct   = ((prem / LBMA_FIX_AED) * 100).toFixed(2);
  const CAT_AVG   = 4.2; const CAT_MAX = 10;
  const premColor = prem > 0 ? C.emerald : prem < 0 ? C.rose : C.slate;
  const popoverWidth = 260;
  const tableRect = tableRef?.current?.getBoundingClientRect();
  let top  = anchorRect.top + window.scrollY - 80;
  // Always anchor to the LEFT of the hovered row
  let left = anchorRect.left - popoverWidth - 12;
  // If it would go off-screen to the left, flip it to the right instead
  if (left < (tableRect?.left ?? 0)) left = anchorRect.right + 12;
  left = Math.max(8, Math.min(left, window.innerWidth - popoverWidth - 8));

  return (
    <div style={{
      position: 'fixed', top, left, width: popoverWidth, zIndex: 9999, pointerEvents: 'none',
      background: '#fff', border: '1.5px solid #E0E7FF', borderRadius: 16, padding: 16,
      boxShadow: '0 8px 32px rgba(79,70,229,0.13)', animation: 'fadeSlideUp .18s cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          {React.createElement(typeMeta(product.category).icon, { size: 14, color: typeMeta(product.category).color })}
          <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</span>
        </div>
        <Pill color={typeMeta(product.category).color} bg={typeMeta(product.category).bg} sm>{product.category}</Pill>
      </div>
      <div style={{ height: 1, background: '#F1F5F9', margin: '10px 0' }} />
      <div style={{ marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.12em', textTransform: 'uppercase' }}>LBMA Fix</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 800, color: '#0F172A', ...MONO }}>AED {LBMA_FIX_AED.toFixed(2)} /g</p>
        <p style={{ margin: '1px 0 0', fontSize: 10, color: '#64748B', ...MONO }}>USD {LBMA_FIX_USD.toFixed(2)} /g</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Premium',          val: `${prem >= 0 ? '+' : ''}AED ${prem.toFixed(2)}/g`, sub: `${prem >= 0 ? '+' : ''}${premPct}% over fix`, color: premColor },
          { label: 'Spread',           val: `AED ${spread.toFixed(2)}/g`,                       sub: 'buy↔sell differential',                        color: C.indigo  },
          { label: 'Final Buy Price',  val: `AED ${finalBuy.toFixed(2)}/g`,                     sub: 'fix + premium',                                color: '#0F172A' },
          { label: 'Final Sell Price', val: `AED ${finalSell.toFixed(2)}/g`,                    sub: 'buy + spread',                                 color: '#0F172A' },
        ].map(s => (
          <div key={s.label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '7px 8px' }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 900, color: s.color, ...MONO }}>{s.val}</p>
            <p style={{ margin: '1px 0 0', fontSize: 9, color: '#94A3B8' }}>{s.sub}</p>
          </div>
        ))}
      </div>
      <p style={{ margin: '0 0 5px', fontSize: 9, color: '#64748B' }}>vs catalogue avg premium</p>
      <div style={{ position: 'relative', height: 6, background: '#F1F5F9', borderRadius: 99, marginBottom: 4 }}>
        <div style={{ width: `${Math.min((Math.max(prem, 0) / CAT_MAX) * 100, 100)}%`, height: '100%', background: C.emerald, borderRadius: 99 }} />
        <div style={{ position: 'absolute', left: `${(CAT_AVG / CAT_MAX) * 100}%`, top: -2, width: 2, height: 10, background: C.amber, borderRadius: 1 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#94A3B8' }}>
        <span>0</span><span>Avg +{CAT_AVG}/g</span><span>Max</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Today: <b style={{ color: '#1E293B' }}>{product.today}</b></span>
        <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Month: <b style={{ color: '#1E293B' }}>{product.month}</b></span>
      </div>
    </div>
  );
};

// ─── ExpandedRow ──────────────────────────────────────────────────────────────
const ExpandedRow = ({ product, colCount }) => {
  if (!product) return null;
  const LBMA_FIX  = 285.40;
  const prem      = product.premium ?? 0;
  const spread    = product.spread  ?? 0;
  const finalBuy  = LBMA_FIX + prem;
  const finalSell = finalBuy + spread;
  const premColor = prem > 0 ? C.emerald : prem < 0 ? C.rose : C.slate;
  const CAT_AVG   = 4.2; const CAT_MAX = 10;
  const StatRow = ({ label, value, color = '#1E293B' }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
      <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color, ...MONO }}>{value}</span>
    </div>
  );
  return (
    <tr style={{ animation: 'expandDown .22s cubic-bezier(.16,1,.3,1)' }}>
      <td colSpan={colCount} style={{ padding: 0, background: 'linear-gradient(135deg,#F8FAFF,#EEF2FF)', borderTop: '2px solid #C7D2FE' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr 1px 1fr 1px 1fr', padding: '14px 0' }}>
          {[
            { accent: C.indigo, label: 'Bullion Pricing', rows: [
              ['LBMA Fix',   `AED ${LBMA_FIX.toFixed(2)}/g`],
              ['Premium',    `${prem >= 0 ? '+' : ''}AED ${prem.toFixed(2)}/g`, premColor],
              ['Spread',     `AED ${spread.toFixed(2)}/g`, C.indigo],
              ['Final Buy',  `AED ${finalBuy.toFixed(2)}/g`],
              ['Final Sell', `AED ${finalSell.toFixed(2)}/g`],
            ]},
            { accent: C.sky, label: 'Volume', rows: [
              ['Today',    product.today],
              ['Month',    product.month],
              ['Revenue',  product.rev, C.indigo],
              ['Currency', product.currency],
            ]},
          ].map((sec, si) => (
            <React.Fragment key={si}>
              <div style={{ padding: '0 18px' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 99, background: sec.accent, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>{sec.label}</p>
                    {sec.rows.map(([l, v, c]) => <StatRow key={l} label={l} value={v} color={c} />)}
                  </div>
                </div>
              </div>
              {si < 1 && <div style={{ width: 1, background: '#C7D2FE', alignSelf: 'stretch' }} />}
            </React.Fragment>
          ))}
          <div style={{ width: 1, background: '#C7D2FE', alignSelf: 'stretch' }} />
          <div style={{ padding: '0 18px' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 3, borderRadius: 99, background: C.amber, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Market Position</p>
                <p style={{ margin: '0 0 5px', fontSize: 9, color: '#64748B' }}>Premium vs catalogue avg (+{CAT_AVG} AED/g)</p>
                <div style={{ position: 'relative', height: 8, background: '#F1F5F9', borderRadius: 99, marginBottom: 10 }}>
                  <div style={{ width: `${Math.min((Math.max(prem, 0) / CAT_MAX) * 100, 100)}%`, height: '100%', background: C.indigo, borderRadius: 99 }} />
                  <div style={{ position: 'absolute', left: `${(CAT_AVG / CAT_MAX) * 100}%`, top: -2, width: 2, height: 12, background: C.amber, borderRadius: 1 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ width: `${product.revShare * 2.5}%`, height: '100%', background: C.indigo, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#64748B' }}>Rev. Share {product.revShare}%</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ width: 1, background: '#C7D2FE', alignSelf: 'stretch' }} />
          <div style={{ padding: '0 18px' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 3, borderRadius: 99, background: C.emerald, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 8px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Classification</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <Pill color={typeMeta(product.category).color} bg={typeMeta(product.category).bg}>{product.brand}</Pill>
                  <Badge color={karatColor(product.purity)}>{product.purity}</Badge>
                  <Badge color={sideColor(product.side)}>{product.side}</Badge>
                  {product.isScrap ? <Pill color={C.rose} bg={C.roseL}>Scrap</Pill> : <Pill color={C.emerald} bg={C.emeraldL}>Bullion</Pill>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

// ─── Page-level states ────────────────────────────────────────────────────────
const LoadingView = () => (
  <div className="space-y-6">
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B' }}>
      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>Loading dealings data…</span>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
          <Skel h={10} w="55%" /><div style={{ height: 10 }} />
          <Skel h={26} w="70%" /><div style={{ height: 8 }} />
          <Skel h={10} w="45%" />
        </div>
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}} @keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const ErrorView = ({ message, onRetry }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '60px 24px', background: C.roseL, borderRadius: 16 }}>
    <AlertCircle size={34} color={C.rose} />
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.rose }}>{message}</p>
    <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', fontSize: 12, fontWeight: 800, background: C.rose, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
      <RefreshCw size={13} /> Retry
    </button>
  </div>
);

const EmptyState = ({ label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '44px 24px' }}>
    <Package size={34} color="#CBD5E1" />
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>{label}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ProductData = () => {
  const { data, loading, error, refetch } = useProductData();

  const [hoveredRowId,  setHoveredRowId]  = useState(null);
  const [hoveredRect,   setHoveredRect]   = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [pipelineUnit,  setPipelineUnit]  = useState('KG');
  const [trendRange,    setTrendRange]    = useState('Monthly');
  const [profitMode,    setProfitMode]    = useState('pct');
  const [scatterRange,  setScatterRange]  = useState('30D');
  const [crosshair,     setCrosshair]     = useState({ x: null, y: null });

  const chartWrapRef      = useRef(null);
  const rowRefs           = useRef({});
  const catalogueTableRef = useRef(null);

  const handleRowEnter = useCallback((id) => {
    const el = rowRefs.current[id];
    if (el) { setHoveredRect(el.getBoundingClientRect()); setHoveredRowId(id); }
  }, []);
  const handleRowLeave  = useCallback(() => { setHoveredRowId(null); setHoveredRect(null); }, []);
  const toggleExpand    = useCallback((id) => setExpandedRowId(prev => prev === id ? null : id), []);

  const handleChartMouseMove = useCallback((e) => {
    if (!chartWrapRef.current) return;
    const rect = chartWrapRef.current.getBoundingClientRect();
    setCrosshair({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const handleChartMouseLeave = useCallback(() => setCrosshair({ x: null, y: null }), []);

  // ── Derived computations ──────────────────────────────────────────────────
  const scatterDeals   = data.scatterDeals   ?? [];
  const perDealPremium = data.perDealPremium ?? [];

  const linearRegression = useMemo(() => {
    const d = scatterDeals;
    if (d.length < 2) return null;
    const n    = d.length;
    const sumX  = d.reduce((s, x) => s + x.spot, 0);
    const sumY  = d.reduce((s, x) => s + x.premium, 0);
    const sumXY = d.reduce((s, x) => s + x.spot * x.premium, 0);
    const sumX2 = d.reduce((s, x) => s + x.spot * x.spot, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const yHat  = d.map(x => slope * x.spot + intercept);
    const yMean = sumY / n;
    const ssTot = d.reduce((s, x) => s + Math.pow(x.premium - yMean, 2), 0);
    const ssRes = d.reduce((s, x, i) => s + Math.pow(x.premium - yHat[i], 2), 0);
    const stdDev = Math.sqrt(ssRes / n);
    const r2    = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    const xMin  = Math.min(...d.map(x => x.spot));
    const xMax  = Math.max(...d.map(x => x.spot));
    return { slope, intercept, r2: r2.toFixed(2), stdDev, y1: slope * xMin + intercept, y2: slope * xMax + intercept, xMin, xMax };
  }, [scatterDeals]);

  const clientSparklineData = useMemo(() => {
    const map = {};
    perDealPremium.forEach(d => {
      if (!map[d.client]) map[d.client] = [];
      map[d.client].push(d.premiumPerGram ?? (d.premiumValue / ((d.kg ?? 1) * 1000)));
    });
    Object.keys(map).forEach(k => { map[k] = map[k].slice(-7); });
    return map;
  }, [perDealPremium]);

  const normalizedDealBars = useMemo(() => (
    [...perDealPremium].map(d => ({
      ...d,
      premPct: d.baseValue > 0 ? (d.premiumValue / d.baseValue) * 100 : 0,
      basePct: d.baseValue > 0 ? (d.baseValue / (d.baseValue + d.premiumValue)) * 100 : 100,
    })).sort((a, b) => b.premPct - a.premPct)
  ), [perDealPremium]);

  const captureRateByDay = useMemo(() => {
    const synth = [
      { day: '04-29', captureRate: 88, avgPrem: 5.8 },
      { day: '04-30', captureRate: 91, avgPrem: 6.2 },
      { day: '05-01', captureRate: 86, avgPrem: 5.4 },
    ];
    const dayMap = {};
    perDealPremium.forEach(d => {
      const day = d.date ? d.date.slice(5) : d.deal.slice(-2);
      if (!dayMap[day]) dayMap[day] = { total: 0, above: 0, premSum: 0 };
      dayMap[day].total++;
      if ((d.premiumPerGram ?? 0) > 0) dayMap[day].above++;
      dayMap[day].premSum += d.premiumPerGram ?? 0;
    });
    const derived = Object.entries(dayMap).map(([day, v]) => ({
      day,
      captureRate: v.total > 0 ? +((v.above / v.total) * 100).toFixed(1) : 0,
      avgPrem: v.total > 0 ? +(v.premSum / v.total).toFixed(2) : 0,
    }));
    return [...synth, ...derived].slice(-7);
  }, [perDealPremium]);

  const scatterBounds = useMemo(() => {
    const d = scatterDeals;
    if (!d.length) return { xMin: 280, xMax: 292, yMin: -2, yMax: 12 };
    return {
      xMin: Math.min(...d.map(x => x.spot)) - 0.5,
      xMax: Math.max(...d.map(x => x.spot)) + 0.5,
      yMin: Math.min(...d.map(x => x.premium)) - 1,
      yMax: Math.max(...d.map(x => x.premium)) + 1,
    };
  }, [scatterDeals]);

  const filteredScatter = useMemo(() => {
    if (scatterRange === 'Today')   return scatterDeals.slice(0, 4);
    if (scatterRange === '7D')      return scatterDeals.slice(0, 7);
    if (scatterRange === 'Quarter') return scatterDeals;
    return scatterDeals;
  }, [scatterDeals, scatterRange]);

  const sellRatioTrend = useMemo(() => (
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      sellPct: Math.min(80, Math.max(40, +(58 + Math.sin(i * 0.3) * 8 + i * 0.2).toFixed(1))),
    }))
  ), []);

  // ── Early returns after all hooks ────────────────────────────────────────
  if (loading) return <LoadingView />;
  if (error)   return <ErrorView message={error} onRetry={refetch} />;

  const {
    metrics, hourly, revenueByType, origins, coins,
    monthlyTrend, products, performance, buySell,
    premiumSplit, pipelineData, pipelineStats,
  } = data;

  const totalPrem   = premiumSplit?.total ?? 82600;
  const allDeals    = perDealPremium;
  const avgPremDeal = allDeals.length ? Math.round(allDeals.reduce((s, d) => s + d.premiumValue, 0) / allDeals.length) : 14200;
  const highDeal    = allDeals.reduce((best, d) => d.premiumValue > (best?.premiumValue ?? 0) ? d : best, null);
  const avgSpotPrem = filteredScatter.length
    ? (filteredScatter.reduce((s, d) => s + d.premium, 0) / filteredScatter.length).toFixed(2)
    : '6.8';
  const avgPremPct = normalizedDealBars.length
    ? normalizedDealBars.reduce((s, d) => s + d.premPct, 0) / normalizedDealBars.length
    : 0;

  const topClients = [...allDeals].sort((a, b) => b.premiumValue - a.premiumValue).slice(0, 5);
  const top3Pct    = totalPrem > 0
    ? Math.round(topClients.slice(0, 3).reduce((s, d) => s + d.premiumValue, 0) / totalPrem * 100)
    : 0;

  const catBreakdown = [
    { cat: 'Bars',   prem: 52400, pct: 63, color: C.indigo,  effTarget: '+8.2%', momGrowth: '+12.4%' },
    { cat: 'Coins',  prem: 18600, pct: 23, color: C.sky,     effTarget: '-2.1%', momGrowth: '+6.8%'  },
    { cat: 'Rounds', prem: 11600, pct: 14, color: C.emerald, effTarget: '+1.4%', momGrowth: '+3.2%'  },
  ];

  const latestSellRatio = sellRatioTrend[sellRatioTrend.length - 1]?.sellPct ?? 0;
  const avg7SellRatio   = +(sellRatioTrend.slice(-7).reduce((s, d) => s + d.sellPct, 0) / 7).toFixed(1);
  const sellRatioColor  = latestSellRatio < 60 ? C.rose : latestSellRatio <= 70 ? C.indigo : C.emerald;
  const sellRatioStatus = latestSellRatio < 60 ? 'Below target' : latestSellRatio <= 70 ? 'On target' : 'Strong sell-side';

  const hoveredProduct = hoveredRowId != null ? (products ?? []).find((p, i) => (p.id ?? i) === hoveredRowId) : null;
  const uniqueTypes    = [...new Set((products ?? []).map(p => p.productType))].length;
  const avgCatPremium  = +((products ?? []).filter(p => p.premium != null).reduce((s, p, _, a) => s + p.premium / a.length, 0)).toFixed(2);
  const avgCatSpread   = +((products ?? []).filter(p => p.spread  != null).reduce((s, p, _, a) => s + p.spread  / a.length, 0)).toFixed(2);
  const rankedSkus     = [...(performance ?? [])].sort((a, b) => (b.premiumPerKg ?? 0) - (a.premiumPerKg ?? 0)).map((p, i) => ({ ...p, rank: i + 1 }));

  const TABLE_COLS = ['#','Product','Product Type','Category','Sub Cat.','Brand','Purity','Scrap?','Wt. Today','Wt. Month','Revenue','Currency','Side','Rev. Share','Premium (AED/g)','Spread (AED/g)',''];
  const COL_COUNT  = TABLE_COLS.length;

  const toggleBtn = (active) => ({
    padding: '4px 12px', fontSize: 11, fontWeight: 800,
    border: active ? 'none' : '1px solid #E2E8F0', borderRadius: 8, cursor: 'pointer',
    background: active ? C.indigo : 'transparent',
    color: active ? '#fff' : '#64748B', transition: 'all .15s',
  });

  const TREND_DATA = {
    Daily: [
      { m:'Mon', bars:8,  coins:3, rounds:2, revenue:0.6 },
      { m:'Tue', bars:11, coins:4, rounds:3, revenue:0.9 },
      { m:'Wed', bars:9,  coins:5, rounds:2, revenue:0.8 },
      { m:'Thu', bars:14, coins:6, rounds:4, revenue:1.1 },
      { m:'Fri', bars:12, coins:4, rounds:3, revenue:1.0 },
      { m:'Sat', bars:7,  coins:2, rounds:1, revenue:0.5 },
      { m:'Sun', bars:5,  coins:1, rounds:1, revenue:0.4 },
    ],
    Weekly: [
      { m:'W1 Apr', bars:48, coins:19, rounds:11, revenue:3.6 },
      { m:'W2 Apr', bars:52, coins:22, rounds:13, revenue:3.9 },
      { m:'W3 Apr', bars:46, coins:18, rounds:10, revenue:3.4 },
      { m:'W4 Apr', bars:55, coins:24, rounds:15, revenue:4.1 },
      { m:'W1 May', bars:61, coins:27, rounds:16, revenue:4.6 },
    ],
    Monthly: monthlyTrend ?? [],
  };
  const trendData = TREND_DATA[trendRange] ?? TREND_DATA.Monthly;

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ═══ SECTION 0 — LBMA Live Header ═══════════════════════════════════ */}
      <div style={{
        background: '#0C1220', ...GRID_TEXTURE, borderRadius: 16, padding: '18px 28px',
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22D3A5', display: 'inline-block', animation: 'pulse 2s infinite', boxShadow: '0 0 8px #22D3A5', flexShrink: 0 }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: '#22D3A5', letterSpacing: '0.18em', textTransform: 'uppercase' }}>LBMA LIVE</span>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', ...MONO }}>Fix: AED 285.40/g</span>
        <span style={{ fontSize: 11, color: '#64748B', ...MONO }}>USD 77.72/g</span>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: '#22D3A5', ...MONO }}>Session: +0.12%</span>
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ fontSize: 11, color: '#64748B' }}>AM Fix 10:30 GMT · PM Fix 15:00 GMT</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#22D3A5', background: 'rgba(34,211,165,0.1)', border: '1px solid rgba(34,211,165,0.25)', padding: '6px 14px', borderRadius: 4, letterSpacing: '0.1em' }}>MARKET OPEN</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#4F91FF', background: 'rgba(79,145,255,0.08)', border: '1px solid rgba(79,145,255,0.18)', padding: '6px 14px', borderRadius: 4, ...MONO }}>MTM +18.4%</span>
        </div>
      </div>

      {/* ═══ SECTION 1 — KPI Strip ═══════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Premium Earned', val: `AED ${totalPrem.toLocaleString()}`, sub: 'this month · all deals',                  color: C.indigo,  badge: '▲ +18.4% vs last', icon: '💰', primary: true  },
          { label: 'Highest Premium Deal', val: highDeal ? `AED ${highDeal.premiumValue.toLocaleString()}` : '—', sub: `${highDeal?.deal ?? '—'} · ${highDeal?.client ?? '—'}`, color: C.emerald, badge: 'deal of month', icon: '🏆', primary: true  },
          { label: 'Premium Capture Rate', val: '94.2%',                            sub: 'deals above LBMA Fix',                    color: C.sky,     badge: '▲ +2.1pp vs avg',  icon: '🎯', primary: true  },
          { label: 'Avg Premium / Deal',   val: `AED ${avgPremDeal.toLocaleString()}`, sub: 'per transaction',                       color: C.amber,   badge: null,               icon: '📊', primary: false },
          { label: 'Sell / Buy Split',     val: `${premiumSplit?.sell?.pct ?? 66} / ${premiumSplit?.buy?.pct ?? 34}`, sub: 'premium allocation', color: '#7C3AED', badge: null, icon: '⚖️', primary: false },
          { label: 'Premium Growth',       val: '+18.4%',                           sub: 'vs previous period',                      color: C.rose,    badge: null,               icon: '📈', primary: false },
        ].map((k, idx) => (
          
          <div key={k.label} style={{
            background: '#fff',
            border: '1px solid #F1F5F9',
            borderRadius: 16,
            padding: '20px 20px 16px',
            boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
            transition: 'box-shadow .18s, transform .18s',
            position: 'relative',
            overflow: 'hidden',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px ${k.color}1A`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
          >
            {/* Top accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${k.color}, ${k.color}55)`, borderRadius: '16px 16px 0 0' }} />

            {/* Ambient glow */}
            <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, background: `radial-gradient(circle, ${k.color}12 0%, transparent 70%)`, pointerEvents: 'none' }} />

            {/* Header row: label + icon box */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.15em', lineHeight: 1.4, flex: 1, paddingRight: 8, fontFamily: 'inherit' }}>{k.label}</p>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: `linear-gradient(135deg, ${k.color}18, ${k.color}08)`,
                border: `1px solid ${k.color}22`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>{k.icon}</div>
            </div>

            {/* Value */}
            <p style={{ margin: '0 0 3px', fontSize: k.primary ? 22 : 18, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>{k.val}</p>

            {/* Sub text */}
            <p style={{ margin: '0 0 14px', fontSize: 10, color: '#94A3B8', lineHeight: 1.5, fontWeight: 500, fontFamily: 'inherit' }}>{k.sub}</p>

            {/* Footer: badge or progress bar */}
            {k.badge ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: k.color, background: `${k.color}12`, border: `1px solid ${k.color}25`, padding: '4px 10px', borderRadius: 6 }}>
                {k.badge}
              </div>
            ) : (
              <div>
                <div style={{ height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: idx === 3 ? '72%' : idx === 4 ? `${premiumSplit?.sell?.pct ?? 66}%` : '78%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${k.color}, ${k.color}88)`,
                    borderRadius: 99,
                    transition: 'width 0.6s ease',
                  }} />
                </div>
                <p style={{ margin: '5px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600, fontFamily: 'inherit', paddingBottom: 2 }}>
                {idx === 3 ? '72% of peak' : idx === 4 ? `${premiumSplit?.sell?.pct ?? 66}% sell-side` : '78% of target'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══ SECTION 2 — Product Catalogue ══════════════════════════════════ */}
      <div ref={catalogueTableRef} style={{ background: '#fff', border: '1px solid #F1F5F9', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px', borderBottom: '1px solid #F8FAFC' }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Product Catalogue</p>
            <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>Reference Data · {(products ?? []).length} Products</p>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{uniqueTypes} product types</span>
            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Avg premium: <strong style={{ color: C.emerald, ...MONO }}>AED {avgCatPremium}/g</strong></span>
            <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Avg spread: <strong style={{ color: C.indigo, ...MONO }}>AED {avgCatSpread}/g</strong></span>
            <IconBtn icon={Plus} label="Add Product" variant="primary" onClick={() => {}} />
          </div>
        </div>
        {(products ?? []).length === 0 ? <EmptyState label="No products yet." /> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {TABLE_COLS.map(h => (
                    <th key={h} style={{ padding: '13px 12px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(products ?? []).map((p, i) => {
                  const rowId = p.id ?? i;
                  const pt = typeMeta(p.productType === 'Scrap' ? 'Scrap' : p.category);
                  const isExp = expandedRowId === rowId;
                  const premVal = p.premium;
                  const premColor = premVal == null ? '#94A3B8' : premVal > 0 ? C.emerald : C.rose;
                  const premDisplay = premVal == null ? '—' : `${premVal > 0 ? '+' : ''}${premVal.toFixed(2)}`;
                  const spreadDisplay = p.spread == null ? '—' : p.spread.toFixed(2);
                  return (
                    <React.Fragment key={rowId}>
                      <tr
                        ref={el => { rowRefs.current[rowId] = el; }}
                        style={{ borderBottom: '1px solid #FAFAFA', transition: 'background .14s', background: isExp ? '#F0F4FF' : 'transparent' }}
                        onMouseEnter={() => handleRowEnter(rowId)}
                        onMouseLeave={handleRowLeave}
                      >
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 900, color: '#CBD5E1' }}>{String(i + 1).padStart(2, '0')}</td>
                        <td style={{ padding: '12px 12px', fontSize: 12, fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap' }}>{p.name}</td>
                        <td style={{ padding: '12px 12px' }}><Pill color={pt.color} bg={pt.bg}>{p.productType}</Pill></td>
                        <td style={{ padding: '12px 12px', fontSize: 11, color: '#64748B', fontWeight: 700 }}>{p.category}</td>
                        <td style={{ padding: '12px 12px', fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{p.subCategory}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>{p.brand}</td>
                        <td style={{ padding: '12px 12px' }}><Badge color={karatColor(p.purity)}>{p.purity}</Badge></td>
                        <td style={{ padding: '12px 12px' }}>{p.isScrap ? <Pill color={C.rose} bg={C.roseL}>Scrap</Pill> : <Pill color={C.emerald} bg={C.emeraldL}>Bullion</Pill>}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 800, color: '#334155' }}>{p.today}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 800, color: '#334155' }}>{p.month}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 900, color: C.indigo }}>{p.rev}</td>
                        <td style={{ padding: '12px 12px', fontSize: 10, fontWeight: 800, color: '#94A3B8' }}>{p.currency}</td>
                        <td style={{ padding: '12px 12px' }}><Badge color={sideColor(p.side)}>{p.side}</Badge></td>
                        <td style={{ padding: '12px 12px', minWidth: 110 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ width: `${p.revShare * 2.5}%`, height: '100%', background: C.indigo, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#64748B', minWidth: 26 }}>{p.revShare}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 900, color: premColor, ...MONO }}>{premDisplay}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 800, color: C.indigo, ...MONO }}>{spreadDisplay}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                          <button onClick={() => toggleExpand(rowId)} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid #E8EDF5', background: isExp ? C.indigoL : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ChevronDown size={13} color="#94A3B8" style={{ transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }} />
                          </button>
                        </td>
                      </tr>
                      {isExp && <ExpandedRow product={p} colCount={COL_COUNT} />}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ═══ SECTION 3 — Analytics Row ═══════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }} className="analytics-grid">

        {/* Col A — Revenue vs Premium donut */}
        <div style={{ background: 'linear-gradient(160deg,#FAFBFF,#F0F4FF)', border: '1px solid #E8EDF5', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.07)' }}>
          <CardHeader title="Revenue vs Premium by Type" sub="Revenue contribution vs margin contribution" />
          <div style={{ padding: '12px 24px 0', position: 'relative', height: 170 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={revenueByType ?? []} dataKey="aed" nameKey="type"
                  cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={3} stroke="none">
                  {(revenueByType ?? []).map((_, i) => <Cell key={i} fill={[C.indigo, C.sky, C.emerald][i]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`AED ${v.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', pointerEvents: 'none' }}>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Total</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#0F172A', ...MONO }}>AED 4.04M</p>
            </div>
          </div>
          <div style={{ padding: '8px 24px 16px' }}>
            {(revenueByType ?? []).map((r, i) => {
              const col = [C.indigo, C.sky, C.emerald][i];
              const isMarginLeader = (r.premiumPct ?? 0) > r.pct;
              return (
                <div key={r.type} style={{ padding: '6px 0', borderBottom: i < (revenueByType?.length ?? 0) - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, color: '#1E293B' }}><Dot color={col} />{r.type}</span>
                    <span style={{ fontSize: 8, fontWeight: 800, color: isMarginLeader ? C.emerald : C.amber, background: isMarginLeader ? C.emeraldL : C.amberL, padding: '1px 6px', borderRadius: 3 }}>
                      {isMarginLeader ? 'margin leader' : 'volume driver'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#64748B' }}>
                    <span>Revenue: <strong style={{ color: col }}>{r.pct}%</strong></span>
                    <span>Premium: <strong style={{ color: col, opacity: 0.75 }}>{r.premiumPct ?? '—'}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col B — Capture Rate */}
        <CaptureRateTrend captureRateByDay={captureRateByDay} />

        {/* Col C — Product Origin */}
        <Card>
          <CardHeader title="Product Origin" sub="Brand & refinery · LBMA-listed" />
          <div style={{ padding: '8px 24px 16px' }}>
            {(origins ?? []).map((b, i) => {
              const col = [C.amber, C.indigo, C.sky, C.emerald, C.slate][i % 5];
              const premStr = String(b.avgPremium ?? '');
              const premNum = parseFloat(premStr.replace(/[^0-9.\-]/g, '')) || 0;
              const premColor = premNum >= 0 ? C.emerald : C.rose;
              const delta = (premNum - CATALOGUE_AVG_PREMIUM).toFixed(2);
              const deltaColor = parseFloat(delta) > 0 ? C.emerald : C.rose;
              return (
                <div key={b.brand} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 800, color: '#334155', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Dot color={col} />{b.brand}</span>
                    <span style={{ color: C.indigo, fontWeight: 900 }}>{b.revenue}</span>
                  </div>
                  <Bar2 pct={b.pct * 2} color={col} />
                  <p style={{ margin: '3px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>
                    {b.kg} KG · {b.deals} deals ·{' '}
                    <span style={{ color: premColor, fontWeight: 800 }}>Avg: {b.avgPremium}</span>
                    {' '}·{' '}
                    <span style={{ color: deltaColor, fontWeight: 800 }}>vs cat: {parseFloat(delta) > 0 ? `+${delta}` : delta} AED/g</span>
                  </p>
                </div>
              );
            })}
            <SectionDivider label="Coin Breakdown · Mint · Origin" />
            {(coins ?? []).map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#1E293B' }}>{c.name}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{c.mint} · {c.origin}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Pill color={C.sky} bg={C.skyL} sm>{c.type}</Pill>
                  <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 900, color: '#475569' }}>{c.kg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══ SECTION 4 — Premium Intelligence ═══════════════════════════════ */}
      <div>
        {/* Dark header band */}
            <div style={{
            background: 'linear-gradient(135deg,#0C1220 0%,#111827 60%,#0F1F35 100%)',
            borderRadius: '20px 20px 0 0', padding: '20px 28px',
            borderBottom: '1px solid rgba(79,145,255,0.15)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', position: 'relative', zIndex: 1, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Premium Intelligence</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#94A3B8', position: 'relative', zIndex: 1 }}>Per-deal breakdown · LBMA benchmark · Profitability analysis · UAE bullion market</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#22D3A5', background: 'rgba(34,211,165,0.1)', border: '1px solid rgba(34,211,165,0.25)', padding: '4px 12px', borderRadius: 4 }}>● Live · LBMA Ref</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', padding: '4px 12px', borderRadius: 4, ...MONO }}>AED 285.40/g fix</span>
          </div>
        </div>

        {/* 4A — 72/28 split: scatter + right panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', background: '#fff', border: '1px solid #F1F5F9', borderTop: 'none', borderBottom: 'none' }}>

          {/* Scatter chart */}
          <div style={{ background: 'linear-gradient(160deg,#FAFBFF,#F0F4FF)', border: '1px solid #C7D2FE', borderRight: 'none', borderTop: 'none', minHeight: 520, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 12px', borderBottom: '1px solid #EEF2FF', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Centerpiece Analysis · Deal Distribution</p>
                <p style={{ margin: '3px 0 2px', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Premium vs LBMA Fix — Market Intelligence View</p>
                {/* Legend text matches screenshot exactly */}
                <p style={{ margin: 0, fontSize: 10, color: '#64748B' }}>● Sell-side (circle) · ◆ Buy-side (diamond) · Color = Client</p>
              </div>
              <div style={{ display: 'flex', gap: 3, background: '#F1F5F9', borderRadius: 8, padding: 3, flexShrink: 0 }}>
                {['Today','7D','30D','Quarter'].map(r => (
                  <button key={r} onClick={() => setScatterRange(r)} style={toggleBtn(scatterRange === r)}>{r}</button>
                ))}
              </div>
            </div>

            <div ref={chartWrapRef} style={{ position: 'relative', padding: '8px 8px 4px', height: 460 }}
              onMouseMove={handleChartMouseMove} onMouseLeave={handleChartMouseLeave}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 80, bottom: 50, left: 50 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E8EDF5" vertical={false} />

                  <ReferenceArea yAxisId="yp" y1={scatterBounds.yMin} y2={0}                  fill="#E11D48" fillOpacity={0.05} />
                  <ReferenceArea yAxisId="yp" y1={0}                  y2={5}                  fill="#D97706" fillOpacity={0.05} />
                  <ReferenceArea yAxisId="yp" y1={5}                  y2={8}                  fill="#4F46E5" fillOpacity={0.04} />
                  <ReferenceArea yAxisId="yp" y1={8}                  y2={scatterBounds.yMax} fill="#059669" fillOpacity={0.05} />

                  {/* Trendline confidence band */}
                  {linearRegression && (
                    <ReferenceArea yAxisId="yp"
                      x1={linearRegression.xMin} x2={linearRegression.xMax}
                      y1={linearRegression.y1 - linearRegression.stdDev}
                      y2={linearRegression.y1 + linearRegression.stdDev}
                      fill="#4F46E5" fillOpacity={0.04} stroke="none"
                    />
                  )}

                  <XAxis dataKey="spot" type="number" name="LBMA Fix"
                    domain={[scatterBounds.xMin, scatterBounds.xMax]}
                    tick={{ fontSize: 10, fill: '#94A3B8', ...MONO }}
                    axisLine={{ stroke: '#E2E8F0' }} tickLine={false}
                    label={{ value: 'LBMA Fix Price (AED/g)', position: 'insideBottom', offset: -32, fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                  />
                  <YAxis yAxisId="yp" dataKey="premium" type="number" name="Premium"
                    domain={[scatterBounds.yMin, scatterBounds.yMax]}
                    tick={{ fontSize: 10, fill: '#94A3B8', ...MONO }}
                    axisLine={{ stroke: '#E2E8F0' }} tickLine={false}
                    label={{ value: 'Premium (AED/g)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                  />

                  {/* Trendline */}
                  {linearRegression && (
                    <ReferenceLine yAxisId="yp"
                      segment={[{ x: linearRegression.xMin, y: linearRegression.y1 }, { x: linearRegression.xMax, y: linearRegression.y2 }]}
                      stroke="#4F46E5" strokeDasharray="5 5" strokeWidth={1.5} strokeOpacity={0.4}
                    />
                  )}

                  <ReferenceLine yAxisId="yp" y={parseFloat(avgSpotPrem)} stroke="#D97706" strokeDasharray="8 4" strokeWidth={1.5}
                    label={{ value: `Avg ${avgSpotPrem} AED/g`, position: 'insideTopRight', fontSize: 9, fill: '#D97706', fontWeight: 800 }} />
                  <ReferenceLine yAxisId="yp" y={0}  stroke="#CBD5E1" strokeWidth={1} />
                  <ReferenceLine yAxisId="yp" y={8}  stroke="#059669" strokeDasharray="2 6" strokeWidth={1} strokeOpacity={0.5}
                    label={{ value: 'STRONG ≥8',  position: 'right', fontSize: 8, fill: '#059669', fontWeight: 700, fontFamily: 'IBM Plex Mono' }} />
                  <ReferenceLine yAxisId="yp" y={5}  stroke="#4F46E5" strokeDasharray="2 6" strokeWidth={1} strokeOpacity={0.4}
                    label={{ value: 'HEALTHY ≥5', position: 'right', fontSize: 8, fill: '#4F46E5', fontWeight: 700, fontFamily: 'IBM Plex Mono' }} />
                  <ReferenceLine yAxisId="yp" y={0}  stroke="#D97706" strokeDasharray="2 6" strokeWidth={1} strokeOpacity={0.4}
                    label={{ value: 'MARGINAL',   position: 'right', fontSize: 8, fill: '#D97706', fontWeight: 700, fontFamily: 'IBM Plex Mono' }} />

                  <Tooltip content={<ScatterTooltip avgSpotPrem={avgSpotPrem} />} />

                  {/* Sell-side: large filled circles */}
                  <Scatter yAxisId="yp" name="Sell-Side"
                    data={filteredScatter.filter(d => d.side === 'sell')}
                    shape={<SellDot />}
                  />

                  {/* Buy-side: filled diamonds */}
                  <Scatter yAxisId="yp" name="Buy-Side"
                    data={filteredScatter.filter(d => d.side === 'buy')}
                    shape={<BuyDot />}
                  />
                </ScatterChart>
              </ResponsiveContainer>

              {/* Crosshair */}
              {crosshair.x && crosshair.y && (
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                  <line x1={crosshair.x} y1={0} x2={crosshair.x} y2="100%" stroke="#94A3B8" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                  <line x1={0} y1={crosshair.y} x2="100%" y2={crosshair.y} stroke="#94A3B8" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                </svg>
              )}
            </div>

            <div style={{ padding: '4px 24px 8px' }}>
              <p style={{ margin: 0, fontSize: 9, color: '#94A3B8', ...MONO }}>
                Trend reliability: R² = {linearRegression?.r2 ?? '—'}
                {linearRegression?.r2 >= 0.7 ? ' · Strong correlation' : linearRegression?.r2 >= 0.4 ? ' · Moderate correlation' : ' · Weak correlation'}
              </p>
            </div>

            {/* Chart legend footer — matches screenshot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 24px 16px', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9' }}>
              {/* Sell-side: filled circle */}
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill={C.indigo} /></svg>
                Sell-Side
              </span>
              {/* Buy-side: filled diamond */}
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 13,7 7,13 1,7" fill={C.amber} /></svg>
                Buy-Side
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                <span style={{ color: C.amber, fontSize: 12 }}>—</span>Avg {avgSpotPrem} AED/g
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#94A3B8' }}>
                <span style={{ color: `${C.indigo}80`, fontSize: 12 }}>- -</span>Trendline
              </span>
              <span style={{ width: 1, height: 14, background: '#E2E8F0' }} />
              {[
                { color: C.emerald, label: 'Strong ≥8 AED/g' },
                { color: C.indigo,  label: 'Healthy 5–8'     },
                { color: C.amber,   label: 'Marginal <5'     },
                { color: C.rose,    label: 'Negative'        },
              ].map(z => (
                <span key={z.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#94A3B8' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: `${z.color}30`, border: `1px solid ${z.color}50`, display: 'inline-block' }} />
                  {z.label}
                </span>
              ))}
              <span style={{ width: 1, height: 14, background: '#E2E8F0' }} />
              {[...new Set(filteredScatter.map(d => d.client).filter(Boolean))].map(client => (
                <span key={client} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                  <Dot color={clientColor(client)} />{client.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Right analytics stack */}
          <div style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #E8ECF2' }}>

            {/* R1 — Sell/Buy Ratio Trend */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #E8ECF2' }}>
              <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Sell/Buy Trend · 30 Days</p>
              <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Sell-Side Ratio</p>
              <div style={{ height: 110 }}>
                <ResponsiveContainer>
                  <AreaChart data={sellRatioTrend}>
                    <defs>
                      <linearGradient id="sellRatioGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={sellRatioColor} stopOpacity="0.12" />
                        <stop offset="100%" stopColor={sellRatioColor} stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <ReferenceArea y1={60} y2={70} fill="#4F46E520" />
                    <ReferenceLine y={60} stroke={C.indigo} strokeDasharray="4 3" strokeWidth={1} strokeOpacity={0.4}
                      label={{ value: 'Target 60–70%', position: 'insideTopRight', fontSize: 8, fill: C.indigo, fontWeight: 600 }} />
                    <XAxis dataKey="day" hide />
                    <YAxis domain={[40, 80]} hide />
                    <Tooltip formatter={(v) => [`${v}%`, 'Sell ratio']} />
                    <Area type="monotone" dataKey="sellPct" stroke={sellRatioColor} strokeWidth={2}
                      fill="url(#sellRatioGrad)" dot={false}
                      activeDot={{ r: 6, fill: sellRatioColor, stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: '#64748B' }}>Current: <strong style={{ color: sellRatioColor, ...MONO }}>{latestSellRatio}%</strong></span>
                <span style={{ fontSize: 10, color: '#64748B' }}>7D avg: <strong style={{ ...MONO }}>{avg7SellRatio}%</strong></span>
                <span style={{ fontSize: 10, fontWeight: 700, color: sellRatioColor }}>{sellRatioStatus}</span>
              </div>
            </div>

            {/* R2 — Top Clients */}
            <div style={{ padding: '16px 18px', borderBottom: '1px solid #E8ECF2' }}>
              <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Top Clients</p>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>By Premium Earned</p>
              {topClients.map((d, i) => {
                const sparkData = clientSparklineData[d.client];
                const isUp = sparkData && sparkData.length >= 2 && sparkData[sparkData.length - 1] > sparkData[0];
                const isDown = sparkData && sparkData.length >= 2 && sparkData[sparkData.length - 1] < sparkData[0];
                const sparkColor = isUp ? C.emerald : isDown ? C.rose : C.amber;
                const momentum = isUp
                  ? `▲ +${((sparkData[sparkData.length - 1] - sparkData[0]) / sparkData[0] * 100).toFixed(1)}%`
                  : isDown
                  ? `▼ ${((sparkData[sparkData.length - 1] - sparkData[0]) / sparkData[0] * 100).toFixed(1)}%`
                  : '→ flat';
                return (
                  <div key={d.deal} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < topClients.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{['🥇','🥈','🥉','4','5'][i]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.client}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 9, color: '#94A3B8', ...MONO }}>{d.deal}</span>
                        <span style={{ fontSize: 8, fontWeight: 700, color: sparkColor }}>{momentum}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: C.amber, ...MONO }}>AED {d.premiumValue.toLocaleString()}</span>
                      <MiniSparkline data={sparkData} color={sparkColor} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop: 10, padding: '8px 10px', background: top3Pct > 80 ? C.amberL : '#F8FAFC', borderRadius: 5, borderLeft: `3px solid ${top3Pct > 80 ? C.amber : '#E2E8F0'}` }}>
                <span style={{ fontSize: 9, color: '#64748B', fontWeight: 600 }}>
                  Top 3 clients = <strong style={{ color: top3Pct > 80 ? C.amber : C.indigo }}>{top3Pct}%</strong> of total premium
                  {top3Pct > 80 && <span style={{ color: C.amber, marginLeft: 4 }}>· Concentration risk</span>}
                </span>
              </div>
            </div>

            {/* R3 — Category Breakdown */}
            <div style={{ padding: '16px 18px', flex: 1 }}>
              <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em' }}>By Category</p>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Premium Contribution</p>
              {catBreakdown.map(c => {
                const effColor = c.effTarget.startsWith('+') ? C.emerald : C.rose;
                const momColor = c.momGrowth.startsWith('+') ? C.emerald : C.rose;
                return (
                  <div key={c.cat} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 5 }}><Dot color={c.color} />{c.cat}</span>
                      <span style={{ fontSize: 10, fontWeight: 900, color: c.color, ...MONO }}>AED {(c.prem / 1000).toFixed(0)}K · {c.pct}%</span>
                    </div>
                    <Bar2 pct={c.pct} color={c.color} h={5} />
                    <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
                      <span style={{ fontSize: 9, color: effColor, fontWeight: 700 }}>Efficiency: {c.effTarget}</span>
                      <span style={{ fontSize: 9, color: momColor, fontWeight: 700 }}>MoM: {c.momGrowth}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4B — Profitability bar chart */}
        <div style={{ background: 'linear-gradient(160deg,#FAFBFF,#FFF8EC)', border: '1px solid #FDE68A', borderTop: 'none', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px 12px', borderBottom: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Deal Profitability</p>
              <p style={{ margin: '3px 0 0', fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Premium Capture by Deal — Ranked by Margin Quality</p>
            </div>
            <div style={{ display: 'flex', gap: 3, background: '#F1F5F9', borderRadius: 8, padding: 3 }}>
              {[['pct','% Premium'],['aed','AED Value']].map(([m, l]) => (
                <button key={m} onClick={() => setProfitMode(m)} style={toggleBtn(profitMode === m)}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '8px 24px 8px', height: 220 }}>
            <ResponsiveContainer>
              <BarChart
                data={profitMode === 'pct'
                  ? normalizedDealBars.map(d => ({ ...d, basePct: 100 - d.premPct }))
                  : [...perDealPremium]}
                margin={{ top: 8, right: 16, bottom: 28, left: 0 }}
              >
                <defs>
                  <linearGradient id="baseGradP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94A3B8" /><stop offset="100%" stopColor="#64748B" />
                  </linearGradient>
                  <linearGradient id="premGradP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FCD34D" /><stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="baseGradAed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" /><stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="deal"
                  tick={({ x, y, payload, index }) => {
                    const d = (profitMode === 'pct' ? normalizedDealBars : perDealPremium)[index];
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={12} textAnchor="middle" fontSize={10} fontFamily="IBM Plex Mono" fill="#64748B">{payload.value}</text>
                        {d && <text x={0} y={0} dy={23} textAnchor="middle" fontSize={8} fill="#94A3B8">{d.client?.split(' ')[0]}</text>}
                      </g>
                    );
                  }}
                  axisLine={false} tickLine={false} height={36}
                />
                <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => profitMode === 'pct' ? `${v}%` : `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<ProfitabilityTooltip mode={profitMode} normalizedDealBars={normalizedDealBars} avgPremPct={avgPremPct} />} />
                {profitMode === 'pct' ? (
                  <>
                    <Bar dataKey="basePct"      stackId="a" fill="url(#baseGradP)"   radius={[0,0,4,4]} name="LBMA Base" barSize={40} />
                    <Bar dataKey="premPct"      stackId="a" fill="url(#premGradP)"   radius={[6,6,0,0]} name="Premium"   barSize={40} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="baseValue"    stackId="a" fill="url(#baseGradAed)" radius={[0,0,6,6]} name="LBMA Base" barSize={44} />
                    <Bar dataKey="premiumValue" stackId="a" fill="url(#premGradP)"   radius={[8,8,0,0]} name="Premium"   barSize={44} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4C — Deal Intelligence Table */}
        <div style={{ border: '1px solid #F1F5F9', borderTop: 'none', borderRadius: '0 0 20px 20px', background: '#fff', overflow: 'hidden' }}>
          <DealIntelligenceTable clientSparklineData={clientSparklineData} />
        </div>
      </div>

      {/* ═══ SECTION 5 — Deal Pipeline ═══════════════════════════════════════ */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 24px 16px', borderBottom: '1px solid #F8FAFC' }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Deal Pipeline — Committed vs Settled</p>
            <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>Settlement lag · last 14 days · UAE bullion market</p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 3 }}>
            {['KG','AED'].map(u => <button key={u} onClick={() => setPipelineUnit(u)} style={toggleBtn(pipelineUnit === u)}>{u}</button>)}
          </div>
        </div>

        {(pipelineStats?.unsettledAed ?? 0) > 1000000 && (
          <div style={{ margin: '0 24px 12px', padding: '10px 16px', background: C.roseL, border: '1px solid #FECDD3', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={14} color={C.rose} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.rose }}>
              Unsettled Exposure: AED {((pipelineStats.unsettledAed) / 1e6).toFixed(2)}M · {pipelineStats.pendingCount ?? '—'} deals pending review
            </span>
          </div>
        )}

        <div style={{ padding: '12px 24px 8px', height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={pipelineData ?? []} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="committedFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(2,132,199,0.15)" />
                  <stop offset="100%" stopColor="rgba(2,132,199,0.02)" />
                </linearGradient>
                <linearGradient id="settledFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(79,70,229,0.20)" />
                  <stop offset="100%" stopColor="rgba(79,70,229,0.03)" />
                </linearGradient>
                <linearGradient id="gapFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="rgba(217,119,6,0.13)" />
                  <stop offset="100%" stopColor="rgba(217,119,6,0.02)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const isAed = pipelineUnit === 'AED';
                const com = payload.find(p => p.dataKey === (isAed ? 'committedAed' : 'committed'))?.value ?? 0;
                const set = payload.find(p => p.dataKey === (isAed ? 'settledAed'   : 'settledKg'))?.value  ?? 0;
                const gap = +(com - set).toFixed(isAed ? 0 : 1);
                return (
                  <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, padding: 12, fontSize: 11 }}>
                    <p style={{ margin: 0, fontWeight: 800, color: '#0F172A' }}>{label}</p>
                    <p style={{ margin: '3px 0 0', color: C.sky,    fontWeight: 800 }}>Committed: {isAed ? fmtAed(com) : `${com} KG`}</p>
                    <p style={{ margin: '2px 0 0', color: C.indigo, fontWeight: 800 }}>Settled: {isAed ? fmtAed(set) : `${set} KG`}</p>
                    <p style={{ margin: '2px 0 0', color: C.amber,  fontWeight: 900 }}>Gap: {isAed ? fmtAed(gap) : `${gap} KG`}</p>
                    <div style={{ height: 1, background: '#F1F5F9', margin: '6px 0' }} />
                    <p style={{ margin: 0, color: '#64748B', fontSize: 10 }}>Est. lag: {pipelineStats?.avgLagDays ?? 1.8} days</p>
                  </div>
                );
              }} />
              <Area type="monotone" dataKey={pipelineUnit === 'AED' ? 'committedAed' : 'committed'}        fill="url(#gapFill)"       stroke="none"    fillOpacity={1} legendType="none" />
              <Area type="monotone" dataKey={pipelineUnit === 'AED' ? 'settledAed'   : 'settledKg'}        stroke={C.indigo}          strokeWidth={2.5} fill="url(#settledFill)"    fillOpacity={1} dot={false} activeDot={{ r: 5, fill: C.indigo, stroke: '#fff', strokeWidth: 2 }} name="Settled" />
              <Area type="monotone" dataKey={pipelineUnit === 'AED' ? 'committedAed' : 'committed'}        stroke={C.sky}             strokeWidth={2}   fill="none" strokeDasharray="6 3" dot={false} activeDot={{ r: 5, fill: C.sky, stroke: '#fff', strokeWidth: 2 }} name="Committed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '12px 24px 20px', flexWrap: 'wrap' }}>
          {[
            { icon: Clock,       label: 'Avg Settlement Lag', val: `${pipelineStats?.avgLagDays ?? 1.8} days`,                           color: C.amber,   bg: C.amberL,   border: '#FDE68A' },
            { icon: AlertCircle, label: 'Unsettled Exposure', val: `AED ${((pipelineStats?.unsettledAed ?? 1280000) / 1e6).toFixed(2)}M`, color: C.rose,    bg: C.roseL,    border: '#FECDD3' },
            { icon: TrendingUp,  label: 'Clearance Rate',     val: `${pipelineStats?.clearanceRate ?? 94.2}%`,                           color: C.emerald, bg: C.emeraldL, border: '#A7F3D0' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 10, padding: '10px 14px', flex: 1, minWidth: 160 }}>
              <c.icon size={12} color={c.color} />
              <div>
                <p style={{ margin: 0, fontSize: 9, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 900, color: c.color, ...MONO }}>{c.val}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ═══ SECTION 6 — Monthly Volume Trend ═══════════════════════════════ */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '24px 24px 16px', borderBottom: '1px solid #F8FAFC' }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Monthly Volume Trend</p>
            <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>KG sold per product type — with AED revenue overlay</p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#F1F5F9', borderRadius: 10, padding: 3 }}>
            {['Daily','Weekly','Monthly'].map(r => <button key={r} onClick={() => setTrendRange(r)} style={toggleBtn(trendRange === r)}>{r}</button>)}
          </div>
        </div>
        <div style={{ padding: '12px 24px 8px', height: 230 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="kg"  tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="rev" orientation="right" tick={{ fontSize: 9, fill: C.amber }} axisLine={false} tickLine={false} tickFormatter={v => `${v}M`} />
              <Tooltip content={<Tip unit="" />} />
              <Line yAxisId="kg"  type="monotone" dataKey="bars"    name="Bars"             stroke={C.indigo}  strokeWidth={2.5} dot={(props) => <TrendDot {...props} dataKey="bars"    data={trendData} />} />
              <Line yAxisId="kg"  type="monotone" dataKey="coins"   name="Coins"            stroke={C.sky}     strokeWidth={2}   dot={false} strokeDasharray="5 3" />
              <Line yAxisId="kg"  type="monotone" dataKey="rounds"  name="Rounds"           stroke={C.emerald} strokeWidth={2}   dot={false} strokeDasharray="2 3" />
              <Line yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue (AED M)"  stroke={C.amber}   strokeWidth={2}   dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', gap: 14, padding: '0 24px 16px', flexWrap: 'wrap' }}>
          {[{ l:'Bars',c:C.indigo},{l:'Coins',c:C.sky},{l:'Rounds',c:C.emerald},{l:'Revenue (AED M)',c:C.amber}].map(x => (
            <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
              <Dot color={x.c} />{x.l}
            </span>
          ))}
        </div>
      </Card>

      {/* ═══ SECTION 7 — Brand Revenue + SKU Ranking ═════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Brand Revenue Share" sub="Premium efficiency vs catalogue average" />
          <div style={{ padding: '8px 24px 20px' }}>
            {(origins ?? []).map((b, i) => {
              const col = [C.amber, C.indigo, C.sky, C.emerald, C.slate][i % 5];
              const premStr = String(b.avgPremium ?? '');
              const premNum = parseFloat(premStr.replace(/[^0-9.\-]/g, '')) || 0;
              const premColor = premNum >= 0 ? C.emerald : C.rose;
              const delta = (premNum - CATALOGUE_AVG_PREMIUM).toFixed(2);
              const deltaColor = parseFloat(delta) > 0 ? C.emerald : C.rose;
              return (
                <div key={b.brand} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#1E293B' }}>
                      <Dot color={col} />{b.brand}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 900, color: C.indigo }}>{b.revenue}</span>
                  </div>
                  <Bar2 pct={b.pct * 2} color={col} h={6} />
                  <p style={{ margin: '4px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>
                    {b.kg} KG · {b.deals} deals ·{' '}
                    <span style={{ color: premColor, fontWeight: 800 }}>Avg: {b.avgPremium} premium</span>
                    {' '}·{' '}
                    <span style={{ color: deltaColor, fontWeight: 800 }}>vs cat: {parseFloat(delta) > 0 ? `+${delta}` : delta} AED/g</span>
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <CardHeader title="SKU Performance Ranking" sub="Ranked by premium efficiency (AED/g)" />
          <div style={{ padding: '8px 24px 20px' }}>
            {rankedSkus.map(p => {
              const tc = typeMeta(p.category);
              return (
                <div key={p.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{rankMedal(p.rank)}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#1E293B' }}>{p.name}</span>
                      <Pill color={tc.color} bg={tc.bg} sm>{p.category}</Pill>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1 }}><Bar2 pct={p.revShare * 2.5} color={tc.color} /></div>
                      <span style={{ fontSize: 10, fontWeight: 900, color: tc.color, width: 32 }}>{p.revShare}%</span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>
                      {p.sku} · {p.units} KG / month ·{' '}
                      <span style={{ color: (p.premiumPerKg ?? 0) > 0 ? C.emerald : C.rose, fontWeight: 800, ...MONO }}>
                        {(p.premiumPerKg ?? 0) > 0 ? '+' : ''}{p.premiumPerKg?.toFixed(2) ?? '—'} AED/g prem
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Catalogue hover popover */}
      {hoveredProduct && hoveredRect && (
        <CataloguePopover product={hoveredProduct} anchorRect={hoveredRect} tableRef={catalogueTableRef} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&display=swap');
        @keyframes pulse      { 0%,100%{opacity:1;box-shadow:0 0 8px #22D3A5}  50%{opacity:.5;box-shadow:0 0 16px #22D3A5} }
        @keyframes pulseAmber { 0%,100%{opacity:1;box-shadow:0 0 6px #D97706}  50%{opacity:.5;box-shadow:0 0 12px #D97706} }
        @keyframes fadeSlideUp{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes expandDown { from{opacity:0;transform:scaleY(.85);transform-origin:top} to{opacity:1;transform:scaleY(1)} }
        @keyframes shimmer    { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
        @keyframes spin       { to{transform:rotate(360deg)} }
        @media (max-width:1199px) { .analytics-grid{grid-template-columns:1fr !important} }
      `}</style>
    </div>
  );
};

export default ProductData;