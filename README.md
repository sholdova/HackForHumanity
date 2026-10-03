# Hack for Humanity — Idea Board

A mobile-friendly idea board for hackathon participants. It uses Supabase Auth (GitHub OAuth) and Postgres for persistent ideas, and is ready to deploy on Vercel.

## Local setup

1. Create a Supabase project and enable **GitHub** in **Authentication → Providers**. Add `http://localhost:5173` and your Vercel URL to the redirect URLs.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
4. Install dependencies and start the app:
   ```bash
   npm install
   npm run dev
   ```

## Deploy to Vercel

1. Import this repository in Vercel.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Production environment variables.
3. Deploy. Then add the deployed URL to Supabase Auth redirect URLs.

The board intentionally exposes only the public Supabase anon key. Row-level security allows authenticated users to read ideas and only insert rows with their own user ID.
