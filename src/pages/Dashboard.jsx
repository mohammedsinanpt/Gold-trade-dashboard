import React, { useState } from 'react';
import {
  Users, Target, CheckCircle2, Clock, UserCheck, Activity,
  Phone, Mail, Video, ChevronRight, Plus, XCircle,
  AlertTriangle, ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid,
} from 'recharts';

import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { IconBtn } from '../components/ui/Buttons';
import { ALERTS, REMINDERS, INTERACTIONS, revData } from '../data/mockData';

const Dashboard = () => {
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Clients" value="12,840" trend="+14%" icon={Users} sub="vs last month" />
        <MetricCard label="New Registrations" value="450" trend="+22%" icon={UserCheck} sub="this month" />
        <MetricCard label="Pending KYC" value="128" trend="+5%" icon={Clock} sub="awaiting docs" />
        <MetricCard label="Approved Clients" value="9,400" trend="+10%" icon={CheckCircle2} sub="verified & active" />
      </div>

      <Card>
        <div className="flex items-center justify-between px-6 py-4 cursor-pointer" onClick={() => setShowAlerts(!showAlerts)}>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            <p className="text-sm font-bold text-slate-800">Live Alerts & Notifications</p>
            <Badge color="rose">{ALERTS.length} New</Badge>
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showAlerts ? 'rotate-180' : ''}`} />
        </div>
        {showAlerts && (
          <div className="px-6 pb-4 space-y-2 border-t border-slate-50 pt-4">
            {ALERTS.map(a => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${a.type === 'kyc' ? 'bg-emerald-100 text-emerald-600' : a.type === 'dormant' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue Analytics" sub="12-Month Performance" />
          <div className="px-6 py-4 h-56">
            <ResponsiveContainer>
              <AreaChart data={revData}>
                <defs>
                  <linearGradient id="rv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
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
              { label: 'Active', count: 9400, pct: 73, color: 'bg-emerald-500' },
              { label: 'Inactive', count: 2340, pct: 18, color: 'bg-amber-400' },
              { label: 'Dormant', count: 1100, pct: 9, color: 'bg-rose-400' },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                  <span>{s.label}</span><span>{s.count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
              {[
                { label: 'Onboarding (Registered)', count: 450 },
                { label: 'KYC Pending', count: 128 },
                { label: 'KYC Approved (Not Active)', count: 312 },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Onboarding Lifecycle" sub="Client Journey Stages" />
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              {[
                { label: 'Registered', count: 450, icon: UserCheck, done: true },
                { label: 'KYC Pending', count: 128, icon: Clock, done: true },
                { label: 'KYC Approved', count: 312, icon: CheckCircle2, done: true },
                { label: 'Active', count: 9400, icon: Activity, done: false },
              ].map((step, i, arr) => (
                <React.Fragment key={step.label}>
                  <div className="text-center flex-1">
                    <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-3 ${step.done ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <step.icon size={18} />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{step.label}</p>
                    <p className="text-sm font-black text-slate-800 mt-0.5">{step.count.toLocaleString()}</p>
                  </div>
                  {i < arr.length - 1 && <div className="flex-none mx-1"><ChevronRight size={16} className="text-slate-200" /></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Follow-up Reminders" sub="Pending Actions" action={<Badge color="rose">{REMINDERS.length}</Badge>} />
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
                <span className={`text-[10px] font-black ${r.due === 'Overdue' ? 'text-rose-500' : r.due === 'Today' ? 'text-amber-600' : 'text-slate-400'}`}>{r.due}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Interactions" sub="Calls · Emails · Meetings" action={<IconBtn icon={Plus} label="Log Interaction" variant="primary" />} />
        <div className="divide-y divide-slate-50">
          {INTERACTIONS.map(act => (
            <div key={act.id} className="flex items-start justify-between px-6 py-4 hover:bg-slate-50 transition-all">
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${act.type === 'Call' ? 'bg-indigo-50 text-indigo-600' : act.type === 'Meeting' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                  {act.type === 'Call' ? <Phone size={13} /> : act.type === 'Meeting' ? <Video size={13} /> : <Mail size={13} />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs font-bold text-slate-800">{act.client}</p>
                    <Badge color={act.type === 'Call' ? 'indigo' : act.type === 'Meeting' ? 'emerald' : 'sky'}>{act.type}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.summary}</p>
                  {act.followUp && <p className="text-[10px] text-amber-600 font-bold mt-1">Follow-up: {act.followUp} · {act.rep}</p>}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 whitespace-nowrap ml-4">{act.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;