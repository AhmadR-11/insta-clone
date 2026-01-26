// Constants used throughout the application

export const APP_CONFIG = {
  name: 'Instagram Clone',
  description: 'A modern Instagram clone built with Next.js and Supabase',
  version: '1.0.0',
  author: 'Your Name',
}

export const AUTH_CONFIG = {
  tokenExpiry: '7d',
  passwordMinLength: 8,
  usernameMinLength: 3,
  usernameMaxLength: 50,
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
}

export const VALIDATION_RULES = {
  username: {
    pattern: /^[a-zA-Z0-9._]+$/,
    minLength: 3,
    maxLength: 50,
    blacklist: [
      'admin', 'administrator', 'root', 'instagram', 'insta',
      'support', 'help', 'api', 'www', 'mail', 'email',
      'test', 'demo', 'null', 'undefined', 'system'
    ]
  },
  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    minLength: 8,
    maxLength: 128,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
  }
}

export const UI_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedVideoTypes: ['video/mp4', 'video/webm', 'video/ogg'],
  defaultAvatarSize: 150,
  thumbnailSize: 300,
  maxCaptionLength: 2200,
  maxBioLength: 150,
  maxUsernameLength: 50,
}

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    checkUsername: '/api/auth/check-username',
    refreshToken: '/api/auth/refresh',
  },
  user: {
    profile: '/api/user/profile',
    updateProfile: '/api/user/update',
    uploadAvatar: '/api/user/avatar',
    search: '/api/user/search',
  },
  posts: {
    create: '/api/posts/create',
    feed: '/api/posts/feed',
    userPosts: '/api/posts/user',
    like: '/api/posts/like',
    unlike: '/api/posts/unlike',
    delete: '/api/posts/delete',
  }
}

export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email/username or password',
    userNotFound: 'User not found',
    emailExists: 'Email already exists',
    usernameExists: 'Username already taken',
    weakPassword: 'Password must contain at least 8 characters with uppercase, lowercase, and numbers',
    invalidEmail: 'Please enter a valid email address',
    invalidUsername: 'Username can only contain letters, numbers, dots, and underscores',
    networkError: 'Network error. Please check your connection and try again',
    serverError: 'Server error. Please try again later',
  },
  validation: {
    required: 'This field is required',
    minLength: (min: number) => `Minimum ${min} characters required`,
    maxLength: (max: number) => `Maximum ${max} characters allowed`,
    invalidFormat: 'Invalid format',
  }
}

export const SUCCESS_MESSAGES = {
  auth: {
    loginSuccess: 'Successfully logged in',
    signupSuccess: 'Account created successfully',
    logoutSuccess: 'Successfully logged out',
  },
  profile: {
    updateSuccess: 'Profile updated successfully',
    avatarUploadSuccess: 'Profile picture updated',
  },
  posts: {
    createSuccess: 'Post created successfully',
    deleteSuccess: 'Post deleted successfully',
  }
}

export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  profile: '/profile',
  explore: '/explore',
  direct: '/direct',
  activity: '/activity',
  settings: '/settings',
}

export const STORAGE_KEYS = {
  user: 'insta_user',
  theme: 'insta_theme',
  language: 'insta_language',
}