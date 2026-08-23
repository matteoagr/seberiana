import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

const nav = [
  { href: "/admin/portees", label: "Portées" },
  { href: "/admin/reproducteurs", label: "Reproducteurs" },
  { href: "/admin/medias", label: "Galerie" },
];

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-line/70 bg-background-elevated/50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="font-serif text-sm text-gold/90">Back-office</p>
            <Link href="/admin/portees" className="font-serif text-xl text-foreground">
              Domaine Sibérania
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm text-foreground-muted hover:text-gold-soft"
            >
              Site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
              >
                Déconnexion
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-12">
        {children}
      </main>
    </>
  );
}
