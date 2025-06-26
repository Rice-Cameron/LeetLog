import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack";
import { MAINTENANCE_MODE } from "@/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Maintenance mode logic
  if (
    MAINTENANCE_MODE &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    pathname !== "/maintenance.html" &&
    !/\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/.test(pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/maintenance.html";
    return NextResponse.rewrite(url);
  }

  // Protected routes
  const protectedRoutes = [
    "/problems",
    "/settings",
    "/profile",
    "/new",
    "/api/problems",
  ];

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    try {
      const user = await stackServerApp.getUser();
      if (!user) {
        const signInUrl = new URL("/sign-in", request.url);
        return NextResponse.redirect(signInUrl);
      }
    } catch (error) {
      console.error('Error checking user in middleware:', error);
      const signInUrl = new URL("/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Stop Middleware running on static files
export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
