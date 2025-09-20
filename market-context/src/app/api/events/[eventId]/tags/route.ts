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

    // Fetch event tags by event_id
    const { data, error } = await supabase
      .from('event_tags')
      .select('*')
      .eq('event_id', eventId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - event has no tags yet
        return NextResponse.json({
          event_id: eventId,
          tags: [],
          message: 'No tags found for this event'
        })
      }
      
      console.error('Error fetching event tags:', error)
      return NextResponse.json(
        { error: 'Failed to fetch event tags' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      event_id: eventId,
      tags: data.tags || [],
      record: data
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
    const { tags, ticker_id } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    if (!Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Tags must be an array of strings' },
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

    // Upsert event tags
    const { data, error } = await supabase
      .from('event_tags')
      .upsert({
        event_id: eventId,
        ticker_id: ticker_id || null,
        tags: tags
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting event tags:', error)
      return NextResponse.json(
        { error: 'Failed to update event tags' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      event_id: eventId,
      tags: data.tags || [],
      record: data
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Delete event tags
    const { error } = await supabase
      .from('event_tags')
      .delete()
      .eq('event_id', eventId)

    if (error) {
      console.error('Error deleting event tags:', error)
      return NextResponse.json(
        { error: 'Failed to delete event tags' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      event_id: eventId,
      message: 'Event tags deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
