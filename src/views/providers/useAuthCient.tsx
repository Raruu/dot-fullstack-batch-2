"use client";

import { createAuthClient } from "better-auth/react";
import { createContext, useContext, useMemo } from "react";

type AuthClient = ReturnType<typeof createAuthClient>;

const AuthClientContext = createContext<AuthClient | null>(null);

interface AuthClientProviderProps {
  baseURL: string;
  children: React.ReactNode;
}

export function AuthClientProvider({
  baseURL,
  children,
}: AuthClientProviderProps) {
  const authClient = useMemo(
    () =>
      createAuthClient({
        baseURL,
      }),
    [baseURL],
  );

  return (
    <AuthClientContext.Provider value={authClient}>
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
