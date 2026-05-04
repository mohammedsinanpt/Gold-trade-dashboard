// ─── src/services/pipelineService.js ─────────────────────────────────────────
// Owns ALL API calls for the Pipeline page.
// When your backend is ready:
//   1. Set BASE_URL to your real API endpoint
//   2. Add auth headers if needed (JWT, API key, etc.)
//   3. Nothing else in the project needs to change
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || '';

// Helper — shared fetch wrapper (add auth headers here later)
const apiFetch = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}` ← add when auth is ready
    },
  });
  if (!res.ok) throw new Error(`API error: ${res.status} on ${path}`);
  return res.json();
};

// ── Pipeline endpoints ────────────────────────────────────────────────────────

// Stage funnel counts (Enquiry → Closed Won)
export const fetchFunnelStages   = () => apiFetch('/api/pipeline/stages');

// Daily enquiry volume (last 7 days)
export const fetchDailyEnquiries = () => apiFetch('/api/pipeline/enquiries/daily');

// Enquiry channel breakdown (walk-in, call, app, online)
export const fetchChannelData    = () => apiFetch('/api/pipeline/enquiries/channels');

// Pipeline KPI metrics
export const fetchPipelineMetrics = () => apiFetch('/api/pipeline/metrics');

// Closed lost reasons
export const fetchLostReasons    = () => apiFetch('/api/pipeline/lost-reasons');