# Market Event Context

An educational tool that provides historical context for upcoming market events with scenario analysis and interactive charts.

## Features

- **Event Feed**: Browse upcoming market events with key details and scenarios
- **Event Details**: Deep dive into specific events with historical context and scenario analysis
- **Interactive Charts**: Visualize price movements around similar past events
- **Historical Context**: Understand how markets reacted to similar events in the past
- **Tag System**: Filter and categorize events with dynamic tags
- **Social Features**: Vote, comment, and interact with events (via Supabase)

## Architecture

- **Events Database**: SQLite (Prisma) for event data
- **Social Database**: PostgreSQL (Supabase) for tags, votes, comments
- **Cross-DB Linking**: Uses `event_id` as common key
- **Real-time Updates**: Supabase Realtime for social features

> **Note**: See `TECHNICAL_DEBT.md` for database architecture considerations

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd market-context
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Event feed (homepage)
│   ├── event/[id]/        # Event detail pages
│   ├── chart/[ticker]/    # Chart pages
│   ├── about/             # About & Disclosures page
│   └── layout.tsx         # Root layout with header/footer
├── components/            # React components
│   ├── EventCard.tsx      # Event card component
│   ├── ScenarioPill.tsx   # Scenario display component
│   └── ChartClient.tsx    # Chart.js wrapper component
├── lib/                   # Utility functions
│   ├── events.ts          # Event data loading and types
│   └── compute.ts         # Chart data generation
└── public/
    └── events.json        # Event data source
```

## Adding New Events

To add a new market event:

1. Edit `public/events.json`
2. Add a new event object following this schema:

```json
{
  "id": "evt_unique_id",
  "title": "Event Title",
  "date": "2025-MM-DD",
  "category": "policy|monetary|earnings|economic",
  "status": "scheduled|completed|cancelled",
  "summary": "Brief description of the event",
  "scenarios": [
    {
      "label": "Scenario name",
      "stance": "positive|negative|neutral",
      "why": "Explanation of why this scenario matters",
      "proxies": ["TICKER1", "TICKER2"],
      "example_tickers": ["AAPL", "MSFT"],
      "historical": {
        "reference_event_id": "evt_reference_id",
        "window_days": 5,
        "proxy_move_pct": 4.8
      }
    }
  ],
  "chart_dots": [
    {
      "ticker": "TICKER",
      "date": "2025-MM-DD",
      "type": "policy|monetary|earnings|economic"
    }
  ],
  "precedent_level": "low|medium|high",
  "disclosure": "Educational context. Not investment advice."
}
```

3. The event will automatically appear in the feed and be accessible via `/event/evt_unique_id`

## Chart Links

Charts are accessible via `/chart/[ticker]?dot=YYYY-MM-DD` where:
- `ticker` is the stock/ETF symbol (e.g., SOXX, NVDA, SPY)
- `dot` parameter highlights a specific event date on the chart

Example: `/chart/SOXX?dot=2025-09-14` shows the SOXX chart with a purple dot on September 14, 2025.

## Data Sources

Currently uses mock data for demonstration. In a production environment, this would connect to:
- Financial data APIs (yfinance, Alpha Vantage, etc.)
- Historical market data providers
- Real-time event feeds

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Chart.js** - Interactive charts
- **Server Components** - Server-side rendering

## Important Disclosures

⚠️ **This tool is for educational purposes only and does not constitute investment advice.**

- Past performance does not guarantee future results
- Market events are inherently unpredictable
- Always consult with qualified financial advisors before making investment decisions
- This is not a commercial financial service

## License

This project is for educational purposes only.

## Contributing

This is an educational project. For questions or issues, please contact the maintainers through appropriate channels.