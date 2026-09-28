import {
  deleteContactRequestFormAction,
  updateContactStatusFormAction,
} from "@/app/admin/actions";
import { contactStatusLabels } from "@/lib/labels";
import type { ContactRequestRow, ContactStatus } from "@/lib/supabase/types";

const interestLabels: Record<string, string> = {
  annuaire: "Nos petits cœurs",
  portees: "Portée",
  pomsky: "Pomsky",
  teckel: "Teckel",
  "maine-coon": "Maine Coon",
  visite: "Visite",
  "puppy-yoga": "Puppy yoga",
  magnetisme: "Magnétisme",
  mediation: "Médiation",
  partenariat: "Partenariat",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusClass(status: ContactStatus): string {
  if (status === "nouveau") return "border-gold/40 bg-gold/12 text-gold-soft";
  if (status === "repondu") return "border-line bg-background text-foreground-muted";
  return "border-line/80 bg-background-elevated text-foreground/85";
}

export function ContactMessagesList({
  messages,
}: {
  messages: ContactRequestRow[];
}) {
  if (messages.length === 0) {
    return (
      <p className="mt-8 rounded-xl border border-line/60 bg-background-elevated/40 px-5 py-10 text-center text-sm text-foreground-muted">
        Aucun message pour le moment. Les demandes du formulaire contact et des
        activités apparaîtront ici.
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {messages.map((msg) => {
        const fullName = `${msg.first_name} ${msg.last_name}`.trim();
        const interest = interestLabels[msg.interest] || msg.interest;
        const mailto = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(`Re: Domaine Sibérania — ${interest}`)}`;

        return (
          <li
            key={msg.id}
            className="rounded-xl border border-line/60 bg-background-elevated/40 p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-xl text-foreground">{fullName}</h2>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide ${statusClass(msg.status)}`}
                  >
                    {contactStatusLabels[msg.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-foreground-muted">
                  {formatDate(msg.created_at)} · {interest}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <a
                  href={mailto}
                  className="rounded-lg border border-gold/50 bg-gold/12 px-3 py-1.5 text-gold-soft hover:bg-gold/22"
                >
                  Répondre par email
                </a>
              </div>
            </div>

            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-gold/75">Email</dt>
                <dd className="mt-0.5">
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-foreground/90 hover:text-gold-soft"
                  >
                    {msg.email}
                  </a>
                </dd>
              </div>
              {msg.phone ? (
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-gold/75">
                    Téléphone
                  </dt>
                  <dd className="mt-0.5">
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-foreground/90 hover:text-gold-soft"
                    >
                      {msg.phone}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>

            <p className="mt-4 whitespace-pre-wrap rounded-lg border border-line/40 bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground/85">
              {msg.message}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/40 pt-4">
              {(["nouveau", "lu", "repondu"] as const).map((status) => (
                <form key={status} action={updateContactStatusFormAction}>
                  <input type="hidden" name="id" value={msg.id} />
                  <input type="hidden" name="status" value={status} />
                  <button
                    type="submit"
                    disabled={msg.status === status}
                    className="rounded-lg border border-line px-2.5 py-1 text-xs text-foreground-muted transition-colors hover:border-gold/40 hover:text-gold-soft disabled:opacity-40"
                  >
                    Marquer {contactStatusLabels[status].toLowerCase()}
                  </button>
                </form>
              ))}
              <form action={deleteContactRequestFormAction} className="ml-auto">
                <input type="hidden" name="id" value={msg.id} />
                <button
                  type="submit"
                  className="text-xs text-red-300/90 hover:text-red-200"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
