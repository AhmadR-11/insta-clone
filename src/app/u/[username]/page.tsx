'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { MessageCircle, UserPlus, MoreHorizontal, Check } from 'lucide-react'
import { socialService } from '@/services/socialService'

interface UserProfile {
    id: string
    username: string
    full_name: string | null
    bio: string | null
    avatar_url: string | null
    is_verified: boolean
    is_private: boolean
}

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const router = useRouter()
    const { user: currentUser } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [followStatus, setFollowStatus] = useState<'pending' | 'accepted' | null>(null)
    const [followLoading, setFollowLoading] = useState(false)

    const { username } = use(params)

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            try {
                const decodedUsername = decodeURIComponent(username)

                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .ilike('username', decodedUsername)
                    .single()

                if (error) {
                    console.error("Error fetching user", error)
                    setProfile(null)
                } else {
                    setProfile(data)
                    // Check follow status if we have a current user and a profile
                    if (currentUser && data.id !== currentUser.id) {
                        const status = await socialService.getFollowStatus(currentUser.id, data.id)
                        setFollowStatus(status)
                    }
                }
            } catch (err) {
                console.error('Error:', err)
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            if (currentUser) {
                fetchProfile()
            } else {
                // If no current user, just fetch profile, skip follow check or wait for auth?
                // AuthContext usually handles loading state.
                fetchProfile()
            }
        }
    }, [username, currentUser])

    const handleFollowClick = async () => {
        if (!currentUser || !profile || followLoading) return

        setFollowLoading(true)
        try {
            const newStatus = await socialService.followUser(currentUser.id, profile.id, profile.is_private)
            setFollowStatus(newStatus)
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setFollowLoading(false)
        }
    }

    const isOwnProfile = currentUser && profile && currentUser.username === profile.username

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
                <h2 className="text-2xl font-bold mb-4">User not found</h2>
                <p className="text-zinc-400 mb-8">The link you followed may be broken, or the page may have been removed.</p>
                <button
                    onClick={() => router.push('/')}
                    className="text-blue-500 hover:text-white transition-colors"
                >
                    Go back to Instagram
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 w-full max-w-4xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-10">
                {/* Profile Image */}
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-zinc-800 flex-shrink-0">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-4xl font-medium text-zinc-500">
                                {profile.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                        <h2 className="text-xl md:text-2xl font-normal">{profile.username}</h2>

                        {isOwnProfile ? (
                            <button
                                onClick={() => router.push('/profile')}
                                className="bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleFollowClick}
                                    disabled={followLoading}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${followStatus === 'accepted' || followStatus === 'pending'
                                            ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                            : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                                        }`}
                                >
                                    {followLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : followStatus === 'accepted' ? (
                                        <>Following <Check className="w-3 h-3" /></>
                                    ) : followStatus === 'pending' ? (
                                        'Requested'
                                    ) : (
                                        'Follow'
                                    )}
                                </button>

                                <button className="bg-zinc-800 hover:bg-zinc-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                                    Message
                                </button>
                                <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                                    <UserPlus className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        <button className="p-1 hover:bg-zinc-800 rounded-full transition-colors">
                            <MoreHorizontal className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center md:justify-start gap-8 mb-6 text-sm md:text-base">
                        <div>
                            <span className="font-semibold">0</span> posts
                        </div>
                        <div>
                            <span className="font-semibold">0</span> followers
                        </div>
                        <div>
                            <span className="font-semibold">0</span> following
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="text-sm space-y-1 max-w-sm mx-auto md:mx-0">
                        <div className="font-bold">{profile.full_name}</div>
                        {profile.bio && (
                            <div className="whitespace-pre-wrap">{profile.bio}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Tabs */}
            <div className="border-t border-zinc-800">
                <div className="flex justify-center gap-12">
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-t border-white -mt-[1px] pt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                        </svg>
                        Posts
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 pt-4 hover:text-zinc-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Tagged
                    </button>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-3 gap-1 mt-4">
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center text-zinc-500">
                        {profile.is_private && !isOwnProfile && followStatus !== 'accepted' ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">This Account is Private</h3>
                                <p>Follow to see their photos and videos.</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full border-2 border-zinc-800 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Posts Yet</h3>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
