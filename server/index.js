const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const challengesRouter = require('./routes/challenges');
const progressRouter = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 3000;
const rootDir = path.join(__dirname, '..');

app.use(cors());
app.use(express.json());

// Expose Supabase public config to frontend pages
app.get('/api/config.js', (req, res) => {
  res.type('application/javascript');
  res.send([
    `window.SUPABASE_URL = ${JSON.stringify(process.env.SUPABASE_URL || '')};`,
    `window.SUPABASE_ANON_KEY = ${JSON.stringify(process.env.SUPABASE_ANON_KEY || '')};`,
  ].join('\n'));
});

// API routes
app.use('/api/challenges', challengesRouter);
app.use('/api/progress', progressRouter);

// Static files from public/ (auth.html, dashboard.html, assets)
app.use(express.static(path.join(rootDir, 'public')));

// Landing page served from repo root
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Fallback for any unmatched route
app.use((req, res) => {
  res.status(404).sendFile(path.join(rootDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DeskWarriorFit running on http://localhost:${PORT}`);
});
