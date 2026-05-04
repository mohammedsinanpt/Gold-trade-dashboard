import React, { useState } from 'react';
import {
  Users, UserCheck, RefreshCw, TrendingUp, Search, Plus,
  AlertTriangle, ChevronRight, Phone, Mail, Video, MapPin,
  UserCircle, Languages, Globe, Package, BarChart3, DollarSign,
  Star, Eye, Edit3, Send, XCircle, CheckCircle2, Circle,
  Activity, Smartphone, ShoppingCart, Users2, ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend, BarChart, Bar,
} from 'recharts';

import MetricCard from '../components/ui/MetricCard';
import Badge from '../components/ui/Badge';
import { Card, CardHeader } from '../components/ui/Card';
import { IconBtn, SectionDivider } from '../components/ui/Buttons';
import { statusColor } from '../utils/statusColor';
import { CLIENTS, INTERACTIONS } from '../data/mockData';

// ── Language preference data ──────────────────────────────────────────────────
const LANG_DATA = [
  { lang: 'Arabic', clients: 3852, pct: 30, color: '#4F46E5' },
  { lang: 'English', clients: 3852, pct: 30, color: '#0EA5E9' },
  { lang: 'Arabic / English', clients: 2568, pct: 20, color: '#10B981' },
  { lang: 'Hindi / English', clients: 1284, pct: 10, color: '#F59E0B' },
  { lang: 'German', clients: 642, pct: 5, color: '#8B5CF6' },
  { lang: 'Other', clients: 642, pct: 5, color: '#94A3B8' },
];

// ── City / Region data ────────────────────────────────────────────────────────
const CITY_DATA = [
  { city: 'Dubai', clients: 3852, pct: 30, flag: '🇦🇪', colorIdx: 0 },
  { city: 'Riyadh', clients: 2568, pct: 20, flag: '🇸🇦', colorIdx: 1 },
  { city: 'Mumbai', clients: 1926, pct: 15, flag: '🇮🇳', colorIdx: 2 },
  { city: 'London', clients: 1284, pct: 10, flag: '🇬🇧', colorIdx: 3 },
  { city: 'Frankfurt', clients: 770, pct: 6, flag: '🇩🇪', colorIdx: 4 },
  { city: 'Lagos', clients: 642, pct: 5, flag: '🇳🇬', colorIdx: 5 },
  { city: 'Other', clients: 1798, pct: 14, flag: '🌍', colorIdx: 6 },
];

const CITY_COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#F43F5E', '#94A3B8'];

// ── New vs Returning monthly data ─────────────────────────────────────────────
const NEW_VS_RETURNING = [
  { n: 'Jan', new: 310, returning: 2890 },
  { n: 'Feb', new: 340, returning: 2960 },
  { n: 'Mar', new: 295, returning: 3100 },
  { n: 'Apr', new: 420, returning: 3280 },
  { n: 'May', new: 385, returning: 3410 },
  { n: 'Jun', new: 460, returning: 3590 },
  { n: 'Jul', new: 410, returning: 3720 },
  { n: 'Aug', new: 520, returning: 3890 },
  { n: 'Sep', new: 490, returning: 4020 },
  { n: 'Oct', new: 580, returning: 4210 },
  { n: 'Nov', new: 540, returning: 4380 },
  { n: 'Dec', new: 450, returning: 4470 },
];

// ── Client Detail Sub-view ────────────────────────────────────────────────────
const ClientDetail = ({ clientId, clients, onBack, addNoteClient, setAddNoteClient, noteText, setNoteText, addNote }) => {
  const c = clients.find(x => x.id === clientId);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button onClick={onBack} className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all">
        <ChevronRight size={14} className="rotate-180" /><span>Back to Clients</span>
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="p-6 text-center border-b border-slate-50">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl mb-4">
              {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <h3 className="font-bold text-slate-900">{c.name}</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{c.city} · {c.nationality}</p>
            <div className="flex items-center justify-center space-x-2 mt-3 flex-wrap gap-1">
              <Badge color={statusColor(c.status)}>{c.status}</Badge>
              <Badge color={statusColor(c.kyc)}>KYC: {c.kyc}</Badge>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {[
              { icon: Mail, label: 'Email', val: c.email },
              { icon: Phone, label: 'Phone', val: c.phone },
              { icon: MapPin, label: 'City', val: `${c.city}, ${c.nationality}` },
              { icon: UserCircle, label: 'Age Group', val: c.ageGroup },
              { icon: Languages, label: 'Language', val: c.lang },
              { icon: Globe, label: 'Channel', val: c.channel },
              { icon: RefreshCw, label: 'Purchase Freq.', val: c.frequency },
              { icon: Package, label: 'Trading Interest', val: c.interest },
              { icon: BarChart3, label: 'Volume', val: c.volume },
              { icon: DollarSign, label: 'Avg Spend/Tx', val: c.avgSpend },
              { icon: TrendingUp, label: 'CLV', val: c.clv },
              { icon: Star, label: 'Tier', val: c.tier },
            ].map(row => (
              <div key={row.label} className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><row.icon size={12} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{row.label}</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{row.val}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Onboarding Status" sub={`Current Stage: ${c.onboarding}`} />
            <div className="px-6 py-5 flex items-center space-x-2 flex-wrap gap-2">
              {['Registered', 'KYC Pending', 'KYC Approved', 'Active'].map((stage, i) => {
                const stages = ['Registered', 'KYC Pending', 'KYC Approved', 'Active'];
                const currentIdx = stages.indexOf(c.onboarding);
                const done = i <= currentIdx;
                return (
                  <React.Fragment key={stage}>
                    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-[10px] font-bold ${done ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      {done ? <CheckCircle2 size={11} /> : <Circle size={11} />}
                      <span>{stage}</span>
                    </div>
                    {i < 3 && <ChevronRight size={12} className="text-slate-200 flex-none" />}
                  </React.Fragment>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Interaction History" sub="All Touchpoints" action={<IconBtn icon={Plus} label="Log Interaction" variant="primary" />} />
            <div className="divide-y divide-slate-50">
              {INTERACTIONS.filter(i => i.client === c.name).length === 0
                ? <p className="px-6 py-4 text-xs text-slate-400 font-medium">No interactions recorded yet.</p>
                : INTERACTIONS.filter(i => i.client === c.name).map(act => (
                  <div key={act.id} className="flex items-start space-x-4 px-6 py-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-none ${act.type === 'Call' ? 'bg-indigo-50 text-indigo-600' : act.type === 'Meeting' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                      {act.type === 'Call' ? <Phone size={12} /> : act.type === 'Meeting' ? <Video size={12} /> : <Mail size={12} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge color={act.type === 'Call' ? 'indigo' : act.type === 'Meeting' ? 'emerald' : 'sky'}>{act.type}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold">{act.date} · {act.rep}</span>
                      </div>
                      <p className="text-xs text-slate-600">{act.summary}</p>
                      {act.followUp && <p className="text-[10px] text-amber-600 font-bold mt-1">Follow-up: {act.followUp}</p>}
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Client Notes" sub="Internal Records" action={<IconBtn icon={Plus} label="Add Note" variant="outline" onClick={() => setAddNoteClient(c.id)} />} />
            {addNoteClient === c.id && (
              <div className="px-6 pt-4 border-b border-slate-50">
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 resize-none focus:ring-2 ring-indigo-500/20 outline-none placeholder:text-slate-300" rows={3} placeholder="Add a note about this client..." />
                <div className="flex justify-end space-x-2 pb-4 mt-2">
                  <IconBtn icon={XCircle} label="Cancel" variant="ghost" onClick={() => { setAddNoteClient(null); setNoteText(''); }} />
                  <IconBtn icon={Send} label="Save Note" variant="primary" onClick={() => addNote(c.id)} />
                </div>
              </div>
            )}
            <div className="divide-y divide-slate-50">
              {c.notes.length === 0
                ? <p className="px-6 py-4 text-xs text-slate-400 font-medium">No notes added yet.</p>
                : c.notes.map((n, i) => (
                  <div key={i} className="px-6 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-slate-400">{n.rep}</span>
                      <span className="text-[10px] text-slate-300 font-bold">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{n.text}</p>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── Standalone section title component ───────────────────────────────────────
const SectionTitle = ({ title }) => (
  <div className="px-6 pt-6 pb-1">
    <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-none" style={{ letterSpacing: '0.04em' }}>{title}</h2>
    <div className="mt-2 h-[2px] w-8 bg-indigo-600 rounded-full" />
  </div>
);

// ── Main CustomerIntel view ───────────────────────────────────────────────────
const CustomerIntel = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedClient, setSelectedClient] = useState(null);
  const [addNoteClient, setAddNoteClient] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [clients, setClients] = useState(CLIENTS);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const addNote = (clientId) => {
    if (!noteText.trim()) return;
    setClients(prev => prev.map(c => c.id === clientId
      ? { ...c, notes: [...c.notes, { text: noteText, date: 'Just now', rep: 'Admin_Senior' }] }
      : c
    ));
    setNoteText('');
    setAddNoteClient(null);
  };

  if (selectedClient) {
    return (
      <ClientDetail
        clientId={selectedClient}
        clients={clients}
        onBack={() => setSelectedClient(null)}
        addNoteClient={addNoteClient}
        setAddNoteClient={setAddNoteClient}
        noteText={noteText}
        setNoteText={setNoteText}
        addNote={addNote}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── KPI ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Clients" value="12,840" trend="+14% MoM" icon={Users} sub="+31% YoY" />
        <MetricCard label="New Clients (Month)" value="450" trend="+22%" icon={UserCheck} sub="vs last month" />
        <MetricCard label="Returning Clients" value="8,920" trend="+9%" icon={RefreshCw} sub="repeat buyers" />
        <MetricCard label="Avg CLV" value="$142k" trend="+6%" icon={TrendingUp} sub="per active client" />
      </div>

      {/* ── NEW vs RETURNING — full visual section ── */}
      <Card>
        <CardHeader title="New vs Returning Clients" sub="12-Month Acquisition & Retention Analysis" />
        <div className="px-6 pt-4 pb-6">
          {/* 4 summary pills */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'New This Month', val: '450', delta: '+22%', up: true, bg: 'bg-indigo-50 border-indigo-100', valC: 'text-indigo-700', sub: 'first-time buyers' },
              { label: 'Returning This Month', val: '8,920', delta: '+9%', up: true, bg: 'bg-emerald-50 border-emerald-100', valC: 'text-emerald-700', sub: 'repeat purchasers' },
              { label: 'Retention Rate', val: '69.5%', delta: '+1.8%', up: true, bg: 'bg-sky-50 border-sky-100', valC: 'text-sky-700', sub: 'returning vs total' },
              { label: 'Churn This Month', val: '320', delta: '+3%', up: false, bg: 'bg-rose-50 border-rose-100', valC: 'text-rose-600', sub: 'lost to inactivity' },
            ].map(m => (
              <div key={m.label} className={`rounded-2xl border p-4 ${m.bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.18em] leading-tight">{m.label}</p>
                  <div className={`flex items-center text-[9px] font-black px-1.5 py-0.5 rounded-lg ${m.up ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
                    {m.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                    {m.delta}
                  </div>
                </div>
                <p className={`text-2xl font-black tracking-tight ${m.valC}`}>{m.val}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Stacked bar chart */}
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={NEW_VS_RETURNING} barSize={26}>
                <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #f0ede2', borderRadius: 12, fontSize: 11, fontWeight: 700 }}
                  formatter={(v, name) => [v.toLocaleString(), name === 'new' ? 'New Clients' : 'Returning Clients']}
                />
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <Bar dataKey="returning" name="returning" stackId="a" fill="#1D4ED8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="new" name="new" stackId="a" fill="#22C55E" radius={[6, 6, 0, 0]} />
                <Legend formatter={v => v === 'new' ? 'New Clients' : 'Returning Clients'} wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Frequency sub-breakdown */}
          <div className="mt-5 pt-5 border-t border-slate-50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Returning Clients by Purchase Frequency</p>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Weekly', count: 640, pct: 7, color: 'bg-indigo-600' },
                { label: 'Monthly', count: 3852, pct: 43, color: 'bg-indigo-400' },
                { label: 'Quarterly', count: 3212, pct: 36, color: 'bg-indigo-200' },
                { label: 'Irregular', count: 1216, pct: 14, color: 'bg-slate-300' },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{f.label}</p>
                    <p className="text-[10px] font-black text-slate-600">{f.pct}%</p>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${f.color} rounded-full`} style={{ width: `${Math.min(f.pct * 2.3, 100)}%` }} />
                  </div>
                  <p className="text-xs font-black text-slate-800">{f.count.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── CHANNEL · TIER · DEMOGRAPHICS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ACQUISITION CHANNEL — title only, no sub */}
        <Card>
          <SectionTitle title="Acquisition Channel" />
          <div className="px-6 py-4 space-y-3">
            {[
              { label: 'Walk-in', count: 3840, pct: 30, icon: MapPin, color: 'bg-indigo-500' },
              { label: 'Phone / Call-in', count: 2568, pct: 20, icon: Phone, color: 'bg-sky-500' },
              { label: 'App', count: 3852, pct: 30, icon: Smartphone, color: 'bg-emerald-500' },
              { label: 'E-commerce', count: 1284, pct: 10, icon: ShoppingCart, color: 'bg-amber-500' },
              { label: 'Other / Referral', count: 1296, pct: 10, icon: Users2, color: 'bg-rose-400' },
            ].map(ch => (
              <div key={ch.label}>
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                  <div className="flex items-center space-x-2"><ch.icon size={10} className="text-slate-400" /><span>{ch.label}</span></div>
                  <span>{ch.count.toLocaleString()} · {ch.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${ch.color} rounded-full`} style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* CUSTOMER TIER — title only, no sub */}
        <Card>
          <SectionTitle title="Customer Tier" />
          <div className="px-6 py-4 space-y-4">
            {[
              { tier: 'Retail', desc: 'Small qty buyers', count: 7704, pct: 60, color: 'bg-slate-400', badge: 'slate' },
              { tier: 'HNI', desc: 'High-net-worth individuals', count: 3852, pct: 30, color: 'bg-indigo-500', badge: 'indigo' },
              { tier: 'Corporate & Bulk', desc: 'Volume buyers', count: 1284, pct: 10, color: 'bg-sky-500', badge: 'sky' },
            ].map(t => (
              <div key={t.tier}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <Badge color={t.badge}>{t.tier}</Badge>
                    <span className="text-[10px] text-slate-400 font-medium">{t.desc}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-600">{t.count.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
            <SectionDivider label="CLV by Tier" />
            {[
              { tier: 'Corporate', clv: '$680k', bar: 100, color: 'bg-sky-500' },
              { tier: 'HNI', clv: '$315k', bar: 46, color: 'bg-indigo-500' },
              { tier: 'Retail', clv: '$48k', bar: 7, color: 'bg-slate-400' },
            ].map(t => (
              <div key={t.tier}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-bold text-slate-500">{t.tier}</p>
                  <p className="text-xs font-black text-slate-700">{t.clv}</p>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* DEMOGRAPHICS — title only, no sub */}
        <Card>
          <SectionTitle title="Demographics" />
          <div className="px-6 py-4 space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Top Nationalities</p>
              <div className="space-y-2">
                {[
                  { nation: 'UAE', pct: 28 }, { nation: 'India', pct: 22 },
                  { nation: 'KSA', pct: 18 }, { nation: 'UK', pct: 12 }, { nation: 'Other', pct: 20 },
                ].map(n => (
                  <div key={n.nation} className="flex items-center space-x-3">
                    <span className="text-[10px] font-bold text-slate-500 w-12">{n.nation}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${n.pct}%` }} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 w-8">{n.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-50">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Age Groups</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { group: '18–30', pct: 22 }, { group: '31–45', pct: 38 },
                  { group: '46–60', pct: 28 }, { group: '60+', pct: 12 },
                ].map(a => (
                  <div key={a.group} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-xs font-black text-slate-800">{a.pct}%</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{a.group}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── LANGUAGE PREFERENCE + REGION/CITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LANGUAGE PREFERENCE — title only, no sub */}
        <Card>
          <SectionTitle title="Language Preference" />
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-indigo-600 rounded-2xl p-4 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Top Language</p>
                <p className="text-lg font-black">Arabic</p>
                <p className="text-[10px] opacity-70 mt-0.5">30% of client base</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Bilingual Clients</p>
                <p className="text-lg font-black text-slate-800">30%</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Arabic/English, Hindi/English</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {LANG_DATA.map(l => (
                <div key={l.lang}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: l.color }} />
                      <span className="text-[10px] font-bold text-slate-600">{l.lang}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[10px] font-bold text-slate-400">{l.clients.toLocaleString()}</span>
                      <span className="text-[10px] font-black text-slate-700 w-8 text-right">{l.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${l.pct}%`, background: l.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">🌐 Communication Insight</p>
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                50% of clients prefer Arabic or bilingual outreach. Ensure WhatsApp broadcasts, call scripts, and follow-ups are available in both Arabic and English.
              </p>
            </div>
          </div>
        </Card>

        {/* REGION & CITY DISTRIBUTION — title only, no sub */}
        <Card>
          <SectionTitle title="Region & City Distribution" />
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-900 rounded-2xl p-4 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">Top City</p>
                <p className="text-lg font-black">Dubai 🇦🇪</p>
                <p className="text-[10px] opacity-50 mt-0.5">3,852 clients · 30%</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Cities Covered</p>
                <p className="text-lg font-black text-slate-800">42+</p>
                <p className="text-[10px] text-slate-400 mt-0.5">across 18 countries</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {CITY_DATA.map((c) => (
                <div key={c.city} className="flex items-center space-x-3">
                  <span className="text-base w-6 flex-none">{c.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-700">{c.city}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-slate-400 font-bold">{c.clients.toLocaleString()}</span>
                        <span className="text-[10px] font-black text-indigo-600 w-7 text-right">{c.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${c.pct * 3.3}%`, background: CITY_COLORS[c.colorIdx] }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── PURCHASE FREQUENCY + AVG SPEND & CLV ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PURCHASE FREQUENCY — title only, no sub */}
        <Card>
          <SectionTitle title="Purchase Frequency" />
          <div className="px-6 py-4 space-y-3">
            {[
              { label: 'Weekly', count: 640, pct: 5, color: 'bg-indigo-600' },
              { label: 'Monthly', count: 3852, pct: 30, color: 'bg-indigo-400' },
              { label: 'Quarterly', count: 5136, pct: 40, color: 'bg-indigo-300' },
              { label: 'One-time / Irregular', count: 3212, pct: 25, color: 'bg-slate-300' },
            ].map(f => (
              <div key={f.label}>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                  <span>{f.label}</span><span>{f.count.toLocaleString()} clients · {f.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full`} style={{ width: `${f.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AVERAGE SPEND & CLV — title only, no sub */}
        <Card>
          <SectionTitle title="Average Spend & CLV" />
          <div className="px-6 py-4 space-y-3">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Avg Spend / Tx', val: '$125k' },
                { label: 'Avg Annual Spend', val: '$280k' },
                { label: 'Avg CLV', val: '$142k' },
              ].map(m => (
                <div key={m.label} className="bg-indigo-50 rounded-xl p-3 text-center">
                  <p className="text-sm font-black text-indigo-600">{m.val}</p>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <SectionDivider label="CLV by Tier" />
            {[
              { tier: 'Corporate & Bulk', clv: '$680k', bar: 100, color: 'bg-sky-500' },
              { tier: 'HNI', clv: '$315k', bar: 46, color: 'bg-indigo-500' },
              { tier: 'Retail', clv: '$48k', bar: 7, color: 'bg-slate-400' },
            ].map(t => (
              <div key={t.tier}>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[10px] font-bold text-slate-500">{t.tier}</p>
                  <p className="text-xs font-black text-slate-700">{t.clv}</p>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${t.color} rounded-full`} style={{ width: `${t.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── CUSTOMER GROWTH ── */}
      <Card>
        <CardHeader title="Customer Growth" sub="Month-on-Month & Year-on-Year" />
        <div className="px-6 py-4 h-52">
          <ResponsiveContainer>
            <AreaChart data={[
              { n: 'Jan', mom: 8.2, yoy: 28.4 }, { n: 'Feb', mom: 9.1, yoy: 30.2 },
              { n: 'Mar', mom: 7.8, yoy: 27.6 }, { n: 'Apr', mom: 11.2, yoy: 31.0 },
              { n: 'May', mom: 10.4, yoy: 29.8 }, { n: 'Jun', mom: 13.1, yoy: 33.5 },
              { n: 'Jul', mom: 12.0, yoy: 32.1 }, { n: 'Aug', mom: 14.2, yoy: 35.8 },
              { n: 'Sep', mom: 13.6, yoy: 34.2 }, { n: 'Oct', mom: 16.0, yoy: 38.4 },
              { n: 'Nov', mom: 15.2, yoy: 37.1 }, { n: 'Dec', mom: 14.0, yoy: 31.0 },
            ]}>
              <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 11 }} formatter={v => [`${v}%`]} />
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <Area type="monotone" dataKey="mom" name="MoM %" stroke="#4F46E5" fill="#EEF2FF" strokeWidth={2.5} dot={false} />
              <Area type="monotone" dataKey="yoy" name="YoY %" stroke="#10B981" fill="#D1FAE5" strokeWidth={2.5} dot={false} />
              <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700, paddingTop: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── DORMANT ALERT ── */}
      {clients.some(c => c.dormant) && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle size={16} className="text-amber-500" />
            <p className="text-sm font-bold text-amber-700">{clients.filter(c => c.dormant).length} dormant client(s) detected — no activity for 30+ days</p>
          </div>
          <Badge color="amber">Action Required</Badge>
        </div>
      )}

      {/* ── FILTERS ── */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-300 focus:ring-2 ring-indigo-500/20 outline-none" placeholder="Search clients..." />
        </div>
        {['All', 'Active', 'Inactive', 'Dormant'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filterStatus === s ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}>{s}</button>
        ))}
        <div className="ml-auto"><IconBtn icon={Plus} label="Add Client" variant="primary" /></div>
      </div>

      {/* ── CLIENT TABLE ── */}
      <Card>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['Client', 'Tier', 'Channel', 'Nationality', 'Age', 'Language', 'Frequency', 'Status', 'KYC', 'CLV', 'Last Contact', 'Actions'].map(h => (
                <th key={h} className="px-4 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-all group">
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[10px] ${c.dormant ? 'bg-slate-400' : 'bg-indigo-600'}`}>
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4"><Badge color={c.tier === 'HNI' ? 'indigo' : c.tier === 'Corporate' ? 'sky' : 'slate'}>{c.tier}</Badge></td>
                <td className="px-4 py-4"><span className="text-[10px] font-bold text-slate-500">{c.channel}</span></td>
                <td className="px-4 py-4"><span className="text-[10px] font-bold text-slate-500">{c.nationality}</span></td>
                <td className="px-4 py-4"><span className="text-[10px] font-bold text-slate-500">{c.ageGroup}</span></td>
                <td className="px-4 py-4"><span className="text-[10px] font-bold text-slate-500">{c.lang}</span></td>
                <td className="px-4 py-4"><span className="text-[10px] font-bold text-slate-500">{c.frequency}</span></td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : c.status === 'Dormant' ? 'bg-rose-400' : 'bg-amber-400'}`} />
                    <span className="text-xs font-bold text-slate-600">{c.status}</span>
                  </div>
                </td>
                <td className="px-4 py-4"><Badge color={statusColor(c.kyc)}>{c.kyc}</Badge></td>
                <td className="px-4 py-4"><span className="text-xs font-bold text-indigo-600">{c.clv}</span></td>
                <td className="px-4 py-4"><span className={`text-[10px] font-bold ${c.dormant ? 'text-rose-500' : 'text-slate-400'}`}>{c.lastContact}</span></td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setSelectedClient(c.id)} className="w-7 h-7 rounded-lg hover:bg-indigo-50 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><Eye size={13} /></button>
                    <button onClick={() => { setSelectedClient(c.id); setTimeout(() => setAddNoteClient(c.id), 50); }} className="w-7 h-7 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all"><Edit3 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default CustomerIntel;