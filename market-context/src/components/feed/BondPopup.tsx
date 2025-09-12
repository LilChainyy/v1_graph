import React from "react";
import { MarketEvent } from "@/lib/events";
import ScenarioBox from "./AuctionScenario";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: MarketEvent | null;
};

export default function BondPopup({ isOpen, onClose, event }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* card */}
      <div className="relative z-10 w-[min(900px,92vw)] max-h-[86vh] overflow-auto bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Bonds
            </span>
            <h3 className="text-xl font-semibold">Bonds</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm border hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {/* If it's a Treasury Auction, render scenarios here */}
        {event?.type === "Treasury Auction" ? (
          <ScenarioBox event={event} />
        ) : (
          <div className="rounded-xl border p-4 text-sm text-gray-600">
            Select a Treasury auction to see demand scenarios here.
          </div>
        )}
      </div>
    </div>
  );
}
