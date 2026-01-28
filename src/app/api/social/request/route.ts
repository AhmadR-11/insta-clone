import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
    try {
        const { action, requesterId, currentUserId } = await request.json()

        if (!action || !requesterId || !currentUserId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (action === 'accept') {
            // 1. Update status
            const { error: updateError } = await supabaseAdmin
                .from('follows')
                .update({ status: 'accepted' })
                .eq('follower_id', requesterId)
                .eq('following_id', currentUserId)

            if (updateError) throw updateError

            // 2. Notify requester
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: requesterId,
                    actor_id: currentUserId,
                    type: 'follow_accepted'
                })

        } else if (action === 'reject') {
            // 1. Delete follow
            const { error: deleteError } = await supabaseAdmin
                .from('follows')
                .delete()
                .eq('follower_id', requesterId)
                .eq('following_id', currentUserId)

            if (deleteError) throw deleteError

            // 2. Notify requester (as requested)
            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: requesterId,
                    actor_id: currentUserId,
                    type: 'follow_rejected'
                })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('API Error processing request:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
