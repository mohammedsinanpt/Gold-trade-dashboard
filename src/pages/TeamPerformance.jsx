import React, { useState } from 'react';
import {
  Phone, CheckCircle2, Clock, Briefcase, Target,
  TrendingUp, DollarSign, Star,
  Users, Award, BarChart2, RefreshCw,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ─── Palette & Tokens ────────────────────────────────────────────────────────
const COLORS = {
  indigo: '#6366f1',
  indigoLight: '#e0e7ff',
  sky: '#0ea5e9',
  emerald: '#10b981',
  emeraldLight: '#d1fae5',
  amber: '#f59e0b',
  amberLight: '#fef3c7',
  rose: '#f43f5e',
  roseLight: '#ffe4e6',
  violet: '#8b5cf6',
  slate800: '#1e293b',
  slate600: '#475569',
  slate400: '#94a3b8',
  slate100: '#f1f5f9',
  slate50: '#f8fafc',
};

const REP_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];

// ─── Data ─────────────────────────────────────────────────────────────────────
const REPS = [
  {
    name: 'S. Abraham', short: 'SA',
    out: 52, inb: 28, visits: 8, leads: 14, quotes: 8, done: 22, overdue: 0,
    deals: 16, revenue: 1800000, avgDeal: 125000, quota: 2000000, cycleTime: 18,
    conv: 24, csat: 4.8, upsell: 18, repeat: 12, score: 96,
  },
  {
    name: 'J. Doe', short: 'JD',
    out: 44, inb: 24, visits: 7, leads: 12, quotes: 6, done: 18, overdue: 1,
    deals: 13, revenue: 1400000, avgDeal: 108000, quota: 1800000, cycleTime: 24,
    conv: 19, csat: 4.5, upsell: 14, repeat: 9, score: 84,
  },
  {
    name: 'M. Smith', short: 'MS',
    out: 38, inb: 22, visits: 6, leads: 10, quotes: 5, done: 15, overdue: 3,
    deals: 10, revenue: 1100000, avgDeal: 92000, quota: 1500000, cycleTime: 31,
    conv: 15, csat: 4.2, upsell: 10, repeat: 7, score: 72,
  },
  {
    name: 'R. Patel', short: 'RP',
    out: 30, inb: 18, visits: 5, leads: 8, quotes: 4, done: 13, overdue: 5,
    deals: 9, revenue: 800000, avgDeal: 80000, quota: 1200000, cycleTime: 38,
    conv: 12, csat: 3.9, upsell: 7, repeat: 5, score: 61,
  },
];

const weeklyCallData = [
  { day: 'Mon', out: 38, inb: 22 },
  { day: 'Tue', out: 45, inb: 28 },
  { day: 'Wed', out: 52, inb: 30 },
  { day: 'Thu', out: 41, inb: 25 },
  { day: 'Fri', out: 36, inb: 19 },
  { day: 'Sat', out: 18, inb: 10 },
];

const pipelineData = REPS.map((r, i) => ({
  name: r.short,
  leads: r.leads,
  quotes: r.quotes,
  followups: r.done,
  overdue: r.overdue,
  color: REP_COLORS[i],
}));

const revenueVsQuota = REPS.map((r, i) => ({
  name: r.short,
  revenue: r.revenue / 1000,
  quota: r.quota / 1000,
  pct: Math.round((r.revenue / r.quota) * 100),
  color: REP_COLORS[i],
}));

const dealData = REPS.map((r, i) => ({
  name: r.short,
  deals: r.deals,
  avgDeal: r.avgDeal / 1000,
  revenue: r.revenue / 1000000,
  color: REP_COLORS[i],
}));

/*const cycleData = REPS.map((r, i) => ({
  name: r.short,
  days: r.cycleTime,
  fill: REP_COLORS[i],
}));*/

const qualityData = REPS.map((r, i) => ({
  name: r.short,
  conv: r.conv,
  csat: r.csat * 20,
  upsell: r.upsell,
  repeat: r.repeat,
  color: REP_COLORS[i],
}));

const leaderboardOptions = ['Revenue', 'Deals', 'Conversion'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

const Pill = ({ children, color = 'indigo' }) => {
  const map = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-500',
  sky: 'bg-sky-50 text-sky-600',
  violet: 'bg-violet-50 text-violet-600',
};
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide ${map[color]}`}>
      {children}
    </span>
  );
};

const SectionTitle = ({ icon: Icon, title, subtitle, accent = COLORS.indigo }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: `${accent}18` }}>
      <Icon size={16} style={{ color: accent }} />
    </div>
    <div>
      <h2 className="text-sm font-black text-slate-800 tracking-tight">{title}</h2>
      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{subtitle}</p>
    </div>
  </div>
);

const Card = ({ children, className = '', style = {} }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`}
    style={style}
  >
    {children}
  </div>
);

const MetricCard = ({ label, value, trend, trendUp = true, icon: Icon, sub, accent = COLORS.indigo }) => (
  <div
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}18` }}>
        <Icon size={16} style={{ color: accent }} />
      </div>
      <span
        className={`text-[10px] font-black flex items-center gap-0.5 px-2 py-1 rounded-lg ${
          trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
        }`}
      >
        {trendUp ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        {trend}
      </span>
    </div>
    <div>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[9px] text-slate-300 font-semibold">{sub}</p>}
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, prefix = '', suffix = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-xl shadow-xl border border-slate-700">
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.fill || '#fff' }}>
          {p.name}: {prefix}{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};

// ─── Rep Avatar ───────────────────────────────────────────────────────────────
const RepAvatar = ({ short, color, rank }) => (
  <div className="relative">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-sm"
      style={{ background: color }}
    >
      {short}
    </div>
    {rank === 0 && (
      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
        <Award size={8} className="text-white" />
      </div>
    )}
  </div>
);

const SummaryCards = () => (
 
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-between mb-2">
    <MetricCard
      label="Total Revenue"
      value="$5.1M"
      trend="+14%"
      icon={DollarSign}
      accent={COLORS.emerald}
    />
    <MetricCard
      label="Deals Closed"
      value="48"
      trend="+8%"
      icon={Target}
      accent={COLORS.indigo}
    />

    <MetricCard
      label="Conversion Rate"
      value="24%"
      trend="+5%"
      icon={TrendingUp}
      accent={COLORS.sky}
    />

    <MetricCard
      label="CSAT Score"
      value="4.4"
      trend="+2%"
      icon={Star}
      accent={COLORS.amber}
    />
  </div>
 
);

// ─── Section 1: Daily Activity ────────────────────────────────────────────────


const OverallLeaderboard = () => {
  const [sort, setSort] = useState('Revenue');

  const sorted = [...REPS].sort((a, b) => {
    if (sort === 'Revenue') return b.revenue - a.revenue;
    if (sort === 'Deals') return b.deals - a.deals;
    if (sort === 'Conversion') return b.conv - a.conv;
    return 0;
  });

  const activityScore = (r) => Math.round(
    (r.out / 52) * 25 + (r.visits / 8) * 25 + (r.done / 22) * 25 + (r.deals / 16) * 25
  );

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <SectionTitle icon={Award} title="Overall Leaderboard"
         subtitle="Activity score · Ranked by revenue, deals or conversion" accent={COLORS.rose} />
        <div className="flex gap-1.5 mt-0.5">
          {leaderboardOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black transition-all ${
                sort === opt ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Top 1 hero card */}
      {(() => {
        const top = sorted[0];
        const topIdx = REPS.indexOf(top);
        const pct = Math.round((top.revenue / top.quota) * 100);
        return (
          <Card className="p-6 border-2" style={{ borderColor: REP_COLORS[topIdx] + '40' }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${REP_COLORS[topIdx]}, ${REP_COLORS[topIdx]}bb)` }}
                  >
                    {top.short}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow">
                    <Award size={12} className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-lg font-black text-slate-800">{top.name}</p>
                    <Pill color="amber">#1 Rep</Pill>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">Top performer this month</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Revenue', val: fmt(top.revenue), color: COLORS.indigo },
                  { label: 'Deals', val: top.deals, color: COLORS.emerald },
                  { label: 'Conv.', val: `${top.conv}%`, color: COLORS.sky },
                  { label: 'CSAT', val: top.csat, color: COLORS.amber },
                  { label: 'Upsell', val: `${top.upsell}%`, color: COLORS.violet },
                  { label: 'Quota', val: `${pct}%`, color: COLORS.emerald },
                ].map((m, i) => (
                  <div key={i} className="text-center bg-slate-50 rounded-xl p-3">
                    <p className="text-sm font-black" style={{ color: m.color }}>{m.val}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })()}

      {/* Leaderboard rows */}
      <Card>
        <div className="divide-y divide-slate-50">
          {sorted.map((rep, rank) => {
            const repIdx = REPS.indexOf(rep);
            const pct = Math.round((rep.revenue / rep.quota) * 100);
            const aScore = activityScore(rep);
            return (
              <div key={rank} className="flex items-center px-6 py-4 hover:bg-slate-50/70 transition-all gap-5">
                {/* Rank */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                  rank === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                }`}>
                  {rank + 1}
                </div>

                {/* Avatar */}
                <RepAvatar short={rep.short} color={REP_COLORS[repIdx]} rank={rank} />

                {/* Name */}
                <div className="w-28 shrink-0">
                  <p className="text-xs font-black text-slate-800">{rep.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold">Score: {rep.score}</p>
                </div>

                {/* Metrics grid */}
                <div className="flex-1 grid grid-cols-4 lg:grid-cols-8 gap-3 items-center">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Revenue</p>
                    <p className="text-[11px] font-black text-indigo-600">{fmt(rep.revenue)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Deals</p>
                    <p className="text-[11px] font-black text-slate-700">{rep.deals}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Conv.</p>
                    <p className="text-[11px] font-black text-sky-600">{rep.conv}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Avg Deal</p>
                    <p className="text-[11px] font-black text-slate-700">{fmt(rep.avgDeal)}</p>
                  </div>
                  <div className="text-center hidden lg:block">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">CSAT</p>
                    <p className="text-[11px] font-black text-amber-600">{rep.csat}</p>
                  </div>
                  <div className="text-center hidden lg:block">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Upsell</p>
                    <p className="text-[11px] font-black text-emerald-600">{rep.upsell}%</p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex justify-between mb-1">
                      <p className="text-[8px] text-slate-400 font-black uppercase">Quota</p>
                      <p className="text-[8px] font-black text-slate-700">{pct}%</p>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 90 ? COLORS.emerald : pct >= 70 ? COLORS.indigo : COLORS.amber,
                        }}
                      />
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Activity</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${aScore}%`, background: REP_COLORS[repIdx] }} />
                      </div>
                      <span className="text-[8px] font-black text-slate-600">{aScore}</span>
                    </div>
                  </div>
                </div>

                {/* Overall score badge */}
                <div className="shrink-0">
                  <span className={`text-xs font-black px-3 py-1.5 rounded-xl ${
                    rep.score >= 90 ? 'bg-emerald-50 text-emerald-600' :
                    rep.score >= 70 ? 'bg-indigo-50 text-indigo-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {rep.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};


// ─── Section 2: Daily Activity ─────────────────────────────────────────────
const DailyActivity = () => (
  <div className="space-y-5">

    <SectionTitle
      icon={Phone}
      title="Daily Activity"
      subtitle="Calls · Visits · Follow-ups"
      accent={COLORS.indigo}
    />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Weekly Calls Chart */}
      <Card className="lg:col-span-2 p-5">
        <p className="text-xs font-black text-slate-700 mb-1">
          Calls Trend
        </p>

        <p className="text-[10px] text-slate-400 font-semibold mb-4">
          Outbound vs Inbound
        </p>

        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={weeklyCallData}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.25} />
                <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
              </linearGradient>

              <linearGradient id="gradInb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.sky} stopOpacity={0.2} />
                <stop offset="95%" stopColor={COLORS.sky} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="out"
              name="Outbound"
              stroke={COLORS.indigo}
              strokeWidth={2.5}
              fill="url(#gradOut)"
            />

            <Area
              type="monotone"
              dataKey="inb"
              name="Inbound"
              stroke={COLORS.sky}
              strokeWidth={2.5}
              fill="url(#gradInb)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Activity Summary */}
      <Card className="p-5">

        <p className="text-xs font-black text-slate-700 mb-1">
          Activity Summary
        </p>

        <p className="text-[10px] text-slate-400 font-semibold mb-4">
          Calls / Visits / Follow-ups
        </p>

        <div className="space-y-3">

          {[
            {
              label: 'Outbound Calls',
              val: 184,
              max: 200,
              icon: Phone,
              color: COLORS.indigo,
            },

            {
              label: 'Inbound Calls',
              val: 100,
              max: 150,
              icon: Phone,
              color: COLORS.sky,
            },

            {
              label: 'Visits / Week',
              val: 28,
              max: 40,
              icon: Briefcase,
              color: COLORS.emerald,
            },

            {
              label: 'Follow-ups Done',
              val: 68,
              max: 80,
              icon: CheckCircle2,
              color: COLORS.emerald,
            },

          ].map((m) => (
            <div key={m.label}>

              <div className="flex items-center justify-between mb-1">

                <div className="flex items-center gap-1.5">
                  <m.icon size={10} style={{ color: m.color }} />

                  <span className="text-[9px] font-bold text-slate-500">
                    {m.label}
                  </span>
                </div>

                <span
                  className="text-[10px] font-black"
                  style={{ color: m.color }}
                >
                  {m.val}
                </span>

              </div>

              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(m.val / m.max) * 100}%`,
                    background: m.color,
                  }}
                />

              </div>

            </div>
          ))}

        </div>

      </Card>

    </div>

  </div>
);
// ─── Section 3: Deals & Revenue ────────────────────────────────────────────────

const RevenuePerformance = () => (
  <div className="space-y-5">

    <SectionTitle
      icon={DollarSign}
      title="Revenue Performance"
      subtitle="Revenue · Quota · Deals · Avg Deal Size"
      accent={COLORS.emerald}
    />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Revenue vs Quota */}
      <Card className="p-5">

        <p className="text-xs font-black text-slate-700 mb-1">
          Revenue per rep
        </p>

        <p className="text-[10px] text-slate-400 font-semibold mb-4">
          
        </p>

        {/* PASTE YOUR EXISTING Revenue vs Monthly Quota chart HERE */}
      
       
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={dealData} 
          layout="vertical" 
          margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} unit="M" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<CustomTooltip prefix="$" suffix="M" />} />
            <Bar dataKey="revenue" name="Revenue ($M)" radius={[0, 4, 4, 0]}>
              {dealData.map((d, i) => <Cell key={i} fill={d.color}  />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      
      </Card>

      {/* Deals vs Avg Deal */}
      <Card className="p-5">


        {/* PASTE YOUR EXISTING Deals Closed vs Avg Deal chart HERE */}
        <p className="text-xs font-black text-slate-700 mb-1">Deals Closed vs Avg Deal Size</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">This month · per rep</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={dealData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} 
                    axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} 
                   axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} 
            axisLine={false} tickLine={false} unit="k" />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="deals" name="Deals Closed" radius={[4, 4, 0, 0]} barSize={30}>
              {dealData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
            <Line yAxisId="right" type="monotone" dataKey="avgDeal" name="Avg Deal ($k)" stroke={COLORS.amber} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.amber, strokeWidth: 0 }} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /><span className="text-[9px] font-bold text-slate-400">Deals Closed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-amber-500" /><span className="text-[9px] font-bold text-slate-400">Avg Deal Size</span></div>
        </div>
    
      </Card>

    </div>

  </div>
);

// ─── Section 4: PipelineActivity ──────────────────────────────────────────

const PipelineActivity = () => (
  <div className="space-y-5">
    <SectionTitle icon={BarChart2} title="Pipeline Activity" 
    subtitle="Leads · Quotes · Follow-ups per rep" accent={COLORS.sky} />

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Stacked bar */}
      <Card className="p-5">
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={pipelineData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="leads" name="New Leads" fill={COLORS.indigo} radius={[0, 0, 0, 0]} stackId="a" barSize={30}/>
            <Bar dataKey="quotes" name="Quotes Sent" fill={COLORS.amber} radius={[0, 0, 0, 0]} stackId="a" barSize={30} />
            <Bar dataKey="followups" name="Follow-ups Done" fill={COLORS.emerald} radius={[4, 4, 0, 0]} stackId="a" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: 'New Leads', color: COLORS.indigo },
            { label: 'Quotes Sent', color: COLORS.amber },
            { label: 'Follow-ups Done', color: COLORS.emerald },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-[9px] font-bold text-slate-400">{l.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Pipeline table */}
      <Card className="p-5">
        <p className="text-xs font-black text-slate-700 mb-1">Rep-Level Pipeline Detail</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">Outbound · Inbound · Visits · Leads · Quotes · Follow-ups</p>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Rep', 'Out', 'In', 'Visits', 'Leads', 'Quotes', 'Done', 'Overdue'].map(h => (
                <th key={h} className="pb-2 text-left text-[8px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {REPS.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-all">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-black text-white" style={{ background: REP_COLORS[i] }}>{r.short}</div>
                    <span className="text-[10px] font-bold text-slate-700">{r.name}</span>
                  </div>
                </td>
                <td className="py-3 text-[10px] font-bold text-slate-600">{r.out}</td>
                <td className="py-3 text-[10px] font-bold text-slate-600">{r.inb}</td>
                <td className="py-3 text-[10px] font-bold text-slate-600">{r.visits}</td>
                <td className="py-3"><Pill color="indigo">{r.leads}</Pill></td>
                <td className="py-3"><Pill color="amber">{r.quotes}</Pill></td>
                <td className="py-3"><Pill color="emerald">{r.done}</Pill></td>
                <td className="py-3">
                  <Pill color={r.overdue > 0 ? 'rose' : 'emerald'}>{r.overdue}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  </div>
);



// ─── Section 5: Targets ────────────────────────────────────────────────────────
 const Targets = () => (
  <div className="space-y-5">

    <SectionTitle
      icon={Target}
      title="Targets & Quota"
      subtitle="Revenue vs quota · Achievement % · Avg deal cycle time"
      accent={COLORS.violet}
    />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Revenue vs Quota grouped bar */}
      <Card className="lg:col-span-2 p-5">
        <p className="text-xs font-black text-slate-700 mb-1">Revenue vs Monthly Quota</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">Actual revenue (filled) vs target ($k)</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueVsQuota} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} unit="k" />
            <Tooltip content={<CustomTooltip suffix="k" />} />
            <Bar dataKey="quota" name="Quota ($k)" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40}/>
            <Bar dataKey="revenue" name="Revenue ($k)" radius={[4, 4, 0, 0]} barSize={40 }>
           
              {revenueVsQuota.map((d, i) => (
                <Cell key={i} fill={d.color} fillOpacity={d.pct >= 90 ? 1 : d.pct >= 70 ? 0.85 : 0.65} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-slate-200" />
          <span className="text-[9px] font-bold text-slate-400">Quota</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /><span className="text-[9px] font-bold text-slate-400">Actual Revenue</span></div>
        </div>
      </Card>

      {/* Quota achievement radials */}
      <Card className="p-5">
        <p className="text-xs font-black text-slate-700 mb-1">Quota Achievement</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">% of monthly target hit</p>
        <div className="grid grid-cols-2 gap-3">
          {REPS.map((r, i) => {
            const pct = Math.round((r.revenue / r.quota) * 100);
            return (
              <div key={i} className="flex flex-col items-center">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="14" fill="none"
                      stroke={REP_COLORS[i]}
                      strokeWidth="3"
                      strokeDasharray={`${(pct / 100) * 87.96} 87.96`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-black text-slate-800">{pct}%</span>
                  </div>
                </div>
                <span className="text-[8px] font-bold text-slate-500 mt-1">{r.short}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
      
  </div>
);
    

const DealCycleSection = () => (
  <div className="space-y-5">

    <SectionTitle
      icon={Clock}
      title="Avg Deal Cycle Time"
      subtitle="Days from first contact to close"
      accent={COLORS.violet}
    />

    {/* PASTE YOUR EXISTING Avg Deal Cycle Time CARD HERE */}
 <Card className="p-5">
      <p className="text-xs font-black text-slate-700 mb-1">
        Average Deal Cycle Time
      </p>

      <p className="text-[10px] text-slate-400 font-semibold mb-5">
        Days from first contact to close
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REPS.map((r, i) => (
          <div key={i}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
                style={{ background: REP_COLORS[i] }}
              >
                {r.short}
              </div>

              <span className="text-[10px] font-bold text-slate-600">
                {r.name}
              </span>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-slate-800">
                {r.cycleTime}
              </span>

              <span className="text-[10px] text-slate-400 font-bold pb-1">
                days
              </span>
            </div>

            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(r.cycleTime / 45) * 100}%`,
                  background: REP_COLORS[i],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);



// ─── Section 7: Quality Metrics ────────────────────────────────────────────────
const QualityMetrics = () => (
  <div className="space-y-5">
    <SectionTitle icon={Star} title="Quality Metrics" subtitle="Conversion · CSAT · Repeat customers · Upsell rate" accent={COLORS.amber} />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: 'Best Conversion Rate', value: '24%', icon: TrendingUp, accent: COLORS.indigo, sub: 'S. Abraham' },
        { label: 'Avg CSAT Score', value: '4.4', icon: Star, accent: COLORS.amber, sub: 'out of 5.0' },
        { label: 'Total Repeat Customers', value: '33', icon: RefreshCw, accent: COLORS.emerald, sub: 'this month' },
        { label: 'Best Upsell Rate', value: '18%', icon: TrendingUp, accent: COLORS.violet, sub: 'S. Abraham' },
      ].map((m, i) => (
        <MetricCard key={i} label={m.label} value={m.value} trend="+4%" icon={m.icon} sub={m.sub} accent={m.accent} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Conversion + Upsell grouped bar */}
      <Card className="p-5">
        <p className="text-xs font-black text-slate-700 mb-1">Conversion & Upsell Rate</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">Lead-to-close % · Upsell % per rep</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={qualityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip suffix="%" />} />
            <Bar dataKey="conv" name="Conversion %" radius={[4, 4, 0, 0]}>
              {qualityData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
            <Bar dataKey="upsell" name="Upsell %" fill="#f59e0b" radius={[4, 4, 0, 0]} fillOpacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /><span className="text-[9px] font-bold text-slate-400">Conversion %</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /><span className="text-[9px] font-bold text-slate-400">Upsell %</span></div>
        </div>
      </Card>

      {/* CSAT + Repeat customers */}
      <Card className="p-5">
        <p className="text-xs font-black text-slate-700 mb-1">CSAT & Repeat Customers</p>
        <p className="text-[10px] text-slate-400 font-semibold mb-4">Satisfaction score (×20) · Repeat handled</p>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={qualityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: COLORS.slate400 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="csat" name="CSAT (×20)" fill={COLORS.amber} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            <Bar dataKey="repeat" name="Repeat Customers" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /><span className="text-[9px] font-bold text-slate-400">CSAT (×20 scale)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span className="text-[9px] font-bold text-slate-400">Repeat Customers</span></div>
        </div>
      </Card>
    </div>

    {/* Rep quality table */}
    <Card className="p-5">
      <p className="text-xs font-black text-slate-700 mb-1">Quality Metrics per Rep</p>
      <p className="text-[10px] text-slate-400 font-semibold mb-4">Full breakdown</p>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            {['Rep', 'Conversion Rate', 'CSAT Score', 'Repeat Customers', 'Upsell Rate'].map(h => (
              <th key={h} className="pb-3 text-left text-[8px] font-black text-slate-400 uppercase tracking-widest px-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {REPS.map((r, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-all">
              <td className="px-2 py-3">
                <div className="flex items-center gap-2">
                  <RepAvatar short={r.short} color={REP_COLORS[i]} rank={i} />
                  <span className="text-xs font-bold text-slate-800">{r.name}</span>
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden" style={{ maxWidth: 80 }}>
                    <div className="h-full rounded-full" style={{ width: `${(r.conv / 30) * 100}%`, background: REP_COLORS[i] }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700">{r.conv}%</span>
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div key={s} className={`w-2 h-2 rounded-full ${s <= Math.round(r.csat) ? '' : 'opacity-20'}`} style={{ background: COLORS.amber }} />
                  ))}
                  <span className="text-[10px] font-black text-amber-600 ml-1">{r.csat}</span>
                </div>
              </td>
              <td className="px-2 py-3">
                <div className="flex items-center gap-2">
                  <Users size={11} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600">{r.repeat}</span>
                </div>
              </td>
              <td className="px-2 py-3"><Pill color="violet">{r.upsell}%</Pill></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);


// ─── Root Component ────────────────────────────────────────────────────────────
const TeamPerformance = () => (


  <div className="space-y-6 animate-in fade-in duration-500 px-1 ">

    {/* 1. SUMMARY */}
    <SummaryCards />

   <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 2. LEADERBOARD */}
    <OverallLeaderboard />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 3. DAILY ACTIVITY */}
    <DailyActivity />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"/>

    {/* 4. PIPELINE */}
    <PipelineActivity />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 5. TARGETS */}
    <Targets />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 6. REVENUE PERORMANCE */}
    <RevenuePerformance />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 7. DEAL CYCLE */}
    <DealCycleSection />

    <div className="h-px my-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

    {/* 8. QUALITY */}
    <QualityMetrics />

  </div>
);

export default TeamPerformance;