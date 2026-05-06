import React, { useState, useEffect } from 'react';
import {
  Users, Target, CheckCircle2, Clock, UserCheck, Activity,
  Phone, Mail, Video, ChevronRight, Plus, XCircle,
  AlertTriangle, ChevronDown, TrendingUp, TrendingDown,
  Award, Star, Zap, ArrowUpRight, ArrowDownRight,
  Globe, BarChart2, Flame, Crown,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from 'recharts';

import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { IconBtn } from '../components/ui/Buttons';
import { ALERTS, REMINDERS, INTERACTIONS, revData, TOP_CLIENTS, LEADS } from '../data/mockData';

// ── Gold spot price ticker data (mock — replace with live feed in production) ──
const SPOT_PRICES = [
  { label: 'XAU/USD', price: '3,312.40', change: '+18.20', pct: '+0.55%', up: true },
  { label: 'XAU/AED', price: '12,162.80', change: '+66.90', pct: '+0.55%', up: true },
  { label: 'XAU/GBP', price: '2,598.15', change: '-4.30', pct: '-0.17%', up: false },
  { label: '24K / g', price: '106.54', change: '+0.59', pct: '+0.55%', up: true },
  { label: '22K / g', price: '97.66', change: '+0.54', pct: '+0.55%', up: true },
  { label: 'XAG/USD', price: '32.88', change: '+0.22', pct: '+0.67%', up: true },
];

// ── Lead source breakdown ──
const LEAD_SOURCES = [
  { source: 'Google Ads', count: 18, pct: 36, color: 'bg-indigo-500' },
  { source: 'Referral',   count: 14, pct: 28, color: 'bg-emerald-500' },
  { source: 'Walk-in',    count: 10, pct: 20, color: 'bg-amber-400' },
  { source: 'Exhibition', count: 5,  pct: 10, color: 'bg-sky-500' },
  { source: 'WhatsApp',   count: 3,  pct: 6,  color: 'bg-rose-400' },
];

// ── Team performance snapshot ──
const TEAM_REPS = [
  { name: 'S. Abraham', deals: 14, revenue: '$420k', target: 82, avatar: 'SA', rank: 1 },
  { name: 'J. Doe',     deals: 11, revenue: '$310k', target: 71, avatar: 'JD', rank: 2 },
  { name: 'M. Smith',   deals: 9,  revenue: '$265k', target: 63, avatar: 'MS', rank: 3 },
];

// ── Scrolling ticker component ──
const SpotTicker = () => {
  const [offset, setOffset] = useState(0);
  const items = [...SPOT_PRICES, ...SPOT_PRICES]; // duplicate for seamless loop

  useEffect(() => {
    const ticker = setInterval(() => {
      setOffset(prev => {
        const next = prev - 1;
        // Reset when we've scrolled one full set width (approx 180px * 6 items = 1080px)
        return next <= -1080 ? 0 : next;
      });
    }, 22);
    return () => clearInterval(ticker);
  }, []);

  return (
    <div className="bg-slate-900 border-b border-slate-800 overflow-hidden h-9 flex items-center">
      <div className="flex-none px-4 border-r border-slate-700 h-full flex items-center">
        <span className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block" />
          Live Spot
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-0 whitespace-nowrap"
          style={{ transform: `translateX(${offset}px)`, transition: 'none' }}
        >
          {items.map((p, i) => (
            <div key={i} className="inline-flex items-center gap-2 px-6 border-r border-slate-800 h-9">
              <span className="text-[10px] font-black text-slate-400 tracking-wider">{p.label}</span>
              <span className="text-[11px] font-black text-white">{p.price}</span>
              <span className={`text-[9px] font-black flex items-center gap-0.5 ${p.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                {p.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {p.pct}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-none px-4 border-l border-slate-700 h-full flex items-center">
        <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap">
          {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} GST
        </span>
      </div>
    </div>
  );
};

// ── Lead status pill ──
const statusStyle = {
  New:       'bg-indigo-50 text-indigo-700',
  Contacted: 'bg-sky-50 text-sky-700',
  Qualified: 'bg-emerald-50 text-emerald-700',
  Proposal:  'bg-amber-50 text-amber-700',
};

// ── Tier badge ──
const tierStyle = {
  Corporate: 'bg-indigo-100 text-indigo-700',
  HNI:       'bg-amber-100 text-amber-700',
  Retail:    'bg-slate-100 text-slate-600',
};

const Dashboard = ({ onNavigate }) => {
  const [showAlerts, setShowAlerts] = useState(false);

  const conversionRate = Math.round((LEADS.filter(l => l.status === 'Qualified' || l.status === 'Proposal').length / LEADS.length) * 100);

  return (
    <div className="space-y-0 -mx-8 -mt-6">

      {/* ── Spot Price Ticker ── */}
      <SpotTicker />

      <div className="px-8 pt-6 space-y-6">

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Clients"      value="12,840" trend="+14%" icon={Users}       sub="vs last month" />
          <MetricCard label="New Registrations"  value="450"    trend="+22%" icon={UserCheck}    sub="this month" />
          <MetricCard label="Pending KYC"        value="128"    trend="+5%"  icon={Clock}        sub="awaiting docs" />
          <MetricCard label="Approved Clients"   value="9,400"  trend="+10%" icon={CheckCircle2} sub="verified & active" />
        </div>

        {/* ── Alerts Banner ── */}
        <Card>
          <div
            className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
            onClick={() => setShowAlerts(!showAlerts)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              <p className="text-sm font-bold text-slate-800">Live Alerts & Notifications</p>
              <Badge color="rose">{ALERTS.length} New</Badge>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${showAlerts ? 'rotate-180' : ''}`}
            />
          </div>
          {showAlerts && (
            <div className="px-6 pb-4 space-y-2 border-t border-slate-50 pt-4">
              {ALERTS.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      a.type === 'kyc'     ? 'bg-emerald-100 text-emerald-600' :
                      a.type === 'dormant' ? 'bg-amber-100 text-amber-600'    :
                                            'bg-indigo-100 text-indigo-600'
                    }`}>
                      {a.type === 'kyc' ? <CheckCircle2 size={13} /> : a.type === 'dormant' ? <AlertTriangle size={13} /> : <Target size={13} />}
                    </div>
                    <p className="text-xs font-medium text-slate-700">{a.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Revenue Chart + Client Status ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader title="Revenue Analytics" sub="12-Month Performance" />
            <div className="px-6 py-4 h-56">
              <ResponsiveContainer>
                <AreaChart data={revData}>
                  <defs>
                    <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 11, fontWeight: 700 }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <Area type="monotone" dataKey="v" stroke="#4F46E5" fill="url(#rv)" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Client Status" sub="Breakdown" />
            <div className="px-6 py-4 space-y-3">
              {[
                { label: 'Active',   count: 9400, pct: 73, color: 'bg-emerald-500' },
                { label: 'Inactive', count: 2340, pct: 18, color: 'bg-amber-400' },
                { label: 'Dormant',  count: 1100, pct: 9,  color: 'bg-rose-400' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                    <span>{s.label}</span><span>{s.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                {[
                  { label: 'Onboarding (Registered)',    count: 450 },
                  { label: 'KYC Pending',                count: 128 },
                  { label: 'KYC Approved (Not Active)',  count: 312 },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500">{s.label}</span>
                    <span className="text-indigo-600">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── NEW: Top Clients + Lead Acquisition Side-by-Side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Clients — 2/3 width */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Top Clients"
              sub="Ranked by Lifetime Value"
              action={
                <button
                  onClick={() => onNavigate?.(1)}
                  className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View All <ChevronRight size={12} />
                </button>
              }
            />
            <div className="divide-y divide-slate-50">
              {TOP_CLIENTS.map((c) => (
                <div
                  key={c.rank}
                  onClick={() => onNavigate?.(1)}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank badge */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black flex-none ${
                      c.rank === 1 ? 'bg-amber-100 text-amber-600' :
                      c.rank === 2 ? 'bg-slate-200 text-slate-600' :
                      c.rank === 3 ? 'bg-orange-100 text-orange-600' :
                                     'bg-slate-50 text-slate-400'
                    }`}>
                      {c.rank === 1 ? <Crown size={11} /> : c.rank}
                    </div>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white text-[9px] font-black flex items-center justify-center flex-none">
                      {c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{c.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Globe size={9} className="text-slate-300" />
                        <span className="text-[10px] text-slate-400">{c.city}</span>
                        <span className="text-slate-200">·</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${tierStyle[c.tier] || 'bg-slate-100 text-slate-600'}`}>{c.tier}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-slate-800">{c.revenue}</p>
                      <p className="text-[9px] text-slate-400">{c.txCount} transactions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400">Last tx</p>
                      <p className="text-[10px] font-bold text-slate-600">{c.lastTx}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lead Acquisition Summary — 1/3 width */}
          <div className="space-y-4">
            {/* Lead KPIs */}
            <Card>
              <CardHeader title="Lead Acquisition" sub="This Month" />
              <div className="px-6 pb-4 grid grid-cols-2 gap-3">
                <div className="bg-indigo-50 rounded-xl p-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Leads</p>
                  <p className="text-xl font-black text-indigo-700">50</p>
                  <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp size={9} /> +18% vs last mo.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Conversion</p>
                  <p className="text-xl font-black text-emerald-700">{conversionRate}%</p>
                  <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <TrendingUp size={9} /> +4pts vs last mo.
                  </p>
                </div>
              </div>
              {/* Source breakdown */}
              <div className="px-6 pb-5 space-y-2.5 border-t border-slate-50 pt-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-3">By Source</p>
                {LEAD_SOURCES.map(s => (
                  <div key={s.source}>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                      <span>{s.source}</span><span>{s.count}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ── NEW: Team Performance Snapshot ── */}
        <Card>
          <CardHeader
            title="Team Performance"
            sub="May 2026 · Target vs Actual"
            action={
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl">
                <Flame size={11} className="text-amber-500" />
                <span className="text-[10px] font-black text-amber-700">72% to target</span>
              </div>
            }
          />
          <div className="px-6 pb-6">
            {/* Overall progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
                <span>Team Revenue Target</span>
                <span className="text-slate-800">$995k / $1.38M</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: '72%' }} />
              </div>
            </div>

            {/* Rep cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEAM_REPS.map((rep, i) => (
                <div
                  key={rep.name}
                  className={`rounded-2xl p-4 border transition-all ${
                    i === 0
                      ? 'border-amber-200 bg-amber-50'
                      : 'border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black ${
                      i === 0 ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {rep.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-slate-800">{rep.name}</p>
                        {i === 0 && <Crown size={10} className="text-amber-500" />}
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold">{rep.deals} deals closed</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-slate-900 mb-2">{rep.revenue}</p>
                  <div>
                    <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1">
                      <span>Target</span><span>{rep.target}%</span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-amber-400' : 'bg-indigo-400'}`}
                        style={{ width: `${rep.target}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ── Onboarding Lifecycle ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Onboarding Lifecycle" sub="Client Journey Stages" />
            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                {[
                  { label: 'Registered',   count: 450,  icon: UserCheck,    done: true },
                  { label: 'KYC Pending',  count: 128,  icon: Clock,        done: true },
                  { label: 'KYC Approved', count: 312,  icon: CheckCircle2, done: true },
                  { label: 'Active',       count: 9400, icon: Activity,     done: false },
                ].map((step, i, arr) => (
                  <React.Fragment key={step.label}>
                    <div className="text-center flex-1">
                      <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-3 ${
                        step.done ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <step.icon size={18} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{step.label}</p>
                      <p className="text-sm font-black text-slate-800 mt-0.5">{step.count.toLocaleString()}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="flex-none mx-1">
                        <ChevronRight size={16} className="text-slate-200" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Follow-up Reminders"
              sub="Pending Actions"
              action={<Badge color="rose">{REMINDERS.length}</Badge>}
            />
            <div className="divide-y divide-slate-50">
              {REMINDERS.map(r => (
                <div key={r.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${r.priority === 'High' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{r.client}</p>
                      <p className="text-[10px] text-slate-400">{r.type} · {r.rep}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black ${
                    r.due === 'Overdue' ? 'text-rose-500' :
                    r.due === 'Today'   ? 'text-amber-600' :
                                          'text-slate-400'
                  }`}>{r.due}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Recent Interactions ── */}
        <Card>
          <CardHeader
            title="Recent Interactions"
            sub="Calls · Emails · Meetings"
            action={<IconBtn icon={Plus} label="Log Interaction" variant="primary" />}
          />
          <div className="divide-y divide-slate-50">
            {INTERACTIONS.map(act => (
              <div key={act.id} className="flex items-start justify-between px-6 py-4 hover:bg-slate-50 transition-all">
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${
                    act.type === 'Call'    ? 'bg-indigo-50 text-indigo-600' :
                    act.type === 'Meeting' ? 'bg-emerald-50 text-emerald-600' :
                                            'bg-sky-50 text-sky-600'
                  }`}>
                    {act.type === 'Call' ? <Phone size={13} /> : act.type === 'Meeting' ? <Video size={13} /> : <Mail size={13} />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs font-bold text-slate-800">{act.client}</p>
                      <Badge color={act.type === 'Call' ? 'indigo' : act.type === 'Meeting' ? 'emerald' : 'sky'}>{act.type}</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.summary}</p>
                    {act.followUp && (
                      <p className="text-[10px] text-amber-600 font-bold mt-1">
                        Follow-up: {act.followUp} · {act.rep}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap ml-4">{act.date}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>{/* end px-8 wrapper */}
    </div>
  );
};

export default Dashboard;