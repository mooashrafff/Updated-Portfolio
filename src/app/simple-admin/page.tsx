'use client'

import { useState, useEffect } from 'react'
import { supabase, Profile } from '@/lib/supabase'

export default function SimpleAdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error: any) {
      console.error('Error fetching profile:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!profile) return
    setSaving(true)
    setStatus('Saving...')
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          bio: profile.bio,
          tagline: profile.tagline,
          location: profile.location,
          age: profile.age,
          email: profile.email,
          github_url: profile.github_url,
          linkedin_url: profile.linkedin_url,
          twitter_url: profile.twitter_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)
      
      if (error) throw error
      setStatus('✅ Profile updated successfully!')
    } catch (error: any) {
      setStatus(`❌ Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setStatus('Uploading image...')
    
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        const { error } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: base64,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile?.id)

        if (error) throw error
        
        setStatus('✅ Image uploaded successfully!')
        fetchProfile() // Refresh data
      }
      
      reader.readAsDataURL(file)
      
    } catch (error: any) {
      setStatus(`❌ Upload failed: ${error.message}`)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Simple Admin Panel</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Status */}
        {status && (
          <div className={`p-4 rounded-lg ${status.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>
          
          {profile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tagline</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.tagline}
                  onChange={(e) => setProfile({...profile, tagline: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>

              <button
                onClick={updateProfile}
                disabled={saving}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
          
          <div className="space-y-4">
            {profile?.avatar_url && (
              <div>
                <label className="block text-sm font-medium mb-2">Current Image:</label>
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Upload New Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-green-50 file:text-green-700
                  hover:file:bg-green-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
