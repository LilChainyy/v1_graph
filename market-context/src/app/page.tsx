'use client';

import { useState } from 'react';
import { events } from '@/data/events';
import EventCard from '@/components/EventCard';
import CalendarView from '@/components/Calendar/CalendarView';
import ContextModal from '@/components/feed/ContextModal';
import { MarketEvent } from '@/lib/events';

export default function Home() {
  const [view, setView] = useState<'calendar' | 'feed'>('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);

  // Handle tag clicks
  const handleTagClick = (tag: string, event: MarketEvent) => {
    setSelectedSector(tag);
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* View Toggle */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setView('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('feed')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'feed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Feed
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'calendar' ? (
          <CalendarView events={events} />
        ) : (
          <>
            {/* Feed Grid */}
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No events found</div>
                <p className="text-gray-400 mt-2">Check back later for upcoming market events</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>


      {/* ContextModal */}
      <ContextModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sector={selectedSector}
        event={selectedEvent}
      />
    </div>
  );
}