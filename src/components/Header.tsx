"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "./Logo";
import { PetitsCoeursLabel } from "./PetitsCoeurs";

type NavLeaf = {
  href: string;
  label: string;
  kind?: "petits-coeurs";
};

type NavGroup = {
  id: string;
  label: string;
  matches: string[];
  children: NavLeaf[];
};

type NavItem = NavLeaf | NavGroup;

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

const navigation: NavItem[] = [
  { href: "/", label: "Accueil" },
  { href: "/annuaire", label: "Nos petits", kind: "petits-coeurs" },
  { href: "/portees", label: "Portées" },
  {
    id: "adopter",
    label: "Adopter",
    matches: ["/adoption", "/certificat-engagement"],
    children: [
      { href: "/adoption", label: "Guide d’adoption" },
      { href: "/certificat-engagement", label: "Certificat d’engagement" },
    ],
  },
  {
    id: "domaine",
    label: "Le domaine",
    matches: [
      "/elevage-canin",
      "/elevage-felin",
      "/galerie",
      "/races",
      "/partenaires",
    ],
    children: [
      { href: "/elevage-canin", label: "Nos chiens" },
      { href: "/elevage-felin", label: "Nos chats" },
      { href: "/galerie", label: "Galerie" },
      { href: "/races", label: "Fiches races" },
      { href: "/partenaires", label: "Partenaires" },
    ],
  },
  { href: "/activites", label: "Activités" },
  { href: "/contact", label: "Contact" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, group: NavGroup) {
  return group.matches.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function LeafLabel({ item }: { item: NavLeaf }) {
  if (item.kind === "petits-coeurs") {
    return <PetitsCoeursLabel iconClassName="h-3.5 w-3.5 text-gold-soft" />;
  }
  return <>{item.label}</>;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopOpenId, setDesktopOpenId] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDesktopOpenId(null);
    setMobileOpenId(null);
  }, [pathname]);

  useEffect(() => {
    if (!desktopOpenId) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setDesktopOpenId(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDesktopOpenId(null);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [desktopOpenId]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
        scrolled || open
          ? "border-b border-line bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Logo size="sm" priority className="relative z-10" />

        <nav
          ref={navRef}
          className="hidden items-center gap-5 xl:gap-6 lg:flex"
          aria-label="Navigation principale"
        >
          {navigation.map((item) => {
            if (!isGroup(item)) {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative font-serif text-[0.95rem] transition-colors ${
                    active ? "text-gold-soft" : "text-foreground/80 hover:text-gold-soft"
                  }`}
                >
                  <LeafLabel item={item} />
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            }

            const active = isGroupActive(pathname, item);
            const expanded = desktopOpenId === item.id;
            return (
              <DesktopGroup
                key={item.id}
                item={item}
                active={active}
                expanded={expanded}
                onToggle={() =>
                  setDesktopOpenId((current) => (current === item.id ? null : item.id))
                }
                onClose={() => setDesktopOpenId(null)}
              />
            );
          })}
        </nav>

        <button
          type="button"
          className="relative z-10 flex h-10 w-10 items-center justify-center text-gold lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-px w-full bg-current transition-transform ${
                open ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-full bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-full bg-current transition-transform ${
                open ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-line bg-background/95 backdrop-blur-md lg:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav
          className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8"
          aria-label="Mobile"
        >
          {navigation.map((item) => {
            if (!isGroup(item)) {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-3 font-serif text-lg ${
                    active ? "text-gold-soft" : "text-foreground/85"
                  }`}
                >
                  <LeafLabel item={item} />
                </Link>
              );
            }

            const active = isGroupActive(pathname, item);
            const expanded = mobileOpenId === item.id;
            return (
              <div key={item.id} className="border-b border-line/40 py-1">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between py-3 font-serif text-lg ${
                    active ? "text-gold-soft" : "text-foreground/85"
                  }`}
                  aria-expanded={expanded}
                  onClick={() =>
                    setMobileOpenId((current) => (current === item.id ? null : item.id))
                  }
                >
                  {item.label}
                  <span aria-hidden className="text-gold/70">
                    {expanded ? "−" : "+"}
                  </span>
                </button>
                {expanded ? (
                  <div className="mb-3 flex flex-col gap-1 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`py-2 text-base ${
                          isActivePath(pathname, child.href)
                            ? "text-gold-soft"
                            : "text-foreground-muted"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function DesktopGroup({
  item,
  active,
  expanded,
  onToggle,
  onClose,
}: {
  item: NavGroup;
  active: boolean;
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const menuId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        className={`group relative inline-flex items-center gap-1.5 font-serif text-[0.95rem] transition-colors ${
          active || expanded ? "text-gold-soft" : "text-foreground/80 hover:text-gold-soft"
        }`}
        aria-expanded={expanded}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={onToggle}
      >
        {item.label}
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </button>
      {expanded ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-1/2 top-full z-50 mt-3 min-w-[14rem] -translate-x-1/2 border border-line bg-background/95 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-gold/10 hover:text-gold-soft"
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
