"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { MetaQuestion } from "@/types";

interface Props {
  questions: MetaQuestion[];
  onChange: (questions: MetaQuestion[]) => void;
}

export function MetaQuestionList({ questions, onChange }: Props) {
  const addQuestion = () => {
    onChange([
      ...questions,
      { id: crypto.randomUUID(), question: "", answer: "" },
    ]);
  };

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: "question" | "answer", value: string) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  return (
    <div className="space-y-4">
      {questions.map((q, index) => (
        <div key={q.id} className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Prompt {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeQuestion(q.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Textarea
            placeholder="Your question or prompt..."
            value={q.question}
            onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <Textarea
            placeholder="Your answer..."
            value={q.answer}
            onChange={(e) => updateQuestion(q.id, "answer", e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
        + Add Metacognitive Prompt
      </Button>
    </div>
  );
}
