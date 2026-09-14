"use client";

import { useActionState } from "react";
import { submitContactAction, type ActionResult } from "@/app/admin/actions";
import type { ActivityFormKind } from "@/data/activities";

const fieldClass =
  "mt-2 w-full rounded-lg border border-line bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-gold/50";
const labelClass = "block text-sm text-gold/90";

type ActivityInquiryFormProps = {
  kind: ActivityFormKind;
  interest: string;
  successNote: string;
};

export function ActivityInquiryForm({
  kind,
  interest,
  successNote,
}: ActivityInquiryFormProps) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    submitContactAction,
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-line/60 bg-background-elevated/60 p-6 sm:p-8">
        <p className="font-serif text-2xl text-gold-soft">Merci !</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{successNote}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-xl border border-line/60 bg-background-elevated/60 p-5 sm:p-7"
    >
      <input type="hidden" name="interest" value={interest} />
      <input type="hidden" name="activityKind" value={kind} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" name="firstName" required />
        <Field label="Nom" name="lastName" required />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required />
        <Field label="Téléphone" name="phone" type="tel" />
      </div>

      {kind === "puppy-yoga" ? <PuppyYogaFields /> : null}
      {kind === "magnetisme" ? <MagnetismeFields /> : null}
      {kind === "mediation" ? <MediationFields /> : null}

      {state && !state.ok ? (
        <p className="mt-4 text-sm text-red-300">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-gold/50 bg-gold/12 px-6 py-2.5 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/22 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Envoi…" : "Envoyer la demande"}
      </button>
    </form>
  );
}

function PuppyYogaFields() {
  return (
    <>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Date souhaitée" name="preferredDate" type="date" />
        <Field
          label="Nombre de participants"
          name="participants"
          type="number"
          min={1}
          required
        />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="level">
          Niveau de yoga
        </label>
        <select id="level" name="level" className={fieldClass} defaultValue="debutant">
          <option value="debutant">Débutant — je découvre</option>
          <option value="intermediaire">J’ai déjà pratiqué</option>
          <option value="regulier">Je pratique régulièrement</option>
        </select>
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          Message (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          className={fieldClass}
          placeholder="Allergies, accessibilité, cadeau, questions…"
        />
      </div>
    </>
  );
}

function MagnetismeFields() {
  return (
    <>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field label="Nom de l’animal" name="animalName" required />
        <div>
          <label className={labelClass} htmlFor="animalSpecies">
            Espèce
          </label>
          <select
            id="animalSpecies"
            name="animalSpecies"
            className={fieldClass}
            defaultValue="chien"
            required
          >
            <option value="chien">Chien</option>
            <option value="chat">Chat</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="sessionMode">
          Format souhaité
        </label>
        <select
          id="sessionMode"
          name="sessionMode"
          className={fieldClass}
          defaultValue="presentiel"
          required
        >
          <option value="presentiel">Présentiel</option>
          <option value="distance">À distance</option>
          <option value="a-definir">À définir ensemble</option>
        </select>
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="reason">
          Motif de la demande
        </label>
        <textarea
          id="reason"
          name="reason"
          required
          rows={4}
          className={fieldClass}
          placeholder="Décrivez brièvement la situation de votre animal…"
        />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          Informations complémentaires (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          className={fieldClass}
          placeholder="Âge, suivi vétérinaire, disponibilités…"
        />
      </div>
    </>
  );
}

function MediationFields() {
  return (
    <>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="audience">
            Public
          </label>
          <select
            id="audience"
            name="audience"
            className={fieldClass}
            defaultValue="particulier"
            required
          >
            <option value="particulier">Particulier</option>
            <option value="famille">Famille</option>
            <option value="structure">Structure / institution</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="format">
            Format
          </label>
          <select
            id="format"
            name="format"
            className={fieldClass}
            defaultValue="individuel"
            required
          >
            <option value="individuel">Individuel</option>
            <option value="groupe">Groupe</option>
            <option value="a-definir">À définir</option>
          </select>
        </div>
      </div>
      <div className="mt-5">
        <Field label="Structure ou organisation (si concerné)" name="organization" />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="objective">
          Objectif / projet
        </label>
        <textarea
          id="objective"
          name="objective"
          required
          rows={4}
          className={fieldClass}
          placeholder="Quel accompagnement recherchez-vous ?"
        />
      </div>
      <div className="mt-5">
        <label className={labelClass} htmlFor="message">
          Précisions (optionnel)
        </label>
        <textarea
          id="message"
          name="message"
          rows={2}
          className={fieldClass}
          placeholder="Lieu, dates envisagées, effectif…"
        />
      </div>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        className={fieldClass}
      />
    </div>
  );
}
