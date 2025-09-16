'use client';

import { useState } from 'react';
import { MarketEvent } from '@/lib/events';
import AuctionScenario from './AuctionScenario';
import TechStocksScenario from './TechStocksScenario';
import TariffScenario from './TariffScenario';
import FOMCScenario from './FOMCScenario';
import ActionInsight from './ActionInsight';
import ToneBadge from '../ToneBadge';
import { computeToneInfo, generateActionInsight } from '@/lib/toneUtils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  sector: string;
  event: MarketEvent | null;
  activeTag?: string;
};

export default function ContextModal({ isOpen, onClose, sector, event, activeTag }: Props) {
  const [selectedTag, setSelectedTag] = useState(activeTag || '');
  
  if (!isOpen) return null;

  // Compute tone info and action insight
  const toneInfo = event ? computeToneInfo(event) : null;
  const actionInsight = event ? generateActionInsight(event) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* card */}
      <div className="relative z-10 w-[min(900px,92vw)] max-h-[86vh] overflow-auto bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sector === "Bonds" 
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : sector === "Tech"
                    ? "bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    : sector === "Tariff"
                    ? "bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
                    : sector === "Macro"
                    ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                }`}>
                  {sector}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {event?.title} • {event?.dateISO ? new Date(event.dateISO).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-') : ''}
                </h3>
              </div>
              {toneInfo && <ToneBadge toneInfo={toneInfo} />}
            </div>
            <button
              onClick={onClose}
              className="rounded-full px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
          </div>
          
          {/* Tag toggle bar */}
          {event?.tags && event.tags.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(event.tags)).map((tag, index) => {
                const isDirect = ["Bonds", "Rates", "USD", "Energy", "Materials"].includes(tag);
                const isActive = selectedTag === tag;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      isActive
                        ? isDirect
                          ? 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                          : 'bg-gray-200 border-2 border-black text-black dark:bg-gray-700 dark:border-gray-400 dark:text-gray-200'
                        : isDirect
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-150'
                        : 'bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-150'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
          
          {/* Show only active tag if single tag or tag toggle is used */}
          {event?.tags && event.tags.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(event.tags)).map((tag, index) => {
                const isDirect = ["Bonds", "Rates", "USD", "Energy", "Materials"].includes(tag);
                return (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDirect
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                        : 'bg-gray-100 border border-black text-black dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Insight Section */}
        {actionInsight && <ActionInsight insight={actionInsight} />}

        {/* Content based on event type */}
        {event?.type === "Treasury Auction" ? (
          sector === "Tech" ? (
            <TechStocksScenario date={event.dateISO} activeTag={selectedTag} />
          ) : (
            <AuctionScenario date={event.dateISO} activeTag={selectedTag} />
          )
        ) : event?.type === "Tariff" ? (
          <TariffScenario 
            date={event.dateISO} 
            cardType={event.id === "evt_tariff_sep14_2025" ? "china-tariffs" :
                      event.id === "evt_tariff_oct15_2025" ? "trade-tensions" :
                      event.id === "evt_supreme_court_hearing_nov2025" ? "supreme-court" : "china-tariffs"}
            activeTag={selectedTag}
          />
        ) : event?.type === "FOMC" ? (
          <FOMCScenario date={event.dateISO} event={event} activeTag={selectedTag} />
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-400">
            Select an event to see historical market reactions here.
          </div>
        )}

        {/* Compliance Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Educational—historical tendencies only. This is not investment advice.
          </p>
        </div>
      </div>
    </div>
  );
}
