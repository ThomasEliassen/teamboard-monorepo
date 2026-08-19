"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { me } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { SpinnerIcon } from "@/components/icons";

type User = {
  name?: string;
  email?: string;
  [key: string]: unknown;
};

const UserContext = createContext<User | null>(null);

/** Access the currently signed-in user from within an AppShell. */
export function useUser() {
  return useContext(UserContext);
}

/**
 * Authenticated layout wrapper. Guards the route (redirects to /login when no
 * token is present), loads the current user, and renders the persistent
 * sidebar around the page content.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    me(token)
      .then((data: User) => {
        setUser(data);
        setStatus("ready");
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (status !== "ready") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SpinnerIcon className="h-6 w-6 text-muted-foreground" />
        <span className="sr-only">Laster...</span>
      </div>
    );
  }

  const userLabel = user?.name ?? user?.email ?? "Signed in";

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-background">
        <Sidebar userLabel={userLabel} onLogout={logout} />
        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
          {children}
        </div>
      </div>
    </UserContext.Provider>
  );
}
