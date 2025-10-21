"use client"

import { useEffect, useMemo, useRef } from "react"
import type { HTMLAttributes, AnchorHTMLAttributes, OlHTMLAttributes, LiHTMLAttributes } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useChat } from "ai/react"
import type { Message as AIMsg } from "ai"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { saveUserChat } from "@/lib/chatStore"

const SUGGESTIONS = [
  "StartUp-Finanzierung für neue LED-Technologie mit dynamischer Lichtszenerie",
  "Neuer Kryptobroker aufgebaut wie die Solarisbank",
]

type Props = {
  userId: string
  initialMessages: { role: "user" | "assistant" | "system"; content: string }[]
}

export default function ChatClient({ userId, initialMessages }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const seededMessages: AIMsg[] = useMemo(
    () =>
      (initialMessages || []).map((m, idx) => ({
        id: `init-${idx}`,
        role: m.role as AIMsg["role"],
        content: m.content,
      })),
    [initialMessages]
  )

  const { messages, input, setInput, handleSubmit, isLoading, error, append } = useChat({
    api: "/api/chat",
    initialMessages: seededMessages,
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSubmit(e)
  }

  const applySuggestion = (text: string) => {
    append({ role: "user", content: text })
  }

  // Debounced persistence to Supabase per user
  useEffect(() => {
    if (!userId) return
    const t = setTimeout(() => {
      if (!isLoading) {
        const allowed = new Set(["user", "assistant", "system"]) as Set<AIMsg["role"]>
        const compact = messages
          .filter((m) => allowed.has(m.role))
          .map((m) => ({ role: m.role as "user" | "assistant" | "system", content: String(m.content ?? "") }))
        void saveUserChat(userId, compact)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [messages, userId, isLoading])

  type HeadingProps = { node?: unknown } & HTMLAttributes<HTMLHeadingElement>
  type ParagraphProps = { node?: unknown } & HTMLAttributes<HTMLParagraphElement>
  type UlProps = { node?: unknown } & HTMLAttributes<HTMLUListElement>
  type OlProps = { node?: unknown } & OlHTMLAttributes<HTMLOListElement>
  type LiProps = { node?: unknown } & LiHTMLAttributes<HTMLLIElement>
  type StrongProps = { node?: unknown } & HTMLAttributes<HTMLElement>
  type AnchorProps = { node?: unknown } & AnchorHTMLAttributes<HTMLAnchorElement>
  type CodeProps = { node?: unknown } & HTMLAttributes<HTMLElement>

  const mdComponents = useMemo(() => ({
    h1: (props: HeadingProps) => <h1 className="text-2xl font-bold mb-2" {...props} />,
    h2: (props: HeadingProps) => <h2 className="text-xl font-semibold mb-1" {...props} />,
    h3: (props: HeadingProps) => <h3 className="text-lg font-semibold mb-1" {...props} />,
    p: (props: ParagraphProps) => <p className="mb-2 leading-relaxed" {...props} />,
    ul: (props: UlProps) => <ul className="list-disc ml-5 mb-2" {...props} />,
    ol: (props: OlProps) => <ol className="list-decimal ml-5 mb-2" {...props} />,
    li: (props: LiProps) => <li className="mb-1" {...props} />,
    strong: (props: StrongProps) => <strong className="font-semibold" {...props} />,
    a: (props: AnchorProps) => (
      <a className="text-blue-600 underline" target="_blank" rel="noreferrer" {...props} />
    ),
    code: (props: CodeProps) => <code className="px-1 py-0.5 rounded bg-muted" {...props} />,
  }), [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-foreground">
      <div className="w-full max-w-3xl mb-4">
        <h1 className="text-2xl font-bold">Förderung und Finanzierungshilfe</h1>
        <p className="text-sm text-muted-foreground">Stelle deine Frage rund um Fördermittel.</p>
      </div>

      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardContent className="flex flex-col gap-3 flex-grow overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center gap-3 mt-10">
              <h2 className="text-xl font-semibold">Fördermittel-Assistent</h2>
              <p className="text-sm text-muted-foreground">Stelle deine Frage oder starte mit einem Vorschlag:</p>
              <div className="flex flex-col gap-2 w-full">
                {SUGGESTIONS.map((s, i) => (
                  <Button key={i} variant="outline" className="justify-start" onClick={() => applySuggestion(s)}>
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
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {m.content}
              </ReactMarkdown>
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
        {error ? (
          <p className="px-4 pb-3 text-sm text-red-500">
            {error instanceof Error ? error.message : String(error)}
          </p>
        ) : null}
      </Card>
    </main>
  )
}
