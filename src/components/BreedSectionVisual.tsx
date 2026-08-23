import Image from "next/image";
import type { ReactNode } from "react";
import type { BreedProfile } from "@/data/breeds";
import { BreedCardLink } from "@/components/BreedCardLink";
import { SectionHeading } from "@/components/SectionHeading";

type BreedSectionVisualProps = {
  breed: BreedProfile;
  title: string;
  description: string;
  children?: ReactNode;
  /** Inverse image / texte sur desktop */
  reverse?: boolean;
  muted?: boolean;
};

/** Section race avec photo d’exemple + contenu (reproducteurs, etc.). */
export function BreedSectionVisual({
  breed,
  title,
  description,
  children,
  reverse = false,
  muted = false,
}: BreedSectionVisualProps) {
  return (
    <section
      className={`border-t border-line ${muted ? "bg-background-elevated/40" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div
          className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={breed.heroImage}
              alt={`Exemple de ${breed.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHeading
              size="subsection"
              eyebrow={breed.name}
              title={title}
              description={description}
            />
            <BreedCardLink breed={breed} />
          </div>
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
