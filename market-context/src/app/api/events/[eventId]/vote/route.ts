import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-server'

export async function POST(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params
    const { choice } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    if (!choice || !['yes', 'no', 'unsure'].includes(choice)) {
      return NextResponse.json(
        { error: 'Valid choice (yes, no, unsure) is required' },
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

    // Upsert the vote (insert or update)
    const { data, error } = await supabase
      .from('event_votes')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        choice,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'event_id,user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving vote:', error)
      return NextResponse.json(
        { error: 'Failed to save vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
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
