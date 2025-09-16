'use client';

import { ActionInsight as ActionInsightType } from '@/lib/events';

interface ActionInsightProps {
  insight: ActionInsightType;
}

export default function ActionInsight({ insight }: ActionInsightProps) {
  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
        Action Insight (this time)
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-green-600 dark:text-green-400 font-medium text-sm">Bullish:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{insight.bullishScenario}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-red-600 dark:text-red-400 font-medium text-sm">Bearish:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{insight.bearishScenario}</span>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">What to watch live:</span>
          <span className="text-sm text-gray-700 dark:text-gray-300">{insight.whatToWatch}</span>
        </div>
      </div>
    </div>
  );
}
