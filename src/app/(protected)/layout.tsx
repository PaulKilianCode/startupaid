import type { ReactNode } from "react"

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        {children}
      </div>
    </section>
  )
}


