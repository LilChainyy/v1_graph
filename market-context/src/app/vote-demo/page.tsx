'use client'

import { useState } from 'react'
import VoteButtons from '@/components/VoteButtons'
import AuthExample from '@/components/AuthExample'

export default function VoteDemoPage() {
  const [eventId, setEventId] = useState('demo-event-123')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Voting System Demo
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <AuthExample />
          </div>

          {/* Voting Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Event Voting</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event ID:
              </label>
              <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter event ID"
              />
            </div>

            <VoteButtons eventId={eventId} />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            How to Test:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Set up your Supabase project and add the environment variables to <code>.env.local</code></li>
            <li>Run the SQL migration in your Supabase dashboard</li>
            <li>Sign in using the authentication section above</li>
            <li>Try voting on the demo event (or change the event ID)</li>
            <li>Vote counts will update in real-time</li>
            <li>Each user can only have one vote per event</li>
          </ol>
        </div>

        {/* Database Schema Info */}
        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Database Schema:
          </h3>
          <pre className="text-sm text-gray-700 overflow-x-auto">
{`event_votes table:
- id (UUID, Primary Key)
- event_id (TEXT, NOT NULL)
- user_id (UUID, NOT NULL, References auth.users)
- choice (TEXT, NOT NULL, CHECK: 'yes' | 'no' | 'unsure')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE(event_id, user_id)

Row Level Security:
- Users can only see/edit their own votes
- Automatic profile creation on signup`}
          </pre>
        </div>
      </div>
    </div>
  )
}
