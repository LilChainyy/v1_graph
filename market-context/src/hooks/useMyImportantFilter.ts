import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from './useSupabase'

interface UseMyImportantFilterOptions {
  eventIds: string[]
}

export function useMyImportantFilter({ eventIds }: UseMyImportantFilterOptions) {
  const { user } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isEnabled, setIsEnabled] = useState(false)
  const [myImportantEventIds, setMyImportantEventIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get filter state from URL
  useEffect(() => {
    const filterParam = searchParams.get('myImportant')
    setIsEnabled(filterParam === 'true')
  }, [searchParams])

  // Fetch events where user voted "yes"
  const fetchMyImportantEvents = useCallback(async () => {
    if (!user || eventIds.length === 0) {
      setMyImportantEventIds([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get all events where user voted "yes"
      const response = await fetch('/api/events/my-important', {
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
      setMyImportantEventIds(data.eventIds || [])
    } catch (err) {
      console.error('Error fetching my important events:', err)
      setError('Failed to fetch your important events')
    } finally {
      setLoading(false)
    }
  }, [user, eventIds])

  // Toggle the filter
  const toggleFilter = useCallback(() => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (newValue) {
      params.set('myImportant', 'true')
    } else {
      params.delete('myImportant')
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    router.push(newUrl, { scroll: false })
  }, [isEnabled, searchParams, router])

  // Fetch data when user changes or filter is enabled
  useEffect(() => {
    if (isEnabled && user) {
      fetchMyImportantEvents()
    } else {
      setMyImportantEventIds([])
    }
  }, [isEnabled, user, fetchMyImportantEvents])

  // Get filtered event IDs
  const getFilteredEventIds = useCallback(() => {
    if (!isEnabled) {
      return eventIds
    }
    return eventIds.filter(id => myImportantEventIds.includes(id))
  }, [isEnabled, eventIds, myImportantEventIds])

  return {
    isEnabled,
    myImportantEventIds,
    loading,
    error,
    toggleFilter,
    getFilteredEventIds,
    refetch: fetchMyImportantEvents
  }
}
