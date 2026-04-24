import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import JSZip from "jszip";
import type { MetaQuestion, AiInsights } from "@/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (!entries?.length) {
    return new NextResponse("No entries to export", { status: 400 });
  }

  const zip = new JSZip();

  for (const entry of entries) {
    const date = new Date(entry.created_at);
    const dateStr = date.toISOString().split("T")[0];
    const filename = `${dateStr}-${entry.id.slice(0, 8)}.md`;
    const insights = entry.ai_insights as AiInsights | null;

    const frontmatter = [
      "---",
      `id: ${entry.id}`,
      `created_at: "${entry.created_at}"`,
      `user_id: ${entry.user_id}`,
      `ai_analyzed: ${insights !== null}`,
      "---",
    ].join("\n");

    const metaSection =
      entry.meta_questions?.length > 0
        ? "\n\n## Metacognitive Prompts\n\n" +
          (entry.meta_questions as MetaQuestion[])
            .map((q) => `**${q.question}**\n\n${q.answer}`)
            .join("\n\n")
        : "";

    const insightsSection = insights
      ? "\n\n## AI Insights\n\n" +
        (insights.patterns?.length
          ? `### Patterns\n${insights.patterns.map((p) => `- ${p}`).join("\n")}\n\n`
          : "") +
        (insights.blind_spots?.length
          ? `### Blind Spots\n${insights.blind_spots.map((b) => `- ${b}`).join("\n")}\n\n`
          : "") +
        (insights.cognitive_gaps?.length
          ? `### Cognitive Gaps\n${insights.cognitive_gaps.map((c) => `- ${c}`).join("\n")}\n\n`
          : "") +
        (insights.summary ? `### Summary\n${insights.summary}` : "")
      : "";

    const content = `${frontmatter}\n\n# Entry ${dateStr}\n\n${entry.free_text}${metaSection}${insightsSection}`;
    zip.file(filename, content);
  }

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(zipBuffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="diary-export-${new Date().toISOString().split("T")[0]}.zip"`,
    },
  });
}
