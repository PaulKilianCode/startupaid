"use server"

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies as nextCookies } from "next/headers"

type AuthResult = {
  success: boolean
  message: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }
  const cookieStore = await nextCookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      // Server variant expects getAll/setAll in @supabase/ssr >=0.7
      getAll: async () =>
        cookieStore.getAll()?.map((c) => ({ name: c.name, value: c.value })) ?? [],
      setAll: async (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set({
            name,
            value,
            ...options,
            sameSite: options?.sameSite ?? "lax",
            secure: options?.secure ?? false,
          })
        }
      },
    },
  })
}

export async function loginAction(_prev: AuthResult | undefined, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  const supabase = await getServerClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true, message: "Logged in successfully" }
}

export async function signupAction(_prev: AuthResult | undefined, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim()
  const password = String(formData.get("password") || "")

  if (!email || !password) {
    return { success: false, message: "Email and password are required" }
  }

  const supabase = await getServerClient()
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) {
    return { success: false, message: error.message }
  }
  return { success: true, message: "Account created. Check your email to confirm." }
}


