import ChatClient from "./ChatClient"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export default async function ChatPage() {
  const supabase = createServerComponentClient({ cookies }, {
    cookieOptions: {
      sameSite: "lax",
      secure: false,
      path: "/",
      domain: undefined,
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id || ""

  let initialMessages: { role: "user" | "assistant" | "system"; content: string }[] = []
  if (userId) {
    try {
      const { data, error } = await supabase
        .from("user_chats")
        .select("messages")
        .eq("user_id", userId)
        .single()
      if (!error && data?.messages && Array.isArray(data.messages)) {
        initialMessages = data.messages
      }
    } catch {
      // ignore — user may not have a row yet
    }
  }

  return <ChatClient userId={userId} initialMessages={initialMessages} />
}
