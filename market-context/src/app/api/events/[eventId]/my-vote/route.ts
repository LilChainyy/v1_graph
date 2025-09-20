import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-server'

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

    const supabase = createSupabaseClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the user's vote for this event
    const { data, error } = await supabase
      .from('event_votes')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No vote found
        return NextResponse.json({
          hasVote: false,
          vote: null
        })
      }
      
      console.error('Error fetching vote:', error)
      return NextResponse.json(
        { error: 'Failed to fetch vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      hasVote: true,
      vote: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
