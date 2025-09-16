import React from "react";
import { MarketEvent } from '@/lib/events';

type Props = {
  event: MarketEvent;
  onOpenBonds: (event: MarketEvent, tag: string) => void;
  onOpenTech: (event: MarketEvent, tag: string) => void;
  onOpenTariff: (event: MarketEvent, tag: string) => void;
  onOpenFOMC: (event: MarketEvent, tag: string) => void;
};

export default function EventCard({ event, onOpenBonds, onOpenTech, onOpenTariff, onOpenFOMC }: Props) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">{event.type}</span>
        <span className="text-xs text-gray-500">
          {new Date(event.dateISO).toLocaleDateString()}
        </span>
      </div>

      <h3 className="font-semibold mb-3">{event.title}</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {Array.from(new Set(event.tags)).map((tag) => {
          const isBond = tag === "Bonds";
          const isTech = tag === "Tech";
          const isEnergy = tag === "Energy";
          const isMaterials = tag === "Materials";
          const isFOMC = event.type === "FOMC";
          const isDirectEffect = isBond || isEnergy || isMaterials || tag === "Rates" || tag === "USD"; // Direct effects
          const isIndirectEffect = isTech || tag === "Financials" || tag === "Housing" || tag === "Broad Market"; // Indirect effects
          
          return (
            <button
              key={tag}
              onClick={() => {
                if (isBond) onOpenBonds(event, tag);
                if (isTech) onOpenTech(event, tag);
                if (isEnergy || isMaterials) onOpenTariff(event, tag);
                if (isFOMC) onOpenFOMC(event, tag);
              }}
              className={[
                "text-xs px-2 py-1 rounded-full border",
                isDirectEffect ? "bg-purple-50 border-purple-200 text-purple-700" : 
                isIndirectEffect ? "bg-gray-100 border-black text-black" : "bg-gray-50"
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Legend line */}
      <div className="mb-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
        Stats = historical tendencies • window: next 24h • not a prediction.
      </div>

      {/* Compliance footer */}
      <div className="text-xs text-gray-400 text-center">
        Educational—historical tendencies only. This is not investment advice.
      </div>
    </div>
  );
}