import { NextRequest, NextResponse } from "next/server";
import { env } from "./libs/env";

const authPages = ["/login", "/register"];
const protectedPrefixes = ["/app"];

async function getSessionData(request: NextRequest) {
  const sessionUrl = new URL(`/api/auth/get-session`, env.PUBLIC_APP_URL);

  const fetchHeaders = new Headers(request.headers);

  if (!fetchHeaders.has("x-forwarded-proto")) {
    fetchHeaders.set("x-forwarded-proto", "https");
  }

  try {
    const response = await fetch(sessionUrl, {
      headers: fetchHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Proxy] Auth rejected: ${response.status} - ${errorText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[Proxy] Fetch threw a network error:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = authPages.some((path) => pathname.startsWith(path));
  const isProtected = protectedPrefixes.some((path) =>
    pathname.startsWith(path),
  );

  if (!isAuthPage && !isProtected) {
    return NextResponse.next();
  }

  const session = await getSessionData(request);
  const hasSession = Boolean(session?.user || session?.session);

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && hasSession) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
