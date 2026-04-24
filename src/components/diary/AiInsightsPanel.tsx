"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { insightsSchema } from "@/lib/ai-schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AiInsights } from "@/types";

interface Props {
  entryId: string;
  initialInsights?: AiInsights | null;
}

export function AiInsightsPanel({ entryId, initialInsights }: Props) {
  const { object, submit, isLoading, error } = useObject({
    api: "/api/ai",
    schema: insightsSchema,
  });

  const insights = object ?? initialInsights;

  return (
    <div className="space-y-4 mt-8">
      <Separator />
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Insights</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => submit({ entryId })}
          disabled={isLoading}
        >
          {isLoading ? "Analyzing..." : initialInsights ? "Re-analyze" : "Analyze with AI"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">Analysis failed. Please try again.</p>
      )}

      {isLoading && !insights && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      )}

      {insights && (
        <div className="space-y-4">
          {insights.patterns && insights.patterns.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Patterns
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights.patterns.map((p, i) => (
                  <Badge key={i} variant="secondary">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          {insights.blind_spots && insights.blind_spots.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Blind Spots
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights.blind_spots.map((b, i) => (
                  <Badge key={i} variant="outline">{b}</Badge>
                ))}
              </div>
            </div>
          )}

          {insights.cognitive_gaps && insights.cognitive_gaps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Cognitive Gaps
              </h3>
              <div className="flex flex-wrap gap-2">
                {insights.cognitive_gaps.map((c, i) => (
                  <Badge key={i} variant="destructive">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          {insights.summary && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Summary
              </h3>
              <p className="text-sm leading-relaxed">{insights.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
