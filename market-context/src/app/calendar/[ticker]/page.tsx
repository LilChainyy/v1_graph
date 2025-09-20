'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { DatabaseEvent, CompanyTicker } from '@/types/company';
import CompanyHeader from '@/components/CompanyHeader';
import CalendarView from '@/components/CompanyCalendar/CalendarView';
import ListView from '@/components/CompanyCalendar/ListView';
import CompanyModal from '@/components/CompanyModal';
import RecentlyAddedEvents from '@/components/RecentlyAddedEvents';
import EventTypesList from '@/components/EventTypesList';
import TagFilter from '@/components/TagFilter';
import { getEventTagsBatch } from '@/lib/eventTags';

type ViewMode = 'month' | 'week' | 'list';

export default function CompanyCalendarPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const ticker = (params.ticker as string)?.toUpperCase() as CompanyTicker || 'NVDA';
  
  const [events, setEvents] = useState<DatabaseEvent[]>([]);
  const [eventsWithTags, setEventsWithTags] = useState<DatabaseEvent[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<DatabaseEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Load events and tags on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`/api/events?ticker=${ticker}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const loadedEvents = await response.json();
        setEvents(loadedEvents);
        
        // Load tags for events
        const eventIds = loadedEvents.map((event: DatabaseEvent) => event.id);
        const eventTags = await getEventTagsBatch(eventIds);
        
        // Merge tags into events
        const eventsWithTagsData = loadedEvents.map((event: DatabaseEvent) => ({
          ...event,
          tags: eventTags[event.id] || []
        }));
        
        setEventsWithTags(eventsWithTagsData);
      } catch (error) {
        console.warn('Failed to load company events:', error);
        setEventsWithTags(events);
      }
    };

    loadEvents();
  }, [ticker]);

  // Handle URL tag parameter
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    setSelectedTag(tagParam);
  }, [searchParams]);

  // Filter events based on selected tag
  const filteredEvents = selectedTag 
    ? eventsWithTags.filter(event => event.tags?.includes(selectedTag))
    : eventsWithTags;

  const handleEventClick = (event: DatabaseEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    
    // Update URL with tag parameter
    const url = new URL(window.location.href);
    if (tag) {
      url.searchParams.set('tag', tag);
    } else {
      url.searchParams.delete('tag');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Company Header */}
        <CompanyHeader 
          ticker={ticker}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Tag Filter */}
        <div className="mt-4 mb-6">
          <TagFilter
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            className="max-w-xs"
          />
        </div>

        {/* Calendar Content - Full Width */}
        <div className="mt-6">
          {viewMode === 'month' && (
            <CalendarView
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === 'week' && (
            <CalendarView
              events={filteredEvents}
              onEventClick={handleEventClick}
              viewMode="week"
            />
          )}
          {viewMode === 'list' && (
            <ListView
              events={filteredEvents}
              onEventClick={handleEventClick}
            />
          )}
        </div>

        {/* Event Types List */}
        <EventTypesList ticker={ticker} />

        {/* Recently Added Events */}
        <RecentlyAddedEvents ticker={ticker} />
      </div>

      {/* Company Modal */}
      {selectedEvent && (
        <CompanyModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
          ticker={ticker}
        />
      )}
    </div>
  );
}
