






export type StatMetadata = {
  statWindow: string; // e.g., "next 24h"
  statType: string; // e.g., "median"
  sampleSize: number; // N value
  hitRate: number; // percentage
  lookbackSpan: string; // e.g., "2015–present"
};

export type ActionInsight = {
  bullishScenario: string;
  bearishScenario: string;
  whatToWatch: string; // primary metrics + 2-3 ETFs/tickers
};

export type ToneInfo = {
  toneLabel: "Risk-on" | "Neutral" | "Risk-off";
  toneWhy: string; // short reason
};

export type BannerData = {
  spxWtdPct: number | null; // S&P 500 WTD percentage
  upcomingEvents: Array<{ title: string; date: string }>;
};

export type MarketEvent = {
  id: string;
  title: string;
  dateISO: string;
  type: string;
  maturity?: string;
  tags: string[];
  // FOMC specific fields
  eventType?: "FOMC";
  consensus?: { policyRateTop: number; policyRateBottom: number };
  decision?: { top: number; bottom: number };
  surprise_bps?: number;
  sep?: { gdp: number; unemp: number; pce: number; corePce: number };
  dots?: { yrEnd: { [year: string]: number }; longerRun: number };
  guidanceTone?: "dovish" | "neutral" | "hawkish";
  notes?: string;
  historyRefs?: string[];
  isBinary?: boolean;
  isRecurring?: "fixed" | "episodic" | "one-off";
  hasHistory?: boolean;
  // New fields for enhanced UX
  statMetadata?: StatMetadata;
  actionInsight?: ActionInsight;
  toneInfo?: ToneInfo;
  bannerData?: BannerData;
  // Treasury Auction specific
  stopResult?: number; // stop vs WI for determining tone
  wiResult?: number; // when issued rate
  // Tariff specific
  tariffOutcome?: "hike" | "widen" | "status-quo" | "delay";
};

export type SceneData = {
  marketTrend: 'up' | 'flat' | 'mixed' | 'down';
  sentiment: 'firmer' | 'neutral' | 'cautious';
  rates: 'easing' | 'steady' | 'climbing';
  fear: 'calm' | 'normal' | 'picking up';
  nextEvent: {
    type: 'CPI' | 'Fed meeting' | 'Jobs report' | '10-yr auction' | 'Tariff update';
    weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    why: string;
  };
  sources: string[];
  attribution?: string;
};

// Scene Setter data function - now uses real morning wraps via API
export async function getSceneData(): Promise<SceneData> {
  try {
    const response = await fetch('/api/scene-data', {
      cache: 'no-store' // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch scene data, using defaults:', error);
    return getDefaultSceneData();
  }
}

// Fallback function for static data
function getDefaultSceneData(): SceneData {
  return {
    marketTrend: 'flat',
    sentiment: 'neutral',
    rates: 'steady',
    fear: 'normal',
    nextEvent: {
      type: 'CPI',
      weekday: 'Thu',
      why: 'checks price pressures'
    },
    sources: [],
    attribution: 'auto summary (defaults)'
  };
}

