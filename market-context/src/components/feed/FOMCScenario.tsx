'use client';

import MetricRow from './MetricRow';

type Props = { 
  date?: string;
  event?: any; // FOMC event data
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

export default function FOMCScenario({ date, event, activeTag }: Props) {
  const scenarios = [
    {
      title: "Scenario A: Dovish surprise (cut or dots lower than expected)",
      directEffects: [
        { label: "2Y/10Y yields", value: "↓", isPositive: true, tagType: 'direct' },
        { label: "TLT", value: "+0.7% (~+$0.90)", isPositive: true, tagType: 'direct' },
        { label: "IEF", value: "+0.4% (~+$0.35)", isPositive: true, tagType: 'direct' },
        { label: "USD", value: "↓", isPositive: true, tagType: 'direct' }
      ],
      indirectEffects: [
        { label: "NASDAQ", value: "+1.2% (~+$18) next 24h", isPositive: true, tagType: 'indirect' },
        { label: "Rate-sensitive Tech tends to outperform", value: "↑", isPositive: true, tagType: 'indirect' }
      ],
      stocksToWatch: [
        { ticker: "NVDA", rationale: "High duration; rate-sensitive", isDirect: false },
        { ticker: "META", rationale: "Growth, discount-rate sensitivity", isDirect: false },
        { ticker: "XHB", rationale: "Housing sector benefits from lower rates", isDirect: false }
      ]
    },
    {
      title: "Scenario B: Hawkish surprise (no cut / dots higher / stronger guidance)",
      directEffects: [
        { label: "2Y/10Y yields", value: "↑", isPositive: false, tagType: 'direct' },
        { label: "TLT", value: "−0.6% (~−$0.75)", isPositive: false, tagType: 'direct' },
        { label: "IEF", value: "−0.3% (~−$0.25)", isPositive: false, tagType: 'direct' },
        { label: "USD", value: "↑", isPositive: false, tagType: 'direct' }
      ],
      indirectEffects: [
        { label: "NASDAQ", value: "−0.8% (~−$12) next 24h", isPositive: false, tagType: 'indirect' },
        { label: "Financials relative", value: "↑", isPositive: false, tagType: 'indirect' }
      ],
      stocksToWatch: [
        { ticker: "NVDA", rationale: "High duration; rate-sensitive", isDirect: false },
        { ticker: "META", rationale: "Growth, discount-rate sensitivity", isDirect: false },
        { ticker: "JPM", rationale: "NIM sensitive to rate changes", isDirect: false }
      ]
    }
  ];

  return (
    <section className="mt-4 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm p-4 md:p-5">
      <header className="mb-3 text-sm font-bold text-black dark:text-white">
        Last time this happened (historical tendency)
      </header>

      {/* Tags - Reordered to show direct effects first */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["Bonds", "Rates", "USD", "Tech", "Financials", "Housing", "Broad Market"].map((tag, index) => {
          const isDirect = ["Bonds", "Rates", "USD"].includes(tag);
          return (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isDirect
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
              }`}
            >
              {tag}
            </span>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario, index) => (
          <div key={index} className="relative">
            {/* Connector line hint */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-px h-2 bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {scenario.title}
              </div>
              
              {/* Direct Effects */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Direct effects:</h4>
                <div className="space-y-1">
                  {scenario.directEffects.map((effect, effectIndex) => (
                    <MetricRow
                      key={effectIndex}
                      label={effect.label}
                      value={effect.value}
                      isPositive={effect.isPositive}
                      tagType={effect.tagType as 'direct' | 'indirect'}
                    />
                  ))}
                </div>
              </div>

              {/* Indirect Effects */}
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Indirect effects:</h4>
                <div className="space-y-1">
                  {scenario.indirectEffects.map((effect, effectIndex) => (
                    <MetricRow
                      key={effectIndex}
                      label={effect.label}
                      value={effect.value}
                      isPositive={effect.isPositive}
                      tagType={effect.tagType as 'direct' | 'indirect'}
                    />
                  ))}
                </div>
              </div>

              {/* Stocks to Watch */}
              <div>
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Stocks to watch:</h4>
                <div className="space-y-1">
                  {scenario.stocksToWatch.map((stock, stockIndex) => (
                    <div key={stockIndex} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{stock.ticker}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded text-xs font-medium">
                          Indirect
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 text-right max-w-xs">
                        {stock.rationale}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Meta */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>Binary: true • Recurring: fixed (8×/yr) • History: yes</div>
          <div>Source: FOMC Statement & Press Conference</div>
          {event?.notes && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              {event.notes}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
