"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { submitContactAction, type ActionResult } from "@/app/admin/actions";

export function ContactForm() {
  const searchParams = useSearchParams();
  const animal = searchParams.get("animal");
  const interestParam = searchParams.get("interest");
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitContactAction,
    null,
  );

  const defaultInterest =
    interestParam === "pomsky" ||
    interestParam === "shiba" ||
    interestParam === "maine-coon" ||
    interestParam === "visite" ||
    interestParam === "annuaire" ||
    interestParam === "portees"
      ? interestParam
      : "annuaire";

  const defaultMessage = animal
    ? `Bonjour,\n\nJe suis intéressé(e) par ${animal}. Pourriez-vous m’en dire un peu plus ?\n\n`
    : "";

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-line/60 bg-background-elevated/60 p-8 sm:p-10">
        <p className="font-serif text-2xl text-gold-soft">Merci pour votre message !</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
          On a bien reçu votre demande et on vous répondra très vite.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-line/60 bg-background-elevated/60 p-5 sm:p-7"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" required />
        <Field label="Nom" name="lastName" required />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <Field label="Téléphone" name="phone" type="tel" />
      </div>
      <div className="mt-5">
        <label className="block text-sm text-gold/90" htmlFor="interest">
          Votre demande concerne
        </label>
        <select
          id="interest"
          name="interest"
          className="mt-2 w-full rounded-lg border border-line bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold/50"
          defaultValue={defaultInterest}
        >
          <option value="annuaire">Un de nos petits cœurs</option>
          <option value="portees">Une portée</option>
          <option value="pomsky">Pomsky</option>
          <option value="shiba">Shiba Inu</option>
          <option value="teckel">Teckel</option>
          <option value="maine-coon">Maine Coon</option>
          <option value="visite">Une visite</option>
          <option value="puppy-yoga">Puppy yoga</option>
          <option value="magnetisme">Magnétisme animalier</option>
          <option value="mediation">Médiation animale</option>
          <option value="partenariat">Partenariat</option>
        </select>
      </div>
      <div className="mt-5">
        <label className="block text-sm text-gold/90" htmlFor="message">
          Votre message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          defaultValue={defaultMessage}
          className="mt-2 w-full resize-y rounded-lg border border-line bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold/50"
          placeholder="Parlez-nous un peu de vous et de ce que vous cherchez…"
        />
      </div>
      {state && !state.ok ? (
        <p className="mt-4 text-sm text-red-300">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gold/50 bg-gold/12 px-6 py-2.5 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/22 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gold/90" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full rounded-lg border border-line bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold/50"
      />
    </div>
  );
}
