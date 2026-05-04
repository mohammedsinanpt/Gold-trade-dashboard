export const IconBtn = ({ icon: Icon, label, onClick, variant = 'ghost' }) => {
  const base = 'inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all';
  const variants = {
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-800',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200',
    outline: 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]}`}>
      <Icon size={14} />{label && <span>{label}</span>}
    </button>
  );
};

export const SectionDivider = ({ label }) => (
  <div className="flex items-center space-x-3 py-2">
    <div className="h-px flex-1 bg-slate-100" />
    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">{label}</p>
    <div className="h-px flex-1 bg-slate-100" />
  </div>
);