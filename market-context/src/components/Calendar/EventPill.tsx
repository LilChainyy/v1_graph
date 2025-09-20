'use client';

import { MarketEvent } from '@/lib/events';
import { formatDateForAria } from '@/utils/date';
import TagChip from '../TagChip';

interface EventPillProps {
  event: MarketEvent;
  onHover: (event: MarketEvent, position: { x: number; y: number }) => void;
  onLeave: () => void;
  onFocus: (event: MarketEvent, position: { x: number; y: number }) => void;
  onBlur: () => void;
  getEventTags: (eventId: string) => string[];
}

export default function EventPill({ event, onHover, onLeave, onFocus, onBlur, getEventTags }: EventPillProps) {
  const getTagText = (category: string) => {
    switch (category) {
      case 'policy':
        return 'Tariff';
      case 'monetary':
        return 'Treasury Auction';
      default:
        return 'Event';
    }
  };

  const getPillClasses = (type: string) => {
    switch (type) {
      case 'Tariff':
        return 'bg-blue-100 text-blue-800'; // Tariff: #DBEAFE text #1D4ED8
      case 'Treasury Auction':
        return 'bg-purple-100 text-purple-800'; // Treasury Auction: #EDE9FE text #6D28D9
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const eventDate = new Date(event.dateISO);
  const ariaLabel = `${event.type} — ${formatDateForAria(eventDate)}. Show details.`;
  
  // Get tags for this event
  const tags = getEventTags(event.id);
  const displayTags = tags.slice(0, 2); // Show max 2 tags in calendar
  const hasMoreTags = tags.length > 2;

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };
    onHover(event, position);
  };

  const handleMouseLeave = () => {
    onLeave();
  };

  const handleFocus = (e: React.FocusEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };
    onFocus(event, position);
  };

  const handleBlur = () => {
    onBlur();
  };

  // Mobile touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.top
    };
    onHover(event, position);
  };

  return (
    <div className="w-full">
      <button
        className={`text-xs font-medium rounded-full px-2 py-0.5 w-full text-left hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${getPillClasses(event.type)}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onTouchStart={handleTouchStart}
        aria-label={ariaLabel}
      >
        {event.type}
      </button>
      
      {/* Tags */}
      {displayTags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {displayTags.map((tag, index) => (
            <TagChip
              key={`${event.id}-${tag}-${index}`}
              tag={tag}
              size="sm"
              variant="outline"
            />
          ))}
          {hasMoreTags && (
            <span className="text-xs text-gray-500 px-1">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
