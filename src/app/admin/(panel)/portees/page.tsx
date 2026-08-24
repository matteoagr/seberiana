import Link from "next/link";
import { archiveLitterAction, unarchiveLitterAction } from "@/app/admin/actions";
import { litterStatusLabels, speciesLabels } from "@/lib/labels";
import { adminListLitters, type AdminLitterSummary } from "@/lib/supabase/queries";

type PageProps = {
  searchParams: Promise<{ ok?: string }>;
};

function LitterAdminCard({
  litter,
  archivedSection,
}: {
  litter: AdminLitterSummary;
  archivedSection?: boolean;
}) {
  return (
    <article className="rounded-xl border border-line/60 bg-background-elevated/30 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-foreground">{litter.title}</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            {speciesLabels[litter.species]} · {litter.breed}
            {litter.birth_date ? ` · ${litter.birth_date}` : ""}
          </p>
          <p className="mt-1 text-sm text-foreground-muted">
            {litter.sireName && litter.damName
              ? `${litter.sireName} × ${litter.damName}`
              : "Parents à renseigner"}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="text-gold-soft">
            {litter.availableCount} dispo · {litter.youngCount} jeune
            {litter.youngCount > 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-foreground-muted">
            {litterStatusLabels[litter.status]}
            {archivedSection
              ? " · Archivée"
              : litter.published
                ? " · Publiée"
                : " · Brouillon"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/admin/portees/${litter.id}`}
          className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold-soft hover:bg-gold/10"
        >
          Gérer la portée
        </Link>
        {!archivedSection ? (
          <>
            <Link
              href={`/admin/portees/${litter.id}/jeunes/nouveau`}
              className="rounded-lg border border-line px-4 py-2 text-sm text-foreground-muted hover:border-gold/40"
            >
              + Ajouter un jeune
            </Link>
            <form
              action={async () => {
                "use server";
                await archiveLitterAction(litter.id);
              }}
            >
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm text-foreground-muted hover:text-gold-soft"
              >
                Archiver
              </button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await unarchiveLitterAction(litter.id);
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-gold/40 px-4 py-2 text-sm text-gold-soft hover:bg-gold/10"
            >
              Désarchiver
            </button>
          </form>
        )}
      </div>
    </article>
  );
}

export default async function AdminPorteesPage({ searchParams }: PageProps) {
  const [{ ok }, litters] = await Promise.all([searchParams, adminListLitters()]);

  const active = litters.filter((litter) => !litter.archived);
  const archived = litters.filter((litter) => litter.archived);

  const successMessage =
    ok === "en-ligne"
      ? "La portée est en ligne."
      : ok === "enregistree"
        ? "La portée a été enregistrée."
        : ok === "supprime"
          ? "La portée a été retirée du site et de l’admin. Elle reste en base."
          : null;

  return (
    <div>
      {successMessage ? (
        <p
          role="status"
          className="mb-6 rounded-xl border border-gold/35 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
        >
          {successMessage}
        </p>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-sm text-gold/90">Étape 1</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Portées</h1>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            Créez une portée, choisissez les parents, puis ajoutez les jeunes directement
            depuis la fiche portée.
          </p>
        </div>
        <Link
          href="/admin/portees/nouveau"
          className="rounded-lg border border-gold/50 bg-gold/12 px-4 py-2 text-sm text-gold-soft hover:bg-gold/22"
        >
          Nouvelle portée
        </Link>
      </div>

      <div className="mt-10 space-y-4">
        {active.map((litter) => (
          <LitterAdminCard key={litter.id} litter={litter} />
        ))}
        {active.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line/70 px-6 py-12 text-center text-sm text-foreground-muted">
            {archived.length > 0
              ? "Aucune portée active. Les archives sont plus bas."
              : "Commencez par créer une portée."}
          </p>
        ) : null}
      </div>

      {archived.length > 0 ? (
        <section className="mt-16 border-t border-line/60 pt-10">
          <h2 className="font-serif text-2xl text-foreground">Archive</h2>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            Portées retirées du site public, conservées ici pour consultation.
          </p>
          <div className="mt-6 space-y-4">
            {archived.map((litter) => (
              <LitterAdminCard key={litter.id} litter={litter} archivedSection />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
