const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/progress — protected, returns current user's progress and streak
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        id,
        completed_at,
        challenge_id,
        challenges (id, title, category, points)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) throw error;

    const streak = calculateStreak(data || []);
    res.json({ progress: data || [], streak });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress — protected, marks a challenge as complete for today
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challenge_id } = req.body;

    if (!challenge_id) {
      return res.status(400).json({ error: 'challenge_id is required' });
    }

    // Prevent duplicate completions on the same calendar day
    const today = new Date().toISOString().split('T')[0];
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('challenge_id', challenge_id)
      .gte('completed_at', `${today}T00:00:00.000Z`)
      .lte('completed_at', `${today}T23:59:59.999Z`)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'Challenge already completed today' });
    }

    const { data, error } = await supabase
      .from('user_progress')
      .insert({ user_id: userId, challenge_id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ progress: data });
  } catch (err) {
    console.error('Error saving progress:', err);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

function calculateStreak(progressRows) {
  if (!progressRows.length) return 0;

  const completedDays = new Set(
    progressRows.map(row => row.completed_at.split('T')[0])
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i <= 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (completedDays.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return streak;
}

module.exports = router;
