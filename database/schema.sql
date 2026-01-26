-- Enable Row Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    website VARCHAR(255),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    caption TEXT,
    image_url TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Followers table
CREATE TABLE followers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Likes table
CREATE TABLE likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table
CREATE TABLE stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(10) DEFAULT 'image', -- 'image' or 'video'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Username suggestions function
CREATE OR REPLACE FUNCTION get_username_suggestions(base_username VARCHAR(50))
RETURNS TABLE(suggested_username VARCHAR(50)) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        CASE 
            WHEN NOT EXISTS (SELECT 1 FROM users WHERE username = base_username || generate_series::text)
            THEN base_username || generate_series::text
        END
    FROM generate_series(1, 10)
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = base_username || generate_series::text)
    LIMIT 5;
    
    -- If no numeric suggestions work, try with common suffixes
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT DISTINCT
            CASE 
                WHEN NOT EXISTS (SELECT 1 FROM users WHERE username = base_username || suffix)
                THEN base_username || suffix
            END
        FROM (VALUES ('_official'), ('_real'), ('_'), ('official'), ('real')) AS t(suffix)
        WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = base_username || suffix)
        LIMIT 5;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check username availability
CREATE OR REPLACE FUNCTION check_username_availability(check_username VARCHAR(50))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (SELECT 1 FROM users WHERE username = check_username);
END;
$$ LANGUAGE plpgsql;

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_followers_follower_id ON followers(follower_id);
CREATE INDEX idx_followers_following_id ON followers(following_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_stories_user_id ON stories(user_id);

-- Row Level Security Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Users can view public profiles and their own profile
CREATE POLICY "Users can view public profiles" ON users
    FOR SELECT USING (NOT is_private OR auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Posts visibility based on user privacy
CREATE POLICY "Posts are visible based on privacy" ON posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE users.id = posts.user_id 
            AND (NOT users.is_private OR auth.uid() = users.id)
        )
    );

-- Users can create their own posts
CREATE POLICY "Users can create own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own posts
CREATE POLICY "Users can manage own posts" ON posts
    FOR ALL USING (auth.uid() = user_id);