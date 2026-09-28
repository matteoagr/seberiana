import { ContactMessagesList } from "@/components/admin/ContactMessagesList";
import { adminListContactRequests } from "@/lib/supabase/queries";

export default async function AdminMessagesPage() {
  const messages = await adminListContactRequests();
  const newCount = messages.filter((m) => m.status === "nouveau").length;

  return (
    <div>
      <p className="font-serif text-sm text-gold/90">Messages</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground">Boîte de réception</h1>
      <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
        Demandes reçues via le formulaire contact et les activités. Un email vous est aussi
        envoyé à <span className="text-foreground/90">elevagesiberania@gmail.com</span> —
        répondez directement à cet email pour écrire au contact.
      </p>
      {newCount > 0 ? (
        <p className="mt-4 text-sm text-gold-soft">
          {newCount} nouveau{newCount > 1 ? "x" : ""} message{newCount > 1 ? "s" : ""}
        </p>
      ) : null}
      <ContactMessagesList messages={messages} />
    </div>
  );
}
