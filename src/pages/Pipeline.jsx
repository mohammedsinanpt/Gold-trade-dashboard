// ─── src/pages/Pipeline.jsx ───────────────────────────────────────────────────
import React from 'react';
import {
  TrendingDown, Clock, MessageSquare, FileText,
  Handshake, Trophy, DollarSign, Target, Zap,
  Users, MapPin, Phone, Smartphone, Globe,
  TrendingUp, BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';

import { Card, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { C } from '../constants/tokens';
import usePipelineData from '../hooks/usePipelineData';

// ─── Typography token ─────────────────────────────────────────────────────────
const mono = { fontFamily: "'DM Mono', monospace" };

// ─── Funnel layout constants ──────────────────────────────────────────────────
// Width  → driven by deal COUNT  (funnel shape — how many deals remain)
// Height → driven by deal VALUE  (thickness — how much each stage is worth)
const FUNNEL_MAX_W  = 100;   // % — widest bar (Enquiry = 100%)
const FUNNEL_MIN_W  = 26;    // % — narrowest bar floor
const DETAIL_COL_W  = 180;   // px — right detail strip width

// ─── Stage UI metadata (icon + color + sub-label — UI layer only, not API) ───
const FUNNEL_META = {
  'Enquiry':      { icon: Users,         sub: '12/day · 84/wk',      light: '#EEF2FF', color: '#6366F1' },
  'Quote Sent':   { icon: FileText,      sub: '56 sent · $4.8M out',  light: '#F5F3FF', color: '#8B5CF6' },
  'Negotiation':  { icon: Handshake,     sub: 'Avg 4.2d at stage',    light: '#FDF2F8', color: '#EC4899' },
  'Verbal Commit':{ icon: MessageSquare, sub: '18 awaiting docs',     light: '#FFFBEB', color: '#F59E0B' },
  'Closed Won':   { icon: Trophy,        sub: '✓ 9 completed',        light: '#ECFDF5', color: '#10B981' },
};

// ─── parseValue: '$10.5M' → 10.5  |  '$800k' → 0.8  (always millions) ────────
function parseValue(str = '') {
  const n = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (str.toUpperCase().includes('M')) return n;
  if (str.toUpperCase().includes('K')) return n / 1000;
  return n / 1_000_000;
}

// ─── Transform: compute pct + dropPct from raw counts ────────────────────────
// API returns raw counts. This function computes all derived values.
// Only this function needs updating if the API response shape changes.
function transformFunnelData(raw = []) {
  const base = raw[0]?.count || 1;
  return raw.map((s, i) => {
    const pct     = +((s.count / base) * 100).toFixed(1);
    const prev    = raw[i - 1]?.count || s.count;
    const dropPct = i === 0 ? null : +(((prev - s.count) / prev) * 100).toFixed(0);
    return { ...s, pct, dropPct };
  });
}

const barVisualW = (pct) =>
  FUNNEL_MIN_W + (FUNNEL_MAX_W - FUNNEL_MIN_W) * (pct / 100);

// ─────────────────────────────────────────────────────────────────────────────
// LOADING / ERROR / EMPTY STATES
// ─────────────────────────────────────────────────────────────────────────────
const SkeletonBlock = ({ h = 'h-32', className = '' }) => (
  <div className={`bg-slate-100 rounded-2xl animate-pulse ${h} ${className}`} />
);

const PipelineSkeleton = () => (
  <div className="space-y-8">
    <SkeletonBlock h="h-80" />
    <div className="grid grid-cols-4 gap-4"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div>
    <div className="grid grid-cols-3 gap-6"><SkeletonBlock className="col-span-2" /><SkeletonBlock /></div>
    <div className="grid grid-cols-2 gap-6"><SkeletonBlock /><SkeletonBlock /></div>
    <div className="grid grid-cols-2 gap-6"><SkeletonBlock /><SkeletonBlock /></div>
    <SkeletonBlock h="h-56" />
  </div>
);

const ErrorState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-96 space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
      <TrendingDown size={20} className="text-rose-500" />
    </div>
    <p className="text-sm font-black text-slate-700">Failed to load pipeline data</p>
    <p style={{ fontSize: 11 }} className="text-slate-400 font-medium">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-96 space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
      <BarChart2 size={20} className="text-slate-300" />
    </div>
    <p className="text-sm font-black text-slate-700">No pipeline data yet</p>
    <p style={{ fontSize: 11 }} className="text-slate-400 font-medium">Data will appear once deals are added</p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SECTION COMPONENTS — each accepts props only, reads no globals
// ─────────────────────────────────────────────────────────────────────────────

// ─── 1. Stage Funnel ──────────────────────────────────────────────────────────
// True trapezoid SVG funnel — each stage narrows as deals drop off.
// Width of each trapezoid top-edge = previous stage count proportion.
// Width of each trapezoid bottom-edge = current stage count proportion.
// Height of each trapezoid = stage value proportion (more $ = taller slice).
// Everything recomputes automatically when data changes.
const StageFunnel = ({ data }) => {
  const funnel = transformFunnelData(data);

  // SVG canvas dimensions
  const SVG_W        = 620;   // total svg width
  const LABEL_LEFT   = 130;   // px reserved left for stage labels
  const BADGE_RIGHT  = 110;   // px reserved right for drop badges
  const CHART_W      = SVG_W - LABEL_LEFT - BADGE_RIGHT; // drawable funnel width
  const CHART_LEFT   = LABEL_LEFT;
  const SEG_GAP      = 3;     // px gap between trapezoid segments
  const MIN_SEG_H    = 44;    // px — minimum slice height
  const MAX_SEG_H    = 92;    // px — maximum slice height
  const CORNER_R     = 6;     // border-radius on bottom corners of each slice

  // Compute each segment height proportional to value
  const maxVal  = Math.max(...funnel.map(s => parseValue(s.value)));
  const minVal  = Math.min(...funnel.map(s => parseValue(s.value)));
  const valRng  = maxVal - minVal || 1;
  const segHeights = funnel.map(s => {
    const t = (parseValue(s.value) - minVal) / valRng;
    return Math.round(MIN_SEG_H + (MAX_SEG_H - MIN_SEG_H) * t);
  });

  // Total SVG height
  const totalH = segHeights.reduce((a, b) => a + b, 0) + SEG_GAP * (funnel.length - 1) + 24;

  // Build trapezoid path for each segment
  // topW and botW are proportional to deal count (0–1 of CHART_W)
  const maxCount = funnel[0]?.count || 1;
  const segments = funnel.map((s, i) => {
    const topPct = s.count / maxCount;                             // this stage count ratio
    const botPct = i < funnel.length - 1
      ? funnel[i + 1].count / maxCount                            // next stage count ratio
      : s.count / maxCount * 0.72;                                // last stage tapers slightly

    const topW  = CHART_W * topPct;
    const botW  = CHART_W * botPct;
    const topX  = CHART_LEFT + (CHART_W - topW) / 2;
    const botX  = CHART_LEFT + (CHART_W - botW) / 2;

    // y position: sum of previous segments + gaps
    const y = segHeights.slice(0, i).reduce((a, b) => a + b, 0) + i * SEG_GAP + 12;
    const h = segHeights[i];

    // Trapezoid with rounded bottom corners using SVG path
    const tl = topX;
    const tr = topX + topW;
    const bl = botX + CORNER_R;
    const br = botX + botW - CORNER_R;
    const path = [
      `M ${tl} ${y}`,
      `L ${tr} ${y}`,
      `L ${botX + botW} ${y + h - CORNER_R}`,
      `Q ${botX + botW} ${y + h} ${br} ${y + h}`,
      `L ${bl} ${y + h}`,
      `Q ${botX} ${y + h} ${botX} ${y + h - CORNER_R}`,
      `Z`,
    ].join(' ');

    // Label position — centred in trapezoid
    const cx   = CHART_LEFT + CHART_W / 2;
    const cy   = y + h / 2;
    const midW = (topW + botW) / 2;

    return { ...s, path, cx, cy, y, h, topW, botW, topX, botX, midW, i };
  });

  const meta    = FUNNEL_META;
  const svgH    = totalH;

  return (
    <Card>
      <CardHeader
        title="Stage-by-Stage Deal Tracking"
        sub="Funnel width = deal count · Slice height = stage value · Narrows as deals drop off"
      />
      <div className="px-6 pt-5 pb-6">

        {/* ── Two-column layout: SVG funnel + right detail strip ── */}
        <div className="flex gap-4 items-start">

          {/* SVG funnel */}
          <div className="flex-1 min-w-0">
            <svg
              viewBox={`0 0 ${SVG_W} ${svgH}`}
              width="100%"
              style={{ display: 'block', overflow: 'visible' }}
            >
              <defs>
                {segments.map((s, i) => {
                  const m     = meta[s.stage] || {};
                  const color = m.color || s.color || '#6366F1';
                  return (
                    <linearGradient key={`fg-${i}`} id={`fg-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%"   stopColor={color} stopOpacity="1" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.8" />
                    </linearGradient>
                  );
                })}
              </defs>

              {segments.map((s, i) => {
                const m      = meta[s.stage] || {};
                const color  = m.color || s.color || '#6366F1';
                const light  = m.light || '#EEF2FF';
                const Icon   = m.icon  || Users;
                // Scale font with midW so value always fits inside the trapezoid
                const midW        = s.midW;
                const valueFontSz = Math.max(11, Math.min(17, midW * 0.058));
                // Option A: hide % OF PIPELINE for the last 2 stages only
                // (Verbal Commit index 3, Closed Won index 4 — too narrow to fit the text)
                // Pct is still visible in the right detail strip so no data is lost.
                const showPct     = i <= 2;

                return (
                  <g key={s.stage}>
                    {/* Trapezoid fill */}
                    <path
                      d={s.path}
                      fill={`url(#fg-${i})`}
                      style={{ filter: `drop-shadow(0 4px 10px ${color}35)` }}
                    />
                    {/* Subtle top-edge highlight */}
                    <line
                      x1={s.topX + 8} y1={s.y + 1}
                      x2={s.topX + s.topW - 8} y2={s.y + 1}
                      stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"
                    />

                    {/* Stage label — left side, always two lines */}
                    <text
                      x={CHART_LEFT - 10}
                      y={s.cy - 7}
                      textAnchor="end"
                      dominantBaseline="middle"
                      style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700,
                               fill: color, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                    >
                      {s.stage}
                    </text>
                    <text
                      x={CHART_LEFT - 10} y={s.cy + 7}
                      textAnchor="end" dominantBaseline="middle"
                      style={{ fontSize: 9, fontFamily: 'sans-serif', fontWeight: 600, fill: '#94A3B8' }}
                    >
                      {s.count} deals
                    </text>
                    {/* Connector line between label and trapezoid */}
                    <line
                      x1={CHART_LEFT - 8} y1={s.cy}
                      x2={s.topX + (s.topW - s.botW) / 2 + 4} y2={s.cy}
                      stroke={`${color}40`} strokeWidth="1" strokeDasharray="3 2"
                    />

                    {/* Centre text: value — vertically centred when pct hidden, offset up when shown */}
                    <text
                      x={s.cx} y={showPct ? s.cy - 8 : s.cy}
                      textAnchor="middle" dominantBaseline="middle"
                      style={{ fontSize: valueFontSz, fontWeight: 900,
                               fill: 'white', fontFamily: 'sans-serif' }}
                    >
                      {s.value}
                    </text>
                    {/* % OF PIPELINE — only rendered when midW >= 160px */}
                    {showPct && (
                      <text
                        x={s.cx} y={s.cy + 8}
                        textAnchor="middle" dominantBaseline="middle"
                        style={{ fontSize: Math.max(7, Math.min(9, midW * 0.030)),
                                 fontWeight: 600, fill: 'rgba(255,255,255,0.65)',
                                 fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em' }}
                      >
                        {s.pct}% OF PIPELINE
                      </text>
                    )}

                    {/* Drop badge — right side */}
                    {s.dropPct && (
                      <g>
                        <line
                          x1={s.topX + s.topW + (CHART_LEFT - s.topX - s.topW) * 0 + 6}
                          y1={s.cy}
                          x2={CHART_LEFT + CHART_W + 8}
                          y2={s.cy}
                          stroke="#FECACA" strokeWidth="1" strokeDasharray="3 2"
                        />
                        <rect
                          x={CHART_LEFT + CHART_W + 10}
                          y={s.cy - 10}
                          width={72} height={20} rx={6}
                          fill="#FEE2E2" stroke="#FECACA" strokeWidth="1"
                        />
                        <text
                          x={CHART_LEFT + CHART_W + 46}
                          y={s.cy + 1}
                          textAnchor="middle" dominantBaseline="middle"
                          style={{ fontSize: 9, fontWeight: 800, fill: '#DC2626',
                                   fontFamily: "'DM Mono', monospace" }}
                        >
                          ▼ {s.dropPct}% drop
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Right detail strip ── */}
          <div className="flex flex-col shrink-0 gap-2" style={{ width: 180 }}>
            {funnel.map((s, si) => {
              const m         = meta[s.stage] || {};
              const color     = m.color || s.color || '#6366F1';
              const light     = m.light || '#EEF2FF';
              const convLabel = s.dropPct ? `${100 - s.dropPct}% converted` : '100% of base';
              return (
                <div key={s.stage}
                     className="px-3 py-2 rounded-xl flex items-center justify-between"
                     style={{ background: light, border: `1px solid ${color}20`,
                              minHeight: segHeights[si] }}>
                  <div className="min-w-0">
                    <p style={{ fontSize: 9, color, fontFamily: "'DM Mono', monospace",
                                letterSpacing: '0.06em' }}
                       className="font-bold uppercase truncate">{m.sub || ''}</p>
                    <p style={{ fontSize: 8 }} className="text-slate-400 font-medium mt-0.5">
                      {s.count} deals
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p style={{ fontSize: 11, color }} className="font-black leading-none">{s.value}</p>
                    <p style={{ fontSize: 9, color: s.dropPct ? '#DC2626' : C.emerald }}
                       className="font-bold mt-0.5">{convLabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Colour legend ── */}
        <div className="flex items-center flex-wrap gap-4 mt-5 pt-4 border-t border-slate-50">
          {funnel.map((s) => {
            const color = (meta[s.stage] || {}).color || s.color;
            return (
              <div key={s.stage} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span style={{ fontSize: 9, fontFamily: "'DM Mono', monospace" }}
                      className="text-slate-400 font-bold uppercase">{s.stage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
// ─── 2. Pipeline Metrics ──────────────────────────────────────────────────────
const PipelineMetricsSection = ({ metrics }) => (
  <Card>
    <CardHeader title="Pipeline Metrics" sub="Full KPI snapshot" />
    <div className="p-6 grid grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.label}
               className={`p-4 rounded-2xl border transition-all hover:shadow-sm cursor-default
                 ${m.highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center
                ${m.highlight ? 'bg-indigo-100' : 'bg-white border border-slate-200'}`}>
                <Icon size={12} className={m.highlight ? 'text-indigo-600' : 'text-slate-500'} />
              </div>
              {m.trend ? <Badge color={m.down ? 'rose' : 'emerald'}>{m.trend}</Badge> : null}
            </div>
            <p style={{ fontSize: 9, ...mono }}
               className="text-slate-400 font-bold uppercase tracking-wider mb-1 leading-tight">{m.label}</p>
            <p className={`text-base font-black leading-tight ${m.highlight ? 'text-indigo-700' : 'text-slate-800'}`}>
              {m.val}
            </p>
          </div>
        );
      })}
    </div>
  </Card>
);

// ─── 3. Enquiry Volume + Channel ─────────────────────────────────────────────
const EnquirySection = ({ dailyData, channelData }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card className="lg:col-span-2">
      <CardHeader
        title="Enquiry Volume"
        sub="Daily count & value — last 7 days"
        action={<Badge color="indigo">This Week: 84 · $10.5M</Badge>}
      />
      <div className="px-6 py-4 h-44">
        <ResponsiveContainer>
          <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="enqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={C.indigo} stopOpacity={0.15} />
                <stop offset="95%" stopColor={C.indigo} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700, fill: C.slate400 }}
                   axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: C.slate200 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: C.white, border: `1px solid ${C.slate200}`, borderRadius: 12, fontSize: 11, fontWeight: 700 }}
              formatter={(v, name) => [name === 'count' ? `${v} deals` : `$${v}M`, name === 'count' ? 'Enquiries' : 'Est. Value']}
            />
            <Area type="monotone" dataKey="count" stroke={C.indigo} strokeWidth={2.5}
                  fill="url(#enqGrad)" dot={{ fill: C.indigo, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="px-6 pb-5 grid grid-cols-4 gap-3">
        {dailyData.slice(-4).map((d) => (
          <div key={d.day} className="bg-slate-50 rounded-xl p-3 text-center">
            <p style={{ fontSize: 9, ...mono }} className="text-slate-400 font-bold uppercase">{d.day}</p>
            <p className="text-lg font-black text-slate-800">{d.count}</p>
            <p className="text-[9px] text-indigo-500 font-bold">${d.value}M</p>
          </div>
        ))}
      </div>
    </Card>

    <Card>
      <CardHeader title="Enquiry by Channel" sub="Walk-in · Call · App · Online" />
      <div className="px-6 py-4 space-y-4">
        {channelData.map((e) => {
          const Icon = e.icon;
          return (
            <div key={e.ch}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                       style={{ background: `${e.color}18` }}>
                    <Icon size={10} style={{ color: e.color }} />
                  </div>
                  <span style={{ fontSize: 10 }} className="font-bold text-slate-600">{e.ch}</span>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 10 }} className="font-black text-slate-700">{e.count}</p>
                  <p style={{ fontSize: 9, color: e.color }} className="font-bold">{e.value}</p>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${e.pct}%`, background: e.color }} />
              </div>
              <p className="text-right text-[9px] text-slate-400 font-bold mt-0.5">{e.pct}%</p>
            </div>
          );
        })}
      </div>
    </Card>
  </div>
);

// ─── 4. Quote + Negotiation ───────────────────────────────────────────────────
const QuoteNegotiationSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader title="Quote Stage" sub="Quotes sent and outstanding value"
                  action={<Badge color="indigo">56 Active</Badge>} />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Quotes Sent',       val: '56',    sub: 'this period',     color: '#8B5CF6', bg: '#F5F3FF' },
            { label: 'Outstanding Value', val: '$4.8M', sub: 'awaiting reply',  color: C.indigo,  bg: C.indigoLight },
            { label: 'Total Quote Value', val: '$7.0M', sub: 'all open quotes', color: '#EC4899', bg: '#FDF2F8' },
            { label: 'Avg Quote Value',   val: '$125k', sub: 'per deal',        color: C.amber,   bg: '#FFFBEB' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl" style={{ background: item.bg }}>
              <p style={{ fontSize: 9, ...mono, letterSpacing: '0.1em', color: C.slate400 }}
                 className="font-bold uppercase mb-1">{item.label}</p>
              <p className="text-xl font-black" style={{ color: item.color }}>{item.val}</p>
              <p style={{ fontSize: 9 }} className="text-slate-400 font-medium mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-50">
          <p style={{ fontSize: 10 }} className="font-bold text-slate-500 mb-2">Quote Age Distribution</p>
          <div className="space-y-1.5">
            {[
              { label: '0–3 days',  count: 22, pct: 39, color: '#8B5CF6' },
              { label: '4–7 days',  count: 18, pct: 32, color: '#A78BFA' },
              { label: '8–14 days', count: 11, pct: 20, color: '#C4B5FD' },
              { label: '15+ days',  count: 5,  pct: 9,  color: '#DDD6FE' },
            ].map((a) => (
              <div key={a.label} className="flex items-center space-x-2">
                <span style={{ fontSize: 9, width: 55 }} className="text-slate-400 font-bold shrink-0">{a.label}</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${a.pct}%`, background: a.color }} />
                </div>
                <span style={{ fontSize: 9, width: 14 }} className="text-slate-500 font-black text-right">{a.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>

    <Card>
      <CardHeader title="Negotiation Stage" sub="Price, weight & delivery discussions"
                  action={<Badge color="rose">31 Active</Badge>} />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Deals Active', val: '31',    color: '#EC4899', bg: '#FDF2F8' },
            { label: 'Avg Days',     val: '4.2',   color: C.amber,   bg: '#FFFBEB' },
            { label: 'Total Value',  val: '$4.3M', color: '#8B5CF6', bg: '#F5F3FF' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-2xl text-center" style={{ background: item.bg }}>
              <p style={{ fontSize: 9, ...mono }} className="text-slate-400 font-bold uppercase mb-1">{item.label}</p>
              <p className="text-xl font-black" style={{ color: item.color }}>{item.val}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-slate-50">
          <p style={{ fontSize: 10 }} className="font-bold text-slate-500 mb-3">Negotiation Topics</p>
          <div className="space-y-2">
            {[
              { topic: 'Price Negotiation', count: 18, pct: 58, color: '#EC4899' },
              { topic: 'Weight / Volume',   count: 8,  pct: 26, color: C.amber },
              { topic: 'Delivery Terms',    count: 5,  pct: 16, color: '#8B5CF6' },
            ].map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontSize: 10 }} className="font-bold text-slate-600">{t.topic}</span>
                  <span style={{ fontSize: 10, color: t.color }} className="font-black">{t.count} deals</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-2 border-t border-slate-50">
          <p style={{ fontSize: 10 }} className="font-bold text-slate-500 mb-2">Days Spent at Stage</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '1–2d', count: 8,  color: C.emerald },
              { label: '3–4d', count: 12, color: C.amber },
              { label: '5–7d', count: 7,  color: '#F97316' },
              { label: '7d+',  count: 4,  color: C.rose },
            ].map((d) => (
              <div key={d.label} className="p-2 rounded-xl bg-slate-50 text-center">
                <p style={{ fontSize: 9 }} className="text-slate-400 font-bold">{d.label}</p>
                <p className="text-sm font-black" style={{ color: d.color }}>{d.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// ─── 5. Verbal + Closed Won ───────────────────────────────────────────────────
const VerbalClosedSection = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader title="Verbal Commitment" sub="Agreed verbally — paperwork pending"
                  action={<Badge color="amber">18 Pending</Badge>} />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">
          <div>
            <p style={{ fontSize: 9, ...mono }} className="text-amber-400 font-bold uppercase mb-1">Awaiting Paperwork</p>
            <p className="text-3xl font-black text-amber-600">18</p>
            <p style={{ fontSize: 10 }} className="text-amber-500 font-bold mt-0.5">$2.6M total value</p>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-amber-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-base font-black text-amber-600">18</p>
              <p style={{ fontSize: 7 }} className="text-amber-400 font-bold">OPEN</p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p style={{ fontSize: 10 }} className="font-bold text-slate-500">Time Since Verbal Agreement</p>
          {[
            { label: 'Today',    count: 4, pct: 22, color: C.emerald },
            { label: '1–2 days', count: 7, pct: 39, color: C.amber },
            { label: '3–5 days', count: 5, pct: 28, color: '#F97316' },
            { label: '5+ days',  count: 2, pct: 11, color: C.rose },
          ].map((v) => (
            <div key={v.label} className="flex items-center space-x-2">
              <span style={{ fontSize: 9, width: 52 }} className="text-slate-400 font-bold shrink-0">{v.label}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.color }} />
              </div>
              <span style={{ fontSize: 9 }} className="font-black text-slate-600 w-4 text-right">{v.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>

    <Card>
      <CardHeader title="Closed Won" sub="Completed — payment received · gold delivered"
                  action={<Badge color="emerald">9 Closed</Badge>} />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Deals Won',   val: '9',     color: C.emerald, bg: '#ECFDF5', icon: Trophy },
            { label: 'Total Value', val: '$1.8M', color: '#059669', bg: '#D1FAE5', icon: DollarSign },
            { label: 'Avg Deal',    val: '$200k', color: '#047857', bg: '#A7F3D0', icon: Target },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-3 rounded-2xl text-center" style={{ background: item.bg }}>
                <Icon size={14} className="mx-auto mb-1" style={{ color: item.color }} />
                <p style={{ fontSize: 9 }} className="text-slate-500 font-bold mb-0.5">{item.label}</p>
                <p className="text-lg font-black" style={{ color: item.color }}>{item.val}</p>
              </div>
            );
          })}
        </div>
        <div className="space-y-2 pt-1">
          <p style={{ fontSize: 10 }} className="font-bold text-slate-500">Recent Closed Deals</p>
          {[
            { ref: 'GLD-0091', val: '$310k', agent: 'Priya S.',  status: 'Delivered' },
            { ref: 'GLD-0089', val: '$245k', agent: 'Mark T.',   status: 'Delivered' },
            { ref: 'GLD-0087', val: '$190k', agent: 'Aisha K.',  status: 'Delivered' },
            { ref: 'GLD-0085', val: '$175k', agent: 'James R.',  status: 'Processing' },
          ].map((deal) => (
            <div key={deal.ref} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <div>
                <p style={{ fontSize: 10 }} className="font-black text-slate-700">{deal.ref}</p>
                <p style={{ fontSize: 9 }} className="text-slate-400 font-medium">{deal.agent}</p>
              </div>
              <div className="flex items-center space-x-2">
                <p style={{ fontSize: 10 }} className="font-black text-emerald-600">{deal.val}</p>
                <Badge color={deal.status === 'Delivered' ? 'emerald' : 'amber'}>{deal.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  </div>
);

// ─── 6. Closed Lost ───────────────────────────────────────────────────────────
const ClosedLostSection = ({ reasons }) => (
  <Card>
    <CardHeader
      title="Closed Lost Analysis"
      sub="Drop-off reasons tracked across all stages"
      action={<Badge color="rose">90 Lost · 89.3% drop-off</Badge>}
    />
    <div className="p-6">
      <div className="grid grid-cols-5 gap-4 mb-6">
        {reasons.map((r) => (
          <div key={r.reason} className="text-center group cursor-default">
            <div className="h-28 bg-slate-50 rounded-2xl overflow-hidden flex items-end mb-3 relative">
              <div className="absolute inset-x-0 bottom-0 rounded-t-2xl transition-all duration-300 group-hover:opacity-90"
                   style={{ height: `${r.pct}%`, background: r.color }} />
            </div>
            <p style={{ fontSize: 9, ...mono }} className="text-slate-400 font-bold uppercase tracking-wider">{r.reason}</p>
            <p className="text-lg font-black text-slate-700">{r.count}</p>
            <p style={{ fontSize: 9, color: r.color }} className="font-black">{r.pct}%</p>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 pt-5">
        <p style={{ fontSize: 10 }} className="font-bold text-slate-500 mb-3">Loss Distribution by Stage</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { stage: 'Enquiry → Quote',      lost: 28, pct: 31, color: C.indigo },
            { stage: 'Quote → Negotiation',  lost: 25, pct: 28, color: '#8B5CF6' },
            { stage: 'Negotiation → Verbal', lost: 13, pct: 14, color: '#EC4899' },
            { stage: 'Verbal → Won',         lost: 9,  pct: 10, color: C.amber },
          ].map((s) => (
            <div key={s.stage} className="p-3 rounded-2xl"
                 style={{ background: `${s.color}0D`, border: `1px solid ${s.color}20` }}>
              <p style={{ fontSize: 9 }} className="text-slate-500 font-bold mb-2 leading-tight">{s.stage}</p>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.lost}</p>
              <p style={{ fontSize: 9 }} className="font-bold text-slate-400 mt-0.5">{s.pct}% of total lost</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Card>
);

// ─── Root page component ──────────────────────────────────────────────────────
const Pipeline = () => {
  const {
    funnelStages,
    dailyEnquiries,
    channelData,
    metrics,
    lostReasons,
    loading,
    error,
  } = usePipelineData();

  if (loading) return <PipelineSkeleton />;
  if (error)   return <ErrorState message={error} />;
  if (!funnelStages?.length) return <EmptyState />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');`}</style>

      <StageFunnel         data={funnelStages} />
      <PipelineMetricsSection metrics={metrics} />
      <EnquirySection      dailyData={dailyEnquiries} channelData={channelData} />
      <QuoteNegotiationSection />
      <VerbalClosedSection />
      <ClosedLostSection   reasons={lostReasons} />
    </div>
  );
};

export default Pipeline;