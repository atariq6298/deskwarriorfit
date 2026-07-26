const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /api/challenges/today — public, returns challenges for today's day of week
router.get('/today', async (req, res) => {
  try {
    // day_of_week: 0 = Sunday, 1 = Monday, …, 6 = Saturday
    const dayOfWeek = new Date().getDay();
    const { data, error } = await supabase
      .from('challenges')
      .select('id, title, description, category, points')
      .eq('day_of_week', dayOfWeek);

    if (error) throw error;
    res.json({ challenges: data || [] });
  } catch (err) {
    console.error('Error fetching today\'s challenges:', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

// GET /api/challenges — public, returns all challenges
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('id, title, description, category, points, day_of_week')
      .order('day_of_week', { ascending: true });

    if (error) throw error;
    res.json({ challenges: data || [] });
  } catch (err) {
    console.error('Error fetching challenges:', err);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

module.exports = router;
