import "server-only";

import { Resend } from "resend";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

export type ContactNotifyPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  interest: string;
  message: string;
};

const interestLabels: Record<string, string> = {
  annuaire: "Un de nos petits cœurs",
  portees: "Une portée",
  pomsky: "Pomsky",
  teckel: "Teckel",
  "maine-coon": "Maine Coon",
  visite: "Une visite",
  "puppy-yoga": "Puppy yoga",
  magnetisme: "Magnétisme animalier",
  mediation: "Médiation animale",
  partenariat: "Partenariat",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Notifie l’élevage ; Reply-To = email du contact pour répondre en 1 clic. */
export async function sendContactNotification(
  payload: ContactNotifyPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("RESEND_API_KEY manquant — email de contact non envoyé.");
    return { ok: false, error: "Configuration email manquante." };
  }

  const to = process.env.CONTACT_NOTIFY_TO?.trim() || CONTACT_EMAIL;
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    `${SITE_NAME} <onboarding@resend.dev>`;

  const fullName = `${payload.firstName} ${payload.lastName}`.trim();
  const interestLabel = interestLabels[payload.interest] || payload.interest;
  const subject = `[${SITE_NAME}] Nouveau message — ${interestLabel} — ${fullName}`;

  const text = [
    `Nouveau message depuis ${SITE_URL}`,
    "",
    `De : ${fullName}`,
    `Email : ${payload.email}`,
    payload.phone ? `Téléphone : ${payload.phone}` : null,
    `Sujet : ${interestLabel}`,
    "",
    "Message :",
    payload.message,
    "",
    "—",
    "Répondez à cet email pour écrire directement au contact (Reply-To).",
  ]
    .filter((line) => line != null)
    .join("\n");

  const html = `
    <div style="font-family:Georgia,serif;line-height:1.5;color:#1a1612">
      <p>Nouveau message depuis <a href="${SITE_URL}">${SITE_NAME}</a>.</p>
      <p>
        <strong>De :</strong> ${escapeHtml(fullName)}<br/>
        <strong>Email :</strong> ${escapeHtml(payload.email)}<br/>
        ${payload.phone ? `<strong>Téléphone :</strong> ${escapeHtml(payload.phone)}<br/>` : ""}
        <strong>Sujet :</strong> ${escapeHtml(interestLabel)}
      </p>
      <p style="white-space:pre-wrap;border-left:3px solid #c5963a;padding-left:12px">
${escapeHtml(payload.message)}
      </p>
      <p style="color:#666;font-size:13px">
        Répondez à cet email pour écrire directement au contact.
      </p>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error("sendContactNotification", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erreur d’envoi email";
    console.error("sendContactNotification", message);
    return { ok: false, error: message };
  }
}
