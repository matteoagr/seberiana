import Link from "next/link";
import type { BreedProfile } from "@/data/breeds";

type BreedCardLinkProps = {
  breed: BreedProfile;
};

export function BreedCardLink({ breed }: BreedCardLinkProps) {
  return (
    <Link
      href={`/races/${breed.slug}`}
      className="mt-4 inline-flex items-center gap-2 text-sm text-gold/90 transition-colors hover:text-gold-soft"
    >
      Fiche race {breed.name}
      <span aria-hidden>→</span>
    </Link>
  );
}
