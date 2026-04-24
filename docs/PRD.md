# Product Requirements Document: Metacognitive Diary Prototype

## 1. Project Overview
- **Name**: Metacognitive Diary
- **Objective**: A tool to support metacognition by identifying thinking patterns and blind spots.
- **Target**: Personal use (Mobile-first for quick entry, Desktop-friendly for reflection).
- **Core Value**: High data portability and machine-readability for future AI assistant integration.

## 2. Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, shadcn/ui.
- **Backend/BaaS**: Supabase (PostgreSQL, Auth, RLS).
- **AI**: Gemini API via Vercel AI SDK (Streaming support).
- **Deployment**: Vercel (Hobby plan optimization).

## 3. Detailed Features

### 3.1. Authentication
- Implementation of Google Login using Supabase Auth.
- Strict Row Level Security (RLS) to ensure only the owner can access data.

### 3.2. Dynamic Entry System
- A main text area for free writing.
- **Schema-less Questions**: Support for multiple "Metacognitive Prompts" (e.g., "What was the underlying assumption?"). These should be stored in a `JSONB` column to allow for frequent changes to the question set without schema migrations.

### 3.3. Streaming AI Insights
- Asynchronous analysis triggered after saving an entry.
- Uses Vercel AI SDK to stream responses from Gemini.
- **Context**: Fetch the latest 5 entries from Supabase to provide long-term pattern analysis.
- **Output**: JSON structured insights (Patterns, Blind spots, Cognitive gaps).

### 3.4. Data Export
- Bulk export feature generating a `.zip` or individual Markdown files.
- Each file must contain **YAML Frontmatter** (date, tags, AI insights) for Obsidian/Local LLM compatibility.

## 4. Database Schema (Supabase/PostgreSQL)

```sql
CREATE TABLE entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  free_text TEXT NOT NULL,
  meta_questions JSONB DEFAULT '[]'::jsonb, -- Array of {question: string, answer: string}
  ai_insights JSONB, -- Structured AI output
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own entries" ON entries
  FOR ALL USING (auth.uid() = user_id);
```
