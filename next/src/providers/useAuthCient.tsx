"use client";

import { AuthClient } from "@/types/auth";
import { createAuthClient } from "better-auth/react";
import { createContext, useContext, useMemo } from "react";

const AuthClientContext = createContext<AuthClient | null>(null);

interface AuthClientProviderProps {
  baseURL: string;
  children: React.ReactNode;
}

export function AuthClientProvider({
  children,
  baseURL,
}: AuthClientProviderProps) {
  const data = useMemo(
    () =>
      createAuthClient({
        baseURL,
      }),
    [baseURL],
  );

  return (
    <AuthClientContext.Provider value={data}>
      {children}
    </AuthClientContext.Provider>
  );
}

export function useAuthClient() {
  const context = useContext(AuthClientContext);

  if (!context) {
    throw new Error("useAuthClient must be used within AuthClientProvider");
  }

  return context;
}
