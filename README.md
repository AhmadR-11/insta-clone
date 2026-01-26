# Instagram Clone

A modern Instagram clone built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication System**
  - User login with email/username and password
  - User signup with email, username, and password
  - Real-time username availability checking
  - Smart username suggestions when taken
  - Form validation with Zod
  - Secure password hashing with bcryptjs

- 📱 **User Interface**
  - Modern, responsive design with Tailwind CSS
  - Instagram-like UI components
  - Real-time username validation feedback
  - Loading states and error handling
  - Mobile-first responsive design

- 🗄️ **Database**
  - PostgreSQL database with Supabase
  - Comprehensive database schema
  - Row Level Security (RLS) policies
  - Optimized indexes for performance
  - User profiles, posts, followers, likes, and comments tables

- ⚡ **Technical Features**
  - Server-side API routes with Next.js App Router
  - TypeScript for type safety
  - Proxy configuration instead of middleware
  - Context-based state management
  - Modern React hooks and patterns

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Supabase
- **Authentication**: Custom JWT + bcryptjs
- **Validation**: Zod
- **Deployment Ready**: Vercel/Netlify compatible

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- npm or yarn package manager
- A Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd insta-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_strong_jwt_secret
   DATABASE_URL=your_postgresql_connection_string
   ```

4. **Set up the database**
   
   In your Supabase dashboard:
   - Go to the SQL Editor
   - Copy and paste the content from `database/schema.sql`
   - Run the SQL script to create tables, functions, and policies

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application includes a comprehensive database schema with the following tables:

### Users Table
- User authentication and profile information
- Username uniqueness validation
- Privacy settings and verification status

### Posts Table
- User posts with images and captions
- Like and comment counts
- Location tagging support

### Social Features
- Followers/Following relationships
- Post likes and comments
- Stories with expiration

### Security Features
- Row Level Security (RLS) policies
- Secure password hashing
- JWT-based authentication
- Username validation functions

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── auth/             # Authentication components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
└── lib/                  # Utility libraries
    ├── auth.ts           # Authentication utilities
    ├── supabase.ts       # Supabase configuration
    └── validations.ts    # Zod validation schemas
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/check-username` - Username availability check

### Username Validation
The application includes smart username validation:
- Real-time availability checking
- Automatic suggestions when username is taken
- Format validation (letters, numbers, dots, underscores)
- Length and pattern restrictions

## Features in Detail

### Authentication Flow
1. **Signup**: User enters email, username, and password
2. **Username Validation**: Real-time checking with suggestions
3. **Password Security**: Bcrypt hashing with salt rounds
4. **Login**: Support for email or username login
5. **Session Management**: JWT-based authentication

### Username Suggestions Algorithm
When a username is taken, the system:
1. Tries numeric suffixes (username1, username2, etc.)
2. Tries common suffixes (_official, _real, etc.)
3. Returns up to 5 available suggestions
4. Updates in real-time as user types

### Security Measures
- Password requirements (8+ chars, uppercase, lowercase, number)
- SQL injection protection with parameterized queries
- Row Level Security policies in database
- JWT token expiration and validation
- Secure password hashing with bcrypt

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key

# Database URL (optional, for direct connections)
DATABASE_URL=postgresql://user:password@host:port/database
```

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Setup for Production
- Set all environment variables in your deployment platform
- Ensure Supabase URL and keys are configured
- Verify JWT_SECRET is a strong, unique value

## Development Guidelines

### Code Style
- Use TypeScript for all components and utilities
- Follow React best practices and hooks patterns
- Implement proper error handling and loading states
- Use Tailwind CSS for consistent styling

### Database Best Practices
- Always use parameterized queries
- Implement proper RLS policies
- Index frequently queried columns
- Validate data on both client and server

### Security Considerations
- Never expose sensitive keys in client-side code
- Validate all user inputs
- Use HTTPS in production
- Implement proper CORS policies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review the database schema
- Examine the API endpoints
- Test the authentication flow

## Next Steps

To extend this application, consider adding:
- Image upload functionality
- Post creation and feed
- Real-time messaging
- Push notifications
- Advanced privacy controls
- Content moderation
- Mobile app with React Native
