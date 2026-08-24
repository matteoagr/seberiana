"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin/portees", label: "Portées" },
  { href: "/admin/reproducteurs", label: "Reproducteurs" },
  { href: "/admin/medias", label: "Galerie" },
] as const;

function isActive(pathname: string, href: string) {
  // On considère actif aussi les sous-routes (ex: /admin/portees/[id]).
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {nav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-lg border border-gold/40 px-3 py-1.5 text-sm text-gold-soft transition-colors"
                : "rounded-lg border border-line px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
            }
          >
            {item.label}
          </Link>
        );
      })}

      <Link
        href="/"
        className="rounded-lg px-3 py-1.5 text-sm text-foreground-muted hover:text-gold-soft"
      >
        Site
      </Link>
    </nav>
  );
}

