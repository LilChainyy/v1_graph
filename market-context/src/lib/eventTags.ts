import { supabase } from './supabase-browser'
import type { EventTags } from '@/types/supabase'

/**
 * Get tags for a specific event by event_id
 * This is the core cross-DB lookup function
 */
export async function getEventTags(eventId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('tags')
    .eq('event_id', eventId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - event has no tags yet
      return []
    }
    console.error('Error fetching event tags:', error)
    return []
  }

  return data.tags || []
}

/**
 * Get full event tags record by event_id
 */
export async function getEventTagsRecord(eventId: string): Promise<EventTags | null> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('*')
    .eq('event_id', eventId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned - event has no tags yet
      return null
    }
    console.error('Error fetching event tags record:', error)
    return null
  }

  return data
}

/**
 * Set tags for a specific event by event_id
 * Creates or updates the tags record
 */
export async function setEventTags(
  eventId: string, 
  tags: string[], 
  tickerId?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('event_tags')
    .upsert({
      event_id: eventId,
      ticker_id: tickerId,
      tags: tags
    })

  if (error) {
    console.error('Error setting event tags:', error)
    return false
  }

  return true
}

/**
 * Add a single tag to an event
 * Preserves existing tags and adds the new one
 */
export async function addEventTag(eventId: string, tag: string, tickerId?: string): Promise<boolean> {
  // First get existing tags
  const existingTags = await getEventTags(eventId)
  
  // Add the new tag if it doesn't exist
  if (!existingTags.includes(tag)) {
    const newTags = [...existingTags, tag]
    return await setEventTags(eventId, newTags, tickerId)
  }
  
  return true // Tag already exists
}

/**
 * Remove a single tag from an event
 */
export async function removeEventTag(eventId: string, tag: string): Promise<boolean> {
  // First get existing tags
  const existingTags = await getEventTags(eventId)
  
  // Remove the tag
  const newTags = existingTags.filter(t => t !== tag)
  return await setEventTags(eventId, newTags)
}

/**
 * Get all events that have a specific tag
 */
export async function getEventsByTag(tag: string): Promise<EventTags[]> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('*')
    .contains('tags', [tag])

  if (error) {
    console.error('Error fetching events by tag:', error)
    return []
  }

  return data || []
}

/**
 * Get all events that have any of the specified tags
 */
export async function getEventsByTags(tags: string[]): Promise<EventTags[]> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('*')
    .overlaps('tags', tags)

  if (error) {
    console.error('Error fetching events by tags:', error)
    return []
  }

  return data || []
}

/**
 * Get all unique tags across all events
 */
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('tags')

  if (error) {
    console.error('Error fetching all tags:', error)
    return []
  }

  // Flatten and deduplicate tags
  const allTags = data?.flatMap(record => record.tags) || []
  return [...new Set(allTags)].sort()
}

/**
 * Get tags for multiple events at once
 */
export async function getEventTagsBatch(eventIds: string[]): Promise<Record<string, string[]>> {
  const { data, error } = await supabase
    .from('event_tags')
    .select('event_id, tags')
    .in('event_id', eventIds)

  if (error) {
    console.error('Error fetching event tags batch:', error)
    return {}
  }

  // Convert to a lookup object
  const result: Record<string, string[]> = {}
  data?.forEach(record => {
    result[record.event_id] = record.tags || []
  })

  return result
}

/**
 * Delete all tags for an event
 */
export async function deleteEventTags(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from('event_tags')
    .delete()
    .eq('event_id', eventId)

  if (error) {
    console.error('Error deleting event tags:', error)
    return false
  }

  return true
}
