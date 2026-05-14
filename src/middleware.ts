import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/manifesto", "/demo"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const auth = request.cookies.get("navi_auth")?.value;
  if (auth !== "1") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/advisor/:path*",
    "/budget/:path*",
    "/circles/:path*",
    "/insights/:path*",
    "/invest/:path*",
    "/savings/:path*",
    "/settings/:path*",
    "/subscriptions/:path*",
  ],
};
