'use client';

import { useState, useEffect } from 'react';
import { loadRecentlyAddedNVDA, RecentlyAddedEvent } from '@/lib/loaders';

interface RecentlyAddedEventsProps {
  ticker: string;
}

export default function RecentlyAddedEvents({ ticker }: RecentlyAddedEventsProps) {
  const [recentEvents, setRecentEvents] = useState<RecentlyAddedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // For now, only show recently added for NVDA
        // TODO: Make this dynamic for all tickers
        if (ticker.toUpperCase() === 'NVDA') {
          const events = await loadRecentlyAddedNVDA();
          setRecentEvents(events);
        } else {
          setRecentEvents([]);
        }
      } catch (error) {
        console.warn('Failed to load recently added events:', error);
        setRecentEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [ticker]);

  if (loading) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Recently added (latest update)
        </h3>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (recentEvents.length === 0) {
    return (
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Recently added (latest update)
        </h3>
        <p className="text-gray-500">No new items in the latest update.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Recently added (latest update)
      </h3>
      <div className="space-y-1">
        {recentEvents.map((event) => (
          <div key={event.id} className="text-sm text-gray-700">
            {event.date} — {event.title} 
            {event.source && (
              <span className="text-gray-500 ml-1">
                [source: {event.source}]
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
