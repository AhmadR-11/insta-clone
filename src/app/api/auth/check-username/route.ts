import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Check if username is available
    const { data: isAvailable } = await supabaseAdmin
      .rpc('check_username_availability', { check_username: username })

    if (isAvailable) {
      return NextResponse.json({ available: true })
    }

    // Get username suggestions
    const { data: suggestions } = await supabaseAdmin
      .rpc('get_username_suggestions', { base_username: username })

    const suggestedUsernames = suggestions?.map((item: any) => item.suggested_username) || []

    return NextResponse.json({
      available: false,
      suggestions: suggestedUsernames
    })

  } catch (error) {
    console.error('Check username error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}