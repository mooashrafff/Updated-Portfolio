'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugSupabase() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...')
      
      // Test 1: Basic connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (testError) {
        setError(`Database Error: ${testError.message}`)
        setStatus('❌ Database connection failed')
        return
      }

      setStatus('✅ Database connection successful!')
      
      // Test 2: Storage buckets
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
      
      if (bucketError) {
        setError(`Storage Error: ${bucketError.message}`)
        setStatus('❌ Storage access failed')
        return
      }

      setStatus(`✅ Storage working! Found ${buckets.length} buckets`)
      
      // Test 3: Check if avatars bucket exists
      const avatarsBucket = buckets.find(b => b.name === 'portfolio-avatars' || b.name === 'avatars')
      if (!avatarsBucket) {
        setError(`❌ "portfolio-avatars" or "avatars" bucket not found. Available buckets: ${buckets.map(b => b.name).join(', ')}`)
        setStatus('❌ Missing avatars bucket')
        return
      }

      // Test 4: Check bucket permissions
      if (!avatarsBucket.public) {
        setError('❌ "avatars" bucket exists but is not public. Please make it public.')
        setStatus('❌ Avatars bucket not public')
        return
      }

      setStatus('✅ All tests passed! Ready to upload images.')
      
    } catch (err) {
      setError(`Connection failed: ${err}`)
      setStatus('❌ Connection failed')
    }
  }

  const createBuckets = async () => {
    try {
      setStatus('Creating storage buckets...')
      
      // Create avatars bucket
      const { data: avatarsData, error: avatarsError } = await supabase.storage.createBucket('portfolio-avatars', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (avatarsError && !avatarsError.message.includes('already exists')) {
        setError(`Error creating avatars bucket: ${avatarsError.message}`)
        return
      }

      // Create resumes bucket
      const { data: resumesData, error: resumesError } = await supabase.storage.createBucket('portfolio-resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (resumesError && !resumesError.message.includes('already exists')) {
        setError(`Error creating resumes bucket: ${resumesError.message}`)
        return
      }

      setStatus('✅ Storage buckets created successfully!')
      
    } catch (err) {
      setError(`Error creating buckets: ${err}`)
    }
  }

  const addMissingColumn = async () => {
    try {
      setStatus('Adding missing database column...')
      
      // This would need to be done in Supabase SQL editor
      setStatus('⚠️ Please run this SQL in Supabase dashboard:')
      setError(`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS fun_image_url TEXT;`)
      
    } catch (err) {
      setError(`Error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Debug Tool</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <button
            onClick={testConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Test Connection
          </button>
          
          <button
            onClick={createBuckets}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
          >
            Create Storage Buckets
          </button>
          
          <button
            onClick={addMissingColumn}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Show SQL for Missing Column
          </button>
          
          <div className="mt-4">
            <strong>Status:</strong> {status}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
              <strong>Error/Info:</strong>
              <pre className="mt-2 text-sm overflow-auto">{error}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
