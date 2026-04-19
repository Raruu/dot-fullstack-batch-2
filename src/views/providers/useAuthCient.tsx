"use client";

import { authClient } from "@/controllers/auth/auth-client";
import { AuthClient } from "@/types/auth";
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
  const data = useMemo(() => authClient(baseURL), [baseURL]);

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
