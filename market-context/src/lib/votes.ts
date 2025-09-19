import { supabase } from './supabase-browser'
import type { EventVote, VoteChoice } from '@/types/supabase'

export async function getUserVote(eventId: string, userId: string): Promise<EventVote | null> {
  const { data, error } = await supabase
    .from('event_votes')
    .select('*')
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No vote found
      return null
    }
    console.error('Error fetching vote:', error)
    return null
  }

  return data
}

export async function createVote(eventId: string, userId: string, choice: VoteChoice): Promise<EventVote | null> {
  const { data, error } = await supabase
    .from('event_votes')
    .insert({
      event_id: eventId,
      user_id: userId,
      choice,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating vote:', error)
    return null
  }

  return data
}

export async function updateVote(voteId: string, choice: VoteChoice): Promise<EventVote | null> {
  const { data, error } = await supabase
    .from('event_votes')
    .update({ choice })
    .eq('id', voteId)
    .select()
    .single()

  if (error) {
    console.error('Error updating vote:', error)
    return null
  }

  return data
}

export async function deleteVote(voteId: string): Promise<boolean> {
  const { error } = await supabase
    .from('event_votes')
    .delete()
    .eq('id', voteId)

  if (error) {
    console.error('Error deleting vote:', error)
    return false
  }

  return true
}

export async function voteOnEvent(eventId: string, userId: string, choice: VoteChoice): Promise<EventVote | null> {
  // First, try to get existing vote
  const existingVote = await getUserVote(eventId, userId)
  
  if (existingVote) {
    // Update existing vote
    return await updateVote(existingVote.id, choice)
  } else {
    // Create new vote
    return await createVote(eventId, userId, choice)
  }
}

export async function getEventVoteCounts(eventId: string): Promise<{ yes: number; no: number; unsure: number; total: number }> {
  // Use the database aggregation function for better performance
  const { data, error } = await supabase.rpc('get_event_vote_counts_json', {
    event_id_param: eventId
  })

  if (error) {
    console.error('Error fetching vote counts:', error)
    return { yes: 0, no: 0, unsure: 0, total: 0 }
  }

  return data || { yes: 0, no: 0, unsure: 0, total: 0 }
}

export async function getUserVotes(userId: string): Promise<EventVote[]> {
  const { data, error } = await supabase
    .from('event_votes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user votes:', error)
    return []
  }

  return data
}

// Client-side function to fetch vote counts via API
export async function getEventVoteCountsAPI(eventId: string): Promise<{ yes: number; no: number; unsure: number; total: number }> {
  try {
    const response = await fetch(`/api/events/${eventId}/votes`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.counts || { yes: 0, no: 0, unsure: 0, total: 0 }
  } catch (error) {
    console.error('Error fetching vote counts via API:', error)
    return { yes: 0, no: 0, unsure: 0, total: 0 }
  }
}
