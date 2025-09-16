# Event Fetcher System

This system automatically fetches and updates company calendar events from multiple sources.

## Files

- `fetch_events.py` - Main Python script for fetching events
- `test_fetch.py` - Test script to verify the system works
- `requirements.txt` - Python dependencies
- `.github/workflows/fetch-events.yml` - GitHub Actions workflow for daily updates

## Data Sources

### Company Events (NVDA)
- **NVIDIA IR Page**: Earnings, conferences, product announcements
- **RSS Feeds**: Press releases and event announcements

### Macro Events
- **FOMC**: Federal Reserve meeting dates and press conferences
- **Treasury Auctions**: 10Y, 30Y, 2Y auction schedules
- **USTR Actions**: Tariff decisions and trade policy updates

## Usage

### Manual Run
```bash
# Install dependencies
pip install -r requirements.txt

# Fetch events for NVDA from today to end of year
python3 scripts/fetch_events.py --ticker NVDA --start 2025-09-14 --end 2025-12-31

# Test the system
python3 scripts/test_fetch.py
```

### Automatic Updates
The GitHub Actions workflow runs daily at 9am ET to:
1. Fetch new events from all sources
2. Merge with existing events (deduplicate by ID)
3. Commit changes to the repository
4. Push updates automatically

## Event Data Structure

Events are stored in `src/data/company/nvda_events.json` with this structure:

```json
{
  "id": "nvda_earnings_2025_11_19",
  "ticker": "NVDA",
  "title": "NVDA Q3 FY2026 earnings (after close)",
  "date": "2025-11-19",
  "time": "16:20 ET",
  "eventType": "Earnings",
  "isBinary": true,
  "isRecurring": "fixed",
  "tags": ["Tech", "Semis"],
  "direct": true,
  "links": ["https://ir.nvidia.com/"],
  "notes": "Call 5:00pm ET; watch guidance & DC demand",
  "history": {
    "window": "24h",
    "medianPct": 4.5,
    "sampleSize": 12
  }
}
```

## Event Types

- **Earnings**: Quarterly earnings reports
- **Product**: Product launches and announcements
- **Conference**: Investor conferences and presentations
- **FOMC**: Federal Reserve meetings
- **Treasury Auction**: Government bond auctions
- **Tariff**: Trade policy decisions
- **Legal/Reg**: Regulatory and legal events
- **SupplyChain**: Supply chain disruptions
- **MacroPrint**: Economic data releases

## Tags

Events are tagged with relevant impact categories:
- **Tech, AI, Semis**: Technology sector
- **Bonds, Rates, USD**: Interest rate sensitivity
- **Broad Market**: General market impact
- **Materials, Financials, Housing**: Sector-specific

## Direct vs Indirect Events

- **Direct** (`direct: true`): Company-specific events (earnings, product launches)
- **Indirect** (`direct: false`): Macro events that affect the company (FOMC, tariffs)

## Safety & Compliance

- Respects robots.txt and rate limits
- Uses official sources when possible
- Stores only essential metadata
- Frames equity effects as historical tendencies, not predictions
- Includes proper attribution and source links

## Calendar Integration

Events automatically appear in the company calendar at `/calendar/NVDA` with:
- **Purple pills** for direct events
- **Grey-outlined pills** for indirect events
- **Clickable modals** with detailed information
- **Filtering** by date range, event type, and tags
