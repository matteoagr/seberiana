import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ActivityInquiryForm } from "@/components/ActivityInquiryForm";
import { ButtonLink } from "@/components/ButtonLink";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { activities, getActivityBySlug } from "@/data/activities";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return {};
  return buildPageMetadata({
    title: `${activity.title} — Domaine Sibérania`,
    description: activity.summary,
    path: `/activites/${activity.slug}`,
  });
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) notFound();

  return (
    <>
      <PageHero
        compact
        eyebrow={activity.eyebrow}
        title={activity.title}
        description={activity.summary}
        image={activity.image}
        imageAlt={activity.imageAlt}
      />

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <SectionHeading
              size="page"
              eyebrow="En pratique"
              title={`Le ${activity.shortTitle.toLowerCase()} au Domaine Sibérania`}
            />
            <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
              {activity.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ul className="mt-10 space-y-3 text-base text-foreground-muted">
              {activity.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold/70" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ButtonLink href="/activites" variant="ghost">
                Toutes les activités
              </ButtonLink>
            </div>
          </div>

          <div>
            <p className="font-serif text-sm text-gold/90">Réserver / demander</p>
            <h2 className="mt-2 font-serif text-2xl text-foreground">Votre demande</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
              {activity.formIntro}
            </p>
            <div className="mt-6">
              <Suspense
                fallback={
                  <p className="text-sm text-foreground-muted">Chargement du formulaire…</p>
                }
              >
                <ActivityInquiryForm
                  kind={activity.formKind}
                  interest={activity.interest}
                  successNote={activity.successNote}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-background-elevated/25">
        <div className="relative mx-auto min-h-[280px] max-w-6xl overflow-hidden sm:min-h-[360px]">
          <Image
            src={activity.image}
            alt={activity.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>
    </>
  );
}
