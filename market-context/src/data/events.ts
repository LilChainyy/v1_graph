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
    "tags": ["Tech", "Manufacturing"]
  },
  {
    "id": "evt_treasury_30yr_sep25_2025",
    "title": "30-yr Treasury bond auction.",
    "dateISO": "2025-09-25",
    "type": "Treasury Auction",
    "maturity": "30Y",
    "tags": ["Bonds", "Tech", "Tech"]
  },
  {
    "id": "evt_tariff_oct15_2025",
    "title": "Tariff hike may worsen trade tensions.",
    "dateISO": "2025-10-15",
    "type": "Tariff",
    "tags": ["Tech", "Manufacturing"]
  },
  {
    "id": "evt_supreme_court_hearing_nov2025",
    "title": "Supreme Court reviews Trump's tariffs.",
    "dateISO": "2025-11-05",
    "type": "Tariff",
    "tags": ["Tech"]
  },
  {
    "id": "evt_quad_witching_dec19_2025",
    "title": "Quad-witching & Treasury auction coincide.",
    "dateISO": "2025-12-19",
    "type": "Treasury Auction",
    "tags": ["Bonds", "Tech", "Tech"]
  }
];
