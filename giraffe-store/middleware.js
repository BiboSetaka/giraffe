import { NextResponse } from "next/server";

// Middleware runs on the Edge runtime, where Node's `crypto` module (used in
// lib/auth.js) isn't available — so we do a lightweight presence check here
// and leave full signature verification to the API routes / server pages,
// which run in the Node runtime.

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin") && pathname !== "/api/admin/login";
  const isProductWrite = pathname.startsWith("/api/products") && request.method !== "GET";

  if ((isAdminArea && !isLoginPage) || isAdminApi || isProductWrite) {
    const cookie = request.cookies.get("giraffe_admin");
    if (!cookie) {
      if (isAdminArea) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/products/:path*"],
};
