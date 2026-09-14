import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import {
  ADOPTION_PROCESS_INTRO,
  ADOPTION_PROCESS_STEPS,
} from "@/data/adoption-process";

type AdoptionProcessTimelineProps = {
  /** Affiche le bouton certificat sur l’étape Documents. */
  showCertificateCta?: boolean;
  /** Lien secondaire sous la timeline. */
  footerHref?: string;
  footerLabel?: string;
};

export function AdoptionProcessTimeline({
  showCertificateCta = true,
  footerHref = "/adoption",
  footerLabel = "Guide d’adoption responsable",
}: AdoptionProcessTimelineProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="font-serif text-sm text-gold/90">Adoption</p>
        <h2 className="mt-2 font-serif text-3xl text-foreground text-balance sm:text-4xl">
          {ADOPTION_PROCESS_INTRO.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
          {ADOPTION_PROCESS_INTRO.description}
        </p>
      </div>

      <ol className="relative mt-14 space-y-6">
        <span
          aria-hidden
          className="absolute bottom-8 left-[1.15rem] top-8 w-px bg-gold/25 sm:left-[1.35rem]"
        />
        {ADOPTION_PROCESS_STEPS.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 sm:gap-6">
            <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-background font-serif text-sm text-gold-soft sm:h-11 sm:w-11 sm:text-base">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1 border-b border-line/50 pb-6 sm:pb-8">
              <h3 className="font-serif text-xl text-foreground sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                {step.body}
              </p>
              {showCertificateCta && "ctaHref" in step && step.ctaHref ? (
                <div className="mt-4">
                  <ButtonLink href={step.ctaHref}>
                    {step.ctaLabel} →
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {footerHref && footerLabel ? (
        <div className="mt-10 flex justify-center">
          <Link
            href={footerHref}
            className="text-sm text-gold-soft transition-colors hover:underline"
          >
            {footerLabel} →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
