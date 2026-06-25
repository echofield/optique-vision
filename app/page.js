"use client";

import { useState, useEffect, useRef } from "react";
import * as D from "./data";
import { subscribeNotifications } from "./api";

// ── design tokens ─────────────────────────────────────────────
const T = {
  canvas: "#f5f1e8", ink: "#211d17", card: "#fffdf8", panel: "#f4f0e6",
  deep: "#163d2e", green: "#1f5641", green2: "#2f6e54", sage: "#8a9a7e",
  gold: "#b08d57", goldSoft: "#e0c98f", alert: "#b4472f", whatsapp: "#25D366",
  muted: "#9a917f", faint: "#b3a994", border: "#e7e0d2", border2: "#ddd4c4",
  text2: "#544e44", text3: "#6f685c",
};
const SERIF = "'Cormorant Garamond',serif";
const MONO = "'Space Mono',monospace";

const boMap = Object.fromEntries(D.BOUTIQUES.map((b) => [b.id, b]));
const tierMap = Object.fromEntries(D.TIERS.map((t) => [t.id, t]));
const clientMap = Object.fromEntries(D.CLIENTS.map((c) => [c.id, c]));
const eur = (n) => "€" + Number(n || 0).toLocaleString("fr-FR");
const tierOf = (id) => tierMap[id] || { name: id, hex: "#6f685c" };
const accentOf = (tid) => (tid === "prisme" ? T.gold : T.green);

// ── primitives ────────────────────────────────────────────────
function Eyebrow({ children, color = T.gold }) {
  return <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color }}>{children}</div>;
}
function Tag({ label, hex }) {
  return <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: hex, background: hex + "1a", border: `1px solid ${hex}55`, borderRadius: 999, padding: "4px 9px", whiteSpace: "nowrap", display: "inline-block" }}>{label}</span>;
}
function StatTile({ label, value, sub, subColor = T.muted }) {
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 15, padding: "16px 18px" }}>
      <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: T.muted }}>{label}</div>
      <div style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 500, lineHeight: 1.05, marginTop: 6, color: T.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 12, marginTop: 4, color: subColor }}>{sub}</div>}
    </div>
  );
}
function Avatar({ initials, bg = T.green, size = 40 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color: "#f5f1e8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: Math.round(size * 0.4), fontWeight: 600, flexShrink: 0 }}>{initials}</div>;
}
function H1({ children }) {
  return <h1 style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 500, lineHeight: 1, margin: "6px 0 0", letterSpacing: "-0.01em" }}>{children}</h1>;
}
function Card({ children, style }) {
  return <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, ...style }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, margin: "0 0 14px" }}>{children}</div>;
}

// ── app ───────────────────────────────────────────────────────
export default function OptiqueOS() {
  const [screen, setScreen] = useState("dashboard");
  const [clientId, setClientId] = useState("gabriel");
  const [boutiqueFilter, setBoutiqueFilter] = useState("all");
  const [stockCat, setStockCat] = useState("all");
  const [queueTab, setQueueTab] = useState("overdue");
  const [relTab, setRelTab] = useState("all");
  const [sentRel, setSentRel] = useState({});
  const [openRel, setOpenRel] = useState(null);
  const [resolved, setResolved] = useState({});
  const [matchingId, setMatchingId] = useState(null);
  const [proposed, setProposed] = useState({});
  const [formHire, setFormHire] = useState("lea");
  const [formModule, setFormModule] = useState("mutuelle");
  const [eye, setEye] = useState("both");
  const [search, setSearch] = useState("");
  // profile report + audio
  const [genState, setGenState] = useState("idle");
  const [visibleParas, setVisibleParas] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioHover, setAudioHover] = useState(null);
  const genRef = useRef();
  // notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState("all");
  const [notifs, setNotifs] = useState(() => D.NOTIFICATIONS.map((n) => ({ ...n })));

  const inBf = (bid) => boutiqueFilter === "all" || boutiqueFilter === bid;

  const unread = notifs.filter((n) => !n.read && !n.dismissed).length;
  function markRead(id) { setNotifs((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))); }
  function markAllRead() { setNotifs((l) => l.map((n) => ({ ...n, read: true }))); }
  function dismissNotif(id) { setNotifs((l) => l.map((n) => (n.id === id ? { ...n, dismissed: true } : n))); }
  function openNotifTarget(n) {
    markRead(n.id); setNotifOpen(false);
    const a = n.action || {};
    if (a.screen === "profile") openClient(a.client || n.client || "gabriel");
    else { if (a.relTab) setRelTab(a.relTab); go(a.screen || "dashboard"); }
  }
  // real-time push stub — wire identical to production
  useEffect(() => {
    const unsub = subscribeNotifications((n) => setNotifs((l) => [{ ...n }, ...l]));
    return unsub;
  }, []);

  function openClient(id) {
    setScreen("profile"); setClientId(id);
    setGenState("idle"); setVisibleParas(0); setPlaying(false); setProgress(0); setEye("both");
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }
  function go(s) { setScreen(s); if (typeof window !== "undefined") window.scrollTo(0, 0); }

  function sendRel(id) {
    setSentRel((s) => ({ ...s, [id]: true }));
    const r = D.RELANCES.find((x) => x.id === id);
    if (!r) return;
    const c = clientMap[r.client] || {};
    setNotifs((l) => {
      // any matching unread "todo" for this client+type should stop nagging
      const next = l.map((n) => (!n.read && n.client === r.client && n.type === r.type ? { ...n, read: true } : n));
      return [{ id: "rs-" + id + "-" + Date.now(), type: "relance-sent", day: "today", time: "À l'instant", read: true, client: r.client, title: `Relance envoyée · ${c.name || r.client}`, detail: `${D.REL_TYPES[r.type].label} — ${r.channel}`, action: null }, ...next];
    });
  }
  function sendAllDue() {
    setSentRel((s) => { const n = { ...s }; D.RELANCES.forEach((r) => { if (r.when === "Aujourd'hui") n[r.id] = true; }); return n; });
    setNotifs((l) => l.map((n) => (!n.read && (n.type === "mutuelle" || n.type === "commande") ? { ...n, read: true } : n)));
  }
  function resolveArrival(aid, cid) {
    const c = clientMap[cid]; const name = (c && c.name) || "Client";
    setResolved((s) => ({ ...s, [aid]: name })); setMatchingId(null);
    setNotifs((l) => {
      const next = l.map((n) => (!n.read && n.type === "arrivage" ? { ...n, read: true } : n));
      return [{ id: "am-" + aid + "-" + Date.now(), type: "arrivage-matched", day: "today", time: "À l'instant", read: true, client: cid, title: `Commande prête · ${name}`, detail: "Arrivage rapproché — SMS « commande prête » prêt à partir", action: { label: "Programmer la relance", screen: "relances", relTab: "commande" } }, ...next];
    });
  }

  // report generation (timed reveal)
  function generate() {
    if (genState === "loading") return;
    setGenState("loading"); setVisibleParas(0);
    clearTimeout(genRef.current);
    genRef.current = setTimeout(() => setGenState("done"), 1400);
  }
  useEffect(() => {
    if (genState === "done" && visibleParas < D.REPORT.length) {
      const t = setTimeout(() => setVisibleParas((v) => v + 1), 240);
      return () => clearTimeout(t);
    }
  }, [genState, visibleParas]);
  // audio playback (simulated)
  useEffect(() => {
    if (!playing) return;
    if (progress >= 1) { setPlaying(false); return; }
    const t = setTimeout(() => setProgress((p) => Math.min(1, p + 0.02)), 110);
    return () => clearTimeout(t);
  }, [playing, progress]);
  function togglePlay() { if (playing) setPlaying(false); else { if (progress >= 1) setProgress(0); setPlaying(true); } }
  useEffect(() => () => clearTimeout(genRef.current), []);

  const cur = clientMap[clientId] || D.CLIENTS[0];
  const active = screen === "profile" ? "clients" : screen;
  const NAV = [
    { id: "dashboard", label: "Tableau de bord" },
    { id: "arrivages", label: "Arrivages" },
    { id: "stock", label: "Stock" },
    { id: "queue", label: "File d'attente" },
    { id: "relances", label: "Relances" },
    { id: "formation", label: "Formation" },
    { id: "clients", label: "Clients" },
  ];

  // ── HEADER ──
  const Header = (
    <header style={{ position: "sticky", top: 0, zIndex: 40, backdropFilter: "blur(14px)", background: "rgba(245,241,232,0.84)", borderBottom: `1px solid ${T.border}` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "13px 20px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <button onClick={() => go("dashboard")} aria-label="Retour" style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${T.border2}`, background: "transparent", color: T.text3, cursor: "pointer", fontSize: 15, lineHeight: 1, flexShrink: 0 }}>‹</button>
        <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginRight: 4, flexShrink: 0 }}>
          <span style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, letterSpacing: "0.01em", color: T.deep, lineHeight: 1, whiteSpace: "nowrap" }}>Optique OS</span>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: T.gold }}>by Symi</span>
        </div>
        <nav className="oq-nav" style={{ flex: 1, justifyContent: "flex-end" }}>
          {NAV.map((it) => {
            const on = it.id === active;
            return (
              <button key={it.id} onClick={() => go(it.id)} style={{ background: on ? "#eef2ec" : "transparent", border: "none", cursor: "pointer", fontFamily: "'Hanken Grotesk',sans-serif", fontSize: 11.5, fontWeight: on ? 600 : 500, letterSpacing: "0.05em", textTransform: "uppercase", padding: "9px 11px", borderRadius: 8, color: on ? T.deep : T.text3, whiteSpace: "nowrap", minHeight: 38 }}>{it.label}</button>
            );
          })}
        </nav>
        <button onClick={() => setNotifOpen(true)} aria-label={`Notifications${unread ? ` (${unread} non lues)` : ""}`} style={{ position: "relative", width: 40, height: 40, borderRadius: "50%", border: `1px solid ${T.border2}`, background: "transparent", color: T.text3, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BellIcon />
          {unread > 0 && <span style={{ position: "absolute", top: -2, right: -2, minWidth: 17, height: 17, padding: "0 4px", borderRadius: 999, background: T.alert, color: "#fff", fontFamily: MONO, fontSize: 9.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid " + T.canvas }}>{unread > 9 ? "9+" : unread}</span>}
        </button>
      </div>
    </header>
  );

  return (
    <div className="oq-app oq-scroll">
      {Header}
      <main className="oq-wrap">
        <div key={screen + clientId} className="oq-screen">
          {screen === "dashboard" && renderDashboard()}
          {screen === "relances" && renderRelances()}
          {screen === "arrivages" && renderArrivages()}
          {screen === "queue" && renderQueue()}
          {screen === "clients" && renderClients()}
          {screen === "stock" && renderStock()}
          {screen === "formation" && renderFormation()}
          {screen === "profile" && renderProfile()}
        </div>
      </main>
      {notifOpen && renderNotifications()}
    </div>
  );

  // ════════════ NOTIFICATIONS ════════════
  function renderNotifications() {
    const filters = [{ id: "all", label: "Tout" }, { id: "unread", label: "Non lu" }, { id: "cabine", label: "Cabine" }];
    const visible = notifs.filter((n) => !n.dismissed && (notifFilter === "all" || (notifFilter === "unread" ? !n.read : n.type === "cabine")));
    const groups = [{ id: "today", label: "Aujourd'hui" }, { id: "yesterday", label: "Hier" }, { id: "week", label: "Cette semaine" }];
    return (
      <>
        <div className="oq-scrim" onClick={() => setNotifOpen(false)} />
        <div className="oq-notif oq-scroll" role="dialog" aria-modal="true" aria-label="Notifications">
          <div className="oq-hide-sm" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 0 0" }}>
            <div style={{ width: 38, height: 4, borderRadius: 999, background: T.border2 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px 8px" }}>
            <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, flex: 1 }}>Notifications</div>
            <button onClick={markAllRead} style={{ background: "transparent", border: "none", cursor: "pointer", fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", color: T.muted }}>Tout marquer comme lu</button>
            <button onClick={() => setNotifOpen(false)} aria-label="Fermer" style={{ background: "transparent", border: "none", cursor: "pointer", color: T.text3, fontSize: 18, lineHeight: 1, padding: 2 }}>×</button>
          </div>
          <div style={{ display: "flex", gap: 6, padding: "0 18px 12px" }}>
            {filters.map((f) => {
              const on = notifFilter === f.id;
              return <button key={f.id} onClick={() => setNotifFilter(f.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 999, padding: "6px 13px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>{f.label}</button>;
            })}
          </div>
          <div className="oq-notif-list" style={{ borderTop: `1px solid ${T.border}` }}>
            {visible.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", color: T.muted }}>
                <div style={{ fontSize: 22, color: T.gold }}>◉</div>
                <div style={{ fontFamily: SERIF, fontSize: 19, marginTop: 8, color: T.ink }}>Tout est à jour.</div>
              </div>
            ) : groups.map((g) => {
              const rows = visible.filter((n) => n.day === g.id);
              if (!rows.length) return null;
              return (
                <div key={g.id}>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: T.faint, padding: "14px 18px 6px" }}>{g.label}</div>
                  {rows.map((n) => {
                    const nt = D.NOTIF_TYPES[n.type] || { hex: T.muted, icon: "box" };
                    return (
                      <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 16px 12px 18px", borderLeft: `3px solid ${n.read ? "transparent" : T.deep}`, background: n.read ? "transparent" : "#fffdf8", opacity: n.read ? 0.74 : 1, position: "relative" }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: nt.hex + "1a", color: nt.hex, display: "flex", alignItems: "center", justifyContent: "center" }}><NotifGlyph name={nt.icon} /></span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <button onClick={() => n.action || n.client ? openNotifTarget(n) : markRead(n.id)} style={{ textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", width: "100%" }}>
                            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.35 }}>{n.title}</div>
                            <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2, lineHeight: 1.4 }}>{n.detail}</div>
                            <div style={{ fontFamily: MONO, fontSize: 10, color: T.faint, marginTop: 5 }}>{n.time}</div>
                          </button>
                          {n.action && (
                            <button onClick={() => openNotifTarget(n)} style={{ marginTop: 9, background: nt.hex, color: "#fff", border: "none", borderRadius: 9, padding: "8px 13px", fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 38 }}>{n.action.label} →</button>
                          )}
                        </div>
                        <button onClick={() => dismissNotif(n.id)} aria-label="Ignorer" style={{ background: "transparent", border: "none", cursor: "pointer", color: T.faint, fontSize: 15, lineHeight: 1, alignSelf: "flex-start", padding: 2 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // ════════════ DASHBOARD ════════════
  function renderDashboard() {
    const boTabs = [{ id: "all", label: "Les deux maisons" }, ...D.BOUTIQUES.map((b) => ({ id: b.id, label: b.short }))];
    let dossiers, caMois, suivis, tp, tpEur;
    if (boutiqueFilter === "all") { dossiers = "48"; caMois = "€42,8k"; suivis = "5"; tp = 8; tpEur = "€3 240"; }
    else { const b = boMap[boutiqueFilter]; dossiers = String(b.dossiers); caMois = b.caMois; suivis = String(b.cabineOn ? 3 : 2); tp = boutiqueFilter === "faubourg" ? 5 : 3; tpEur = boutiqueFilter === "faubourg" ? "€2 010" : "€1 230"; }
    const kpis = [
      { label: "Dossiers patients", value: dossiers, sub: "+5 ce mois", subColor: T.green2 },
      { label: "CA du mois", value: caMois, sub: "+11 % vs. mai", subColor: T.green2 },
      { label: "Suivis auditifs", value: suivis, sub: "à programmer", subColor: T.text3 },
      { label: "Tiers-payant en attente", value: String(tp), sub: tpEur + " à relancer", subColor: T.alert },
    ];
    const signals = D.SIGNALS.filter((s) => inBf(s.boutique));
    const followups = D.FOLLOWUPS.filter((f) => inBf(f.boutique));
    const renewals = D.RENEWALS.filter((r) => inBf(r.boutique));
    const kindHex = (k) => (k === "Vision" ? T.green : k === "Audition" ? T.gold : T.text3);

    return (
      <>
        <Eyebrow>Vue d'ensemble · deux maisons</Eyebrow>
        <H1>Tableau de bord</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 22px" }}>Faubourg Saint-Martin · Place des Vosges — lundi 23 juin 2026</div>

        <div className="oq-nav" style={{ marginBottom: 22 }}>
          {boTabs.map((t) => {
            const on = boutiqueFilter === t.id;
            return <button key={t.id} onClick={() => setBoutiqueFilter(t.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 999, padding: "9px 16px", fontSize: 12, fontWeight: 600, letterSpacing: "0.03em", cursor: "pointer", whiteSpace: "nowrap", minHeight: 40 }}>{t.label}</button>;
          })}
        </div>

        <div className="oq-4" style={{ marginBottom: 18 }}>
          {kpis.map((k) => <StatTile key={k.label} {...k} />)}
        </div>

        <div className="oq-2" style={{ marginBottom: 24 }}>
          {D.BOUTIQUES.filter((b) => inBf(b.id)).map((b) => (
            <Card key={b.id} style={{ padding: "24px 26px", borderTop: `3px solid ${b.hex}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500 }}>{b.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: T.muted, marginTop: 4 }}>{b.arr} · {b.dossiers} dossiers</div>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.06em", color: b.cabineOn ? T.green2 : T.muted, background: b.cabineOn ? "#eef2ec" : "#f3eee2", borderRadius: 999, padding: "6px 11px", whiteSpace: "nowrap" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: b.cabineOn ? T.green2 : "#c2b9a6", boxShadow: b.cabineOn ? "0 0 0 3px rgba(47,110,84,0.18)" : "none" }} />
                  {b.cabine}
                </span>
              </div>
              <div style={{ display: "flex", gap: 26, marginTop: 18 }}>
                <div><div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500 }}>{b.caMois}</div><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>CA mois</div></div>
                <div><div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500 }}>{b.caJour}</div><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>CA jour</div></div>
                <div><div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500 }}>{b.flux}</div><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted }}>Flux</div></div>
              </div>
              <div style={{ display: "flex", gap: 7, marginTop: 16 }}>
                {b.conseillers.map((n) => <span key={n} style={{ fontSize: 11, color: T.text2, background: "#f3eee2", borderRadius: 999, padding: "4px 10px" }}>{n}</span>)}
              </div>
            </Card>
          ))}
        </div>

        <div className="oq-main-aside">
          <div>
            <SectionTitle>Signaux</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {signals.map((s, i) => (
                <Card key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <Tag label={s.kind} hex={kindHex(s.kind)} />
                    <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500 }}>{s.patient}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>· {boMap[s.boutique].short}</span>
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.55, color: T.text2 }}>{s.text}</div>
                  <button style={{ alignSelf: "flex-start", marginTop: 2, background: "transparent", border: `1px solid ${T.border2}`, borderRadius: 999, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: T.deep, cursor: "pointer" }}>{s.action} →</button>
                </Card>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Card>
              <SectionTitle>Suivis programmés</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {followups.map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{f.patient}</div>
                      <div style={{ fontSize: 11.5, color: T.muted }}>{f.type} · {f.when}</div>
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: f.hot ? T.alert : T.green, background: f.hot ? "#f6e7e2" : "#eef2ec", borderRadius: 7, padding: "6px 9px", whiteSpace: "nowrap" }}>{f.cadence}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>Renouvellements</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {renewals.map((r, i) => {
                  const dc = r.days <= 20 ? T.alert : r.days <= 40 ? T.gold : T.sage;
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                        <span style={{ fontWeight: 600 }}>{r.patient}</span>
                        <span style={{ color: dc, fontFamily: MONO, fontSize: 11 }}>J−{r.days}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: T.muted, margin: "2px 0 6px" }}>{r.detail} · {boMap[r.boutique].short}</div>
                      <div style={{ height: 4, background: "#ece5d6", borderRadius: 999 }}><div style={{ height: "100%", width: Math.max(8, Math.round((1 - r.days / 90) * 100)) + "%", background: dc, borderRadius: 999 }} /></div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // ════════════ RELANCES (flagship) ════════════
  function renderRelances() {
    const filters = [
      { id: "all", label: "Toutes" },
      { id: "mutuelle", label: "Droits mutuelle" },
      { id: "ordonnance", label: "Ordonnances" },
      { id: "commande", label: "Commandes" },
      { id: "impaye", label: "Impayés" },
    ];
    const count = (id) => (id === "all" ? D.RELANCES.length : D.RELANCES.filter((r) => r.type === id).length);
    const dueToday = D.RELANCES.filter((r) => r.when === "Aujourd'hui");
    const list = D.RELANCES.filter((r) => relTab === "all" || r.type === relTab);

    return (
      <>
        <Eyebrow>Moteur d'envoi automatique</Eyebrow>
        <H1>Relances</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 22px", maxWidth: 620 }}>Chaque droit qui se rouvre, chaque ordonnance qui expire, chaque commande prête — un message personnalisé, programmé au bon moment. Rien ne tombe entre les mailles.</div>

        <div className="oq-4" style={{ marginBottom: 18 }}>
          <StatTile label="Prêtes aujourd'hui" value={String(dueToday.length)} sub="programmées à 9:00" subColor={T.alert} />
          <StatTile label="Cette semaine" value={String(D.RELANCES.length)} sub="déclencheurs actifs" subColor={T.text3} />
          <StatTile label="Impayés suivis" value="1" sub="relance organisme auto" subColor={T.text3} />
          <StatTile label="Envoyées 30 j" value="64" sub="94 % sans intervention" subColor={T.green2} />
        </div>

        <div style={{ background: T.deep, color: T.canvas, borderRadius: 16, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500 }}>{dueToday.length} relances prêtes à partir aujourd'hui</div>
            <div style={{ fontSize: 13, color: "#cfe0d6", marginTop: 6, lineHeight: 1.55 }}>Programmées pour 9:00, calées sur la fenêtre de droits de chaque client. Vous gardez la main sur chaque envoi.</div>
          </div>
          <button onClick={sendAllDue} style={{ background: T.goldSoft, color: T.deep, border: "none", borderRadius: 12, padding: "13px 22px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", minHeight: 46, whiteSpace: "nowrap" }}>Tout programmer →</button>
        </div>

        <div className="oq-nav" style={{ marginBottom: 18 }}>
          {filters.map((f) => {
            const on = relTab === f.id;
            return <button key={f.id} onClick={() => setRelTab(f.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", gap: 7, alignItems: "center", minHeight: 40, whiteSpace: "nowrap" }}>{f.label}<span style={{ fontFamily: MONO, fontSize: 10, color: on ? "#9ec3b0" : T.faint }}>{count(f.id)}</span></button>;
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((r) => {
            const rt = D.REL_TYPES[r.type];
            const c = clientMap[r.client] || {};
            const sent = !!sentRel[r.id];
            const open = openRel === r.id;
            const isWa = r.channel === "WhatsApp";
            return (
              <div key={r.id} style={{ background: T.card, border: `1px solid ${r.urgent ? "#e4cfa0" : T.border}`, borderLeft: `3px solid ${rt.hex}`, borderRadius: 16, padding: 18, opacity: sent ? 0.72 : 1, transition: "opacity .3s" }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <Avatar initials={c.initials || "··"} bg={rt.hex} size={42} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                      <Tag label={rt.label} hex={rt.hex} />
                      <span style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500 }}>{c.name || r.client}</span>
                      <span style={{ fontSize: 11, color: T.muted }}>· {boMap[c.boutique] ? boMap[c.boutique].short : ""}</span>
                    </div>
                    <div style={{ fontSize: 13.5, marginTop: 6, color: T.ink, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 12.5, color: T.muted, marginTop: 2, lineHeight: 1.5 }}>{r.detail}</div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 130 }}>
                    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>Envoi</div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 3 }}>{r.when}</div>
                    <div style={{ fontSize: 11.5, color: T.muted }}>{r.auto} · {r.channel}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <button disabled={sent} onClick={() => sendRel(r.id)} style={{ background: sent ? "#eef2ec" : isWa ? T.whatsapp : T.deep, color: sent ? T.green : "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 600, cursor: sent ? "default" : "pointer", minHeight: 44 }}>{sent ? "Programmée ✓" : `Envoyer ${r.channel}`}</button>
                  <button onClick={() => setOpenRel(open ? null : r.id)} style={{ background: "transparent", border: `1px solid ${T.border2}`, borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 600, color: T.text3, cursor: "pointer", minHeight: 44 }}>{open ? "Masquer" : "Aperçu message"}</button>
                </div>
                {open && <ChatPreview channel={r.channel} name={c.name || r.client} msg={r.msg} time={r.auto} />}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ════════════ ARRIVAGES ════════════
  function renderArrivages() {
    return (
      <>
        <Eyebrow>Livraisons fournisseurs · aujourd'hui</Eyebrow>
        <H1>Arrivages</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 22px", maxWidth: 620 }}>Chaque colis est rapproché d'un dossier — jamais deviné. Les lentilles sont arrivées : on sait à qui. Un arrivage rapproché déclenche le SMS « commande prête ».</div>

        <SectionTitle>Colis du jour</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 30 }}>
          {D.ARRIVALS.map((a) => {
            const matchedName = resolved[a.id] || (a.client ? (clientMap[a.client] || {}).name : null);
            const isOrphan = !a.client && !resolved[a.id];
            return (
              <div key={a.id} style={{ background: T.card, border: `1px solid ${isOrphan ? "#e4cfa0" : T.border}`, borderLeft: `3px solid ${isOrphan ? T.gold : T.green2}`, borderRadius: 16, padding: 18 }}>
                <div style={{ display: "flex", gap: 14, justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                      <Tag label={a.cat} hex={T.green2} />
                      <span style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500 }}>{a.product}</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 5, fontFamily: MONO, letterSpacing: "0.04em" }}>{a.ref} · {a.supplier} · {a.box}</div>
                    {isOrphan && <div style={{ fontSize: 12.5, color: T.text2, marginTop: 8, lineHeight: 1.5 }}>{a.reason}</div>}
                  </div>
                  <div style={{ minWidth: 160 }}>
                    {matchedName ? (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: T.green2 }}>Rapproché</div>
                        <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500, marginTop: 2 }}>{matchedName}</div>
                        <button style={{ marginTop: 8, background: T.whatsapp, color: "#fff", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", minHeight: 42 }}>SMS commande prête</button>
                      </div>
                    ) : (
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: T.gold }}>Orphelin · à rapprocher</div>
                        <button onClick={() => setMatchingId(matchingId === a.id ? null : a.id)} style={{ marginTop: 8, background: "transparent", border: `1px solid ${T.border2}`, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontWeight: 600, color: T.deep, cursor: "pointer", minHeight: 42 }}>{matchingId === a.id ? "Fermer" : "Voir candidats"}</button>
                      </div>
                    )}
                  </div>
                </div>
                {isOrphan && matchingId === a.id && (
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, animation: "oqFade .35s ease both" }}>
                    {(a.candidates || []).map((cid) => {
                      const c = clientMap[cid] || {};
                      return (
                        <div key={cid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: T.panel, borderRadius: 12, padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                            <Avatar initials={c.initials} bg={accentOf(c.tier)} size={36} />
                            <div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div><div style={{ fontSize: 11.5, color: T.muted }}>{c.rx}</div></div>
                          </div>
                          <button onClick={() => resolveArrival(a.id, cid)} style={{ background: T.deep, color: T.canvas, border: "none", borderRadius: 9, padding: "9px 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", minHeight: 42 }}>Rapprocher</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <SectionTitle>Nouveaux modèles à proposer</SectionTitle>
        <div className="oq-3">
          {D.NEWMODELS.map((m) => {
            const done = !!proposed[m.id];
            return (
              <Card key={m.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500 }}>{m.name}</div>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", color: T.muted }}>{m.kind}</div>
                <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.5 }}>{m.why}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                  {m.match.map((cid) => <span key={cid} style={{ fontSize: 11, color: T.deep, background: "#eef2ec", borderRadius: 999, padding: "4px 10px" }}>{(clientMap[cid] || {}).name}</span>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500 }}>{eur(m.price)}</span>
                  <button disabled={done} onClick={() => setProposed((s) => ({ ...s, [m.id]: true }))} style={{ background: done ? "#eef2ec" : T.deep, color: done ? T.green : T.canvas, border: "none", borderRadius: 9, padding: "9px 14px", fontSize: 12.5, fontWeight: 600, cursor: done ? "default" : "pointer", minHeight: 42 }}>{done ? "Proposé ✓" : "Proposer"}</button>
                </div>
              </Card>
            );
          })}
        </div>
      </>
    );
  }

  // ════════════ QUEUE ════════════
  function renderQueue() {
    const tabs = [{ id: "overdue", label: "En retard", n: 8 }, { id: "today", label: "Aujourd'hui", n: 6 }, { id: "upcoming", label: "À venir", n: 23 }];
    const rows = [...D.CLIENTS].sort((a, b) => b.overdue - a.overdue);
    return (
      <>
        <Eyebrow>Contacts à traiter</Eyebrow>
        <H1>File d'attente</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 22px" }}>Les clients à recontacter, classés par urgence.</div>
        <div className="oq-nav" style={{ marginBottom: 18 }}>
          {tabs.map((t) => {
            const on = queueTab === t.id;
            return <button key={t.id} onClick={() => setQueueTab(t.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", gap: 7, alignItems: "center", minHeight: 40 }}>{t.label}<span style={{ fontFamily: MONO, fontSize: 10, color: on ? "#9ec3b0" : T.faint }}>{t.n}</span></button>;
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((c) => {
            const t = tierOf(c.tier);
            return (
              <button key={c.id} onClick={() => openClient(c.id)} style={{ textAlign: "left", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={c.initials} bg={accentOf(c.tier)} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.06em", color: t.hex }}>{t.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.muted }}>{boMap[c.boutique].short} · {c.motif} · {c.advisor}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{c.dueLabel}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, color: c.overdue > 50 ? T.alert : c.overdue > 25 ? T.gold : T.sage }}>retard {c.overdue} j</div>
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  // ════════════ CLIENTS ════════════
  function renderClients() {
    const q = search.trim().toLowerCase();
    const rows = D.CLIENTS.filter((c) => !q || c.name.toLowerCase().includes(q) || c.motif.toLowerCase().includes(q));
    return (
      <>
        <Eyebrow>Dossiers patients</Eyebrow>
        <H1>Clients</H1>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client, un motif…" style={{ width: "100%", maxWidth: 420, marginTop: 16, marginBottom: 22, padding: "12px 16px", borderRadius: 12, border: `1px solid ${T.border2}`, background: T.card, fontSize: 14, fontFamily: "'Hanken Grotesk',sans-serif", color: T.ink }} />
        <div className="oq-2">
          {rows.map((c) => {
            const t = tierOf(c.tier);
            return (
              <button key={c.id} onClick={() => openClient(c.id)} style={{ textAlign: "left", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, cursor: "pointer", display: "flex", gap: 14 }}>
                <Avatar initials={c.initials} bg={accentOf(c.tier)} size={48} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500 }}>{c.name}</span>
                    <Tag label={t.name} hex={t.hex} />
                  </div>
                  <div style={{ fontSize: 12.5, color: T.muted, margin: "4px 0 8px" }}>{boMap[c.boutique].short} · {c.advisor}</div>
                  <div style={{ fontFamily: MONO, fontSize: 11.5, color: T.text2 }}>{c.rx}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12 }}>
                    <span style={{ color: T.muted }}>Dépensé {eur(c.spent)}</span>
                    {c.audio && c.audio !== "—" && <span style={{ color: T.gold }}>Audio · {c.audio}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </>
    );
  }

  // ════════════ STOCK ════════════
  function renderStock() {
    const cats = [{ id: "all", label: "Tout" }, { id: "Monture", label: "Montures" }, { id: "Verres", label: "Verres" }, { id: "Lentilles", label: "Lentilles" }, { id: "Solaire", label: "Solaires" }];
    const rows = D.STOCK.filter((s) => stockCat === "all" || s.cat === stockCat);
    return (
      <>
        <Eyebrow>Inventaire · deux maisons</Eyebrow>
        <H1>Stock</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 22px" }}>Prix d'achat fournisseur, prix de vente, marge réelle sur chaque référence.</div>
        <div className="oq-nav" style={{ marginBottom: 18 }}>
          {cats.map((t) => {
            const on = stockCat === t.id;
            return <button key={t.id} onClick={() => setStockCat(t.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 999, padding: "8px 15px", fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 40, whiteSpace: "nowrap" }}>{t.label}</button>;
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((s) => {
            const marge = s.vente - s.achat;
            const pct = Math.round((marge / s.vente) * 100);
            const low = s.fb + s.vo <= s.seuil || s.vo === 0;
            return (
              <div key={s.ref} style={{ background: T.card, border: `1px solid ${low ? "#e4cfa0" : T.border}`, borderRadius: 14, padding: "14px 16px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500 }}>{s.name}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: T.text3, background: "#f3eee2", borderRadius: 5, padding: "3px 7px" }}>{s.ref}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: T.muted, marginTop: 4 }}>{s.cat} · {s.supplier}</div>
                </div>
                <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase" }}>Achat</div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{eur(s.achat)}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase" }}>Vente</div><div style={{ fontWeight: 600, fontSize: 13.5 }}>{eur(s.vente)}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase" }}>Marge</div><div style={{ fontWeight: 700, fontSize: 13.5, color: T.green2 }}>{eur(marge)} · {pct}%</div></div>
                  <div style={{ textAlign: "right", minWidth: 78 }}><div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color: T.muted, textTransform: "uppercase" }}>Stock fb/vo</div><div style={{ fontWeight: 600, fontSize: 13.5, color: low ? T.alert : T.ink }}>{s.fb} / {s.vo}{low && " ⚠"}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ════════════ FORMATION ════════════
  function renderFormation() {
    const hire = D.HIRES.find((h) => h.id === formHire) || D.HIRES[0];
    const doneSet = new Set(hire.done);
    const total = D.MODULES.length;
    const validated = hire.done.length;
    const pct = Math.round((validated / total) * 100);
    const curMod = D.MODULES.find((m) => m.id === hire.current);
    const nextFiche = curMod ? curMod.fiches[hire.currentFiche] : null;
    const status = (m) => doneSet.has(m.id) ? "Validé" : m.id === hire.current ? "En cours" : "À venir";
    const statusHex = (st) => st === "Validé" ? T.green2 : st === "En cours" ? T.gold : T.faint;

    return (
      <>
        <Eyebrow>Académie · intégration</Eyebrow>
        <H1>Formation</H1>
        <div style={{ color: T.muted, fontSize: 14, margin: "10px 0 20px" }}>Le système forme. Chaque fiche surgit au bon moment du parcours.</div>

        <div className="oq-4" style={{ marginBottom: 20 }}>
          <StatTile label="En intégration" value="2" sub="2 maisons" />
          <StatTile label="Autonomie moyenne" value="18 j" sub="objectif < 30 j" subColor={T.green2} />
          <StatTile label="Fiches procédure" value={String(D.MODULES.reduce((a, m) => a + m.fiches.length, 0))} sub={total + " modules"} />
          <StatTile label="Modules validés" value="7" sub="cette semaine" subColor={T.green2} />
        </div>

        <div className="oq-nav" style={{ marginBottom: 20 }}>
          {D.HIRES.map((h) => {
            const on = h.id === formHire;
            const p = Math.round((h.done.length / total) * 100);
            return (
              <button key={h.id} onClick={() => { setFormHire(h.id); setFormModule(h.current); }} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: on ? "#eef2ec" : "transparent", border: `1px solid ${on ? T.green : T.border2}`, borderRadius: 999, padding: "7px 14px 7px 7px", cursor: "pointer", minHeight: 44 }}>
                <Avatar initials={h.initials} bg={accentOf("clarte")} size={32} />
                <span><span style={{ fontWeight: 600, fontSize: 13.5 }}>{h.name}</span><span style={{ fontFamily: MONO, fontSize: 10, color: T.muted, marginLeft: 8 }}>Parcours · {p}%</span></span>
              </button>
            );
          })}
        </div>

        <div className="oq-main-aside">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {D.MODULES.map((m, i) => {
              const st = status(m);
              const open = formModule === m.id;
              return (
                <div key={m.id} style={{ background: T.card, border: `1px solid ${open ? "#cdbf9f" : T.border}`, borderRadius: 14, overflow: "hidden" }}>
                  <button onClick={() => setFormModule(open ? "" : m.id)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, color: m.hex, width: 30 }}>{String(i + 1).padStart(2, "0")}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500 }}>{m.title}</div>
                      <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.muted, marginTop: 3 }}>{m.fiches.length} fiches · {m.mins} min</div>
                    </div>
                    <Tag label={st} hex={statusHex(st)} />
                  </button>
                  {open && (
                    <div style={{ padding: "0 18px 16px 62px", display: "flex", flexDirection: "column", gap: 8, animation: "oqFade .35s ease both" }}>
                      {m.fiches.map((f, fi) => {
                        const isDone = doneSet.has(m.id) || (m.id === hire.current && fi < hire.currentFiche);
                        const isCur = m.id === hire.current && fi === hire.currentFiche;
                        return (
                          <div key={fi} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: isCur ? T.ink : T.text2 }}>
                            <span style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `2px solid ${isCur ? T.gold : isDone ? T.green2 : T.border2}`, background: isDone ? T.green2 : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff" }}>{isDone ? "✓" : ""}</span>
                            <span style={{ fontWeight: isCur ? 600 : 400 }}>{f}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: T.deep, color: T.canvas, borderRadius: 16, padding: 22, textAlign: "center" }}>
              <Ring pct={pct} />
              <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 500, marginTop: 8 }}>{hire.name}</div>
              <div style={{ fontSize: 12, color: "#cfe0d6", marginTop: 4 }}>{validated} / {total} modules validés</div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)", marginTop: 14, paddingTop: 14, fontSize: 12.5, color: "#cfe0d6", lineHeight: 1.7 }}>
                <div>Maison · {boMap[hire.boutique].short}</div>
                <div>Tuteur · {hire.mentor}</div>
                <div>{hire.joined}</div>
              </div>
            </div>
            {nextFiche && (
              <div style={{ background: "#f6efdf", border: "1px solid #e4cfa0", borderRadius: 16, padding: 18 }}>
                <Eyebrow>Prochaine étape</Eyebrow>
                <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 500, margin: "6px 0 4px" }}>{nextFiche}</div>
                <div style={{ fontSize: 12.5, color: T.text2 }}>{curMod.title}</div>
                <button style={{ marginTop: 12, width: "100%", background: T.deep, color: T.canvas, border: "none", borderRadius: 10, padding: "12px", fontSize: 13, fontWeight: 600, cursor: "pointer", minHeight: 44 }}>Reprendre la formation</button>
              </div>
            )}
            <Card>
              <Eyebrow color={T.green}>Fiches express</Eyebrow>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {["Déclencher le SMS « commande prête »", "Lire une ordonnance", "Traiter un arrivage orphelin"].map((f, i) => {
                  const mid = ["reception", "mutuelle", "reception"][i];
                  return <button key={i} onClick={() => setFormModule(mid)} style={{ textAlign: "left", background: T.panel, border: "none", borderRadius: 10, padding: "11px 13px", fontSize: 13, color: T.deep, cursor: "pointer", fontWeight: 600 }}>{f} →</button>;
                })}
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // ════════════ PROFILE ════════════
  function renderProfile() {
    const surname = cur.name.split(" ").slice(-1)[0];
    const t = tierOf(cur.tier);
    const prefs = D.PREFS[cur.id];
    const droits = D.DROITS[cur.id];
    const fam = D.CLIENT_FAMILY[cur.id] ? D.FAMILIES[D.CLIENT_FAMILY[cur.id]] : null;
    const priorityHex = cur.priority === "Élevée" ? T.alert : cur.priority === "Moyenne" ? T.gold : T.sage;

    // vision lens geometry
    let vis = cur.vision;
    if (!vis) {
      const num = (re) => { const m = (cur.rx || "").match(re); return m ? Math.abs(parseFloat(m[1].replace("−", "-").replace(",", "."))) : 1.0; };
      const od = num(/OD\s*([+−-]?[\d,]+)/), og = num(/OG\s*([+−-]?[\d,]+)/);
      const fmt = (n) => "−" + n.toFixed(2).replace(".", ",");
      vis = { odSph: fmt(od), ogSph: fmt(og), odCyl: "—", ogCyl: "—", odAxis: 90, ogAxis: 90, add: "—", odMag: od, ogMag: og };
    }

    return (
      <>
        <button onClick={() => go("clients")} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.muted, marginBottom: 16 }}>‹ Clients</button>

        <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 24 }}>
          <Avatar initials={cur.initials} bg={accentOf(cur.tier)} size={68} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: SERIF, fontSize: 38, fontWeight: 500, lineHeight: 1 }}>{cur.name}</span>
              <Tag label={t.name} hex={t.hex} />
              <Tag label={"Priorité " + (cur.priority || "Moyenne")} hex={priorityHex} />
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginTop: 8 }}>{boMap[cur.boutique].name} · {cur.advisor} · client depuis {cur.since}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: 12.5, color: T.text2, flexWrap: "wrap" }}>
              <span>{cur.phone}</span>{cur.email && <span>{cur.email}</span>}<span>{cur.age} ans</span><span>Dépensé {eur(cur.spent)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 22 }}>
          {(cur.tags || []).map((tag) => <span key={tag} style={{ fontSize: 12, color: T.deep, background: "#eef2ec", borderRadius: 999, padding: "5px 12px" }}>{tag}</span>)}
        </div>

        <div className="oq-main-aside">
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {prefs && (
              <Card>
                <SectionTitle>Goûts &amp; style</SectionTitle>
                <div className="oq-2" style={{ gap: 12 }}>
                  {[["Forme", prefs.forme], ["Matière", prefs.matiere], ["Teinte", prefs.teinte], ["Marques", prefs.marques], ["Budget", prefs.budget]].map(([k, v]) => (
                    <div key={k}><div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted }}>{k}</div><div style={{ fontSize: 14, marginTop: 2 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ fontSize: 13, fontStyle: "italic", color: T.text2, marginTop: 12, lineHeight: 1.55 }}>{prefs.note}</div>
              </Card>
            )}

            <Card style={{ padding: "24px 26px" }}>
              <Eyebrow color={T.gold}>Vision</Eyebrow>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, margin: "4px 0 14px" }}>Cartographie des verres</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {[{ id: "both", label: "Les deux" }, { id: "OD", label: "OD" }, { id: "OG", label: "OG" }].map((o) => {
                  const on = eye === o.id;
                  return <button key={o.id} onClick={() => setEye(o.id)} style={{ background: on ? T.deep : "transparent", color: on ? T.canvas : T.text3, border: `1px solid ${on ? T.deep : T.border2}`, borderRadius: 8, padding: "6px 13px", fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", cursor: "pointer", minHeight: 36 }}>{o.label}</button>;
                })}
              </div>
              <div className="oq-2">
                {[{ eye: "OD", label: "Œil droit", sph: vis.odSph, cyl: vis.odCyl, axis: vis.odAxis, mag: vis.odMag, accent: T.green2, ring: "#9bbfae" }, { eye: "OG", label: "Œil gauche", sph: vis.ogSph, cyl: vis.ogCyl, axis: vis.ogAxis, mag: vis.ogMag, accent: T.alert, ring: "#d8a99b" }].map((l) => {
                  const sel = eye === "both" || eye === l.eye;
                  return (
                    <div key={l.eye} style={{ background: T.panel, borderRadius: 13, padding: 16, opacity: sel ? 1 : 0.3, transition: "opacity .25s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 500 }}>{l.label}</span>
                        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: l.accent }}>{l.eye}</span>
                      </div>
                      <GlassDisc eyeId={l.eye} mag={l.mag} axis={l.axis} accent={l.accent} ringColor={l.ring} />
                      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 8, fontSize: 12 }}>
                        <span style={{ color: T.muted }}>Sph <b style={{ color: T.ink }}>{l.sph}</b></span>
                        <span style={{ color: T.muted }}>Cyl <b style={{ color: T.ink }}>{l.cyl}</b></span>
                        <span style={{ color: T.muted }}>Axe <b style={{ color: T.ink }}>{l.axis}°</b></span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {vis.add && vis.add !== "—" && <div style={{ textAlign: "center", marginTop: 12, fontSize: 13.5, color: T.text2 }}>Addition <b>{vis.add}</b></div>}
              <div style={{ background: "#f7f3ea", borderRadius: 13, padding: 16, marginTop: 14 }}>
                <Tag label="Fable · vision" hex={T.gold} />
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: T.text2, marginTop: 8 }}>{cur.visionSignal || `Correction ${cur.rx}. Évolution à surveiller au prochain contrôle.`}</div>
              </div>
            </Card>

            {cur.hasAudio && (
              <Card>
                <SectionTitle>Bilan auditif</SectionTitle>
                <Audiogram hover={audioHover} setHover={setAudioHover} />
                <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8, fontSize: 12 }}>
                  <span style={{ color: T.green2 }}>● Oreille droite</span><span style={{ color: T.ink }}>✕ Oreille gauche</span>
                </div>
                <div style={{ fontSize: 13, color: T.text2, marginTop: 10, lineHeight: 1.5 }}>Motif · {cur.motif}</div>

                {/* report generation */}
                <div style={{ marginTop: 16, borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                  <button onClick={generate} style={{ border: "none", borderRadius: 12, padding: "13px 20px", fontSize: 13.5, fontWeight: 600, cursor: genState === "loading" ? "wait" : "pointer", background: genState === "loading" ? "#ece5d6" : T.deep, color: genState === "loading" ? T.muted : T.canvas, minHeight: 46 }}>
                    {genState === "loading" ? "Analyse du dossier…" : genState === "done" ? "Régénérer" : "Générer le compte rendu Fable"}
                  </button>
                  <div style={{ marginTop: 14 }}>
                    {D.REPORT.slice(0, visibleParas).map((p, i) => {
                      const text = i === 0 ? "Bonjour Monsieur " + surname + "," : p;
                      return <p key={i} style={{ fontSize: 14.5, lineHeight: 1.65, color: i === 0 ? T.ink : T.text2, fontWeight: i === 0 ? 600 : 400, margin: i === 0 ? 0 : "12px 0 0", animation: "oqFade .4s ease both" }}>{text}</p>;
                    })}
                  </div>
                </div>

                {/* voice */}
                <div style={{ marginTop: 16, background: T.deep, borderRadius: 14, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={togglePlay} aria-label={playing ? "Pause" : "Lecture"} style={{ width: 44, height: 44, borderRadius: "50%", border: "none", background: T.goldSoft, color: T.deep, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>{playing ? "❚❚" : "▶"}</button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 30 }}>
                      {D.WAVE.map((h, i) => {
                        const lit = i / D.WAVE.length <= progress;
                        return <span key={i} style={{ flex: 1, height: h * 0.6, background: lit ? T.goldSoft : "rgba(255,255,255,0.18)", borderRadius: 2 }} />;
                      })}
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", color: "#cfe0d6", marginTop: 6 }}>Compte rendu vocal · voix de la maison</div>
                  </div>
                </div>
              </Card>
            )}

          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {droits && (
              <Card>
                <Eyebrow color={T.green}>Droits &amp; fenêtre de relance</Eyebrow>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 12, fontSize: 13 }}>
                  {[["Ordonnance émise", droits.ordEmise], ["Valide jusqu'à", droits.ordValide], ["Renouvellement", droits.renouv], ["Mutuelle", droits.mutCycle], ["Dernier équipement", droits.mutDernier], ["Droit rouvert", droits.mutOuvert]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span style={{ color: T.muted }}>{k}</span><span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span></div>
                  ))}
                </div>
                <div style={{ background: "#eef2ec", borderRadius: 12, padding: 14, marginTop: 14 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: T.green }}>Prochaine relance</div>
                  <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 500, marginTop: 4 }}>{droits.relanceDate}</div>
                  <div style={{ fontSize: 12.5, color: T.text2, marginTop: 2 }}>{droits.relanceTrigger}</div>
                </div>
              </Card>
            )}

            {fam && (
              <Card>
                <Eyebrow color={T.gold}>{fam.label}</Eyebrow>
                <div style={{ fontSize: 12.5, color: T.text2, margin: "8px 0 12px", lineHeight: 1.5 }}>{fam.note} · remise {fam.remise}%</div>
                {fam.members.map((mb) => {
                  const c = clientMap[mb.id] || {};
                  return (
                    <button key={mb.id} onClick={() => mb.id !== cur.id && openClient(mb.id)} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, background: mb.id === cur.id ? "#eef2ec" : "transparent", border: "none", borderRadius: 10, padding: "8px 10px", cursor: mb.id === cur.id ? "default" : "pointer", marginBottom: 4 }}>
                      <Avatar initials={c.initials} bg={accentOf(c.tier)} size={32} />
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 11, color: T.muted }}>{mb.role}</div></div>
                      {mb.id !== cur.id && <span style={{ color: T.muted }}>›</span>}
                    </button>
                  );
                })}
              </Card>
            )}

            <Card>
              <Eyebrow>Historique</Eyebrow>
              <div style={{ marginTop: 14, position: "relative", paddingLeft: 4 }}>
                {(cur.id === "gabriel" ? D.TIMELINE : [
                  { date: "Depuis " + cur.since, label: "Premier équipement", detail: (cur.rx || "").split(" · ")[0] || "Optique", dot: "#cabfa9" },
                  { date: cur.lastContact || "Récemment", label: "Dernier renouvellement", detail: (cur.tags && cur.tags[0]) || "Optique", dot: T.green2, active: true },
                ]).map((tl, i, arr) => (
                  <div key={i} style={{ position: "relative", paddingLeft: 22, paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                    {i < arr.length - 1 && <span style={{ position: "absolute", left: 5, top: 14, width: 1, bottom: 0, background: "#ece5d6" }} />}
                    <span style={{ position: "absolute", left: 0, top: 4, width: 11, height: 11, borderRadius: "50%", border: `2px solid ${tl.dot}`, background: tl.active ? tl.dot : T.card }} />
                    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.06em", color: T.muted }}>{tl.date}</div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: tl.active ? T.deep : T.ink, marginTop: 2 }}>{tl.label}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{tl.detail}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

// ── completion ring (formation) ──
function Ring({ pct }) {
  const R = 34, C = 2 * Math.PI * R;
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" style={{ display: "block", margin: "0 auto" }}>
      <circle cx="46" cy="46" r={R} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="7" />
      <circle cx="46" cy="46" r={R} fill="none" stroke="#e0c98f" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 46 46)" />
      <text x="46" y="52" textAnchor="middle" fontFamily="'Cormorant Garamond',serif" fontSize="24" fontWeight="500" fill="#f5f1e8">{pct}%</text>
    </svg>
  );
}

// ── Cartographie des verres — refracting optical-glass disc (SPEC §7) ──
function GlassDisc({ eyeId, mag, axis, accent, ringColor }) {
  const cx = 70, cy = 70, R = 55;
  const m = Math.min(Math.abs(Number(mag) || 1), 5);
  const r1 = R * 0.78;
  const r2 = R * 0.78 - m * 4 - 4;
  const r3 = Math.max(7, R * 0.78 - m * 8 - 10);
  const a = (90 - axis) * Math.PI / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const gid = "oqPrism-" + eyeId;
  return (
    <svg viewBox="0 0 140 140" style={{ width: 128, maxWidth: "100%", display: "block", margin: "8px auto 0" }} aria-hidden="true">
      <defs>
        <radialGradient id={gid} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#d8ecff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#eadcff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff3da" stopOpacity="0.25" />
        </radialGradient>
      </defs>
      {/* 1 · prism gradient disc */}
      <circle cx={cx} cy={cy} r="59" fill={`url(#${gid})`} stroke="#e2dac9" strokeWidth="1" />
      {/* 2 · slow rotating scan ring */}
      <circle cx={cx} cy={cy} r="52" fill="none" stroke={accent} strokeOpacity="0.3" strokeWidth="1.2" strokeDasharray="2 10" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "oqScan 9s linear infinite" }} />
      {/* 3 · correction rings (radius encodes Rx strength) */}
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke={ringColor} strokeWidth="1.4" opacity="0.5" />
      <circle cx={cx} cy={cy} r={r2} fill="none" stroke={ringColor} strokeWidth="1.4" opacity="0.5" />
      <circle cx={cx} cy={cy} r={r3} fill="none" stroke={ringColor} strokeWidth="1.4" opacity="0.5" />
      {/* 4 · axis line */}
      <line x1={cx - dx * (R - 2)} y1={cy - dy * (R - 2)} x2={cx + dx * (R - 2)} y2={cy + dy * (R - 2)} stroke={accent} strokeWidth="1.5" strokeDasharray="3 3" />
      {/* 5 · center dot */}
      <circle cx={cx} cy={cy} r="3" fill={accent} />
    </svg>
  );
}

// ── header bell ──
function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

// ── notification type glyphs (thin stroke, lucide-weight) ──
function NotifGlyph({ name }) {
  const P = {
    box: "M21 8 12 3 3 8v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8",
    shield: "M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6z",
    doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
    ear: "M7 8a5 5 0 0 1 10 0c0 3-2 4-3 6s-1 4-3 4a3 3 0 0 1-3-3",
    euro: "M15 6a6 6 0 1 0 0 12 M4 10h8 M4 14h8",
    layers: "M12 3 3 8l9 5 9-5z M3 13l9 5 9-5",
    cap: "M3 9l9-5 9 5-9 5z M21 9v5 M7 11v4c0 1 2 3 5 3s5-2 5-3v-4",
    send: "M22 2 11 13 M22 2 15 22l-4-9-9-4z",
  };
  const d = P[name] || P.box;
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => <path key={i} d={(i ? "M" : "") + seg} />)}
    </svg>
  );
}

// ── relance message rendered as the real WhatsApp / SMS it will become ──
function ChatPreview({ channel, name, msg, time }) {
  const wa = channel === "WhatsApp";
  const headerBg = wa ? "#075E54" : "#f4f0e6";
  const headerColor = wa ? "#fff" : "#211d17";
  const chatBg = wa ? "#efeae2" : "#f2f2f7";
  const bubbleBg = wa ? "#d9fdd3" : "#0a7cff";
  const bubbleColor = wa ? "#111b21" : "#fff";
  const initials = (name || "").split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div style={{ marginTop: 12, borderRadius: 14, overflow: "hidden", border: "1px solid #e7e0d2", animation: "oqFade .35s ease both" }}>
      <div style={{ background: headerBg, color: headerColor, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: wa ? "rgba(255,255,255,0.22)" : "#dcdce1", color: wa ? "#fff" : "#6f685c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Hanken Grotesk',sans-serif" }}>{name}</div>
          <div style={{ fontSize: 10.5, opacity: 0.8 }}>{wa ? "WhatsApp Business · chiffré" : "SMS"}</div>
        </div>
      </div>
      <div style={{ background: chatBg, padding: "16px 12px", display: "flex", justifyContent: "flex-end" }}>
        <div style={{ maxWidth: "84%", background: bubbleBg, color: bubbleColor, borderRadius: wa ? "12px 12px 2px 12px" : "16px 16px 4px 16px", padding: "9px 12px 6px", boxShadow: "0 1px 1px rgba(0,0,0,0.08)", fontSize: 13.5, lineHeight: 1.5 }}>
          {msg}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10, color: wa ? "#667781" : "rgba(255,255,255,0.85)" }}>
            <span>{time || "09:00"}</span>
            {wa && <span style={{ color: "#34b7f1", fontSize: 11, letterSpacing: "-2px" }}>✓✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── audiogram ──
function Audiogram({ hover, setHover }) {
  const FREQS = D.FREQS, RIGHT = D.RIGHT, LEFT = D.LEFT;
  const W = 560, H = 300, PL = 52, PR = 20, PT = 18, PB = 40;
  const pw = W - PL - PR, ph = H - PT - PB;
  const x = (i) => PL + (i * pw) / (FREQS.length - 1);
  const y = (db) => PT + (db / 80) * ph;
  const path = (d) => d.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const grid = [0, 20, 40, 60, 80];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%" }} role="img" aria-label="Audiogramme : seuils auditifs par fréquence">
      <rect x={PL} y={y(0)} width={pw} height={y(20) - y(0)} fill="#eef2ec" opacity="0.6" />
      <rect x={PL} y={y(40)} width={pw} height={y(80) - y(40)} fill="#f6efdf" opacity="0.5" />
      {grid.map((db) => (
        <g key={db}>
          <line x1={PL} x2={W - PR} y1={y(db)} y2={y(db)} stroke="#e7e0d2" strokeWidth="1" />
          <text x={PL - 10} y={y(db) + 4} textAnchor="end" fontSize="11" fill="#9a917f">{db}</text>
        </g>
      ))}
      {FREQS.map((f, i) => (
        <g key={f}>
          <line x1={x(i)} x2={x(i)} y1={PT} y2={H - PB} stroke="#f0eadc" strokeWidth="1" opacity="0.6" />
          <text x={x(i)} y={H - PB + 20} textAnchor="middle" fontSize="11" fill="#6f685c">{f}</text>
        </g>
      ))}
      <path d={path(RIGHT)} fill="none" stroke="#2f6e54" strokeWidth="2.5" strokeLinejoin="round" />
      <path d={path(LEFT)} fill="none" stroke="#211d17" strokeWidth="2.5" strokeLinejoin="round" />
      {RIGHT.map((v, i) => (
        <circle key={"r" + i} cx={x(i)} cy={y(v)} r="5" fill="#2f6e54" onMouseEnter={() => setHover({ ear: "D", idx: i })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }} />
      ))}
      {LEFT.map((v, i) => (
        <g key={"l" + i} onMouseEnter={() => setHover({ ear: "G", idx: i })} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
          <line x1={x(i) - 5} y1={y(v) - 5} x2={x(i) + 5} y2={y(v) + 5} stroke="#211d17" strokeWidth="2" />
          <line x1={x(i) - 5} y1={y(v) + 5} x2={x(i) + 5} y2={y(v) - 5} stroke="#211d17" strokeWidth="2" />
        </g>
      ))}
      {hover && (() => {
        const d = hover.ear === "D" ? RIGHT : LEFT;
        const txt = (hover.ear === "D" ? "Droite" : "Gauche") + " · " + FREQS[hover.idx] + " · " + d[hover.idx] + " dB";
        const w = txt.length * 6.1 + 18;
        const tx = Math.min(Math.max(x(hover.idx), PL + w / 2), W - PR - w / 2);
        const ty = Math.max(y(d[hover.idx]) - 12, 30);
        return (
          <g>
            <rect x={tx - w / 2} y={ty - 24} width={w} height="20" rx="6" fill="#211d17" />
            <text x={tx} y={ty - 10} textAnchor="middle" fontSize="11" fill="#f5f1e8">{txt}</text>
          </g>
        );
      })()}
    </svg>
  );
}
