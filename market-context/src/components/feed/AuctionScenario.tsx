'use client';

import MetricRow from './MetricRow';
import { StatMetadata } from '@/lib/events';

type Props = { date?: string; activeTag?: string };

interface Metric {
  label: string;
  value: string;
  isPositive: boolean;
  tagType?: 'direct' | 'indirect';
  statMetadata?: StatMetadata;
}

interface Scenario {
  title: string;
  metrics: Metric[];
}

export default function AuctionScenario({ date, activeTag }: Props) {
  // Filter metrics based on active tag
  const filterMetricsByTag = (metrics: Metric[]) => {
    if (!activeTag) return metrics;
    
    // Map tags to metric categories
    const tagToCategory: { [key: string]: string[] } = {
      'Bonds': ['10Y yields', 'TLT', 'IEF'],
      'Tech': ['S&P 500']
    };
    
    const relevantCategories = tagToCategory[activeTag] || [];
    return metrics.filter(metric => 
      relevantCategories.some(category => metric.label.includes(category))
    );
  };

  const defaultStatMetadata: StatMetadata = {
    statWindow: "next 24h",
    statType: "median",
    sampleSize: 24,
    hitRate: 68,
    lookbackSpan: "2015–present"
  };

  const scenarios: Scenario[] = [
    {
      title: "Scenario 1: Strong demand (historical median reaction)",
      metrics: [
        { 
          label: "10Y yields", 
          value: "↓", 
          isPositive: true, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 28, hitRate: 71 }
        },
        { 
          label: "Last time (median): TLT", 
          value: "+0.6% (~+$0.75)", 
          isPositive: true, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 24, hitRate: 68 }
        },
        { 
          label: "Last time (median): IEF", 
          value: "+0.4% (~+$0.35)", 
          isPositive: true, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 22, hitRate: 64 }
        },
        { 
          label: "Last time (median): S&P 500", 
          value: "+0.3% (~+$15) next 24h", 
          isPositive: true, 
          tagType: 'indirect',
          statMetadata: { ...defaultStatMetadata, sampleSize: 26, hitRate: 65 }
        },
      ]
    },
    {
      title: "Scenario 2: Weak demand (historical median reaction)",
      metrics: [
        { 
          label: "10Y yields", 
          value: "↑", 
          isPositive: false, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 31, hitRate: 74 }
        },
        { 
          label: "Last time (median): TLT", 
          value: "−0.6% (~−$0.75)", 
          isPositive: false, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 29, hitRate: 72 }
        },
        { 
          label: "Last time (median): IEF", 
          value: "−0.4% (~−$0.35)", 
          isPositive: false, 
          tagType: 'direct',
          statMetadata: { ...defaultStatMetadata, sampleSize: 27, hitRate: 70 }
        },
        { 
          label: "Last time (median): S&P 500", 
          value: "−0.2% (~−$10) next 24h", 
          isPositive: false, 
          tagType: 'indirect',
          statMetadata: { ...defaultStatMetadata, sampleSize: 25, hitRate: 62 }
        },
      ]
    }
  ];

  return (
    <section className="mt-4 rounded-2xl bg-white dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm p-4 md:p-5">
      <header className="mb-3 text-sm font-bold text-black dark:text-white">
        Last time this happened (historical median reaction)
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
                    statMetadata={metric.statMetadata}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend line */}
      <div className="mt-4 text-xs text-gray-500 border-t border-gray-200 pt-3">
        Stats = historical tendencies • window: next 24h • not a prediction.
      </div>

      {/* Historical disclaimer */}
      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          These figures are based on historical medians observed in past auctions. 
          They are not predictions or investment advice.
        </p>
      </div>
    </section>
  );
}
