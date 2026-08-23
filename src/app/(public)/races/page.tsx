import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { BreedTeaser } from "@/components/BreedTeaser";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { breedProfiles } from "@/data/breeds";

export const metadata: Metadata = buildPageMetadata({
  title: "Fiches races — Pomsky, Shiba Inu, Teckel, Maine Coon",
  description:
    "Fiches races du Domaine Sibérania : caractère, entretien, taille et informations LOF/LOOF pour Pomsky, Shiba Inu, Teckel et Maine Coon.",
  path: "/races",
});

export default function RacesIndexPage() {
  const canin = breedProfiles.filter((b) => b.species === "canin");
  const felin = breedProfiles.filter((b) => b.species === "felin");

  return (
    <>
      <PageHero
        compact
        eyebrow="Nos races"
        title="Fiches races"
        description="Caractéristiques, tempérament et élevage pour chaque race présente au Domaine Sibérania — avec un exemple photo pour visualiser."
        image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Chiens et chats au domaine"
      />

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="max-w-3xl text-base leading-relaxed text-foreground/85 sm:text-lg">
          Chaque fiche détaille l’origine, le caractère, les besoins et la situation LOF/LOOF
          au sein de notre élevage familial. Retrouvez aussi les jeunes disponibles dans
          l’annuaire.
        </p>

        <div className="mt-14">
          <SectionHeading
            size="section"
            eyebrow="Canin"
            title="Nos races de chiens"
            description="Pomsky (race principale), Shiba Inu et Teckel."
          />
          <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {canin.map((breed, index) => (
              <li key={breed.slug}>
                <BreedTeaser breed={breed} priority={index === 0} />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 border-t border-line pt-14">
          <SectionHeading
            size="section"
            eyebrow="Félin"
            title="Notre race de chats"
            description="Maine Coon — le gentle giant du domaine."
          />
          <ul className="mt-10 grid max-w-md gap-10 sm:grid-cols-1">
            {felin.map((breed) => (
              <li key={breed.slug}>
                <BreedTeaser breed={breed} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
