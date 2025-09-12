'use client';

import MetricRow from './MetricRow';

type Props = { 
  date?: string;
  cardType: 'china-tariffs' | 'trade-tensions' | 'supreme-court';
  activeTag?: string;
};

interface Metric {
  label: string;
  value: string;
  isPositive: boolean;
  tagType?: 'direct' | 'indirect';
}

interface StockToWatch {
  ticker: string;
  rationale: string;
  isDirect: boolean;
}

interface TariffCard {
  title: string;
  date: string;
  tags: Array<{name: string, style: 'purple' | 'greyOutlined'}>;
  directEffects: Metric[];
  indirectEffects: Metric[];
  stocksToWatch: StockToWatch[];
  meta: {
    binary: boolean;
    recurring: 'fixed' | 'episodic' | 'one-off';
    history: boolean;
    source: string;
  };
}

export default function TariffScenario({ date, cardType, activeTag }: Props) {
  // Filter effects and stocks based on active tag
  const filterByTag = (items: any[], tagType: 'direct' | 'indirect') => {
    if (!activeTag) return items;
    
    // Map tags to categories
    const tagToCategory: { [key: string]: { direct: string[], indirect: string[] } } = {
      'Tech': {
        direct: [],
        indirect: ['Consumer electronics', 'AAPL', 'NVDA', 'META']
      },
      'Energy': {
        direct: ['EV/battery', 'Solar cell', 'FSLR'],
        indirect: []
      }
    };
    
    const categories = tagToCategory[activeTag] || { direct: [], indirect: [] };
    const relevantCategories = categories[tagType] || [];
    
    return items.filter(item => 
      relevantCategories.some(category => 
        item.label?.includes(category) || item.ticker?.includes(category)
      )
    );
  };

  const cards: Record<string, TariffCard> = {
    'china-tariffs': {
      title: "White House to decide on China tariffs",
      date: date || "2025-09-14",
      tags: [
        { name: "Tech", style: "greyOutlined" },
        { name: "Energy", style: "purple" }
      ],
      directEffects: [
        { label: "EV/battery import rates adjusted", value: "↑", isPositive: false, tagType: 'direct' },
        { label: "Solar cell/module tariffs adjusted", value: "↑", isPositive: false, tagType: 'direct' }
      ],
      indirectEffects: [
        { label: "Consumer electronics supply-chain costs", value: "↑", isPositive: false, tagType: 'indirect' }
      ],
      stocksToWatch: [
        { ticker: "TSLA", rationale: "Domestic EV shield vs. China imports/battery line items", isDirect: true },
        { ticker: "FSLR", rationale: "Tariffs support U.S. solar pricing/capacity", isDirect: true },
        { ticker: "AAPL", rationale: "Assembly exposure; pricing/pass-through risk", isDirect: false }
      ],
      meta: {
        binary: false,
        recurring: "episodic",
        history: true,
        source: "USTR/Federal Register"
      }
    },
    'trade-tensions': {
      title: "Tariff hike may worsen trade tensions",
      date: date || "2025-10-15",
      tags: [
        { name: "Tech", style: "greyOutlined" }
      ],
      directEffects: [],
      indirectEffects: [
        { label: "Potential retaliation on U.S. tech/industrial exports", value: "↑", isPositive: false, tagType: 'indirect' },
        { label: "Admin restrictions", value: "↑", isPositive: false, tagType: 'indirect' }
      ],
      stocksToWatch: [
        { ticker: "AAPL", rationale: "China revenue & policy sensitivity", isDirect: false },
        { ticker: "INTC", rationale: "China revenue; chip export/retaliation channel", isDirect: false },
        { ticker: "CAT", rationale: "Global machinery; retaliation & cost pass-through", isDirect: false }
      ],
      meta: {
        binary: false,
        recurring: "episodic",
        history: true,
        source: "USTR/MOFCOM/releases"
      }
    },
    'supreme-court': {
      title: "Supreme Court reviews Trump's tariffs",
      date: date || "2025-11-05",
      tags: [
        { name: "Tech", style: "greyOutlined" },
        { name: "Energy", style: "purple" }
      ],
      directEffects: [
        { label: "Steel/aluminum tariffs preserved or struck", value: "?", isPositive: true, tagType: 'direct' }
      ],
      indirectEffects: [
        { label: "Downstream input costs for autos/industry", value: "↓", isPositive: true, tagType: 'indirect' }
      ],
      stocksToWatch: [
        { ticker: "NUE", rationale: "Up if upheld; down if struck", isDirect: true },
        { ticker: "STLD", rationale: "Same as NUE", isDirect: true },
        { ticker: "F", rationale: "Benefits from lower input costs if struck", isDirect: false }
      ],
      meta: {
        binary: true,
        recurring: "one-off",
        history: true,
        source: "SCOTUS docket"
      }
    }
  };

  const card = cards[cardType];

  return (
    <section className="mt-4 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm p-4 md:p-5">
      <header className="mb-3 text-sm font-bold text-black dark:text-white">
        Last time this happened (historical tendency)
      </header>

      {/* Tags - Reordered to show Tech, Energy first */}
      <div className="flex flex-wrap gap-2 mb-4">
        {card.tags
          .sort((a, b) => {
            // Tech first, then Energy, then others
            if (a.name === "Tech") return -1;
            if (b.name === "Tech") return 1;
            if (a.name === "Energy") return -1;
            if (b.name === "Energy") return 1;
            return 0;
          })
          .map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                tag.style === 'purple' 
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {tag.name}
            </span>
          ))}
      </div>

      {/* Direct Effects */}
      {filterByTag(card.directEffects, 'direct').length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Direct effects:</h4>
          <div className="space-y-1">
            {filterByTag(card.directEffects, 'direct').map((effect, index) => (
              <MetricRow
                key={index}
                label={effect.label}
                value={effect.value}
                isPositive={effect.isPositive}
                tagType={effect.tagType as 'direct' | 'indirect'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Indirect Effects */}
      {filterByTag(card.indirectEffects, 'indirect').length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Indirect effects:</h4>
          <div className="space-y-1">
            {filterByTag(card.indirectEffects, 'indirect').map((effect, index) => (
              <MetricRow
                key={index}
                label={effect.label}
                value={effect.value}
                isPositive={effect.isPositive}
                tagType={effect.tagType as 'direct' | 'indirect'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stocks to Watch */}
      {filterByTag(card.stocksToWatch, 'indirect').length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Stocks to watch:</h4>
          <div className="space-y-1">
            {filterByTag(card.stocksToWatch, 'indirect').map((stock, index) => (
              <div key={index} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{stock.ticker}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    stock.isDirect 
                      ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {stock.isDirect ? 'Direct' : 'Indirect'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-right max-w-xs">
                  {stock.rationale}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Binary: {card.meta.binary ? 'true' : 'false'} • Recurring: {card.meta.recurring} • History: {card.meta.history ? 'yes' : 'no'}</div>
          <div>Source: {card.meta.source}</div>
        </div>
      </div>
    </section>
  );
}
