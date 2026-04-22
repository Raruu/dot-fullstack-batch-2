import { getSession } from "better-auth/api";
import { NextRequest } from "next/server";
import { env } from "./env";

export async function getSessionData(request: NextRequest) {
  const sessionUrl = new URL(`/api/auth/get-session`, env.BACKEND_API_URL);

  const fetchHeaders = new Headers();

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    fetchHeaders.set("cookie", cookieHeader);
  }

  fetchHeaders.set("x-forwarded-proto", "https");

  try {
    const response = await fetch(sessionUrl.toString(), {
      method: "GET",
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

export async function hasValidSession() {
  const session = (await getSession()) as unknown as {
    session: string;
    user: string;
  };

  return Boolean(session?.session && session?.user);
}

export async function getUnauthorizedIfNoSession() {
  if (await hasValidSession()) {
    return true;
  }

  return { message: "Unauthorized", status: 401 };
}
