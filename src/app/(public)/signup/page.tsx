"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useFormState } from "react-dom"
import { toast } from "sonner"
import { signupAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useFormState(signupAction, undefined)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (formData: FormData) => {
    const emailVal = String(formData.get("email") || "").trim()
    const pwdVal = String(formData.get("password") || "")
    if (!emailVal || !pwdVal) {
      toast.error("Email and password are required")
      return
    }
    if (pwdVal.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    startTransition(async () => {
      const result = await signupAction(undefined, formData)
      if (!result.success) {
        toast.error(result.message)
        return
      }
      toast.success("Account created! Check your email to confirm.")
      router.replace("/dashboard")
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Create account</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form action={formAction} onSubmit={(e) => { e.preventDefault(); onSubmit(new FormData(e.currentTarget)) }} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Sign up"}</Button>
          </form>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account? <Link className="underline" href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}


