"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MetaQuestionList } from "@/components/diary/MetaQuestionList";
import type { Entry, MetaQuestion } from "@/types";

interface Props {
  initialEntry?: Entry | null;
}

export function EntryForm({ initialEntry }: Props) {
  const router = useRouter();
  const [freeText, setFreeText] = useState(initialEntry?.free_text ?? "");
  const [questions, setQuestions] = useState<MetaQuestion[]>(
    initialEntry?.meta_questions ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeText.trim()) {
      setError("Please write something before saving.");
      return;
    }

    setSaving(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    let dbError;

    if (initialEntry) {
      const { error: updateError } = await supabase
        .from("entries")
        .update({ free_text: freeText, meta_questions: questions })
        .eq("id", initialEntry.id)
        .eq("user_id", user.id);
      dbError = updateError;
    } else {
      const { error: insertError } = await supabase.from("entries").insert({
        user_id: user.id,
        free_text: freeText,
        meta_questions: questions,
      });
      dbError = insertError;
    }

    setSaving(false);

    if (dbError) {
      setError("Failed to save. Please try again.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Free Writing</label>
        <Textarea
          placeholder="What's on your mind today? Write freely..."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          className="min-h-[200px] resize-y"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Metacognitive Prompts</label>
        <p className="text-xs text-muted-foreground">
          Add questions to reflect on your thinking patterns.
        </p>
        <MetaQuestionList questions={questions} onChange={setQuestions} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : initialEntry ? "Update Entry" : "Save Entry"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
