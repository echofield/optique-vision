import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// When env is absent the whole app falls back to in-memory seed data, so the
// repo still runs (and the prototype stays clickable) without any secrets.
export const supabaseEnabled = Boolean(url && key);
export const supabase = supabaseEnabled ? createClient(url, key, { auth: { persistSession: false } }) : null;
