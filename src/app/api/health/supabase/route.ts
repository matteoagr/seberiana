import { pingSupabase } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await pingSupabase();
    return Response.json(
      {
        connected: result.ok,
        project: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
        error: result.error,
        hint: result.ok
          ? "Supabase OK — table animals accessible."
          : "Schéma pas encore appliqué ? Voir supabase/migrations/20260823_lightweight_schema.sql",
      },
      { status: result.ok ? 200 : 503 },
    );
  } catch (error) {
    return Response.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
