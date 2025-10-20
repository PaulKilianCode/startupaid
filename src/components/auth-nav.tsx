"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { LogOut, MessageCircle } from "lucide-react"

export function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check initial auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setUserEmail(user?.email ?? null)
      setIsLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user as { email?: string } | undefined
      setIsAuthenticated(!!u)
      setUserEmail(u?.email ?? null)
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
      {isAuthenticated && userEmail ? (
        <span className="text-xs text-muted-foreground max-w-[14rem] truncate" title={userEmail}>
          {userEmail}
        </span>
      ) : null}
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
        <div className="flex items-center gap-3">
          <Link 
            className="text-sm text-muted-foreground hover:text-foreground" 
            href="/login"
          >
            Login
          </Link>
          <Link 
            className="text-sm text-muted-foreground hover:text-foreground" 
            href="/signup"
          >
            Registrieren
          </Link>
        </div>
      )}
      
      <div className="h-5 w-px bg-border" />
    </nav>
  )
}
