'use client';

import StatTooltip from '../StatTooltip';
import { StatMetadata } from '@/lib/events';

interface MetricRowProps {
  label: string;
  value: string;
  isPositive: boolean;
  tagType?: 'direct' | 'indirect';
  statMetadata?: StatMetadata;
}

export default function MetricRow({ label, value, isPositive, tagType, statMetadata }: MetricRowProps) {
  const getTagColor = () => {
    if (tagType === 'direct') {
      return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
    } else if (tagType === 'indirect') {
      return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
    return '';
  };

  const getTagText = () => {
    if (tagType === 'direct') return 'Direct';
    if (tagType === 'indirect') return 'Indirect';
    return '';
  };

  // Default metadata if none provided
  const defaultMetadata: StatMetadata = {
    statWindow: "next 24h",
    statType: "median",
    sampleSize: 24,
    hitRate: 68,
    lookbackSpan: "2015–present"
  };

  const metadata = statMetadata || defaultMetadata;

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        {tagType && (
          <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${getTagColor()}`}>
            {getTagText()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-xs ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {isPositive ? '↗' : '↘'}
        </span>
        <StatTooltip metadata={metadata}>
          <div className="flex items-center gap-1 cursor-help">
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {value}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              N={metadata.sampleSize} • {metadata.statType} • 24h
            </span>
          </div>
        </StatTooltip>
      </div>
    </div>
  );
}
