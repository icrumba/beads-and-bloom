import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page through without auth check
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // For all other /admin/* routes, check for admin_session cookie
  const sessionCookie = request.cookies.get("admin_session");

  if (
    !sessionCookie ||
    sessionCookie.value !== process.env.ADMIN_SESSION_SECRET
  ) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
