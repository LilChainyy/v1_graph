'use client';

import { useState } from 'react';
import TagChip from '@/components/TagChip';
import TagFilter from '@/components/TagFilter';

// Mock events with tags for testing
const mockEvents = [
  {
    id: 'test-1',
    title: 'HOOD Q4 Earnings',
    date: '2025-01-15',
    category: 'Earnings',
    tags: ['EARNINGS', 'HOOD', 'Q4']
  },
  {
    id: 'test-2', 
    title: 'FOMC Meeting',
    date: '2025-01-25',
    category: 'Macro',
    tags: ['MACRO_FOMC', 'FEDERAL_RESERVE']
  },
  {
    id: 'test-3',
    title: 'HOOD Product Launch',
    date: '2025-02-01',
    category: 'Product',
    tags: ['PRODUCT_LAUNCH', 'HOOD', 'INNOVATION']
  },
  {
    id: 'test-4',
    title: 'CPI Release',
    date: '2025-02-10',
    category: 'Macro',
    tags: ['MACRO_CPI', 'INFLATION']
  }
];

export default function TestTagsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredEvents = selectedTag 
    ? mockEvents.filter(event => event.tags.includes(selectedTag))
    : mockEvents;

  const allTags = Array.from(new Set(mockEvents.flatMap(event => event.tags)));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tag System Test Page
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tag Filter Test</h2>
          
          {/* Custom Tag Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tag:
            </label>
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-600">
            <strong>Selected Tag:</strong> {selectedTag || 'None (showing all events)'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Events ({filteredEvents.length} of {mockEvents.length})
          </h2>
          
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="text-sm text-gray-500 mb-3">
                      {event.date} • {event.category}
                    </div>
                    
                    {/* Tag Chips */}
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map(tag => (
                        <TagChip
                          key={`${event.id}-${tag}`}
                          tag={tag}
                          size="sm"
                          variant="outline"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Test Instructions
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use the dropdown to filter events by tag</li>
            <li>• Notice how events show/hide based on selected tag</li>
            <li>• Tag chips are displayed below each event title</li>
            <li>• This demonstrates the tag filtering functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
