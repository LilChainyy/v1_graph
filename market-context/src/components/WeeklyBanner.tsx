'use client';

import { BannerData } from '@/lib/events';

interface WeeklyBannerProps {
  bannerData: BannerData;
}

export default function WeeklyBanner({ bannerData }: WeeklyBannerProps) {
  const formatSpxChange = (pct: number | null) => {
    if (pct === null) return "N/A";
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(2)}%`;
  };

  const formatEventDates = (events: BannerData['upcomingEvents']) => {
    if (events.length === 0) return "No major events this week";
    return events.map(event => `${event.title} (${event.date})`).join(", ");
  };

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
        Weekly Big Picture
      </h2>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">S&P 500:</span>
          <span className={`font-semibold ${bannerData.spxWtdPct && bannerData.spxWtdPct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatSpxChange(bannerData.spxWtdPct)} WTD
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">This week:</span>
          <span className="text-gray-600 dark:text-gray-400">
            {formatEventDates(bannerData.upcomingEvents)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Rule of thumb:</span>
          <span className="text-gray-600 dark:text-gray-400">
            If auction &lt; WI → duration tends to lead; if &gt; WI → yields up, duration lags
          </span>
        </div>
      </div>
    </div>
  );
}
