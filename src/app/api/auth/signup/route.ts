import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { hashPassword } from '@/lib/auth'
import { signupSchema } from '@/lib/validations'

// Create a Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      const errors = validationResult.error.issues
      const errorMessage = errors.map(err => {
        if (err.path[0] === 'password') {
          if (err.code === 'too_small') {
            return 'Password must be at least 8 characters long'
          }
          if (err.code === 'invalid_format') {
            return 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
          }
        }
        if (err.path[0] === 'username') {
          if (err.code === 'too_small') {
            return 'Username must be at least 3 characters long'
          }
          if (err.code === 'invalid_format') {
            return 'Username can only contain letters, numbers, dots, and underscores'
          }
        }
        if (err.path[0] === 'email') {
          return 'Please enter a valid email address'
        }
        return err.message
      }).join(', ')
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    const { email, username, password } = validationResult.data

    // Check if email already exists
    const { data: existingEmail } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const { data: existingUsername } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        username,
        password_hash: passwordHash,
      })
      .select('id, email, username, full_name, bio, avatar_url, is_verified, is_private, created_at')
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user,
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}