'use client';

import { useState, useMemo, useEffect } from 'react';
import { MarketEvent } from '@/lib/events';
import { getCalendarDays, isSameDay, getToday } from '@/utils/date';
import DayCell from './DayCell';
import Tooltip from './Tooltip';
import TagFilter from '../TagFilter';
import { useCalendarTags } from '@/hooks/useCalendarTags';

interface CalendarViewProps {
  events: MarketEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const calendarDays = useMemo(() => getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth]);

  // Get visible event IDs for the current month
  const visibleEventIds = useMemo(() => {
    const eventIds: string[] = [];
    const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    events.forEach(event => {
      const eventDate = new Date(event.dateISO);
      if (eventDate >= startDate && eventDate <= endDate) {
        eventIds.push(event.id);
      }
    });
    
    return eventIds;
  }, [events, currentMonth]);

  // Use the calendar tags hook
  const { filteredEventIds, getEventTags } = useCalendarTags({
    eventIds: visibleEventIds,
    selectedTag
  });

  // Detect touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // Handle mobile touch dismissal
  useEffect(() => {
    if (!isTouchDevice || !selectedEvent) return;

    const handleTouchStart = (e: TouchEvent) => {
      // If touching outside the tooltip, dismiss it
      const target = e.target as Element;
      if (!target.closest('[data-tooltip]') && !target.closest('button[aria-label*="Show details"]')) {
        setSelectedEvent(null);
        setTooltipPosition(null);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, [isTouchDevice, selectedEvent]);

  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: MarketEvent[] } = {};
    
    // Only include events that are in the filtered list
    const filteredEvents = events.filter(event => filteredEventIds.includes(event.id));
    
    filteredEvents.forEach(event => {
      const eventDate = new Date(event.dateISO);
      const dateKey = eventDate.toISOString().split('T')[0];
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [events, filteredEventIds]);

  const getEventsForDate = (date: Date): MarketEvent[] => {
    const dateKey = date.toISOString().split('T')[0];
    return eventsByDate[dateKey] || [];
  };

  const handleEventHover = (event: MarketEvent, position: { x: number; y: number }) => {
    setSelectedEvent(event);
    setTooltipPosition(position);
  };

  const handleEventLeave = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const handleEventFocus = (event: MarketEvent, position: { x: number; y: number }) => {
    setSelectedEvent(event);
    setTooltipPosition(position);
  };

  const handleEventBlur = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const handleCloseTooltip = () => {
    setSelectedEvent(null);
    setTooltipPosition(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-md"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tag Filter */}
      <div className="mb-4">
        <TagFilter
          selectedTag={selectedTag}
          onTagSelect={setSelectedTag}
          className="max-w-xs"
        />
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => (
            <DayCell
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              date={date}
              events={getEventsForDate(date)}
              onEventHover={handleEventHover}
              onEventLeave={handleEventLeave}
              onEventFocus={handleEventFocus}
              onEventBlur={handleEventBlur}
              getEventTags={getEventTags}
            />
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <Tooltip
        event={selectedEvent}
        position={tooltipPosition}
        onClose={handleCloseTooltip}
      />
    </div>
  );
}
