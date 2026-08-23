import Link from "next/link";
import { archiveLitterAction } from "@/app/admin/actions";
import { litterStatusLabels, speciesLabels } from "@/lib/labels";
import { adminListLitters } from "@/lib/supabase/queries";

type PageProps = {
  searchParams: Promise<{ ok?: string }>;
};

export default async function AdminPorteesPage({ searchParams }: PageProps) {
  const [{ ok }, litters] = await Promise.all([searchParams, adminListLitters()]);

  const successMessage =
    ok === "en-ligne"
      ? "La portée est en ligne."
      : ok === "enregistree"
        ? "La portée a été enregistrée."
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
        {litters.map((litter) => (
          <article
            key={litter.id}
            className="rounded-xl border border-line/60 bg-background-elevated/30 p-5 sm:p-6"
          >
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
                  {litter.archived
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
              <Link
                href={`/admin/portees/${litter.id}/jeunes/nouveau`}
                className="rounded-lg border border-line px-4 py-2 text-sm text-foreground-muted hover:border-gold/40"
              >
                + Ajouter un jeune
              </Link>
              {!litter.archived ? (
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
              ) : null}
            </div>
          </article>
        ))}
        {litters.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line/70 px-6 py-12 text-center text-sm text-foreground-muted">
            Commencez par créer une portée.
          </p>
        ) : null}
      </div>
    </div>
  );
}
