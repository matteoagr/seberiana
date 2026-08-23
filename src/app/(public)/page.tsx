import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Logo } from "@/components/Logo";
import { SectionHeading } from "@/components/SectionHeading";
import { getAvailableCount } from "@/lib/supabase/queries";

export default async function HomePage() {
  const availableCount = await getAvailableCount();

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80"
            alt="Paysage boisé du Domaine Sibérania"
            fill
            priority
            className="object-cover ken-burns"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/45 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(212,160,74,0.12),transparent_55%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-20 pt-28 text-center sm:px-8 sm:pb-24">
          <div className="reveal">
            <Logo size="hero" priority href={null} />
          </div>
          <h1 className="reveal reveal-delay-1 mt-2 font-serif text-4xl text-foreground sm:text-5xl md:text-6xl">
            Domaine Sibérania
          </h1>
          <p className="reveal reveal-delay-2 mt-5 max-w-lg text-base leading-relaxed text-foreground/85 sm:text-lg">
            Élevage familial de Pomsky, Shiba Inu, Teckel et Maine Coon — des compagnons
            élevés avec amour, pour des familles qui comptent.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/annuaire">Voir l’annuaire</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Nous écrire
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-background-elevated/35">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-16 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-20">
          <SectionHeading
            eyebrow="Futurs adoptants"
            title="Trouvez votre compagnon"
            description={
              availableCount > 0
                ? `${availableCount} profil${availableCount > 1 ? "s" : ""} disponible${availableCount > 1 ? "s" : ""} en ce moment.`
                : "Consultez l’annuaire pour découvrir nos compagnons."
            }
          />
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/annuaire?statut=disponible">
              Les disponibles
            </ButtonLink>
            <ButtonLink href="/portees" variant="ghost">
              Voir les portées
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-line">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[340px] lg:min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=1400&q=80"
              alt="Élevage canin Sibérania"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <p className="font-serif text-sm text-gold/90">Chiens</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">
                Pomsky, Shiba & Teckel
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
                Nos chiots grandissent ici, entourés de soin et de jeu.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/annuaire?espece=canin">Annuaire chiens</ButtonLink>
                <ButtonLink href="/elevage-canin" variant="ghost">
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px] lg:min-h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1400&q=80"
              alt="Élevage félin Sibérania"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-l" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <p className="font-serif text-sm text-gold/90">Chats</p>
              <h2 className="mt-2 font-serif text-3xl text-foreground">
                Maine Coon
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/80">
                Des chatons doux et curieux, dans un cadre calme et familial.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/annuaire?espece=felin">Annuaire chats</ButtonLink>
                <ButtonLink href="/elevage-felin" variant="ghost">
                  En savoir plus
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
