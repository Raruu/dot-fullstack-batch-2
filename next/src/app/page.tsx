import { getUnauthorizedIfNoSession } from "@/libs/auth-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const validSession = await getUnauthorizedIfNoSession();

  if (validSession) {
    redirect("/app");
  }

  redirect("/login");
}
