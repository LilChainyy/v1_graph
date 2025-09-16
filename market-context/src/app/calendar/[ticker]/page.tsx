'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CompanyEvent, CompanyTicker } from '@/types/company';
import { loadCompanyEvents } from '@/lib/companyLoader';
import CompanyHeader from '@/components/CompanyHeader';
import CalendarView from '@/components/CompanyCalendar/CalendarView';
import ListView from '@/components/CompanyCalendar/ListView';
import CompanyModal from '@/components/CompanyModal';
import RecentlyAddedEvents from '@/components/RecentlyAddedEvents';

type ViewMode = 'month' | 'week' | 'list';

export default function CompanyCalendarPage() {
  const params = useParams();
  const ticker = (params.ticker as string)?.toUpperCase() as CompanyTicker || 'NVDA';
  
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedEvent, setSelectedEvent] = useState<CompanyEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load events on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const loadedEvents = await loadCompanyEvents(ticker);
        setEvents(loadedEvents);
      } catch (error) {
        console.warn('Failed to load company events:', error);
      }
    };

    loadEvents();
  }, [ticker]);

  const handleEventClick = (event: CompanyEvent) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
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

        {/* Calendar Content - Full Width */}
        <div className="mt-6">
          {viewMode === 'month' && (
            <CalendarView
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {viewMode === 'week' && (
            <CalendarView
              events={events}
              onEventClick={handleEventClick}
              viewMode="week"
            />
          )}
          {viewMode === 'list' && (
            <ListView
              events={events}
              onEventClick={handleEventClick}
            />
          )}
        </div>

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
