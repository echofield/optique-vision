// Mock API surface for Optique OS.
// The whole app runs on the seed data in ./data so it is clickable before any
// backend exists. Keep these shapes stable so a real REST/tRPC/WebSocket layer
// can drop in without touching the screens.

import { NOTIFICATIONS } from "./data";

export function fetchNotifications() {
  // A real backend would return the current notification list for the operator.
  return Promise.resolve(NOTIFICATIONS.map((n) => ({ ...n })));
}

// Real-time push stub. A real implementation opens a WebSocket / SSE channel and
// invokes `onEvent` with each new notification; here it is a no-op that returns an
// unsubscribe function so callers can wire it up exactly as in production.
export function subscribeNotifications(onEvent) {
  // const ws = new WebSocket(`${WS_BASE}/notifications`);
  // ws.onmessage = (e) => onEvent(JSON.parse(e.data));
  // return () => ws.close();
  void onEvent;
  return () => {};
}
