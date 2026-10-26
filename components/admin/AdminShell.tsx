"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, LogOut, Menu, Star, X } from "lucide-react";
import { adminNavigation, getPageTitle } from "@/lib/admin-navigation";
import type { Admin } from "@/types/admin";

type AdminShellProps = {
  admin: Admin;
  loggingOut: boolean;
  onLogout: () => void;
  children: ReactNode;
};

export default function AdminShell({
  admin,
  loggingOut,
  onLogout,
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);

   const menuOpen = menuOpenedAt === pathname;

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-900">
      {menuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMenuOpenedAt(null)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <Sidebar
        pathname={pathname}
        open={menuOpen}
        loggingOut={loggingOut}
        onClose={() => setMenuOpenedAt(null)}
        onLogout={onLogout}
      />

      <div className="min-h-screen lg:pl-65">
        <Topbar
          admin={admin}
          title={getPageTitle(pathname)}
          onOpenMenu={() => setMenuOpenedAt(pathname)}
        />
        <main className="mx-auto max-w-375 p-4 sm:p-7 lg:p-9">
          {children}
          <footer className="mt-8 border-t border-neutral-200 py-5 text-xs text-neutral-400">
            Naaf Glamoria Admin · Store management
          </footer>
        </main>
      </div>
    </div>
  );
}

function Sidebar({
  pathname,
  open,
  loggingOut,
  onClose,
  onLogout,
}: {
  pathname: string;
  open: boolean;
  loggingOut: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-65 flex-col border-r border-neutral-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-21 items-center justify-between border-b border-neutral-100 px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold tracking-wide text-white">
            NG
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">NAAF GLAMORIA</p>
            <p className="mt-0.5 text-xs text-neutral-400">Store administration</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {adminNavigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  active
                    ? "bg-neutral-900 font-medium text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-700 shadow-sm">
            <Star size={18} />
          </div>
          <p className="mt-3 text-sm font-semibold">Your jewellery store</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Keep your catalogue organized and up to date.
          </p>
          <Link
            href="/admin/products"
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 hover:underline"
          >
            Manage catalogue
            <ArrowRight size={14} />
          </Link>
        </div>

        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-neutral-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
          <LogOut size={19} strokeWidth={1.8} />
          {loggingOut ? "Logging out..." : "Sign out"}
        </button>

        <p className="px-3 pt-3 text-[10px] text-neutral-400">
          NAAF GLAMORIA · ADMIN
        </p>
      </div>
    </aside>
  );
}

function Topbar({
  admin,
  title,
  onOpenMenu,
}: {
  admin: Admin;
  title: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-19 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur-md sm:px-7 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation"
          className="rounded-lg border border-neutral-200 p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          <p className="mt-0.5 hidden text-xs text-neutral-400 sm:block">
            Naaf Glamoria / Admin
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{admin.name}</p>
          <p className="mt-0.5 text-xs text-neutral-400">{admin.role}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-[#f2ece4] text-sm font-semibold text-neutral-800">
          {admin.name.trim().charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}