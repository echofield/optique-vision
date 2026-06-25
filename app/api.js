// Data layer for Optique OS.
// With Supabase env present, the stateful surfaces (relances, arrivages,
// notifications) read/write the isolated optique_* tables and notifications push
// live over Realtime. Without env, everything falls back to in-memory seed so the
// prototype stays clickable. Stock / formation / clients stay seed-backed for now.

import { supabase, supabaseEnabled } from "./supabase";
import { NOTIFICATIONS, RELANCES, ARRIVALS } from "./data";

const mapNotif = (r) => ({ id: r.id, type: r.type, day: r.day, time: r.time_label, title: r.title, detail: r.detail, client: r.client, action: r.action, read: r.read, dismissed: r.dismissed });
const mapRelance = (r) => ({ ...r, when: r.due_when });

// ── reads ──────────────────────────────────────────────────────
export async function fetchNotifications() {
  if (!supabaseEnabled) return NOTIFICATIONS.map((n) => ({ ...n }));
  const { data, error } = await supabase.from("optique_notifications").select("*").order("created_at", { ascending: false });
  if (error || !data) return NOTIFICATIONS.map((n) => ({ ...n }));
  return data.map(mapNotif);
}
export async function fetchRelances() {
  if (!supabaseEnabled) return RELANCES.map((r) => ({ ...r }));
  const { data, error } = await supabase.from("optique_relances").select("*").order("sort", { ascending: true });
  if (error || !data) return RELANCES.map((r) => ({ ...r }));
  return data.map(mapRelance);
}
export async function fetchArrivals() {
  if (!supabaseEnabled) return ARRIVALS.map((a) => ({ ...a }));
  const { data, error } = await supabase.from("optique_arrivals").select("*").order("sort", { ascending: true });
  if (error || !data) return ARRIVALS.map((a) => ({ ...a }));
  return data;
}

// ── writes (fire-and-forget; UI updates optimistically) ─────────
export async function dbSendRelance(id) {
  if (!supabaseEnabled) return;
  await supabase.from("optique_relances").update({ sent: true, sent_at: new Date().toISOString() }).eq("id", id);
}
export async function dbSendAllDue() {
  if (!supabaseEnabled) return;
  await supabase.from("optique_relances").update({ sent: true, sent_at: new Date().toISOString() }).eq("due_when", "Aujourd'hui");
}
export async function dbResolveArrival(id, clientId) {
  if (!supabaseEnabled) return;
  await supabase.from("optique_arrivals").update({ matched_client: clientId, resolved: true }).eq("id", id);
}
export async function dbInsertNotif(n) {
  if (!supabaseEnabled) return;
  await supabase.from("optique_notifications").insert({ id: n.id, type: n.type, day: n.day, time_label: n.time, title: n.title, detail: n.detail, client: n.client || null, action: n.action || null, read: n.read ?? false });
}
export async function dbMarkRead(id) {
  if (!supabaseEnabled) return;
  await supabase.from("optique_notifications").update({ read: true }).eq("id", id);
}
export async function dbMarkAllRead() {
  if (!supabaseEnabled) return;
  await supabase.from("optique_notifications").update({ read: true }).eq("dismissed", false);
}
export async function dbDismiss(id) {
  if (!supabaseEnabled) return;
  await supabase.from("optique_notifications").update({ dismissed: true }).eq("id", id);
}

// ── realtime push (the stub is now a real Supabase channel) ─────
// Forwards each postgres change on optique_notifications as { kind, row }.
export function subscribeNotifications(onEvent) {
  if (!supabaseEnabled) return () => {};
  const ch = supabase
    .channel("optique_notifications_rt")
    .on("postgres_changes", { event: "*", schema: "public", table: "optique_notifications" }, (payload) => {
      const row = payload.new && payload.new.id ? payload.new : payload.old;
      onEvent({ kind: payload.eventType, row: row ? mapNotif(row) : null });
    })
    .subscribe();
  return () => supabase.removeChannel(ch);
}
