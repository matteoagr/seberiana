export type Partner = {
  name: string;
  role: string;
  description: string;
  website?: string;
};

/** Liste des partenaires — à compléter avec les noms / sites de la cliente. */
export const partners: Partner[] = [
  {
    name: "Vétérinaire partenaire",
    role: "Santé animale",
    description:
      "Suivi de santé, prophylaxie et conseils pour nos portées et les familles adoptantes.",
  },
  {
    name: "Transporteurs de confiance",
    role: "Envois France & international",
    description:
      "Professionnels sélectionnés pour accompagner les départs en toute sérénité.",
  },
  {
    name: "Professionnels du bien-être animal",
    role: "Activités & accompagnement",
    description:
      "Intervenants avec qui nous collaborons pour le puppy yoga, le magnétisme et la médiation.",
  },
];
