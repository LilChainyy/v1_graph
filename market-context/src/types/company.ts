export type CompanyTicker = "NVDA" | "TSLA" | "AAPL" | "META" | "AMZN" | "HOOD"; // extend later

// Event Scope Constants
export const DIRECT_EVENT_TYPES = [
  'Earnings',
  'Product', 
  'Conference',
  'Legal/Reg',
  'Partnership'
] as const;

export const INDIRECT_EVENT_TYPES = [
  'FOMC',
  'Treasury Auction', 
  'Tariff',
  'Competitor',
  'MacroPrint'
] as const;

export const ALL_EVENT_TYPES = [...DIRECT_EVENT_TYPES, ...INDIRECT_EVENT_TYPES] as const;

export type EventType = typeof ALL_EVENT_TYPES[number];

export const DIRECT_IMPACT_TAGS = [
  'Tech',
  'AI', 
  'Semis',
  'Gaming',
  'DataCenter',
  'Automotive',
  'Robotics',
  'Healthcare',
  'Finance'
] as const;

export const INDIRECT_IMPACT_TAGS = [
  'Bonds',
  'Rates', 
  'USD',
  'Broad Market',
  'Materials',
  'Financials',
  'Housing',
  'Energy',
  'Manufacturing'
] as const;

export const ALL_IMPACT_TAGS = [...DIRECT_IMPACT_TAGS, ...INDIRECT_IMPACT_TAGS] as const;

export type ImpactTag = typeof ALL_IMPACT_TAGS[number];

// Event categories
export type EventCategory = 'EARNINGS' | 'SEC_FILINGS' | 'MACRO_FOMC' | 'MACRO_CPI' | 'MACRO_JOBS' | 'MACRO_GDP' | 'REGULATORY';

// Required source types for event classification
export type EventSource = 'POLYGON' | 'FINNHUB' | 'SEC_EDGAR' | 'TRADING_ECONOMICS' | 'ECON_DB' | 'SEC_SCRAPER' | 'FINRA_SCRAPER' | 'MANUAL' | 'SEED';

// Required recurring types
export type RecurringType = 'fixed' | 'episodic' | 'one-off';

// Event Scope Definitions
export const EVENT_SCOPE = {
  DIRECT: {
    EARNINGS: {
      types: ['Earnings'],
      tags: ['Tech', 'AI', 'Semis'],
      description: 'Quarterly earnings reports and guidance updates'
    },
    PRODUCT: {
      types: ['Product'],
      tags: ['Tech', 'AI', 'Semis', 'Gaming', 'DataCenter', 'Automotive', 'Robotics'],
      description: 'Product launches, roadmap updates, GTC, Computex, Rubin/Hopper announcements'
    },
    CONFERENCE: {
      types: ['Conference'],
      tags: ['Tech', 'AI', 'Semis', 'Finance'],
      description: 'Goldman/Citi/JPM conferences, investor presentations, fireside chats'
    },
    LEGAL_REG: {
      types: ['Legal/Reg'],
      tags: ['Tech', 'AI', 'Semis'],
      description: 'Regulatory filings, legal proceedings, compliance updates'
    },
    PARTNERSHIP: {
      types: ['Partnership'],
      tags: ['Tech', 'AI', 'Semis', 'Automotive', 'Healthcare', 'Finance'],
      description: 'Strategic partnerships, customer announcements, joint ventures'
    }
  },
  INDIRECT: {
    FOMC: {
      types: ['FOMC'],
      tags: ['Bonds', 'Rates', 'Broad Market'],
      description: 'Federal Reserve policy decisions and economic projections'
    },
    TREASURY: {
      types: ['Treasury Auction'],
      tags: ['Bonds', 'Rates', 'Broad Market'],
      description: 'U.S. Treasury bond auctions affecting interest rates'
    },
    TARIFF: {
      types: ['Tariff'],
      tags: ['Materials', 'Manufacturing', 'Broad Market'],
      description: 'USTR/BIS export controls, trade policy changes'
    },
    COMPETITOR: {
      types: ['Competitor'],
      tags: ['Tech', 'AI', 'Semis'],
      description: 'AMD/INTC/AVGO product launches and competitive moves'
    },
    MACRO: {
      types: ['MacroPrint'],
      tags: ['Bonds', 'Rates', 'USD', 'Broad Market', 'Materials', 'Financials', 'Housing'],
      description: 'CPI/PPI/Jobs reports and other macroeconomic indicators'
    }
  }
} as const;

// New simplified event interface for database
export interface DatabaseEvent {
  id: string;
  tickerId?: string;         // Nullable for global events
  title: string;
  start: string;             // YYYY-MM-DD format
  end?: string;              // YYYY-MM-DD format (optional)
  category: EventCategory;
  timezone: string;          // Default "UTC"
  source: EventSource;
  createdAt: string;         // ISO 8601 timestamp
  updatedAt: string;         // ISO 8601 timestamp
  
  // Optional fields
  links?: string[];          // source URLs
  notes?: string;            // short description
  externalId?: string;       // External API ID for deduplication
}

// Legacy interface for backward compatibility
export interface CompanyEvent {
  // Required fields - all events must have these
  id: string;                // "nvda_2025q3_earnings"
  ticker: CompanyTicker;     // "NVDA"
  title: string;             // "NVDA Q3 FY2026 earnings (after close)"
  date: string;              // "2025-11-19" (YYYY-MM-DD format)
  eventType: EventType;      // Required event type
  direct: boolean;           // Required: true = direct company event, false = indirect market event
  isBinary: boolean;         // Required: true = has discrete outcome (earnings, court ruling)
  isRecurring: RecurringType; // Required: fixed|episodic|one-off
  tags: ImpactTag[];         // Required: array of impact tags
  source: EventSource;       // Required: IR|FOMC|Treasury|USTR|BIS|Manual|Seed|Competitor
  createdAt: string;         // Required: ISO 8601 timestamp
  
  // Optional fields
  time?: string;             // "16:20 ET" optional
  links?: string[];          // source URLs (IR page, SEC, conference)
  notes?: string;            // short description
  history?: {
    window: "intraday" | "24h" | "week";
    medianPct?: number;      // historical tendency
    medianDollar?: number;   // computed from last price snapshot (optional)
    sampleSize?: number;     // N events
  };
}

export interface CompanyFilters {
  dateRange: {
    start: string;
    end: string;
  };
  eventTypes: EventType[];
  directOnly: boolean;
  tags: ImpactTag[];
}
