import type { Species } from "@/lib/supabase/types";

export type BreedSection = {
  title: string;
  paragraphs: string[];
};

export type BreedProfile = {
  slug: string;
  name: string;
  species: Species;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  /** Inscription LOF/LOOF au sein de l'élevage Sibérania */
  lofAtKennel: "lof" | "non-lof" | "na";
  lofLabel: string;
  intro: string;
  traits: { label: string; value: string }[];
  sections: BreedSection[];
  highlights: string[];
  elevageHref: string;
  annuaireHref: string;
};

export const breedProfiles: BreedProfile[] = [
  {
    slug: "pomsky",
    name: "Pomsky",
    species: "canin",
    metaTitle: "Pomsky — caractère, taille et élevage",
    metaDescription:
      "Découvrez le Pomsky : origine Husky × Spitz, tempérament, entretien et élevage familial au Domaine Sibérania. Race non LOF.",
    heroTitle: "Le Pomsky",
    heroDescription:
      "Un compagnon compact et expressif, né du croisement Husky et Spitz — notre race de cœur au domaine.",
    heroImage:
      "https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&w=2000&q=80",
    lofAtKennel: "non-lof",
    lofLabel: "Non inscrit LOF (race de croisement)",
    intro:
      "Le Pomsky est un chien de type nordique compact, apprécié pour son regard de Husky dans un format plus adapté à la vie de famille. Au Domaine Sibérania, nous sélectionnons des lignées équilibrées, avec un suivi de santé et une socialisation progressive dès les premières semaines.",
    traits: [
      { label: "Espèce", value: "Chien" },
      { label: "Origine", value: "Croisement Husky × Spitz nain" },
      { label: "Taille adulte", value: "Environ 25 à 40 cm au garrot" },
      { label: "Poids adulte", value: "Environ 7 à 14 kg" },
      { label: "Espérance de vie", value: "12 à 15 ans" },
      { label: "Pelage", value: "Mi-long à long, dense, avec sous-poil" },
      { label: "Activité", value: "Modérée à soutenue" },
      { label: "Au domaine", value: "Non LOF" },
    ],
    sections: [
      {
        title: "Tempérament",
        paragraphs: [
          "Le Pomsky est généralement curieux, joueur et très attaché à sa famille. Il garde souvent une part d’indépendance héritée du Spitz, avec la vivacité et l’expressivité du Husky.",
          "Bien socialisé, il s’adapte à une vie de foyer active. Comme tout chien nordique, il apprécie les sorties régulières, les jeux et une présence humaine cohérente.",
        ],
      },
      {
        title: "Besoins & entretien",
        paragraphs: [
          "Son pelage demande un brossage régulier, surtout lors des mues. Des promenades quotidiennes et des moments de jeu suffisent en général à canaliser son énergie.",
          "Un environnement calme, avec des règles claires dès le plus jeune âge, lui permet de devenir un compagnon équilibré.",
        ],
      },
      {
        title: "Notre élevage",
        paragraphs: [
          "Le Pomsky est la race principale du domaine. Nos reproducteurs sont suivis vétérinaire, hébergés au rythme de la famille, et nos portées font l’objet d’un accompagnement personnalisé des futurs adoptants.",
          "Le Pomsky n’est pas une race reconnue par le LOF : nos chiots ne sont donc pas inscrits au Livre des Origines Français.",
        ],
      },
    ],
    highlights: [
      "Regard expressif de type Husky",
      "Format plus compact que le Siberian Husky",
      "Très sociable avec une bonne socialisation",
      "Race principale du Domaine Sibérania",
    ],
    elevageHref: "/elevage-canin",
    annuaireHref: "/annuaire?espece=canin&race=Pomsky",
  },
  {
    slug: "shiba-inu",
    name: "Shiba Inu",
    species: "canin",
    metaTitle: "Shiba Inu — caractère, standards et élevage LOF",
    metaDescription:
      "Fiche race Shiba Inu : origine japonaise, caractère, morphologie et élevage LOF au Domaine Sibérania.",
    heroTitle: "Le Shiba Inu",
    heroDescription:
      "Un chien japonais au caractère affirmé, élégant et fidèle — élevé au domaine avec des reproducteurs inscrits LOF.",
    heroImage:
      "https://images.unsplash.com/photo-1611250282006-4484dd3fba6f?auto=format&fit=crop&w=2000&q=80",
    lofAtKennel: "lof",
    lofLabel: "Reproducteurs inscrits LOF",
    intro:
      "Le Shiba Inu est une race spitz japonaise reconnue, réputée pour son indépendance, sa prestance et sa loyauté envers sa famille. Au Domaine Sibérania, nos reproducteurs Shiba sont inscrits au LOF et sélectionnés sur le caractère, la santé et la conformité au standard.",
    traits: [
      { label: "Espèce", value: "Chien" },
      { label: "Origine", value: "Japon" },
      { label: "Taille adulte", value: "Environ 37 à 42 cm au garrot" },
      { label: "Poids adulte", value: "Environ 8 à 11 kg" },
      { label: "Espérance de vie", value: "12 à 15 ans" },
      { label: "Pelage", value: "Court, dense, avec sous-poil" },
      { label: "Activité", value: "Modérée à soutenue" },
      { label: "Au domaine", value: "LOF" },
    ],
    sections: [
      {
        title: "Tempérament",
        paragraphs: [
          "Le Shiba Inu est intelligent, propre et parfois réservé avec les inconnus. Il forme un lien fort avec sa famille et apprécie un cadre stable.",
          "Son caractère affirmé demande une éducation cohérente, patiente et bienveillante. Socialisé correctement, il devient un compagnon noble et attachant.",
        ],
      },
      {
        title: "Besoins & entretien",
        paragraphs: [
          "Deux à trois sorties par jour, des jeux stimulants et un brossage régulier suffisent en général. Le Shiba mue deux fois par an de façon marquée.",
          "Il s’épanouit dans un foyer qui respecte son besoin de repères, sans excès de contraintes.",
        ],
      },
      {
        title: "Notre élevage",
        paragraphs: [
          "Nos reproducteurs Shiba Inu sont inscrits au LOF. Nous privilégions des lignées typées, avec un suivi vétérinaire rigoureux et une socialisation adaptée dès la portée.",
          "Le Shiba complète notre élevage canin aux côtés du Pomsky et du Teckel, dans le même esprit familial et transparent.",
        ],
      },
    ],
    highlights: [
      "Race japonaise reconnue LOF",
      "Caractère loyal et indépendant",
      "Format moyen, facile à vivre",
      "Reproducteurs sélectionnés au domaine",
    ],
    elevageHref: "/elevage-canin",
    annuaireHref: "/annuaire?espece=canin&race=Shiba+Inu",
  },
  {
    slug: "teckel",
    name: "Teckel",
    species: "canin",
    metaTitle: "Teckel — caractère, variétés et élevage",
    metaDescription:
      "Tout savoir sur le Teckel (chien teckel) : tempérament, entretien, variétés de poil. Élevage familial non LOF au Domaine Sibérania.",
    heroTitle: "Le Teckel",
    heroDescription:
      "Un compagnon courageux et affectueux, au corps allongé unique — présent au domaine en lignée non LOF.",
    heroImage:
      "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=2000&q=80",
    lofAtKennel: "non-lof",
    lofLabel: "Non inscrit LOF au domaine",
    intro:
      "Le Teckel — ou Dachshund — est une race allemande emblématique, reconnue pour son corps long, ses pattes courtes et son tempérament vif. Au Domaine Sibérania, nos Teckel sont élevés en famille et ne sont pas inscrits au LOF : nous privilégions le caractère, la santé et l’adaptation au foyer plutôt que le pedigree.",
    traits: [
      { label: "Espèce", value: "Chien" },
      { label: "Origine", value: "Allemagne" },
      { label: "Taille adulte", value: "Standard, miniature ou kaninchen selon variété" },
      { label: "Poids adulte", value: "Environ 4 à 9 kg (selon variété)" },
      { label: "Espérance de vie", value: "12 à 16 ans" },
      { label: "Pelage", value: "Poil court, dur ou long selon variété" },
      { label: "Activité", value: "Modérée" },
      { label: "Au domaine", value: "Non LOF" },
    ],
    sections: [
      {
        title: "Tempérament",
        paragraphs: [
          "Le Teckel est curieux, courageux et très attaché à sa famille. Malgré sa petite taille, il possède un tempérament de chien de chasse : alerte, têtu parfois, mais profondément loyal.",
          "Il convient à des foyers qui lui offrent de la présence, des promenades régulières et une éducation patiente.",
        ],
      },
      {
        title: "Besoins & entretien",
        paragraphs: [
          "Des sorties quotidiennes, des jeux d’olfaction et un entretien du pelage adapté à sa variété (court, dur ou long) suffisent en général.",
          "Attention au dos : éviter les escaliers fréquents chez le chiot, ne pas favoriser le surpoids et privilégier des accès faciles.",
        ],
      },
      {
        title: "Notre élevage",
        paragraphs: [
          "Les Teckel du Domaine Sibérania ne sont pas inscrits LOF. Nous les élevons avec le même soin que nos autres races : suivi vétérinaire, socialisation et transparence envers les adoptants.",
          "Cette race complète notre palette canine pour les familles qui recherchent un compagnon compact, joueur et plein de caractère.",
        ],
      },
    ],
    highlights: [
      "Compagnon affectueux et courageux",
      "Adapté à la vie en famille",
      "Plusieurs variétés de poil possibles",
      "Élevés non LOF au domaine",
    ],
    elevageHref: "/elevage-canin",
    annuaireHref: "/annuaire?espece=canin&race=Teckel",
  },
  {
    slug: "maine-coon",
    name: "Maine Coon",
    species: "felin",
    metaTitle: "Maine Coon — caractère, taille et élevage",
    metaDescription:
      "Fiche race Maine Coon : tempérament, entretien du pelage, gabarit. Élevage familial non LOOF au Domaine Sibérania.",
    heroTitle: "Le Maine Coon",
    heroDescription:
      "Le « gentle giant » du monde félin — un chat imposant, doux et sociable, élevé au rythme du domaine.",
    heroImage:
      "https://images.unsplash.com/photo-1615789591457-74a63395c990?auto=format&fit=crop&w=2000&q=80",
    lofAtKennel: "non-lof",
    lofLabel: "Non inscrit LOOF au domaine",
    intro:
      "Le Maine Coon est l’une des plus grandes races de chats, originaire des États-Unis. Réputé pour sa douceur, sa robustesse et son pelage majestueux, il s’intègre bien à la vie de famille. Au Domaine Sibérania, nos Maine Coon ne sont pas inscrits LOOF : l’accent est mis sur le bien-être, le caractère et un suivi de chaque portée.",
    traits: [
      { label: "Espèce", value: "Chat" },
      { label: "Origine", value: "États-Unis (Maine)" },
      { label: "Taille adulte", value: "Grand gabarit — l’un des plus grands chats" },
      { label: "Poids adulte", value: "Environ 4 à 9 kg (mâle souvent plus lourd)" },
      { label: "Espérance de vie", value: "12 à 15 ans" },
      { label: "Pelage", value: "Mi-long, dense, collerette caractéristique" },
      { label: "Activité", value: "Modérée" },
      { label: "Au domaine", value: "Non LOOF" },
    ],
    sections: [
      {
        title: "Tempérament",
        paragraphs: [
          "Le Maine Coon est décrit comme un chat « chien-like » : sociable, joueur et peu agressif. Il tolère généralement bien la présence humaine et s’adapte à une vie de famille calme.",
          "Curieux et intelligent, il apprécie les jeux, les hauteurs et un environnement enrichi.",
        ],
      },
      {
        title: "Besoins & entretien",
        paragraphs: [
          "Son pelage mi-long demande un brossage régulier pour éviter les nœuds, surtout au niveau du ventre et de la collerette.",
          "Des griffoirs, des espaces en hauteur et une alimentation de qualité contribuent à son épanouissement.",
        ],
      },
      {
        title: "Notre élevage",
        paragraphs: [
          "Nos Maine Coon sont élevés en contact humain quotidien, dans un cadre adapté à leur gabarit. Les chatons ne sont pas inscrits LOOF : nous privilégions la transparence sur l’environnement de vie et le suivi de chaque portée.",
          "Chaque adoption est accompagnée pour que la famille comprenne bien les besoins de cette race imposante mais très douce.",
        ],
      },
    ],
    highlights: [
      "Grand chat au tempérament doux",
      "Sociable et adapté à la famille",
      "Pelage majestueux à entretenir",
      "Élevés non LOOF au domaine",
    ],
    elevageHref: "/elevage-felin",
    annuaireHref: "/annuaire?espece=felin&race=Maine+Coon",
  },
];

export const breedsBySpecies: Record<Species, string[]> = {
  canin: breedProfiles.filter((b) => b.species === "canin").map((b) => b.name),
  felin: breedProfiles.filter((b) => b.species === "felin").map((b) => b.name),
};

export function getBreedBySlug(slug: string): BreedProfile | undefined {
  return breedProfiles.find((b) => b.slug === slug);
}

export function getAllBreedSlugs(): string[] {
  return breedProfiles.map((b) => b.slug);
}
