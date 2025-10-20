"use client"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useChat } from "ai/react"

const SUGGESTIONS = [
  "Wir entwickeln eine KI-Lösung zur Reduzierung von Lebensmittelverschwendung durch intelligentes Bestands- und Preismanagement und suchen eine Erstfinanzierung.",
]

export default function ChatPage() {
  const inputRef = useRef(null)
  const { messages, input, setInput, handleSubmit, isLoading, error, append } = useChat({
    api: "/api/chat",
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  const useSuggestion = (text) => {
    append({ role: "user", content: text })
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardContent className="flex flex-col gap-3 flex-grow overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 mt-10">
              <h2 className="text-xl font-semibold">Fördermittel-Assistent</h2>
              <p className="text-sm text-muted-foreground">Stelle deine Frage oder starte mit einem Vorschlag:</p>
              <div className="flex flex-col gap-2 w-full">
                {SUGGESTIONS.map((s, i) => (
                  <Button key={i} variant="outline" className="justify-start" onClick={() => useSuggestion(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-md max-w-[85%] whitespace-pre-wrap ${m.role === "user" ? "bg-primary/10 self-end" : "bg-muted self-start"}`}
            >
              {m.content}
            </div>
          ))}
        </CardContent>
        <form className="flex gap-2 p-4 border-t" onSubmit={onSubmit}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Frage zu Förderungen eingeben…"
          />
          <Button type="submit" disabled={isLoading}>Senden</Button>
        </form>
        {error ? <p className="px-4 pb-3 text-sm text-red-500">{String(error.message || error)}</p> : null}
      </Card>
    </main>
  )
}

