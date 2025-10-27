'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing connection...')
  const [data, setData] = useState<any>(null)

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...')
      
      // Test basic connection
      const { data: testData, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      if (error) {
        setStatus(`Error: ${error.message}`)
        setData(error)
      } else {
        setStatus('✅ Supabase connection successful!')
        setData(testData)
      }
    } catch (err) {
      setStatus(`Connection failed: ${err}`)
      setData(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <button
            onClick={testConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            Test Supabase Connection
          </button>
          
          <div className="mb-4">
            <strong>Status:</strong> {status}
          </div>
          
          {data && (
            <div>
              <strong>Data:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
