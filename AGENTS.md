# AGENTS.md

## Repository overview
- **Project:** DeskWarriorFit
- **Site type:** Full-stack Node.js/Express web app, deployed on Render.com
- **Custom domain:** `deskwarriorfit.com`
- **Mission:** Help desk workers enjoy a healthier life
- **Auth & DB:** Supabase (email auth + Postgres + Row Level Security)

## Project structure
```
/
├── index.html              ← Landing page (served by Express at /)
├── public/
│   ├── auth.html           ← Login / Sign Up page (Supabase JS SDK)
│   └── dashboard.html      ← Logged-in user view (challenges + streak)
├── server/
│   ├── index.js            ← Express entry point
│   ├── middleware/
│   │   └── auth.js         ← Supabase JWT validation middleware
│   └── routes/
│       ├── challenges.js   ← GET /api/challenges, /api/challenges/today
│       └── progress.js     ← GET/POST /api/progress (protected)
├── supabase/
│   └── schema.sql          ← Run once in Supabase SQL Editor to create tables
├── package.json
├── render.yaml             ← Render Web Service deployment config
├── .env.example            ← Copy to .env and fill in Supabase credentials
├── CNAME                   ← Custom domain (update DNS to point to Render)
└── README.md
```

## Environment variables
Copy `.env.example` to `.env` and fill in:
- `SUPABASE_URL` — from Supabase dashboard → Settings → API
- `SUPABASE_ANON_KEY` — public anon key (safe to expose to browser)
- `SUPABASE_SERVICE_ROLE_KEY` — secret, server-only; never expose to browser
- `PORT` — defaults to 3000 in development

## Running locally
```bash
npm install
cp .env.example .env   # fill in your Supabase credentials
npm run dev            # starts server with --watch on port 3000
```

## Deployment (Render.com)
1. Push to GitHub → connect repo in Render dashboard
2. Render auto-detects `render.yaml` (Node web service, `npm install` + `node server/index.js`)
3. Add env vars in Render: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. Update DNS for `deskwarriorfit.com` to point to the Render service URL (change CNAME at your registrar)

## Supabase setup (one-time)
1. Create project at supabase.com
2. Enable Email Auth: Authentication → Providers → Email
3. Run `supabase/schema.sql` in Supabase SQL Editor (creates tables, RLS policies, seed challenges)
4. Copy URL + anon key + service-role key into env vars

## Working guidelines
- The Express server serves `public/` as static files and `index.html` explicitly at `/`.
- `/api/config.js` is a dynamic Express route that safely exposes `SUPABASE_URL` and `SUPABASE_ANON_KEY` to the browser without hardcoding them in HTML.
- `SUPABASE_SERVICE_ROLE_KEY` must never be sent to the browser; it is used server-side only.
- Auth is handled entirely by the Supabase JS SDK on the frontend; the server only validates JWTs using `supabase.auth.getUser(token)`.
- Preserve the `CNAME` file and its value unless the domain is intentionally being changed.
- Make content and UX decisions consistent with the site mission of improving health for desk workers.

## Validation notes
- No automated test suite configured yet.
- After changes, verify by running `npm run dev` and testing pages manually.
- Validate static HTML files for correctness (links, auth redirects, API calls).

## Content direction
- Favor clear, encouraging, practical messaging for desk workers.
- Prioritize accessibility, mobile-friendly layouts, and fast-loading pages.
- Match the existing design system: dark green palette (`#0d1209` bg, `#c8f23a` accent), Fraunces serif headings, Plus Jakarta Sans body, DM Mono for labels.

