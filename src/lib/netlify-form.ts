/** Envoi vers Netlify Forms (détection via public/__forms.html). */

export async function submitNetlifyForm(
  values: Record<string, string>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const body = new URLSearchParams();
  body.set("form-name", "contact");

  for (const [key, value] of Object.entries(values)) {
    if (value.trim() !== "") body.set(key, value.trim());
  }

  try {
    const response = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    // Netlify renvoie souvent 200 HTML ; certains runtimes 302.
    if (!response.ok && response.status >= 400) {
      return {
        ok: false,
        error: "L’envoi a échoué. Réessayez ou écrivez-nous par email.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Impossible d’envoyer le message. Vérifiez votre connexion.",
    };
  }
}

export function formDataToRecord(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}
