import { CompanyEvent, CompanyTicker } from '@/types/company';

export async function loadCompanyEvents(ticker: CompanyTicker): Promise<CompanyEvent[]> {
  try {
    // Fetch events from API
    const response = await fetch(`/api/events?ticker=${ticker}`, {
      cache: 'no-store' // Always get fresh data
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const events = await response.json();
    return events || [];
  } catch (error) {
    console.warn(`Failed to load events for ${ticker}:`, error);
    return [];
  }
}

export function filterCompanyEvents(
  events: CompanyEvent[], 
  filters: {
    dateRange?: { start: string; end: string };
    eventTypes?: string[];
    directOnly?: boolean;
    tags?: string[];
  }
): CompanyEvent[] {
  return events.filter(event => {
    // Date range filter
    if (filters.dateRange) {
      const eventDate = new Date(event.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (eventDate < startDate || eventDate > endDate) {
        return false;
      }
    }

    // Event type filter
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      if (!filters.eventTypes.includes(event.eventType)) {
        return false;
      }
    }

    // Direct only filter
    if (filters.directOnly && !event.direct) {
      return false;
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = event.tags.some(tag => filters.tags!.includes(tag));
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

export function getEventTypeColor(eventType: string): string {
  const colors: { [key: string]: string } = {
    // Direct Events
    'Earnings': 'bg-blue-100 text-blue-700 border-blue-200',
    'Product': 'bg-green-100 text-green-700 border-green-200',
    'Conference': 'bg-purple-100 text-purple-700 border-purple-200',
    'Legal/Reg': 'bg-gray-100 text-gray-700 border-gray-200',
    'Partnership': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    
    // Indirect Events
    'FOMC': 'bg-red-100 text-red-700 border-red-200',
    'Treasury Auction': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Tariff': 'bg-orange-100 text-orange-700 border-orange-200',
    'Competitor': 'bg-pink-100 text-pink-700 border-pink-200',
    'MacroPrint': 'bg-cyan-100 text-cyan-700 border-cyan-200'
  };
  
  return colors[eventType] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export function getDirectPillStyle(direct: boolean): string {
  return direct 
    ? 'bg-purple-100 text-purple-700 border border-purple-200'
    : 'bg-gray-100 text-black border border-black';
}
