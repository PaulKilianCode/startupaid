import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/chat");
  }

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Chat</h1>
      <p>Willkommen, {user.email}</p>
    </main>
  );
}
