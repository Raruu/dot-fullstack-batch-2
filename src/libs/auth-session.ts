import { auth } from "@/libs/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function getUnauthorizedIfNoSession() {
  const session = await getSession();

  const hasValidSession = Boolean(session?.session && session?.user);

  if (hasValidSession) {
    return true;
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
