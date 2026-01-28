'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) return null

  // Placeholder Stories
  const stories = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    username: `user_${i}`,
    avatar: `https://i.pravatar.cc/150?u=${i}`
  }))

  // Placeholder Posts
  const posts = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    username: `friend_${i}`,
    avatar: `https://i.pravatar.cc/150?u=${i + 10}`,
    image: `https://picsum.photos/seed/${i}/600/600`, // Random placeholder images
    likes: Math.floor(Math.random() * 1000),
    caption: `This is a sample post caption for post #${i + 1}. #nextjs #instagram`
  }))

  return (
    <div className="max-w-[630px] mx-auto w-full">
      {/* Stories Section */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map(story => (
          <div key={story.id} className="flex flex-col items-center gap-1 min-w-[66px]">
            <div className="w-[66px] h-[66px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
              <div className="w-full h-full rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                <img src={story.avatar} alt="story" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs truncate w-full text-center text-zinc-300">
              {story.username}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Section */}
      <div className="space-y-8">
        {posts.map(post => (
          <div key={post.id} className="border-b border-zinc-800 pb-6 mb-6">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
                  <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                </div>
                <span className="font-semibold text-sm hover:text-zinc-300 transition-colors">
                  {post.username}
                </span>
                <span className="text-zinc-500 text-xs">• 2h</span>
              </div>
              <button className="text-zinc-400 hover:text-white">
                <svg aria-label="More options" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><circle cx="12" cy="12" r="1.5"></circle><circle cx="6" cy="12" r="1.5"></circle><circle cx="18" cy="12" r="1.5"></circle></svg>
              </button>
            </div>

            {/* Post Image */}
            <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square mb-3">
              <img src={post.image} alt="post" className="w-full h-full object-cover" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button className="hover:opacity-70">
                  <svg aria-label="Like" fill="none" height="24" role="img" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M14 9l-6 6"></path><path d="M10 9l6 6"></path><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <button className="hover:opacity-70">
                  <svg aria-label="Comment" fill="none" height="24" role="img" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                <button className="hover:opacity-70">
                  <svg aria-label="Share Post" fill="none" height="24" role="img" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="2" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                </button>
              </div>
              <button className="hover:opacity-70">
                <svg aria-label="Save" fill="none" height="24" role="img" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
              </button>
            </div>

            {/* Likes */}
            <div className="font-semibold text-sm mb-1">
              {post.likes.toLocaleString()} likes
            </div>

            {/* Caption */}
            <div className="text-sm">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </div>

            {/* Add Comment */}
            <div className="mt-2">
              <input type="text" placeholder="Add a comment..." className="bg-transparent text-sm w-full outline-none text-zinc-400 placeholder-zinc-600" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
