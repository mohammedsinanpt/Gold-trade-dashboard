// ─── src/data/pipelineMockData.js ────────────────────────────────────────────
// Pipeline-page-specific mock data.
// These arrays will be replaced by real API responses when backend is ready.
// Shape of each array must match what the API will return — do not change
// field names without also updating usePipelineData.js and Pipeline.jsx.
// ─────────────────────────────────────────────────────────────────────────────

import {
  MapPin, Phone, Smartphone, Globe, TrendingUp, TrendingDown,
  Clock, Handshake, BarChart2, DollarSign, Target, Zap,
} from 'lucide-react';

// NOTE: icon field will NOT come from the API — icons are UI-layer only.
// When you switch to real API, the hook will map icon onto the data
// based on the channel/metric name. The API just returns strings.

export const CHANNEL_DATA_MOCK = [
  { ch: 'Walk-in',      count: 28, value: '$4.2M', pct: 33, icon: MapPin,     color: '#6366F1' },
  { ch: 'Phone / Call', count: 22, value: '$3.1M', pct: 26, icon: Phone,      color: '#8B5CF6' },
  { ch: 'App',          count: 18, value: '$2.8M', pct: 21, icon: Smartphone, color: '#EC4899' },
  { ch: 'Online',       count: 16, value: '$2.3M', pct: 20, icon: Globe,      color: '#F59E0B' },
];

export const DAILY_ENQ_MOCK = [
  { day: 'Mon', count: 10, value: 1.2 },
  { day: 'Tue', count: 14, value: 1.7 },
  { day: 'Wed', count: 9,  value: 1.1 },
  { day: 'Thu', count: 16, value: 2.0 },
  { day: 'Fri', count: 18, value: 2.2 },
  { day: 'Sat', count: 11, value: 1.4 },
  { day: 'Sun', count: 6,  value: 0.9 },
];

export const METRICS_MOCK = [
  { label: 'Total Pipeline Value',      val: '$34.4M',          icon: DollarSign,   highlight: true,  trend: '+12%',  down: false },
  { label: 'Average Deal Size',         val: '$125k',            icon: BarChart2,    highlight: false, trend: '+4%',   down: false },
  { label: 'Overall Win Rate',          val: '10.7%',            icon: Target,       highlight: false, trend: '-1.2%', down: true  },
  { label: 'Avg Deal Cycle Time',       val: '14 days',          icon: Clock,        highlight: false, trend: '-2d',   down: false },
  { label: 'Pipeline Coverage Ratio',   val: '3.2× target',      icon: TrendingUp,   highlight: true,  trend: '+0.3×', down: false },
  { label: 'Deals Closing This Week',   val: '9 deals · $2.1M',  icon: Zap,          highlight: true,  trend: '',      down: false },
  { label: 'Avg Days at Negotiation',   val: '4.2 days',         icon: Handshake,    highlight: false, trend: '',      down: false },
  { label: 'Funnel Drop-off (E → Won)', val: '89.3%',            icon: TrendingDown, highlight: false, trend: '',      down: true  },
];

export const LOST_REASONS_MOCK = [
  { reason: 'Price',        count: 34, pct: 38, color: '#F43F5E' },
  { reason: 'Competitor',   count: 22, pct: 24, color: '#FB923C' },
  { reason: 'Timing',       count: 16, pct: 18, color: '#F59E0B' },
  { reason: 'No Follow-up', count: 12, pct: 13, color: '#A78BFA' },
  { reason: 'Quality',      count: 6,  pct: 7,  color: '#60A5FA' },
];