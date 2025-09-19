import { useState, useEffect, useCallback } from 'react'
import { useSupabase } from './useSupabase'
import type { VoteChoice, EventVote } from '@/types/supabase'

interface VoteStats {
  yes: number
  no: number
  unsure: number
  total: number
}

interface UseVotingOptions {
  eventId?: string
  autoFetch?: boolean
}

export function useVoting({ eventId, autoFetch = true }: UseVotingOptions = {}) {
  const { user, loading: authLoading } = useSupabase()
  const [myVote, setMyVote] = useState<EventVote | null>(null)
  const [voteStats, setVoteStats] = useState<VoteStats>({ yes: 0, no: 0, unsure: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastVoteTime, setLastVoteTime] = useState<number>(0)

  // Rate limiting: prevent rapid double-clicks (1 second limit)
  const canVote = Date.now() - lastVoteTime > 1000

  // Fetch my vote for this event
  const fetchMyVote = useCallback(async (eventId: string) => {
    if (!user) {
      setMyVote(null)
      return
    }

    try {
      const response = await fetch(`/api/events/${eventId}/my-vote`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setMyVote(data.hasVote ? data.vote : null)
    } catch (err) {
      console.error('Error fetching my vote:', err)
      setError('Failed to fetch your vote')
    }
  }, [user])

  // Fetch vote stats for this event
  const fetchVoteStats = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/votes`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setVoteStats(data.counts || { yes: 0, no: 0, unsure: 0, total: 0 })
    } catch (err) {
      console.error('Error fetching vote stats:', err)
      setError('Failed to fetch vote statistics')
    }
  }, [])

  // Submit a vote
  const submitVote = useCallback(async (eventId: string, choice: VoteChoice) => {
    if (!user) {
      setError('Must be signed in to vote')
      return false
    }

    if (!canVote) {
      setError('Please wait before voting again')
      return false
    }

    setLoading(true)
    setError(null)
    setLastVoteTime(Date.now())

    try {
      const response = await fetch(`/api/events/${eventId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ choice }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit vote')
      }

      const data = await response.json()
      setMyVote(data.vote)
      
      // Refresh vote stats
      await fetchVoteStats(eventId)
      
      return true
    } catch (err) {
      console.error('Error submitting vote:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      return false
    } finally {
      setLoading(false)
    }
  }, [user, canVote, fetchVoteStats])

  // Auto-fetch data when eventId changes
  useEffect(() => {
    if (eventId && autoFetch) {
      fetchMyVote(eventId)
      fetchVoteStats(eventId)
    }
  }, [eventId, autoFetch, fetchMyVote, fetchVoteStats])

  // Clear vote state when user signs out
  useEffect(() => {
    if (!user) {
      setMyVote(null)
      setVoteStats({ yes: 0, no: 0, unsure: 0, total: 0 })
      setError(null)
    }
  }, [user])

  return {
    myVote,
    voteStats,
    loading,
    error,
    canVote,
    isAuthenticated: !!user,
    authLoading,
    submitVote,
    fetchMyVote,
    fetchVoteStats,
    clearError: () => setError(null)
  }
}

// Hook for fetching vote stats for multiple events
export function useVoteStats(eventIds: string[]) {
  const { user } = useSupabase()
  const [stats, setStats] = useState<Record<string, VoteStats>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (eventIds: string[]) => {
    if (!user || eventIds.length === 0) {
      setStats({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/events/vote-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventIds }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setStats(data.stats || {})
    } catch (err) {
      console.error('Error fetching vote stats:', err)
      setError('Failed to fetch vote statistics')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStats(eventIds)
  }, [eventIds, fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: () => fetchStats(eventIds)
  }
}
