# Metacognitive Diary — Implementation Plan

## Tech Stack
| Item | Value |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3, shadcn/ui (manual setup) |
| BaaS | Supabase (PostgreSQL + Auth + RLS) |
| AI | Vercel AI SDK (`ai`) + `@ai-sdk/google` → Gemini 2.0 Flash |
| Export | `jszip` |
| Deploy | Vercel Hobby |

## Environment Variables
| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Project URL from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS — export route only |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Server only | Gemini API key from Google AI Studio |

---

## Phase 0 — Project Scaffold ✅
- [x] Next.js 14 scaffolded with TypeScript, Tailwind, App Router, src dir
- [x] Dependencies installed: `@supabase/supabase-js`, `@supabase/ssr`, `ai`, `@ai-sdk/google`, `zod`, `jszip`, `server-only`
- [x] shadcn/ui base config (manual setup: CSS variables, Tailwind theme, UI components)
- [x] `.env.local.example` created
- [x] `docs/PRD.md` created

## Phase 1 — Supabase Setup
- [x] `supabase/migrations/001_entries.sql` created
- [ ] **MANUAL**: Apply SQL in Supabase Dashboard → SQL Editor
- [ ] **MANUAL**: Enable Google OAuth in Supabase Dashboard → Auth → Providers
- [ ] **MANUAL**: Set Site URL to `http://localhost:3000`
- [ ] **MANUAL**: Add `http://localhost:3000/auth/callback` to Google Cloud Console redirect URIs

## Phase 2 — Auth Layer ✅
- [x] `src/lib/supabase/client.ts` — browser client
- [x] `src/lib/supabase/server.ts` — server client with cookie handling
- [x] `src/lib/supabase/admin.ts` — service-role client (export only)
- [x] `src/middleware.ts` — route protection
- [x] `src/app/auth/callback/route.ts` — OAuth callback handler
- [x] `src/app/login/page.tsx` — Google login button
- [x] `src/app/page.tsx` — root redirect

## Phase 3 — Entry Form ✅
- [x] `src/types/index.ts` — TypeScript interfaces
- [x] `src/components/diary/MetaQuestionList.tsx` — dynamic Q&A prompts
- [x] `src/components/diary/EntryForm.tsx` — main entry form
- [x] `src/app/dashboard/write/page.tsx` — write/edit page

## Phase 4 — Dashboard List View ✅
- [x] `src/components/diary/EntryCard.tsx` — entry preview card
- [x] `src/app/dashboard/page.tsx` — dashboard with entry list
- [x] `src/app/dashboard/loading.tsx` — loading skeleton
- [x] `src/app/dashboard/error.tsx` — error boundary

## Phase 5 — AI Streaming Insights ✅
- [x] `src/lib/ai-schema.ts` — shared Zod schema
- [x] `src/app/api/ai/route.ts` — streaming POST endpoint
- [x] `src/components/diary/AiInsightsPanel.tsx` — streaming UI with `experimental_useObject`

## Phase 6 — Data Export ✅
- [x] `src/app/api/export/route.ts` — ZIP download with YAML frontmatter
- [x] `src/components/diary/ExportButton.tsx` — download button

## Phase 7 — Polish ✅
- [x] `src/components/diary/NavBar.tsx` — sign-out navigation
- [x] `src/app/layout.tsx` — root layout with NavBar + Toaster
- [x] Mobile-first responsive layout (`container max-w-2xl mx-auto px-4`)

---

## Manual Setup Required (Supabase + Google OAuth)

1. **Supabase Dashboard → SQL Editor**: Run `supabase/migrations/001_entries.sql`
2. **Supabase Dashboard → Authentication → Providers → Google**: Enable, enter Client ID & Secret
3. **Supabase Dashboard → Authentication → URL Configuration**: Set Site URL to `http://localhost:3000`
4. **Google Cloud Console**: Add `https://YOUR_PROJECT.supabase.co/auth/v1/callback` as Authorized Redirect URI
5. **Create `.env.local`** from `.env.local.example` and fill in real values

## Vercel Deployment
1. Push to GitHub
2. Import in Vercel dashboard
3. Add all 4 environment variables
4. Update Supabase Site URL + Google redirect URIs to production Vercel URL
