# Event Scope Definition

## Overview
This document defines the comprehensive event scope for company calendars, categorizing events into Direct (company-specific) and Indirect (market-wide) categories.

## Event Categories

### Direct Events (Company-Specific)
Events that directly concern the company and its operations:

#### 1. Earnings
- **Types:** `Earnings`
- **Tags:** `Tech`, `AI`, `Semis`
- **Description:** Quarterly earnings reports and guidance updates
- **Examples:** Q3 FY2026 earnings call, guidance updates

#### 2. Product
- **Types:** `Product`
- **Tags:** `Tech`, `AI`, `Semis`, `Gaming`, `DataCenter`, `Automotive`, `Robotics`
- **Description:** Product launches, roadmap updates, GTC, Computex, Rubin/Hopper announcements
- **Examples:** GTC Spring 2025, Rubin CPX launch, new GPU announcements

#### 3. Conference
- **Types:** `Conference`
- **Tags:** `Tech`, `AI`, `Semis`, `Finance`
- **Description:** Goldman/Citi/JPM conferences, investor presentations, fireside chats
- **Examples:** Goldman Communacopia, Citi Technology Conference

#### 4. Legal/Reg
- **Types:** `Legal/Reg`
- **Tags:** `Tech`, `AI`, `Semis`
- **Description:** Regulatory filings, legal proceedings, compliance updates
- **Examples:** SEC 10-Q filings, regulatory compliance updates

#### 5. Partnership
- **Types:** `Partnership`
- **Tags:** `Tech`, `AI`, `Semis`, `Automotive`, `Healthcare`, `Finance`
- **Description:** Strategic partnerships, customer announcements, joint ventures
- **Examples:** Major automotive partnerships, healthcare AI collaborations

### Indirect Events (Market-Wide)
Events that affect the company through broader market conditions:

#### 1. FOMC
- **Types:** `FOMC`
- **Tags:** `Bonds`, `Rates`, `Broad Market`
- **Description:** Federal Reserve policy decisions and economic projections
- **Examples:** September 2025 FOMC decision, rate cut announcements

#### 2. Treasury Auction
- **Types:** `Treasury Auction`
- **Tags:** `Bonds`, `Rates`, `Broad Market`
- **Description:** U.S. Treasury bond auctions affecting interest rates
- **Examples:** 10-year note auctions, 30-year bond auctions

#### 3. Tariff
- **Types:** `Tariff`
- **Tags:** `Materials`, `Manufacturing`, `Broad Market`
- **Description:** USTR/BIS export controls, trade policy changes
- **Examples:** Semiconductor export controls, trade policy updates

#### 4. Competitor
- **Types:** `Competitor`
- **Tags:** `Tech`, `AI`, `Semis`
- **Description:** AMD/INTC/AVGO product launches and competitive moves
- **Examples:** AMD Instinct launch, Intel GPU announcements

#### 5. MacroPrint
- **Types:** `MacroPrint`
- **Tags:** `Bonds`, `Rates`, `USD`, `Broad Market`, `Materials`, `Financials`, `Housing`
- **Description:** CPI/PPI/Jobs reports and other macroeconomic indicators
- **Examples:** CPI releases, employment reports, GDP data

## Implementation

### Constants
- `DIRECT_EVENT_TYPES`: Array of direct event types
- `INDIRECT_EVENT_TYPES`: Array of indirect event types
- `ALL_EVENT_TYPES`: Combined array of all event types
- `DIRECT_IMPACT_TAGS`: Tags typically used for direct events
- `INDIRECT_IMPACT_TAGS`: Tags typically used for indirect events
- `ALL_IMPACT_TAGS`: Combined array of all impact tags

### Event Scope Object
The `EVENT_SCOPE` constant provides detailed configuration for each event category, including:
- Event types
- Recommended tags
- Human-readable descriptions

### Utility Functions
- `isDirectEventType()`: Check if an event type is direct
- `isIndirectEventType()`: Check if an event type is indirect
- `getEventScope()`: Get the scope (DIRECT/INDIRECT) of an event type
- `getRecommendedTags()`: Get recommended tags for an event type
- `validateEventTags()`: Validate tags against event type
- `getEventDescription()`: Get description for an event type
- `categorizeEventBySource()`: Categorize events by their source

## Usage

```typescript
import { EVENT_SCOPE, isDirectEventType, getRecommendedTags } from '@/types/company';

// Check if an event is direct
const isDirect = isDirectEventType('Earnings'); // true

// Get recommended tags for an event type
const tags = getRecommendedTags('Product'); // ['Tech', 'AI', 'Semis', 'Gaming', 'DataCenter', 'Automotive', 'Robotics']

// Access event scope configuration
const productScope = EVENT_SCOPE.DIRECT.PRODUCT;
```

## Data Sources

### Auto-updatable Sources
- **IR**: Company investor relations pages
- **FOMC**: Federal Reserve calendar
- **Treasury**: U.S. Treasury auction schedule
- **USTR**: USTR trade policy updates
- **BIS**: Bureau of Industry and Security
- **BLS**: Bureau of Labor Statistics
- **SEC**: SEC filings and announcements

### Manual Sources
- **Manual**: User-added events through UI
- **Seed**: Initial seed data for development

## Color Coding

### Direct Events
- Earnings: Blue
- Product: Green
- Conference: Purple
- Legal/Reg: Gray
- Partnership: Indigo

### Indirect Events
- FOMC: Red
- Treasury Auction: Yellow
- Tariff: Orange
- Competitor: Pink
- MacroPrint: Cyan
