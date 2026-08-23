import Link from "next/link";
import { archiveAnimalAction } from "@/app/admin/actions";
import { sexLabels, speciesLabels } from "@/lib/labels";
import { adminListBreeders } from "@/lib/supabase/queries";

export default async function AdminReproducteursPage() {
  const breeders = await adminListBreeders();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-serif text-sm text-gold/90">Étape 2</p>
          <h1 className="mt-1 font-serif text-3xl text-foreground">Reproducteurs</h1>
          <p className="mt-2 max-w-xl text-sm text-foreground-muted">
            Pères et mères de l’élevage — à renseigner avant de créer une portée.
          </p>
        </div>
        <Link
          href="/admin/reproducteurs/nouveau"
          className="rounded-lg border border-gold/50 bg-gold/12 px-4 py-2 text-sm text-gold-soft hover:bg-gold/22"
        >
          Nouveau reproducteur
        </Link>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-line/60">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line bg-background-elevated/60 text-foreground-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Espèce / Race</th>
              <th className="px-4 py-3 font-medium">Sexe</th>
              <th className="px-4 py-3 font-medium">LOF</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {breeders.map((animal) => (
              <tr key={animal.id} className="border-b border-line/40">
                <td className="px-4 py-3 text-foreground">{animal.name}</td>
                <td className="px-4 py-3 text-foreground-muted">
                  {speciesLabels[animal.species]} · {animal.breed}
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {sexLabels[animal.sex]}
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {animal.is_lof ? "Oui" : "Non"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/reproducteurs/${animal.id}`}
                      className="text-gold-soft hover:text-gold"
                    >
                      Modifier
                    </Link>
                    {!animal.archived ? (
                      <form
                        action={async () => {
                          "use server";
                          await archiveAnimalAction(animal.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-foreground-muted hover:text-gold-soft"
                        >
                          Archiver
                        </button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {breeders.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-foreground-muted">
            Ajoutez vos reproducteurs pour pouvoir créer des portées.
          </p>
        ) : null}
      </div>
    </div>
  );
}
