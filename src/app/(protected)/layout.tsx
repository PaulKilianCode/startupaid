import { ReactNode } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = createServerComponentClient({ cookies }, {
    cookieOptions: {
      sameSite: "lax",
      secure: false,
      path: "/",
      domain: undefined,
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}


