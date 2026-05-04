// src/pages/ProductData.jsx
// UI only — data from useProductData(). Never fetches directly.

import React, { useState } from 'react';
import {
  Package, BarChart3, Star, Hash, Plus, Coins, CircleDot,
  ArrowUpRight, ArrowDownLeft, X, ChevronDown, AlertCircle,
  RefreshCw, Loader2, Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

import MetricCard            from '../components/ui/MetricCard';
import Badge                 from '../components/ui/Badge';
import { Card, CardHeader }  from '../components/ui/Card';
import { IconBtn, SectionDivider } from '../components/ui/Buttons';
import { useProductData }    from '../hooks/useProductData';
import {
  PRODUCT_TYPE_OPTIONS, CATEGORY_OPTIONS,
  SUB_CATEGORY_OPTIONS, BRAND_OPTIONS, PURITY_OPTIONS,
} from '../data/productMockData';

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:  '#4F46E5', indigoL:  '#EEF2FF',
  amber:   '#D97706', amberL:   '#FFFBEB',
  sky:     '#0284C7', skyL:     '#F0F9FF',
  emerald: '#059669', emeraldL: '#ECFDF5',
  rose:    '#E11D48', roseL:    '#FFF1F2',
  violet:  '#7C3AED', violetL:  '#F5F3FF',
  slate:   '#64748B', slateL:   '#F8FAFC',
};

// ─── Type meta (icon + colour per product category) ──────────────────────────
const TYPE_META = {
  Bars:   { color: C.indigo,  bg: C.indigoL,  icon: Package   },
  Coins:  { color: C.sky,     bg: C.skyL,     icon: Coins     },
  Rounds: { color: C.emerald, bg: C.emeraldL, icon: CircleDot },
  Scrap:  { color: C.rose,    bg: C.roseL,    icon: RefreshCw },
};
const typeMeta    = (t) => TYPE_META[t] ?? { color: C.slate, bg: C.slateL, icon: Package };
const karatColor  = (k) => k?.startsWith('24') ? 'amber' : k?.startsWith('22') ? 'indigo' : 'slate';
const sideColor   = (s) => s === 'Sell-Side' ? 'emerald' : 'sky';
const rankMedal   = (r) => ['🥇','🥈','🥉','4','5'][r - 1] ?? r;

// ─── Shared micro-components ──────────────────────────────────────────────────
const Pill = ({ color, bg, children, small }) => (
  <span style={{
    background: bg, color, fontWeight: 800, borderRadius: 99, letterSpacing: '0.04em',
    fontSize: small ? 9 : 10, padding: small ? '1px 6px' : '2px 9px',
  }}>
    {children}
  </span>
);

const ProgressBar = ({ pct, color, height = 6 }) => (
  <div style={{ height, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{
      width: `${Math.min(pct, 100)}%`, height: '100%', background: color,
      borderRadius: 99, transition: 'width .6s ease',
    }} />
  </div>
);

const MiniDot = ({ color }) => (
  <span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%', background:color, flexShrink:0 }} />
);

const SLabel = ({ children }) => (
  <p style={{ fontSize:9, fontWeight:900, letterSpacing:'0.18em', color:'#94A3B8', textTransform:'uppercase', margin:'0 0 12px' }}>
    {children}
  </p>
);

const ChartTip = ({ active, payload, label, unit='' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:10, padding:'8px 12px', fontSize:11 }}>
      <p style={{ margin:0, fontWeight:700, color:'#475569' }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ margin:'2px 0 0', color:p.color, fontWeight:800 }}>{p.name}: {p.value}{unit}</p>
      ))}
    </div>
  );
};

// ─── Form primitives ──────────────────────────────────────────────────────────
const FLabel = ({ children, required }) => (
  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#475569', marginBottom:5 }}>
    {children}{required && <span style={{ color:C.rose, marginLeft:2 }}>*</span>}
  </label>
);

const FInput = ({ placeholder, value, onChange, type='text' }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    style={{
      width:'100%', padding:'10px 13px', fontSize:13, fontWeight:500,
      color:'#1E293B', background:'#F8FAFC', border:'1.5px solid #E2E8F0',
      borderRadius:10, outline:'none', boxSizing:'border-box', transition:'border-color .15s',
    }}
    onFocus={e => (e.target.style.borderColor = C.indigo)}
    onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
  />
);

const FSelect = ({ value, onChange, options, placeholder, disabled }) => (
  <div style={{ position:'relative' }}>
    <select value={value} onChange={onChange} disabled={disabled}
      style={{
        width:'100%', padding:'10px 34px 10px 13px', fontSize:13, fontWeight:500,
        color: value ? '#1E293B' : '#94A3B8', background: disabled ? '#F1F5F9' : '#F8FAFC',
        border:'1.5px solid #E2E8F0', borderRadius:10, outline:'none',
        appearance:'none', cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing:'border-box', transition:'border-color .15s',
      }}
      onFocus={e => { if (!disabled) e.target.style.borderColor = C.indigo; }}
      onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={13} color="#94A3B8"
      style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
  </div>
);

const FError = ({ msg }) => msg
  ? <p style={{ margin:'4px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{msg}</p>
  : null;

// ─── Add Product Modal ────────────────────────────────────────────────────────
const EMPTY_FORM = {
  productType:'', name:'', category:'', subCategory:'',
  type:'', brand:'', purity:'', weightGrams:'', quantity:'1',
};

// Stable random TXN id per modal mount
const useTxnId = () => useState(() => `TXN-${Math.floor(Math.random()*9000+1000)}`)[0];

const AddProductModal = ({ onClose, onSubmit }) => {
  const txn              = useTxnId();
  const [form, setForm]  = useState(EMPTY_FORM);
  const [errs, setErrs]  = useState({});

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'productType') { next.category = ''; next.subCategory = ''; next.type = ''; }
      if (key === 'category')    { next.subCategory = ''; next.type = ''; }
      return next;
    });
    if (errs[key]) setErrs(p => ({ ...p, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.productType)   e.productType  = 'Required';
    if (!form.name.trim())   e.name         = 'Required';
    if (!form.category)      e.category     = 'Required';
    if (!form.brand)         e.brand        = 'Required';
    if (!form.purity)        e.purity       = 'Required';
    if (!form.weightGrams)   e.weightGrams  = 'Required';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = () => { if (validate()) { onSubmit(form); onClose(); } };
  const isScrap      = form.productType === 'Scrap';
  const cats         = CATEGORY_OPTIONS[form.productType] ?? [];
  const subCats      = SUB_CATEGORY_OPTIONS[form.category] ?? [];
  const typeOpts     = cats; // "Type" mirrors category options per the image

  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(15,23,42,0.6)',
      backdropFilter:'blur(5px)', zIndex:50,
      display:'flex', alignItems:'center', justifyContent:'center', padding:20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:'#fff', borderRadius:20, width:'100%', maxWidth:580,
        boxShadow:'0 32px 80px rgba(0,0,0,0.2)', overflow:'hidden',
        animation:'modalIn .2s cubic-bezier(.16,1,.3,1)',
      }}>

        {/* ── Header ── */}
        <div style={{
          padding:'18px 24px 16px', borderBottom:'1px solid #F1F5F9',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'linear-gradient(135deg,#F8FAFC 0%,#EEF2FF 100%)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:10, background:C.indigo,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Package size={16} color="#fff" />
            </div>
            <div>
              <p style={{ margin:0, fontSize:9, fontWeight:900, letterSpacing:'0.18em', color:'#94A3B8', textTransform:'uppercase' }}>
                New Deal — Product Type
              </p>
              <h3 style={{ margin:'2px 0 0', fontSize:15, fontWeight:900, color:'#0F172A' }}>Add Product</h3>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{
              fontSize:10, fontWeight:700, color:'#94A3B8',
              background:'#fff', border:'1px solid #E2E8F0',
              padding:'4px 10px', borderRadius:8,
            }}>{txn} · draft</span>
            <button onClick={onClose} style={{
              border:'none', background:'#fff', borderRadius:9, width:32, height:32,
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', color:'#64748B', boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
            }}><X size={15}/></button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding:'24px', maxHeight:'68vh', overflowY:'auto' }}>

          {/* Product Type toggle */}
          <div style={{ marginBottom:22 }}>
            <FLabel required>Product Type</FLabel>
            <div style={{
              display:'grid', gridTemplateColumns:`repeat(${PRODUCT_TYPE_OPTIONS.length},1fr)`,
              gap:6, background:'#F1F5F9', borderRadius:12, padding:4,
            }}>
              {PRODUCT_TYPE_OPTIONS.map(opt => {
                const active = form.productType === opt;
                const isS    = opt === 'Scrap';
                return (
                  <button key={opt}
                    onClick={() => setForm(p => ({ ...EMPTY_FORM, productType: opt }))}
                    style={{
                      padding:'11px 0', fontSize:13, fontWeight:800, border:'none',
                      borderRadius:9, cursor:'pointer', transition:'all .18s',
                      background: active ? '#fff' : 'transparent',
                      color: active ? (isS ? C.rose : '#0F172A') : '#94A3B8',
                      boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <FError msg={errs.productType} />
            {/* Scrap info banner */}
            {isScrap && (
              <div style={{
                marginTop:10, padding:'9px 12px', borderRadius:10,
                background:C.roseL, border:`1px solid ${C.rose}25`,
                display:'flex', alignItems:'flex-start', gap:8,
              }}>
                <AlertCircle size={13} color={C.rose} style={{ marginTop:1, flexShrink:0 }} />
                <span style={{ fontSize:11, fontWeight:600, color:'#9F1239', lineHeight:1.5 }}>
                  Scrap — buy-side transaction. Weight will be assayed before final confirmation.
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <div style={{ marginBottom:18 }}>
            <FLabel required>Product Name</FLabel>
            <FInput
              value={form.name} onChange={set('name')}
              placeholder={isScrap ? 'e.g. Mixed Scrap Gold — Client Batch 4' : 'e.g. PAMP Suisse Lady Fortuna 1kg Bar'}
            />
            <FError msg={errs.name} />
          </div>

          {/* Category + Sub Category */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
            <div>
              <FLabel required>Category</FLabel>
              <FSelect value={form.category} onChange={set('category')} options={cats}
                placeholder="Select category" disabled={!form.productType} />
              <FError msg={errs.category} />
            </div>
            <div>
              <FLabel>Sub Category</FLabel>
              <FSelect value={form.subCategory} onChange={set('subCategory')} options={subCats}
                placeholder="Select sub category" disabled={!form.category} />
            </div>
          </div>

          {/* Type + Brand + Purity */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:18 }}>
            <div>
              <FLabel>Type</FLabel>
              <FSelect value={form.type} onChange={set('type')} options={typeOpts}
                placeholder="Select type" disabled={!form.productType} />
            </div>
            <div>
              <FLabel required>Brand / Refinery</FLabel>
              <FSelect value={form.brand} onChange={set('brand')} options={BRAND_OPTIONS}
                placeholder="Select brand" />
              <FError msg={errs.brand} />
            </div>
            <div>
              <FLabel required>Purity</FLabel>
              <FSelect value={form.purity} onChange={set('purity')} options={PURITY_OPTIONS}
                placeholder="Select purity" />
              <FError msg={errs.purity} />
            </div>
          </div>

          {/* Weight + Quantity */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              <FLabel required>Weight (grams)</FLabel>
              <FInput type="number" placeholder="e.g. 1000" value={form.weightGrams} onChange={set('weightGrams')} />
              <FError msg={errs.weightGrams} />
            </div>
            <div>
              <FLabel>Quantity (pieces)</FLabel>
              <FInput type="number" placeholder="1" value={form.quantity} onChange={set('quantity')} />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{
          padding:'14px 24px', borderTop:'1px solid #F1F5F9',
          display:'flex', justifyContent:'flex-end', gap:10, background:'#FAFAFA',
        }}>
          <button onClick={onClose} style={{
            padding:'10px 20px', fontSize:13, fontWeight:700,
            border:'1.5px solid #E2E8F0', borderRadius:10, background:'#fff',
            color:'#64748B', cursor:'pointer',
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            padding:'10px 26px', fontSize:13, fontWeight:800,
            border:'none', borderRadius:10, background:C.indigo, color:'#fff',
            cursor:'pointer', boxShadow:`0 4px 16px ${C.indigo}40`,
            transition:'opacity .15s',
          }}
            onMouseEnter={e => (e.target.style.opacity = '0.88')}
            onMouseLeave={e => (e.target.style.opacity = '1')}
          >Save Product</button>
        </div>
      </div>
      <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

// ─── Loading / Error / Empty states ──────────────────────────────────────────
const SkeletonBlock = ({ w='100%', h=14, r=8 }) => (
  <div style={{
    width:w, height:h, borderRadius:r,
    background:'linear-gradient(90deg,#F1F5F9 25%,#E8EDF3 50%,#F1F5F9 75%)',
    backgroundSize:'400% 100%', animation:'shimmer 1.4s ease infinite',
  }} />
);

const LoadingView = () => (
  <div className="space-y-6">
    <div style={{ display:'flex', alignItems:'center', gap:8, color:'#64748B' }}>
      <Loader2 size={15} style={{ animation:'spin 1s linear infinite' }} />
      <span style={{ fontSize:13, fontWeight:600 }}>Loading product data…</span>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_,i) => (
        <div key={i} style={{ background:'#fff', borderRadius:16, padding:20 }}>
          <SkeletonBlock h={10} w="55%" /><div style={{ height:10 }}/>
          <SkeletonBlock h={26} w="70%" /><div style={{ height:8 }}/>
          <SkeletonBlock h={10} w="45%" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_,i) => (
        <div key={i} style={{ background:'#fff', borderRadius:16, padding:24 }}>
          <SkeletonBlock h={13} w="50%" /><div style={{ height:18 }}/>
          {[...Array(4)].map((__,j) => (
            <div key={j} style={{ marginBottom:14 }}>
              <SkeletonBlock h={10} w="70%" /><div style={{ height:6 }}/>
              <SkeletonBlock h={6} />
            </div>
          ))}
        </div>
      ))}
    </div>
    <style>{`
      @keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
      @keyframes spin{to{transform:rotate(360deg)}}
    `}</style>
  </div>
);

const ErrorView = ({ message, onRetry }) => (
  <div style={{
    display:'flex', flexDirection:'column', alignItems:'center', gap:14,
    padding:'60px 24px', background:C.roseL, borderRadius:16, border:`1px solid ${C.rose}30`,
  }}>
    <AlertCircle size={34} color={C.rose} />
    <p style={{ margin:0, fontSize:14, fontWeight:700, color:C.rose }}>{message}</p>
    <button onClick={onRetry} style={{
      display:'flex', alignItems:'center', gap:6, padding:'9px 20px',
      fontSize:12, fontWeight:800, background:C.rose, color:'#fff',
      border:'none', borderRadius:10, cursor:'pointer',
    }}><RefreshCw size={13}/> Retry</button>
  </div>
);

const EmptyState = ({ label, onAdd }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, padding:'44px 24px', textAlign:'center' }}>
    <Package size={34} color="#CBD5E1" />
    <p style={{ margin:0, fontSize:14, fontWeight:700, color:'#94A3B8' }}>{label}</p>
    {onAdd && (
      <button onClick={onAdd} style={{
        display:'flex', alignItems:'center', gap:6, padding:'8px 18px',
        fontSize:12, fontWeight:800, background:C.indigo, color:'#fff',
        border:'none', borderRadius:10, cursor:'pointer',
      }}><Plus size={13}/> Add First Product</button>
    )}
  </div>
);

// ─── Product Type inline panel ────────────────────────────────────────────────
const EMPTY_PT = {
  productType: '', name: '', category: '', subCategory: '',
  type: '', brand: '', purity: '', weightGrams: '', quantity: '1',
};

const ProductTypePanel = ({ onSave }) => {
  const [form, setForm]     = useState(EMPTY_PT);
  const [errs, setErrs]     = useState({});
  const [saved, setSaved]   = useState(false);

  const set = (key) => (e) => {
    const val = e.target.value;
    setForm(prev => {
      const next = { ...prev, [key]: val };
      if (key === 'productType') { next.category = ''; next.subCategory = ''; next.type = ''; }
      if (key === 'category')    { next.subCategory = ''; next.type = ''; }
      return next;
    });
    if (errs[key]) setErrs(p => ({ ...p, [key]: null }));
    setSaved(false);
  };

  const validate = () => {
    const e = {};
    if (!form.productType)  e.productType = 'Select a type';
    if (!form.name.trim())  e.name        = 'Required';
    if (!form.category)     e.category    = 'Required';
    if (!form.brand)        e.brand       = 'Required';
    if (!form.purity)       e.purity      = 'Required';
    if (!form.weightGrams)  e.weightGrams = 'Required';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
    setSaved(true);
    setTimeout(() => { setForm(EMPTY_PT); setSaved(false); }, 2200);
  };

  const isScrap = form.productType === 'Scrap';
  const cats    = CATEGORY_OPTIONS[form.productType]    ?? [];
  const subCats = SUB_CATEGORY_OPTIONS[form.category]   ?? [];

  // ── type-toggle accent colour ──
  const ptColor = isScrap ? C.rose : C.indigo;
  const ptBg    = isScrap ? C.roseL : C.indigoL;

  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      border: '1px solid #F1F5F9',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* ── Panel header ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px 16px',
        borderBottom: '1px solid #F8FAFC',
        background: 'linear-gradient(135deg, #FAFBFF 0%, #F0F4FF 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* live dot */}
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: form.productType ? ptColor : '#CBD5E1',
            boxShadow: form.productType ? `0 0 0 3px ${ptColor}25` : 'none',
            transition: 'all .3s',
          }} />
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: '#94A3B8', textTransform: 'uppercase' }}>
              New Deal — Product Type
            </p>
            <h3 style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 900, color: '#0F172A' }}>
              Product Entry
            </h3>
          </div>
        </div>
        {/* draft badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saved && (
            <span style={{
              fontSize: 11, fontWeight: 800, color: C.emerald,
              background: C.emeraldL, padding: '4px 12px', borderRadius: 99,
              animation: 'fadeInPop .25s ease',
            }}>✓ Saved</span>
          )}
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#94A3B8',
            background: '#fff', border: '1px solid #E2E8F0',
            padding: '4px 12px', borderRadius: 8,
          }}>
            {form.productType
              ? <span style={{ color: ptColor }}>{form.productType}</span>
              : 'draft'}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 24px 24px' }}>

        {/* Row 0 — Product type toggle */}
        <div style={{ marginBottom: 22 }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: '#475569' }}>
            Product Type <span style={{ color: C.rose }}>*</span>
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${PRODUCT_TYPE_OPTIONS.length}, 1fr)`,
            gap: 6, background: '#F1F5F9', borderRadius: 14, padding: 4,
          }}>
            {PRODUCT_TYPE_OPTIONS.map(opt => {
              const active  = form.productType === opt;
              const isS     = opt === 'Scrap';
              const aColor  = isS ? C.rose : C.indigo;
              return (
                <button key={opt}
                  onClick={() => setForm({ ...EMPTY_PT, productType: opt })}
                  style={{
                    padding: '12px 0', fontSize: 13, fontWeight: 800,
                    border: 'none', borderRadius: 10, cursor: 'pointer',
                    transition: 'all .2s cubic-bezier(.16,1,.3,1)',
                    background: active ? '#fff' : 'transparent',
                    color: active ? aColor : '#94A3B8',
                    boxShadow: active ? `0 2px 12px ${aColor}22, 0 1px 3px rgba(0,0,0,0.08)` : 'none',
                    transform: active ? 'translateY(-1px)' : 'none',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    {isS
                      ? <RefreshCw size={13} color={active ? C.rose : '#CBD5E1'} />
                      : <Package   size={13} color={active ? C.indigo : '#CBD5E1'} />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          {errs.productType && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.productType}</p>}

          {/* Scrap warning strip */}
          {isScrap && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 9,
              marginTop: 10, padding: '10px 14px', borderRadius: 12,
              background: C.roseL, border: `1px solid ${C.rose}22`,
            }}>
              <AlertCircle size={13} color={C.rose} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#9F1239', lineHeight: 1.55 }}>
                Scrap — buy-side transaction. Weight will be assayed before final confirmation.
              </span>
            </div>
          )}
        </div>

        {/* Row 1 — Product name (full width) */}
        <div style={{ marginBottom: 18 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#475569' }}>
            Product Name <span style={{ color: C.rose }}>*</span>
          </p>
          <div style={{ position: 'relative' }}>
            <input
              value={form.name} onChange={set('name')}
              placeholder={isScrap
                ? 'e.g. Mixed Scrap Gold — Client Batch 4'
                : 'e.g. PAMP Suisse Lady Fortuna 1kg Bar'}
              style={{
                width: '100%', padding: '11px 14px 11px 40px', fontSize: 13, fontWeight: 500,
                color: '#1E293B', background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                borderRadius: 11, outline: 'none', boxSizing: 'border-box', transition: 'border-color .15s',
              }}
              onFocus={e => (e.target.style.borderColor = ptColor)}
              onBlur={e  => (e.target.style.borderColor = '#E2E8F0')}
            />
            <Package size={14} color="#CBD5E1" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} />
          </div>
          {errs.name && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.name}</p>}
        </div>

        {/* Row 2 — Category + Sub Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>
              Category <span style={{ color:C.rose }}>*</span>
            </p>
            <FSelect value={form.category} onChange={set('category')} options={cats}
              placeholder="Select category" disabled={!form.productType} />
            {errs.category && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.category}</p>}
          </div>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>Sub Category</p>
            <FSelect value={form.subCategory} onChange={set('subCategory')} options={subCats}
              placeholder="Select sub category" disabled={!form.category} />
          </div>
        </div>

        {/* Row 3 — Type + Brand + Purity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>Type</p>
            <FSelect value={form.type} onChange={set('type')} options={cats}
              placeholder="Select type" disabled={!form.productType} />
          </div>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>
              Brand / Refinery <span style={{ color:C.rose }}>*</span>
            </p>
            <FSelect value={form.brand} onChange={set('brand')} options={BRAND_OPTIONS}
              placeholder="Select brand" />
            {errs.brand && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.brand}</p>}
          </div>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>
              Purity <span style={{ color:C.rose }}>*</span>
            </p>
            <FSelect value={form.purity} onChange={set('purity')} options={PURITY_OPTIONS}
              placeholder="Select purity" />
            {errs.purity && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.purity}</p>}
          </div>
        </div>

        {/* Row 4 — Weight + Quantity + save button */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 14, alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>
              Weight (grams) <span style={{ color:C.rose }}>*</span>
            </p>
            <FInput type="number" placeholder="e.g. 1000" value={form.weightGrams} onChange={set('weightGrams')} />
            {errs.weightGrams && <p style={{ margin:'5px 0 0', fontSize:10, color:C.rose, fontWeight:700 }}>{errs.weightGrams}</p>}
          </div>
          <div>
            <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#475569' }}>Quantity (pieces)</p>
            <FInput type="number" placeholder="1" value={form.quantity} onChange={set('quantity')} />
          </div>
          {/* Save CTA */}
          <button onClick={handleSave} style={{
            height: 42, padding: '0 28px', fontSize: 13, fontWeight: 800,
            border: 'none', borderRadius: 11, cursor: 'pointer',
            background: `linear-gradient(135deg, ${ptColor} 0%, ${isScrap ? '#BE123C' : '#4338CA'} 100%)`,
            color: '#fff',
            boxShadow: `0 4px 18px ${ptColor}40`,
            transition: 'all .18s',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
          >
            Save Product
          </button>
        </div>

        {/* Scrap / Bullion indicator strip at bottom */}
        {form.productType && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginTop: 18, padding: '10px 14px', borderRadius: 12,
            background: ptBg, border: `1px solid ${ptColor}22`,
            transition: 'all .3s',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, borderRadius: 8, background: '#fff',
              boxShadow: `0 2px 8px ${ptColor}20`,
            }}>
              {isScrap
                ? <RefreshCw size={13} color={C.rose}   />
                : <Package   size={13} color={C.indigo} />}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: ptColor }}>
                {isScrap ? 'Scrap Product' : 'Bars / Bullion Product'}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: 10, color: '#64748B', fontWeight: 600 }}>
                {isScrap
                  ? 'Buy-side · subject to assay'
                  : 'Investment grade · sell or buy side'}
              </p>
            </div>
            {form.purity && (
              <span style={{
                marginLeft: 'auto', fontSize: 11, fontWeight: 900,
                color: ptColor, background: '#fff',
                padding: '3px 10px', borderRadius: 99,
                boxShadow: `0 1px 4px ${ptColor}20`,
              }}>{form.purity}</span>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInPop {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const ProductData = () => {
  const { data, loading, error, refetch } = useProductData();
  const [showModal, setShowModal] = useState(false);

  if (loading) return <LoadingView />;
  if (error)   return <ErrorView message={error} onRetry={refetch} />;

  const {
    metrics, hourly, productTypes, origins, coins,
    monthlyTrend, avgDeal, products, performance, buySell,
  } = data;

  // Enrich product types with colour + icon meta (used by Performance donut)
  const richTypes = (productTypes ?? []).map(pt => ({ ...pt, ...typeMeta(pt.type) }));

  const handleAddProduct = (formData) => {
    console.info('[ProductData] new product:', formData);
    // In real mode: await productService.createProduct(formData); refetch();
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── 1. METRIC STRIP ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total KG Sold (Month)" value={metrics?.totalKgMonth?.value} trend={metrics?.totalKgMonth?.trend} icon={Package}  sub={metrics?.totalKgMonth?.sub} />
        <MetricCard label="Today's Volume"         value={metrics?.todayVolume?.value}  trend={metrics?.todayVolume?.trend}  icon={BarChart3} sub={metrics?.todayVolume?.sub}  />
        <MetricCard label="Best Seller"            value={metrics?.bestSeller?.value}                                         icon={Star}      sub={metrics?.bestSeller?.sub}   />
        <MetricCard label="SKUs Tracked"           value={metrics?.skusTracked?.value}                                        icon={Hash}      sub={metrics?.skusTracked?.sub}  />
      </div>

      {/* ── 2. PRODUCT TYPE — inline add-product form ───────────────────── */}
      <ProductTypePanel onSave={handleAddProduct} />

      {/* ── 3. VOLUME · CURRENCY/BUY-SELL · ORIGIN (3-col) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Daily Volume chart */}
        <Card>
          <CardHeader title="Daily Volume" sub="KG sold by hour — today" />
          <div style={{ padding:'8px 24px 0', height:160 }}>
            <ResponsiveContainer>
              <BarChart data={hourly ?? []}>
                <XAxis dataKey="h" tick={{ fontSize:10, fill:'#94A3B8', fontWeight:700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<ChartTip unit=" KG"/>} />
                <Bar dataKey="kg" fill={C.indigo} radius={[6,6,0,0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:8, padding:'12px 24px 16px' }}>
            {[
              { label:'SELL-SIDE', kg:'6.6 KG', deals: buySell?.sell?.deals, color:C.emerald, bg:'#F0FDF4', textColor:'#065F46', Icon:ArrowUpRight },
              { label:'BUY-SIDE',  kg:'2.8 KG', deals: buySell?.buy?.deals,  color:C.sky,    bg:'#F0F9FF', textColor:'#0C4A6E', Icon:ArrowDownLeft },
            ].map(s => (
              <div key={s.label} style={{ flex:1, background:s.bg, borderRadius:10, padding:'9px 10px', textAlign:'center' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, marginBottom:3 }}>
                  <s.Icon size={11} color={s.color} />
                  <span style={{ fontSize:9, fontWeight:900, color:s.color }}>{s.label}</span>
                </div>
                <p style={{ margin:0, fontSize:15, fontWeight:900, color:s.textColor }}>{s.kg}</p>
                <p style={{ margin:0, fontSize:9, color:s.color, fontWeight:600 }}>{s.deals ?? '—'} deals</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Currency & Transaction */}
        <Card>
          <CardHeader title="Currency & Transaction" sub="AED · USD · deal value" />
          <div style={{ padding:'8px 24px 16px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
              {[
                { label:'AED Transactions', val:`${buySell?.aedPct??68}%`, sub:`${buySell?.aedDeals??194} deals`, color:C.indigo, bg:C.indigoL },
                { label:'USD Transactions', val:`${buySell?.usdPct??32}%`, sub:`${buySell?.usdDeals??90} deals`,  color:C.sky,    bg:C.skyL    },
              ].map(c => (
                <div key={c.label} style={{ background:c.bg, borderRadius:12, padding:'12px 10px', textAlign:'center' }}>
                  <p style={{ margin:0, fontSize:22, fontWeight:900, color:c.color }}>{c.val}</p>
                  <p style={{ margin:'3px 0 0', fontSize:9, fontWeight:800, color:c.color }}>{c.label}</p>
                  <p style={{ margin:'2px 0 0', fontSize:9, color:'#94A3B8', fontWeight:600 }}>{c.sub}</p>
                </div>
              ))}
            </div>

            <SectionDivider label="Buy vs Sell Side" />
            {[
              { side:'Sell-Side', vol: buySell?.sell?.kg??'198 KG', pct: buySell?.sell?.pct??70, color:C.emerald },
              { side:'Buy-Side',  vol: buySell?.buy?.kg??'86 KG',   pct: buySell?.buy?.pct??30,  color:C.sky     },
            ].map(s => (
              <div key={s.side} style={{ marginBottom:10 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'#64748B', marginBottom:5 }}>
                  <span>{s.side}</span><span style={{ fontWeight:900 }}>{s.vol}</span>
                </div>
                <ProgressBar pct={s.pct} color={s.color} height={5} />
              </div>
            ))}

            <SectionDivider label="Avg Deal Value" />
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ flex:1, background:C.amberL, borderRadius:10, padding:'8px 10px' }}>
                <p style={{ margin:0, fontSize:9, fontWeight:800, color:C.amber }}>AED AVG / DEAL</p>
                <p style={{ margin:'4px 0 0', fontSize:15, fontWeight:900, color:'#92400E' }}>{buySell?.avgDealAed??'AED 71,400'}</p>
              </div>
              <div style={{ flex:1, background:C.skyL, borderRadius:10, padding:'8px 10px' }}>
                <p style={{ margin:0, fontSize:9, fontWeight:800, color:C.sky }}>USD AVG / DEAL</p>
                <p style={{ margin:'4px 0 0', fontSize:15, fontWeight:900, color:'#0C4A6E' }}>{buySell?.avgDealUsd??'$19,440'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Origin */}
        <Card>
          <CardHeader title="Product Origin" sub="Brand & refinery breakdown" />
          <div style={{ padding:'8px 24px 16px' }}>
            {(origins??[]).map((b,i) => {
              const col = [C.amber,C.indigo,C.sky,C.emerald,C.slate][i%5];
              return (
                <div key={b.brand} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, fontWeight:700, color:'#64748B', marginBottom:5 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <MiniDot color={col} />
                      <span style={{ fontWeight:800, color:'#334155' }}>{b.brand}</span>
                    </div>
                    <span style={{ fontWeight:900 }}>{b.kg}</span>
                  </div>
                  <ProgressBar pct={b.pct*2} color={col} height={5} />
                </div>
              );
            })}

            <SectionDivider label="Coin Breakdown · Mint · Origin" />
            {(coins??[]).map(c => (
              <div key={c.name} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'7px 0', borderBottom:'1px solid #F8FAFC',
              }}>
                <div>
                  <p style={{ margin:0, fontSize:11, fontWeight:800, color:'#1E293B' }}>{c.name}</p>
                  <p style={{ margin:'1px 0 0', fontSize:9, color:'#94A3B8', fontWeight:600 }}>{c.mint} · {c.origin}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <Pill color={C.sky} bg={C.skyL} small>{c.type}</Pill>
                  <p style={{ margin:'3px 0 0', fontSize:10, fontWeight:900, color:'#475569' }}>{c.kg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 4. MONTHLY TREND + AVG DEAL (2-col) ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card>
          <CardHeader title="Monthly Volume Trend" sub="KG sold per product type — last 6 months" />
          <div style={{ padding:'12px 24px 20px', height:210 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyTrend??[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:'#94A3B8', fontWeight:700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:9, fill:'#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip unit=" KG"/>} />
                <Line type="monotone" dataKey="bars"   name="Bars"   stroke={C.indigo}  strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="coins"  name="Coins"  stroke={C.sky}     strokeWidth={2}   dot={false} strokeDasharray="5 3" />
                <Line type="monotone" dataKey="rounds" name="Rounds" stroke={C.emerald} strokeWidth={2}   dot={false} strokeDasharray="2 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:14, padding:'0 24px 16px' }}>
            {[{label:'Bars',color:C.indigo},{label:'Coins',color:C.sky},{label:'Rounds',color:C.emerald}].map(l => (
              <span key={l.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, color:'#64748B' }}>
                <MiniDot color={l.color}/>{l.label}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Avg Deal Value per SKU" sub="AED & USD — value per transaction" />
          <div style={{ padding:'12px 24px 20px', height:210 }}>
            <ResponsiveContainer>
              <BarChart data={avgDeal??[]} layout="vertical" margin={{ left:8, right:16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ fontSize:10, fill:'#64748B', fontWeight:700 }} width={86} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active||!payload?.length) return null;
                  return (
                    <div style={{ background:'#fff', border:'1px solid #E2E8F0', borderRadius:10, padding:'8px 12px', fontSize:11 }}>
                      <p style={{ margin:0, fontWeight:800, color:'#475569' }}>{label}</p>
                      <p style={{ margin:'2px 0 0', color:C.indigo, fontWeight:800 }}>AED {payload[0]?.value?.toLocaleString()}</p>
                      <p style={{ margin:'2px 0 0', color:C.sky,    fontWeight:800 }}>USD {payload[1]?.value?.toLocaleString()}</p>
                    </div>
                  );
                }}/>
                <Bar dataKey="aed" name="AED" fill={C.indigo} radius={[0,4,4,0]} barSize={8} />
                <Bar dataKey="usd" name="USD" fill={C.sky}    radius={[0,4,4,0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', gap:14, padding:'0 24px 16px' }}>
            {[{label:'AED',color:C.indigo},{label:'USD',color:C.sky}].map(l => (
              <span key={l.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, color:'#64748B' }}>
                <MiniDot color={l.color}/>{l.label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 5. PERFORMANCE OVERVIEW (SKU rank + donut) ──────────────────── */}
      <Card>
        <CardHeader title="Performance Overview" sub="Revenue contribution % · Best-sellers · SKU ranking" />
        <div style={{ padding:'0 24px 20px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* SKU ranking */}
            <div>
              <SLabel>SKU Performance Ranking</SLabel>
              {(performance??[]).map(p => {
                const tc = typeMeta(p.category);
                return (
                  <div key={p.sku} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #F8FAFC' }}>
                    <span style={{ fontSize:16, width:24, textAlign:'center', flexShrink:0 }}>{rankMedal(p.rank)}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:800, color:'#1E293B' }}>{p.name}</span>
                        <Pill color={tc.color} bg={tc.bg} small>{p.category}</Pill>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1 }}><ProgressBar pct={p.revShare*2.5} color={tc.color} height={5}/></div>
                        <span style={{ fontSize:10, fontWeight:900, color:tc.color, width:32 }}>{p.revShare}%</span>
                      </div>
                      <p style={{ margin:'3px 0 0', fontSize:9, color:'#94A3B8', fontWeight:600 }}>
                        {p.sku} · {p.units} KG / month
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue donut */}
            <div>
              <SLabel>Revenue Contribution by Category</SLabel>
              <div style={{ height:190 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={richTypes.map(pt=>({name:pt.type,value:pt.pct}))}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                      paddingAngle={2} dataKey="value" stroke="none">
                      {richTypes.map((pt,i) => <Cell key={i} fill={pt.color}/>)}
                    </Pie>
                    <Tooltip content={<ChartTip unit="% revenue"/>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:8 }}>
                {richTypes.map(pt => (
                  <div key={pt.type} style={{ display:'flex', alignItems:'center', gap:6, background:pt.bg, borderRadius:8, padding:'5px 10px' }}>
                    <MiniDot color={pt.color}/>
                    <span style={{ fontSize:10, fontWeight:800, color:pt.color }}>{pt.type}</span>
                    <span style={{ fontSize:10, fontWeight:900, color:'#64748B' }}>{pt.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── 6. PRODUCT CATALOGUE ────────────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Product Catalogue"
          sub="Name · Category · Sub Cat · Brand · Purity · Scrap flag"
          action={<IconBtn icon={Plus} label="Add Product" variant="primary" onClick={() => setShowModal(true)} />}
        />
        {(products??[]).length === 0
          ? <EmptyState label="No products yet." onAdd={() => setShowModal(true)} />
          : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid #F1F5F9' }}>
                    {['#','Product','Product Type','Category','Sub Cat.','Brand','Purity','Scrap?','Wt. Today','Wt. Month','Revenue','Currency','Side','Rev. Share'].map(h => (
                      <th key={h} style={{
                        padding:'13px 12px', textAlign:'left', fontSize:9, fontWeight:900,
                        color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.14em', whiteSpace:'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(products??[]).map((p,i) => {
                    const pt = p.productType === 'Scrap' ? typeMeta('Scrap') : typeMeta(p.category);
                    return (
                      <tr key={p.id??i}
                        style={{ borderBottom:'1px solid #FAFAFA', transition:'background .14s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding:'12px 12px', fontSize:11, fontWeight:900, color:'#CBD5E1' }}>{String(i+1).padStart(2,'0')}</td>
                        <td style={{ padding:'12px 12px', fontSize:12, fontWeight:800, color:'#1E293B', whiteSpace:'nowrap' }}>{p.name}</td>
                        <td style={{ padding:'12px 12px' }}><Pill color={pt.color} bg={pt.bg}>{p.productType}</Pill></td>
                        <td style={{ padding:'12px 12px', fontSize:11, color:'#64748B', fontWeight:700 }}>{p.category}</td>
                        <td style={{ padding:'12px 12px', fontSize:10, color:'#94A3B8', fontWeight:600 }}>{p.subCategory}</td>
                        <td style={{ padding:'12px 12px', fontSize:11, color:'#64748B', fontWeight:700, whiteSpace:'nowrap' }}>{p.brand}</td>
                        <td style={{ padding:'12px 12px' }}><Badge color={karatColor(p.purity)}>{p.purity}</Badge></td>
                        <td style={{ padding:'12px 12px' }}>
                          {p.isScrap
                            ? <Pill color={C.rose}    bg={C.roseL}>Scrap</Pill>
                            : <Pill color={C.emerald} bg={C.emeraldL}>Bullion</Pill>}
                        </td>
                        <td style={{ padding:'12px 12px', fontSize:11, fontWeight:800, color:'#334155' }}>{p.today}</td>
                        <td style={{ padding:'12px 12px', fontSize:11, fontWeight:800, color:'#334155' }}>{p.month}</td>
                        <td style={{ padding:'12px 12px', fontSize:11, fontWeight:900, color:C.indigo }}>{p.rev}</td>
                        <td style={{ padding:'12px 12px', fontSize:10, fontWeight:800, color:'#94A3B8' }}>{p.currency}</td>
                        <td style={{ padding:'12px 12px' }}><Badge color={sideColor(p.side)}>{p.side}</Badge></td>
                        <td style={{ padding:'12px 12px', minWidth:110 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <div style={{ flex:1, height:5, background:'#F1F5F9', borderRadius:99, overflow:'hidden' }}>
                              <div style={{ width:`${p.revShare*2.5}%`, height:'100%', background:C.indigo, borderRadius:99 }}/>
                            </div>
                            <span style={{ fontSize:10, fontWeight:900, color:'#64748B', minWidth:26 }}>{p.revShare}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </Card>

      {/* ── Add Product Modal ──────────────────────────────────────────── */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
        />
      )}

    </div>
  );
};

export default ProductData;