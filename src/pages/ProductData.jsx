// src/pages/ProductData.jsx
// UI only — all data from useProductData(). Never fetches directly.

import React, { useState } from 'react';
import {
  Package, BarChart3, Star, Hash, Plus, Coins, CircleDot,
  ArrowUpRight, ArrowDownLeft, AlertCircle, RefreshCw, Loader2, ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts';

import MetricCard               from '../components/ui/MetricCard';
import Badge                    from '../components/ui/Badge';
import { Card, CardHeader }     from '../components/ui/Card';
import { IconBtn, SectionDivider } from '../components/ui/Buttons';
import { useProductData }       from '../hooks/useProductData';
import {
  PRODUCT_TYPE_OPTIONS, CATEGORY_OPTIONS,
  SUB_CATEGORY_OPTIONS, BRAND_OPTIONS, PURITY_OPTIONS,
} from '../data/productMockData';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  indigo:  '#4F46E5', indigoL: '#EEF2FF',
  amber:   '#D97706', amberL:  '#FFFBEB',
  sky:     '#0284C7', skyL:    '#F0F9FF',
  emerald: '#059669', emeraldL:'#ECFDF5',
  rose:    '#E11D48', roseL:   '#FFF1F2',
  slate:   '#64748B', slateL:  '#F8FAFC',
};

// ─── Type meta ────────────────────────────────────────────────────────────────
const TYPE_META = {
  Bars:   { color: C.indigo,  bg: C.indigoL,  icon: Package   },
  Coins:  { color: C.sky,     bg: C.skyL,     icon: Coins     },
  Rounds: { color: C.emerald, bg: C.emeraldL, icon: CircleDot },
  Scrap:  { color: C.rose,    bg: C.roseL,    icon: RefreshCw },
};
const typeMeta   = (t) => TYPE_META[t] ?? { color: C.slate, bg: C.slateL, icon: Package };
const karatColor = (k) => k?.startsWith('24') ? 'amber' : k?.startsWith('22') ? 'indigo' : 'slate';
const sideColor  = (s) => s === 'Sell-Side' ? 'emerald' : 'sky';
const rankMedal  = (r) => ['🥇','🥈','🥉','4','5'][r - 1] ?? r;

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
const Pill = ({ color, bg, children, sm }) => (
  <span style={{
    background: bg, color, fontWeight: 800, borderRadius: 99,
    fontSize: sm ? 9 : 10, padding: sm ? '1px 6px' : '2px 9px',
  }}>{children}</span>
);

const Bar2 = ({ pct, color, h = 5 }) => (
  <div style={{ height: h, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .5s ease' }} />
  </div>
);

const Dot = ({ color }) => (
  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
);

const SLabel = ({ children }) => (
  <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.18em', color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 12px' }}>
    {children}
  </p>
);

const Tip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ margin: 0, fontWeight: 700, color: '#475569' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: '2px 0 0', color: p.color, fontWeight: 800 }}>{p.name}: {p.value}{unit}</p>
      ))}
    </div>
  );
};

// ─── Form atoms ───────────────────────────────────────────────────────────────
const FL = ({ children, req }) => (
  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#64748B' }}>
    {children}{req && <span style={{ color: C.rose, marginLeft: 2 }}>*</span>}
  </p>
);

const FInput = ({ value, onChange, placeholder, type = 'text', accent = C.indigo }) => (
  <input
    type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{
      width: '100%', padding: '10px 13px', fontSize: 13, fontWeight: 500,
      color: '#1E293B', background: '#fff', border: '1.5px solid #E8EDF5',
      borderRadius: 10, outline: 'none', boxSizing: 'border-box', transition: 'all .15s',
    }}
    onFocus={e => { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; }}
    onBlur={e  => { e.target.style.borderColor = '#E8EDF5'; e.target.style.boxShadow = 'none'; }}
  />
);

const FSelect = ({ value, onChange, options, placeholder, disabled = false, accent = C.indigo }) => (
  <div style={{ position: 'relative' }}>
    <select
      value={value} onChange={onChange} disabled={disabled}
      style={{
        width: '100%', padding: '10px 34px 10px 13px', fontSize: 13, fontWeight: 500,
        color: value ? '#1E293B' : '#94A3B8',
        background: disabled ? '#F8FAFC' : '#fff',
        border: '1.5px solid #E8EDF5', borderRadius: 10, outline: 'none',
        appearance: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        boxSizing: 'border-box', transition: 'all .15s', opacity: disabled ? 0.5 : 1,
      }}
      onFocus={e => { if (!disabled) { e.target.style.borderColor = accent; e.target.style.boxShadow = `0 0 0 3px ${accent}18`; } }}
      onBlur={e  => { e.target.style.borderColor = '#E8EDF5'; e.target.style.boxShadow = 'none'; }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown size={13} color="#94A3B8" style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

const FErr = ({ msg }) => msg
  ? <p style={{ margin: '4px 0 0', fontSize: 10, color: C.rose, fontWeight: 700 }}>{msg}</p>
  : null;

// ─── ProductTypePanel ─────────────────────────────────────────────────────────
const EMPTY = { productType: '', name: '', category: '', subCategory: '', type: '', brand: '', purity: '', weightGrams: '', quantity: '1' };

const ProductTypePanel = ({ onSave }) => {
  const [form, setForm] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [done, setDone] = useState(false);

  const set = (key) => (e) => {
    const v = e.target.value;
    setForm(p => {
      const n = { ...p, [key]: v };
      if (key === 'productType') { n.category = ''; n.subCategory = ''; n.type = ''; }
      if (key === 'category')    { n.subCategory = ''; n.type = ''; }
      return n;
    });
    if (errs[key]) setErrs(p => ({ ...p, [key]: null }));
    setDone(false);
  };

  const pickType = (opt) => {
    setForm({ ...EMPTY, productType: opt });
    setErrs({});
    setDone(false);
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

  const save = () => {
    if (!validate()) return;
    onSave(form);
    setDone(true);
    setTimeout(() => { setForm(EMPTY); setDone(false); }, 2500);
  };

  const isScrap  = form.productType === 'Scrap';
  const accent   = isScrap ? C.rose : C.indigo;
  const cats     = CATEGORY_OPTIONS[form.productType]   ?? [];
  const subCats  = SUB_CATEGORY_OPTIONS[form.category]  ?? [];

  // How many fields are filled — drives the step progress dots
  const filled = [form.productType, form.name, form.category, form.brand, form.purity, form.weightGrams].filter(Boolean).length;
  const total  = 6;

  return (
    <div style={{
      borderRadius: 20,
      background: 'linear-gradient(160deg, #FAFBFF 0%, #F4F6FF 100%)',
      border: '1px solid #E8EDF5',
      boxShadow: '0 4px 24px rgba(79,70,229,0.06), 0 1px 3px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>

      {/* ── HEADER BAR ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 22px',
        background: form.productType
          ? `linear-gradient(135deg, ${accent}10 0%, ${accent}05 100%)`
          : 'linear-gradient(135deg, #F0F4FF 0%, #E8EDF5 100%)',
        borderBottom: `1px solid ${form.productType ? accent + '18' : '#E8EDF5'}`,
        transition: 'all .4s ease',
      }}>
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: form.productType ? accent : '#E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: form.productType ? `0 4px 14px ${accent}40` : 'none',
            transition: 'all .3s ease',
          }}>
            {isScrap
              ? <RefreshCw size={17} color="#fff" />
              : <Package   size={17} color={form.productType ? '#fff' : '#94A3B8'} />}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#94A3B8', textTransform: 'uppercase' }}>
              New Deal — Product Entry
            </p>
            <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 900, color: '#0F172A' }}>
              {form.productType ? form.productType : 'Select Product Type'}
            </p>
          </div>
        </div>

        {/* Right: progress + status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Step dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[...Array(total)].map((_, i) => (
              <div key={i} style={{
                width: i < filled ? 18 : 6, height: 6,
                borderRadius: 99, transition: 'all .3s ease',
                background: i < filled ? accent : '#CBD5E1',
              }} />
            ))}
          </div>

          {done ? (
            <span style={{
              fontSize: 11, fontWeight: 800, color: C.emerald,
              background: C.emeraldL, padding: '5px 14px', borderRadius: 99,
              border: `1px solid ${C.emerald}30`,
              animation: 'popIn .25s cubic-bezier(.16,1,.3,1)',
            }}>✓ Saved</span>
          ) : (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#94A3B8',
              background: '#fff', border: '1px solid #E2E8F0',
              padding: '5px 12px', borderRadius: 8,
            }}>
              {filled}/{total} fields
            </span>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: '18px 22px 20px' }}>

        {/* ── Type toggle + scrap notice — single compact row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
          <FL req>Product Type</FL>
          <div style={{
            display: 'inline-flex', background: '#F1F5F9',
            borderRadius: 10, padding: 3, gap: 3, flexShrink: 0,
          }}>
            {PRODUCT_TYPE_OPTIONS.map(opt => {
              const active = form.productType === opt;
              const isS    = opt === 'Scrap';
              const col    = isS ? C.rose : C.indigo;
              const Icon   = isS ? RefreshCw : Package;
              return (
                <button key={opt} onClick={() => pickType(opt)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', fontSize: 12, fontWeight: 800,
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  transition: 'all .2s cubic-bezier(.16,1,.3,1)',
                  background: active ? '#fff' : 'transparent',
                  color: active ? col : '#94A3B8',
                  boxShadow: active ? `0 1px 6px rgba(0,0,0,0.1)` : 'none',
                  transform: active ? 'translateY(-0.5px)' : 'none',
                }}>
                  <Icon size={13} color={active ? col : '#CBD5E1'} />
                  {opt}
                </button>
              );
            })}
          </div>
          {/* Inline scrap notice — same row, appears only when Scrap active */}
          {isScrap && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8,
              background: C.roseL, border: `1px solid ${C.rose}25`, flexShrink: 0,
            }}>
              <AlertCircle size={12} color={C.rose} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9F1239' }}>
                Buy-side · subject to assay
              </span>
            </div>
          )}
          <FErr msg={errs.productType} />
        </div>

        {/* ── STEP 2: Core fields — 2-col grid with a left accent bar ── */}
        <div style={{
          background: '#fff', borderRadius: 14,
          border: '1px solid #F1F5F9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          overflow: 'hidden', marginBottom: 12,
        }}>
          {/* Section label row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 16px', borderBottom: '1px solid #F8FAFC',
            background: '#FAFBFF',
          }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: accent }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Product Details
            </span>
          </div>

          <div style={{ padding: '14px 16px 4px' }}>
            {/* Product Name — full width */}
            <div style={{ marginBottom: 11 }}>
              <FL req>Product Name</FL>
              <div style={{ position: 'relative' }}>
                <FInput
                  value={form.name} onChange={set('name')} accent={accent}
                  placeholder={isScrap ? 'e.g. Mixed Scrap Gold — Client Batch 4' : 'e.g. PAMP Suisse Lady Fortuna 1kg Bar'}
                />
                <Package size={14} color="#CBD5E1" style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', pointerEvents: 'none',
                }} />
                {/* re-add left padding so icon doesn't overlap text */}
                <style>{`.pname input{padding-left:38px}`}</style>
              </div>
              <FErr msg={errs.name} />
            </div>

            {/* Category + Sub Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 11 }}>
              <div>
                <FL req>Category</FL>
                <FSelect value={form.category} onChange={set('category')} options={cats}
                  placeholder="Select category" disabled={!form.productType} accent={accent} />
                <FErr msg={errs.category} />
              </div>
              <div>
                <FL>Sub Category</FL>
                <FSelect value={form.subCategory} onChange={set('subCategory')} options={subCats}
                  placeholder="Select sub category" disabled={!form.category} accent={accent} />
              </div>
            </div>

            {/* Type + Brand + Purity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div>
                <FL>Type</FL>
                <FSelect value={form.type} onChange={set('type')} options={cats}
                  placeholder="Select type" disabled={!form.productType} accent={accent} />
              </div>
              <div>
                <FL req>Brand / Refinery</FL>
                <FSelect value={form.brand} onChange={set('brand')} options={BRAND_OPTIONS}
                  placeholder="Select brand" accent={accent} />
                <FErr msg={errs.brand} />
              </div>
              <div>
                <FL req>Purity</FL>
                <FSelect value={form.purity} onChange={set('purity')} options={PURITY_OPTIONS}
                  placeholder="Select purity" accent={accent} />
                <FErr msg={errs.purity} />
              </div>
            </div>
          </div>
        </div>

        {/* ── STEP 3: Weight, Quantity + CTA — horizontal card ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto',
          gap: 10, alignItems: 'flex-end',
          background: '#fff', borderRadius: 14,
          border: '1px solid #F1F5F9',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          padding: '13px 16px 15px',
        }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2, paddingBottom: 10, borderBottom: '1px solid #F8FAFC' }}>
            <div style={{ width: 3, height: 16, borderRadius: 99, background: accent }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Weight & Quantity
            </span>
          </div>
          <div>
            <FL req>Weight (grams)</FL>
            <FInput type="number" placeholder="e.g. 1000" value={form.weightGrams} onChange={set('weightGrams')} accent={accent} />
            <FErr msg={errs.weightGrams} />
          </div>
          <div>
            <FL>Quantity (pieces)</FL>
            <FInput type="number" placeholder="1" value={form.quantity} onChange={set('quantity')} accent={accent} />
          </div>
          {/* Live total weight preview */}
          <div style={{
            background: form.weightGrams && form.quantity ? accent + '0E' : '#F8FAFC',
            borderRadius: 10, padding: '10px 12px', border: `1px solid ${form.weightGrams ? accent + '22' : '#F1F5F9'}`,
            transition: 'all .3s',
          }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Wt.</p>
            <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 900, color: form.weightGrams ? accent : '#CBD5E1' }}>
              {form.weightGrams && form.quantity
                ? `${((+form.weightGrams * +form.quantity) / 1000).toFixed(3)} KG`
                : '— KG'}
            </p>
          </div>
          {/* Save CTA */}
          <button onClick={save} style={{
            height: 44, padding: '0 30px', fontSize: 13, fontWeight: 800,
            border: 'none', borderRadius: 11, cursor: 'pointer', whiteSpace: 'nowrap',
            background: `linear-gradient(135deg, ${accent} 0%, ${isScrap ? '#BE123C' : '#4338CA'} 100%)`,
            color: '#fff', boxShadow: `0 4px 18px ${accent}45`,
            transition: 'all .2s cubic-bezier(.16,1,.3,1)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${accent}50`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 18px ${accent}45`; }}
          >
            Save Product
          </button>
        </div>

        {/* ── Live summary chip (appears once type is picked) ── */}
        {form.productType && (
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
            marginTop: 12, padding: '9px 14px', borderRadius: 12,
            background: accent + '08', border: `1px solid ${accent}18`,
            animation: 'fadeUp .25s ease',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 800, color: accent,
            }}>
              {isScrap ? <RefreshCw size={12}/> : <Package size={12}/>}
              {form.productType}
            </span>
            {[
              form.name     && { label: form.name                       },
              form.category && { label: form.category                   },
              form.brand    && { label: form.brand                      },
              form.purity   && { label: form.purity                     },
              form.weightGrams && { label: `${form.weightGrams}g`       },
            ].filter(Boolean).map((chip, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700, color: '#64748B',
                background: '#fff', border: '1px solid #E8EDF5',
                padding: '3px 9px', borderRadius: 99,
              }}>{chip.label}</span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn  { from { opacity:0; transform:scale(.85) } to { opacity:1; transform:scale(1) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </div>
  );
};

// ─── Page-level states ────────────────────────────────────────────────────────
const Skel = ({ w = '100%', h = 14, r = 8 }) => (
  <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#F1F5F9 25%,#E8EDF3 50%,#F1F5F9 75%)', backgroundSize: '400% 100%', animation: 'shimmer 1.4s ease infinite' }} />
);

const LoadingView = () => (
  <div className="space-y-6">
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B' }}>
      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>Loading product data…</span>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
          <Skel h={10} w="55%" /><div style={{ height: 10 }} />
          <Skel h={26} w="70%" /><div style={{ height: 8 }} />
          <Skel h={10} w="45%" />
        </div>
      ))}
    </div>
    <div style={{ background: '#fff', borderRadius: 20, padding: 24 }}>
      <Skel h={13} w="30%" /><div style={{ height: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[...Array(4)].map((_, i) => <Skel key={i} h={80} r={14} />)}
      </div>
    </div>
    <style>{`
      @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }
      @keyframes spin    { to{transform:rotate(360deg)} }
    `}</style>
  </div>
);

const ErrorView = ({ message, onRetry }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '60px 24px', background: C.roseL, borderRadius: 16 }}>
    <AlertCircle size={34} color={C.rose} />
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.rose }}>{message}</p>
    <button onClick={onRetry} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 20px', fontSize: 12, fontWeight: 800, background: C.rose, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
      <RefreshCw size={13} /> Retry
    </button>
  </div>
);

const EmptyState = ({ label, onAdd }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '44px 24px' }}>
    <Package size={34} color="#CBD5E1" />
    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>{label}</p>
    {onAdd && (
      <button onClick={onAdd} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontSize: 12, fontWeight: 800, background: C.indigo, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
        <Plus size={13} /> Add First Product
      </button>
    )}
  </div>
);

// ─── Main page component ──────────────────────────────────────────────────────
const ProductData = () => {
  const { data, loading, error, refetch } = useProductData();

  if (loading) return <LoadingView />;
  if (error)   return <ErrorView message={error} onRetry={refetch} />;

  const {
    metrics, hourly, productTypes, origins, coins,
    monthlyTrend, avgDeal, products, performance, buySell,
  } = data;

  const richTypes  = (productTypes ?? []).map(pt => ({ ...pt, ...typeMeta(pt.type) }));
  const handleSave = (formData) => console.info('[ProductData] saved:', formData);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* 1 ── Metric strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total KG Sold (Month)" value={metrics?.totalKgMonth?.value} trend={metrics?.totalKgMonth?.trend} icon={Package}  sub={metrics?.totalKgMonth?.sub} />
        <MetricCard label="Today's Volume"         value={metrics?.todayVolume?.value}  trend={metrics?.todayVolume?.trend}  icon={BarChart3} sub={metrics?.todayVolume?.sub}  />
        <MetricCard label="Best Seller"            value={metrics?.bestSeller?.value}                                         icon={Star}      sub={metrics?.bestSeller?.sub}   />
        <MetricCard label="SKUs Tracked"           value={metrics?.skusTracked?.value}                                        icon={Hash}      sub={metrics?.skusTracked?.sub}  />
      </div>

      {/* 2 ── Product Type entry panel */}
      <ProductTypePanel onSave={handleSave} />

      {/* 3 ── Volume · Currency · Origin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Daily Volume */}
        <Card>
          <CardHeader title="Daily Volume" sub="KG sold by hour — today" />
          <div style={{ padding: '8px 24px 0', height: 160 }}>
            <ResponsiveContainer>
              <BarChart data={hourly ?? []}>
                <XAxis dataKey="h" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tip unit=" KG" />} />
                <Bar dataKey="kg" fill={C.indigo} radius={[6, 6, 0, 0]} name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 8, padding: '12px 24px 16px' }}>
            {[
              { label: 'SELL-SIDE', kg: '6.6 KG', deals: buySell?.sell?.deals, color: C.emerald, bg: '#F0FDF4', text: '#065F46', Icon: ArrowUpRight  },
              { label: 'BUY-SIDE',  kg: '2.8 KG', deals: buySell?.buy?.deals,  color: C.sky,    bg: '#F0F9FF', text: '#0C4A6E', Icon: ArrowDownLeft },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, background: s.bg, borderRadius: 10, padding: '9px 10px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 3 }}>
                  <s.Icon size={11} color={s.color} />
                  <span style={{ fontSize: 9, fontWeight: 900, color: s.color }}>{s.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: s.text }}>{s.kg}</p>
                <p style={{ margin: 0, fontSize: 9, color: s.color, fontWeight: 600 }}>{s.deals ?? '—'} deals</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Currency & Transaction */}
        <Card>
          <CardHeader title="Currency & Transaction" sub="AED · USD · deal value" />
          <div style={{ padding: '8px 24px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'AED Transactions', val: `${buySell?.aedPct ?? 68}%`, sub: `${buySell?.aedDeals ?? 194} deals`, color: C.indigo, bg: C.indigoL },
                { label: 'USD Transactions', val: `${buySell?.usdPct ?? 32}%`, sub: `${buySell?.usdDeals ?? 90} deals`,  color: C.sky,    bg: C.skyL    },
              ].map(c => (
                <div key={c.label} style={{ background: c.bg, borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: c.color }}>{c.val}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 9, fontWeight: 800, color: c.color }}>{c.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{c.sub}</p>
                </div>
              ))}
            </div>
            <SectionDivider label="Buy vs Sell Side" />
            {[
              { side: 'Sell-Side', vol: buySell?.sell?.kg ?? '198 KG', pct: buySell?.sell?.pct ?? 70, color: C.emerald },
              { side: 'Buy-Side',  vol: buySell?.buy?.kg  ?? '86 KG',  pct: buySell?.buy?.pct  ?? 30, color: C.sky     },
            ].map(s => (
              <div key={s.side} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#64748B', marginBottom: 5 }}>
                  <span>{s.side}</span><span style={{ fontWeight: 900 }}>{s.vol}</span>
                </div>
                <Bar2 pct={s.pct} color={s.color} />
              </div>
            ))}
            <SectionDivider label="Avg Deal Value" />
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'AED AVG / DEAL', val: buySell?.avgDealAed ?? 'AED 71,400', color: C.amber,  bg: C.amberL,  text: '#92400E' },
                { label: 'USD AVG / DEAL', val: buySell?.avgDealUsd ?? '$19,440',    color: C.sky,    bg: C.skyL,    text: '#0C4A6E' },
              ].map(d => (
                <div key={d.label} style={{ flex: 1, background: d.bg, borderRadius: 10, padding: '8px 10px' }}>
                  <p style={{ margin: 0, fontSize: 9, fontWeight: 800, color: d.color }}>{d.label}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 900, color: d.text }}>{d.val}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Product Origin */}
        <Card>
          <CardHeader title="Product Origin" sub="Brand & refinery breakdown" />
          <div style={{ padding: '8px 24px 16px' }}>
            {(origins ?? []).map((b, i) => {
              const col = [C.amber, C.indigo, C.sky, C.emerald, C.slate][i % 5];
              return (
                <div key={b.brand} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#64748B', marginBottom: 5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Dot color={col} />{b.brand}</span>
                    <span style={{ fontWeight: 900 }}>{b.kg}</span>
                  </div>
                  <Bar2 pct={b.pct * 2} color={col} />
                </div>
              );
            })}
            <SectionDivider label="Coin Breakdown · Mint · Origin" />
            {(coins ?? []).map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#1E293B' }}>{c.name}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{c.mint} · {c.origin}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Pill color={C.sky} bg={C.skyL} sm>{c.type}</Pill>
                  <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 900, color: '#475569' }}>{c.kg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 4 ── Monthly Trend + Avg Deal Value */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Monthly Volume Trend" sub="KG sold per product type — last 6 months" />
          <div style={{ padding: '12px 24px 20px', height: 210 }}>
            <ResponsiveContainer>
              <LineChart data={monthlyTrend ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9,  fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip unit=" KG" />} />
                <Line type="monotone" dataKey="bars"   name="Bars"   stroke={C.indigo}  strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="coins"  name="Coins"  stroke={C.sky}     strokeWidth={2}   dot={false} strokeDasharray="5 3" />
                <Line type="monotone" dataKey="rounds" name="Rounds" stroke={C.emerald} strokeWidth={2}   dot={false} strokeDasharray="2 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 14, padding: '0 24px 16px' }}>
            {[{ l: 'Bars', c: C.indigo }, { l: 'Coins', c: C.sky }, { l: 'Rounds', c: C.emerald }].map(x => (
              <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                <Dot color={x.c} />{x.l}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Avg Deal Value per SKU" sub="AED & USD — value per transaction" />
          <div style={{ padding: '12px 24px 20px', height: 210 }}>
            <ResponsiveContainer>
              <BarChart data={avgDeal ?? []} layout="vertical" margin={{ left: 8, right: 16 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }} width={86} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
                      <p style={{ margin: 0, fontWeight: 800, color: '#475569' }}>{label}</p>
                      <p style={{ margin: '2px 0 0', color: C.indigo, fontWeight: 800 }}>AED {payload[0]?.value?.toLocaleString()}</p>
                      <p style={{ margin: '2px 0 0', color: C.sky,    fontWeight: 800 }}>USD {payload[1]?.value?.toLocaleString()}</p>
                    </div>
                  );
                }} />
                <Bar dataKey="aed" name="AED" fill={C.indigo} radius={[0, 4, 4, 0]} barSize={8} />
                <Bar dataKey="usd" name="USD" fill={C.sky}    radius={[0, 4, 4, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 14, padding: '0 24px 16px' }}>
            {[{ l: 'AED', c: C.indigo }, { l: 'USD', c: C.sky }].map(x => (
              <span key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#64748B' }}>
                <Dot color={x.c} />{x.l}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* 5 ── Performance Overview */}
      <Card>
        <CardHeader title="Performance Overview" sub="Revenue contribution % · Best-sellers · SKU ranking" />
        <div style={{ padding: '0 24px 20px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <SLabel>SKU Performance Ranking</SLabel>
              {(performance ?? []).map(p => {
                const tc = typeMeta(p.category);
                return (
                  <div key={p.sku} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <span style={{ fontSize: 16, width: 24, textAlign: 'center', flexShrink: 0 }}>{rankMedal(p.rank)}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#1E293B' }}>{p.name}</span>
                        <Pill color={tc.color} bg={tc.bg} sm>{p.category}</Pill>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1 }}><Bar2 pct={p.revShare * 2.5} color={tc.color} /></div>
                        <span style={{ fontSize: 10, fontWeight: 900, color: tc.color, width: 32 }}>{p.revShare}%</span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>{p.sku} · {p.units} KG / month</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <SLabel>Revenue Contribution by Category</SLabel>
              <div style={{ height: 190 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={richTypes.map(pt => ({ name: pt.type, value: pt.pct }))}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={78}
                      paddingAngle={2} dataKey="value" stroke="none">
                      {richTypes.map((pt, i) => <Cell key={i} fill={pt.color} />)}
                    </Pie>
                    <Tooltip content={<Tip unit="% revenue" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {richTypes.map(pt => (
                  <div key={pt.type} style={{ display: 'flex', alignItems: 'center', gap: 6, background: pt.bg, borderRadius: 8, padding: '5px 10px' }}>
                    <Dot color={pt.color} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: pt.color }}>{pt.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#64748B' }}>{pt.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 6 ── Product Catalogue */}
      <Card>
        <CardHeader
          title="Product Catalogue"
          sub="Name · Category · Sub Cat · Brand · Purity · Scrap flag"
          action={<IconBtn icon={Plus} label="Add Product" variant="primary" onClick={() => {}} />}
        />
        {(products ?? []).length === 0
          ? <EmptyState label="No products yet." />
          : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    {['#', 'Product', 'Product Type', 'Category', 'Sub Cat.', 'Brand', 'Purity', 'Scrap?', 'Wt. Today', 'Wt. Month', 'Revenue', 'Currency', 'Side', 'Rev. Share'].map(h => (
                      <th key={h} style={{ padding: '13px 12px', textAlign: 'left', fontSize: 9, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.14em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(products ?? []).map((p, i) => {
                    const pt = typeMeta(p.productType === 'Scrap' ? 'Scrap' : p.category);
                    return (
                      <tr key={p.id ?? i}
                        style={{ borderBottom: '1px solid #FAFAFA', transition: 'background .14s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 900, color: '#CBD5E1' }}>{String(i + 1).padStart(2, '0')}</td>
                        <td style={{ padding: '12px 12px', fontSize: 12, fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap' }}>{p.name}</td>
                        <td style={{ padding: '12px 12px' }}><Pill color={pt.color} bg={pt.bg}>{p.productType}</Pill></td>
                        <td style={{ padding: '12px 12px', fontSize: 11, color: '#64748B', fontWeight: 700 }}>{p.category}</td>
                        <td style={{ padding: '12px 12px', fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{p.subCategory}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>{p.brand}</td>
                        <td style={{ padding: '12px 12px' }}><Badge color={karatColor(p.purity)}>{p.purity}</Badge></td>
                        <td style={{ padding: '12px 12px' }}>
                          {p.isScrap
                            ? <Pill color={C.rose}    bg={C.roseL}>Scrap</Pill>
                            : <Pill color={C.emerald} bg={C.emeraldL}>Bullion</Pill>}
                        </td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 800, color: '#334155' }}>{p.today}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 800, color: '#334155' }}>{p.month}</td>
                        <td style={{ padding: '12px 12px', fontSize: 11, fontWeight: 900, color: C.indigo }}>{p.rev}</td>
                        <td style={{ padding: '12px 12px', fontSize: 10, fontWeight: 800, color: '#94A3B8' }}>{p.currency}</td>
                        <td style={{ padding: '12px 12px' }}><Badge color={sideColor(p.side)}>{p.side}</Badge></td>
                        <td style={{ padding: '12px 12px', minWidth: 110 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                              <div style={{ width: `${p.revShare * 2.5}%`, height: '100%', background: C.indigo, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#64748B', minWidth: 26 }}>{p.revShare}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
      </Card>

    </div>
  );
};

export default ProductData;