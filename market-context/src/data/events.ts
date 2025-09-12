import { MarketEvent } from '@/lib/events';

export const events: MarketEvent[] = [
  {
    "id": "evt_treasury_10yr_sep11_2025",
    "title": "10-yr Treasury auction today.",
    "dateISO": "2025-09-11",
    "type": "Treasury Auction",
    "maturity": "10Y",
    "tags": ["Bonds", "Tech"]
  },
  {
    "id": "evt_tariff_sep14_2025",
    "title": "White House to decide on China tariffs.",
    "dateISO": "2025-09-14",
    "type": "Tariff",
    "tags": ["Tech", "Energy"]
  },
  {
    "id": "evt_treasury_30yr_sep25_2025",
    "title": "30-yr Treasury bond auction.",
    "dateISO": "2025-09-25",
    "type": "Treasury Auction",
    "maturity": "30Y",
    "tags": ["Bonds", "Tech"]
  },
  {
    "id": "evt_tariff_oct15_2025",
    "title": "Tariff hike may worsen trade tensions.",
    "dateISO": "2025-10-15",
    "type": "Tariff",
    "tags": ["Tech"]
  },
  {
    "id": "evt_supreme_court_hearing_nov2025",
    "title": "Supreme Court reviews Trump's tariffs.",
    "dateISO": "2025-11-05",
    "type": "Tariff",
    "tags": ["Tech", "Energy"]
  },
  {
    "id": "evt_quad_witching_dec19_2025",
    "title": "Quad-witching & Treasury auction coincide.",
    "dateISO": "2025-12-19",
    "type": "Treasury Auction",
    "tags": ["Bonds", "Tech"]
  },
  {
    "id": "evt_fomc_sep17_2025",
    "title": "FOMC decision + Powell press conference",
    "dateISO": "2025-09-17",
    "type": "FOMC",
    "tags": ["Bonds", "Rates", "USD", "Tech", "Financials", "Housing", "Broad Market"],
    "eventType": "FOMC",
    "consensus": { "policyRateTop": 5.25, "policyRateBottom": 5.00 },
    "decision": { "top": 5.25, "bottom": 5.00 },
    "surprise_bps": -5,
    "guidanceTone": "dovish",
    "notes": "Statement softened inflation language; Powell emphasized data dependence.",
    "historyRefs": [
      "FOMC Statement PDF",
      "Press Conference Transcript"
    ],
    "isBinary": true,
    "isRecurring": "fixed",
    "hasHistory": true
  }
];
