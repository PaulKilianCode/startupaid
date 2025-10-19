"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (formData: FormData) => {
    const emailVal = String(formData.get("email") || "").trim()
    const pwdVal = String(formData.get("password") || "")
    if (!emailVal || !pwdVal) {
      toast.error("E-Mail und Passwort sind erforderlich")
      return
    }
    if (pwdVal.length < 6) {
      toast.error("Das Passwort muss mindestens 6 Zeichen haben")
      return
    }
    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email: emailVal,
        password: pwdVal,
      })
      if (error) {
        toast.error(error.message || "Registrierung fehlgeschlagen")
        return
      }
      toast.success("Konto erstellt! Bitte bestätige deine E-Mail.")
      router.replace("/chat")
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Registrieren</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)) }} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@beispiel.de" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={isPending}>{isPending ? "Registrieren…" : "Registrieren"}</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Bereits ein Konto? <Link className="underline" href="/login">Anmelden</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}


