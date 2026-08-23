"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction, type ActionResult } from "@/app/admin/actions";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/animaux";
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null,
  );

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5">
      <p className="font-serif text-sm text-gold/90">Administration</p>
      <h1 className="mt-2 font-serif text-3xl text-foreground">Connexion</h1>
      <p className="mt-3 text-sm text-foreground-muted">
        Accès réservé à l’équipe du Domaine Sibérania.
      </p>

      <form action={formAction} className="mt-10 space-y-5">
        <input type="hidden" name="next" value={next} />
        <div>
          <label className="block text-sm text-gold/90" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-2 w-full rounded-lg border border-line bg-background px-4 py-3 text-sm outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="block text-sm text-gold/90" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-lg border border-line bg-background px-4 py-3 text-sm outline-none focus:border-gold/50"
          />
        </div>
        {state && !state.ok ? (
          <p className="text-sm text-red-300">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-lg border border-gold/50 bg-gold/12 px-6 py-2.5 text-sm font-medium text-gold-soft transition-colors hover:bg-gold/22 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
