'use client';

import { useState } from 'react';
import { CompanyEvent, CompanyFilters, EventType, ImpactTag, ALL_EVENT_TYPES, ALL_IMPACT_TAGS } from '@/types/company';

interface SidebarFiltersProps {
  filters: CompanyFilters;
  onFilterChange: (filters: Partial<CompanyFilters>) => void;
  events: CompanyEvent[];
}

const eventTypes: EventType[] = [...ALL_EVENT_TYPES];

const impactTags: ImpactTag[] = [...ALL_IMPACT_TAGS];

export default function SidebarFilters({ filters, onFilterChange, events }: SidebarFiltersProps) {
  const [showAddEvent, setShowAddEvent] = useState(false);

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleEventTypeChange = (eventType: EventType, checked: boolean) => {
    const newEventTypes = checked
      ? [...filters.eventTypes, eventType]
      : filters.eventTypes.filter(type => type !== eventType);
    
    onFilterChange({ eventTypes: newEventTypes });
  };

  const handleTagChange = (tag: ImpactTag, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag);
    
    onFilterChange({ tags: newTags });
  };

  const clearAllFilters = () => {
    onFilterChange({
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      eventTypes: [],
      directOnly: false,
      tags: []
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear all
        </button>
      </div>

      {/* Date Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </label>
        <div className="space-y-2">
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => handleDateRangeChange('start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => handleDateRangeChange('end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* Direct Only Toggle */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.directOnly}
            onChange={(e) => onFilterChange({ directOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Direct events only</span>
        </label>
      </div>

      {/* Event Types */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Types
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {eventTypes.map((eventType) => (
            <label key={eventType} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.eventTypes.includes(eventType)}
                onChange={(e) => handleEventTypeChange(eventType, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{eventType}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {impactTags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.tags.includes(tag)}
                onChange={(e) => handleTagChange(tag, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Add Event Button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add Event
        </button>
        
        {showAddEvent && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-2">
              Event management coming soon. For now, edit the JSON file directly.
            </p>
            <button
              onClick={() => setShowAddEvent(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          <div>Total events: {events.length}</div>
          <div>Direct: {events.filter(e => e.direct).length}</div>
          <div>Indirect: {events.filter(e => !e.direct).length}</div>
        </div>
      </div>
    </div>
  );
}
