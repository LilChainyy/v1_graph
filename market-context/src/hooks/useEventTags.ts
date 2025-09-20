import { useState, useEffect } from 'react'
import { 
  getEventTags, 
  setEventTags, 
  addEventTag, 
  removeEventTag,
  getEventTagsRecord 
} from '@/lib/eventTags'
import type { EventTags } from '@/types/supabase'

export function useEventTags(eventId: string, tickerId?: string) {
  const [tags, setTags] = useState<string[]>([])
  const [record, setRecord] = useState<EventTags | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      return
    }

    const fetchTags = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [tagsData, recordData] = await Promise.all([
          getEventTags(eventId),
          getEventTagsRecord(eventId)
        ])
        
        setTags(tagsData)
        setRecord(recordData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event tags')
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [eventId])

  const updateTags = async (newTags: string[]) => {
    if (!eventId) return false
    
    try {
      const success = await setEventTags(eventId, newTags, tickerId)
      if (success) {
        setTags(newTags)
        // Refresh the full record
        const updatedRecord = await getEventTagsRecord(eventId)
        setRecord(updatedRecord)
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tags')
      return false
    }
  }

  const addTag = async (tag: string) => {
    if (!eventId) return false
    
    try {
      const success = await addEventTag(eventId, tag, tickerId)
      if (success) {
        // Refresh tags
        const updatedTags = await getEventTags(eventId)
        setTags(updatedTags)
        // Refresh the full record
        const updatedRecord = await getEventTagsRecord(eventId)
        setRecord(updatedRecord)
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tag')
      return false
    }
  }

  const removeTag = async (tag: string) => {
    if (!eventId) return false
    
    try {
      const success = await removeEventTag(eventId, tag)
      if (success) {
        // Refresh tags
        const updatedTags = await getEventTags(eventId)
        setTags(updatedTags)
        // Refresh the full record
        const updatedRecord = await getEventTagsRecord(eventId)
        setRecord(updatedRecord)
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove tag')
      return false
    }
  }

  const refetch = async () => {
    if (!eventId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const [tagsData, recordData] = await Promise.all([
        getEventTags(eventId),
        getEventTagsRecord(eventId)
      ])
      
      setTags(tagsData)
      setRecord(recordData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event tags')
    } finally {
      setLoading(false)
    }
  }

  return {
    tags,
    record,
    loading,
    error,
    updateTags,
    addTag,
    removeTag,
    refetch
  }
}
