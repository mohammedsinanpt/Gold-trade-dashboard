import React, { useState } from 'react';
import './index.css';
import { 
  Users, Target, Box, GitMerge, Award, BarChart3, TrendingUp, 
  Search, Bell, ChevronRight, Zap, ArrowUpRight, Globe, 
  Layers, Shield, CreditCard, Settings, LogOut, CheckCircle2, 
  Clock, Hash, Filter, Briefcase // <--- Added Briefcase here!
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';

// --- PREMIUM DESIGN COMPONENTS ---
const GlassCard = ({ title, subtitle, children, className = "" }) => (
  <div className={`bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] p-8 transition-all hover:shadow-[0_30px_60px_rgba(79,70,229,0.08)] hover:-translate-y-1 ${className}`}>
    <div className="flex justify-between items-start mb-8">
      <div>
        <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">{title}</h4>
        {subtitle && <p className="text-sm text-slate-900 mt-1 font-bold">{subtitle}</p>}
      </div>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
        <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
      </div>
    </div>
    {children}
  </div>
);

const MetricHero = ({ label, value, trend, icon: Icon, color, isNegative }) => (
  <div className="bg-white border border-slate-100 rounded-[2.5rem] p-7 shadow-sm group cursor-pointer hover:ring-2 ring-indigo-500/20 transition-all">
    <div className="flex justify-between items-start">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-indigo-600 shadow-inner`}>
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div className={`flex items-center ${isNegative ? 'text-rose-500' : 'text-emerald-500'} text-xs font-black px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100`}>
        {trend} <ArrowUpRight size={14} className={`ml-1 ${isNegative ? 'rotate-90' : ''}`} />
      </div>
    </div>
    <div className="mt-8">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

// --- ALL 7 MASTER LAYERS ---

const Layer1 = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MetricHero label="Global Clients" value="12,840" trend="+14.2%" icon={Users} color="bg-indigo-600" />
      <MetricHero label="Avg. Order Value" value="$4,250" trend="+8.1%" icon={CreditCard} color="bg-blue-600" />
      <MetricHero label="Retention Score" value="98.2%" trend="+2.4%" icon={Shield} color="bg-violet-600" />
      <MetricHero label="Growth Ratio" value="1.4x" trend="+12%" icon={TrendingUp} color="bg-pink-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <GlassCard title="Customer Tiers" subtitle="Revenue Distribution" className="lg:col-span-1">
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer><PieChart><Pie data={[{n:'Retail', v:40}, {n:'Corp', v:35}, {n:'HNI', v:25}]} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="v"><Cell fill="#6366f1"/><Cell fill="#8b5cf6"/><Cell fill="#f43f5e"/></Pie><Tooltip/></PieChart></ResponsiveContainer>
        </div>
      </GlassCard>
      <GlassCard title="Purchase Velocity" subtitle="Activity per demographic" className="lg:col-span-2">
        <div className="h-64"><ResponsiveContainer><AreaChart data={[{n:'18-30', v:40}, {n:'31-45', v:90}, {n:'46-60', v:55}, {n:'60+', v:30}]}><XAxis dataKey="n" hide/><Tooltip/><Area type="step" dataKey="v" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3}/></AreaChart></ResponsiveContainer></div>
      </GlassCard>
    </div>
  </div>
);

const Layer2 = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <GlassCard title="Lead Acquisition Pipeline" className="lg:col-span-2">
      <div className="h-96"><ResponsiveContainer><BarChart data={[{n:'SEO', v:4000}, {n:'Ads', v:3000}, {n:'Social', v:2000}, {n:'Refer', v:2780}]}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n"/><Tooltip/><Bar dataKey="v" fill="#4F46E5" radius={[15, 15, 0, 0]}/></BarChart></ResponsiveContainer></div>
    </GlassCard>
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Top Source</p>
          <h2 className="text-3xl font-black mt-2">Organic Search</h2>
          <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
            <div><p className="text-xs text-slate-400 font-bold uppercase">ROI Ratio</p><p className="text-2xl font-black text-emerald-400">12:1</p></div>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center"><ArrowUpRight className="text-emerald-400"/></div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"/>
      </div>
    </div>
  </div>
);

const Layer3 = () => (
  <GlassCard title="Product Analytics" subtitle="Inventory Integrity & SKU Weight">
    <div className="overflow-hidden rounded-3xl border border-slate-100">
      <table className="w-full text-left">
        <thead className="bg-slate-50/50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">
          <tr><th className="p-6">Product Line</th><th className="p-6">Purity Status</th><th className="p-6">Net Weight</th><th className="p-6">Daily Trend</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {['24K Bullion Bar', '22K Commemorative', '18K Bespoke Set'].map((name, i) => (
            <tr key={i} className="hover:bg-indigo-50/30 transition-colors group">
              <td className="p-6 font-bold text-slate-800 flex items-center"><Hash size={14} className="mr-3 text-indigo-300"/> {name}</td>
              <td className="p-6"><span className="px-4 py-1.5 rounded-xl bg-amber-100/50 text-amber-700 text-[10px] font-black uppercase">Certified {99 - i*5}%</span></td>
              <td className="p-6 font-medium text-slate-500">{(420 * (i+1))} g</td>
              <td className="p-6 text-emerald-600 font-black flex items-center"><TrendingUp size={14} className="mr-2"/> +{(1.2 * (i+1)).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </GlassCard>
);

const Layer4 = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
    {['Enquiry', 'Quotation', 'Negotiate', 'Closing', 'Settled'].map((s, i) => (
      <div key={i} className="group relative">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm text-center group-hover:ring-2 ring-indigo-500 transition-all">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 font-black text-xl shadow-inner italic">0{i+1}</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{s}</p>
          <p className="text-2xl font-black text-slate-900">${(Math.random()*25).toFixed(1)}M</p>
        </div>
      </div>
    ))}
  </div>
);

const Layer5 = () => (
  <GlassCard title="Force Performance" subtitle="Real-time consultant rankings">
    <div className="space-y-4">
      {['Abraham K.', 'Sarah J.', 'Thomas P.'].map((name, i) => (
        <div key={i} className="flex items-center justify-between p-6 bg-white border border-slate-50 rounded-[2rem] hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center space-x-5">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic">{i+1}</div>
            <div>
              <p className="font-black text-slate-800 tracking-tight">{name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Senior Partner</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-indigo-600">${(950 - i*150)}k</p>
            <div className="flex items-center justify-end text-emerald-500 text-[10px] font-black uppercase"><CheckCircle2 size={12} className="mr-1"/> Target Met</div>
          </div>
        </div>
      ))}
    </div>
  </GlassCard>
);

const Layer6 = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-3 gap-6">
      <MetricHero label="MTD Revenue" value="$8.42M" trend="+18%" icon={BarChart3} color="bg-indigo-600" />
      <MetricHero label="Gross Margin" value="32.4%" trend="-1.2%" icon={Filter} color="bg-slate-800" isNegative />
      <MetricHero label="Avg Deal" value="$240k" trend="+5.4%" icon={Zap} color="bg-sky-500" />
    </div>
    <GlassCard title="Financial Velocity" subtitle="Revenue trajectory vs Last Year">
      <div className="h-80"><ResponsiveContainer><LineChart data={[{n:'W1', v:400, l:300}, {n:'W2', v:600, l:450}, {n:'W3', v:550, l:500}, {n:'W4', v:900, l:600}]}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="n"/><Tooltip/><Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={5} dot={{r: 6, fill: '#6366f1'}}/></LineChart></ResponsiveContainer></div>
    </GlassCard>
  </div>
);

const Layer7 = () => (
  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
    <div className="relative z-10">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30 text-indigo-400"><Clock size={20}/></div>
        <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">AI Projection Engine</p>
      </div>
      <h2 className="text-5xl font-black mb-6 italic tracking-tighter">Gold Seasonality <span className="text-indigo-400">Forecast</span></h2>
      <p className="text-indigo-200/60 max-w-xl font-medium mb-12">Neural network analysis predicts a 22% surge in bulk bullion acquisition for the upcoming Q4 period based on global inflation sensitivity.</p>
      <div className="flex space-x-12">
        <div><p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-2">Confidence Level</p><p className="text-5xl font-black italic">94.2%</p></div>
        <div><p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.2em] mb-2">Projected Upside</p><p className="text-5xl font-black italic text-emerald-400">+$4.2M</p></div>
      </div>
    </div>
    <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"/>
  </div>
);

// --- MAIN ARCHITECTURE ---
export default function App() {
  const [active, setActive] = useState(1);
  const tabs = [
    { id: 1, n: 'Intelligence', i: <Users size={18}/> },
    { id: 2, n: 'Lead Source', i: <Target size={18}/> },
    { id: 3, n: 'Inventory', i: <Box size={18}/> },
    { id: 4, n: 'Deal Pipeline', i: <GitMerge size={18}/> },
    { id: 5, n: 'Performance', i: <Award size={18}/> },
    { id: 6, n: 'Analytics', i: <BarChart3 size={18}/> },
    { id: 7, n: 'Forecasting', i: <TrendingUp size={18}/> },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Sidebar - The Control Tower */}
      <aside className="w-80 bg-white border-r border-slate-100 p-10 flex flex-col shadow-[10px_0_60px_rgba(0,0,0,0.02)] z-50">
        <div className="flex items-center space-x-4 mb-16 px-2">
            <div className="bg-indigo-600 p-3.5 rounded-[1.2rem] text-white shadow-2xl shadow-indigo-200 -rotate-6"><Layers size={26} strokeWidth={2.5}/></div>
            <h1 className="text-3xl font-black tracking-tighter italic">AURIFY<span className="text-indigo-600">.</span></h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} className={`flex items-center justify-between w-full p-5 rounded-[1.5rem] text-sm font-black transition-all group ${active === t.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 translate-x-2' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
              <div className="flex items-center space-x-4">{t.i} <span>{t.n}</span></div>
              {active === t.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        {/* PROPER PROFILE SECTION */}
        <div className="mt-12 pt-8 border-t border-slate-50">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group cursor-pointer hover:bg-slate-100 transition-all">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl shadow-lg border-2 border-white flex items-center justify-center text-white font-black text-lg shadow-indigo-100">AS</div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-800 leading-none">Admin_Senior</p>
                        <p className="text-[10px] text-indigo-500 font-black uppercase mt-1 tracking-widest">Enterprise Access</p>
                    </div>
                </div>
                <div className="flex justify-between mt-6 px-1">
                    <div className="text-slate-400 hover:text-indigo-600 transition-colors"><Settings size={18}/></div>
                    <div className="text-slate-400 hover:text-rose-500 transition-colors"><LogOut size={18}/></div>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-[radial-gradient(#e2e4e9_1.2px,transparent_1.2px)] [background-size:40px_40px]">
        {/* Header Console */}
        <header className="flex justify-between items-center mb-16">
          <div className="relative w-[450px] group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20}/>
            <input className="w-full bg-white border border-slate-100 rounded-[2rem] py-5 pl-14 pr-6 text-sm shadow-sm focus:shadow-xl focus:shadow-indigo-500/5 focus:ring-4 ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Global system intelligence search..."/>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Cloud: Active</span>
            </div>
            <button className="relative text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
              <Bell size={26} strokeWidth={2.2}/>
              <span className="absolute top-0 right-0 w-3 h-3 bg-indigo-600 rounded-full border-[3px] border-white shadow-sm" />
            </button>
          </div>
        </header>

        {/* Dashboard Title Section */}
        <div className="mb-12 flex justify-between items-end">
            <div>
                <h2 className="text-5xl font-black tracking-tighter text-slate-900 italic uppercase">Dashboard<span className="text-indigo-600">.</span></h2>
                <div className="flex items-center space-x-4 mt-3">
                    <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] flex items-center">
                        <Briefcase size={12} className="mr-2"/> Core Interface v4.5.0
                    </p>
                    <div className="h-1 w-1 bg-slate-300 rounded-full" />
                    <p className="text-indigo-500 font-black text-[11px] uppercase tracking-[0.3em]">
                        {tabs.find(t=>t.id===active).n}
                    </p>
                </div>
            </div>
            <div className="flex space-x-4">
                <button className="bg-white text-slate-600 border border-slate-100 px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center shadow-sm">Export Data</button>
                <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/20 transition-all flex items-center group">
                    <Zap size={14} className="mr-2 fill-indigo-400 text-indigo-400 group-hover:animate-bounce"/> Initiate Sync Engine
                </button>
            </div>
        </div>

        {/* Rendered Layers */}
        <div className="relative min-h-[600px]">
            {active === 1 && <Layer1 />}
            {active === 2 && <Layer2 />}
            {active === 3 && <Layer3 />}
            {active === 4 && <Layer4 />}
            {active === 5 && <Layer5 />}
            {active === 6 && <Layer6 />}
            {active === 7 && <Layer7 />}
        </div>
      </main>
    </div>
  );
}