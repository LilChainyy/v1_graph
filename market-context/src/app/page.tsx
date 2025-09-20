'use client';

import { useState, useEffect } from 'react';
import { events } from '@/data/events';
import EventCard from '@/components/EventCard';
import CalendarView from '@/components/Calendar/CalendarView';
import ContextModal from '../components/feed/ContextModal';
import WeeklyBanner from '@/components/WeeklyBanner';
import SceneSetter from '@/components/SceneSetter';
import EventMetadataTest from '@/components/EventMetadataTest';
import EventTagsTest from '@/components/EventTagsTest';
import { MarketEvent, BannerData, getSceneData, SceneData } from '@/lib/events';
import { getEventTagsBatch } from '@/lib/eventTags';

export default function Home() {
  const [view, setView] = useState<'calendar' | 'feed' | 'test'>('calendar');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);
  const [activeTag, setActiveTag] = useState<string>('');
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [eventsWithTags, setEventsWithTags] = useState<MarketEvent[]>(events);

  // Sample banner data - in a real app this would come from an API
  const bannerData: BannerData = {
    spxWtdPct: 1.25, // S&P 500 up 1.25% week to date
    upcomingEvents: [
      { title: "10-yr Treasury auction", date: "Sep 11" },
      { title: "China tariff decision", date: "Sep 14" },
      { title: "FOMC decision", date: "Sep 17" }
    ]
  };

  // Load scene data on component mount
  useEffect(() => {
    const loadSceneData = async () => {
      try {
        const data = await getSceneData();
        setSceneData(data);
      } catch (error) {
        console.warn('Failed to load scene data:', error);
        // Fallback to default data
        setSceneData({
          marketTrend: 'flat',
          sentiment: 'neutral',
          rates: 'steady',
          fear: 'normal',
          nextEvent: {
            type: 'CPI',
            weekday: 'Thu',
            why: 'checks price pressures'
          },
          sources: [],
          attribution: 'auto summary (defaults)'
        });
      }
    };

    loadSceneData();
  }, []);

  // Load tags for all events
  useEffect(() => {
    const loadEventTags = async () => {
      try {
        const eventIds = events.map(event => event.id);
        const eventTags = await getEventTagsBatch(eventIds);
        
        // Merge tags into events
        const eventsWithTagsData = events.map(event => ({
          ...event,
          tags: eventTags[event.id] || event.tags || []
        }));
        
        setEventsWithTags(eventsWithTagsData);
      } catch (error) {
        console.warn('Failed to load event tags:', error);
        // Keep original events if tags fail to load
        setEventsWithTags(events);
      }
    };

    loadEventTags();
  }, []);

  // Handle bond clicks
  const handleOpenBonds = (event: MarketEvent, tag: string) => {
    setSelectedSector("Bonds");
    setSelectedEvent(event);
    setActiveTag(tag);
    setModalOpen(true);
  };

  // Handle tech clicks
  const handleOpenTech = (event: MarketEvent, tag: string) => {
    setSelectedSector("Tech");
    setSelectedEvent(event);
    setActiveTag(tag);
    setModalOpen(true);
  };

  // Handle tariff clicks
  const handleOpenTariff = (event: MarketEvent, tag: string) => {
    setSelectedSector("Tariff");
    setSelectedEvent(event);
    setActiveTag(tag);
    setModalOpen(true);
  };

  // Handle FOMC clicks
  const handleOpenFOMC = (event: MarketEvent, tag: string) => {
    setSelectedSector("Macro");
    setSelectedEvent(event);
    setActiveTag(tag);
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
            <button
              onClick={() => setView('test')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                view === 'test'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Test Tags
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'calendar' ? (
          <>
            {/* Scene Setter Banner */}
            {sceneData && <SceneSetter data={sceneData} />}
            
            {/* Calendar View */}
            <CalendarView events={eventsWithTags} />
          </>
        ) : view === 'test' ? (
          <>
            {/* Event Tags Test */}
            <EventTagsTest />
          </>
        ) : (
          <>
            {/* Scene Setter Banner */}
            {sceneData && <SceneSetter data={sceneData} />}
            
            {/* Weekly Banner */}
            <WeeklyBanner bannerData={bannerData} />
            
            {/* Feed Grid */}
            {eventsWithTags.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No events found</div>
                <p className="text-gray-400 mt-2">Check back later for upcoming market events</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {eventsWithTags.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onOpenBonds={handleOpenBonds}
                    onOpenTech={handleOpenTech}
                    onOpenTariff={handleOpenTariff}
                    onOpenFOMC={handleOpenFOMC}
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
        activeTag={activeTag}
      />
    </div>
  );
}