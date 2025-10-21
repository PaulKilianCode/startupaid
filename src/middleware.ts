import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res }, {
    cookieOptions: {
      sameSite: "lax",
      secure: false,
      path: "/",
      domain: undefined,
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/chat", "/dashboard"]; // erweitern, falls nötig
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Unauthenticated users trying to access protected routes -> redirect to /login
  if (!user && isProtected) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    res = NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

