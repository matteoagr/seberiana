import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { AnimalCard } from "@/components/AnimalCard";
import { BreedSectionVisual } from "@/components/BreedSectionVisual";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getBreedBySlug } from "@/data/breeds";
import { siteImages } from "@/data/site-images";
import { getBreeders } from "@/lib/supabase/queries";
import { PetitsCoeursLabel } from "@/components/PetitsCoeurs";

export const metadata: Metadata = buildPageMetadata({
  title: "Élevage canin Pomsky, Shiba Inu & Teckel",
  description:
    "Élevage canin familial au Domaine Sibérania : Pomsky (race principale), Shiba Inu et Teckel. Socialisation, suivi vétérinaire et nos petits cœurs disponibles.",
  path: "/elevage-canin",
});

export default async function ElevageCaninPage() {
  const breeders = await getBreeders("canin");
  const pomsky = breeders.filter((d) => d.breed === "Pomsky");
  const shiba = breeders.filter((d) => d.breed === "Shiba Inu");
  const teckel = breeders.filter((d) => d.breed === "Teckel");

  const pomskyBreed = getBreedBySlug("pomsky")!;
  const shibaBreed = getBreedBySlug("shiba-inu")!;
  const teckelBreed = getBreedBySlug("teckel")!;

  return (
    <>
      <PageHero
        compact
        eyebrow="Nos chiens"
        title="Pomsky, Shiba & Teckel"
        description="Le Pomsky est notre cœur de métier, complété par le Shiba Inu et le Teckel — élevés ici, au rythme de la famille."
        image={siteImages.elevageCanin}
        imageAlt="Pomsky du Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-12">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
              Adopter un chiot
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              Un chiot disponible ? Consultez nos petits cœurs pour voir les profils à jour.
            </p>
          </div>
          <ButtonLink href="/annuaire?espece=canin">
            <PetitsCoeursLabel
              leading="Nos petits"
              trailing="chiens"
              iconClassName="h-3.5 w-3.5"
              className="inline-flex items-center gap-1.5"
            />
          </ButtonLink>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            size="page"
            eyebrow="Élevage canin"
            title="Des chiots élevés pour la vie de famille"
            description="Au Domaine Sibérania, nos races canines grandissent dans un cadre familial, avec un suivi de santé et une socialisation progressive."
          />
          <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-foreground/85 sm:text-lg">
            <p>
              Nous élevons principalement le{" "}
              <strong className="font-medium text-foreground">Pomsky</strong>, complété par le{" "}
              <strong className="font-medium text-foreground">Shiba Inu</strong> et le{" "}
              <strong className="font-medium text-foreground">Teckel</strong>. Chaque portée est
              suivie de près : identification, prophylaxie et préparation au départ chez les
              adoptants.
            </p>
            <p>
              Pour comprendre le caractère et les besoins de chaque race, consultez nos{" "}
              <a href="/races" className="text-gold-soft hover:underline">
                fiches races
              </a>
              . Les profils disponibles sont mis à jour dans{" "}
              <a href="/annuaire?espece=canin" className="text-gold-soft hover:underline">
                nos petits cœurs
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <BreedSectionVisual
        breed={pomskyBreed}
        title="Notre race principale"
        description="Compacts, affectueux, et suivis de près."
      >
        {pomsky.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {pomsky.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Aucun reproducteur Pomsky publié pour le moment.
          </p>
        )}
      </BreedSectionVisual>

      <BreedSectionVisual
        breed={shibaBreed}
        title="Une lignée complémentaire"
        description="Reproducteurs inscrits LOF — même cadre de vie, caractère affirmé et typique."
        reverse
        muted
      >
        {shiba.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {shiba.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Aucun reproducteur Shiba publié pour le moment.
          </p>
        )}
      </BreedSectionVisual>

      <BreedSectionVisual
        breed={teckelBreed}
        title="Une race complémentaire"
        description="Des compagnons attachants, élevés non LOF dans le même cadre familial que le reste du domaine."
      >
        {teckel.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {teckel.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Aucun reproducteur Teckel publié pour le moment.
          </p>
        )}
      </BreedSectionVisual>
    </>
  );
}
