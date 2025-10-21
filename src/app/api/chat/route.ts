import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export const runtime = "edge"
export const maxDuration = 60

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const messages = Array.isArray(body?.messages) ? body.messages : []
    const startupDescription = typeof body?.startupDescription === "string" ? body.startupDescription : ""

    // Resolve authenticated user (required for per-user rate limiting)
    const supabase = createRouteHandlerClient({ cookies }, {
      cookieOptions: {
        sameSite: "lax",
        secure: false,
        path: "/",
        domain: undefined,
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized: please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Per-user daily rate limit (max 10 requests/day)
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    // Table: user_daily_usage (user_id uuid, date text/date, count int)
    const { data: usageRow } = await supabase
      .from("user_daily_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single()

    const used = (usageRow?.count as number | undefined) ?? 0
    if (used >= 10) {
      return new Response(
        JSON.stringify({ error: "Tageslimit erreicht (10 Anfragen). Bitte morgen wieder versuchen." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      )
    }

    // Increment usage optimistically before calling the model
    await supabase
      .from("user_daily_usage")
      .upsert(
        { user_id: user.id, date: today, count: used + 1 },
        { onConflict: "user_id,date" }
      )

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY env variable" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }
    const openAI = createOpenAI({ apiKey })

    const baseSystem =
      "Du bist ein österreichischer Förderungs-Experte. Antworte präzise, strukturiert und ausschließlich mit Förderungen, Zuschüssen und Programmen in Österreich (bundesweit, landesspezifisch sowie relevante EU-Programme, die in Österreich 2025 verfügbar sind). Gib immer: 1) konkrete Programmnamen, 2) kurze Beschreibung, 3) warum es zur Idee passt (Begründung), 4) wesentliche Voraussetzungen/Fristen, 5) offizielle Links/Quellen wenn möglich. Falls Informationen fehlen, stelle kurz gezielte Rückfragen. Nenne nur aktuelle Programme und kennzeichne Unsicherheiten explizit."

    const system = startupDescription
      ? `${baseSystem} Startup-Idee/Kontext: ${startupDescription}`
      : baseSystem

    const result = await streamText({
      model: openAI(MODEL) as any,
      messages: [
        { role: "system", content: system },
        ...messages,
      ],
      temperature: 0.7,
      maxTokens: 800,
    })

    return result.toAIStreamResponse()
  } catch (err) {
    console.error("/api/chat error", err)
    const msg = err instanceof Error ? err.message : "Unknown error"
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
