import React from "react";
import { MarketEvent } from '@/lib/events';

type Props = {
  event: MarketEvent;
  onOpenBonds: (event: MarketEvent) => void;
};

export default function EventCard({ event, onOpenBonds }: Props) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{event.type}</span>
        <span className="text-xs text-gray-500">
          {new Date(event.dateISO).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-semibold mb-3">{event.title}</h3>

      <div className="flex flex-wrap gap-2">
        {event.tags.map((tag) => {
          const isBond = tag === "Bonds";
          return (
            <button
              key={tag}
              onClick={() => isBond && onOpenBonds(event)}
              className={[
                "text-xs px-2 py-1 rounded-full border",
                isBond ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-gray-50"
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}