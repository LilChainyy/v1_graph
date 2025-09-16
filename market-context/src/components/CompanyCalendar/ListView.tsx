'use client';

import { CompanyEvent } from '@/types/company';
import { getDirectPillStyle, getEventTypeColor } from '@/lib/companyLoader';

interface ListViewProps {
  events: CompanyEvent[];
  onEventClick: (event: CompanyEvent) => void;
}

export default function ListView({ events, onEventClick }: ListViewProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
          sortedEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDirectPillStyle(event.direct)}`}>
                      {event.direct ? 'Direct' : 'Indirect'}
                    </span>
                    {event.isBinary && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                        Binary
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                    {event.time && <span>{event.time}</span>}
                    <span>{event.isRecurring}</span>
                  </div>
                  
                  {event.notes && (
                    <p className="text-sm text-gray-600 mb-2">{event.notes}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                {event.history && (
                  <div className="text-right text-sm text-gray-500 ml-4">
                    <div className="font-medium">
                      {event.history.medianPct && event.history.medianPct > 0 ? '+' : ''}
                      {event.history.medianPct}%
                    </div>
                    <div className="text-xs">
                      N={event.history.sampleSize}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
