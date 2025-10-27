import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  name: string
  bio: string
  tagline: string
  location: string
  age: string
  avatar_url: string
  square_avatar_url: string
  fun_image_url?: string
  email: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  title: string
  description: string
  file_url: string
  file_size: string
  file_type: string
  last_updated: string
  is_active: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  image_url?: string
  featured: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  category: string
  skills: string[]
  icon: string
  color: string
  order_index: number
  created_at: string
  updated_at: string
}
