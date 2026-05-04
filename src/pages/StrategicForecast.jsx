import React from 'react';
import { TrendingUp, Layers, BarChart3, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, LineChart, Line, Legend,
} from 'recharts';

import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { SectionDivider } from '../components/ui/Buttons';

const StrategicForecast = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard label="4-Week Forecast" value="$9.8M" trend="+11%" icon={TrendingUp} sub="rolling projection" />
      <MetricCard label="Pipeline Coverage" value="3.2×" trend="+0.4x" icon={Layers} sub="vs 3× target" />
      <MetricCard label="Full-Year Estimate" value="$98M" trend="+24%" icon={BarChart3} sub="based on run rate" />
      <MetricCard label="Deals Closing (Month)" value="$2.1M" trend="+6%" icon={CheckCircle2} sub="9 deals confirmed" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Short-Term Forecast" sub="Rolling 4-Week Projection" />
        <div className="px-6 py-4 h-52">
          <ResponsiveContainer>
            <AreaChart data={[
              { wk: 'Wk 1', actual: 2100, forecast: 2200 },
              { wk: 'Wk 2', actual: 2400, forecast: 2350 },
              { wk: 'Wk 3', actual: null, forecast: 2600 },
              { wk: 'Wk 4', actual: null, forecast: 2850 },
            ]}>
              <XAxis dataKey="wk" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 11 }} formatter={v => v ? [`$${(v / 1000).toFixed(1)}k`] : ['—']} />
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#10B981" fill="#D1FAE5" strokeWidth={2.5} dot={false} connectNulls={false} />
              <Area type="monotone" dataKey="forecast" name="Forecast" stroke="#4F46E5" fill="#EEF2FF" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="Target vs Pipeline" sub="Monthly Coverage Ratio" />
        <div className="px-6 py-4 h-52">
          <ResponsiveContainer>
            <BarChart data={[
              { n: 'Jan', target: 7000, pipeline: 21000 }, { n: 'Feb', target: 7500, pipeline: 24000 },
              { n: 'Mar', target: 8000, pipeline: 26000 }, { n: 'Apr', target: 8500, pipeline: 27200 },
              { n: 'May', target: 9000, pipeline: 29000 }, { n: 'Jun', target: 9500, pipeline: 30500 },
            ]}>
              <XAxis dataKey="n" tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 11 }} formatter={v => [`$${(v / 1000).toFixed(0)}k`]} />
              <Bar dataKey="target" name="Target" fill="#E0E7FF" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pipeline" name="Pipeline" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader title="Customer Growth Projections" sub="MoM % · YoY % · Forward Estimate" />
        <div className="px-6 py-4 h-52">
          <ResponsiveContainer>
            <LineChart data={[
              { n: 'Jan', actual: 8.2, projected: null }, { n: 'Feb', actual: 9.1, projected: null },
              { n: 'Mar', actual: 11.2, projected: null }, { n: 'Apr', actual: 14.0, projected: 14.0 },
              { n: 'May', actual: null, projected: 15.4 }, { n: 'Jun', actual: null, projected: 16.8 },
              { n: 'Jul', actual: null, projected: 18.2 }, { n: 'Aug', actual: null, projected: 19.6 },
            ]}>
              <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 11 }} formatter={v => v ? [`${v}%`] : ['—']} />
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <Line type="monotone" dataKey="actual" name="Actual MoM%" stroke="#4F46E5" strokeWidth={2.5} dot={false} connectNulls={false} />
              <Line type="monotone" dataKey="projected" name="Projected MoM%" stroke="#10B981" strokeWidth={2} strokeDasharray="5 3" dot={false} />
              <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="New Lead Forecast" sub="Based on Marketing Plan" />
        <div className="px-6 py-4 space-y-3">
          {[
            { month: 'May 2026', leads: 2680, budget: '$42k', channels: 'Google + Meta + Events' },
            { month: 'Jun 2026', leads: 2920, budget: '$48k', channels: 'WhatsApp + Referrals' },
            { month: 'Jul 2026', leads: 3100, budget: '$52k', channels: 'Eid Campaign' },
            { month: 'Aug 2026', leads: 2840, budget: '$44k', channels: 'Digital + Organic' },
          ].map(f => (
            <div key={f.month} className="p-3 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <p className="text-xs font-bold text-slate-800">{f.month}</p>
                <Badge color="indigo">{f.leads.toLocaleString()} leads</Badge>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Budget: {f.budget} · {f.channels}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader title="Volume Forecast by Product Type" sub="KG Projection — Next Quarter" />
        <div className="px-6 py-4 space-y-3">
          {[
            { product: 'Bullion Bars (24K)', q2Actual: '85 KG', q3Forecast: '104 KG', growth: '+22%', color: 'text-emerald-600' },
            { product: 'Jewellery (22K)', q2Actual: '65 KG', q3Forecast: '78 KG', growth: '+20%', color: 'text-emerald-600' },
            { product: 'Coins (24K)', q2Actual: '28 KG', q3Forecast: '32 KG', growth: '+14%', color: 'text-emerald-600' },
            { product: 'Investment Rounds', q2Actual: '18 KG', q3Forecast: '24 KG', growth: '+33%', color: 'text-emerald-600' },
            { product: 'Fashion (18K)', q2Actual: '12 KG', q3Forecast: '11 KG', growth: '−8%', color: 'text-rose-500' },
          ].map(v => (
            <div key={v.product} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-800">{v.product}</p>
                <p className="text-[10px] text-slate-400 font-medium">Q2 actual: {v.q2Actual}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-indigo-600">{v.q3Forecast}</p>
                <p className={`text-[10px] font-bold ${v.color}`}>{v.growth}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Deal Velocity & Ops Planning" sub="Speed Trend · Headcount Need" />
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-indigo-50 rounded-xl text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Deal Velocity</p>
              <p className="text-lg font-black text-indigo-600">14 days avg</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">▼ 2 days faster vs last Q</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Velocity Trend</p>
              <p className="text-lg font-black text-emerald-600">Improving</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">3 consecutive months</p>
            </div>
          </div>
          <SectionDivider label="Headcount Planning" />
          {[
            { role: 'Sales Rep (additional)', need: '+2', when: 'Q3 2026', reason: 'Pipeline growth 32% QoQ' },
            { role: 'KYC / Compliance Officer', need: '+1', when: 'Q2 2026', reason: '128 pending KYC cases' },
            { role: 'Digital Marketing', need: '+1', when: 'Q3 2026', reason: 'Paid digital scaling' },
          ].map(h => (
            <div key={h.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-800">{h.role}</p>
                <p className="text-[10px] text-slate-400 font-medium">{h.reason}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-indigo-600">{h.need}</p>
                <p className="text-[9px] text-slate-400 font-bold">{h.when}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card>
      <CardHeader title="Seasonal Planning" sub="Eid al-Fitr · Eid al-Adha · Diwali · Year-End" />
      <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { event: 'Eid al-Fitr', date: 'Mar 2027', impact: '+35%', focus: 'Jewellery & Gift Sets', badge: 'indigo' },
          { event: 'Eid al-Adha', date: 'Jun 2027', impact: '+28%', focus: 'Mixed Product Mix', badge: 'sky' },
          { event: 'Diwali', date: 'Oct 2026', impact: '+22%', focus: 'Coins & Jewellery', badge: 'amber' },
          { event: 'Year-End Corporate', date: 'Dec 2026', impact: '+40%', focus: 'Bulk Bars & Gifting', badge: 'emerald' },
        ].map(e => (
          <div key={e.event} className="p-5 bg-slate-50 rounded-2xl">
            <Badge color={e.badge}>{e.event}</Badge>
            <p className="text-[10px] text-slate-400 font-medium mt-2">{e.date}</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{e.impact}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">{e.focus}</p>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

export default StrategicForecast;