import { redirect } from "next/navigation";
import { getUnauthorizedIfNoSession } from "@/libs/auth-session";

export default async function Home() {
  const validSession = await getUnauthorizedIfNoSession();

  if (validSession) {
    redirect("/app");
  }

  redirect("/login");
}
