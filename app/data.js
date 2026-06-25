// ─────────────────────────────────────────────────────────────
//  Optique OS · by Symi — données de démonstration (fictives)
//  Palette : papier crème · vert forêt · or · navy profond
// ─────────────────────────────────────────────────────────────

export const VOICE_TEXT =
  "Bonjour Monsieur Mercier. Voici votre bilan auditif du douze juin. Votre oreille droite entend bien l'ensemble des sons du quotidien. Votre oreille gauche perçoit un peu moins finement les sons aigus, ce qui explique la gêne que vous décriviez au restaurant. Rien d'inquiétant : cela se corrige très bien aujourd'hui, et de façon discrète. Nous vous proposons un essai, sans engagement, dans les conditions réelles de votre quotidien. Toute l'équipe du Faubourg Saint-Martin reste à votre écoute. À très bientôt.";

export const TIERS = [
  { id: "prisme", name: "Prisme", hex: "#b08d57" },
  { id: "spectre", name: "Spectre", hex: "#2f6e54" },
  { id: "clarte", name: "Clarté", hex: "#1f5641" },
  { id: "focale", name: "Focale", hex: "#8a9a7e" },
  { id: "regard", name: "Premier Regard", hex: "#b3a994" },
];

export const BOUTIQUES = [
  { id: "faubourg", name: "Faubourg Saint-Martin", short: "Faubourg", arr: "Paris 10ᵉ", dossiers: 28, caMois: "€24,6k", caJour: "€2 180", flux: 14, conseillers: ["Hélène Roux", "Antoine Vidal"], cabine: "Cabine ouverte · 14h30", cabineOn: true, hex: "#1f5641" },
  { id: "vosges", name: "Place des Vosges", short: "Vosges", arr: "Paris 4ᵉ", dossiers: 20, caMois: "€18,2k", caJour: "€1 540", flux: 9, conseillers: ["Claire Dubois", "Karim Haddad"], cabine: "Cabine libre", cabineOn: false, hex: "#b08d57" },
];

export const SIGNALS = [
  { kind: "Vision", patient: "Gabriel Mercier", boutique: "faubourg", text: "Addition installée et progression régulière. Fenêtre idéale pour un renouvellement progressifs premium.", action: "Proposer un renouvellement" },
  { kind: "Audition", patient: "Gabriel Mercier", boutique: "faubourg", text: "Perte modérée sur les aigus à gauche confirmée en cabine. Essai d'appareillage discret recommandé.", action: "Programmer un essai" },
  { kind: "Vision", patient: "Lucas Bertrand", boutique: "vosges", text: "−4,00 stabilisé sur deux renouvellements. Verres amincis indiqués au prochain équipement.", action: "Noter au dossier" },
  { kind: "Suivi", patient: "Henri Lemoine", boutique: "vosges", text: "Réglage auditif à J+90 dû cette semaine. Reprendre les gênes décrites lors de la pose.", action: "Confirmer le rendez-vous" },
];

export const FOLLOWUPS = [
  { patient: "Henri Lemoine", boutique: "vosges", type: "Réglage auditif", cadence: "J+3", when: "Cette semaine", hot: true },
  { patient: "Gabriel Mercier", boutique: "faubourg", type: "Bilan de contrôle", cadence: "J+6", when: "Septembre", hot: false },
  { patient: "Amina Belkacem", boutique: "faubourg", type: "Contrôle progressifs", cadence: "J+12", when: "Octobre", hot: false },
  { patient: "Sophie Garnier", boutique: "faubourg", type: "Adaptation", cadence: "J+1", when: "Dans 9 jours", hot: false },
];

export const RENEWALS = [
  { patient: "Étienne Royer", boutique: "vosges", detail: "Émise mars 2024", days: 12 },
  { patient: "Henri Lemoine", boutique: "vosges", detail: "Progressifs +2,25", days: 21 },
  { patient: "Lucas Bertrand", boutique: "vosges", detail: "Forte myopie −4,00", days: 34 },
  { patient: "Inès Moreau", boutique: "faubourg", detail: "Solaire correctrice", days: 48 },
  { patient: "Amina Belkacem", boutique: "faubourg", detail: "Progressifs +1,75", days: 57 },
];

export const FREQS = ["250", "500", "1k", "2k", "4k", "8k"];
export const RIGHT = [15, 15, 20, 25, 35, 45];
export const LEFT = [20, 25, 30, 40, 55, 65];
export const WAVE = [12, 22, 16, 30, 24, 38, 28, 44, 34, 26, 40, 30, 20, 36, 46, 32, 24, 42, 30, 18, 34, 26, 38, 22, 30, 44, 28, 16, 24, 34, 20, 28, 14, 22, 10];

export const TIMELINE = [
  { date: "Mars 2019", label: "Premier équipement", detail: "Verres unifocaux", dot: "#cabfa9" },
  { date: "Janv. 2021", label: "Renouvellement", detail: "Myopie stabilisée −2,25", dot: "#cabfa9" },
  { date: "Sept. 2022", label: "Passage aux progressifs", detail: "Addition +1,50", dot: "#7aa089" },
  { date: "Févr. 2025", label: "Renouvellement progressifs", detail: "Addition +2,00", dot: "#2f6e54" },
  { date: "12 juin 2026", label: "Bilan auditif — cabine", detail: "Gêne oreille gauche", dot: "#b08d57", active: true },
];

export const REPORT = [
  "Bonjour Monsieur Mercier,",
  "Merci de votre visite ce jeudi 12 juin pour votre premier bilan auditif. Voici, en quelques mots simples, ce que nous avons observé ensemble.",
  "Votre oreille droite entend bien l'ensemble des sons de la vie quotidienne. Votre oreille gauche, en revanche, perçoit moins finement les sons aigus — c'est précisément ce qui explique la difficulté que vous décriviez à suivre une conversation au restaurant : les voix se mêlent au bruit ambiant, et les consonnes deviennent plus difficiles à distinguer.",
  "Rien d'inquiétant : cette évolution est progressive et fréquente, et surtout, elle se corrige très bien aujourd'hui. Des solutions discrètes et confortables existent, et la réglementation actuelle permet une prise en charge intégrale dans la plupart des cas.",
  "Nous vous proposons un essai sans engagement, dans les conditions réelles de votre quotidien, pour que vous puissiez juger par vous-même du confort retrouvé.",
  "Toute l'équipe du Faubourg Saint-Martin reste à votre écoute. Votre prochain rendez-vous de suivi est proposé au mois de septembre.",
];

export const CLIENTS = [
  { id: "gabriel", name: "Gabriel Mercier", initials: "GM", tier: "prisme", boutique: "faubourg", advisor: "Hélène Roux", phone: "+33 6 48 56 84 30", email: "g.mercier@example-demo.fr", spent: 5240, age: 62, since: 2019, lastContact: "21 oct. 2025", firstContact: "3 oct. 2019", nextFollow: "Septembre 2026", birthday: "6 déc. 1963", dueLabel: "Avr 19", overdue: 55, priority: "Élevée", rx: "OD −2,25 · OG −2,50 · Add +2,00", motif: "Gêne oreille gauche", audio: "Ouvert · 12 juin", hasAudio: true, tags: ["Progressifs", "Dossier audio", "Fidèle"], vision: { odSph: "−2,25", ogSph: "−2,50", odCyl: "−0,50", ogCyl: "−0,75", odAxis: 90, ogAxis: 85, add: "+2,00", odMag: 2.25, ogMag: 2.5 }, note: "« Décide vite lorsque le confort est démontré. La gêne auditive au restaurant est un déclencheur concret — l'essai en conditions réelles le rassure. »", visionSignal: "Progression myopique régulière et addition installée à +2,00 : Gabriel entre dans la fenêtre idéale pour un équipement progressifs premium. Proposer maintenant, en prévention, plutôt qu'à l'expiration." },
  { id: "henri", name: "Henri Lemoine", initials: "HL", tier: "prisme", boutique: "vosges", advisor: "Karim Haddad", phone: "+33 6 60 90 26 58", spent: 8200, age: 67, since: 2017, lastContact: "2 nov. 2025", firstContact: "11 mai 2017", nextFollow: "Réglage J+90", birthday: "2 mars 1959", dueLabel: "Mar 27", overdue: 21, priority: "Élevée", rx: "OD −1,00 · OG −1,25 · Add +2,25", motif: "Suivi appareillage", audio: "Suivi · J+90", hasAudio: true, tags: ["Presbytie", "Audio", "Fidèle"], visionSignal: "Presbytie installée, correction de loin faible et stable. Le confort se joue surtout sur la qualité des progressifs — privilégier un verre haut de gamme à champ large." },
  { id: "amina", name: "Amina Belkacem", initials: "AB", tier: "spectre", boutique: "faubourg", advisor: "Antoine Vidal", phone: "+33 6 11 13 17 19", spent: 5345, age: 54, since: 2020, lastContact: "17 mars 2026", dueLabel: "Mar 31", overdue: 74, priority: "Élevée", rx: "OD −3,50 · OG −3,25 · Add +1,75", motif: "Renouvellement progressifs", audio: "—", tags: ["Progressifs"] },
  { id: "camille", name: "Camille Fontaine", initials: "CF", tier: "clarte", boutique: "vosges", advisor: "Claire Dubois", phone: "+33 6 13 87 19 25", spent: 1600, age: 38, since: 2022, lastContact: "17 févr. 2026", dueLabel: "Avr 3", overdue: 71, priority: "Moyenne", rx: "OD −0,75 · OG −0,75", motif: "Première paire", audio: "—", tags: ["Première paire"] },
  { id: "lucas", name: "Lucas Bertrand", initials: "LB", tier: "clarte", boutique: "vosges", advisor: "Claire Dubois", phone: "+33 6 22 08 71 40", spent: 2150, age: 29, since: 2021, lastContact: "9 mars 2026", dueLabel: "Avr 9", overdue: 34, priority: "Moyenne", rx: "OD −4,00 · OG −3,75", motif: "Forte myopie", audio: "—", tags: ["Forte myopie"] },
  { id: "sophie", name: "Sophie Garnier", initials: "SG", tier: "focale", boutique: "faubourg", advisor: "Hélène Roux", phone: "+33 6 74 26 52 92", spent: 900, age: 44, since: 2023, lastContact: "2 avr. 2026", dueLabel: "Avr 12", overdue: 9, priority: "Faible", rx: "OD −1,50 · OG −1,50", motif: "Adaptation", audio: "—", tags: ["Adaptation"] },
  { id: "ines", name: "Inès Moreau", initials: "IM", tier: "focale", boutique: "faubourg", advisor: "Antoine Vidal", phone: "+33 6 76 14 54 98", spent: 1280, age: 35, since: 2022, lastContact: "3 mars 2026", dueLabel: "Avr 4", overdue: 48, priority: "Faible", rx: "OD −2,25 · OG −2,00", motif: "Solaire correctrice", audio: "—", tags: ["Solaire"] },
  { id: "etienne", name: "Étienne Royer", initials: "ÉR", tier: "clarte", boutique: "vosges", advisor: "Karim Haddad", phone: "+33 6 41 55 02 88", spent: 3050, age: 58, since: 2018, lastContact: "1 avr. 2026", dueLabel: "Avr 6", overdue: 12, priority: "Moyenne", rx: "OD −1,25 · OG −1,50 · Add +1,50", motif: "Renouvellement", audio: "—", tags: ["Progressifs"] },
];

// ───── Moteur de relances : déclencheurs centralisés ─────
export const RELANCES = [
  { id: "r1", client: "amina", type: "mutuelle", channel: "WhatsApp", when: "Aujourd'hui", auto: "09:00", urgent: true,
    title: "Droit mutuelle rouvert", detail: "Équipement remboursable depuis mars 2026 · ordonnance expirée à renouveler",
    msg: "Bonjour Amina, votre mutuelle prend de nouveau en charge un équipement optique. Nous serions ravis de vous revoir à la boutique du Faubourg pour faire le point sur vos progressifs. Souhaitez-vous un rendez-vous ?" },
  { id: "r3", client: "gabriel", type: "commande", channel: "WhatsApp", when: "Aujourd'hui", auto: "à réception", urgent: true,
    title: "Commande prête à récupérer", detail: "Lentilles Alcon Dailies Total 1 · 2 boîtes — reçues ce matin, rapprochées du dossier",
    msg: "Bonjour M. Mercier, vos lentilles Alcon Dailies Total 1 sont arrivées et vous attendent à la boutique du Faubourg. Au plaisir de vous accueillir." },
  { id: "r4", client: "ines", type: "mutuelle", channel: "SMS", when: "Aujourd'hui", auto: "09:00", urgent: true,
    title: "Solaire correctrice — droit ouvert", detail: "Droit équipement ouvert · forte demande solaire enregistrée",
    msg: "Bonjour Inès, la saison arrive et votre mutuelle couvre une solaire correctrice. Passez essayer nos nouveaux modèles écaille, on vous réserve un moment." },
  { id: "r2", client: "henri", type: "ordonnance", channel: "SMS", when: "Demain", auto: "09:00", urgent: false,
    title: "Ordonnance à renouveler (J−60)", detail: "Ordonnance valide jusqu'en mai 2026 — recontrôle conseillé",
    msg: "Bonjour M. Lemoine, votre ordonnance arrive à échéance en mai. Pensez à reprogrammer un contrôle de vue afin de renouveler sereinement vos lunettes. Nous restons à votre disposition." },
  { id: "r5", client: "etienne", type: "suivi", channel: "WhatsApp", when: "Dans 3 j", auto: "10:00", urgent: false,
    title: "Suivi équipement progressifs", detail: "Renouvellement opticien possible · nouveaux modèles dans son style",
    msg: "Bonjour M. Royer, cela fait deux ans que vous portez vos progressifs Lunor. Un petit contrôle de confort ? Nous avons reçu de nouveaux modèles Pantos dorés qui devraient vous plaire." },
  { id: "r6", client: "lucas", type: "commande", channel: "SMS", when: "Dès réception", auto: "à réception", urgent: false,
    title: "Lentilles en attente de réception", detail: "Alcon Air Optix · 6 — commande fournisseur en cours",
    msg: "Bonjour Lucas, vos lentilles Air Optix sont commandées. Nous vous prévenons dès leur arrivée — sous 48 h normalement." },
  { id: "r7", client: "camille", type: "impaye", channel: "SMS", when: "Relance 2", auto: "J+30", urgent: false,
    title: "Tiers-payant en attente", detail: "Part mutuelle de €78 non réglée — relance organisme automatique",
    msg: "Bonjour Camille, votre mutuelle n'a pas encore réglé la part de €78 sur votre équipement. Nous relançons l'organisme directement — aucune action de votre part n'est nécessaire." },
];

export const REL_TYPES = {
  mutuelle: { label: "Droit mutuelle", hex: "#1f5641" },
  ordonnance: { label: "Ordonnance", hex: "#b08d57" },
  commande: { label: "Commande", hex: "#2f6e54" },
  suivi: { label: "Suivi", hex: "#8a9a7e" },
  impaye: { label: "Impayé", hex: "#b4472f" },
};

// ───── Fournisseurs & stock ─────
export const SUPPLIERS = [
  { id: "essilor", name: "Essilor", type: "Verres" },
  { id: "bbgr", name: "BBGR", type: "Verres" },
  { id: "alcon", name: "Alcon", type: "Lentilles" },
  { id: "cooper", name: "CooperVision", type: "Lentilles" },
  { id: "lunor", name: "Lunor", type: "Montures" },
  { id: "morel", name: "Marius Morel", type: "Montures" },
  { id: "aetv", name: "Anne et Valentin", type: "Montures" },
  { id: "lux", name: "Luxottica", type: "Montures · Solaires" },
];

export const STOCK = [
  { cat: "Monture", name: "Lunor A5 226", ref: "LUN-A5-226", supplier: "Lunor", achat: 188, vente: 480, fb: 3, vo: 1, seuil: 2 },
  { cat: "Monture", name: "Anne et Valentin · Mood", ref: "AEV-MOOD", supplier: "Anne et Valentin", achat: 156, vente: 390, fb: 2, vo: 2, seuil: 2 },
  { cat: "Monture", name: "Marius Morel 60", ref: "MOR-M60", supplier: "Marius Morel", achat: 92, vente: 245, fb: 5, vo: 3, seuil: 3 },
  { cat: "Monture", name: "Lindberg Air Titanium", ref: "LIN-AIR", supplier: "Lunor", achat: 240, vente: 620, fb: 1, vo: 0, seuil: 2 },
  { cat: "Solaire", name: "Persol 649", ref: "PER-649", supplier: "Luxottica", achat: 96, vente: 230, fb: 4, vo: 2, seuil: 3 },
  { cat: "Solaire", name: "Ray-Ban Wayfarer", ref: "RB-WAY", supplier: "Luxottica", achat: 78, vente: 175, fb: 6, vo: 4, seuil: 4 },
  { cat: "Verres", name: "Essilor Varilux XR · progressif", ref: "ESS-VX-XR", supplier: "Essilor", achat: 210, vente: 540, fb: 8, vo: 6, seuil: 6 },
  { cat: "Verres", name: "Essilor Eyezen · unifocal", ref: "ESS-EZ", supplier: "Essilor", achat: 64, vente: 160, fb: 14, vo: 10, seuil: 8 },
  { cat: "Verres", name: "BBGR Anti-reflet Néva Max", ref: "BBG-NMX", supplier: "BBGR", achat: 48, vente: 130, fb: 9, vo: 5, seuil: 8 },
  { cat: "Lentilles", name: "Alcon Dailies Total 1 · 90", ref: "ALC-DT1-90", supplier: "Alcon", achat: 38, vente: 79, fb: 12, vo: 7, seuil: 10 },
  { cat: "Lentilles", name: "CooperVision Biofinity · 6", ref: "COO-BIO-6", supplier: "CooperVision", achat: 21, vente: 48, fb: 4, vo: 2, seuil: 8 },
  { cat: "Lentilles", name: "Alcon Air Optix · 6", ref: "ALC-AO-6", supplier: "Alcon", achat: 24, vente: 52, fb: 0, vo: 1, seuil: 6 },
];

// ───── Arrivages du jour ─────
export const ARRIVALS = [
  { id: "a1", cat: "Lentilles", product: "Alcon Dailies Total 1 · 90", ref: "ALC-DT1-90", supplier: "Alcon", box: "2 boîtes", client: "gabriel" },
  { id: "a3", cat: "Verres", product: "Essilor Varilux XR · progressifs", ref: "ESS-VX-XR", supplier: "Essilor", box: "1 paire", client: "henri" },
  { id: "a4", cat: "Monture", product: "Marius Morel 60 · acétate", ref: "MOR-M60", supplier: "Marius Morel", box: "1 pièce", client: "amina" },
  { id: "a5", cat: "Lentilles", product: "Alcon Air Optix · 6", ref: "ALC-AO-6", supplier: "Alcon", box: "2 boîtes", client: null,
    reason: "Correspond à une ordonnance OD −4,00 · OG −3,75 en attente de réception", candidates: ["lucas", "camille"] },
  { id: "a2", cat: "Lentilles", product: "CooperVision Biofinity Toric · 6", ref: "COO-BIO-6", supplier: "CooperVision", box: "1 boîte", client: null,
    reason: "Lentille torique · myopie −3,25 — deux dossiers ouverts compatibles", candidates: ["amina", "ines"] },
];

// ───── Nouveaux modèles à proposer selon les goûts ─────
export const NEWMODELS = [
  { id: "m1", name: "Lunor A5 226", supplier: "Lunor", kind: "Titane · Pantos · Or brossé", price: 480, why: "Pantos métal doré, profil discret", match: ["gabriel", "etienne"] },
  { id: "m2", name: "Anne et Valentin · Mood", supplier: "Anne et Valentin", kind: "Acétate · Œil-de-chat · Corail", price: 390, why: "Acétate coloré, monture statement", match: ["amina", "camille"] },
  { id: "m3", name: "Persol 649", supplier: "Luxottica", kind: "Acétate · Carré · Écaille", price: 230, why: "Carré écaille intemporel", match: ["lucas", "ines"] },
];

// ───── Goûts & style par client ─────
export const PREFS = {
  gabriel: { forme: "Pantos", matiere: "Titane / métal", teinte: "Or · écaille claire", marques: "Lunor · Lindberg", budget: "€400–600", note: "Recherche la discrétion et le haut de gamme. Sensible au poids et au confort sur l'arête." },
  henri: { forme: "Rectangle", matiere: "Titane léger", teinte: "Gris · gun", marques: "Lindberg", budget: "€450+", note: "Privilégie la légèreté. Progressifs à champ large indispensables." },
  amina: { forme: "Œil-de-chat", matiere: "Acétate", teinte: "Couleurs vives · corail", marques: "Anne et Valentin · Face à Face", budget: "€350–500", note: "Aime affirmer un style. Ouverte aux montures audacieuses." },
  lucas: { forme: "Carrée", matiere: "Acétate", teinte: "Noir mat · écaille", marques: "Persol · Ray-Ban", budget: "€180–250", note: "Style sobre et solide. Forte myopie : privilégier verres amincis." },
  camille: { forme: "Ronde", matiere: "Acétate fin", teinte: "Transparent · rosé", marques: "Komono · Izipizi", budget: "€150–220", note: "Première paire, sensible au prix et à la légèreté." },
  etienne: { forme: "Pantos", matiere: "Métal doré", teinte: "Doré classique", marques: "Lunor", budget: "€300–450", note: "Goût classique et intemporel." },
  sophie: { forme: "Ovale", matiere: "Acétate léger", teinte: "Nude · transparent", marques: "Izipizi", budget: "€120–180", note: "En adaptation, recherche le confort avant tout." },
  ines: { forme: "Papillon", matiere: "Acétate / écaille", teinte: "Écaille · ambre", marques: "Persol", budget: "€200–300", note: "Forte demande en solaire correctrice." },
};

// ───── Droits ophtalmo + mutuelle → fenêtre de relance ─────
export const DROITS = {
  gabriel: { ordEmise: "Avr 2024", ordValide: "Avr 2027", renouv: "Renouvellement opticien possible", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Févr 2025", mutOuvert: "Févr 2027", relanceDate: "Janv. 2027", relanceTrigger: "Droit mutuelle rouvert" },
  henri: { ordEmise: "Mai 2023", ordValide: "Mai 2026", renouv: "Expire bientôt — vision à recontrôler", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Janv 2025", mutOuvert: "Janv 2027", relanceDate: "Mars 2026", relanceTrigger: "Ordonnance à renouveler (J−60)" },
  amina: { ordEmise: "Mars 2023", ordValide: "Mars 2026", renouv: "Expirée — nouvel examen requis", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Mars 2024", mutOuvert: "Mars 2026", relanceDate: "Maintenant", relanceTrigger: "Droit ouvert + ordonnance expirée" },
  lucas: { ordEmise: "Sept 2024", ordValide: "Sept 2029", renouv: "Valide", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Mars 2025", mutOuvert: "Mars 2027", relanceDate: "Févr. 2027", relanceTrigger: "Droit mutuelle rouvert" },
  camille: { ordEmise: "Févr 2025", ordValide: "Févr 2030", renouv: "Valide", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Févr 2025", mutOuvert: "Févr 2027", relanceDate: "Janv. 2027", relanceTrigger: "Droit mutuelle rouvert" },
  etienne: { ordEmise: "Mars 2024", ordValide: "Mars 2027", renouv: "Renouvellement opticien possible", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Avr 2024", mutOuvert: "Avr 2026", relanceDate: "Mars 2026", relanceTrigger: "Droit mutuelle rouvert" },
  sophie: { ordEmise: "Avr 2025", ordValide: "Avr 2030", renouv: "Valide", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Avr 2025", mutOuvert: "Avr 2027", relanceDate: "Mars 2027", relanceTrigger: "Droit mutuelle rouvert" },
  ines: { ordEmise: "Mars 2023", ordValide: "Mars 2026", renouv: "Expire ce mois", mutNom: "Tiers-payant actif", mutCycle: "Équipement / 2 ans", mutDernier: "Mars 2024", mutOuvert: "Mars 2026", relanceDate: "Maintenant", relanceTrigger: "Solaire correctrice — droit ouvert" },
};

// ───── Foyers / familles ─────
export const FAMILIES = {
  mercier: { id: "mercier", label: "Foyer Mercier", remise: 10, note: "2 équipements optiques par an — remise foyer fidélité", members: [{ id: "gabriel", role: "Titulaire" }, { id: "ines", role: "Fille" }] },
  bertrand: { id: "bertrand", label: "Foyer Bertrand", remise: 10, note: "Couple équipé ensemble — remise foyer", members: [{ id: "lucas", role: "Titulaire" }, { id: "camille", role: "Conjointe" }] },
};
export const CLIENT_FAMILY = { gabriel: "mercier", ines: "mercier", lucas: "bertrand", camille: "bertrand" };

// ───── Académie : parcours d'intégration ─────
export const MODULES = [
  { id: "accueil", title: "Accueil & posture conseil", mins: 45, hex: "#2f6e54", fiches: ["Recevoir un client en boutique", "Le vocabulaire maison", "Reformuler le besoin réel", "Passer le relais entre deux maisons"] },
  { id: "reception", title: "Réception & rapprochement des arrivages", mins: 30, hex: "#b08d57", fiches: ["Scanner un colis fournisseur", "Rapprocher une livraison d'un dossier", "Traiter un arrivage orphelin", "Déclencher le SMS « commande prête »", "Ranger en réserve par maison"] },
  { id: "mutuelle", title: "Dossier mutuelle & tiers-payant", mins: 60, hex: "#1f5641", fiches: ["Lire une ordonnance", "Vérifier les droits ophtalmo", "Calculer le reste à charge", "Monter un tiers-payant", "100 % Santé : les paniers", "Relancer un impayé"] },
  { id: "mesures", title: "Mesures & prise de cote", mins: 40, hex: "#8a9a7e", fiches: ["Écart pupillaire", "Hauteur de montage", "Galbe & angle pantoscopique", "Contrôler un montage"] },
  { id: "stock", title: "Stock & commandes fournisseurs", mins: 25, hex: "#2f6e54", fiches: ["Lire une fiche stock", "Passer une commande fournisseur", "Transfert entre maisons"] },
  { id: "relances", title: "Relances & fenêtres de droit", mins: 20, hex: "#b4472f", fiches: ["Comprendre la fenêtre mutuelle", "Programmer une relance texto", "Suivre une file d'attente"] },
];
export const HIRES = [
  { id: "lea", name: "Léa Fontaine", initials: "LF", boutique: "faubourg", mentor: "Hélène Roux", joined: "Arrivée il y a 8 jours", done: ["accueil", "reception"], current: "mutuelle", currentFiche: 2 },
  { id: "thomas", name: "Thomas Nardin", initials: "TN", boutique: "vosges", mentor: "Karim Haddad", joined: "Arrivé il y a 3 semaines", done: ["accueil", "reception", "mutuelle", "mesures", "stock"], current: "relances", currentFiche: 1 },
];

// ───── Notifications : couche temps réel au-dessus des relances ─────
export const NOTIF_TYPES = {
  arrivage: { hex: "#2f6e54", icon: "box" },
  "arrivage-matched": { hex: "#1f5641", icon: "box" },
  mutuelle: { hex: "#1f5641", icon: "shield" },
  ordonnance: { hex: "#b08d57", icon: "doc" },
  cabine: { hex: "#b08d57", icon: "ear" },
  impaye: { hex: "#b4472f", icon: "euro" },
  stock: { hex: "#b4472f", icon: "layers" },
  formation: { hex: "#8a9a7e", icon: "cap" },
  "relance-sent": { hex: "#9ec3b0", icon: "send" },
};

export const NOTIFICATIONS = [
  { id: "n1", type: "arrivage", day: "today", time: "il y a 6 min", read: false,
    title: "Colis Alcon reçu — 2 dossiers compatibles", detail: "Air Optix · 6 — à rapprocher d'un dossier",
    action: { label: "Rapprocher", screen: "arrivages" } },
  { id: "n2", type: "mutuelle", day: "today", time: "il y a 22 min", read: false, client: "amina",
    title: "Droit mutuelle rouvert · Amina Belkacem", detail: "Équipement remboursable depuis mars 2026",
    action: { label: "Programmer la relance", screen: "relances", relTab: "mutuelle" } },
  { id: "n3", type: "cabine", day: "today", time: "09:12", read: false, client: "gabriel",
    title: "Bilan auditif terminé · Gabriel Mercier", detail: "Cabine < 40 dBA — compte rendu disponible",
    action: { label: "Voir le dossier", screen: "profile", client: "gabriel" } },
  { id: "n4", type: "stock", day: "today", time: "08:50", read: false,
    title: "Stock bas · Alcon Air Optix · 6", detail: "1 restant (Vosges) — sous le seuil",
    action: { label: "Commander", screen: "stock" } },
  { id: "n5", type: "relance-sent", day: "yesterday", time: "Hier · 17:40", read: true, client: "henri",
    title: "Relance envoyée · Henri Lemoine", detail: "Ordonnance à renouveler — SMS programmé 09:00", action: null },
  { id: "n6", type: "formation", day: "yesterday", time: "Hier · 11:05", read: true,
    title: "Thomas a validé le module Mutuelle", detail: "Parcours d'intégration · Place des Vosges",
    action: { label: "Voir le parcours", screen: "formation" } },
  { id: "n7", type: "ordonnance", day: "week", time: "Lun. · 15:20", read: true, client: "henri",
    title: "Ordonnance expire dans 60 j · Henri Lemoine", detail: "Recontrôle de vue conseillé avant mai 2026",
    action: { label: "Programmer", screen: "relances", relTab: "ordonnance" } },
  { id: "n8", type: "impaye", day: "week", time: "Lun. · 10:02", read: true, client: "camille",
    title: "Tiers-payant €78 toujours impayé · Camille Fontaine", detail: "Relance organisme automatique en cours",
    action: { label: "Voir le dossier", screen: "profile", client: "camille" } },
];
