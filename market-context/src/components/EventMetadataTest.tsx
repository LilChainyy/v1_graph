'use client'

import { useState } from 'react'
import { useEventMetadata } from '@/hooks/useEventMetadata'

export default function EventMetadataTest() {
  const [eventId, setEventId] = useState('nvda_2025-11-19_earnings')
  const [newTags, setNewTags] = useState('Tech,AI,Semis')
  const { metadata, loading, error, updateTags, updateSocialData } = useEventMetadata(eventId)

  const handleUpdateTags = async () => {
    const tags = newTags.split(',').map(tag => tag.trim()).filter(Boolean)
    await updateTags(tags)
  }

  const handleUpdateSocialData = async () => {
    const socialData = {
      vote_counts: { yes: 20, no: 5, unsure: 3 },
      comments_count: 12,
      bookmarks_count: 15,
      last_updated: new Date().toISOString()
    }
    await updateSocialData(socialData)
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Event Metadata Test</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Event ID:
        </label>
        <input
          type="text"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter event ID (e.g., nvda_2025-11-19_earnings)"
        />
      </div>

      {loading && <div className="text-blue-600">Loading metadata...</div>}
      
      {error && <div className="text-red-600">Error: {error}</div>}

      {metadata && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Metadata:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="mb-2">
              <strong>Event ID:</strong> {metadata.event_id}
            </div>
            <div className="mb-2">
              <strong>Tags:</strong> {metadata.tags.join(', ')}
            </div>
            <div className="mb-2">
              <strong>Social Data:</strong>
              <pre className="text-sm bg-white p-2 rounded mt-1">
                {JSON.stringify(metadata.social_data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {!metadata && !loading && (
        <div className="mb-6 text-gray-600">
          No metadata found for this event. You can create some below.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Update Tags (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Tech,AI,Semis"
            />
            <button
              onClick={handleUpdateTags}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Tags
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={handleUpdateSocialData}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update Social Data
          </button>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Test Event IDs:</strong></p>
        <ul className="list-disc list-inside mt-1">
          <li>nvda_2025-11-19_earnings</li>
          <li>nvda_2025-11-26_sec_filings</li>
          <li>hood_2025-11-07_earnings</li>
          <li>global_2025-11-01_macro_jobs</li>
        </ul>
      </div>
    </div>
  )
}
