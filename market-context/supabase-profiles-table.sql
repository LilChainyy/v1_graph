-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on profile changes
CREATE OR REPLACE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create event_votes table
CREATE TABLE IF NOT EXISTS event_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('yes', 'no', 'unsure')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable Row Level Security on event_votes
ALTER TABLE event_votes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own votes
CREATE POLICY "Users can read their own votes" ON event_votes
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own votes
CREATE POLICY "Users can insert their own votes" ON event_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own votes
CREATE POLICY "Users can update their own votes" ON event_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own votes
CREATE POLICY "Users can delete their own votes" ON event_votes
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to update updated_at on vote changes
CREATE OR REPLACE TRIGGER on_event_votes_updated
  BEFORE UPDATE ON event_votes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
