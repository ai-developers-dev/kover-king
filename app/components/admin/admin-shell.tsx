import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "~/lib/utils";
import {
  ADMIN_NAV,
  navItem,
  type AdminTabId,
} from "~/components/admin/admin-nav";
import {
  Crown,
  PanelLeft,
  RefreshCw,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";

/**
 * The one admin layout: collapsible sidebar + sticky top bar + a single
 * content gutter. Structure follows shadcn's sidebar-07 block — the same
 * shape used in the Korvix admin — restyled in the Kover King palette.
 *
 * The dashboard keeps its section state in React rather than the URL, so the
 * sidebar drives `tab` instead of navigating.
 */
export function AdminShell({
  tab,
  onTabChange,
  onRefresh,
  onLogout,
  refreshing,
  children,
}: {
  tab: AdminTabId;
  onTabChange: (t: AdminTabId) => void;
  onRefresh: () => void;
  onLogout: () => void;
  refreshing?: boolean;
  children: ReactNode;
}) {
  // Desktop: collapse to icons. Mobile: off-canvas drawer.
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = navItem(tab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        tab={tab}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onSelect={(t) => {
          onTabChange(t);
          setMobileOpen(false);
        }}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* min-w-0 so a wide table scrolls inside its own card instead of
          pushing the whole column past the viewport. */}
      <div
        className={cn(
          "flex min-w-0 flex-col transition-[padding] duration-200",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white/90 px-3 backdrop-blur-md sm:px-5">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(true);
              else setCollapsed((c) => !c);
            }}
            aria-label="Toggle sidebar"
            className="flex size-10 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <PanelLeft className="size-[18px]" />
          </button>
          <div className="mx-1 h-5 w-px bg-slate-200" />
          <nav className="flex min-w-0 items-center gap-2 text-[13px] font-semibold">
            <span className="text-slate-500">Admin</span>
            <span className="text-slate-300">/</span>
            <span className="truncate text-slate-900">
              {current?.label ?? "Overview"}
            </span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <a
              href="https://koverking.com"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:flex"
            >
              View site
              <ExternalLink className="size-3.5" />
            </a>
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-200 disabled:opacity-60"
            >
              <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onLogout}
              className="flex size-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Log out"
            >
              <LogOut className="size-[18px]" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  tab,
  collapsed,
  mobileOpen,
  onSelect,
  onCloseMobile,
}: {
  tab: AdminTabId;
  collapsed: boolean;
  mobileOpen: boolean;
  onSelect: (t: AdminTabId) => void;
  onCloseMobile: () => void;
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200",
        collapsed ? "lg:w-[72px]" : "lg:w-64",
        "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-slate-200 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-500">
          <Crown className="size-5 text-cream" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-[15px] font-bold leading-tight text-slate-900">
              Kover King
            </p>
            <p className="text-[11px] leading-tight text-slate-500">Admin</p>
          </div>
        )}
        <button
          onClick={onCloseMobile}
          className="ml-auto flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-colors",
                        collapsed && "lg:justify-center lg:px-0",
                        active
                          ? "bg-primary-50 text-primary-500"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0",
                          active ? "text-primary-500" : "text-slate-400"
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-slate-200 p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ExternalLink className="size-3.5" />
            Back to website
          </Link>
        </div>
      )}
    </aside>
  );
}
