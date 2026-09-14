import Link from "next/link";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/lib/site";
import { Logo } from "./Logo";
import { PetitsCoeursLabel } from "./PetitsCoeurs";

const footerColumns = [
  {
    title: "Adopter",
    links: [
      { href: "/annuaire", label: "petits-coeurs" as const },
      { href: "/portees", label: "Portées" },
      { href: "/adoption", label: "Guide d’adoption" },
      { href: "/certificat-engagement", label: "Certificat d’engagement" },
    ],
  },
  {
    title: "Le domaine",
    links: [
      { href: "/elevage-canin", label: "Nos chiens" },
      { href: "/elevage-felin", label: "Nos chats" },
      { href: "/galerie", label: "Galerie" },
      { href: "/races", label: "Fiches races" },
      { href: "/partenaires", label: "Partenaires" },
    ],
  },
  {
    title: "Aller plus loin",
    links: [
      { href: "/activites", label: "Activités" },
      { href: "/activites/puppy-yoga", label: "Puppy yoga" },
      { href: "/activites/magnetisme-animalier", label: "Magnétisme" },
      { href: "/activites/mediation-animale", label: "Médiation" },
      { href: "/contact", label: "Contact" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-background-elevated">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[1.1fr_2fr]">
        <div className="flex flex-col gap-4">
          <Logo size="md" />
          <p className="max-w-sm text-sm leading-relaxed text-foreground-muted">
            Un élevage familial où chiens et chats grandissent entourés de soin et de
            transparence.
          </p>
          <p className="text-sm text-foreground-muted">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors hover:text-gold-soft"
            >
              {CONTACT_EMAIL}
            </a>
            <span className="mx-2 text-line" aria-hidden>
              ·
            </span>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="transition-colors hover:text-gold-soft"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-4 font-serif text-sm text-gold/90">{column.title}</p>
              <ul className="space-y-2 text-sm text-foreground-muted">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-gold-soft"
                    >
                      {link.label === "petits-coeurs" ? (
                        <PetitsCoeursLabel iconClassName="h-3 w-3 text-gold-soft" />
                      ) : (
                        link.label
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} Domaine Sibérania</p>
          <p className="text-gold/70">
            Élevage familial · Pomsky · Shiba · Teckel · Maine Coon
          </p>
        </div>
      </div>
    </footer>
  );
}
