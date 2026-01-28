'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = ['/login', '/signup'].includes(pathname)

    if (isAuthPage) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-black text-white">
            <Sidebar />
            <main className="flex-1 ml-16 transition-all duration-300 w-full">
                <div className="mx-auto max-w-4xl p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
