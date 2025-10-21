"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageInner />
    </Suspense>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: origin ? `${origin}/login` : undefined,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // If email confirmations are enabled, user must confirm via email
      toast.success(
        data.user?.email_confirmed_at
          ? "Konto erstellt! Du bist angemeldet."
          : "Konto erstellt! Bitte bestätige deine E‑Mail."
      );

      // After signup, redirect either to intended page or to login
      const redirectTo = searchParams.get("redirectTo") || "/chat";
      if (data.user?.email_confirmed_at) {
        await supabase.auth.getSession();
        router.refresh();
        router.replace(redirectTo);
      } else {
        router.replace("/login?redirectTo=" + encodeURIComponent(redirectTo));
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Registrieren</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Label>Passwort</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Registrieren..." : "Registrieren"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Bereits ein Konto? <a className="underline" href="/login">Jetzt anmelden</a>
            </p>
          </form>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px bg-border flex-1" />
          </div>
         
        </CardContent>
      </Card>
    </main>
  );
}
