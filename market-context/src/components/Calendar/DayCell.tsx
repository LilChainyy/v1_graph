'use client';

import { MarketEvent } from '@/lib/events';
import { isSameDay, isBefore, isWithinNext7, getToday } from '@/utils/date';
import EventPill from './EventPill';

interface DayCellProps {
  date: Date;
  events: MarketEvent[];
  onEventHover: (event: MarketEvent, position: { x: number; y: number }) => void;
  onEventLeave: () => void;
  onEventFocus: (event: MarketEvent, position: { x: number; y: number }) => void;
  onEventBlur: () => void;
}

export default function DayCell({ date, events, onEventHover, onEventLeave, onEventFocus, onEventBlur }: DayCellProps) {
  const today = getToday();
  const isPast = isBefore(date, today);
  const isToday = isSameDay(date, today);
  const isNext7 = isWithinNext7(date);
  const isFuture = !isPast && !isToday && !isNext7;

  const getCellClasses = () => {
    if (isPast) {
      return 'bg-gray-100 text-gray-400'; // Past: gray background and muted text
    }
    if (isToday) {
      return 'bg-purple-50 ring-1 ring-purple-300'; // Today: subtle purple highlight
    }
    if (isNext7) {
      return 'bg-white ring-2 ring-gray-500'; // Next 7: white with bolder border
    }
    return 'bg-white ring-1 ring-gray-200'; // Future >7: plain white with hairline border
  };

  const getDayNumberClasses = () => {
    if (isPast) {
      return 'text-sm font-medium text-gray-400';
    }
    return 'text-sm font-medium text-gray-500';
  };

  const handleEventHover = (event: MarketEvent, position: { x: number; y: number }) => {
    onEventHover(event, position);
  };

  const handleEventLeave = () => {
    onEventLeave();
  };

  const handleEventFocus = (event: MarketEvent, position: { x: number; y: number }) => {
    onEventFocus(event, position);
  };

  const handleEventBlur = () => {
    onEventBlur();
  };

  // Show max 3 events, with "+N" for overflow
  const displayEvents = events.slice(0, 3);
  const overflowCount = events.length - 3;

  return (
    <div className={`min-h-[80px] p-2 ${getCellClasses()}`}>
      <div className={`text-right mb-1 ${getDayNumberClasses()}`}>
        {date.getDate()}
      </div>
      
      <div className="space-y-1">
        {displayEvents.map((event, index) => (
          <EventPill
            key={`${event.id}-${index}`}
            event={event}
            onHover={handleEventHover}
            onLeave={handleEventLeave}
            onFocus={handleEventFocus}
            onBlur={handleEventBlur}
          />
        ))}
        
        {overflowCount > 0 && (
          <div className="text-xs text-gray-500 text-center py-0.5">
            +{overflowCount}
          </div>
        )}
      </div>
    </div>
  );
}
