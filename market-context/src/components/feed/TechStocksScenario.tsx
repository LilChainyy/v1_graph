'use client';

import MetricRow from './MetricRow';

type Props = { date?: string; activeTag?: string };

interface Metric {
  label: string;
  value: string;
  isPositive: boolean;
  tagType?: 'direct' | 'indirect';
}

interface Scenario {
  title: string;
  metrics: Metric[];
}

export default function TechStocksScenario({ date, activeTag }: Props) {
  // Filter metrics based on active tag
  const filterMetricsByTag = (metrics: Metric[]) => {
    if (!activeTag) return metrics;
    
    // For tech stocks, show all metrics if Tech tag is selected
    if (activeTag === 'Tech') return metrics;
    
    // For other tags, filter accordingly
    const tagToCategory: { [key: string]: string[] } = {
      'Bonds': ['NVDA', 'TSLA', 'META'], // All tech stocks are indirect
    };
    
    const relevantCategories = tagToCategory[activeTag] || [];
    return metrics.filter(metric => 
      relevantCategories.some(category => metric.label.includes(category))
    );
  };

  const scenarios: Scenario[] = [
    {
      title: "Scenario 1: Strong demand (historical median reaction)",
      metrics: [
        { label: "Last time (median): NVDA", value: "+0.8% (~+$1.20)", isPositive: true, tagType: 'indirect' },
        { label: "Last time (median): TSLA", value: "+0.5% (~+$1.15)", isPositive: true, tagType: 'indirect' },
        { label: "Last time (median): META", value: "+0.3% (~+$1.35)", isPositive: true, tagType: 'indirect' },
      ]
    },
    {
      title: "Scenario 2: Weak demand (historical median reaction)",
      metrics: [
        { label: "Last time (median): NVDA", value: "−0.4% (~−$0.60)", isPositive: false, tagType: 'indirect' },
        { label: "Last time (median): TSLA", value: "−0.2% (~−$0.46)", isPositive: false, tagType: 'indirect' },
        { label: "Last time (median): META", value: "−0.1% (~−$0.45)", isPositive: false, tagType: 'indirect' },
      ]
    }
  ];

  return (
    <section className="mt-4 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm p-4 md:p-5">
      <header className="mb-3 text-sm font-bold text-black dark:text-white">
        Last time this happened (tech stock reactions)
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario, index) => (
          <div key={index} className="relative">
            {/* Connector line hint */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-px h-2 bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {scenario.title}
              </div>
              
              <div className="space-y-1">
                {filterMetricsByTag(scenario.metrics).map((metric, metricIndex) => (
                  <MetricRow
                    key={metricIndex}
                    label={metric.label}
                    value={metric.value}
                    isPositive={metric.isPositive}
                    tagType={metric.tagType}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Historical disclaimer */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          These figures are based on historical medians observed in past auctions. 
          They are not predictions or investment advice.
        </p>
      </div>
    </section>
  );
}
