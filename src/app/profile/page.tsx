'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import EditProfileModal from '@/components/profile/EditProfileModal'

export default function ProfilePage() {
    const { user, logout, loading } = useAuth()
    const router = useRouter()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 w-full max-w-4xl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20 mb-10">
                {/* Profile Image */}
                <div className="relative group">
                    <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-zinc-800">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-4xl font-medium text-zinc-500">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Note Bubble (Placeholder as seen in screenshot) */}
                    <div className="absolute -top-2 -left-2 bg-zinc-800/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-xs border border-zinc-700 shadow-xl hidden md:block">
                        <span className="text-zinc-400 italic">Note...</span>
                        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-zinc-800 border-r border-b border-zinc-700 transform rotate-45"></div>
                    </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                        <h2 className="text-2xl font-semibold">{user.username}</h2>
                        <button
                            className="p-1 hover:bg-zinc-800 rounded-full transition-colors"
                            title="Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>

                    <p className="font-medium mb-4">{user.full_name || user.username}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
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
                        {user.bio ? (
                            <div className="whitespace-pre-wrap">{user.bio}</div>
                        ) : (
                            <p className="text-zinc-500 italic">No bio yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-2 max-w-2xl">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                    Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm"
                >
                    Log Out
                </button>
            </div>

            {/* Post Grid (Empty for now) */}
            <div className="mt-12 border-t border-zinc-800 pt-8">
                <div className="flex justify-center gap-12 mb-8">
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-t border-white -mt-[33px] pt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                        </svg>
                        Posts
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 pt-4 -mt-[33px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
                        </svg>
                        Saved
                    </button>
                    <button className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-zinc-500 pt-4 -mt-[33px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Tagged
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-1">
                    {/* Empty posts message */}
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-extrabold mb-2">Share Photos</h3>
                        <p className="text-sm max-w-xs mb-6">When you share photos, they will appear on your profile.</p>
                        <button className="text-blue-500 font-bold hover:text-white transition-colors">
                            Share your first photo
                        </button>
                    </div>
                </div>
            </div>
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    )
}
