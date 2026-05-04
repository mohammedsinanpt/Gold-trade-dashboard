import { ArrowUpRight } from 'lucide-react';

const MetricCard = ({ label, value, trend, trendUp = true, icon: Icon, sub }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
    <div className="flex justify-between items-start mb-5">
      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <Icon size={18} />
      </div>
      {trend && (
        <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          {trend} <ArrowUpRight size={11} className="ml-0.5" />
        </div>
      )}
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 font-medium mt-1">{sub}</p>}
  </div>
);

export default MetricCard;