




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
};

