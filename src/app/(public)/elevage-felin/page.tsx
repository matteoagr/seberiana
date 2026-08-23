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
  title: "Élevage Félin",
  description:
    "Maine Coon du Domaine Sibérania — élevage familial, bien-être et chatons suivis de près.",
};

export default async function ElevageFelinPage() {
  const [founders, gallery] = await Promise.all([
    getBreeders("felin"),
    getGalleryImages("elevage_felin"),
  ]);

  const maineCoonBreed = getBreedBySlug("maine-coon")!;

  return (
    <>
      <PageHero
        eyebrow="Nos chats"
        title="Maine Coon"
        description="Des chatons au tempérament doux, élevés dans un cadre calme et familial."
        image="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=2000&q=80"
        imageAlt="Maine Coon dans son environnement"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="max-w-xl text-sm leading-relaxed text-foreground-muted">
            Chatons disponibles ou réservés ? L’annuaire vous dit tout, statut compris.
          </p>
          <ButtonLink href="/annuaire?espece=felin">Annuaire chats</ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Le quotidien"
          title="Un espace pensé pour eux"
          description="Hauteur, jeux, coins repos — tout est aménagé pour le bien-être de nos Maine Coon."
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
        <SectionHeading eyebrow="Maine Coon" title="Nos reproducteurs" />
        <BreedCardLink breed={maineCoonBreed} />
        {founders.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {founders.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-foreground-muted">
            Aucun reproducteur publié pour le moment.
          </p>
        )}
      </section>
    </>
  );
}
