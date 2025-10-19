"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <p className="text-muted-foreground">Welcome back to StartUpAid.</p>
          <Button asChild>
            <Link href="/">Go to Landing</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}


