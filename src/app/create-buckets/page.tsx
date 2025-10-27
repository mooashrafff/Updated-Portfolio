'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CreateBucketsPage() {
  const [status, setStatus] = useState('Ready to create buckets')
  const [error, setError] = useState<string | null>(null)

  const createBucketsDirectly = async () => {
    try {
      setStatus('Creating buckets directly...')
      setError(null)

      // Try to create portfolio-avatars bucket
      const { data: avatarsData, error: avatarsError } = await supabase.storage.createBucket('portfolio-avatars', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880
      })

      if (avatarsError) {
        console.log('Avatars bucket error:', avatarsError)
        if (avatarsError.message.includes('already exists')) {
          setStatus('✅ Avatars bucket already exists')
        } else {
          setError(`Avatars bucket error: ${avatarsError.message}`)
          return
        }
      } else {
        setStatus('✅ Avatars bucket created successfully')
      }

      // Try to create portfolio-resumes bucket
      const { data: resumesData, error: resumesError } = await supabase.storage.createBucket('portfolio-resumes', {
        public: true,
        allowedMimeTypes: ['application/pdf'],
        fileSizeLimit: 10485760
      })

      if (resumesError) {
        console.log('Resumes bucket error:', resumesError)
        if (resumesError.message.includes('already exists')) {
          setStatus('✅ Both buckets exist or created successfully')
        } else {
          setError(`Resumes bucket error: ${resumesError.message}`)
          return
        }
      } else {
        setStatus('✅ Both buckets created successfully')
      }

      // List all buckets to verify
      const { data: buckets, error: listError } = await supabase.storage.listBuckets()
      if (listError) {
        setError(`Error listing buckets: ${listError.message}`)
        return
      }

      setStatus(`✅ Success! Found ${buckets.length} buckets: ${buckets.map(b => b.name).join(', ')}`)

    } catch (err) {
      setError(`Unexpected error: ${err}`)
      setStatus('❌ Failed to create buckets')
    }
  }

  const testUpload = async () => {
    try {
      setStatus('Testing upload...')
      
      // Create a simple test file
      const testContent = 'test'
      const testFile = new File([testContent], 'test.txt', { type: 'text/plain' })
      
      const { data, error } = await supabase.storage
        .from('portfolio-avatars')
        .upload('test-file.txt', testFile)

      if (error) {
        setError(`Upload test failed: ${error.message}`)
        return
      }

      setStatus('✅ Upload test successful! Buckets are working.')
      
      // Clean up test file
      await supabase.storage.from('portfolio-avatars').remove(['test-file.txt'])

    } catch (err) {
      setError(`Upload test error: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Direct Bucket Creation</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <button
            onClick={createBucketsDirectly}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 mr-4"
          >
            Create Buckets Directly
          </button>
          
          <button
            onClick={testUpload}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
          >
            Test Upload
          </button>
          
          <div className="mt-4">
            <strong>Status:</strong> {status}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded">
              <strong>Error:</strong>
              <pre className="mt-2 text-sm overflow-auto">{error}</pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
          <h3 className="font-bold text-yellow-800">Manual Steps if Above Fails:</h3>
          <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li>Go to Supabase Dashboard → Storage</li>
            <li>Click "New bucket" or "+" button</li>
            <li>Create bucket named: <code>portfolio-avatars</code></li>
            <li>Make it PUBLIC (very important!)</li>
            <li>Set file size limit: 5242880 (5MB)</li>
            <li>Set allowed types: image/*</li>
            <li>Repeat for <code>portfolio-resumes</code> bucket</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
