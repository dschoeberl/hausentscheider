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

  },

  "efh-erfurt-tiefthal": {

    // ── Identifikation ──────────────────────────────────
    id:               "efh-erfurt-tiefthal",
    slug:             "efh-erfurt-tiefthal",
    objektNummer:     "002",
    metaTitle:        "Objekt 002 · EFH Erfurt Tiefthal",
    metaDescription:  "Objektprofil EFH Erfurt Tiefthal — Einfamilienhaus 1994, 130 m², Gas-Brennwert. Frühe Orientierung Heizungserneuerung.",

    // ── Kopfbereich ─────────────────────────────────────
    titel:            "Einfamilienhaus · Erfurt Tiefthal",
    subtitle:         "Baujahr 1994 · 2 Wohneinheiten · 130 m² · Einzeleigentümer · Gas-Brennwert",
    bild:             "efh-erfurt-tiefthal.jpg",
    bildAlt:          "Einfamilienhaus in Erfurt Tiefthal — Baujahr 1994",

    // ── Standort & Gebäude ──────────────────────────────
    standort:         "Erfurt Tiefthal",
    baujahr:          1994,
    sanierung:        null,
    wohnungen:        2,
    wohnflaeche:      130,           // m²
    eigentumsform:    "Einzeleigentümer",

    // ── Heizsystem ──────────────────────────────────────
    heizsystem:       "Gas-Brennwert",
    heizanlageBaujahr: 2016,
    heizlastKw:       13,
    zusatzKaminofen:  true,

    // ── Energiekennwerte ────────────────────────────────
    energieklasse:           "E",
    energieverbrauchKwhM2a:  174,     // kWh/m²a (22663 / 130)
    gasverbrauchJahr:        22663,   // kWh/Jahr Gesamtverbrauch

    // ── Heizkosten Ist ──────────────────────────────────
    heizkostenGesamtJahr:    2700,    // €
    heizkostenM2Jahr:        20.77,   // €/m²/Jahr (2700 / 130)
    heizkostenM2Monat:       1.73,    // €/m²/Monat (2700 / 130 / 12)

    // ── CO₂ ─────────────────────────────────────────────
    co2KgJahr:        4555,           // 22663 × 0.201

    // ── Kostenblock (Jahresabrechnung) ──────────────────
    kostenblock: {
      brennstoffkostenGas:     2269,
      heizbetriebskosten:      0,
      warmwasserEnergie:        0,
      co2Steuer:                210,
      betriebskostenWasser:     295
    },

    // ── Abrechnungskontext ──────────────────────────────
    abrechnungsjahr:    "2025",
    abrechnungsquelle:  "Eigene Abrechnung",
    gaspreisEffektivCt: 10.0,
    co2MieterPct:       0,
    co2MieterEur:       0,
    co2VermieterEur:    0,

    // ── Entscheidungsstand ──────────────────────────────
    entscheidungsstandText: "Gas-Brennwertheizung seit 2016 in Betrieb. Zusätzlich ein Kaminofen vorhanden. Noch in früher Orientierungsphase — Fördermöglichkeiten und Alternative zum Gas sind offen. Offene Frage: Ist für Tiefthal ein Fernwärmeanschluss geplant?",

    statusItems: [
      { typ: "ok",   text: "Gas-Brennwertheizung seit 2016 in Betrieb" },
      { typ: "ok",   text: "Zusatzheizung durch Kaminofen vorhanden" },
      { typ: "warn", text: "Frühe Orientierung — noch keine Angebote eingeholt" },
      { typ: "open", text: "Fördermöglichkeiten noch nicht geprüft" },
      { typ: "open", text: "Offene Frage: Fernwärmeplanung für Tiefthal?" }
    ],

    naechsteSchritte: [
      { aktiv: true,  text: "Fördermöglichkeiten prüfen — BEG-Förderung, KfW, BAFA-Zuschüsse für Einzeleigentümer klären." },
      { aktiv: false, text: "Kommunale Wärmeplanung abfragen — Ist für Tiefthal ein Fernwärmeanschluss vorgesehen?" },
      { aktiv: false, text: "Energieberatung einholen — Verbraucherzentrale oder BAFA-geförderte Beratung als Einstieg." },
      { aktiv: false, text: "Heizlastberechnung beauftragen — Grundlage für Vergleich der Optionen und Förderanträge." }
    ],

    // ── Rechner-Defaults (Startwerte für Eingabefelder) ─
    // Neutrale Initialwerte für ein EFH, keine bestätigten Angebote
    rechnerDefaults: {
      wpInvest:    35000,
      wpFoerd:     50,        // %
      ruecklage:   0,
      gasInvest:   12000,
      fwInvest:    8000,
      jaz:         3.5,
      fwAp:        20.0,      // ct/kWh
      fwLp:        39.99,     // €/kW/Jahr
      fwFix:       200,       // €/Jahr
      fwSommer:    20,        // % Sommerleistung
      fwHeizlast:  13,        // kW
      co2Preis:    55         // €/t
    }

  }

};
