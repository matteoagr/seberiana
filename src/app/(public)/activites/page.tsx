import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { activities } from "@/data/activities";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Activités — puppy yoga, magnétisme, médiation",
  description:
    "Puppy yoga, magnétisme animalier et médiation animale au Domaine Sibérania — des activités autour du bien-être et du lien avec l’animal.",
  path: "/activites",
});

export default function ActivitesPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Au domaine"
        title="Nos activités"
        description="Au-delà de l’élevage : des parenthèses douces pour se ressourcer auprès des animaux."
        image={siteImages.homeApproach}
        imageAlt="Vie au Domaine Sibérania"
      />

      <section className="border-b border-line bg-background">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <SectionHeading
            size="page"
            eyebrow="Découvrir"
            title="Des moments à partager avec l’animal"
            description="Se détendre, se reconnecter, créer du lien — au Domaine Sibérania, l’animal est aussi une invitation au bien-être."
          />
        </div>
      </section>

      {activities.map((activity, index) => {
        const imageRight = index % 2 === 1;
        return (
          <section
            key={activity.slug}
            className={`border-b border-line ${
              index % 2 === 0 ? "bg-background" : "bg-background-elevated/40"
            }`}
          >
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16">
              <div
                className={`relative min-h-[280px] overflow-hidden sm:min-h-[340px] ${
                  imageRight ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={activity.image}
                  alt={activity.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className={imageRight ? "lg:order-1" : ""}>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-gold/85">
                  {activity.eyebrow}
                </p>
                <h2 className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">
                  {activity.title}
                </h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg">
                  {activity.summary}
                </p>
                <div className="mt-8">
                  <ButtonLink href={`/activites/${activity.slug}`}>
                    En savoir plus
                  </ButtonLink>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Réseau"
            title="Nos partenaires"
            description="Des professionnels de confiance autour de la santé, du transport et du bien-être animal."
          />
          <ButtonLink href="/partenaires" variant="ghost">
            Voir les partenaires
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
