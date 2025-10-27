'use client'

import { useState, useEffect } from 'react'
import { supabase, Profile, Resume } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Save, Download, Image, User, FileText, Smile } from 'lucide-react'

export default function AdminPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [resume, setResume] = useState<Resume | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .single()

      // Fetch resume
      const { data: resumeData } = await supabase
        .from('resumes')
        .select('*')
        .eq('is_active', true)
        .single()

      setProfile(profileData)
      setResume(resumeData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile() {
    if (!profile) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  async function uploadResume(file: File) {
    setSaving(true)
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop()
      const fileName = `resume-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-resumes')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-resumes')
        .getPublicUrl(fileName)

      // Update resume record
      const { error: updateError } = await supabase
        .from('resumes')
        .update({
          file_url: publicUrl,
          file_size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          last_updated: new Date().toLocaleDateString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', resume?.id)

      if (updateError) throw updateError

      alert('Resume updated successfully!')
      fetchData() // Refresh data
    } catch (error) {
      console.error('Error uploading resume:', error)
      alert('Error uploading resume')
    } finally {
      setSaving(false)
    }
  }

  async function uploadImage(file: File, imageType: 'avatar' | 'profile' | 'fun') {
    setUploadingImage(imageType)
    try {
      // Check if file is too large (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB')
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${imageType}-${Date.now()}.${fileExt}`
      
      console.log('Uploading file:', fileName, 'to avatars bucket')
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-avatars')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-avatars')
        .getPublicUrl(fileName)

      console.log('Got public URL:', publicUrl)

      // Update profile record
      const updateData: any = {}
      if (imageType === 'avatar') {
        updateData.square_avatar_url = publicUrl
      } else if (imageType === 'profile') {
        updateData.avatar_url = publicUrl
      } else if (imageType === 'fun') {
        updateData.fun_image_url = publicUrl
      }

      console.log('Updating profile with:', updateData)

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile?.id)

      if (updateError) {
        console.error('Update error:', updateError)
        throw new Error(`Database update failed: ${updateError.message}`)
      }

      alert(`${imageType} image updated successfully!`)
      fetchData() // Refresh data
    } catch (error) {
      console.error(`Error uploading ${imageType} image:`, error)
      alert(`Error uploading ${imageType} image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingImage(null)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Admin</h1>
        
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile && (
              <>
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
                
                <Button onClick={updateProfile} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Resume Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Resume Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resume && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Resume Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resume.title}
                    onChange={(e) => setResume({...resume, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Resume Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={resume.description}
                    onChange={(e) => setResume({...resume, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Current Resume File</label>
                  <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{resume.title}</p>
                      <p className="text-sm text-gray-600">
                        {resume.file_size} • Updated {resume.last_updated}
                      </p>
                    </div>
                    <Button asChild variant="outline">
                      <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Upload New Resume</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) uploadResume(file)
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                <Button onClick={() => {
                  // Update resume text
                  supabase.from('resumes').update({
                    title: resume.title,
                    description: resume.description,
                    updated_at: new Date().toISOString()
                  }).eq('id', resume.id).then(() => {
                    alert('Resume text updated successfully!')
                  })
                }} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Resume Text'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Image Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Image Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile && (
              <>
                {/* Profile Picture */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <h3 className="font-medium">Profile Picture (Main)</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.avatar_url && (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadImage(file, 'profile')
                        }}
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {uploadingImage === 'profile' && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>

                {/* Avatar (Square) */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <h3 className="font-medium">Avatar (Square)</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.square_avatar_url && (
                      <img 
                        src={profile.square_avatar_url} 
                        alt="Avatar" 
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadImage(file, 'avatar')
                        }}
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {uploadingImage === 'avatar' && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>

                {/* Fun Section Image */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smile className="w-4 h-4" />
                    <h3 className="font-medium">Fun Section Image</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {profile.fun_image_url && (
                      <img 
                        src={profile.fun_image_url} 
                        alt="Fun" 
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) uploadImage(file, 'fun')
                        }}
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                      {uploadingImage === 'fun' && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
