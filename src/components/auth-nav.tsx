"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { LogOut, MessageCircle } from "lucide-react"

export function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: { user?: unknown } | null) => {
      setIsAuthenticated(!!session?.user)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleChatClick = () => {
    if (isAuthenticated) {
      router.push("/chat")
    } else {
      router.push("/login?redirectTo=/chat")
    }
  }

  if (isLoading) {
    return (
      <nav className="flex items-center gap-3">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-5 w-px bg-border" />
      </nav>
    )
  }

  return (
    <nav className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleChatClick}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        Chat
      </Button>
      
      {isAuthenticated ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      ) : (
        <Link 
          className="text-sm text-muted-foreground hover:text-foreground" 
          href="/login"
        >
          Login
        </Link>
      )}
      
      <div className="h-5 w-px bg-border" />
    </nav>
  )
}
