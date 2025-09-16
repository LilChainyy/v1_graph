'use client';

import { CompanyEvent, CompanyTicker } from '@/types/company';
import { getDirectPillStyle, getEventTypeColor } from '@/lib/companyLoader';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CompanyEvent;
  ticker: CompanyTicker;
}

export default function CompanyModal({ isOpen, onClose, event, ticker }: CompanyModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatHistoryWindow = (window: string) => {
    switch (window) {
      case 'intraday': return 'Same day';
      case '24h': return 'Next 24 hours';
      case 'week': return 'Next week';
      default: return window;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(event.date)}
                  {event.time && ` • ${event.time}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Event Type and Direct/Indirect */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEventTypeColor(event.eventType)}`}>
                {event.eventType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDirectPillStyle(event.direct)}`}>
                {event.direct ? 'Direct' : 'Indirect'}
              </span>
              {event.isBinary && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
                  Binary Event
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Impact Areas</h4>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{event.notes}</p>
              </div>
            )}

            {/* Historical Tendency */}
            {event.history && (
              <div className="mb-4">
                <h4 className="text-sm font-bold text-black mb-2">
                  Last time this happened (historical tendency)
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Window:</span>
                      <span className="ml-2 font-medium">{formatHistoryWindow(event.history.window)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sample Size:</span>
                      <span className="ml-2 font-medium">N={event.history.sampleSize}</span>
                    </div>
                    {event.history.medianPct && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Median Change:</span>
                        <span className={`ml-2 font-medium ${
                          event.history.medianPct > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {event.history.medianPct > 0 ? '+' : ''}{event.history.medianPct}%
                        </span>
                        {event.history.medianDollar && (
                          <span className="ml-2 text-gray-500">
                            (~{event.history.medianDollar > 0 ? '+' : ''}${event.history.medianDollar.toFixed(2)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Scenarios or Effects */}
            {event.isBinary ? (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Scenarios</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-green-800 mb-1">Scenario A (Positive)</h5>
                    <p className="text-xs text-green-700">
                      {event.eventType === 'Earnings' ? 'Beat expectations' : 
                       event.eventType === 'FOMC' ? 'Dovish stance' : 'Favorable outcome'}
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-red-800 mb-1">Scenario B (Negative)</h5>
                    <p className="text-xs text-red-700">
                      {event.eventType === 'Earnings' ? 'Miss expectations' : 
                       event.eventType === 'FOMC' ? 'Hawkish stance' : 'Unfavorable outcome'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Effects</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">
                      <strong>Direct effects:</strong> {event.direct ? 'This event directly impacts ' + ticker : 'No direct effects'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">
                      <strong>Indirect effects:</strong> {!event.direct ? 'Market-wide spillover effects' : 'Limited indirect effects'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sources</h4>
                <div className="space-y-1">
                  {event.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline block"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Educational—historical tendencies only. This is not investment advice.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
