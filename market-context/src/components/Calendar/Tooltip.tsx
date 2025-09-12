'use client';

import { MarketEvent } from '@/lib/events';
import { useEffect, useRef } from 'react';

interface TooltipProps {
  event: MarketEvent | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export default function Tooltip({ event, position, onClose }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (event) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [event, onClose]);

  if (!event || !position) return null;

  const eventDate = new Date(event.dateISO);

  return (
    <div
      ref={tooltipRef}
      data-tooltip
      className="fixed z-50 p-6 bg-white rounded-lg border border-gray-200 shadow-lg max-w-sm"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)'
      }}
      role="dialog"
      aria-modal="false"
      aria-label={`${event.type} event details`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {event.type}
        </span>
        <div className="text-sm text-gray-500">
          {eventDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {event.title}
      </h3>
      
      <div className="flex flex-wrap gap-1">
        {event.tags.map((tag, index) => (
          <span 
            key={index}
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
