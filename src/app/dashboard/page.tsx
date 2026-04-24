import { createClient } from "@/lib/supabase/server";
import { EntryCard } from "@/components/diary/EntryCard";
import { ExportButton } from "@/components/diary/ExportButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Entry } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="container max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold">My Entries</h1>
        <div className="flex gap-2">
          <ExportButton />
          <Button asChild>
            <Link href="/dashboard/write">New Entry</Link>
          </Button>
        </div>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No entries yet. Start writing!</p>
          <Button asChild>
            <Link href="/dashboard/write">Write your first entry</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <EntryCard key={entry.id} entry={entry as Entry} />
          ))}
        </div>
      )}
    </main>
  );
}
