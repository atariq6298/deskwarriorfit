import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const url = new URL(req.url)
  const isToday = url.pathname.endsWith('/today')

  try {
    if (isToday) {
      const dayOfWeek = new Date().getDay()
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, description, category, points, activity_type, day_of_week, times_per_day, interval_hours, times_per_week')
        .or(`activity_type.eq.routine,day_of_week.eq.${dayOfWeek}`)
        .order('activity_type', { ascending: true })
        .order('day_of_week', { ascending: true, nullsFirst: true })

      if (error) throw error
      return new Response(JSON.stringify({ challenges: data || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } else {
      const { data, error } = await supabase
        .from('challenges')
        .select('id, title, description, category, points, activity_type, day_of_week, times_per_day, interval_hours, times_per_week')
        .order('activity_type', { ascending: true })
        .order('day_of_week', { ascending: true, nullsFirst: true })
        .order('title', { ascending: true })

      if (error) throw error
      return new Response(JSON.stringify({ challenges: data || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  } catch (err) {
    console.error('Error fetching challenges:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch challenges' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
