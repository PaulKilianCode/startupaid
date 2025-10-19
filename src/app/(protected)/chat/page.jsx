"use client"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabaseClient"

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [startupDescription, setStartupDescription] = useState("")
  const storageKey = useMemo(() => "chat_session", [])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMessages(parsed.messages || [])
        setStartupDescription(parsed.startupDescription || "")
      } catch {}
    }
  }, [storageKey])

  useEffect(() => {
    if (typeof window === "undefined") return
    const payload = JSON.stringify({ messages, startupDescription })
    localStorage.setItem(storageKey, payload)
  }, [messages, startupDescription, storageKey])

  const handleSend = async () => {
    if (!input.trim()) return
    const newMsg = { role: "user", text: input }
    setMessages(prev => [...prev, newMsg])
    setInput("")

    // Platzhalter-Antwort (später ersetzen durch KI-API)
    const botReply = {
      role: "bot",
      text: `Danke! Ich habe verstanden: "${input}". Beschreib dein Startup unten, damit ich bessere Förderungen finde.`
    }
    setTimeout(() => setMessages(prev => [...prev, botReply]), 500)
  }

  const handleSaveToCloud = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const payload = { messages, startupDescription }
    await supabase.from("chats").upsert({
      id: user.id,
      content: payload,
      updated_at: new Date().toISOString()
    })
  }

  const handleLoadFromCloud = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("chats").select("content").eq("id", user.id).single()
    if (data?.content) {
      setMessages(data.content.messages || [])
      setStartupDescription(data.content.startupDescription || "")
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardContent className="flex flex-col gap-3 flex-grow overflow-y-auto p-4">
          {messages.map((msg, i) => (
            <div key={i} className={`p-2 rounded-md ${msg.role === "user" ? "bg-primary/10 self-end" : "bg-muted self-start"}`}>
              {msg.text}
            </div>
          ))}
          <div className="mt-2 grid gap-2">
            <label className="text-sm text-muted-foreground">Beschreibe dein Startup (Zielgruppe, Problem, Lösung, Markt):</label>
            <Textarea asChild={false} rows={4} value={startupDescription} onChange={(e) => setStartupDescription(e.target.value)} placeholder="z.B. Eine App, die ..." />
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLoadFromCloud}>Aus Cloud laden</Button>
              <Button onClick={handleSaveToCloud}>In Cloud speichern</Button>
            </div>
          </div>
        </CardContent>
        <div className="flex gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage zu Förderungen eingeben..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Senden</Button>
        </div>
      </Card>
    </main>
  )
}
