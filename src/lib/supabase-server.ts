import { createClient } from "@supabase/supabase-js";

export function createSupabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { db: { schema: "sheng_jisho" } }
  );
}
