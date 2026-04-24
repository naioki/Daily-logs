"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Metacognitive Diary</h1>
          <p className="text-muted-foreground mt-2">Reflect. Understand. Grow.</p>
        </div>
        {error && (
          <p className="text-sm text-destructive">Authentication failed. Please try again.</p>
        )}
        <Button onClick={handleLogin} size="lg" className="w-full">
          Continue with Google
        </Button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
