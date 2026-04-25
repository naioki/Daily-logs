import { createClient } from "@/lib/supabase/server";
import { EntryForm } from "@/components/diary/EntryForm";
import { AiInsightsPanel } from "@/components/diary/AiInsightsPanel";
import type { Entry } from "@/types";

export default async function WritePage({
  searchParams,
}: {
  searchParams: { edit?: string };
}) {
  const { edit: entryId } = searchParams;
  let initialEntry: Entry | null = null;

  if (entryId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("id", entryId)
      .single();
    initialEntry = data as Entry | null;
  }

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6">
        {initialEntry ? "Edit Entry" : "New Entry"}
      </h1>
      <EntryForm initialEntry={initialEntry} />
      {entryId && initialEntry && (
        <AiInsightsPanel
          entryId={entryId}
          initialInsights={initialEntry.ai_insights}
        />
      )}
    </main>
  );
}
