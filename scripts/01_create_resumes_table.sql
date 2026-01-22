-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  
  -- Personal Info
  full_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  linkedin TEXT,
  github TEXT,
  
  -- Summary
  summary TEXT,
  
  -- Skills (stored as JSON array)
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Experience (stored as JSON array)
  experience JSONB DEFAULT '[]'::jsonb,
  
  -- Projects (stored as JSON array)
  projects JSONB DEFAULT '[]'::jsonb,
  
  -- Education (stored as JSON array)
  education JSONB DEFAULT '[]'::jsonb,
  
  -- Achievements/Awards (stored as JSON array)
  achievements JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_updated_at ON resumes(updated_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
