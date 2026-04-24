import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Entry } from "@/types";

interface Props {
  entry: Entry;
}

export function EntryCard({ entry }: Props) {
  const date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(entry.created_at));

  const preview =
    entry.free_text.length > 150
      ? entry.free_text.slice(0, 150) + "..."
      : entry.free_text;

  const answeredPrompts = entry.meta_questions.filter((q) => q.answer.trim()).length;

  return (
    <Link href={`/dashboard/write?edit=${entry.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">{date}</span>
            <div className="flex gap-2 flex-wrap">
              {answeredPrompts > 0 && (
                <Badge variant="secondary">{answeredPrompts} prompt{answeredPrompts !== 1 ? "s" : ""}</Badge>
              )}
              {entry.ai_insights && (
                <Badge variant="default">AI analyzed</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{preview}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
