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

    // Fetch event metadata by event_id
    const { data, error } = await supabase
      .from('event_metadata')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - event has no metadata yet
        return NextResponse.json({
          event_id: eventId,
          metadata: null,
          message: 'No metadata found for this event'
        })
      }
      
      console.error('Error fetching event metadata:', error)
      return NextResponse.json(
        { error: 'Failed to fetch event metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      event_id: eventId,
      metadata: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params
    const body = await request.json()
    const { tags, social_data } = body

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

    // Upsert event metadata
    const { data, error } = await supabase
      .from('event_metadata')
      .upsert({
        event_id: eventId,
        tags: tags || [],
        social_data: social_data || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting event metadata:', error)
      return NextResponse.json(
        { error: 'Failed to update event metadata' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      event_id: eventId,
      metadata: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
