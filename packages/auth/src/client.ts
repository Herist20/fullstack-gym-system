import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@gym/database";

export function createAuthClient(supabaseUrl: string, supabaseKey: string) {
  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
}
