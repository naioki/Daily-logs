export interface MetaQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface AiInsights {
  patterns: string[];
  blind_spots: string[];
  cognitive_gaps: string[];
  summary: string;
}

export interface Entry {
  id: string;
  user_id: string;
  free_text: string;
  meta_questions: MetaQuestion[];
  ai_insights: AiInsights | null;
  created_at: string;
}
