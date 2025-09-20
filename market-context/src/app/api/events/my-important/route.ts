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

    const supabase = createSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    if (eventIds.length === 0) {
      return NextResponse.json({
        eventIds: []
      })
    }

    // Get events where user voted "yes"
    const { data, error } = await supabase
      .from('event_votes')
      .select('event_id')
      .eq('user_id', user.id)
      .eq('choice', 'yes')
      .in('event_id', eventIds)

    if (error) {
      console.error('Error fetching my important events:', error)
      return NextResponse.json(
        { error: 'Failed to fetch important events' },
        { status: 500 }
      )
    }

    const importantEventIds = data.map(vote => vote.event_id)

    return NextResponse.json({
      eventIds: importantEventIds
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
