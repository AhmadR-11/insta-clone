'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Instagram Clone</h1>
          <p className="text-lg text-gray-600 mb-8">Share your moments with the world</p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-block px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Instagram</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="mb-8">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="h-32 w-32 rounded-full mx-auto mb-4"
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-medium text-gray-700">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.full_name || user.username}!
            </h2>
            <p className="text-lg text-gray-600 mb-4">@{user.username}</p>
            {user.bio && (
              <p className="text-gray-700 max-w-md mx-auto">{user.bio}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Instagram Clone Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-medium text-blue-900 mb-2">Posts</h4>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="text-lg font-medium text-green-900 mb-2">Followers</h4>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="text-lg font-medium text-purple-900 mb-2">Following</h4>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-600 mb-4">
                Your account has been successfully created! Start by uploading your first post.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Upload Your First Post
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Username:</span>
                <span className="text-gray-900">@{user.username}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type:</span>
                <span className="text-gray-900">{user.is_private ? 'Private' : 'Public'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Verified:</span>
                <span className={user.is_verified ? 'text-blue-600' : 'text-gray-500'}>
                  {user.is_verified ? '✓ Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
