import type { ReactNode } from "react";
import Link from "next/link";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="rounded-xl border border-line/60 bg-background-elevated/40 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 font-serif text-sm text-gold-soft">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl text-foreground">{title}</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-foreground-muted">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}

function Tip({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-gold/25 bg-gold/8 px-3 py-2 text-sm text-foreground/85">
      <span className="font-medium text-gold-soft">Astuce — </span>
      {children}
    </p>
  );
}

function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-gold-soft underline-offset-2 hover:underline">
      {children}
    </Link>
  );
}

export default function AdminAidePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-serif text-sm text-gold/90">Guide du back-office</p>
      <h1 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">
        Comment gérer le site
      </h1>
      <p className="mt-4 text-base leading-relaxed text-foreground-muted">
        Ce guide est pensé pour une personne débutante. Suivez les étapes dans l’ordre :
        d’abord les parents (reproducteurs), puis une portée, puis les petits, puis les
        photos. Chaque changement se retrouve ensuite sur le site public. Les messages du
        formulaire contact arrivent aussi dans{" "}
        <DocLink href="/admin/messages">Messages</DocLink>.
      </p>

      <section className="mt-10 rounded-xl border border-line/60 bg-background-elevated/30 p-5 sm:p-6">
        <h2 className="font-serif text-2xl text-foreground">En 30 secondes</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground-muted">
          <li>
            <strong className="text-foreground/90">Reproducteurs</strong> = les parents (chiens
            / chats de l’élevage).
          </li>
          <li>
            <strong className="text-foreground/90">Portées</strong> = une naissance (ou une
            naissance à venir) avec père + mère.
          </li>
          <li>
            <strong className="text-foreground/90">Animaux / jeunes</strong> = les petits
            (chiots ou chatons) visibles dans « Nos petits cœurs ».
          </li>
          <li>
            <strong className="text-foreground/90">Galerie</strong> = les photos de la vie au
            domaine (page Galerie + accueil).
          </li>
        </ul>
      </section>

      <ol className="mt-10 space-y-5">
        <Step n={1} title="Se connecter">
          <p>
            Ouvrez{" "}
            <DocLink href="/admin/login">https://siberiana.fr/admin/login</DocLink> (ou
            /admin/login en local).
          </p>
          <p>
            Utilisez l’email <strong className="text-foreground/90">elevagesiberania@gmail.com</strong>{" "}
            et le mot de passe fourni. Cliquez sur <em>Se connecter</em>.
          </p>
          <Tip>
            Gardez cet accès pour vous. Pour vous déconnecter, utilisez le bouton
            « Déconnexion » en haut à droite. Les demandes des familles arrivent dans{" "}
            <DocLink href="/admin/messages">Messages</DocLink> (et aussi par email).
          </Tip>
        </Step>

        <Step n={2} title="Créer d’abord les reproducteurs (les parents)">
          <p>
            Allez dans <DocLink href="/admin/reproducteurs">Reproducteurs</DocLink> →{" "}
            <em>Nouveau reproducteur</em>.
          </p>
          <p>Remplissez au minimum :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nom</li>
            <li>Espèce (chien ou chat) et race (Pomsky, Teckel, Maine Coon…)</li>
            <li>Sexe</li>
            <li>Une photo de couverture si possible</li>
          </ul>
          <p>
            Cochez <em>Publié</em> pour qu’il apparaisse sur le site (pages élevage et{" "}
            <DocLink href="/reproducteurs">Reproducteurs</DocLink>).
          </p>
          <Tip>
            Créez le père et la mère avant la portée : vous pourrez ensuite les choisir dans
            les listes déroulantes.
          </Tip>
        </Step>

        <Step n={3} title="Créer une portée">
          <p>
            Allez dans <DocLink href="/admin/portees">Portées</DocLink> →{" "}
            <em>Nouvelle portée</em>.
          </p>
          <p>Indiquez :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Un titre clair (ex. « Portée Pomsky — Printemps 2026 »)</li>
            <li>L’espèce et la race</li>
            <li>Le père et la mère (reproducteurs déjà créés)</li>
            <li>La date de naissance (ou prévue)</li>
            <li>Le statut : à venir / née / clôturée</li>
          </ul>
          <p>
            Publiez la portée pour qu’elle apparaisse sur{" "}
            <DocLink href="/portees">/portees</DocLink>.
          </p>
        </Step>

        <Step n={4} title="Ajouter les petits (chiots / chatons)">
          <p>
            Ouvrez la portée concernée, puis ajoutez un jeune (bouton du type{" "}
            <em>Ajouter un jeune</em>).
          </p>
          <p>Pour chaque petit, renseignez surtout :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nom</li>
            <li>Sexe, couleur, date de naissance</li>
            <li>
              <strong className="text-foreground/90">Statut</strong> : disponible, réservé ou
              adopté — c’est ce que voient les familles dans Nos petits cœurs
            </li>
            <li>Photos (idéalement plusieurs)</li>
          </ul>
          <p>
            Publiez le profil pour qu’il sorte dans{" "}
            <DocLink href="/annuaire">Nos petits cœurs</DocLink>. Les reproducteurs n’y
            apparaissent pas : uniquement les jeunes.
          </p>
          <Tip>
            Quand un animal est réservé ou adopté, changez simplement son statut : le site se
            met à jour tout seul (quelques secondes à une minute).
          </Tip>
        </Step>

        <Step n={5} title="Gérer les photos de la galerie">
          <p>
            Allez dans <DocLink href="/admin/medias">Galerie</DocLink>.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>Choisissez un fichier image + une légende courte</li>
            <li>
              Laissez la galerie sur <em>Vie du domaine (accueil)</em> pour l’afficher sur le
              site
            </li>
            <li>Choisissez une catégorie (Pomsky, Teckel, Maine Coon, domaine…) pour les filtres</li>
            <li>Cliquez sur <em>Téléverser</em></li>
          </ol>
          <p>
            Pour changer l’ordre des photos : utilisez la poignée{" "}
            <strong className="text-foreground/90">⋮⋮</strong> et glissez-déposez les cartes.
            L’ordre est enregistré automatiquement.
          </p>
        </Step>

        <Step n={6} title="Vérifier sur le site public">
          <p>Après chaque modification importante, ouvrez le site dans un nouvel onglet :</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <DocLink href="/annuaire">Nos petits cœurs</DocLink> — jeunes publiés
            </li>
            <li>
              <DocLink href="/portees">Portées</DocLink>
            </li>
            <li>
              <DocLink href="/reproducteurs">Reproducteurs</DocLink>
            </li>
            <li>
              <DocLink href="/galerie">Galerie</DocLink>
            </li>
          </ul>
          <Tip>
            Si une info n’apparaît pas tout de suite, attendez environ une minute puis
            rafraîchissez la page (ou ouvrez-la en navigation privée).
          </Tip>
        </Step>
      </ol>

      <section className="mt-12 space-y-4">
        <h2 className="font-serif text-2xl text-foreground">Gestes du quotidien</h2>
        <ul className="space-y-3 text-sm leading-relaxed text-foreground-muted">
          <li className="rounded-xl border border-line/50 px-4 py-3">
            <strong className="text-foreground/90">Un chiot / chaton est réservé</strong>
            <br />
            Ouvrez sa fiche → passez le statut à <em>Réservé</em> → Enregistrer.
          </li>
          <li className="rounded-xl border border-line/50 px-4 py-3">
            <strong className="text-foreground/90">Il est adopté</strong>
            <br />
            Même chose avec le statut <em>Adopté</em>. Vous pouvez aussi archiver plus tard
            si vous ne voulez plus le voir dans les listes.
          </li>
          <li className="rounded-xl border border-line/50 px-4 py-3">
            <strong className="text-foreground/90">Ajouter des photos</strong>
            <br />
            Sur la fiche de l’animal (ou dans Galerie pour la vie du domaine). Préférez des
            images nettes, plutôt horizontales ou carrées.
          </li>
          <li className="rounded-xl border border-line/50 px-4 py-3">
            <strong className="text-foreground/90">Corriger une erreur</strong>
            <br />
            Rouvrez la fiche, modifiez, enregistrez. Rien n’est « figé » : vous pouvez
            toujours revenir en arrière.
          </li>
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="font-serif text-2xl text-foreground">En cas de doute</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground-muted">
          <li>
            <strong className="text-foreground/90">Rien ne s’affiche sur le site</strong> —
            vérifiez que la fiche est bien <em>publiée</em> (et non archivée).
          </li>
          <li>
            <strong className="text-foreground/90">Un reproducteur apparaît dans Nos
            petits</strong> — ce n’est plus normal : les reproducteurs ont leur propre page.
            Vérifiez que le rôle est bien « reproducteur », pas « jeune ».
          </li>
          <li>
            <strong className="text-foreground/90">Impossible de choisir le père /
            mère</strong> — créez d’abord les reproducteurs, puis revenez à la portée.
          </li>
          <li>
            <strong className="text-foreground/90">Mot de passe oublié</strong> — contactez
            la personne qui a mis le site en ligne pour le réinitialiser.
          </li>
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8">
        <Link
          href="/admin/portees"
          className="rounded-lg border border-gold/50 bg-gold/12 px-4 py-2 text-sm text-gold-soft hover:bg-gold/22"
        >
          Aller aux portées
        </Link>
        <Link
          href="/admin/reproducteurs"
          className="rounded-lg border border-line px-4 py-2 text-sm text-foreground-muted hover:border-gold/40 hover:text-gold-soft"
        >
          Voir les reproducteurs
        </Link>
        <Link
          href="/admin/medias"
          className="rounded-lg border border-line px-4 py-2 text-sm text-foreground-muted hover:border-gold/40 hover:text-gold-soft"
        >
          Ouvrir la galerie
        </Link>
      </div>
    </div>
  );
}
