# Domaine Sibérania

Vitrine digitale de l’élevage **Sibérania** — design Dark & Soft, Next.js App Router + Supabase.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (Postgres, Auth, Storage)

## Variables d’environnement

Fichier `.env.local` (déjà gitignoré) :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Schéma (léger)

| Table | Rôle |
| --- | --- |
| `animals` | Reproducteurs + jeunes (espèce, race texte, sexe, couleur, statut, LOF, parents, portée…) |
| `litters` | Portées (père/mère, statut, description) |
| `media` | Photos (animal / portée / `gallery_key`) |
| `contact_requests` | Messages du formulaire public |

Buckets Storage : `animals`, `litters`, `galleries`, `media`.

## Pages publiques

| Route | Source de données |
| --- | --- |
| `/` | Compteur d’animaux disponibles |
| `/annuaire` | `animals` (filtres espèce / race / statut) |
| `/portees` | `litters` + jeunes liés |
| `/elevage-canin` | reproducteurs canins + galerie `elevage_canin` |
| `/elevage-felin` | reproducteurs félins + galerie `elevage_felin` |
| `/contact` | insert `contact_requests` |

## Back-office

| Route | Contenu |
| --- | --- |
| `/admin/login` | Connexion email / mot de passe |
| `/admin/animaux` | Liste / créer / modifier / archiver |
| `/admin/portees` | Liste / créer / modifier / archiver |
| `/admin/medias` | Upload / assignation / suppression |

Middleware protège `/admin/*` (sauf login). Les écritures passent par l’utilisateur authentifié + RLS.

### Créer le compte admin

```bash
node --env-file=.env.local scripts/create-admin.mjs
```

Par défaut : `admin@siberiana.fr` / `SiberianaAdmin2026!`  
(surcharge possible via `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

Puis ouvrir [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Développement

```bash
npm install
npm run dev
```

Santé Supabase : [http://localhost:3000/api/health/supabase](http://localhost:3000/api/health/supabase).
