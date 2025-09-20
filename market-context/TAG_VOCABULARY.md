# Tag Vocabulary

## Primary Event Categories

### MACRO Events
- `MACRO_FOMC` - Federal Reserve meetings and decisions
- `MACRO_CPI` - Consumer Price Index releases
- `MACRO_JOBS` - Nonfarm Payrolls and employment data
- `MACRO_GDP` - Gross Domestic Product releases
- `MACRO_PPI` - Producer Price Index releases
- `MACRO_RETAIL` - Retail sales data
- `MACRO_HOUSING` - Housing market data

### EARNINGS Events
- `EARNINGS_Q1` - Q1 earnings calls
- `EARNINGS_Q2` - Q2 earnings calls
- `EARNINGS_Q3` - Q3 earnings calls
- `EARNINGS_Q4` - Q4 earnings calls
- `EARNINGS_ANNUAL` - Annual earnings calls

### SEC FILINGS Events
- `SEC_10K` - Annual 10-K filings
- `SEC_10Q` - Quarterly 10-Q filings
- `SEC_8K` - Current 8-K filings
- `SEC_PROXY` - Proxy statements
- `SEC_13F` - 13F filings

### REGULATORY Events
- `REGULATORY_FINRA` - FINRA compliance and rule changes
- `REGULATORY_SEC` - SEC regulatory deadlines
- `REGULATORY_CFTC` - CFTC regulatory events
- `REGULATORY_FDA` - FDA regulatory events

### PRODUCT Events
- `PRODUCT_LAUNCH` - Product launches and announcements
- `PRODUCT_CONFERENCE` - Industry conferences and events
- `PRODUCT_PARTNERSHIP` - Partnership announcements

## Company-Specific Tags

### Sector Tags
- `TECH` - Technology sector
- `AI` - Artificial Intelligence related
- `SEMIS` - Semiconductors
- `AUTOMOTIVE` - Automotive industry
- `FINANCE` - Financial services
- `HEALTHCARE` - Healthcare sector
- `ENERGY` - Energy sector
- `RETAIL` - Retail sector

### Company Tags
- `NVDA` - NVIDIA specific
- `AAPL` - Apple specific
- `TSLA` - Tesla specific
- `HOOD` - Robinhood specific
- `META` - Meta specific
- `AMZN` - Amazon specific

## Impact Tags
- `HIGH_IMPACT` - High market impact events
- `MEDIUM_IMPACT` - Medium market impact events
- `LOW_IMPACT` - Low market impact events
- `BINARY` - Binary outcome events (earnings, FOMC)
- `RECURRING` - Recurring events
- `ONE_TIME` - One-time events

## Time-Based Tags
- `BEFORE_MARKET` - Before market open
- `AFTER_MARKET` - After market close
- `DURING_MARKET` - During market hours
- `WEEKEND` - Weekend events

## Usage Guidelines

1. **Primary Category**: Always include the main event category (MACRO_FOMC, EARNINGS_Q3, etc.)
2. **Sector Tags**: Add relevant sector tags (TECH, AI, SEMIS, etc.)
3. **Company Tags**: Add company-specific tags for ticker events
4. **Impact Level**: Add impact level for market significance
5. **Time Context**: Add time-based tags when relevant

## Examples

### FOMC Meeting
```
Primary: MACRO_FOMC
Sector: TECH, FINANCE, BROAD_MARKET
Impact: HIGH_IMPACT, BINARY
Time: DURING_MARKET
```

### NVDA Earnings
```
Primary: EARNINGS_Q3
Company: NVDA
Sector: TECH, AI, SEMIS
Impact: HIGH_IMPACT, BINARY
Time: AFTER_MARKET
```

### AAPL 10-Q Filing
```
Primary: SEC_10Q
Company: AAPL
Sector: TECH
Impact: MEDIUM_IMPACT
Time: DURING_MARKET
```
