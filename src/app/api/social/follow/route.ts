import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
    try {
        const { followerId, followingId, isPrivate } = await request.json()

        if (!followerId || !followingId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Check current status
        const { data: currentFollow } = await supabaseAdmin
            .from('follows')
            .select('status')
            .eq('follower_id', followerId)
            .eq('following_id', followingId)
            .single()

        // 2. Toggle logic
        let newStatus = null

        if (currentFollow) {
            // Unfollow
            const { error: deleteError } = await supabaseAdmin
                .from('follows')
                .delete()
                .eq('follower_id', followerId)
                .eq('following_id', followingId)

            if (deleteError) throw deleteError
        } else {
            // Follow
            newStatus = isPrivate ? 'pending' : 'accepted'

            const { error: insertError } = await supabaseAdmin
                .from('follows')
                .insert({
                    follower_id: followerId,
                    following_id: followingId,
                    status: newStatus
                })

            if (insertError) throw insertError

            // Notification
            const notificationType = isPrivate ? 'follow_request' : 'follow_started'

            await supabaseAdmin
                .from('notifications')
                .insert({
                    user_id: followingId,
                    actor_id: followerId,
                    type: notificationType
                })
        }

        return NextResponse.json({ status: newStatus })

    } catch (error) {
        console.error('API Error toggling follow:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
