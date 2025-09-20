import { useState, useEffect } from 'react'
import { getEventMetadata, updateEventTags, updateEventSocialData } from '@/lib/eventMetadata'
import type { EventMetadata } from '@/types/supabase'

export function useEventMetadata(eventId: string) {
  const [metadata, setMetadata] = useState<EventMetadata | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      return
    }

    const fetchMetadata = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getEventMetadata(eventId)
        setMetadata(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event metadata')
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [eventId])

  const updateTags = async (tags: string[]) => {
    if (!eventId) return false
    
    try {
      const success = await updateEventTags(eventId, tags)
      if (success) {
        // Refresh the metadata
        const updatedMetadata = await getEventMetadata(eventId)
        setMetadata(updatedMetadata)
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tags')
      return false
    }
  }

  const updateSocialData = async (socialData: Record<string, any>) => {
    if (!eventId) return false
    
    try {
      const success = await updateEventSocialData(eventId, socialData)
      if (success) {
        // Refresh the metadata
        const updatedMetadata = await getEventMetadata(eventId)
        setMetadata(updatedMetadata)
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update social data')
      return false
    }
  }

  return {
    metadata,
    loading,
    error,
    updateTags,
    updateSocialData,
    refetch: () => {
      if (eventId) {
        getEventMetadata(eventId).then(setMetadata)
      }
    }
  }
}
