"use client"

import { useRouter } from "next/navigation"
import { TrendingUp } from "lucide-react"

export function BrandLink() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="flex items-center gap-2 hover:opacity-90"
      aria-label="StartupAid Home"
    >
      <TrendingUp className="w-6 h-6 text-primary" />
      <span className="font-semibold tracking-tight">StartupAid</span>
    </button>
  )
}


