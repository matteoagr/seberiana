export type Species = "canin" | "felin";
export type AnimalStatus = "disponible" | "reserve" | "adopte";
export type AnimalRole = "reproducteur" | "jeune" | "autre";
export type AnimalSex = "male" | "female";
export type LitterStatus = "a_venir" | "nee" | "cloturee";

export type AnimalRow = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: AnimalSex;
  birth_date: string | null;
  color: string;
  status: AnimalStatus;
  role: AnimalRole;
  is_lof: boolean;
  litter_id: string | null;
  sire_id: string | null;
  dam_id: string | null;
  lineage_label: string;
  description: string;
  cover_image_path: string | null;
  cover_url: string | null;
  published: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type LitterRow = {
  id: string;
  title: string;
  species: Species;
  breed: string;
  sire_id: string | null;
  dam_id: string | null;
  birth_date: string | null;
  status: LitterStatus;
  description: string;
  cover_image_path: string | null;
  published: boolean;
  archived: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryTag = "pomsky" | "teckel" | "maine-coon" | "shiba" | "domaine";

export const GALLERY_TAGS: GalleryTag[] = [
  "pomsky",
  "teckel",
  "maine-coon",
  "shiba",
  "domaine",
];

export type MediaRow = {
  id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  animal_id: string | null;
  litter_id: string | null;
  gallery_key: string | null;
  gallery_tag: GalleryTag | null;
  created_at: string;
};

/** View model for public UI cards */
export type AnimalCardModel = {
  id: string;
  name: string;
  species: Species;
  breed: string;
  sex: "Mâle" | "Femelle";
  sexRaw: AnimalSex;
  birthDate: string | null;
  color: string;
  status: AnimalStatus;
  role: AnimalRole;
  isLof: boolean;
  lineage: string;
  description: string;
  image: string;
  parentsLabel: string | null;
  sireName: string | null;
  damName: string | null;
};

export type LitterCardModel = {
  id: string;
  title: string;
  species: Species;
  breed: string;
  birthDate: string | null;
  status: LitterStatus;
  description: string;
  image: string;
  parentsLabel: string;
  availableCount: number;
  animals: AnimalCardModel[];
};

export type GalleryImage = {
  src: string;
  alt: string;
  tag: GalleryTag | null;
};

export type ParentPreview = {
  id: string;
  name: string;
  breed: string;
  image: string;
  published: boolean;
  sex?: AnimalSex;
};

export type AnimalDetailModel = AnimalCardModel & {
  photos: GalleryImage[];
  sire: ParentPreview | null;
  dam: ParentPreview | null;
  offspring: ParentPreview[];
  siblings: ParentPreview[];
  litterTitle: string | null;
};
