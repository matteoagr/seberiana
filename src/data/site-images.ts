/**
 * Photos du domaine pour les sections statiques.
 * Fichiers dans `public/photos/` — distincts de la galerie admin.
 */
export const siteImages = {
  /** Accueil — hero plein écran */
  homeHero: "/photos/home-hero.jpg",
  /** Accueil — bloc élevage canin */
  homeDogs: "/photos/home-dogs.jpg",
  /** Accueil — approche / cadre familial */
  homeApproach: "/photos/home-approach.jpg",
  /** Accueil — parcours d’adoption */
  homeAdoption: "/photos/home-adoption.jpg",
  /** Page élevage canin — hero */
  elevageCanin: "/photos/elevage-canin.jpg",
  /** Index fiches races — hero */
  races: "/photos/races.jpg",
  /** Nos petits cœurs — hero */
  annuaire: "/photos/annuaire.jpg",
  /** Portées — hero */
  portees: "/photos/portees.jpg",
  /** Contact — hero */
  contact: "/photos/contact.jpg",
  /** Fiche race Pomsky — chiots dans les bras */
  breedPomsky: "/photos/home-hero.jpg",
  /** Fiche race Teckel */
  breedTeckel: "/photos/breed-teckel.jpg",
  /** Fallback image absente */
  fallback: "/photos/fallback.jpg",
} as const;
