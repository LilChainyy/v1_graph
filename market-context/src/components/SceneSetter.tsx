'use client';

interface SceneData {
  marketTrend: 'up' | 'flat' | 'mixed' | 'down';
  sentiment: 'firmer' | 'neutral' | 'cautious';
  rates: 'easing' | 'steady' | 'climbing';
  fear: 'calm' | 'normal' | 'picking up';
  nextEvent: {
    type: 'CPI' | 'Fed meeting' | 'Jobs report' | '10-yr auction' | 'Tariff update';
    weekday: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
    why: string;
  };
  sources: string[];
  attribution?: string;
}

interface SceneSetterProps {
  data: SceneData;
}

export default function SceneSetter({ data }: SceneSetterProps) {
  const getPillColor = (type: string, value: string) => {
    // Market trend colors
    if (type === 'marketTrend') {
      switch (value) {
        case 'up': return 'bg-green-100 text-green-700 border-green-200';
        case 'down': return 'bg-red-100 text-red-700 border-red-200';
        case 'mixed': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'flat': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    
    // Sentiment colors
    if (type === 'sentiment') {
      switch (value) {
        case 'firmer': return 'bg-green-100 text-green-700 border-green-200';
        case 'cautious': return 'bg-red-100 text-red-700 border-red-200';
        case 'neutral': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    
    // Rates colors
    if (type === 'rates') {
      switch (value) {
        case 'easing': return 'bg-green-100 text-green-700 border-green-200';
        case 'climbing': return 'bg-red-100 text-red-700 border-red-200';
        case 'steady': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    
    // Fear colors
    if (type === 'fear') {
      switch (value) {
        case 'calm': return 'bg-green-100 text-green-700 border-green-200';
        case 'picking up': return 'bg-red-100 text-red-700 border-red-200';
        case 'normal': return 'bg-gray-100 text-gray-700 border-gray-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
    
    // Next event colors
    if (type === 'nextEvent') {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="space-y-3 text-sm">
        {/* Line 1: Stocks are {marketTrend} this week */}
        <div className="flex flex-wrap items-center gap-1">
          <span>Stocks are</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('marketTrend', data.marketTrend)}`}>
            {data.marketTrend}
          </span>
          <span>this week.</span>
        </div>
        
        {/* Line 2: Vibe: {sentiment} — rates {rates} • fear {fear} */}
        <div className="flex flex-wrap items-center gap-1">
          <span>Vibe:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('sentiment', data.sentiment)}`}>
            {data.sentiment}
          </span>
          <span>— rates</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('rates', data.rates)}`}>
            {data.rates}
          </span>
          <span>• fear</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('fear', data.fear)}`}>
            {data.fear}
          </span>
          <span>.</span>
        </div>
        
        {/* Line 3: Next: {nextEvent.type} on {nextEvent.weekday} — {nextEvent.why} */}
        <div className="flex flex-wrap items-center gap-1">
          <span>Next:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('nextEvent', data.nextEvent.type)}`}>
            {data.nextEvent.type}
          </span>
          <span>on</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPillColor('nextEvent', data.nextEvent.weekday)}`}>
            {data.nextEvent.weekday}
          </span>
          <span>—</span>
          <span className="text-gray-600">{data.nextEvent.why}</span>
        </div>
      </div>
      
      {/* Attribution */}
      {data.attribution && (
        <div className="mt-3 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            {data.attribution}
            {data.sources.length > 0 && (
              <span className="ml-1">
                • <a 
                  href="https://www.reuters.com/business/finance/morning-bid/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {data.sources[0]}
                </a>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
