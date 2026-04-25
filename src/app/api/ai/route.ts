import { streamObject } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { insightsSchema } from "@/lib/ai-schema";
import type { MetaQuestion } from "@/types";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { entryId } = await req.json();

  const { data: entries } = await supabase
    .from("entries")
    .select("free_text, meta_questions, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (!entries?.length) {
    return new Response("No entries found", { status: 400 });
  }

  const context = entries
    .map((e, i) => {
      const qaPairs = (e.meta_questions as MetaQuestion[])
        .filter((q) => q.answer.trim())
        .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
        .join("\n");
      return `Entry ${i + 1} (${e.created_at}):\n${e.free_text}${qaPairs ? "\n\n" + qaPairs : ""}`;
    })
    .join("\n\n---\n\n");

  const result = streamObject({
    model: google("gemini-2.0-flash"),
    schema: insightsSchema,
    prompt: `You are a metacognitive coach. Analyze these diary entries and identify:
- patterns: recurring cognitive or behavioral patterns you observe
- blind_spots: areas where the writer seems to have limited self-awareness
- cognitive_gaps: inconsistencies or gaps in reasoning
- summary: a 2-3 sentence synthesis of your analysis

Entries:
${context}`,
  });

  result.object
    .then(async (insights) => {
      if (entryId) {
        await supabase
          .from("entries")
          .update({ ai_insights: insights })
          .eq("id", entryId)
          .eq("user_id", user.id);
      }
    })
    .catch(() => {
      // Stream error — insights not persisted, client already received error via stream
    });

  return result.toTextStreamResponse();
}
