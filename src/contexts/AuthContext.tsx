'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  is_verified: boolean
  is_private: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

import { supabase } from '@/lib/supabase'

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('insta_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('insta_user')
      }
    }
    setLoading(false)
  }, [])

  const refreshUser = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        const updatedUser = {
          ...data,
          created_at: data.created_at || new Date().toISOString()
        }
        setUser(updatedUser)
        localStorage.setItem('insta_user', JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      localStorage.setItem('insta_user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const signup = async (email: string, username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setUser(data.user)
      localStorage.setItem('insta_user', JSON.stringify(data.user))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('insta_user')
  }

  const value = {
    user,
    login,
    signup,
    logout,
    refreshUser,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}