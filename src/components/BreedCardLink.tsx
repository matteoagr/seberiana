import Link from "next/link";
import type { BreedProfile } from "@/data/breeds";

type BreedCardLinkProps = {
  breed: BreedProfile;
};

export function BreedCardLink({ breed }: BreedCardLinkProps) {
  return (
    <Link
      href={`/races/${breed.slug}`}
      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-gold/90 transition-colors hover:text-gold-soft sm:text-base"
    >
      Fiche race {breed.name}
      <span aria-hidden>→</span>
    </Link>
  );
}
