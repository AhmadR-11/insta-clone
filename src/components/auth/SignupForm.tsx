'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UsernameSuggestion {
  available: boolean
  suggestions?: string[]
}

const SignupForm: React.FC = () => {
  const { signup } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'idle'>('idle')
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([])
  const [usernameCheckTimeout, setUsernameCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')

    // Handle username validation
    if (name === 'username') {
      setUsernameStatus('idle')
      setUsernameSuggestions([])

      // Clear previous timeout
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout)
      }

      // Set new timeout for username checking
      if (value.trim().length >= 3) {
        const timeout = setTimeout(() => {
          checkUsername(value.trim())
        }, 500)
        setUsernameCheckTimeout(timeout)
      }
    }
  }

  const checkUsername = async (username: string) => {
    setUsernameStatus('checking')
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      })

      const data: UsernameSuggestion = await response.json()

      if (data.available) {
        setUsernameStatus('available')
        setUsernameSuggestions([])
      } else {
        setUsernameStatus('taken')
        setUsernameSuggestions(data.suggestions || [])
      }
    } catch (error) {
      setUsernameStatus('idle')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, username: suggestion }))
    setUsernameStatus('available')
    setUsernameSuggestions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (usernameStatus === 'taken') {
      setError('Please choose an available username')
      setLoading(false)
      return
    }

    const result = await signup(formData.email, formData.username, formData.password)

    if (result.success) {
      router.push('/')
    } else {
      setError(result.error || 'Signup failed')
    }

    setLoading(false)
  }

  useEffect(() => {
    return () => {
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout)
      }
    }
  }, [usernameCheckTimeout])

  const getUsernameInputClassName = () => {
    let baseClass = "relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:z-10 sm:text-sm"

    switch (usernameStatus) {
      case 'available':
        return `${baseClass} border-green-300 focus:ring-green-500 focus:border-green-500`
      case 'taken':
        return `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
      case 'checking':
        return `${baseClass} border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500`
      default:
        return `${baseClass} border-gray-300 focus:ring-blue-500 focus:border-blue-500`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Instagram</h1>
          <h2 className="text-lg text-gray-600 mb-4">Sign up to see photos and videos from your friends.</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={getUsernameInputClassName()}
                placeholder="Username"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {usernameStatus === 'checking' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                )}
                {usernameStatus === 'available' && (
                  <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {usernameStatus === 'taken' && (
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>

            {usernameStatus === 'taken' && usernameSuggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700 mb-2">Username is taken. Try these suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {usernameSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-white border border-yellow-300 text-yellow-700 rounded-md text-sm hover:bg-yellow-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password (8+ chars, uppercase, lowercase, number)"
              />
              {formData.password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-20"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              )}
            </div>

            {formData.password.length > 0 && (
              <div className="mt-1 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-red-500'}>
                    {formData.password.length >= 8 ? '✓' : '✗'} 8+ characters
                  </span>
                  <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}>
                    {/[a-z]/.test(formData.password) ? '✓' : '✗'} lowercase
                  </span>
                  <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-red-500'}>
                    {/[A-Z]/.test(formData.password) ? '✓' : '✗'} uppercase
                  </span>
                  <span className={/\d/.test(formData.password) ? 'text-green-600' : 'text-red-500'}>
                    {/\d/.test(formData.password) ? '✓' : '✗'} number
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || usernameStatus === 'taken' || usernameStatus === 'checking'}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">Have an account? </span>
            <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupForm