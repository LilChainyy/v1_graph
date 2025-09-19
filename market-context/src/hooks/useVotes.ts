import { useState, useEffect } from 'react'
import { useSupabase } from './useSupabase'
import { 
  getUserVote, 
  voteOnEvent, 
  getEventVoteCounts, 
  getUserVotes,
  type VoteChoice 
} from '@/lib/votes'
import type { EventVote } from '@/types/supabase'

export function useVotes(eventId?: string) {
  const { user } = useSupabase()
  const [userVote, setUserVote] = useState<EventVote | null>(null)
  const [voteCounts, setVoteCounts] = useState<{ yes: number; no: number; unsure: number; total: number }>({ yes: 0, no: 0, unsure: 0, total: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's vote for this event
  useEffect(() => {
    if (!eventId || !user) {
      setUserVote(null)
      return
    }

    const fetchUserVote = async () => {
      setLoading(true)
      setError(null)
      try {
        const vote = await getUserVote(eventId, user.id)
        setUserVote(vote)
      } catch (err) {
        setError('Failed to fetch vote')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserVote()
  }, [eventId, user])

  // Fetch vote counts for this event
  useEffect(() => {
    if (!eventId) {
      setVoteCounts({ yes: 0, no: 0, unsure: 0, total: 0 })
      return
    }

    const fetchVoteCounts = async () => {
      try {
        const counts = await getEventVoteCounts(eventId)
        setVoteCounts(counts)
      } catch (err) {
        console.error('Failed to fetch vote counts:', err)
      }
    }

    fetchVoteCounts()
  }, [eventId])

  const vote = async (choice: VoteChoice) => {
    if (!eventId || !user) {
      setError('Must be logged in to vote')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const vote = await voteOnEvent(eventId, user.id, choice)
      setUserVote(vote)
      
      // Refresh vote counts
      const counts = await getEventVoteCounts(eventId)
      setVoteCounts(counts)
    } catch (err) {
      setError('Failed to vote')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    userVote,
    voteCounts,
    loading,
    error,
    vote,
  }
}

export function useUserVotes() {
  const { user } = useSupabase()
  const [votes, setVotes] = useState<EventVote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setVotes([])
      return
    }

    const fetchVotes = async () => {
      setLoading(true)
      setError(null)
      try {
        const userVotes = await getUserVotes(user.id)
        setVotes(userVotes)
      } catch (err) {
        setError('Failed to fetch votes')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVotes()
  }, [user])

  return {
    votes,
    loading,
    error,
  }
}
