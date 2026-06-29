import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

// Routes that require an authenticated session.
const protectedRoutes = ["/report"]

// Auth-only routes. If an already-logged-in user lands here, send them home
// (avoids showing the login/register page again).
const authRoutes = ["/login", "/register"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
  const isAuthRoute = authRoutes.includes(pathname)

  // Resolve the JWT. The same secret used in authOptions must be used here,
  // otherwise the token cannot be decrypted and getToken returns null.
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const isAuthenticated = !!token

  // Not logged in but trying to reach a protected page -> bounce to login,
  // remembering where they were heading so we can send them back afterwards.
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in but sitting on an auth page -> no reason to log in again.
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Only run the proxy for the routes we actually care about so the rest of
  // the app (and Next auth's own endpoints) stay fast and unguarded.
  matcher: ["/report/:path*", "/login", "/register"],
}
