"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // ⬇️ Hier wird die Session wirklich gesetzt
      await supabase.auth.getSession();
      router.refresh();

      const redirectTo = searchParams.get("redirectTo") || "/chat";
      toast.success("Login erfolgreich!");
      router.replace(redirectTo);
    });
  }

  async function handleOAuthLogin() {
    const redirectTo = (origin || "") + "/chat";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      toast.error(error.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-center text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
              {isPending ? "Anmelden..." : "Anmelden"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Kein Konto? <Link className="underline" href="/signup">Jetzt registrieren</Link>
            </p>
          </form>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">oder</span>
            <div className="h-px bg-border flex-1" />
          </div>
          <Button className="mt-3 w-full" variant="outline" type="button" onClick={handleOAuthLogin}>
            Mit Google anmelden
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
