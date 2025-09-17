'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { DatabaseEvent } from '@/types/company';

interface CalendarViewProps {
  events: DatabaseEvent[];
  onEventClick: (event: DatabaseEvent) => void;
  viewMode?: 'month' | 'week';
}

// Safe date parsing utility
const parseEventDate = (dateString: string | undefined): Date | null => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  try {
    // Handle both YYYY-MM-DD and ISO string formats
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date;
  } catch (error) {
    console.warn('Invalid date string:', dateString, error);
    return null;
  }
};

// Safe date key generation
const getDateKey = (date: Date): string => {
  try {
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Error generating date key:', error);
    return '';
  }
};

// Timezone-aware today detection
const getToday = (): Date => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return new Date();
  }
  
  const now = new Date();
  // Normalize to start of day in local timezone
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Check if a date is today (normalized to start of day)
const isToday = (date: Date): boolean => {
  const today = getToday();
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
};

// Get current time for "now" line in week/day views
const getCurrentTime = (): Date | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return new Date();
};

// Calculate milliseconds until next midnight
const getMsUntilMidnight = (): number => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
};

export default function CalendarView({ events, onEventClick, viewMode = 'month' }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [today, setToday] = useState<Date>(getToday());
  const [currentTime, setCurrentTime] = useState<Date | null>(getCurrentTime());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-update timer for midnight transitions
  useEffect(() => {
    const updateToday = () => {
      setToday(getToday());
      setCurrentTime(getCurrentTime());
    };

    const scheduleMidnightUpdate = () => {
      // Clear existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const msUntilMidnight = getMsUntilMidnight();
      
      // Set timer for next midnight
      timerRef.current = setTimeout(() => {
        updateToday();
        // After first midnight update, switch to 24h interval
        intervalRef.current = setInterval(updateToday, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
    };

    // Initial setup
    scheduleMidnightUpdate();

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    
    return days;
  }, [currentDate]);

  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: DatabaseEvent[] } = {};
    
    events.forEach(event => {
      // Use the start field from DatabaseEvent, with fallback to date for backward compatibility
      const dateString = event.start || (event as any).date;
      const eventDate = parseEventDate(dateString);
      
      if (!eventDate) {
        console.warn('Skipping event with invalid date:', event.title, dateString);
        return;
      }
      
      const dateKey = getDateKey(eventDate);
      
      if (!dateKey) {
        console.warn('Skipping event with invalid date key:', event.title);
        return;
      }
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [events]);

  const getEventsForDate = (date: Date): DatabaseEvent[] => {
    const dateKey = getDateKey(date);
    return eventsByDate[dateKey] || [];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Render current time line for week/day views
  const renderCurrentTimeLine = () => {
    if (viewMode === 'month' || !currentTime) return null;

    const now = currentTime;
    const hour = now.getHours();
    const minute = now.getMinutes();
    const topPosition = (hour * 60 + minute) * (120 / (24 * 60)); // Assuming 120px per day height

    return (
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ top: `${topPosition}px` }}
      >
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full -ml-1"></div>
          <div className="flex-1 h-0.5 bg-red-500"></div>
        </div>
      </div>
    );
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
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

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 relative">
        {/* Day Headers */}
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(date);
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b border-gray-200 relative ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${
                isTodayDate 
                  ? 'bg-blue-50 ring-2 ring-blue-500 ring-inset shadow-lg' 
                  : ''
              }`}
              aria-current={isTodayDate ? 'date' : undefined}
            >
              <div className={`text-sm font-medium mb-2 ${
                isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              } ${isTodayDate ? 'text-blue-600 font-bold' : ''}`}>
                {date.getDate()}
                {isTodayDate && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                    Today
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event, eventIndex) => {
                  // Determine if event is direct (ticker-specific) or indirect (global)
                  const isDirect = event.tickerId !== null;
                  
                  return (
                    <button
                      key={eventIndex}
                      onClick={() => onEventClick(event)}
                      className={`w-full text-left px-2 py-1 rounded text-xs font-medium border transition-colors hover:shadow-sm ${
                        isDirect 
                          ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200' 
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                      title={`${event.category} • ${event.title}`}
                    >
                      <div className="truncate">{event.title}</div>
                      <div className="text-xs opacity-75">{event.category}</div>
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Current Time Line for Week/Day Views */}
        {renderCurrentTimeLine()}
      </div>
    </div>
  );
}
