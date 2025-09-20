'use client'

import { useState } from 'react'
import { useEventTags } from '@/hooks/useEventTags'

export default function EventTagsTest() {
  const [eventId, setEventId] = useState('nvda_2025-11-19_earnings')
  const [tickerId, setTickerId] = useState('NVDA')
  const [newTag, setNewTag] = useState('')
  const [newTagsInput, setNewTagsInput] = useState('Tech,AI,Semis')
  const { tags, record, loading, error, addTag, removeTag, updateTags } = useEventTags(eventId, tickerId)

  const handleAddTag = async () => {
    if (newTag.trim()) {
      await addTag(newTag.trim())
      setNewTag('')
    }
  }

  const handleUpdateTags = async () => {
    const tagsArray = newTagsInput.split(',').map(tag => tag.trim()).filter(Boolean)
    await updateTags(tagsArray)
  }

  const handleRemoveTag = async (tag: string) => {
    await removeTag(tag)
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Event Tags Test</h2>
      
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">
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
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Ticker ID (optional):
          </label>
          <input
            type="text"
            value={tickerId}
            onChange={(e) => setTickerId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter ticker symbol (e.g., NVDA)"
          />
        </div>
      </div>

      {loading && <div className="text-blue-600">Loading tags...</div>}
      
      {error && <div className="text-red-600">Error: {error}</div>}

      {record && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Tags Record:</h3>
          <div className="bg-gray-50 p-4 rounded">
            <div className="mb-2">
              <strong>Event ID:</strong> {record.event_id}
            </div>
            <div className="mb-2">
              <strong>Ticker ID:</strong> {record.ticker_id || 'None'}
            </div>
            <div className="mb-2">
              <strong>Tags:</strong> {tags.length > 0 ? tags.join(', ') : 'No tags'}
            </div>
            <div className="mb-2">
              <strong>Created:</strong> {record.created_at ? new Date(record.created_at).toLocaleString() : 'Unknown'}
            </div>
            <div>
              <strong>Updated:</strong> {record.updated_at ? new Date(record.updated_at).toLocaleString() : 'Unknown'}
            </div>
          </div>
        </div>
      )}

      {!record && !loading && (
        <div className="mb-6 text-gray-600">
          No tags found for this event. You can create some below.
        </div>
      )}

      <div className="space-y-4">
        {/* Add single tag */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Add Single Tag:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter a tag"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Update all tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Update All Tags (comma-separated):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTagsInput}
              onChange={(e) => setNewTagsInput(e.target.value)}
              className="flex-1 p-2 border rounded"
              placeholder="Tech,AI,Semis"
            />
            <button
              onClick={handleUpdateTags}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Update Tags
            </button>
          </div>
        </div>

        {/* Current tags with remove buttons */}
        {tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Tags:
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800 ml-1"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Test Event IDs:</strong></p>
        <ul className="list-disc list-inside mt-1">
          <li>nvda_2025-11-19_earnings</li>
          <li>nvda_2025-11-26_sec_filings</li>
          <li>hood_2025-11-07_earnings</li>
          <li>global_2025-11-01_macro_jobs</li>
          <li>global_2025-09-17_fomc</li>
          <li>global_2025-09-11_treasury_auction</li>
        </ul>
      </div>
    </div>
  )
}
