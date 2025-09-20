import { useState, useEffect } from 'react'
import { getEventTagsBatch } from '@/lib/eventTags'

interface UseCalendarTagsProps {
  eventIds: string[]
  selectedTag: string | null
}

export function useCalendarTags({ eventIds, selectedTag }: UseCalendarTagsProps) {
  const [eventTags, setEventTags] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch tags for visible events
  useEffect(() => {
    if (eventIds.length === 0) {
      setEventTags({})
      return
    }

    const fetchTags = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const tags = await getEventTagsBatch(eventIds)
        setEventTags(tags)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event tags')
        console.error('Error fetching calendar tags:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [eventIds])

  // Filter events based on selected tag
  const filteredEventIds = eventIds.filter(eventId => {
    if (!selectedTag) return true
    
    const tags = eventTags[eventId] || []
    return tags.includes(selectedTag)
  })

  // Get tags for a specific event
  const getEventTags = (eventId: string): string[] => {
    return eventTags[eventId] || []
  }

  // Check if an event has a specific tag
  const hasTag = (eventId: string, tag: string): boolean => {
    const tags = eventTags[eventId] || []
    return tags.includes(tag)
  }

  // Get all unique tags from visible events
  const getVisibleTags = (): string[] => {
    const allTags = Object.values(eventTags).flat()
    return [...new Set(allTags)].sort()
  }

  return {
    eventTags,
    filteredEventIds,
    loading,
    error,
    getEventTags,
    hasTag,
    getVisibleTags
  }
}
