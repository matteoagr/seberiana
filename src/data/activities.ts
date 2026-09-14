export type ActivitySlug =
  | "puppy-yoga"
  | "magnetisme-animalier"
  | "mediation-animale";

export type ActivityFormKind = "puppy-yoga" | "magnetisme" | "mediation";

export type Activity = {
  slug: ActivitySlug;
  formKind: ActivityFormKind;
  interest: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  description: string[];
  highlights: string[];
  formIntro: string;
  successNote: string;
  image: string;
  imageAlt: string;
};

export const activities: Activity[] = [
  {
    slug: "puppy-yoga",
    formKind: "puppy-yoga",
    interest: "puppy-yoga",
    title: "Puppy yoga",
    shortTitle: "Puppy yoga",
    eyebrow: "Bien-être",
    summary:
      "Une séance douce de yoga en présence de chiots — pour se détendre, sourire et partager un moment unique au Domaine Sibérania.",
    description: [
      "Le puppy yoga associe des postures accessibles à la présence apaisante de chiots socialisés. Les séances se déroulent dans un cadre calme, encadré, avec le respect du bien-être animal comme priorité.",
      "Idéal pour un moment pour soi, un cadeau original ou une sortie entre amis — aucun niveau de yoga n’est requis.",
    ],
    highlights: [
      "Séances encadrées, rythme doux",
      "Chiots socialisés, temps de repos respectés",
      "Ouvert aux débutants",
      "Sur réservation uniquement",
    ],
    formIntro:
      "Indiquez vos disponibilités et le nombre de participants : on vous confirme la prochaine séance.",
    successNote: "Votre demande de puppy yoga est bien reçue — on revient vers vous très vite.",
    image: "/photos/home-adoption.jpg",
    imageAlt: "Moment détente avec un chiot au Domaine Sibérania",
  },
  {
    slug: "magnetisme-animalier",
    formKind: "magnetisme",
    interest: "magnetisme",
    title: "Magnétisme animalier",
    shortTitle: "Magnétisme",
    eyebrow: "Accompagnement",
    summary:
      "Un accompagnement énergétique pour soutenir le bien-être de votre animal — en présentiel ou à distance, avec douceur et écoute.",
    description: [
      "Le magnétisme animalier vise à accompagner l’équilibre et le confort de votre compagnon, en complément du suivi vétérinaire. Chaque séance est adaptée à l’animal et à la situation que vous décrivez.",
      "Que votre animal traverse un changement, une période de stress ou que vous souhaitiez simplement un soutien bienveillant : nous échangeons d’abord pour voir si l’approche vous convient.",
    ],
    highlights: [
      "Présentiel ou à distance",
      "Complément au suivi vétérinaire",
      "Écoute de l’animal et de sa famille",
      "Sur rendez-vous",
    ],
    formIntro:
      "Parlez-nous de votre animal et de ce qui vous amène : on vous propose un créneau adapté.",
    successNote:
      "Votre demande de magnétisme animalier est bien reçue — on vous répond au plus vite.",
    image: "/photos/home-approach.jpg",
    imageAlt: "Accompagnement bienveillant au Domaine Sibérania",
  },
  {
    slug: "mediation-animale",
    formKind: "mediation",
    interest: "mediation",
    title: "Médiation animale",
    shortTitle: "Médiation",
    eyebrow: "Lien & présence",
    summary:
      "Des ateliers de médiation par l’animal pour favoriser le lien, l’apaisement et la confiance — en individuel, en famille ou en structure.",
    description: [
      "La médiation animale s’appuie sur la présence d’animaux sélectionnés pour créer un espace d’échange sécurisant. Elle peut accompagner des projets éducatifs, sociaux ou de mieux-être, toujours dans le respect de l’animal.",
      "Nous construisons chaque intervention sur mesure : objectifs, public, durée et format (individuel ou groupe).",
    ],
    highlights: [
      "Particuliers, familles ou structures",
      "Format individuel ou collectif",
      "Animaux habitués au contact encadré",
      "Projet co-construit avec vous",
    ],
    formIntro:
      "Décrivez votre projet et votre public : on étudie ensemble la forme d’intervention la plus adaptée.",
    successNote:
      "Votre demande de médiation animale est bien reçue — on revient vers vous pour en parler.",
    image: "/photos/home-dogs.jpg",
    imageAlt: "Médiation et lien avec les animaux au Domaine Sibérania",
  },
];

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((activity) => activity.slug === slug);
}
