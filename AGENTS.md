# AGENTS.md

## Repository overview
- **Project:** DeskWarriorFit
- **Site type:** Full-stack Node.js/Express web app, deployed on Render.com
- **Custom domain:** `deskwarriorfit.com`
- **Mission:** Help desk workers enjoy a healthier life
- **Auth & DB:** Supabase (email auth + Postgres + Row Level Security)

## Architecture
- **Frontend:** Static HTML/CSS/JS hosted on GitHub Pages (`main` branch root)
- **Backend API:** Supabase Edge Functions (Deno) — no server/Express needed
- **Database:** Supabase Postgres with RLS
- **Auth:** Supabase Auth (email/password), handled entirely client-side via `@supabase/supabase-js`

## Project structure
```
/
├── index.html              ← Landing page
├── auth.html               ← Login / Sign Up page
├── dashboard.html          ← Logged-in user view (challenges + streak)
├── CNAME                   ← Custom domain for GitHub Pages
├── supabase/
│   ├── schema.sql          ← DB schema (already applied — do not re-run blindly)
│   └── functions/
│       ├── challenges/
│       │   └── index.ts    ← Edge Function: GET /challenges, GET /challenges/today
│       └── progress/
│           └── index.ts    ← Edge Function: GET/POST /progress (auth required)
├── server/                 ← Legacy Express app (no longer deployed, kept for reference)
├── package.json            ← Node deps for local dev only
├── render.yaml             ← Legacy Render config (no longer in use)
└── README.md
```

## Edge Function URLs
- `https://pmnmejhkoxqlvzxzuaag.supabase.co/functions/v1/challenges` — all challenges
- `https://pmnmejhkoxqlvzxzuaag.supabase.co/functions/v1/challenges/today` — today's challenges
- `https://pmnmejhkoxqlvzxzuaag.supabase.co/functions/v1/progress` — user progress (GET/POST, requires `Authorization: Bearer <token>`)

## Frontend config
Supabase credentials are embedded directly in the HTML pages (safe — these are public keys):
```html
<script>
  window.SUPABASE_URL = 'https://pmnmejhkoxqlvzxzuaag.supabase.co';
  window.SUPABASE_ANON_KEY = 'sb_publishable_HweWmPaMtvEdsklGjnLg2Q_cjEx-Uud';
  window.API_BASE = 'https://pmnmejhkoxqlvzxzuaag.supabase.co/functions/v1'; // dashboard.html only
</script>
```

## Deployment

### GitHub Pages (frontend)
1. Go to GitHub repo → Settings → Pages
2. Set source: **Deploy from a branch** → `main` → `/ (root)`
3. The `CNAME` file handles the custom domain automatically
4. Update DNS at your registrar: point `deskwarriorfit.com` CNAME to `atariq6298.github.io`

### Supabase Edge Functions (backend)
Deploy using Supabase MCP or CLI:
```bash
supabase functions deploy challenges --no-verify-jwt
supabase functions deploy progress --no-verify-jwt
```
The functions read `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` from Supabase's built-in environment — no extra secrets needed.

## Supabase setup (already done)
- Tables created: `challenges`, `user_progress` (with RLS policies)
- Seed data applied: 20 weekly challenges
- Email Auth is enabled

## Working guidelines
- `SUPABASE_SERVICE_ROLE_KEY` is only used inside Edge Functions — never in browser HTML.
- The `progress` Edge Function validates the user JWT by calling `supabase.auth.getUser()` and enforces RLS by passing the user's token to the Supabase client.
- The `challenges` Edge Function is public (`verify_jwt: false`) — challenges are read-only and publicly accessible.
- Preserve the `CNAME` file and its value unless the domain is intentionally being changed.
- Make content and UX decisions consistent with the site mission of improving health for desk workers.

## Validation notes
- No automated test suite configured yet.
- To test Edge Functions: use the Supabase dashboard → Edge Functions → Logs.
- Validate static HTML files for correctness (links, auth redirects, API calls).
- To test locally, you can still run `npm run dev` with a `.env` file (the Express server still works for local development).

## Content direction
- Favor clear, encouraging, practical messaging for desk workers.
- Prioritize accessibility, mobile-friendly layouts, and fast-loading pages.
- Match the existing design system: dark green palette (`#0d1209` bg, `#c8f23a` accent), Fraunces serif headings, Plus Jakarta Sans body, DM Mono for labels.

