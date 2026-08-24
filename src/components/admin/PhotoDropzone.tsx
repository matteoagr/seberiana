"use client";

import { useActionState, useEffect, useRef, type ChangeEvent, type Ref } from "react";
import { useRouter } from "next/navigation";
import {
  uploadAnimalPhotosAction,
  type ActionResult,
} from "@/app/admin/actions";

type PhotoDropzoneProps = {
  animalId?: string;
  litterId?: string;
  compact?: boolean;
  inputName?: string;
};

function DropLabel({
  compact,
  pending,
  inputName,
  inputRef,
  onChange,
}: {
  compact: boolean;
  pending: boolean;
  inputName: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const boxClass = compact
    ? "relative flex min-h-[4.5rem] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold/35 bg-gold/5 px-3 py-2 text-center transition-colors hover:border-gold/60 hover:bg-gold/10"
    : "relative flex min-h-[9rem] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gold/40 bg-gold/5 px-4 py-6 text-center transition-colors hover:border-gold/70 hover:bg-gold/10";

  return (
    <label className={boxClass}>
      <input
        ref={inputRef}
        name={inputName}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <span className={compact ? "text-xs text-gold-soft" : "text-sm text-gold-soft"}>
        {pending ? "Envoi des photos…" : compact ? "Déposer ou cliquer" : "Glissez les photos ici, ou cliquez"}
      </span>
      {!compact && !pending ? (
        <span className="mt-1 text-xs text-foreground-muted">
          Plusieurs images d’un coup — JPG ou PNG.
        </span>
      ) : null}
    </label>
  );
}

export function PhotoDropzone({
  animalId,
  litterId,
  compact = false,
  inputName = "files",
}: PhotoDropzoneProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    uploadAnimalPhotosAction,
    null,
  );

  useEffect(() => {
    if (state?.ok) {
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    }
  }, [state, router]);

  if (!animalId) {
    return (
      <DropLabel compact={compact} pending={false} inputName={inputName} />
    );
  }

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="animal_id" value={animalId} />
      {litterId ? <input type="hidden" name="litter_id" value={litterId} /> : null}
      <DropLabel
        compact={compact}
        pending={pending}
        inputName={inputName}
        inputRef={inputRef}
        onChange={(event) => {
          const form = event.currentTarget.form;
          if (form && event.currentTarget.files?.length) form.requestSubmit();
        }}
      />
      {state && !state.ok ? (
        <p className="mt-1 text-xs text-red-300">{state.error}</p>
      ) : null}
    </form>
  );
}
