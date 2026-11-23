"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";

function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export { AppProviders };
