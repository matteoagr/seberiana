import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import Image from "next/image";
import { AnimalCard } from "@/components/AnimalCard";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { formatLitterDate } from "@/lib/labels";
import { getLittersWithYoung } from "@/lib/supabase/queries";

export const metadata: Metadata = buildPageMetadata({
  title: "Portées en cours",
  description:
    "Portées du Domaine Sibérania : parents, dates de naissance et petits de chaque portée de Pomsky, Shiba Inu, Teckel ou Maine Coon.",
  path: "/portees",
});

export default async function PorteesPage() {
  const litters = await getLittersWithYoung();

  return (
    <>
      <PageHero
        eyebrow="Portées"
        title="Nos portées en cours"
        description="Suivez les naissances au Domaine Sibérania : parents, dates et petits de chaque portée de Pomsky, Shiba, Teckel ou Maine Coon."
        image={siteImages.portees}
        imageAlt="Portée de chiots Pomsky du Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
            Pour voir qui est disponible ou réservé, l’annuaire est le plus pratique.
          </p>
          <ButtonLink href="/annuaire">Ouvrir l’annuaire</ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-20 px-5 py-16 sm:px-8 sm:py-24">
        {litters.length === 0 ? (
          <div className="rounded-xl border border-line/60 bg-background-elevated/40 px-6 py-12 text-center">
            <p className="font-serif text-2xl text-gold-soft">Aucune portée pour le moment</p>
            <p className="mt-3 text-sm text-foreground-muted">
              Revenez bientôt, ou consultez l’annuaire des compagnons déjà présents.
            </p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/annuaire">Voir l’annuaire</ButtonLink>
            </div>
          </div>
        ) : (
          litters.map((litter) => {
            const statusLabel = `${litter.animals.length} petit${litter.animals.length > 1 ? "s" : ""} · ${litter.availableCount} disponible${litter.availableCount > 1 ? "s" : ""}`;
            return (
              <article key={litter.id} className="space-y-10">
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                  <div className="relative min-h-[280px] overflow-hidden rounded-xl border border-line/50">
                    <Image
                      src={litter.image}
                      alt={litter.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-sm text-gold/90">
                      {litter.species === "canin" ? "Chiens" : "Chats"} · {litter.breed}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
                      {litter.title}
                    </h2>
                    <p className="mt-4 text-sm text-foreground-muted">
                      {formatLitterDate(litter.birthDate, litter.status)} · Parents{" "}
                      {litter.parentsLabel}
                    </p>
                    <p className="mt-2 text-base text-gold-soft">{statusLabel}</p>
                    {litter.description ? (
                      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
                        {litter.description}
                      </p>
                    ) : null}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <ButtonLink href="/contact">Nous contacter</ButtonLink>
                      <ButtonLink
                        href={`/annuaire?espece=${litter.species}`}
                        variant="ghost"
                      >
                        Voir dans l’annuaire
                      </ButtonLink>
                    </div>
                  </div>
                </div>

                {litter.animals.length > 0 ? (
                  <div>
                    <SectionHeading title="Les petits de la portée" />
                    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {litter.animals.map((animal) => (
                        <AnimalCard key={animal.id} animal={animal} showCta />
                      ))}
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })
        )}
      </section>
    </>
  );
}
