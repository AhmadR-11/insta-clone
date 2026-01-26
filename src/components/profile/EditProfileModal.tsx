'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user, refreshUser } = useAuth()
    const [fullName, setFullName] = useState(user?.full_name || '')
    const [username, setUsername] = useState(user?.username || '')
    const [bio, setBio] = useState(user?.bio || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen || !user) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase
                .from('users')
                .update({
                    full_name: fullName,
                    username,
                    bio,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)

            if (updateError) throw updateError

            await refreshUser()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <button onClick={onClose} className="text-sm font-medium text-white hover:text-zinc-400">Cancel</button>
                    <h2 className="text-base font-semibold text-white">Edit Profile</h2>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="text-sm font-bold text-blue-500 hover:text-blue-400 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Done'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Name</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Name"
                                className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Username</label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Bio</label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Bio"
                                rows={3}
                                className="w-full bg-black border border-zinc-800 rounded-md px-3 py-2 text-white focus:outline-none focus:border-zinc-600 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col items-center">
                        <button
                            type="button"
                            className="text-sm font-bold text-blue-500 hover:text-white transition-colors"
                        >
                            Change profile photo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
