import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { breedProfiles } from "@/data/breeds";
import { speciesLabels } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Fiches races — Pomsky, Shiba Inu, Teckel, Maine Coon",
  description:
    "Découvrez les races élevées au Domaine Sibérania : caractère, entretien, taille et informations LOF/LOOF pour chaque race.",
  alternates: {
    canonical: "/races",
  },
  openGraph: {
    title: "Fiches races | Domaine Sibérania",
    description:
      "Caractéristiques complètes des races Pomsky, Shiba Inu, Teckel et Maine Coon élevées en famille.",
    url: "/races",
  },
};

export default function RacesIndexPage() {
  const canin = breedProfiles.filter((b) => b.species === "canin");
  const felin = breedProfiles.filter((b) => b.species === "felin");

  return (
    <>
      <PageHero
        eyebrow="Nos races"
        title="Fiches races"
        description="Caractéristiques, tempérament et élevage pour chaque race présente au Domaine Sibérania."
        image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Chiens et chats au domaine"
      />

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <p className="reveal max-w-3xl text-base leading-relaxed text-foreground/85 sm:text-lg">
          Chaque fiche détaille l&apos;origine, le caractère, les besoins et la
          situation LOF/LOOF au sein de notre élevage familial. Retrouvez aussi les
          jeunes disponibles dans l&apos;annuaire.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="reveal font-serif text-2xl text-gold-soft">
              Races canines
            </h2>
            <ul className="mt-6 space-y-4">
              {canin.map((breed) => (
                <li key={breed.slug}>
                  <Link
                    href={`/races/${breed.slug}`}
                    className="reveal group block rounded-2xl border border-line bg-background-elevated/50 p-5 transition-colors hover:border-gold/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl text-foreground group-hover:text-gold-soft">
                          {breed.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                          {breed.heroDescription}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs uppercase tracking-wide text-gold/70">
                        {breed.lofAtKennel === "lof" ? "LOF" : "Non LOF"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="reveal font-serif text-2xl text-gold-soft">
              Races félines
            </h2>
            <ul className="mt-6 space-y-4">
              {felin.map((breed) => (
                <li key={breed.slug}>
                  <Link
                    href={`/races/${breed.slug}`}
                    className="reveal group block rounded-2xl border border-line bg-background-elevated/50 p-5 transition-colors hover:border-gold/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl text-foreground group-hover:text-gold-soft">
                          {breed.name}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                          {breed.heroDescription}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs uppercase tracking-wide text-gold/70">
                        {speciesLabels[breed.species]}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
