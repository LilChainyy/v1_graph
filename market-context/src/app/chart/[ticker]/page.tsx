import { Suspense } from 'react';
import Link from 'next/link';
import ChartClient from '@/components/ChartClient';

interface ChartPageProps {
  params: {
    ticker: string;
  };
  searchParams: {
    dot?: string;
  };
}

export default async function ChartPage({ params, searchParams }: ChartPageProps) {
  const { ticker } = await params;
  const { dot } = await searchParams;
  const highlightDate = dot;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Events
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {ticker.toUpperCase()} Chart
              </h1>
              <p className="text-gray-600 mt-1">
                Interactive price chart with event highlights
              </p>
            </div>
            
            {highlightDate && (
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  Highlighting Event
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {new Date(highlightDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <Suspense fallback={
            <div className="w-full h-96 flex items-center justify-center">
              <div className="text-gray-500">Loading chart...</div>
            </div>
          }>
            <ChartClient ticker={ticker} highlightDate={highlightDate} />
          </Suspense>
        </div>

        {/* Chart Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <strong>Chart Features:</strong>
            <ul className="mt-2 space-y-1">
              <li>• Green line shows actual price data</li>
              <li>• Purple dots highlight event dates</li>
              <li>• Hover over data points for detailed information</li>
              <li>• Interactive zoom and pan capabilities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
