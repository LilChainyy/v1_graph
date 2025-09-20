import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { eventIds } = await request.json()

    if (!eventIds || !Array.isArray(eventIds)) {
      return NextResponse.json(
        { error: 'Event IDs array is required' },
        { status: 400 }
      )
    }

    if (eventIds.length === 0) {
      return NextResponse.json({
        stats: {}
      })
    }

    const supabase = createSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get vote counts for all events using the aggregation function
    const stats: Record<string, { yes: number; no: number; unsure: number; total: number }> = {}
    
    // Process each event ID
    for (const eventId of eventIds) {
      const { data, error } = await supabase.rpc('get_event_vote_counts_json', {
        event_id_param: eventId
      })

      if (error) {
        console.error(`Error fetching vote counts for event ${eventId}:`, error)
        stats[eventId] = { yes: 0, no: 0, unsure: 0, total: 0 }
      } else {
        stats[eventId] = data || { yes: 0, no: 0, unsure: 0, total: 0 }
      }
    }

    return NextResponse.json({
      stats
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
