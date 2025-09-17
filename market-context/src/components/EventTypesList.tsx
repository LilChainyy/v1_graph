'use client';

import { useState, useEffect } from 'react';
import { CompanyTicker } from '@/types/company';

interface EventTypesListProps {
  ticker: CompanyTicker;
}

export default function EventTypesList({ ticker }: EventTypesListProps) {
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/event-types?symbol=${ticker}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const types = await response.json();
        setEventTypes(types);
      } catch (err) {
        console.error('Failed to fetch event types:', err);
        setError('Failed to load event types');
        setEventTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, [ticker]);

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Included Event Types for {ticker}:
        </h3>
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-sm font-medium text-red-700 mb-2">
          Included Event Types for {ticker}:
        </h3>
        <div className="text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (eventTypes.length === 0) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Included Event Types for {ticker}:
        </h3>
        <div className="text-sm text-gray-500">No event types found</div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Included Event Types for {ticker}:
      </h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {eventTypes.map((eventType) => (
          <li key={eventType} className="flex items-center">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
            {eventType}
          </li>
        ))}
      </ul>
    </div>
  );
}
