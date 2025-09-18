import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    if (token) {
      if (pathname === "/" || pathname === "/login" || pathname === "/register") {
        return NextResponse.redirect(new URL("/shop", req.url))
      }
      
      if (pathname.startsWith("/shop") || 
          pathname.startsWith("/orders") || 
          pathname.startsWith("/cart") || 
          pathname.startsWith("/inventory") || 
          pathname.startsWith("/customers")) {
        return NextResponse.next()
      }
    }

    if (!token) {
      // Allow access to public routes
      if (pathname === "/" || pathname === "/login" || pathname === "/register") {
        return NextResponse.next()
      }
      
      // Redirect non-authenticated users trying to access protected routes to login
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Always return true to let the middleware function handle the logic
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/",
    "/shop/:path*",
    "/orders/:path*", 
    "/cart/:path*",
    "/inventory/:path*",
    "/customers/:path*",
    "/login",
    "/register"
  ]
}