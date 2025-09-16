'use client';

import { CompanyTicker } from '@/types/company';

interface CompanyHeaderProps {
  ticker: CompanyTicker;
  viewMode: 'month' | 'week' | 'list';
  onViewModeChange: (mode: 'month' | 'week' | 'list') => void;
}

const companyInfo: { [key in CompanyTicker]: { name: string; logo: string; color: string } } = {
  NVDA: { name: 'NVIDIA Corporation', logo: '🎮', color: 'text-green-600' },
  TSLA: { name: 'Tesla, Inc.', logo: '⚡', color: 'text-red-600' },
  AAPL: { name: 'Apple Inc.', logo: '🍎', color: 'text-gray-600' },
  META: { name: 'Meta Platforms, Inc.', logo: '📘', color: 'text-blue-600' },
  AMZN: { name: 'Amazon.com, Inc.', logo: '📦', color: 'text-orange-600' },
  HOOD: { name: 'Robinhood Markets Inc.', logo: '🦅', color: 'text-emerald-600' }
};

export default function CompanyHeader({ ticker, viewMode, onViewModeChange }: CompanyHeaderProps) {
  const company = companyInfo[ticker];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        {/* Company Info */}
        <div className="flex items-center gap-4">
          <div className="text-4xl">{company.logo}</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {ticker} Calendar
            </h1>
            <p className={`text-sm font-medium ${company.color}`}>
              {company.name}
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('month')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'month'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewModeChange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'week'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}
