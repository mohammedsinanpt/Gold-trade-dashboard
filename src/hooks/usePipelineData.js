// ─── src/hooks/usePipelineData.js ────────────────────────────────────────────
// Owns all data fetching and state for the Pipeline page.
// Pipeline.jsx calls this hook and just renders — it never fetches directly.
//
// HOW TO SWITCH FROM MOCK → REAL API:
//   Change USE_MOCK from true to false. That's it.
//   Everything else is automatic.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// Mock data imports — remove these imports once USE_MOCK = false and working
import {
  pipelineData,
} from '../data/mockData';

// Pipeline-specific mock data (move to mockData.js exports when ready)
import {
  CHANNEL_DATA_MOCK,
  DAILY_ENQ_MOCK,
  METRICS_MOCK,
  LOST_REASONS_MOCK,
} from '../data/pipelineMockData';

// API service functions
import {
  fetchFunnelStages,
  fetchDailyEnquiries,
  fetchChannelData,
  fetchPipelineMetrics,
  fetchLostReasons,
} from '../services/pipelineService';

// ── Toggle this flag ──────────────────────────────────────────────────────────
const USE_MOCK = true; // true = mock data | false = real API
// ─────────────────────────────────────────────────────────────────────────────

const usePipelineData = () => {
  const [state, setState] = useState({
    funnelStages:    null,
    dailyEnquiries:  null,
    channelData:     null,
    metrics:         null,
    lostReasons:     null,
    loading:         true,
    error:           null,
  });

  useEffect(() => {
    const load = async () => {
      try {
        if (USE_MOCK) {
          // ── Mock path: instant, no network call ──────────────────────────
          setState({
            funnelStages:   pipelineData,
            dailyEnquiries: DAILY_ENQ_MOCK,
            channelData:    CHANNEL_DATA_MOCK,
            metrics:        METRICS_MOCK,
            lostReasons:    LOST_REASONS_MOCK,
            loading:        false,
            error:          null,
          });
        } else {
          // ── Real API path: parallel fetch all endpoints ───────────────────
          const [funnelStages, dailyEnquiries, channelData, metrics, lostReasons] =
            await Promise.all([
              fetchFunnelStages(),
              fetchDailyEnquiries(),
              fetchChannelData(),
              fetchPipelineMetrics(),
              fetchLostReasons(),
            ]);

          setState({
            funnelStages,
            dailyEnquiries,
            channelData,
            metrics,
            lostReasons,
            loading: false,
            error:   null,
          });
        }
      } catch (err) {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    };

    load();
  }, []);

  return state;
};

export default usePipelineData;