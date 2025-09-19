'use client'

import { useVoting } from '@/hooks/useVoting'
import type { VoteChoice } from '@/types/supabase'
import { useState } from 'react'

interface VoteBarProps {
  eventId: string
  eventDate?: string // For determining if event is in the past
  className?: string
  compact?: boolean
}

export default function VoteBar({ 
  eventId, 
  eventDate, 
  className = '', 
  compact = false 
}: VoteBarProps) {
  const { 
    myVote, 
    voteStats, 
    loading, 
    error, 
    canVote, 
    isAuthenticated, 
    authLoading, 
    submitVote,
    clearError 
  } = useVoting({ eventId })

  const [hoveredChoice, setHoveredChoice] = useState<VoteChoice | null>(null)

  // Check if event is in the past
  const isPastEvent = eventDate ? new Date(eventDate) < new Date() : false

  // Calculate percentages
  const total = voteStats.total
  const yesPercent = total > 0 ? Math.round((voteStats.yes / total) * 100) : 0
  const noPercent = total > 0 ? Math.round((voteStats.no / total) * 100) : 0
  const unsurePercent = total > 0 ? Math.round((voteStats.unsure / total) * 100) : 0

  const handleVote = async (choice: VoteChoice) => {
    if (!isAuthenticated) return
    
    const success = await submitVote(eventId, choice)
    if (success) {
      clearError()
    }
  }

  const getButtonClass = (choice: VoteChoice) => {
    const baseClass = compact 
      ? "px-2 py-1 text-xs rounded font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      : "px-3 py-2 text-sm rounded font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const isSelected = myVote?.choice === choice
    const isHovered = hoveredChoice === choice
    
    if (isSelected) {
      switch (choice) {
        case 'yes':
          return `${baseClass} bg-green-500 text-white hover:bg-green-600 shadow-md`
        case 'no':
          return `${baseClass} bg-red-500 text-white hover:bg-red-600 shadow-md`
        case 'unsure':
          return `${baseClass} bg-yellow-500 text-white hover:bg-yellow-600 shadow-md`
      }
    }
    
    if (isHovered) {
      return `${baseClass} bg-gray-200 text-gray-800 hover:bg-gray-300`
    }
    
    return `${baseClass} bg-gray-100 text-gray-600 hover:bg-gray-200`
  }

  const getTooltipText = (choice: VoteChoice) => {
    if (!isAuthenticated) {
      return "Sign in to vote"
    }
    
    if (!canVote) {
      return "Please wait before voting again"
    }
    
    const counts = {
      yes: voteStats.yes,
      no: voteStats.no,
      unsure: voteStats.unsure
    }
    
    return `${counts[choice]} ${choice.charAt(0).toUpperCase() + choice.slice(1)}`
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className={`p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm ${className}`}>
        <div className="flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={clearError}
            className="text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Vote Buttons */}
      <div className="flex gap-1">
        {(['yes', 'no', 'unsure'] as VoteChoice[]).map((choice) => (
          <button
            key={choice}
            onClick={() => handleVote(choice)}
            disabled={!isAuthenticated || !canVote || loading}
            onMouseEnter={() => setHoveredChoice(choice)}
            onMouseLeave={() => setHoveredChoice(null)}
            title={getTooltipText(choice)}
            className={getButtonClass(choice)}
          >
            <div className="flex items-center space-x-1">
              <span>
                {choice === 'yes' && '👍'}
                {choice === 'no' && '👎'}
                {choice === 'unsure' && '🤔'}
              </span>
              <span className="capitalize">{choice}</span>
              {!compact && (
                <span className="text-xs opacity-75">
                  ({choice === 'yes' ? voteStats.yes : choice === 'no' ? voteStats.no : voteStats.unsure})
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Vote Statistics */}
      {total > 0 && (
        <div className="space-y-1">
          {/* Progress Bars */}
          <div className="space-y-1">
            {yesPercent > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-12 text-xs text-gray-600">Yes</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${yesPercent}%` }}
                  ></div>
                </div>
                <div className="w-8 text-xs text-gray-600 text-right">{yesPercent}%</div>
              </div>
            )}
            
            {noPercent > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-12 text-xs text-gray-600">No</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${noPercent}%` }}
                  ></div>
                </div>
                <div className="w-8 text-xs text-gray-600 text-right">{noPercent}%</div>
              </div>
            )}
            
            {unsurePercent > 0 && (
              <div className="flex items-center space-x-2">
                <div className="w-12 text-xs text-gray-600">Unsure</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${unsurePercent}%` }}
                  ></div>
                </div>
                <div className="w-8 text-xs text-gray-600 text-right">{unsurePercent}%</div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="text-xs text-gray-500 text-center">
            {total === 1 ? '1 vote' : `${total} votes`}
            {myVote && (
              <span className="ml-2 text-gray-700">
                • Your vote: <span className="font-medium capitalize">{myVote.choice}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* No votes yet message */}
      {total === 0 && !loading && (
        <div className="text-center text-sm text-gray-500 py-2">
          {isAuthenticated ? 'Be the first to vote' : 'Sign in to vote'}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center text-sm text-gray-500 py-2">
          Voting...
        </div>
      )}

      {/* Past event message */}
      {isPastEvent && total > 0 && (
        <div className="text-xs text-gray-500 text-center italic">
          Final results
        </div>
      )}
    </div>
  )
}
