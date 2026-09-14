import type { Metadata } from "next";
import Image from "next/image";
import { buildPageMetadata } from "@/lib/seo";
import { AnimalCard } from "@/components/AnimalCard";
import { BreedSectionVisual } from "@/components/BreedSectionVisual";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { getBreedBySlug } from "@/data/breeds";
import { getBreeders } from "@/lib/supabase/queries";
import { PetitsCoeursLabel } from "@/components/PetitsCoeurs";

export const metadata: Metadata = buildPageMetadata({
  title: "Élevage félin Maine Coon",
  description:
    "Élevage félin familial de Maine Coon au Domaine Sibérania : bien-être, socialisation et chatons suivis jusqu’à l’adoption.",
  path: "/elevage-felin",
});

export default async function ElevageFelinPage() {
  const founders = await getBreeders("felin");
  const maineCoonBreed = getBreedBySlug("maine-coon")!;

  return (
    <>
      <PageHero
        compact
        eyebrow="Nos chats"
        title="Maine Coon"
        description="Des chatons au tempérament doux, élevés dans un cadre calme et familial."
        image={maineCoonBreed.heroImage}
        imageAlt="Maine Coon — exemple de la race au Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-12">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
              Adopter un chaton
            </p>
            <p className="mt-2 text-base leading-relaxed text-foreground/90">
              Chatons disponibles ou réservés ? Nos petits cœurs vous disent tout, statut
              compris.
            </p>
          </div>
          <ButtonLink href="/annuaire?espece=felin">
            <PetitsCoeursLabel
              leading="Nos petits"
              trailing="chats"
              iconClassName="h-3.5 w-3.5"
              className="inline-flex items-center gap-1.5"
            />
          </ButtonLink>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[260px] overflow-hidden sm:min-h-[340px]">
            <Image
              src="https://images.unsplash.com/photo-1573865526731-10659f70035b?auto=format&fit=crop&w=1400&q=80"
              alt="Chaton Maine Coon dans un intérieur calme"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              size="page"
              eyebrow="Élevage félin"
              title="Maine Coon élevés en famille"
              description="Nos Maine Coon grandissent dans un environnement calme, avec beaucoup de contact humain et un suivi attentif."
            />
            <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-foreground/85 sm:text-lg">
              <p>
                Le <strong className="font-medium text-foreground">Maine Coon</strong> est la race
                féline du Domaine Sibérania. Nous privilégions le tempérament, la santé et une
                socialisation douce dès les premières semaines — pour des chatons prêts à rejoindre
                un foyer.
              </p>
              <p>
                Découvrez les caractéristiques de la race sur notre{" "}
                <a href="/races/maine-coon" className="text-gold-soft hover:underline">
                  fiche Maine Coon
                </a>{" "}
                et les disponibilités parmi{" "}
                <a href="/annuaire?espece=felin" className="text-gold-soft hover:underline">
                  nos petits cœurs
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <BreedSectionVisual
        breed={maineCoonBreed}
        title="Nos reproducteurs"
        description="Les parents de nos portées, visibles parmi nos petits cœurs lorsqu’ils sont publiés."
      >
        {founders.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {founders.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Aucun reproducteur publié pour le moment.
          </p>
        )}
      </BreedSectionVisual>
    </>
  );
}
