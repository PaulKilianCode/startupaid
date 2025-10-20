import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Wichtig: Response als let, damit Supabase sie modifizieren darf
  let res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res }, {
    cookieOptions: {
      sameSite: "lax",
      secure: false,
      path: "/",
      domain: undefined,
    },
  });

  // Warten, bis Supabase das Cookie sauber schreibt
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isPublic = ["/", "/login", "/signup"].includes(pathname);

  // Nicht eingeloggt → weiterleiten auf /login
  if (!user && !isPublic) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    res = NextResponse.redirect(redirectUrl);
  }

  // Eingeloggt → weiterleiten zu /chat
  if (user && isPublic) {
    res = NextResponse.redirect(new URL("/chat", req.url));
  }

  // Supabase kann hier noch Cookies nachtragen
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
