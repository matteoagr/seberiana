import type { Metadata } from "next";
import { AnimalCard } from "@/components/AnimalCard";
import { BreedCardLink } from "@/components/BreedCardLink";
import { ButtonLink } from "@/components/ButtonLink";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getBreedBySlug } from "@/data/breeds";
import { getBreeders, getGalleryImages } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Élevage Canin",
  description:
    "Pomsky, Shiba Inu et Teckel au Domaine Sibérania — élevage familial, socialisation et bien-être au quotidien.",
};

export default async function ElevageCaninPage() {
  const [breeders, gallery] = await Promise.all([
    getBreeders("canin"),
    getGalleryImages("elevage_canin"),
  ]);
  const pomsky = breeders.filter((d) => d.breed === "Pomsky");
  const shiba = breeders.filter((d) => d.breed === "Shiba Inu");
  const teckel = breeders.filter((d) => d.breed === "Teckel");

  const pomskyBreed = getBreedBySlug("pomsky")!;
  const shibaBreed = getBreedBySlug("shiba-inu")!;
  const teckelBreed = getBreedBySlug("teckel")!;

  return (
    <>
      <PageHero
        eyebrow="Nos chiens"
        title="Pomsky, Shiba & Teckel"
        description="Le Pomsky est notre cœur de métier, complété par le Shiba Inu et le Teckel — élevés ici, au rythme de la famille."
        image="https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Espace extérieur de l’élevage canin"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
            Un chiot disponible ? Consultez l’annuaire pour voir les profils à jour.
          </p>
          <ButtonLink href="/annuaire?espece=canin">Annuaire chiens</ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Le quotidien"
          title="Ici, chez nous"
          description="Parcs sécurisés, contact humain et habituation au bruit du foyer — nos chiots partent avec de bonnes bases."
        />
        <div className="mt-12">
          {gallery.length > 0 ? (
            <GalleryGrid images={gallery} />
          ) : (
            <p className="text-sm text-foreground-muted">Galerie bientôt enrichie.</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
        <SectionHeading
          eyebrow="Pomsky"
          title="Notre race principale"
          description="Compacts, affectueux, et suivis de près."
        />
        <BreedCardLink breed={pomskyBreed} />
        {pomsky.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {pomsky.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-foreground-muted">
            Aucun reproducteur Pomsky publié pour le moment.
          </p>
        )}
      </section>

      <section className="border-t border-line bg-background-elevated/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Shiba Inu"
            title="Une lignée complémentaire"
            description="Reproducteurs inscrits LOF — même cadre de vie, caractère affirmé et typique."
          />
          <BreedCardLink breed={shibaBreed} />
          {shiba.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {shiba.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-foreground-muted">
              Aucun reproducteur Shiba publié pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Teckel"
            title="Une race complémentaire"
            description="Des compagnons attachants, élevés non LOF dans le même cadre familial que le reste du domaine."
          />
          <BreedCardLink breed={teckelBreed} />
          {teckel.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {teckel.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-foreground-muted">
              Aucun reproducteur Teckel publié pour le moment.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
