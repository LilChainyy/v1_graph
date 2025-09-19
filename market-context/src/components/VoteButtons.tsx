'use client'

import { useVotes } from '@/hooks/useVotes'
import type { VoteChoice } from '@/types/supabase'

interface VoteButtonsProps {
  eventId: string
  className?: string
}

export default function VoteButtons({ eventId, className = '' }: VoteButtonsProps) {
  const { userVote, voteCounts, loading, error, vote } = useVotes(eventId)

  const handleVote = async (choice: VoteChoice) => {
    await vote(choice)
  }

  const getButtonClass = (choice: VoteChoice) => {
    const baseClass = "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    
    if (userVote?.choice === choice) {
      switch (choice) {
        case 'yes':
          return `${baseClass} bg-green-500 text-white hover:bg-green-600`
        case 'no':
          return `${baseClass} bg-red-500 text-white hover:bg-red-600`
        case 'unsure':
          return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600`
      }
    }
    
    return `${baseClass} bg-gray-200 text-gray-700 hover:bg-gray-300`
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded ${className}`}>
        <p className="text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <button
          onClick={() => handleVote('yes')}
          disabled={loading}
          className={getButtonClass('yes')}
        >
          👍 Yes ({voteCounts.yes})
        </button>
        <button
          onClick={() => handleVote('no')}
          disabled={loading}
          className={getButtonClass('no')}
        >
          👎 No ({voteCounts.no})
        </button>
        <button
          onClick={() => handleVote('unsure')}
          disabled={loading}
          className={getButtonClass('unsure')}
        >
          🤔 Unsure ({voteCounts.unsure})
        </button>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        {userVote && (
          <p>
            Your vote: <span className="font-medium capitalize">{userVote.choice}</span>
          </p>
        )}
        <p>
          Total votes: <span className="font-medium">{voteCounts.total}</span>
        </p>
      </div>
      
      {loading && (
        <p className="text-sm text-gray-500">Voting...</p>
      )}
    </div>
  )
}
