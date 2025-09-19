import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Call the database function to get vote counts
    const { data, error } = await supabase.rpc('get_event_vote_counts_json', {
      event_id_param: eventId
    })

    if (error) {
      console.error('Error fetching vote counts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vote counts' },
        { status: 500 }
      )
    }

    // Return the vote counts
    return NextResponse.json({
      eventId,
      counts: data || { yes: 0, no: 0, unsure: 0, total: 0 }
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
