import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { PetitsCoeursLabel } from "@/components/PetitsCoeurs";
import { SectionHeading } from "@/components/SectionHeading";
import { siteImages } from "@/data/site-images";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Adoption responsable — accueillir un chiot ou un chaton",
  description:
    "Guide d’adoption responsable au Domaine Sibérania : engagement, chiot vs chaton, préparation du foyer, premiers jours, suivi et certificat d’engagement.",
  path: "/adoption",
});

const COMPARE_ROWS = [
  {
    aspect: "Socialisation",
    dog: "Intensive, sorties et contacts réguliers",
    cat: "Plus modérée, souvent centrée sur le foyer",
  },
  {
    aspect: "Éducation",
    dog: "Cadre et apprentissages quotidiens",
    cat: "Apprentissage souvent plus rapide, instinctif",
  },
  {
    aspect: "Espace",
    dog: "Sorties et espace selon la race (Pomsky, Shiba, Teckel)",
    cat: "Appartement adapté avec verticalité (Maine Coon)",
  },
  {
    aspect: "Temps quotidien",
    dog: "Plusieurs moments d’attention et d’activité",
    cat: "Présence régulière, plus d’autonomie",
  },
  {
    aspect: "Budget courant",
    dog: "Alimentation, vétérinaire, accessoires selon gabarit",
    cat: "Alimentation, litière, suivi vétérinaire",
  },
] as const;

const PREP_HOME = [
  {
    title: "Zone de repos",
    body: "Un coin calme, à l’abri des passages, avec un couchage confortable : son refuge pour se sentir en sécurité.",
  },
  {
    title: "Sécuriser le logement",
    body: "Rangez produits ménagers, petits objets et plantes toxiques. Les chiots explorent avec la gueule ; les chatons grimpent partout.",
  },
  {
    title: "Jeux et stimulation",
    body: "Prévoyez des jouets adaptés à l’âge. Pour un Maine Coon, pensez verticalité ; pour un chiot, un espace dégagé pour se dépenser.",
  },
] as const;

const FIRST_DAYS = [
  {
    title: "La première rencontre",
    body: "Restez calmes, parlez doucement. Laissez-le explorer à son rythme sans forcer les câlins.",
  },
  {
    title: "Les premières heures",
    body: "Évitez les visites le premier jour. Il a besoin de s’habituer à votre odeur, votre voix et votre maison.",
  },
  {
    title: "Les premiers repères",
    body: "Montrez tout de suite gamelle, couchage, litière (chaton) ou zone de besoins (chiot). La routine rassure.",
  },
] as const;

const GOOD_PRACTICES = [
  "Prendre le temps de réfléchir (délai de 7 jours du certificat)",
  "Échanger avec l’élevage sur le profil et votre quotidien",
  "S’assurer que toute la famille est d’accord",
  "Préparer la maison avant l’arrivée",
  "Prévoir un budget vétérinaire annuel",
] as const;

const PITFALLS = [
  "Décision impulsive sans anticiper le quotidien",
  "Sous-estimer le temps, l’espace ou le budget",
  "Mauvais timing (déménagement, naissance, changement pro)",
] as const;

export default function AdoptionPage() {
  return (
    <>
      <PageHero
        compact
        eyebrow="Adoption responsable"
        title="Bien accueillir votre compagnon"
        description="Conseils pour adopter un chiot ou un chaton au Domaine Sibérania — engagement, préparation et premiers pas, avec sérénité."
        image={siteImages.homeAdoption}
        imageAlt="Accueil d’un chiot au Domaine Sibérania"
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Avant de se lancer"
            title="Un engagement à long terme"
            description="Adopter un animal dépasse l’élan affectif : c’est une responsabilité sur une à deux décennies — soins, présence, budget et continuité."
          />
          <div className="mt-10 space-y-6 text-base leading-relaxed text-foreground/85 sm:text-lg">
            <p>
              Beaucoup imaginent d’abord les moments de tendresse. Il faut aussi anticiper
              les nuits difficiles, l’éducation, les urgences vétérinaires, les vacances et
              les changements de vie.
            </p>
            <p className="text-foreground-muted">
              Au Domaine Sibérania, nous accompagnons ce choix pour un Pomsky, un Shiba Inu,
              un Teckel ou un Maine Coon — avec transparence et sans précipitation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Chiot ou chaton"
            title="Des besoins différents"
            description="Deux espèces, deux rythmes. Comprendre ces écarts aide à choisir le compagnon adapté à votre vie."
          />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-4 font-serif text-base font-normal text-gold/90">
                    Aspect
                  </th>
                  <th className="py-3 pr-4 font-serif text-base font-normal text-gold/90">
                    Chiot
                  </th>
                  <th className="py-3 font-serif text-base font-normal text-gold/90">
                    Chaton
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground-muted">
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.aspect} className="border-b border-line/50 align-top">
                    <td className="py-4 pr-4 font-medium text-foreground">{row.aspect}</td>
                    <td className="py-4 pr-4 leading-relaxed">{row.dog}</td>
                    <td className="py-4 leading-relaxed">{row.cat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl text-foreground">Les chiots</h3>
              <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                Ils demandent une présence régulière, des sorties, une stimulation et un
                cadre éducatif dès l’arrivée — surtout pour les races actives comme le Pomsky
                ou le Shiba.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl text-foreground">Les chatons</h3>
              <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                Plus indépendants, ils s’adaptent souvent plus vite au rythme du foyer. Un
                Maine Coon a besoin d’espace vertical, de jeux et d’une relation stable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Préparation"
            title="Préparer la maison"
            description="Quelques aménagements simples rendent l’arrivée plus sereine pour vous et pour l’animal."
          />
          <ul className="mt-12 grid gap-10 sm:grid-cols-3">
            {PREP_HOME.map((item) => (
              <li key={item.title}>
                <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-foreground-muted">
            Équipement de base utile : gamelles, couchage, caisse de transport, collier /
            médaille, jouets adaptés, et pour un chaton une litière bien placée.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Jour J"
            title="Les premiers moments"
            description="Les premières heures posent les bases de la confiance."
          />
          <ol className="mt-12 grid gap-10 sm:grid-cols-3">
            {FIRST_DAYS.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span className="font-serif text-2xl text-gold/80" aria-hidden>
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-foreground-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Santé"
            title="La visite vétérinaire"
            description="Prévoyez un rendez-vous rapidement après l’arrivée — même si tout semble aller bien."
          />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-foreground-muted">
            <p>
              Un bilan permet de contrôler l’identification, la condition générale et le
              calendrier vaccinal. Demandez aussi des conseils d’alimentation adaptés à l’âge
              et à la race.
            </p>
            <p>
              Nous restons disponibles pour vous orienter sur le suivi des premières semaines
              après le départ du Domaine Sibérania.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/30">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Décision"
            title="Bien se préparer"
            description="Quelques réflexes pour éviter les mauvaises surprises."
          />
          <div className="mt-12 grid gap-12 sm:grid-cols-2">
            <div>
              <h3 className="font-serif text-xl text-foreground">Bonnes pratiques</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-foreground-muted">
                {GOOD_PRACTICES.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-xl text-foreground">À éviter</h3>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-foreground-muted">
                {PITFALLS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <SectionHeading
            size="page"
            eyebrow="Cadre légal"
            title="Le certificat d’engagement"
            description="Obligatoire au moins 7 jours avant la remise de l’animal. Téléchargez la version chien ou chat, signez-la, puis renvoyez-nous le document."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/certificat-engagement">
              Télécharger le certificat
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            size="section"
            eyebrow="Prêt à adopter ?"
            title="Trouvez votre compagnon"
            description="Consultez les profils disponibles ou contactez-nous pour parler de votre projet au Domaine Sibérania."
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire?statut=disponible">
              <PetitsCoeursLabel
                leading="Voir les disponibles"
                iconClassName="h-3.5 w-3.5"
              />
            </ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Contact
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
