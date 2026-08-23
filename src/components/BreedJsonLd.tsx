import type { BreedProfile } from "@/data/breeds";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type BreedJsonLdProps = {
  breed: BreedProfile;
};

export function BreedJsonLd({ breed }: BreedJsonLdProps) {
  const pageUrl = `${SITE_URL}/races/${breed.slug}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Races",
        item: `${SITE_URL}/races`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: breed.name,
        item: pageUrl,
      },
    ],
  };

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: breed.heroTitle,
    description: breed.metaDescription,
    image: breed.heroImage,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    about: {
      "@type": "Thing",
      name: breed.name,
      description: breed.intro,
    },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Quel est le tempérament du ${breed.name} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: breed.sections.find((s) => s.title === "Tempérament")?.paragraphs.join(" ") ?? breed.intro,
        },
      },
      {
        "@type": "Question",
        name: `Le ${breed.name} est-il inscrit LOF/LOOF au Domaine Sibérania ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: breed.lofLabel,
        },
      },
      {
        "@type": "Question",
        name: `Quels sont les besoins d'entretien du ${breed.name} ?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            breed.sections.find((s) => s.title === "Besoins & entretien")?.paragraphs.join(" ") ??
            "Consultez notre fiche race pour les détails d'entretien.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
