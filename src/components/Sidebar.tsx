'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    Home,
    Search,
    Compass,
    MessageCircle,
    Heart,
    PlusSquare,
    User,
    LogOut,
    Menu
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import SearchModal from './search/SearchModal'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { logout, user } = useAuth()
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: Search, label: 'Search', action: () => setIsSearchOpen(true) },
        { icon: Compass, label: 'Explore', href: '/explore' }, // Placeholder
        { icon: MessageCircle, label: 'Messages', href: '/messages' }, // Placeholder
        { icon: Heart, label: 'Notifications', href: '/notifications' }, // Placeholder
        { icon: PlusSquare, label: 'Create', href: '#' }, // Placeholder
        { icon: User, label: 'Profile', href: '/profile' },
    ]

    return (
        <>
            <aside className="fixed left-0 top-0 h-full bg-black border-r border-zinc-800 z-50 transition-all duration-300 w-16 hover:w-64 group flex flex-col">
                <div className="p-4 mb-4 flex items-center justify-center group-hover:justify-start overflow-hidden whitespace-nowrap">
                    {/* Logo Icon (Small) */}
                    <div className="block group-hover:hidden">
                        <svg aria-label="Instagram" fill="white" height="24" role="img" viewBox="0 0 24 24" width="24">
                            <rect fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="24" x="0" y="0"></rect>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="12" x2="12" y1="6" y2="18"></line>
                            <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="6" x2="18" y1="12" y2="12"></line>
                        </svg>
                    </div>
                    {/* Logo Text (Large - shown on hover) */}
                    <h1 className="hidden group-hover:block text-xl font-bold tracking-wider transition-opacity duration-300 pl-2">
                        Instagram
                    </h1>
                </div>

                <nav className="flex-1 px-2 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = item.href ? pathname === item.href : false
                        const Icon = item.icon

                        return (
                            <div key={index}>
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-colors ${isActive ? 'font-bold' : ''
                                            } group/item`}
                                    >
                                        <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'stroke-[3px]' : ''}`} />
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden delay-75">
                                            {item.label}
                                        </span>
                                    </Link>
                                ) : (
                                    <button
                                        onClick={item.action}
                                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-colors group/item"
                                    >
                                        <Icon className="w-6 h-6 shrink-0" />
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden delay-75">
                                            {item.label}
                                        </span>
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </nav>

                <div className="p-2 mt-auto">
                    {/* More / Menu Placeholder */}
                    <button className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-colors">
                        <Menu className="w-6 h-6 shrink-0" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden delay-75 text-left">
                            More
                        </span>
                    </button>

                    {/* Profile Link (Already in nav but user asked for Profile above Logout specifically. 
               The nav list has Profile. The user said: "above of the logout button there is profile icon". 
               My nav list has Profile at the end. Then Logout.
           */}

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 text-red-500 transition-colors mt-2"
                    >
                        <LogOut className="w-6 h-6 shrink-0" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden delay-75 text-left">
                            Log out
                        </span>
                    </button>
                </div>
            </aside>

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    )
}
