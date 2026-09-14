import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { PetitsCoeursLabel } from "@/components/PetitsCoeurs";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Comment adopter un chiot ou un chaton",
  description:
    "Comment adopter un Pomsky, Shiba Inu, Teckel ou Maine Coon au Domaine Sibérania : parcours en 6 étapes, certificat d’engagement, visite ou envoi en France et à l’étranger.",
  path: "/adoption",
});

const STEPS = [
  {
    title: "Découvrir nos compagnons",
    body: (
      <>
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
        pour voir les Pomsky, Shiba Inu, Teckel et Maine Coon disponibles, leurs parents et
        leur statut.
      </>
    ),
  },
  {
    title: "Contacter l’élevage",
    body: (
      <>
        Présentez votre foyer et votre projet sur la page{" "}
        <Link href="/contact" className="text-gold-soft hover:underline">
          contact
        </Link>
        . Nous vérifions ensemble l’adéquation famille / animal, sans précipitation.
      </>
    ),
  },
  {
    title: "Rencontrer et échanger",
    body: (
      <>
        Visite sur rendez-vous au Domaine Sibérania, ou échanges à distance. Posez vos
        questions sur le caractère, l’entretien et la vie quotidienne de votre futur
        compagnon.
      </>
    ),
  },
  {
    title: "Choix et réservation",
    body: (
      <>
        Une fois le profil choisi, nous fixons les modalités d’adoption, le calendrier de
        départ et les documents. Vous pouvez réserver le chiot ou le chaton quand le projet
        est clair des deux côtés.
      </>
    ),
  },
  {
    title: "Documents et engagement",
    body: (
      <>
        Signez le certificat d’engagement et de connaissance au minimum 7 jours avant la
        remise. Nous vérifions identification, carnet de santé et contrat de vente.
      </>
    ),
    cta: {
      href: "/certificat-engagement",
      label: "Télécharger le certificat",
    },
  },
  {
    title: "Accueil et suivi",
    body: (
      <>
        Votre compagnon vous rejoint sur place ou par envoi partout en France et à
        l’étranger, avec des transporteurs de confiance. L’élevage reste disponible pour le
        suivi des premiers mois.
      </>
    ),
  },
] as const;

const CAC_POINTS = [
  "Les besoins physiologiques, comportementaux et médicaux de l’animal",
  "Les obligations légales et réglementaires liées à la détention d’un animal",
  "Les coûts d’entretien et de soins vétérinaires",
  "L’engagement à long terme que représente l’adoption",
  "Les conséquences d’un abandon ou d’une négligence",
] as const;

const PRACTICAL = [
  {
    title: "Qui peut adopter ?",
    body: "Toute personne majeure. Un mineur doit être accompagné d’un représentant légal, qui signe le certificat d’engagement et de connaissance.",
  },
  {
    title: "Délai de réflexion",
    body: "Le délai de 7 jours commence à la signature du certificat. Pendant ce temps, vous réfléchissez sereinement : l’animal ne peut pas vous être remis avant.",
  },
  {
    title: "Santé et traçabilité",
    body: "Nos chiots et chatons sont identifiés (puce électronique), suivis vétérinairement et remis avec leur carnet de santé et les documents prévus.",
  },
  {
    title: "Visites et envois",
    body: "Les visites sont possibles sur rendez-vous. Les envois se font partout en France et à l’étranger, avec des transporteurs de confiance.",
  },
  {
    title: "Garanties et suivi",
    body: "Après l’adoption, l’élevage reste votre interlocuteur : conseils sur l’éducation, la santé et le bien-être de votre compagnon.",
  },
] as const;

export default function AdoptionPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Adoption responsable"
        title="Comment adopter votre compagnon ?"
        description="Un processus simple et transparent en 6 étapes pour accueillir un chiot ou un chaton au Domaine Sibérania."
        image={siteImages.homeAdoption}
        imageAlt="Adoption d’un chiot au Domaine Sibérania"
      />

      <section className="border-b border-line bg-background-elevated/25">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <ol className="relative space-y-6">
            <span
              aria-hidden
              className="absolute bottom-6 left-[1.15rem] top-6 w-px bg-gold/25 sm:left-[1.35rem]"
            />
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 sm:gap-6">
                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-background font-serif text-sm text-gold-soft sm:h-11 sm:w-11 sm:text-base">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1 rounded-xl border border-line/70 bg-background-elevated/50 px-5 py-5 sm:px-6 sm:py-6">
                  <h2 className="font-serif text-xl text-foreground sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                    {step.body}
                  </p>
                  {"cta" in step && step.cta ? (
                    <div className="mt-5">
                      <ButtonLink href={step.cta.href}>{step.cta.label} →</ButtonLink>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            size="page"
            eyebrow="Cadre légal"
            title="Le certificat d’engagement et de connaissance"
            description="Depuis la loi du 30 novembre 2021, ce document doit être signé avant toute adoption d’animal de compagnie (article D.214-32-4 du Code rural et de la pêche maritime)."
          />

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-8 text-base leading-relaxed text-foreground/85">
              <div>
                <h3 className="font-serif text-xl text-foreground">Obligation légale</h3>
                <p className="mt-3 text-foreground-muted">
                  Le certificat doit être signé par l’adoptant au minimum 7 jours avant
                  l’acquisition de l’animal. C’est une obligation depuis le 1er octobre 2022.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Délai de réflexion</h3>
                <p className="mt-3 text-foreground-muted">
                  Un délai de 7 jours minimum sépare la signature du certificat et la remise
                  effective de l’animal. Il vous permet de mesurer sereinement votre engagement.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-foreground">Protection de l’animal</h3>
                <p className="mt-3 text-foreground-muted">
                  Ce certificat atteste que vous avez pris conscience des responsabilités liées
                  à l’adoption et contribue à lutter contre les abandons.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl text-foreground">Contenu du certificat</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-foreground-muted">
                {CAC_POINTS.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16 max-w-3xl space-y-6 text-base leading-relaxed text-foreground/85">
            <h3 className="font-serif text-2xl text-foreground">Comment l’obtenir ?</h3>
            <p className="text-foreground-muted">
              Téléchargez le certificat chien ou chat sur la page{" "}
              <Link href="/certificat-engagement" className="text-gold-soft hover:underline">
                certificat d’engagement
              </Link>
              , signez-le, puis renvoyez-nous le document daté. Il doit aussi être signé par
              l’élevage, au plus tard 7 jours avant le départ de l’animal.
            </p>
            <div className="pt-2">
              <ButtonLink href="/certificat-engagement">
                Télécharger les certificats
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <SectionHeading
            size="page"
            eyebrow="Informations pratiques"
            title="Avant d’adopter au Domaine Sibérania"
            description="Les points utiles pour préparer une adoption de chiot ou de chaton en toute confiance."
          />
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTICAL.map((item) => (
              <li key={item.title}>
                <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Prêt à adopter ?"
            title="Trouvez votre compagnon"
            description="Parcourez les profils disponibles ou contactez-nous pour parler de votre projet."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire?statut=disponible">
              <PetitsCoeursLabel
                leading="Voir les disponibles"
                iconClassName="h-3.5 w-3.5"
              />
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
