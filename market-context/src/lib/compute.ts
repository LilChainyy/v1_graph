// Mock compute functions for historical analysis
// In a real app, these would connect to financial data APIs

export interface HistoricalData {
  ticker: string;
  date: string;
  close: number;
  volume: number;
}

export interface WindowReturn {
  ticker: string;
  start_date: string;
  end_date: string;
  return_pct: number;
  max_drawdown: number;
  volatility: number;
}

export async function getHistoricalData(
  ticker: string,
  startDate: string,
  endDate: string
): Promise<HistoricalData[]> {
  // Mock implementation - in real app, would call yfinance or similar
  const mockData: HistoricalData[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    mockData.push({
      ticker,
      date: d.toISOString().split('T')[0],
      close: 100 + Math.random() * 20 - 10, // Mock price between 90-110
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }
  
  return mockData;
}

export function calculateWindowReturn(
  data: HistoricalData[],
  eventDate: string,
  windowDays: number
): WindowReturn | null {
  if (data.length === 0) return null;
  
  const event = new Date(eventDate);
  const startDate = new Date(event);
  startDate.setDate(startDate.getDate() - windowDays);
  
  const endDate = new Date(event);
  endDate.setDate(endDate.getDate() + windowDays);
  
  const windowData = data.filter(d => {
    const date = new Date(d.date);
    return date >= startDate && date <= endDate;
  });
  
  if (windowData.length < 2) return null;
  
  const startPrice = windowData[0].close;
  const endPrice = windowData[windowData.length - 1].close;
  const returnPct = ((endPrice - startPrice) / startPrice) * 100;
  
  // Calculate max drawdown
  let maxDrawdown = 0;
  let peak = startPrice;
  
  for (const point of windowData) {
    if (point.close > peak) {
      peak = point.close;
    }
    const drawdown = ((point.close - peak) / peak) * 100;
    if (drawdown < maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  // Calculate volatility (simplified)
  const returns = [];
  for (let i = 1; i < windowData.length; i++) {
    const dailyReturn = (windowData[i].close - windowData[i-1].close) / windowData[i-1].close;
    returns.push(dailyReturn);
  }
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized
  
  return {
    ticker: data[0].ticker,
    start_date: startDate.toISOString().split('T')[0],
    end_date: endDate.toISOString().split('T')[0],
    return_pct: returnPct,
    max_drawdown: maxDrawdown,
    volatility: volatility,
  };
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export interface ChartSeries {
  labels: string[];
  actual: (number | null)[];
  stub: (number | null)[];
  earningsDots: (number | null)[];
}

export async function buildSeries(
  ticker: string,
  start: string,
  lastKnown: string,
  yearEnd: string,
  highlightDate?: string
): Promise<ChartSeries> {
  // For now, generate mock data
  // In a real app, this would fetch from yfinance or similar API
  const startDate = new Date(start);
  const lastKnownDate = new Date(lastKnown);
  const yearEndDate = new Date(yearEnd);
  const highlightDateObj = highlightDate ? new Date(highlightDate) : null;
  
  const labels: string[] = [];
  const actual: (number | null)[] = [];
  const stub: (number | null)[] = [];
  const earningsDots: (number | null)[] = [];
  
  // Generate labels for the entire year
  for (let d = new Date(startDate); d <= yearEndDate; d.setDate(d.getDate() + 1)) {
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    
    const dateStr = d.toISOString().split('T')[0];
    labels.push(dateStr);
    
    if (d <= lastKnownDate) {
      // Actual data - generate realistic price movement
      const daysSinceStart = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const trend = Math.sin(daysSinceStart / 30) * 10; // Monthly cycle
      const noise = (Math.random() - 0.5) * 4; // Random noise
      const basePrice = 100 + Math.random() * 50; // Random base price
      const price = Math.max(50, basePrice + trend + noise);
      
      actual.push(price);
      stub.push(null);
    } else {
      // Future data - flat line at last known price
      actual.push(null);
      stub.push(actual[actual.length - 1] || 100); // Use last actual price or default
    }
    
    // Add earnings dot if this is the highlight date
    if (highlightDateObj && d.getTime() === highlightDateObj.getTime()) {
      earningsDots.push(actual[actual.length - 1] || stub[stub.length - 1] || 100);
    } else {
      earningsDots.push(null);
    }
  }
  
  return { labels, actual, stub, earningsDots };
}
