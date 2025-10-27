'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SimpleUploadPage() {
  const [status, setStatus] = useState('Ready to upload')
  const [error, setError] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setStatus('Uploading image...')
      setError(null)

      // Convert file to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string
        
        // Update profile with base64 image
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            avatar_url: base64,
            updated_at: new Date().toISOString()
          })
          .eq('id', (await supabase.from('profiles').select('id').single()).data?.id)

        if (updateError) {
          setError(`Database update failed: ${updateError.message}`)
          return
        }

        setUploadedImage(base64)
        setStatus('✅ Image uploaded successfully!')
      }
      
      reader.readAsDataURL(file)
      
    } catch (err) {
      setError(`Upload failed: ${err}`)
      setStatus('❌ Upload failed')
    }
  }

  const testDatabaseConnection = async () => {
    try {
      setStatus('Testing database connection...')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single()

      if (error) {
        setError(`Database error: ${error.message}`)
        setStatus('❌ Database connection failed')
        return
      }

      setStatus('✅ Database connection successful!')
      setError(null)
      
    } catch (err) {
      setError(`Connection failed: ${err}`)
      setStatus('❌ Connection failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Simple Image Upload</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          
          {/* Test Database Connection */}
          <div>
            <button
              onClick={testDatabaseConnection}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              Test Database Connection
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Status */}
          <div>
            <strong>Status:</strong> {status}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 rounded">
              <strong>Error:</strong>
              <pre className="mt-2 text-sm overflow-auto">{error}</pre>
            </div>
          )}

          {/* Image Preview */}
          {uploadedImage && (
            <div>
              <h3 className="font-medium mb-2">Uploaded Image:</h3>
              <img 
                src={uploadedImage} 
                alt="Uploaded" 
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            </div>
          )}

          {/* Instructions */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-bold text-green-800">How This Works:</h3>
            <ul className="mt-2 text-sm text-green-700 list-disc list-inside space-y-1">
              <li>Uploads image as base64 (no storage buckets needed)</li>
              <li>Stores directly in database</li>
              <li>Updates your profile avatar immediately</li>
              <li>Works without Supabase storage issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
