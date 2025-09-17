'use client';

import { DatabaseEvent } from '@/types/company';

interface ListViewProps {
  events: DatabaseEvent[];
  onEventClick: (event: DatabaseEvent) => void;
}

// Safe date parsing utility
const parseEventDate = (dateString: string | undefined): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    console.warn('Invalid date string:', dateString, error);
    return null;
  }
};

export default function ListView({ events, onEventClick }: ListViewProps) {
  const sortedEvents = [...events]
    .filter(event => {
      const dateString = event.start || (event as any).date;
      return parseEventDate(dateString) !== null;
    })
    .sort((a, b) => {
      const dateA = parseEventDate(a.start || (a as any).date);
      const dateB = parseEventDate(b.start || (b as any).date);
      
      if (!dateA || !dateB) return 0;
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        <p className="text-sm text-gray-500">{events.length} events found</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sortedEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No events found for the selected filters
          </div>
        ) : (
          sortedEvents.map((event) => {
            const eventDate = parseEventDate(event.start || (event as any).date);
            const isDirect = event.tickerId !== null;
            
            return (
              <div
                key={event.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        event.category === 'EARNINGS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        event.category === 'SEC_FILINGS' ? 'bg-green-100 text-green-700 border-green-200' :
                        event.category.startsWith('MACRO_') ? 'bg-red-100 text-red-700 border-red-200' :
                        event.category === 'REGULATORY' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {event.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        isDirect 
                          ? 'bg-purple-100 text-purple-700 border-purple-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {isDirect ? 'Direct' : 'Indirect'}
                      </span>
                  </div>
                  
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>{eventDate ? eventDate.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Invalid Date'}</span>
                      <span>{event.source}</span>
                    </div>
                    
                    {event.notes && (
                      <p className="text-sm text-gray-600 mb-2">{event.notes}</p>
                    )}
                    
                    {event.links && event.links.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {event.links.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200"
                          >
                            Link {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

