"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6">
      <Card className="w-full max-w-sm p-6">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">StartUpAid 🚀</h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button onClick={() => toast("Login erfolgreich ✅")}>Login</Button>
        </CardContent>
      </Card>
    </div>
  )
}
