'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { socialService } from '@/services/socialService'
import { useRouter } from 'next/navigation'

interface Notification {
    id: string
    created_at: string
    type: 'follow_request' | 'follow_accepted' | 'follow_started' | 'follow_rejected'
    is_read: boolean
    actor: {
        id: string
        username: string
        avatar_url: string | null
    }
}

export default function NotificationsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return

            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select(`
            *,
            actor:users!actor_id (
              id,
              username,
              avatar_url
            )
          `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error

                // Transform data to match interface if needed (Supabase types usually match but nested relations can be tricky)
                // @ts-ignore
                setNotifications(data || [])
            } catch (error) {
                console.error('Error fetching notifications:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()
    }, [user])

    const handleAccept = async (notificationId: string, actorId: string) => {
        if (!user) return
        try {
            await socialService.acceptFollowRequest(actorId, user.id)

            // Update local state: remote notification or change type?
            // Usually the notification stays but changes state, or we just remove it for simplicity.
            // Or better, update UI to say "Following".

            // For now, let's remove the "request" notification or mark it as handled.
            // But typically Instagram converts "User requested to follow you" -> "User started following you" or just hides the buttons.

            // Simple approach: Remove from list or reload.
            setNotifications(prev => prev.filter(n => n.id !== notificationId))
        } catch (error) {
            console.error('Error accepting request:', error)
        }
    }

    const handleReject = async (notificationId: string, actorId: string) => {
        if (!user) return
        try {
            await socialService.rejectFollowRequest(actorId, user.id)
            setNotifications(prev => prev.filter(n => n.id !== notificationId))
        } catch (error) {
            console.error('Error rejecting request:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white w-full max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 px-4">Notifications</h1>

            <div className="flex flex-col">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="flex items-center justify-between p-4 hover:bg-zinc-900 transition-colors border-b border-zinc-900"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-11 h-11 rounded-full overflow-hidden border border-zinc-800 flex-shrink-0 cursor-pointer"
                                    onClick={() => router.push(`/u/${notification.actor.username}`)}
                                >
                                    {notification.actor.avatar_url ? (
                                        <img src={notification.actor.avatar_url} alt={notification.actor.username} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-medium">
                                            {notification.actor.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm">
                                    <span
                                        className="font-semibold cursor-pointer hover:underline"
                                        onClick={() => router.push(`/u/${notification.actor.username}`)}
                                    >
                                        {notification.actor.username}
                                    </span>
                                    {' '}
                                    <span className="text-zinc-300">
                                        {notification.type === 'follow_request' && 'requested to follow you.'}
                                        {notification.type === 'follow_accepted' && 'accepted your follow request.'}
                                        {notification.type === 'follow_rejected' && 'rejected your follow request.'}
                                        {notification.type === 'follow_started' && 'started following you.'}
                                    </span>
                                    <div className="text-xs text-zinc-500 mt-0.5">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {notification.type === 'follow_request' && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAccept(notification.id, notification.actor.id)}
                                        className="bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => handleReject(notification.id, notification.actor.id)}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
