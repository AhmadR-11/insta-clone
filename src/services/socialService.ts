import { supabase } from '@/lib/supabase'

export const socialService = {
    // Check if current user follows target user (READ often works with public/authenticated policies)
    async getFollowStatus(currentUserId: string, targetUserId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select('status')
            .eq('follower_id', currentUserId)
            .eq('following_id', targetUserId)
            .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
            // console.error('Error checking follow status:', error)
        }

        return data?.status || null // 'accepted', 'pending', or null
    },

    // Toggle follow (Follow / Unfollow) - Uses API Route
    async followUser(currentUserId: string, targetUserId: string, targetIsPrivate: boolean) {
        const response = await fetch('/api/social/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                followerId: currentUserId,
                followingId: targetUserId,
                isPrivate: targetIsPrivate
            })
        })

        if (!response.ok) {
            throw new Error('Failed to toggle follow')
        }

        const data = await response.json()
        return data.status
    },

    // Accept Follow Request - Uses API Route
    async acceptFollowRequest(requesterId: string, currentUserId: string) {
        const response = await fetch('/api/social/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'accept',
                requesterId,
                currentUserId
            })
        })

        if (!response.ok) {
            throw new Error('Failed to accept request')
        }
    },

    // Reject Follow Request - Uses API Route
    async rejectFollowRequest(requesterId: string, currentUserId: string) {
        const response = await fetch('/api/social/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'reject',
                requesterId,
                currentUserId
            })
        })

        if (!response.ok) {
            throw new Error('Failed to reject request')
        }
    }
}
