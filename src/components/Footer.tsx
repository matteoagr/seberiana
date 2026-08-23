import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-background-elevated">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div className="flex flex-col gap-4">
          <Logo size="md" />
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
            Un élevage familial où chiens et chats grandissent entourés de soin
            et de transparence.
          </p>
        </div>

        <div>
          <p className="mb-4 font-serif text-sm text-gold/90">
            Parcourir
          </p>
          <ul className="space-y-2 text-sm text-foreground-muted">
            <li>
              <Link href="/annuaire" className="transition-colors hover:text-gold-soft">
                Annuaire
              </Link>
            </li>
            <li>
              <Link href="/portees" className="transition-colors hover:text-gold-soft">
                Portées
              </Link>
            </li>
            <li>
              <Link href="/elevage-canin" className="transition-colors hover:text-gold-soft">
                Nos chiens
              </Link>
            </li>
            <li>
              <Link href="/elevage-felin" className="transition-colors hover:text-gold-soft">
                Nos chats
              </Link>
            </li>
            <li>
              <Link href="/races" className="transition-colors hover:text-gold-soft">
                Fiches races
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-gold-soft">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Domaine Sibérania</p>
          <p className="text-gold/70">Élevage familial · Pomsky · Shiba · Teckel · Maine Coon</p>
        </div>
      </div>
    </footer>
  );
}
