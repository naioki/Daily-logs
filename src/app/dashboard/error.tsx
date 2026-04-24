"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container max-w-2xl mx-auto py-8 px-4 text-center">
      <p className="text-destructive mb-4">{error.message || "Something went wrong."}</p>
      <Button variant="outline" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
