import React, { useState } from 'react';
import {
  LayoutGrid, Users, Target, Box, GitMerge, Award,
  BarChart3, TrendingUp, Shield, Search, Bell, Settings,
  CheckCircle2, AlertTriangle, XCircle, Gauge,
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import CustomerIntel from './pages/CustomerIntel';
import LeadAcquisition from './pages/LeadAcquisition';
import ProductData from './pages/ProductData';
import PriceBenchmarking from './pages/PriceBenchmarking';
import Pipeline from './pages/Pipeline';
import TeamPerformance from './pages/TeamPerformance';
import RevenueAnalytics from './pages/RevenueAnalytics';
import StrategicForecast from './pages/StrategicForecast';
import { ALERTS } from './data/mockData';

const menuItems = [
  { id: 0, n: 'Dashboard',             i: <LayoutGrid size={20} /> },
  { id: 1, n: 'Customer Intelligence', i: <Users size={20} /> },
  { id: 2, n: 'Lead Acquisition',      i: <Target size={20} /> },
  { id: 3, n: 'Dealings',              i: <Box size={20} /> },
  { id: 4, n: 'Fixing & Benchmarking', i: <Gauge size={20} /> },
  { id: 5, n: 'Sales Pipeline',        i: <GitMerge size={20} /> },
  { id: 6, n: 'Team Performance',      i: <Award size={20} /> },
  { id: 7, n: 'Revenue Analytics',     i: <BarChart3 size={20} /> },
  { id: 8, n: 'Strategic Forecast',    i: <TrendingUp size={20} /> },
];

const pages = [
  Dashboard,        // 0
  CustomerIntel,    // 1
  LeadAcquisition,  // 2
  ProductData,      // 3
  PriceBenchmarking,// 4  ← NEW
  Pipeline,         // 5
  TeamPerformance,  // 6
  RevenueAnalytics, // 7
  StrategicForecast,// 8
];

export default function App() {
  const [active, setActive] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);

  const ActivePage = pages[active];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col flex-none">
        <div className="px-7 py-7 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-[15px] font-black tracking-tight text-slate-900">Aurify <span className="text-indigo-600">CRM</span></h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Enterprise Core</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] px-4 mb-4">Menu</p>
          {menuItems.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center space-x-3 w-full px-4 py-3.5 rounded-xl text-[13px] font-bold transition-all relative ${
                active === t.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {active === t.id && (
                <div className="absolute left-0 w-1 h-5 bg-indigo-600 rounded-r-full" />
              )}
              <span className={active === t.id ? 'text-indigo-600' : 'text-slate-300'}>{t.i}</span>
              <span>{t.n}</span>
              {t.id === 0 && ALERTS.length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {ALERTS.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-7 py-6 border-t border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px] font-black">AS</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">Admin_Senior</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Enterprise Level</p>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between flex-none">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {menuItems.find((t) => t.id === active)?.n}
              <span className="text-indigo-600">.</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-2 animate-pulse" />
              Live Intelligence ·{' '}
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium placeholder:text-slate-300 w-52 focus:ring-2 ring-indigo-500/20 outline-none focus:bg-white transition-all"
                placeholder="Search intelligence..."
              />
            </div>
            <button
              onClick={() => setAlertOpen(!alertOpen)}
              className="relative w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[8px] font-black flex items-center justify-center">
                {ALERTS.length}
              </span>
            </button>

            {alertOpen && (
              <div className="absolute top-16 right-6 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-black text-slate-800">Notifications</p>
                  <button onClick={() => setAlertOpen(false)}>
                    <XCircle size={14} className="text-slate-400" />
                  </button>
                </div>
                {ALERTS.map((a) => (
                  <div key={a.id} className="px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-all">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-none mt-0.5 ${
                          a.type === 'kyc'
                            ? 'bg-emerald-100 text-emerald-600'
                            : a.type === 'dormant'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-indigo-100 text-indigo-600'
                        }`}
                      >
                        {a.type === 'kyc' ? (
                          <CheckCircle2 size={11} />
                        ) : a.type === 'dormant' ? (
                          <AlertTriangle size={11} />
                        ) : (
                          <Target size={11} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] font-medium text-slate-700 leading-relaxed">{a.text}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="w-9 h-9 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all">
              <Settings size={16} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ActivePage onNavigate={setActive} />
        </div>
      </main>
    </div>
  );
}