import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ncgqcqkarzofltmllbpx.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZ3FjcWthcnpvZmx0bWxsYnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MTQ0MDEsImV4cCI6MjA5NjQ5MDQwMX0.IeJIFVwv5lRUR5AHyldBR2QD-ZO3n4GYjXVmvS3Ujdk'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function getUserRole(userId: string): Promise<'admin' | 'client'> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    if (error || !data) return 'client'
    return data.role as 'admin' | 'client'
  } catch {
    return 'client'
  }
}

