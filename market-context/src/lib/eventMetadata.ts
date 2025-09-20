import { supabase } from './supabase-browser'
import type { EventMetadata } from '@/types/supabase'

/**
 * Fetch event metadata (tags and social data) by event_id
 * This is the cross-DB lookup function that connects your events to Supabase social data
 */
export async function getEventMetadata(eventId: string): Promise<EventMetadata | null> {
  const { data, error } = await supabase
    .from('event_metadata')
    .select('*')
    .eq('event_id', eventId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - event has no metadata yet
      return null
    }
    console.error('Error fetching event metadata:', error)
    return null
  }

  return data
}

/**
 * Fetch metadata for multiple events at once
 */
export async function getEventMetadataBatch(eventIds: string[]): Promise<EventMetadata[]> {
  const { data, error } = await supabase
    .from('event_metadata')
    .select('*')
    .in('event_id', eventIds)

  if (error) {
    console.error('Error fetching event metadata batch:', error)
    return []
  }

  return data || []
}

/**
 * Create or update event metadata
 */
export async function upsertEventMetadata(
  eventId: string, 
  tags: string[], 
  socialData: Record<string, any> = {}
): Promise<EventMetadata | null> {
  const { data, error } = await supabase
    .from('event_metadata')
    .upsert({
      event_id: eventId,
      tags,
      social_data: socialData
    })
    .select()
    .single()

  if (error) {
    console.error('Error upserting event metadata:', error)
    return null
  }

  return data
}

/**
 * Update only the tags for an event
 */
export async function updateEventTags(eventId: string, tags: string[]): Promise<boolean> {
  const { error } = await supabase
    .from('event_metadata')
    .upsert({
      event_id: eventId,
      tags
    })

  if (error) {
    console.error('Error updating event tags:', error)
    return false
  }

  return true
}

/**
 * Update only the social data for an event
 */
export async function updateEventSocialData(
  eventId: string, 
  socialData: Record<string, any>
): Promise<boolean> {
  const { error } = await supabase
    .from('event_metadata')
    .upsert({
      event_id: eventId,
      social_data: socialData
    })

  if (error) {
    console.error('Error updating event social data:', error)
    return false
  }

  return true
}

/**
 * Search events by tags
 */
export async function searchEventsByTags(tags: string[]): Promise<EventMetadata[]> {
  const { data, error } = await supabase
    .from('event_metadata')
    .select('*')
    .overlaps('tags', tags)

  if (error) {
    console.error('Error searching events by tags:', error)
    return []
  }

  return data || []
}
