import { NextRequest } from "next/server"
import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export const runtime = "edge"
export const maxDuration = 60

const openAI = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const messages = Array.isArray(body?.messages) ? body.messages : []
    const startupDescription = typeof body?.startupDescription === "string" ? body.startupDescription : ""

    const system = startupDescription
      ? `Du bist ein deutscher Fördermittel-Assistent. Antworte präzise, strukturiert und mit konkreten Hinweisen. Startup-Kontext: ${startupDescription}`
      : "Du bist ein deutscher Fördermittel-Assistent. Antworte präzise, strukturiert und mit konkreten Hinweisen."

    const result = await streamText({
      model: openAI(MODEL),
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


