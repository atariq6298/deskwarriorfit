import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function calculateStreak(progressRows: { completed_at: string }[]) {
  if (!progressRows.length) return 0

  const completedDays = new Set(
    progressRows.map(row => row.completed_at.split('T')[0])
  )

  let streak = 0
  const today = new Date()

  for (let i = 0; i <= 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    if (completedDays.has(dateStr)) {
      streak++
    } else if (i > 0) {
      break
    }
  }

  return streak
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Create client with user's JWT so RLS is enforced
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('id, completed_at, challenge_id, challenges (id, title, category, points)')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

      if (error) throw error

      const streak = calculateStreak(data || [])
      return new Response(JSON.stringify({ progress: data || [], streak }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Error fetching progress:', err)
      return new Response(JSON.stringify({ error: 'Failed to fetch progress' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { challenge_id } = await req.json()

      if (!challenge_id) {
        return new Response(JSON.stringify({ error: 'challenge_id is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const today = new Date().toISOString().split('T')[0]
      const { data: existing } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('challenge_id', challenge_id)
        .gte('completed_at', `${today}T00:00:00.000Z`)
        .lte('completed_at', `${today}T23:59:59.999Z`)
        .maybeSingle()

      if (existing) {
        return new Response(JSON.stringify({ error: 'Challenge already completed today' }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data, error } = await supabase
        .from('user_progress')
        .insert({ user_id: user.id, challenge_id })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify({ progress: data }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (err) {
      console.error('Error saving progress:', err)
      return new Response(JSON.stringify({ error: 'Failed to save progress' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  return new Response('Method not allowed', { status: 405, headers: corsHeaders })
})
