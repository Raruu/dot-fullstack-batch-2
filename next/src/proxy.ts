import { NextRequest, NextResponse } from "next/server";
import { getSessionData } from "./libs/auth-session";

const authPages = ["/login", "/register"];
const protectedPrefixes = ["/app"];

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
  const hasSession = Boolean(
    session?.user || session?.session || session?.data?.user,
  );

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
