'use client';

import { DatabaseEvent, CompanyTicker } from '@/types/company';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: DatabaseEvent;
  ticker: CompanyTicker;
}

export default function CompanyModal({ isOpen, onClose, event, ticker }: CompanyModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Invalid Date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.warn('Invalid date string:', dateString, error);
      return 'Invalid Date';
    }
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
                  {formatDate(event.start)}
                  {event.end && ` - ${formatDate(event.end)}`}
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
            {/* Event Category and Direct/Indirect */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                event.category === 'EARNINGS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                event.category === 'SEC_FILINGS' ? 'bg-green-100 text-green-700 border-green-200' :
                event.category.startsWith('MACRO_') ? 'bg-red-100 text-red-700 border-red-200' :
                event.category === 'REGULATORY' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {event.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                event.tickerId !== null 
                  ? 'bg-purple-100 text-purple-700 border-purple-200' 
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {event.tickerId !== null ? 'Direct' : 'Indirect'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {event.source}
              </span>
            </div>

            {/* Event Details */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Event Details</h4>
              <div className="text-sm text-gray-600">
                <p><strong>Category:</strong> {event.category}</p>
                <p><strong>Source:</strong> {event.source}</p>
                <p><strong>Timezone:</strong> {event.timezone}</p>
                {event.externalId && <p><strong>External ID:</strong> {event.externalId}</p>}
              </div>
            </div>

            {/* Notes */}
            {event.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{event.notes}</p>
              </div>
            )}

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Related Links</h4>
                <div className="space-y-2">
                  {event.links.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Event Impact */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Event Impact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-green-800 mb-1">Positive Scenario</h5>
                  <p className="text-xs text-green-700">
                    {event.category === 'EARNINGS' ? 'Beat expectations' : 
                     event.category === 'MACRO_FOMC' ? 'Dovish stance' : 'Favorable outcome'}
                  </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h5 className="text-sm font-medium text-red-800 mb-1">Negative Scenario</h5>
                  <p className="text-xs text-red-700">
                    {event.category === 'EARNINGS' ? 'Miss expectations' : 
                     event.category === 'MACRO_FOMC' ? 'Hawkish stance' : 'Unfavorable outcome'}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Effects */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Event Effects</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-sm text-gray-700">
                    <strong>Direct effects:</strong> {event.tickerId !== null ? 'This event directly impacts ' + ticker : 'No direct effects'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                  <span className="text-sm text-gray-700">
                    <strong>Indirect effects:</strong> {event.tickerId === null ? 'Market-wide spillover effects' : 'Limited indirect effects'}
                  </span>
                </div>
              </div>
            </div>
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
