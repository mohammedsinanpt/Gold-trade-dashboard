export const Card = ({ children, className = '' }) => (
  <div className={`bg-white border border-slate-100 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, sub, action }) => (
  <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-50">
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">{title}</p>
      {sub && <p className="text-base font-bold text-slate-800 mt-0.5">{sub}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);