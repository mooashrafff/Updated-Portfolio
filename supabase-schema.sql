-- Note: auth.users table is managed by Supabase and doesn't need RLS enabled

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  tagline TEXT,
  location TEXT,
  age TEXT,
  avatar_url TEXT,
  square_avatar_url TEXT,
  fun_image_url TEXT,
  email TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT DEFAULT 'PDF',
  last_updated TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('resumes', 'resumes', true),
  ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public resumes are viewable by everyone" ON resumes FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone" ON projects FOR SELECT USING (true);
CREATE POLICY "Public skills are viewable by everyone" ON skills FOR SELECT USING (true);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Resume files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'resumes');
CREATE POLICY "Project images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'projects');

-- Insert sample data
INSERT INTO profiles (name, bio, tagline, location, age, avatar_url, square_avatar_url, email, github_url, linkedin_url, twitter_url) VALUES 
  ('Mohamed Ashraf El Sawy', 'Motivated BIS graduate with a strong mix of technical expertise, event management, and marketing experience.', 'Business Information Systems Graduate • Event & Tech Innovator', 'Cairo, Egypt', '23', '/profile.png', '/avatar.png', 'mohamedashrafalsawyy@gmail.com', 'https://github.com/mooashrafff', 'https://www.linkedin.com/in/mohamed-ashraf-77b89b24b/', 'https://x.com/mooashrraff')
ON CONFLICT DO NOTHING;

INSERT INTO resumes (title, description, file_url, file_size, file_type, last_updated, is_active) VALUES 
  ('Mohamed Ashraf Resume', 'Business Information Systems Graduate • Full-Stack & Event Innovator', '/mohamed_final_cv.pdf', '1.2 MB', 'PDF', 'August 2025', true)
ON CONFLICT DO NOTHING;

-- Create messages table for contact form
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brief TEXT,
  has_website TEXT,
  website_url TEXT,
  start_timeline TEXT,
  services TEXT[],
  budget TEXT,
  deadline TEXT,
  deadline_date TEXT,
  referral_source TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample skills
INSERT INTO skills (category, skills, icon, color, order_index) VALUES 
  ('Frontend Development', ARRAY['HTML', 'CSS', 'JavaScript/TypeScript', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'React', 'Vercel AI SDK'], 'Code', '#3B82F6', 1),
  ('Backend & Systems', ARRAY['Python', 'Typescript', 'Git', 'GitHub', 'PostgreSQL', 'MySQL', 'Oracle', 'Odoo', 'PHP', 'Node.js'], 'Cpu', '#10B981', 2),
  ('Design & Creative Tools', ARRAY['Figma', 'Photoshop', 'Illustrator', 'Canva'], 'PenTool', '#8B5CF6', 3),
  ('Soft Skills', ARRAY['Communication', 'Problem-Solving', 'Adaptability', 'Learning Agility', 'Teamwork', 'Creativity', 'Focus'], 'Users', '#F59E0B', 4)
ON CONFLICT DO NOTHING;

-- Messages table policies
CREATE POLICY "Messages are viewable by everyone" ON messages FOR SELECT USING (true);
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
