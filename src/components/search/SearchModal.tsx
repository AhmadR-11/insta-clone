'use client'

import { useState, useEffect } from 'react'
import { X, Search as SearchIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase' // Assumed availability based on context
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

interface UserResult {
    id: string
    username: string
    full_name: string | null
    avatar_url: string | null
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<UserResult[]>([])
    const [searching, setSearching] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!isOpen) {
            setQuery('')
            setResults([])
        }
    }, [isOpen])

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setResults([])
                return
            }

            setSearching(true)
            try {
                const { data, error } = await supabase
                    .from('users')
                    .select('id, username, full_name, avatar_url')
                    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
                    .limit(10)

                if (error) throw error
                setResults(data || [])
            } catch (error) {
                console.error('Error searching users:', error)
            } finally {
                setSearching(false)
            }
        }

        const timeoutId = setTimeout(searchUsers, 500)
        return () => clearTimeout(timeoutId)
    }, [query])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div
                className="bg-black border border-zinc-800 rounded-xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
                    <SearchIcon className="w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500"
                        autoFocus
                    />
                    <button onClick={onClose} className="p-1 hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {searching ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-1">
                            {results.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors"
                                    onClick={() => {
                                        onClose()
                                        router.push(`/u/${user.username}`)
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-800 flex-shrink-0">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-medium">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-semibold text-sm text-white truncate">{user.username}</span>
                                        <span className="text-xs text-zinc-400 truncate">{user.full_name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            No users found.
                        </div>
                    ) : (
                        <div className="text-center py-8 text-zinc-500 text-sm">
                            Type to search for friends.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
