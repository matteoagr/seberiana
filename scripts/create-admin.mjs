/**
 * One-off script: create the admin Auth user via Auth Admin REST API
 * (avoids supabase-js Realtime / WebSocket requirement on Node 20).
 *
 * Usage:
 *   node --env-file=.env.local scripts/create-admin.mjs
 *
 * Optional env overrides:
 *   ADMIN_EMAIL=admin@siberiana.fr
 *   ADMIN_PASSWORD=change-me-strong
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL || "admin@siberiana.fr";
const password = process.env.ADMIN_PASSWORD || "SiberianaAdmin2026!";

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const res = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
  }),
});

const body = await res.json().catch(() => ({}));

if (!res.ok) {
  const msg = body?.msg || body?.message || res.statusText;
  if (String(msg).toLowerCase().includes("already") || res.status === 422) {
    console.log(`User already exists (or conflict): ${email}`);
    console.log(msg);
    process.exit(0);
  }
  console.error("Failed to create admin:", msg);
  process.exit(1);
}

console.log("Admin user created:");
console.log(`  email: ${email}`);
console.log(`  id: ${body?.id ?? body?.user?.id ?? "?"}`);
console.log("Connect at /admin/login");
console.log(`Password: ${password}`);
