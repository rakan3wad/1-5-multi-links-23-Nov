import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user } = await req.json()
    
    if (!user?.id || !user?.email) {
      throw new Error('Missing user data')
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username || user.email.split('@')[0],
        display_name: user.user_metadata?.display_name || null,
        updated_at: new Date().toISOString()
      })
      .single()

    if (profileError) {
      throw profileError
    }

    return new Response(JSON.stringify({ profile }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
