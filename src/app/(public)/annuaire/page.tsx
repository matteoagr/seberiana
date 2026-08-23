import type { Metadata } from "next";
import { AnimalCard } from "@/components/AnimalCard";
import { AnnuaireFilters } from "@/components/AnnuaireFilters";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getAnimals, getAvailableCount } from "@/lib/supabase/queries";
import type { AnimalStatus, Species } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Annuaire",
  description:
    "Chiens et chats du Domaine Sibérania — Pomsky, Shiba Inu, Teckel et Maine Coon, avec statut Disponible, Réservé ou Adopté.",
};

type PageProps = {
  searchParams: Promise<{
    espece?: string;
    race?: string;
    statut?: string;
  }>;
};

export default async function AnnuairePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const espece =
    params.espece === "canin" || params.espece === "felin"
      ? (params.espece as Species)
      : undefined;
  const statut =
    params.statut === "disponible" ||
    params.statut === "reserve" ||
    params.statut === "adopte"
      ? (params.statut as AnimalStatus)
      : undefined;
  const race = params.race?.trim() || undefined;

  const filters = { espece, race, statut };
  const [animals, availableCount] = await Promise.all([
    getAnimals({
      species: espece,
      breed: race,
      status: statut,
    }),
    getAvailableCount(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Annuaire"
        title="Nos chiots et chatons"
        description="Les disponibles apparaissent en premier — parcourez les profils à votre rythme."
        image="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Animaux du Domaine Sibérania"
      />

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Parcourir"
            title="Qui est disponible ?"
            description={`${availableCount} animal${availableCount > 1 ? "aux" : ""} disponible${availableCount > 1 ? "s" : ""} en ce moment.`}
          />
          <ButtonLink href="/contact" className="self-start sm:self-auto">
            Nous contacter
          </ButtonLink>
        </div>

        <div className="mt-6">
          <AnnuaireFilters filters={filters} />
        </div>

        <p className="mt-6 text-sm text-foreground-muted">
          {animals.length} profil{animals.length > 1 ? "s" : ""}
        </p>

        {animals.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} showCta />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-line/60 bg-background-elevated/40 px-6 py-12 text-center">
            <p className="font-serif text-2xl text-gold-soft">Aucun profil trouvé</p>
            <p className="mt-3 text-sm text-foreground-muted">
              Essayez d’élargir vos filtres, ou jetez un œil aux portées en cours.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/annuaire">Tout afficher</ButtonLink>
              <ButtonLink href="/portees" variant="ghost">
                Voir les portées
              </ButtonLink>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-line bg-background-elevated/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            eyebrow="Envie d’en savoir plus ?"
            title="Chaque profil a son histoire"
            description="Parents, date de naissance, places restantes — tout est sur la page Portées."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/portees">Voir les portées</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
