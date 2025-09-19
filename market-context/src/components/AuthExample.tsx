'use client'

import { useSupabase } from '@/hooks/useSupabase'
import { getCurrentUserProfile } from '@/lib/profile'
import { useState, useEffect } from 'react'
import type { Profile } from '@/types/supabase'

export default function AuthExample() {
  const { user, loading, supabase } = useSupabase()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const signInWithEmail = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) console.error('Error signing in:', error)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
  }

  const fetchProfile = async () => {
    if (!user) return
    
    setProfileLoading(true)
    const userProfile = await getCurrentUserProfile()
    setProfile(userProfile)
    setProfileLoading(false)
  }

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
    }
  }, [user])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Supabase Auth Example</h2>
      
      {user ? (
        <div>
          <p className="mb-2">Signed in as: {user.email}</p>
          <p className="mb-4">User ID: {user.id}</p>
          
          <div className="mb-4">
            <button
              onClick={fetchProfile}
              disabled={profileLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {profileLoading ? 'Loading...' : 'Fetch Profile'}
            </button>
          </div>
          
          {profile && (
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold">Profile Data:</h3>
              <pre className="text-sm">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          )}
          
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Not signed in</p>
          <button
            onClick={() => signInWithEmail('test@example.com')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Sign In with Email (Magic Link)
          </button>
        </div>
      )}
    </div>
  )
}
