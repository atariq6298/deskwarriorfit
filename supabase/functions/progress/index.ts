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

function startOfDay(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfWeek(date: Date) {
  const d = startOfDay(date)
  const day = d.getDay()
  const diff = day === 0 ? 6 : day - 1
  d.setDate(d.getDate() - diff)
  return d
}

function endOfDay(date: Date) {
  const d = startOfDay(date)
  d.setDate(d.getDate() + 1)
  return d
}

function endOfWeek(date: Date) {
  const d = startOfWeek(date)
  d.setDate(d.getDate() + 7)
  return d
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

      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select('id, activity_type, times_per_day, interval_hours, times_per_week, day_of_week')
        .eq('id', challenge_id)
        .maybeSingle()

      if (challengeError || !challenge) {
        return new Response(JSON.stringify({ error: 'Challenge not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const now = new Date()
      const periodStart = challenge.times_per_week != null
        ? startOfWeek(now)
        : startOfDay(now)
      const periodEnd = challenge.times_per_week != null
        ? endOfWeek(now)
        : endOfDay(now)

      const { data: existing } = await supabase
        .from('user_progress')
        .select('id, completed_at')
        .eq('user_id', user.id)
        .eq('challenge_id', challenge_id)
        .gte('completed_at', periodStart.toISOString())
        .lt('completed_at', periodEnd.toISOString())
        .order('completed_at', { ascending: false })

      const completionLimit = challenge.times_per_week != null
        ? challenge.times_per_week
        : challenge.times_per_day != null
          ? challenge.times_per_day
          : 1

      if ((existing || []).length >= completionLimit) {
        const periodLabel = challenge.times_per_week != null ? 'this week' : 'today'
        return new Response(JSON.stringify({ error: `Challenge already completed enough times ${periodLabel}` }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (challenge.interval_hours != null && existing && existing.length > 0) {
        const lastCompleted = new Date(existing[0].completed_at)
        const nextAllowed = new Date(lastCompleted.getTime() + challenge.interval_hours * 60 * 60 * 1000)
        if (nextAllowed > now) {
          return new Response(JSON.stringify({
            error: 'This routine is not due yet',
            next_available_at: nextAllowed.toISOString(),
          }), {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
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
