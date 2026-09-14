import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BreedTeaser } from "@/components/BreedTeaser";
import { ButtonLink } from "@/components/ButtonLink";
import { GalleryGrid } from "@/components/GalleryGrid";
import { FaqJsonLd, SiteJsonLd } from "@/components/JsonLd";
import { Logo } from "@/components/Logo";
import { SectionHeading } from "@/components/SectionHeading";
import { breedProfiles } from "@/data/breeds";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { getAvailableCount, getHomeGalleryImages } from "@/lib/supabase/queries";
import { PetitsCoeursLabel, PETITS_COEURS } from "@/components/PetitsCoeurs";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Élevage familial Pomsky, Shiba, Teckel & Maine Coon`,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

const HOME_FAQ = [
  {
    question: "Quelles races sont élevées au Domaine Sibérania ?",
    answer:
      "Nous élevons des Pomsky, Shiba Inu et Teckel côté canin, ainsi que des Maine Coon côté félin. Le Pomsky est notre race principale. Les conditions LOF/LOOF varient selon la race : consultez chaque fiche race pour le détail.",
  },
  {
    question: "Comment savoir si un chiot ou un chaton est disponible ?",
    answer:
      `${PETITS_COEURS} liste tous les profils publiés avec leur statut (disponible, réservé ou adopté). Les portées regroupent les petits d’une même naissance avec leurs parents.`,
  },
  {
    question: "Comment se déroule une adoption ?",
    answer:
      "Le parcours « Comment adopter » détaille 6 étapes : découverte des profils, contact, échanges, réservation, certificat d’engagement, puis accueil avec visite ou envoi. Le certificat chien ou chat se télécharge sur le site.",
  },
  {
    question: "Où télécharger le certificat d’engagement ?",
    answer:
      "Sur la page Certificat d’engagement : un PDF pour les chiens et un PDF pour les chats. Signez-le au moins 7 jours avant la remise, puis renvoyez-le nous.",
  },
  {
    question: "Où se trouve l’élevage ?",
    answer:
      "Le Domaine Sibérania est un élevage familial en France. Contactez-nous pour organiser une visite ou pour organiser un envoi avec un transporteur de confiance.",
  },
] as const;

export default async function HomePage() {
  const [availableCount, gallery] = await Promise.all([
    getAvailableCount(),
    getHomeGalleryImages(),
  ]);

  return (
    <>
      <SiteJsonLd />
      <FaqJsonLd items={[...HOME_FAQ]} />

      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={siteImages.homeHero}
            alt="Chiots Pomsky du Domaine Sibérania"
            fill
            priority
            className="object-cover ken-burns"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/45 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,160,74,0.12),transparent_55%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-28 text-center sm:px-8 sm:pb-24">
          <div className="reveal">
            <Logo size="hero" priority href={null} />
          </div>
          <h1 className="reveal reveal-delay-1 mt-2 font-serif text-4xl text-foreground sm:text-5xl md:text-6xl">
            Domaine Sibérania
          </h1>
          <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85 sm:text-xl">
            Élevage familial de Pomsky, Shiba Inu, Teckel et Maine Coon — des compagnons
            sélectionnés et élevés avec amour, pour des familles aimantes et attentionnées.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/annuaire">
              <PetitsCoeursLabel leading="Voir nos petits" iconClassName="h-3.5 w-3.5" />
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            eyebrow="Futurs adoptants"
            title="Trouvez votre compagnon"
            description={
              availableCount > 0
                ? `${availableCount} profil${availableCount > 1 ? "s" : ""} disponible${availableCount > 1 ? "s" : ""} en ce moment.`
                : "Consultez nos petits cœurs pour découvrir nos compagnons."
            }
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire?statut=disponible">
              Les disponibles
            </ButtonLink>
            <ButtonLink href="/portees" variant="ghost">
              Voir les portées
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px] lg:min-h-[480px]">
            <Image
              src={siteImages.homeDogs}
              alt="Élevage canin Sibérania — Pomsky"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <p className="font-serif text-sm text-gold/90">Chiens</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">
                Pomsky, Shiba & Teckel
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-foreground/80">
                Nos chiots grandissent ici, entourés de soin et de jeu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/annuaire?espece=canin" onMedia>
                  <PetitsCoeursLabel
                    leading="Nos petits"
                    trailing="chiens"
                    iconClassName="h-3.5 w-3.5"
                    className="inline-flex items-center gap-1.5"
                  />
                </ButtonLink>
                <ButtonLink href="/elevage-canin" variant="ghost" onMedia>
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px] lg:min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1400&q=80"
              alt="Élevage félin Sibérania — Maine Coon"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <p className="font-serif text-sm text-gold/90">Chats</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">
                Maine Coon
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-foreground/80">
                Des chatons doux et curieux, dans un cadre calme et familial.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/annuaire?espece=felin" onMedia>
                  <PetitsCoeursLabel
                    leading="Nos petits"
                    trailing="chats"
                    iconClassName="h-3.5 w-3.5"
                    className="inline-flex items-center gap-1.5"
                  />
                </ButtonLink>
                <ButtonLink href="/elevage-felin" variant="ghost" onMedia>
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 ? (
        <section className="border-b border-line bg-background-elevated/30">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <SectionHeading
              eyebrow="La vie au domaine"
              title="Au fil des jours"
              description="Quelques images du quotidien : chiots, chatons, parents et moments partagés — pour mieux sentir l’ambiance de l’élevage."
            />
            <div className="mt-12">
              <GalleryGrid images={gallery} limit={4} variant="preview" />
            </div>
            <div className="mt-10">
              <ButtonLink href="/galerie" variant="ghost">
                Voir toute la galerie
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]">
            <Image
              src={siteImages.homeApproach}
              alt="Vie familiale au Domaine Sibérania"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Notre approche"
              title="Un élevage familial, transparent"
              description="Au Domaine Sibérania, chiens et chats grandissent dans un cadre de vie réel — pas en batterie, pas en vitrine."
            />
            <div className="mt-8 max-w-xl space-y-5 text-lg leading-relaxed text-foreground/85">
              <p>
                Nous élevons des <strong className="font-medium text-foreground">Pomsky</strong>,{" "}
                <strong className="font-medium text-foreground">Shiba Inu</strong>,{" "}
                <strong className="font-medium text-foreground">Teckel</strong> et{" "}
                <strong className="font-medium text-foreground">Maine Coon</strong> avec un suivi
                vétérinaire, une socialisation progressive et une sélection attentive des familles.
              </p>
              <p>
                Chaque profil publié parmi nos petits cœurs indique clairement le statut —
                disponible, réservé ou adopté — ainsi que les parents et la portée. Notre
                objectif : vous donner les éléments pour faire un choix adapté à votre vie et
                en confiance.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/elevage-canin">Élevage canin</ButtonLink>
              <ButtonLink href="/elevage-felin" variant="ghost">
                Élevage félin
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Guides races"
            title="Mieux connaître nos races"
            description="Tempérament, entretien, taille et statut LOF/LOOF au sein du domaine — une photo d’exemple et l’essentiel pour chaque race."
          />
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {breedProfiles.map((breed, index) => (
              <li key={breed.slug}>
                <BreedTeaser breed={breed} priority={index < 2} />
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <ButtonLink href="/races" variant="ghost">
              Toutes les fiches races
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Adoption"
              title="Comment adopter ?"
              description="Un parcours simple, sans précipitation — pour bien matcher famille et animal."
            />
            <ol className="mt-12 max-w-3xl space-y-8">
              <li className="flex gap-5">
                <span className="font-serif text-2xl text-gold/80" aria-hidden>
                  1
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">Parcourir les profils</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                    Consultez{" "}
                    <Link href="/annuaire" className="text-gold-soft hover:underline">
                      <PetitsCoeursLabel
                        leading="nos petits"
                        iconClassName="h-3.5 w-3.5 inline"
                        className="inline-flex items-center gap-1"
                      />
                    </Link>{" "}
                    et les{" "}
                    <Link href="/portees" className="text-gold-soft hover:underline">
                      portées
                    </Link>{" "}
                    pour voir les disponibilités, les parents et l’histoire de chaque jeune.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="font-serif text-2xl text-gold/80" aria-hidden>
                  2
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">Nous écrire</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                    Via la page{" "}
                    <Link href="/contact" className="text-gold-soft hover:underline">
                      contact
                    </Link>
                    , présentez votre foyer et ce que vous recherchez. Nous répondons avec soin.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <span className="font-serif text-2xl text-gold/80" aria-hidden>
                  3
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">Préparer l’arrivée</h3>
                  <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                    Signez le{" "}
                    <Link
                      href="/certificat-engagement"
                      className="text-gold-soft hover:underline"
                    >
                      certificat d’engagement
                    </Link>
                    , puis visite sur place ou envoi avec des transporteurs de confiance —
                    jusqu’à l’installation dans votre famille.
                  </p>
                </div>
              </li>
            </ol>
            <div className="mt-10">
              <ButtonLink href="/adoption" variant="ghost">
                Voir le parcours complet
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden lg:min-h-full lg:sticky lg:top-28">
            <Image
              src={siteImages.homeAdoption}
              alt="Chiot Pomsky prêt à rejoindre sa famille"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            eyebrow="Questions fréquentes"
            title="Avant de nous écrire"
            description="Quelques réponses utiles pour mieux comprendre l’élevage et le parcours d’adoption."
          />
          <div className="mt-10 max-w-3xl divide-y divide-line/60">
            {HOME_FAQ.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="cursor-pointer list-none font-serif text-lg text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      className="mt-1 h-4 w-4 shrink-0 text-gold/70 transition-transform duration-200 group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        d="M6 4l4 4-4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            eyebrow="Contact"
            title="Parlons de votre projet"
            description="Une question sur une race, une portée ou un profil ? Écrivez-nous — on lit chaque message."
          />
          <ButtonLink href="/contact">Nous contacter</ButtonLink>
        </div>
      </section>
    </>
  );
}
