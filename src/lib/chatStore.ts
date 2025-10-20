"use client"

import { supabase } from "@/lib/supabaseClient"

export type ChatMessage = {
  id?: string
  role: "user" | "assistant" | "system"
  content: string
  created_at?: string
}

const TABLE = "user_chats"

export async function getUserChat(userId: string): Promise<ChatMessage[]> {
  if (!userId) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select("messages")
    .eq("user_id", userId)
    .single()

  if (error) return []
  return (data?.messages as ChatMessage[]) || []
}

export async function saveUserChat(userId: string, messages: ChatMessage[]): Promise<void> {
  if (!userId) return
  // Only keep role/content to reduce payload size
  const compact = messages.map((m) => ({ role: m.role, content: m.content }))
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert(
        { user_id: userId, messages: compact },
        { onConflict: "user_id" }
      )
    if (error) {
      // Likely table/policy not set up yet; avoid throwing in UI
      console.warn("saveUserChat error", error)
    }
  } catch (e) {
    console.warn("saveUserChat exception", e)
  }
}
