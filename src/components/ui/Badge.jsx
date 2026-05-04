const Badge = ({ children, color = 'indigo' }) => {
  const styles = {
    indigo: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    rose: 'bg-rose-50 text-rose-500 border border-rose-100',
    amber: 'bg-amber-50 text-amber-600 border border-amber-100',
    slate: 'bg-slate-100 text-slate-500 border border-slate-200',
    sky: 'bg-sky-50 text-sky-600 border border-sky-100',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${styles[color]}`}>
      {children}
    </span>
  );
};

export default Badge;