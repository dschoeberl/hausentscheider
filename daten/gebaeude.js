/**
 * Gemeinsame Gebäudedatenbasis — hausentscheider.de
 *
 * Jedes Objekt wird als Eintrag in GEBAEUDE_DB hinterlegt.
 * Die Profilseiten lesen ihre Werte hieraus.
 *
 * Schlüssel = slug (= Dateiname ohne .html)
 */

/* exported GEBAEUDE_DB */
var GEBAEUDE_DB = {

  "theaterstrasse-4": {

    // ── Identifikation ──────────────────────────────────
    id:               "theaterstrasse-4",
    slug:             "theaterstrasse-4",
    objektNummer:     "001",
    metaTitle:        "Objekt 001 · Theaterstraße 4, Erfurt",
    metaDescription:  "Objektprofil Theaterstraße 4, Erfurt — WEG 14 Wohnungen, Altbau 1900. Entscheidungsstand Heizungserneuerung.",

    // ── Kopfbereich ─────────────────────────────────────
    titel:            "Mehrfamilienhaus · Altstadt Erfurt",
    subtitle:         "Altbau 1900 · Saniert 2010 · 14 Wohnungen · 784 m² · WEG · Gas-Heizung",
    bild:             "theaterstrasse-4.jpg",
    bildAlt:          "Mehrfamilienhaus Theaterstraße 4, Erfurt Altstadt — Gründerzeitbau von 1900",

    // ── Standort & Gebäude ──────────────────────────────
    standort:         "Erfurt Innenstadt",
    baujahr:          1900,
    sanierung:        2010,
    wohnungen:        14,
    wohnflaeche:      784,           // m²
    eigentumsform:    "WEG",

    // ── Heizsystem ──────────────────────────────────────
    heizsystem:       "Gas-Heizung",
    heizanlageBaujahr: 1998,
    heizlastKw:       62,

    // ── Energiekennwerte ────────────────────────────────
    energieklasse:           "D",
    energieverbrauchKwhM2a:  124,     // kWh/m²a (Kennwert Header)
    gasverbrauchJahr:        101240,  // kWh/Jahr Gesamtverbrauch

    // ── Heizkosten Ist ──────────────────────────────────
    heizkostenGesamtJahr:    11000,   // €
    heizkostenM2Jahr:        14.03,   // €/m²/Jahr (berechnet)
    heizkostenM2Monat:       1.17,    // €/m²/Monat (berechnet)

    // ── CO₂ ─────────────────────────────────────────────
    co2KgJahr:        17706,

    // ── Kostenblock (Jahresabrechnung) ──────────────────
    kostenblock: {
      brennstoffkostenGas:     7425,
      heizbetriebskosten:      1232,
      warmwasserEnergie:        2972,
      co2Steuer:                591,
      betriebskostenWasser:     2437
    },

    // ── Abrechnungskontext ──────────────────────────────
    abrechnungsjahr:    "2023/2024",
    abrechnungsquelle:  "DOMO-THERM Heizkostenabrechnung",
    gaspreisEffektivCt: 10.0,
    co2MieterPct:       85,
    co2MieterEur:       502,
    co2VermieterEur:    89,

    // ── Entscheidungsstand ──────────────────────────────
    entscheidungsstandText: "Die Gasheizung läuft seit 1998. Ersatzteile sind teilweise abgekündigt. Das Gebäude liegt im Fernwärmesatzungsgebiet der Stadt Erfurt seit 2006.",

    statusItems: [
      { typ: "warn", text: "Fernwärmesatzung seit 2006 · Anschlusszwang" },
      { typ: "ok",   text: "WP-fähig · Heizlast 62 kW · 2 Außengeräte" },
      { typ: "warn", text: "Heizung Bj. 1998 · Ersatzteile abgekündigt" },
      { typ: "ok",   text: "2 Angebote für Wärmepumpe eingeholt" },
      { typ: "ok",   text: "Energiecheck Verbraucherzentrale Nov. 2024" },
      { typ: "ok",   text: "Investitionsplan erstellt · Nov. 2025" },
      { typ: "open", text: "Befreiungsantrag Umweltamt in Vorbereitung" },
      { typ: "open", text: "Fernwärme-Angebot SWE ausstehend" }
    ],

    naechsteSchritte: [
      { aktiv: true,  text: "Heizlastberechnung — Voraussetzung für finales Angebot, Förderantrag und Fernwärme-Vergleich. Ingenieur beauftragt." },
      { aktiv: true,  text: "Befreiungsantrag — §6 Abs. 3 Fernwärmesatzung. Reine Wärmepumpe qualifiziert, Hybridlösung nicht. Antrag in Vorbereitung." },
      { aktiv: false, text: "Fernwärme-Angebot einholen — Effektiven Jahrespreis inkl. Leistungspreis klären. Anschlussdauer schriftlich bestätigen lassen." },
      { aktiv: false, text: "Wirtschaftlichkeitsvergleich auf 25 Jahre — Alle drei Optionen auf Basis finaler Heizlastberechnung gegenüberstellen. Betriebskosten, CO₂-Entwicklung, Förderung." },
      { aktiv: false, text: "Eigentümerversammlung — Finanzierungsplan aus Erhaltungsrücklage abstimmen. Gemeinsame WEG-Entscheidung treffen." }
    ],

    // ── Rechner-Defaults (Startwerte für Eingabefelder) ─
    rechnerDefaults: {
      wpInvest:    132000,
      wpFoerd:     58,        // %
      ruecklage:   55000,
      gasInvest:   25000,
      fwInvest:    13650,
      jaz:         3.8,
      fwAp:        20.0,      // ct/kWh
      fwLp:        39.99,     // €/kW/Jahr
      fwFix:       200,       // €/Jahr
      fwSommer:    20,        // % Sommerleistung
      fwHeizlast:  62,        // kW
      co2Preis:    55         // €/t
    }

  }

};
