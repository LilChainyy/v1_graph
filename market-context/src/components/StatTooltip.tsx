'use client';

import { useState } from 'react';
import { StatMetadata } from '@/lib/events';

interface StatTooltipProps {
  metadata: StatMetadata;
  children: React.ReactNode;
}

export default function StatTooltip({ metadata, children }: StatTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap">
          <div className="space-y-1">
            <div><span className="font-medium">Metric:</span> {metadata.statType}</div>
            <div><span className="font-medium">Window:</span> {metadata.statWindow}</div>
            <div><span className="font-medium">Sample size:</span> N={metadata.sampleSize}</div>
            <div><span className="font-medium">Hit rate:</span> {metadata.hitRate}%</div>
            <div><span className="font-medium">Lookback:</span> {metadata.lookbackSpan}</div>
          </div>
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}
