import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";

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
          <AdminNav />
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-foreground-muted transition-colors hover:border-gold/40 hover:text-gold-soft"
              >
                Déconnexion
              </button>
            </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-12">
        {children}
      </main>
    </>
  );
}
