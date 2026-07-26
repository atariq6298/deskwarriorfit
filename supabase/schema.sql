-- ============================================================
-- DeskWarriorFit — Supabase SQL schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------
-- challenges
-- ----------------------------------------------------------
create table if not exists challenges (
  id           uuid primary key default uuid_generate_v4(),
  title        text    not null,
  description  text,
  category     text    not null check (category in ('move', 'recover', 'fuel')),
  points       integer not null default 10,
  day_of_week  integer not null check (day_of_week between 0 and 6),
  created_at   timestamptz default now()
);

-- Challenges are publicly readable; only service-role can write
alter table challenges enable row level security;

create policy "Challenges are publicly readable" on challenges
  for select using (true);

-- ----------------------------------------------------------
-- user_progress
-- ----------------------------------------------------------
create table if not exists user_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  challenge_id  uuid not null references challenges(id) on delete cascade,
  completed_at  timestamptz default now()
);

alter table user_progress enable row level security;

-- Users can read, insert, and delete only their own rows
create policy "Users can view own progress" on user_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on user_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own progress" on user_progress
  for delete using (auth.uid() = user_id);

-- ----------------------------------------------------------
-- Seed data — sample weekly challenges
-- ----------------------------------------------------------
insert into challenges (title, description, category, points, day_of_week) values
  -- Monday (1)
  ('Hip Flexor Release',      'Gentle hip flexor stretch to undo hours of sitting. Hold each side for 30 seconds.', 'move',    10, 1),
  ('Shoulder Roll Reset',     '10 slow shoulder circles forward and backward to release upper-body tension.',       'move',    10, 1),
  ('Hydration Check',         'Drink a full glass of water and refill your bottle. Aim for 2 L before 3 pm.',      'fuel',     5, 1),
  -- Tuesday (2)
  ('Thoracic Extension',      'Place a rolled towel behind your mid-back and extend gently over it for 2 minutes.','recover', 10, 2),
  ('Focus Reset Walk',        '5-minute walk — no phone. Let your mind wander and reset.',                         'move',    15, 2),
  ('Protein Lunch Reminder',  'Include a palm-sized protein source in your lunch to avoid the 3 pm crash.',        'fuel',     5, 2),
  -- Wednesday (3)
  ('Neck Stretch Series',     'Gently tilt your head to each side, hold 20 s. Then chin tucks — 10 reps.',        'move',    10, 3),
  ('Screen Distance Check',   'Monitor at arm''s length; top of screen at eye level.',                             'recover',  5, 3),
  ('Mindful Eating Break',    'Eat away from your screen — even for 10 minutes.',                                  'fuel',    10, 3),
  -- Thursday (4)
  ('Calf Raises',             '3 × 15 calf raises at your standing desk or beside your chair.',                   'move',    10, 4),
  ('Sleep Wind-Down Reminder','Set a reminder to stop screens 30 min before your target sleep time.',              'recover', 10, 4),
  ('Healthy Snack Swap',      'Replace one processed snack with nuts, fruit, or yoghurt today.',                   'fuel',     5, 4),
  -- Friday (5)
  ('Spinal Twist Stretch',    'Seated spinal twist — 30 s each side. Excellent for lumbar decompression.',         'move',    10, 5),
  ('20-20-20 Eye Rule',       'Every 20 min, look at something 20 feet away for 20 seconds.',                      'recover',  5, 5),
  ('Caffeine Cutoff',         'No caffeine after 2 pm to protect sleep quality.',                                  'fuel',    10, 5),
  -- Saturday (6)
  ('Desk-to-Floor Stretch',   'Stand, hinge at hips, let arms hang toward the floor. Hold 30 seconds.',           'move',    10, 6),
  ('Power Nap Protocol',      'If energy crashes, try a 10-minute rest with eyes closed.',                         'recover', 15, 6),
  ('Digital Detox Hour',      'One hour away from all screens — read, stretch, or simply rest.',                   'recover', 20, 6),
  -- Sunday (0)
  ('Weekend Meal Prep',       'Prepare at least 2 healthy lunch options for next week.',                           'fuel',    20, 0),
  ('Active Recovery Walk',    '20-minute walk outdoors — bonus for green space.',                                  'move',    20, 0);
