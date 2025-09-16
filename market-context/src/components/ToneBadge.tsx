'use client';

import { ToneInfo } from '@/lib/events';

interface ToneBadgeProps {
  toneInfo: ToneInfo;
}

export default function ToneBadge({ toneInfo }: ToneBadgeProps) {
  const getBadgeColor = () => {
    switch (toneInfo.toneLabel) {
      case 'Risk-on':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'Risk-off':
        return 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'Neutral':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor()}`}>
        {toneInfo.toneLabel}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {toneInfo.toneWhy}
      </span>
    </div>
  );
}
