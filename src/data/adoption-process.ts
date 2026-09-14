/** Étapes du parcours d’adoption — utilisées sur l’accueil (récap 6 étapes). */

export const ADOPTION_PROCESS_INTRO = {
  title: "Comment adopter votre compagnon ?",
  description:
    "Un processus simple et transparent en 6 étapes pour vous accompagner dans votre projet d’adoption au Domaine Sibérania.",
} as const;

export const ADOPTION_PROCESS_STEPS = [
  {
    title: "Découvrir nos compagnons",
    body: "Parcourez nos petits cœurs et les portées pour voir les Pomsky, Shiba Inu, Teckel et Maine Coon disponibles, leurs parents et leur statut.",
  },
  {
    title: "Contacter l’élevage",
    body: "Présentez votre foyer et votre projet. Nous échangeons pour vérifier l’adéquation famille / animal, sans précipitation.",
  },
  {
    title: "Rencontrer et échanger",
    body: "Visite sur rendez-vous au domaine, ou échanges à distance. Posez toutes vos questions sur le caractère, l’entretien et la vie quotidienne.",
  },
  {
    title: "Choix et réservation",
    body: "Une fois le profil choisi, nous fixons les modalités d’adoption, le calendrier de départ et les documents nécessaires.",
  },
  {
    title: "Documents et engagement",
    body: "Signez le certificat d’engagement et de connaissance au minimum 7 jours avant la remise. Identification, carnet de santé et contrat sont vérifiés.",
    ctaHref: "/certificat-engagement",
    ctaLabel: "Télécharger le certificat",
  },
  {
    title: "Accueil et suivi",
    body: "Votre compagnon vous rejoint sur place ou par envoi partout en France et à l’étranger. Nous restons disponibles pour le suivi des premiers mois.",
  },
] as const;
