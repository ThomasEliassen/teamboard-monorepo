"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BoardIcon, DashboardIcon, LogoutIcon } from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
];

type SidebarProps = {
  userLabel?: string;
  onLogout: () => void;
};

/**
 * Persistent left-hand navigation for the authenticated app views.
 * Highlights the active route and exposes the logout action.
 */
export function Sidebar({ userLabel, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const initial = (userLabel ?? "?").trim().charAt(0).toUpperCase() || "?";

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BoardIcon className="h-5 w-5" />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">TeamBoard</span>
          <span className="text-xs text-muted-foreground">Project workspace</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        <p className="px-3 pb-2 pt-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href)) ||
            (item.href === "/dashboard" &&
              (pathname === "/dashboard" || pathname.startsWith("/projects")));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
            {initial}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm text-foreground" title={userLabel}>
            {userLabel ?? "Signed in"}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogoutIcon className="h-5 w-5" />
          Logg ut
        </button>
      </div>
    </aside>
  );
}
