"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Client-side Supabase instance using Next.js Auth Helpers
export const supabase = createClientComponentClient({
  cookieOptions: {
    sameSite: "lax",
    secure: false,
    path: "/",
    domain: undefined,
  },
})


