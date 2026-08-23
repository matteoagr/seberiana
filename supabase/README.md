# Supabase — Domaine Sibérania

Schéma actif : `migrations/20260823_lightweight_schema.sql`  
(appliqué en prod via MCP `apply_migration` : `lightweight_schema_v2`).

L’ancien fichier `20260823_init_schema.sql` est obsolète (breeds / galleries séparées).

## Admin Auth

```bash
node --env-file=.env.local scripts/create-admin.mjs
```
