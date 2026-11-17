"use client";

import { SessionProvider as Provider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // Mounted under /foreclosure: without basePath, next-auth/react calls the
  // DOMAIN-ROOT /api/auth/session (the main CRM), which deletes this app's
  // session cookie as unrecognized - login succeeds, then every page
  // bounces back to /login. Pin the app's own auth routes.
  return <Provider basePath="/foreclosure/api/auth">{children}</Provider>;
}
