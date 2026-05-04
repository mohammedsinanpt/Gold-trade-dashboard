import React, { useState, useEffect, useRef } from 'react';
import {
  Target, Percent, Star, Users2, Globe, Camera,
  MessageSquare, Briefcase, Plus, MapPin, Calendar,
  TrendingUp, TrendingDown, Footprints, Zap, Award,
  BarChart2, PieChart, ArrowUpRight, ChevronRight,
  Mail, Phone, Eye, MousePointer, DollarSign, Activity
} from 'lucide-react';

// ─── Reusable primitives ───────────────────────────────────────────────────────

const Pill = ({ children, color = 'slate' }) => {
  const map = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    indigo:  'bg-indigo-50  text-indigo-700  ring-indigo-200',
    sky:     'bg-sky-50     text-sky-700     ring-sky-200',
    amber:   'bg-amber-50   text-amber-700   ring-amber-200',
    rose:    'bg-rose-50    text-rose-700    ring-rose-200',
    violet:  'bg-violet-50  text-violet-700  ring-violet-200',
    slate:   'bg-slate-100  text-slate-600   ring-slate-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ring-1 ${map[color]}`}>
      {children}
    </span>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-black tracking-[0.25em] uppercase text-slate-400 mb-4">{children}</p>
);

const Card = ({ children, className = '', gradient = false }) => (
  <div className={`
    bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden
    ${gradient ? 'bg-gradient-to-br from-white to-slate-50/60' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const CardHead = ({ title, sub, action, icon: Icon, accent = 'indigo' }) => {
  const accents = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    sky: 'bg-sky-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
  };
  return (
    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
      <div className="flex items-center space-x-3">
        {Icon && (
          <div className={`w-8 h-8 ${accents[accent]} rounded-xl flex items-center justify-center shadow-sm`}>
            <Icon size={14} className="text-white" />
          </div>
        )}
        <div>
          <p className="text-sm font-black text-slate-800 leading-tight">{title}</p>
          {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

// ─── Animated number counter ──────────────────────────────────────────────────
const AnimNum = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const end = parseFloat(String(value).replace(/[^0-9.]/g, ''));
  useEffect(() => {
    let start = 0;
    const step = end / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  const fmt = end >= 1000 ? Math.round(display).toLocaleString() : display.toFixed(end % 1 !== 0 ? 1 : 0);
  return <span>{prefix}{fmt}{suffix}</span>;
};

// ─── KPI Hero Card ─────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, trend, icon: Icon, sub, accent = 'indigo' }) => {
  const positive = trend && !trend.startsWith('-');
  const accents = {
    indigo:  { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  val: 'text-indigo-700'  },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700' },
    amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   val: 'text-amber-700'   },
    sky:     { bg: 'bg-sky-50',     icon: 'text-sky-600',     val: 'text-sky-700'     },
    violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  val: 'text-violet-700'  },
  };
  const a = accents[accent];
  return (
    <Card className="p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 ${a.bg} rounded-xl flex items-center justify-center`}>
          <Icon size={16} className={a.icon} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-lg ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {positive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className={`text-2xl font-black ${a.val} leading-none mb-1`}>{value}</p>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[9px] text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
};

// ─── Mini Sparkline (SVG) ─────────────────────────────────────────────────────
const Sparkline = ({ data, color = '#6366f1', height = 32 }) => {
  const w = 120, h = height;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  );
};

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 100, stroke = 18 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset * circ}
            strokeLinecap="round"
          />
        );
        offset += pct;
        return el;
      })}
    </svg>
  );
};

// ─── Horizontal Bar ──────────────────────────────────────────────────────────
const HBar = ({ value, max, color = 'bg-indigo-500', height = 'h-1.5' }) => (
  <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
    <div
      className={`${height} ${color} rounded-full transition-all duration-700`}
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);

// ─── Vertical Bar Chart ───────────────────────────────────────────────────────
const BarChart = ({ bars, height = 80 }) => {
  const max = Math.max(...bars.map(b => b.value));
  return (
    <div className="flex items-end space-x-1.5" style={{ height }}>
      {bars.map((b, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div
            className={`w-full rounded-t-md transition-all duration-700 ${b.color || 'bg-indigo-500'}`}
            style={{ height: `${(b.value / max) * (height - 20)}px`, minHeight: 4 }}
          />
          <p className="text-[8px] text-slate-400 font-bold mt-1 truncate w-full text-center">{b.label}</p>
        </div>
      ))}
    </div>
  );
};

// ─── SECTION: Events ──────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: 1,
    name: 'Cityscape Abu Dhabi 2025',
    location: 'ADNEC, Abu Dhabi, UAE',
    dates: 'Jan 22–25, 2025',
    type: 'Exhibition',
    footfall: 14200,
    stallLeads: 312,
    qualifiedLeads: 187,
    converted: 44,
    revenue: '$6.2M',
    status: 'Completed',
    statusColor: 'emerald',
    trend: [40, 80, 180, 260, 312],
  },
  {
    id: 2,
    name: 'Dubai Property Show 2025',
    location: 'Dubai World Trade Centre',
    dates: 'Mar 07–09, 2025',
    type: 'Trade Show',
    footfall: 9800,
    stallLeads: 241,
    qualifiedLeads: 140,
    converted: 31,
    revenue: '$4.1M',
    status: 'Completed',
    statusColor: 'emerald',
    trend: [20, 55, 120, 200, 241],
  },
  {
    id: 3,
    name: 'International Property Expo',
    location: 'Madinat Jumeirah, Dubai',
    dates: 'May 15–17, 2025',
    type: 'Exhibition',
    footfall: 0,
    stallLeads: 0,
    qualifiedLeads: 0,
    converted: 0,
    revenue: '—',
    status: 'Upcoming',
    statusColor: 'amber',
    trend: [],
  },
  {
    id: 4,
    name: 'London Luxury Property Forum',
    location: 'Grosvenor House, London',
    dates: 'Apr 03–04, 2025',
    type: 'Conference',
    footfall: 3200,
    stallLeads: 88,
    qualifiedLeads: 62,
    converted: 18,
    revenue: '$3.8M',
    status: 'Completed',
    statusColor: 'emerald',
    trend: [10, 30, 58, 75, 88],
  },
];

const EventsSection = () => (
  <div className="space-y-4">
    <SectionLabel>Events & Exhibitions</SectionLabel>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {EVENTS.map(ev => (
        <Card key={ev.id} className="hover:shadow-lg transition-all duration-300">
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Pill color={ev.statusColor}>{ev.status}</Pill>
                  <Pill color="slate">{ev.type}</Pill>
                </div>
                <p className="text-sm font-black text-slate-800 leading-tight">{ev.name}</p>
                <div className="flex items-center space-x-3 mt-1.5">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-medium">
                    <MapPin size={9} className="text-slate-300" />
                    <span>{ev.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mt-1 text-[10px] text-slate-400 font-medium">
                  <Calendar size={9} className="text-slate-300" />
                  <span>{ev.dates}</span>
                </div>
              </div>
              {ev.trend.length > 0 && (
                <div className="w-24 ml-3 mt-1">
                  <Sparkline data={ev.trend} color="#6366f1" height={28} />
                  <p className="text-[8px] text-slate-400 text-center mt-0.5">Lead flow</p>
                </div>
              )}
            </div>

            {ev.status === 'Upcoming' ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <p className="text-xs font-bold text-amber-600">Event not yet started</p>
                <p className="text-[10px] text-amber-500 mt-0.5">Pre-registration open · Target: 250 leads</p>
              </div>
            ) : (
              <>
                {/* Footfall + stall */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Footfall', val: ev.footfall.toLocaleString(), icon: Footprints, color: 'text-slate-600' },
                    { label: 'Stall Leads', val: ev.stallLeads, icon: Target, color: 'text-indigo-600' },
                    { label: 'Qualified', val: ev.qualifiedLeads, icon: Award, color: 'text-sky-600' },
                    { label: 'Converted', val: ev.converted, icon: Zap, color: 'text-emerald-600' },
                  ].map(m => (
                    <div key={m.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                      <m.icon size={10} className={`${m.color} mx-auto mb-1`} />
                      <p className={`text-xs font-black ${m.color}`}>{m.val}</p>
                      <p className="text-[8px] text-slate-400 font-bold mt-0.5">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Conversion funnel bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold">
                    <span>Conversion funnel</span>
                    <span className="text-emerald-600">{((ev.converted / ev.stallLeads) * 100).toFixed(1)}% close rate</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-indigo-200 rounded-full" style={{ width: `${(ev.qualifiedLeads / ev.stallLeads) * 100}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full" style={{ width: `${(ev.converted / ev.stallLeads) * 100}%` }} />
                  </div>
                  <div className="flex items-center space-x-3 text-[8px] text-slate-400">
                    <span className="flex items-center space-x-1"><span className="w-2 h-1.5 bg-indigo-200 rounded inline-block" /><span>Qualified</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2 h-1.5 bg-emerald-400 rounded inline-block" /><span>Converted</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <span className="text-[10px] text-slate-400 font-medium">Revenue Attributed</span>
                  <span className="text-sm font-black text-emerald-600">{ev.revenue}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      ))}
    </div>

    {/* Events Summary Bar */}
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black text-slate-700">Events Performance Overview</p>
        <Pill color="indigo">3 Completed · 1 Upcoming</Pill>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Footfall', val: '27,200', color: 'text-slate-700' },
          { label: 'Total Stall Leads', val: '641', color: 'text-indigo-600' },
          { label: 'Qualified Leads', val: '389', color: 'text-sky-600' },
          { label: 'Clients Closed', val: '93', color: 'text-emerald-600' },
          { label: 'Revenue Attributed', val: '$14.1M', color: 'text-emerald-700' },
        ].map(m => (
          <div key={m.label} className="text-center p-3 bg-slate-50 rounded-xl">
            <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{m.label}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─── SECTION: Paid Digital ────────────────────────────────────────────────────
const PaidDigitalSection = () => {
  const googleMonths = [420, 490, 550, 510, 580, 600];
  const metaMonths   = [280, 310, 360, 390, 400, 420];
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div className="space-y-4">
      <SectionLabel>Paid Digital</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Google Ads */}
        <Card>
          <CardHead title="Google Ads" sub="Search & Display Campaigns" icon={Globe} accent="sky" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Monthly Spend', val: '$18,400', icon: DollarSign, color: 'text-slate-700' },
                { label: 'Impressions', val: '284k', icon: Eye, color: 'text-sky-600' },
                { label: 'Clicks', val: '6,240', icon: MousePointer, color: 'text-indigo-600' },
                { label: 'CTR', val: '2.2%', icon: Activity, color: 'text-violet-600' },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-3 flex items-center space-x-3">
                  <m.icon size={14} className={m.color} />
                  <div>
                    <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Keywords */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Keywords</p>
              <div className="space-y-2">
                {[
                  { kw: 'Dubai luxury apartments', clicks: 1840, cpc: '$4.20', conv: '18%' },
                  { kw: 'buy property Dubai', clicks: 1420, cpc: '$5.10', conv: '15%' },
                  { kw: 'off-plan investment UAE', clicks: 980, cpc: '$3.80', conv: '22%' },
                ].map(k => (
                  <div key={k.kw} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-[10px] font-bold text-slate-700">{k.kw}</p>
                      <p className="text-[9px] text-slate-400">{k.clicks.toLocaleString()} clicks · CPC {k.cpc}</p>
                    </div>
                    <Pill color="sky">{k.conv}</Pill>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leads (6 months)</p>
                <p className="text-xs font-black text-sky-600">600 this month</p>
              </div>
              <BarChart bars={months.map((m, i) => ({ label: m, value: googleMonths[i], color: 'bg-sky-400' }))} height={72} />
            </div>

            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-400">CPL</span>
              <span className="text-sky-700">$30.70</span>
            </div>
          </div>
        </Card>

        {/* Meta Ads */}
        <Card>
          <CardHead title="Meta Ads" sub="Facebook & Instagram Paid" icon={Camera} accent="violet" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Monthly Spend', val: '$12,200', icon: DollarSign, color: 'text-slate-700' },
                { label: 'Impressions', val: '520k', icon: Eye, color: 'text-violet-600' },
                { label: 'Clicks', val: '8,800', icon: MousePointer, color: 'text-indigo-600' },
                { label: 'CTR', val: '1.7%', icon: Activity, color: 'text-rose-600' },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-3 flex items-center space-x-3">
                  <m.icon size={14} className={m.color} />
                  <div>
                    <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Audiences */}
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Audience Segments</p>
              <div className="space-y-2">
                {[
                  { seg: 'HNW Investors 35–55', reach: '180k', leads: 198, pct: 100 },
                  { seg: 'Expats UAE Lookalike', reach: '240k', leads: 142, pct: 72 },
                  { seg: 'Retargeting — Site Visitors', reach: '62k', leads: 80, pct: 40 },
                ].map(s => (
                  <div key={s.seg} className="p-2.5 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-bold text-slate-700">{s.seg}</p>
                      <span className="text-[9px] font-bold text-violet-600">{s.leads} leads</span>
                    </div>
                    <HBar value={s.pct} max={100} color="bg-violet-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Leads (6 months)</p>
                <p className="text-xs font-black text-violet-600">420 this month</p>
              </div>
              <BarChart bars={months.map((m, i) => ({ label: m, value: metaMonths[i], color: 'bg-violet-400' }))} height={72} />
            </div>

            <div className="flex items-center justify-between text-xs font-black">
              <span className="text-slate-400">CPL</span>
              <span className="text-violet-700">$29.00</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── SECTION: Messaging & Email ───────────────────────────────────────────────
const MessagingSection = () => (
  <div className="space-y-4">
    <SectionLabel>Messaging & Email Campaigns</SectionLabel>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* WhatsApp */}
      <Card>
        <CardHead title="WhatsApp Broadcast" sub="Direct messaging campaigns" icon={MessageSquare} accent="emerald" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Broadcast Size', val: '12,400', color: 'text-slate-700' },
              { label: 'Responses', val: '1,860', color: 'text-emerald-600' },
              { label: 'Response Rate', val: '15.0%', color: 'text-emerald-700' },
            ].map(m => (
              <div key={m.label} className="bg-slate-50 rounded-xl p-3 text-center">
                <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Campaigns */}
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Recent Campaigns</p>
            {[
              { name: 'New Launch — Palm Vista', sent: '4,200', resp: '680', conv: '26.4%', leads: 180, color: 'emerald' },
              { name: 'Re-engagement — Q1 List', sent: '5,100', resp: '720', conv: '21.2%', leads: 153, color: 'sky' },
              { name: 'Referral Incentive Blast', sent: '3,100', resp: '460', conv: '22.8%', leads: 105, color: 'indigo' },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-700">{c.name}</p>
                  <p className="text-[9px] text-slate-400">Sent {c.sent} · {c.resp} responses</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-600">{c.leads} leads</p>
                  <Pill color={c.color}>{c.conv}</Pill>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <span className="text-[10px] text-slate-400 font-medium">Total Leads · CPL</span>
            <span className="text-xs font-black text-emerald-600">450 leads · $12.40</span>
          </div>
        </div>
      </Card>

      {/* Email */}
      <Card>
        <CardHead title="Email Campaigns" sub="Newsletters & drip sequences" icon={Mail} accent="sky" />
        <div className="p-5 space-y-4">
          {/* Funnel visual */}
          <div className="relative">
            <div className="space-y-2">
              {[
                { label: 'Sent', val: 28000, pct: 100, color: 'bg-slate-200' },
                { label: 'Opened', val: 6272, pct: 22.4, color: 'bg-sky-300' },
                { label: 'Clicked', val: 1344, pct: 4.8, color: 'bg-sky-500' },
                { label: 'Leads', val: 310, pct: 1.1, color: 'bg-sky-700' },
              ].map(f => (
                <div key={f.label} className="flex items-center space-x-3">
                  <div className="w-16 text-right text-[9px] font-bold text-slate-500 shrink-0">{f.label}</div>
                  <div className="flex-1 h-5 bg-slate-50 rounded-lg overflow-hidden relative">
                    <div className={`h-full ${f.color} rounded-lg`} style={{ width: `${f.pct}%`, minWidth: 8 }} />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">
                      {f.val.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-10 text-[9px] font-black text-sky-600 shrink-0">{f.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sequences */}
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Sequences</p>
            {[
              { name: 'New Investor Welcome', emails: 5, openRate: '38.2%', leads: 98 },
              { name: 'Monthly Market Report', emails: 1, openRate: '24.1%', leads: 142 },
              { name: 'Re-engagement (60d)', emails: 3, openRate: '14.4%', leads: 70 },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-2">
                <div>
                  <p className="text-[10px] font-bold text-slate-700">{s.name}</p>
                  <p className="text-[9px] text-slate-400">{s.emails}-email sequence · {s.openRate} open rate</p>
                </div>
                <span className="text-xs font-black text-sky-600">{s.leads} leads</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-50">
            <span className="text-[10px] text-slate-400 font-medium">Total Leads · CPL</span>
            <span className="text-xs font-black text-sky-600">310 leads · $18.20</span>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

// ─── SECTION: Organic & Social ────────────────────────────────────────────────
const OrganicSection = () => {
  const seoTrend = [2100, 2400, 2800, 3100, 2900, 3400];
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

  return (
    <div className="space-y-4">
      <SectionLabel>Organic & Social (Unpaid)</SectionLabel>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SEO Card */}
        <Card className="lg:col-span-1">
          <CardHead title="SEO / Website" sub="Organic search traffic" icon={Globe} accent="emerald" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Monthly Visitors', val: '3,400', color: 'text-emerald-600' },
                { label: 'Organic Leads', val: '380', color: 'text-emerald-700' },
                { label: 'Avg Session', val: '3m 42s', color: 'text-slate-600' },
                { label: 'Bounce Rate', val: '38.2%', color: 'text-slate-600' },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Traffic (6 months)</p>
              <BarChart bars={months.map((m, i) => ({ label: m, value: seoTrend[i], color: 'bg-emerald-400' }))} height={64} />
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Pages</p>
              {[
                { page: '/dubai-off-plan', views: '840' },
                { page: '/luxury-villas', views: '620' },
                { page: '/invest-in-uae', views: '490' },
              ].map(p => (
                <div key={p.page} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-[9px] text-slate-500 font-mono">{p.page}</span>
                  <span className="text-[9px] font-black text-emerald-600">{p.views}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Social Channels */}
        <Card className="lg:col-span-2">
          <CardHead title="Social Media Organic" sub="Instagram · Facebook · LinkedIn — no paid spend" icon={Camera} accent="indigo" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  platform: 'Instagram', icon: Camera, leads: 210, followers: '42.8k',
                  reach: '184k', engRate: '4.2%', posts: 18, color: 'indigo',
                  barColor: 'bg-indigo-400', trend: [90, 130, 160, 195, 200, 210],
                },
                {
                  platform: 'Facebook', icon: MessageSquare, leads: 140, followers: '28.4k',
                  reach: '96k', engRate: '2.8%', posts: 14, color: 'sky',
                  barColor: 'bg-sky-400', trend: [60, 80, 100, 120, 132, 140],
                },
                {
                  platform: 'LinkedIn', icon: Briefcase, leads: 95, followers: '8.2k',
                  reach: '34k', engRate: '5.6%', posts: 8, color: 'violet',
                  barColor: 'bg-violet-400', trend: [40, 55, 65, 78, 88, 95],
                },
              ].map(s => (
                <div key={s.platform} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <s.icon size={12} className={`text-${s.color}-500`} />
                      <p className="text-xs font-black text-slate-700">{s.platform}</p>
                      <Pill color={s.color}>{s.followers} followers</Pill>
                    </div>
                    <p className="text-xs font-black text-emerald-600">{s.leads} leads</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { label: 'Reach', val: s.reach },
                      { label: 'Eng. Rate', val: s.engRate },
                      { label: 'Posts/mo', val: s.posts },
                      { label: 'Leads', val: s.leads },
                    ].map(m => (
                      <div key={m.label} className="bg-white rounded-lg p-2 text-center">
                        <p className="text-[10px] font-black text-slate-700">{m.val}</p>
                        <p className="text-[8px] text-slate-400 font-bold mt-0.5">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${s.barColor} rounded-full`} style={{ width: `${(s.leads / 210) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── SECTION: Referrals ───────────────────────────────────────────────────────
const ReferralsSection = () => (
  <div className="space-y-4">
    <SectionLabel>Referrals & Walk-ins</SectionLabel>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[
        {
          type: 'Client Referrals',
          icon: Users2,
          accent: 'emerald',
          leads: 480,
          conv: '32%',
          cpl: '$0',
          clv: '$340k',
          description: 'Existing clients referring new investors from their network.',
          topReferrers: [
            { name: 'Ahmed Al Rashid', refs: 14, val: '$2.1M' },
            { name: 'Sarah Mitchell', refs: 9,  val: '$1.4M' },
            { name: 'Raj Patel', refs: 7, val: '$980k' },
          ],
          trend: [310, 350, 390, 420, 455, 480],
          months: ['Nov','Dec','Jan','Feb','Mar','Apr'],
        },
        {
          type: 'Partner / Broker',
          icon: Briefcase,
          accent: 'indigo',
          leads: 320,
          conv: '28%',
          cpl: '$18',
          clv: '$280k',
          description: 'Registered brokers and agency partners sending qualified buyers.',
          topReferrers: [
            { name: 'Espace Real Estate', refs: 48, val: '$4.2M' },
            { name: 'Allsopp & Allsopp', refs: 36, val: '$3.8M' },
            { name: 'Betterhomes', refs: 28, val: '$2.1M' },
          ],
          trend: [200, 225, 250, 280, 305, 320],
          months: ['Nov','Dec','Jan','Feb','Mar','Apr'],
        },
        {
          type: 'Cold Walk-ins',
          icon: Footprints,
          accent: 'amber',
          leads: 220,
          conv: '25%',
          cpl: '$0',
          clv: '$65k',
          description: 'Unscheduled visitors to the showroom and sales office.',
          topReferrers: [
            { name: 'Business Bay Office', refs: 94, val: '$820k' },
            { name: 'JBR Showroom', refs: 72, val: '$610k' },
            { name: 'DIFC Pop-up', refs: 54, val: '$440k' },
          ],
          trend: [140, 160, 175, 200, 210, 220],
          months: ['Nov','Dec','Jan','Feb','Mar','Apr'],
        },
      ].map(r => (
        <Card key={r.type}>
          <CardHead title={r.type} sub={r.description} icon={r.icon} accent={r.accent} />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Leads', val: r.leads, color: `text-${r.accent}-600` },
                { label: 'Conv. Rate', val: r.conv, color: `text-${r.accent}-700` },
                { label: 'CPL', val: r.cpl, color: 'text-slate-600' },
                { label: 'Avg CLV', val: r.clv, color: 'text-emerald-600' },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className={`text-sm font-black ${m.color}`}>{m.val}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Top Sources</p>
              {r.topReferrers.map((ref, i) => (
                <div key={ref.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-100 rounded-md flex items-center justify-center text-[8px] font-black text-slate-500">{i + 1}</div>
                    <span className="text-[10px] font-bold text-slate-700">{ref.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-600">{ref.refs} leads</p>
                    <p className="text-[9px] text-emerald-600 font-bold">{ref.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lead Trend</p>
              <BarChart bars={r.months.map((m, i) => ({ label: m, value: r.trend[i], color: `bg-${r.accent}-400` }))} height={56} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

// ─── SECTION: Influencer / Affiliate ─────────────────────────────────────────
const InfluencerSection = () => (
  <div className="space-y-4">
    <SectionLabel>Influencer & Affiliate</SectionLabel>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {[
        {
          handle: '@goldwithaisha',
          platform: 'Instagram',
          platformColor: 'indigo',
          niche: 'Luxury Lifestyle & Property',
          reach: '280k',
          followers: '142k',
          posts: 6,
          leads: 84,
          sales: '$480k',
          commission: '$9,600',
          convRate: '18.4%',
          trend: [12, 18, 24, 30, 38, 42, 48, 56, 62, 70, 76, 84],
        },
        {
          handle: 'AurumInvest',
          platform: 'YouTube',
          platformColor: 'rose',
          niche: 'Investment & Wealth Building',
          reach: '120k',
          followers: '58k',
          posts: 3,
          leads: 52,
          sales: '$210k',
          commission: '$4,200',
          convRate: '14.8%',
          trend: [8, 12, 16, 22, 28, 34, 38, 42, 44, 48, 50, 52],
        },
        {
          handle: 'WealthPRO',
          platform: 'LinkedIn',
          platformColor: 'sky',
          niche: 'B2B Investors & HNW Network',
          reach: '45k',
          followers: '22k',
          posts: 4,
          leads: 28,
          sales: '$180k',
          commission: '$3,600',
          convRate: '22.1%',
          trend: [4, 6, 9, 12, 16, 18, 20, 22, 24, 26, 27, 28],
        },
      ].map(inf => (
        <Card key={inf.handle}>
          <div className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Pill color={inf.platformColor}>{inf.platform}</Pill>
                  <Pill color="slate">{inf.posts} posts</Pill>
                </div>
                <p className="text-sm font-black text-slate-800">{inf.handle}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{inf.niche}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-emerald-600">{inf.sales}</p>
                <p className="text-[9px] text-slate-400">revenue attributed</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Reach', val: inf.reach },
                { label: 'Followers', val: inf.followers },
                { label: 'Leads', val: inf.leads },
              ].map(m => (
                <div key={m.label} className="bg-slate-50 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-black text-slate-700">{m.val}</p>
                  <p className="text-[8px] text-slate-400 font-bold mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 font-bold">Commission Earned</p>
                <p className="text-sm font-black text-indigo-600">{inf.commission}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-bold">Conv. Rate</p>
                <p className="text-sm font-black text-emerald-600">{inf.convRate}</p>
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Lead Accumulation (12 weeks)</p>
              <Sparkline data={inf.trend} color="#6366f1" height={36} />
            </div>
          </div>
        </Card>
      ))}
    </div>

    {/* Affiliate Summary */}
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black text-slate-700">Affiliate Programme Summary</p>
        <Pill color="indigo">3 Active Partners</Pill>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', val: '445k', color: 'text-slate-700' },
          { label: 'Total Leads', val: '164', color: 'text-indigo-600' },
          { label: 'Revenue Attributed', val: '$870k', color: 'text-emerald-600' },
          { label: 'Total Commission', val: '$17,400', color: 'text-amber-600' },
        ].map(m => (
          <div key={m.label} className="text-center p-3 bg-slate-50 rounded-xl">
            <p className={`text-lg font-black ${m.color}`}>{m.val}</p>
            <p className="text-[9px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{m.label}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ─── SECTION: Lead Metrics ────────────────────────────────────────────────────
const CHANNEL_DATA = [
  { ch: 'Partner Referrals', leads: 800, conv: 240, cpl: 18,  clv: 320000, color: '#6366f1' },
  { ch: 'Google Ads',        leads: 600, conv: 90,  cpl: 65,  clv: 95000,  color: '#0ea5e9' },
  { ch: 'WhatsApp',          leads: 450, conv: 81,  cpl: 42,  clv: 120000, color: '#10b981' },
  { ch: 'Events',            leads: 641, conv: 93,  cpl: 95,  clv: 280000, color: '#f59e0b' },
  { ch: 'Walk-in',           leads: 220, conv: 55,  cpl: 0,   clv: 65000,  color: '#64748b' },
  { ch: 'Instagram Org.',    leads: 210, conv: 38,  cpl: 0,   clv: 72000,  color: '#a855f7' },
  { ch: 'Meta Ads',          leads: 420, conv: 50,  cpl: 29,  clv: 88000,  color: '#8b5cf6' },
  { ch: 'Email',             leads: 310, conv: 42,  cpl: 18,  clv: 105000, color: '#14b8a6' },
];

const LeadMetricsSection = () => {
  const maxLeads = Math.max(...CHANNEL_DATA.map(d => d.leads));
  const donutData = CHANNEL_DATA.map(d => ({ value: d.leads, color: d.color }));
  const totalLeads = CHANNEL_DATA.reduce((s, d) => s + d.leads, 0);

  return (
    <div className="space-y-4">
      <SectionLabel>Lead Metrics — Cost · Volume · Conversion</SectionLabel>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Leads (Month)" value="2,450" trend="+18%" icon={Target} sub="all sources combined" accent="indigo" />
        <KpiCard label="Conversion Rate" value="18.4%" trend="+2.1%" icon={Percent} sub="lead to client" accent="emerald" />
        <KpiCard label="Lowest CPL" value="$0 — Walk-in" icon={Star} sub="Best cost efficiency" accent="amber" />
        <KpiCard label="Best Conv. Source" value="Referrals" icon={Users2} sub="30%+ conversion rate" accent="violet" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volume chart */}
        <Card className="lg:col-span-2">
          <CardHead title="Lead Volume by Channel" sub="This month · ranked by volume" icon={BarChart2} accent="indigo" />
          <div className="p-5 space-y-2.5">
            {[...CHANNEL_DATA].sort((a, b) => b.leads - a.leads).map((d, i) => (
              <div key={d.ch} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-slate-100 rounded-md flex items-center justify-center text-[9px] font-black text-slate-500 shrink-0">{i + 1}</div>
                <div className="w-28 text-[10px] font-bold text-slate-600 shrink-0 truncate">{d.ch}</div>
                <div className="flex-1 h-5 bg-slate-50 rounded-lg overflow-hidden relative">
                  <div className="h-full rounded-lg transition-all duration-700" style={{ width: `${(d.leads / maxLeads) * 100}%`, backgroundColor: d.color, opacity: 0.85 }} />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500">{d.leads}</span>
                </div>
                <div className="w-12 text-right text-[9px] font-black shrink-0" style={{ color: d.color }}>
                  {((d.conv / d.leads) * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Donut + CPL */}
        <Card>
          <CardHead title="Lead Share" sub="Volume distribution" icon={PieChart} accent="indigo" />
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <DonutChart segments={donutData} size={120} stroke={22} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-black text-slate-800">{totalLeads.toLocaleString()}</p>
                  <p className="text-[8px] text-slate-400 font-bold">total</p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {CHANNEL_DATA.map(d => (
                <div key={d.ch} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-[9px] text-slate-500 font-bold truncate">{d.ch}</span>
                  </div>
                  <span className="text-[9px] font-black text-slate-700">{((d.leads / totalLeads) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Full Summary Table */}
      <Card>
        <CardHead title="Channel Performance — Full Breakdown" sub="CPL · Volume · Conversion · CLV · Rank" icon={Activity} accent="indigo" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['#', 'Channel', 'Leads', 'Converted', 'Conv. Rate', 'CPL', 'Avg CLV', 'ROI Score'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[...CHANNEL_DATA].sort((a, b) => b.conv / b.leads - a.conv / a.leads).map((r, i) => {
                const convPct = ((r.conv / r.leads) * 100).toFixed(1);
                const roiScore = Math.round((r.conv * (r.clv / 1000)) / (r.cpl || 1) / 100);
                return (
                  <tr key={r.ch} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-5 py-3.5">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-200 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-xs font-bold text-slate-800">{r.ch}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-slate-600">{r.leads.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-emerald-600">{r.conv}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-600">{convPct}%</span>
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${convPct}%`, backgroundColor: r.color }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-indigo-600">{r.cpl === 0 ? '$0' : `$${r.cpl}`}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-slate-600">${(r.clv / 1000).toFixed(0)}k</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className={`w-1.5 h-1.5 rounded-full ${j < Math.min(Math.round(roiScore / 20), 5) ? '' : 'bg-slate-100'}`}
                            style={j < Math.min(Math.round(roiScore / 20), 5) ? { backgroundColor: r.color } : {}} />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// ─── Active Leads Pipeline ────────────────────────────────────────────────────
const LEADS = [
  { id: 1, name: 'Omar Al Farsi',     source: 'Google Ads',     assigned: 'Sales – James',  status: 'Qualified', value: '$1.8M', statusColor: 'emerald' },
  { id: 2, name: 'Priya Nair',        source: 'Instagram',      assigned: 'Sales – Layla',  status: 'Proposal',  value: '$2.2M', statusColor: 'indigo'  },
  { id: 3, name: 'Thomas Müller',     source: 'Referral',       assigned: 'Sales – Ahmed',  status: 'New',       value: '$950k', statusColor: 'sky'     },
  { id: 4, name: 'Fatima Al Zahra',   source: 'WhatsApp',       assigned: 'Sales – James',  status: 'Proposal',  value: '$3.1M', statusColor: 'indigo'  },
  { id: 5, name: 'James Whitfield',   source: 'Email Campaign', assigned: 'Sales – Layla',  status: 'Qualified', value: '$680k', statusColor: 'emerald' },
  { id: 6, name: 'Chen Wei',          source: 'Partner',        assigned: 'Sales – Ahmed',  status: 'New',       value: '$1.4M', statusColor: 'sky'     },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const LeadAcquisition = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const tabs = [
    { id: 'metrics',    label: 'Lead Metrics' },
    { id: 'events',     label: 'Events' },
    { id: 'paid',       label: 'Paid Digital' },
    { id: 'messaging',  label: 'Messaging & Email' },
    { id: 'organic',    label: 'Organic & Social' },
    { id: 'referrals',  label: 'Referrals' },
    { id: 'influencer', label: 'Influencer / Affiliate' },
    { id: 'pipeline',   label: 'Pipeline' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Sub-navigation tabs */}
      <div className="flex items-center space-x-1 bg-slate-100/80 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`
              flex-shrink-0 px-3.5 py-2 rounded-xl text-[10px] font-black transition-all duration-200 whitespace-nowrap
              ${activeTab === t.id
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'}
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sections */}
      {activeTab === 'metrics'    && <LeadMetricsSection />}
      {activeTab === 'events'     && <EventsSection />}
      {activeTab === 'paid'       && <PaidDigitalSection />}
      {activeTab === 'messaging'  && <MessagingSection />}
      {activeTab === 'organic'    && <OrganicSection />}
      {activeTab === 'referrals'  && <ReferralsSection />}
      {activeTab === 'influencer' && <InfluencerSection />}

      {/* Pipeline — always shown or as its own tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-4">
          <SectionLabel>Active Leads Pipeline</SectionLabel>
          <Card>
            <CardHead
              title="Active Leads"
              sub="Current pipeline · 6 active"
              icon={Target}
              accent="indigo"
              action={
                <button className="flex items-center space-x-1.5 bg-indigo-600 text-white text-[10px] font-black px-3 py-1.5 rounded-xl hover:bg-indigo-700 transition-colors">
                  <Plus size={10} />
                  <span>Add Lead</span>
                </button>
              }
            />
            <div className="divide-y divide-slate-50">
              {LEADS.map(l => (
                <div key={l.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 text-[9px] font-black shrink-0">
                      {l.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{l.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{l.source} · {l.assigned}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Pill color={l.statusColor}>{l.status}</Pill>
                    <span className="text-xs font-black text-indigo-600">{l.value}</span>
                    <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LeadAcquisition;