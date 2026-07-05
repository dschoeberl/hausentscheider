/* ==============================================================
   engine.js — Berechnungs-Layer C2 v1
   Reine Funktionen, keine DOM-Manipulation, keine Side-Effects.
   ES-Modul, von ergebnis.js importiert.

   Spec: docs/C2_BlockSpec_v1.md (v1.1, Stand 03.05.2026)
   Datenquelle: daten/parameter.json (154 Defined Names, Mai 2026)
   Methodik: VDI 2067 Annuitäten-Verfahren
     TCO Barwert = (Kapital + Verbrauch + Wartung + CO₂)-Annuität × n
   ============================================================== */

'use strict';

/* --------------------------------------------------------------
   1) Konstanten — Excel-Werte, JSON-Diskrepanzen dokumentiert
   -------------------------------------------------------------- */

// CO₂-Preise pro Pfad — aus Excel-Tab Rechenlogik §4 (statische €/t-Werte,
// KEINE Steigerungs-Pfade). Web-Naming aus Spec v1 (intuitiv für Endnutzer),
// Excel-Werte unter der Haube. Pfad-Naming-Sync ist Folgeaufgabe v1.2.
const CO2_PREIS_PFAD = {
  stagnation:     55,   // Excel "konservativ"
  aktuell:        105,  // Excel "mittel" — Default
  beschleunigung: 125   // Excel "hoch"
};

// CO₂-Emissionsfaktoren pro Heizoption (kg CO₂ / kWh Endenergie).
// Aus Excel-Tab CO2-Aufteilung — Folgeaufgabe build_json.py v1.2.
const CO2_FAKTOR = {
  gas:     0.196,
  hybrid:  0.059,
  wp:      0.000,
  fw:      0.242,
  pellets: 0.023,
  oel:     0.266
};

// Modernisierungs-Mehrinvest gegenüber Status quo Gas (Excel-Tab Eingaben).
// JSON-Diskrepanz: parameter.json.block5.MFH.Invest* sind absolute Werte
// (180k WP), Excel rechnet TCO mit Mehrinvest (126k WP).
// Folgeaufgabe build_json.py v1.2: Mehrinvest-Werte ins JSON pflegen.
const INVEST_MEHR_EXCEL = {
  MFH: { gas: 0, hybrid: 73000, wp: 126000, fw: 33000, pellets: 63000 },
  // EFH: pragmatisch aus JSON-Differenz (block5.EFH.InvestX − InvestGas).
  // Sobald Excel-EFH-Werte vorliegen, hier hardcoden wie MFH.
  EFH: { gas: 0, hybrid: 12000, wp: 16000, fw: 6000, pellets: 20000 }
};

// Excel-Bezugs-Wohnfläche für die Investitions-Skalierung. Excel-Tab
// Rechenlogik §7 nutzt 908 m² für MFH-Default (NICHT 950 wie in JSON.block5).
// Folgeaufgabe build_json.py v1.2: parameter.json sync.
const EXCEL_BEZUG_WOHNFLAECHE = {
  MFH: 908,
  EFH: 140
};

// Klimabonus-Sinkpfad (Spec §3.5 — JSON hat nur Mai-2026-Wert)
const KLIMA_SINKPFAD = {
  '2026': 0.20,
  '2029': 0.17,
  '2031': 0.14
};

// Pellets-Plausibilitäts-Schwelle (Spec §4.5)
const PELLETS_HEIZLAST_SCHWELLE = 30;  // kW

// Erfurt-Altstadt PLZ-Liste (Folgeaufgabe: aus rechner.html-Hardcode in JSON)
const ALTSTADT_PLZ = ['99084'];

const HEIZLAST_FAKTOR = {
  unsaniert:   0.12,
  teilsaniert: 0.08,
  saniert:     0.05
};

/* --------------------------------------------------------------
   2) JSON-Lookup
   -------------------------------------------------------------- */

function _p(params, ...path) {
  let node = params;
  for (const k of path) {
    if (node == null) return null;
    node = node[k];
  }
  return node;
}

function _default(params, block, name) {
  const node = _p(params, block, name);
  return node ? node.default : null;
}

function _gebaeudedefaults(input, params) {
  return _p(params, 'block5_gebaeudedefaults', input.gebaeudetyp) || {};
}

/* --------------------------------------------------------------
   3) Annuitäten- und Barwert-Faktoren (VDI 2067)
   -------------------------------------------------------------- */

function _annuitaetenfaktor(zins, n) {
  if (zins === 0) return 1 / n;
  const z = Math.pow(1 + zins, n);
  return (zins * z) / (z - 1);
}

function _barwertfaktor(steig, zins, n) {
  // Σ_{t=1..n} (1+r)^(t-1) / (1+i)^t
  // = (1/(1+i)) × (1 − q^n) / (1 − q),  q = (1+r)/(1+i)
  if (Math.abs(steig - zins) < 1e-9) {
    return n / (1 + zins);  // Sonderfall i = r
  }
  const q = (1 + steig) / (1 + zins);
  return (1 / (1 + zins)) * (1 - Math.pow(q, n)) / (1 - q);
}

function _kalkzins(params) {
  return _default(params, 'block2_rahmen', 'Kalkzins') ?? 0.03;
}

/* --------------------------------------------------------------
   4) Plausibilität / Konditional
   -------------------------------------------------------------- */

function pelletsPlausibel(input, params) {
  const maxWE = _default(params, 'block4_plausi', 'PelletsMaxWE') ?? 6;
  const innenstadt = (input.lage === 'innenstadt');
  if (innenstadt && input.heizlast > PELLETS_HEIZLAST_SCHWELLE) return false;
  if (input.we > maxWE) return false;
  if (input.gebaeudetyp === 'MFH' && innenstadt) return false;
  return true;
}

function wirksamVM(input) {
  if (input.nutzungsart === 'selbstnutzung') return 0;
  return 1;
}

function fwSatzungAktiv(input) {
  return altstadtPLZ(input.plz) && input.gebaeudetyp === 'MFH';
}

function altstadtPLZ(plz) {
  if (!plz) return false;
  return ALTSTADT_PLZ.some(p => String(plz).startsWith(p));
}

/* --------------------------------------------------------------
   5) Investition (Modernisierungs-Mehrinvest)
   -------------------------------------------------------------- */

function berechneInvestition(option, input, params) {
  // C2 v2.1: Investitions-Werte sind jetzt User-Pflichteingabe im Wizard.
  // input.bruttoInvest = { hybrid, wp, fw, pellets } — Modernisierungs-Brutto.
  // Status quo Gas hat Mehrinvest 0 (man modernisiert nicht).
  // Keine Wohnflächen-Skalierung mehr — User trägt absolute €-Werte ein.
  if (option === 'gas' || option === 'oel') return 0;
  const bi = input.bruttoInvest || {};
  return bi[option] ?? 0;
}

// Wartungs-Basis (Excel-Konvention):
// - Gas: absolute Brutto-Investition (= Gas-Standard-Erneuerungswert),
//        weil Mehrinvest 0 wäre und damit Wartung 0 — was die TCO Gas
//        unrealistisch niedrig machen würde.
// - Andere: Mehrinvest (= Brutto-Wert der Modernisierungs-Komponente).
function _wartungsBasis(option, input, params) {
  // Excel-Konvention: Status-quo-Gas-Wartung wird auf absolute Brutto-Invest
  // (60k MFH / 12k EFH) gerechnet, weil diese Anlage existiert (nicht User-Eingabe).
  // Modernisierungs-Optionen: Wartung skaliert mit User-Bruttoinvest (input.bruttoInvest).
  // Daniel 05.05.: Wartung skaliert mit Override (1,5 % WP × 100k = 1.500 €/a).
  if (option === 'gas' || option === 'oel') {
    const def = _gebaeudedefaults(input, params);
    return def.InvestGas || 0;
  }
  return berechneInvestition(option, input, params);
}

function berechneVerbrauchEffektiv(option, input, params) {
  const tech = _p(params, 'block3_technik') || {};
  const wgGas     = tech.WGGasBW   ? tech.WGGasBW.default   : 0.96;
  const wgPellets = tech.WGPellets ? tech.WGPellets.default : 0.90;
  const jaz       = (input.overrides && input.overrides.jaz)
                    || (tech.JAZ ? tech.JAZ.default : 3.8);
  const wgFW      = 1.00;  // JSON hat keinen WGFW, FW wird als 1:1 Endenergie geliefert
  const hybridAnteilWP = tech.HybridAnteilWP
                         ? tech.HybridAnteilWP.default
                         : 0.7;
  const v = input.verbrauch || 0;
  switch (option) {
    case 'gas':     return v / wgGas;
    case 'oel':     return v / wgGas;
    case 'hybrid':  return hybridAnteilWP * (v / jaz)
                         + (1 - hybridAnteilWP) * (v / wgGas);
    case 'wp':      return v / jaz;
    case 'fw':      return v / wgFW;
    case 'pellets': return v / wgPellets;
    default:        return v;
  }
}

/* --------------------------------------------------------------
   6) Förderung
   -------------------------------------------------------------- */

function berechneFoerderQuote(state, params) {
  const f = state.foerderung || {};
  const grund     = _default(params, 'block2_rahmen', 'BonusGrund_default') ?? 0.30;
  const klimaBase = _default(params, 'block2_rahmen', 'BonusKlima_default') ?? 0.20;
  const eink      = _default(params, 'block2_rahmen', 'BonusEink_default')  ?? 0.30;
  const eff       = _default(params, 'block2_rahmen', 'BonusEff_default')   ?? 0.05;
  const deckel    = _default(params, 'block2_rahmen', 'FoerderDeckel')      ?? 0.70;

  const heuteJahr = (new Date()).getFullYear();
  let klima = klimaBase;
  let sinkpfadAktiv = false;
  if (heuteJahr >= 2031) { klima = KLIMA_SINKPFAD['2031']; sinkpfadAktiv = true; }
  else if (heuteJahr >= 2029) { klima = KLIMA_SINKPFAD['2029']; sinkpfadAktiv = true; }

  let quote = 0;
  if (f.grund)     quote += grund;
  if (f.klima)     quote += klima;
  if (f.einkommen) quote += eink;
  if (f.effizienz) quote += eff;

  // Master-Slider als Override, sobald er von der Toggle-Aggregation abweicht
  if (typeof f.master === 'number') {
    const master = f.master / 100;
    if (Math.abs(master - quote) > 1e-6) quote = master;
  }

  const capped = quote >= deckel - 1e-6;
  quote = Math.min(quote, deckel);
  return { quote, capped, sinkpfadAktiv };
}

function berechneFoerderBetrag(option, input, params) {
  // Status quo Gas und Öl bekommen keine BAFA-Förderung
  if (option === 'gas' || option === 'oel') return 0;
  // Anschlusszwang-Gebiet ohne Befreiung: nur Fernwärme ist förderfähig.
  // Jede Ausweich-Option (WP, Hybrid, Pellets) verliert die Förderung, weil die
  // BEG Maßnahmen ausschließt, zu denen eine gesetzliche Pflicht besteht — die
  // Pflicht trifft den Netzanschluss, nicht die Alternative.
  if (input.anschlusszwang && !input.befreiung && option !== 'fw') return 0;
  const investition = berechneInvestition(option, input, params);
  const { quote } = berechneFoerderQuote(input, params);
  const eurCap = _default(params, 'block2_rahmen', 'FoerderDeckelAbs') ?? 21000;
  return Math.min(investition * quote, eurCap);
}

/* --------------------------------------------------------------
   7) Energiepreis (Override-Kette)
   -------------------------------------------------------------- */

function _energiepreis(option, input, params) {
  // Kette: profi-Override > Schieberegler > JSON-Default
  const ov = input.overrides || {};
  const eigen = ov.eigenerPreis || {};
  const slider = input.preis || {};
  const lookup = {
    gas:     [eigen.gas,     slider.gas,     _default(params, 'block1_energiepreise', 'PreisGas')],
    fw:      [eigen.fw,      slider.fw,      _default(params, 'block1_energiepreise', 'PreisFW')],
    wp:      [eigen.wp,      slider.wp,      _default(params, 'block1_energiepreise', 'PreisWP')],
    pellets: [eigen.pellets, null,           _default(params, 'block1_energiepreise', 'PreisPellets')],
    oel:     [eigen.oel,     null,           _default(params, 'block1_energiepreise', 'PreisOel')]
  };
  if (option === 'hybrid') {
    // Hybrid hat keinen einheitlichen Preis — wird in der Verbrauchs-
    // Annuität getrennt für WP-Anteil und Gas-Anteil gerechnet (s. u.).
    return null;
  }
  const chain = lookup[option];
  if (!chain) return 0;
  for (const v of chain) {
    if (v != null && !isNaN(v)) return Number(v);
  }
  return 0;
}

function _steigung(option, params) {
  const b1 = _p(params, 'block1_energiepreise') || {};
  const map = {
    gas:     b1.PreisGas     && b1.PreisGas.steigerung,
    fw:      b1.PreisFW      && b1.PreisFW.steigerung,
    wp:      b1.PreisWP      && b1.PreisWP.steigerung,
    pellets: b1.PreisPellets && b1.PreisPellets.steigerung,
    oel:     b1.PreisOel     && b1.PreisOel.steigerung
  };
  return map[option] ?? 0.03;
}

/* --------------------------------------------------------------
   8) CO₂-Kosten
   -------------------------------------------------------------- */

function _co2PreisMittel(input) {
  const pfad = (input.overrides && input.overrides.co2Pfad) || 'aktuell';
  return CO2_PREIS_PFAD[pfad] ?? CO2_PREIS_PFAD.aktuell;
}

function _co2KostenProJahr(option, input) {
  // CO₂-Kosten = Endenergie-Verbrauch × Emissionsfaktor × CO₂-Preis-Mittel
  // Ergebnis in €/Jahr (Mittelwert über die Betrachtungsdauer)
  const fak = CO2_FAKTOR[option] ?? 0;
  if (fak === 0) return 0;
  const verbrauch = input.verbrauch || 0;
  const preis = _co2PreisMittel(input);  // €/t
  return verbrauch * fak * preis / 1000;
}

/* --------------------------------------------------------------
   9) Wartung
   -------------------------------------------------------------- */

function _wartungsquote(option, params) {
  // C2 v2.1 (Daniel 05.05.): Wartungs-Quoten heizungs-spezifisch nach
  // Memory project_excel_reparatur_wartung_modell.md.
  // ÜBERSCHREIBT die JSON-Defaults aus block3_technik (die werden
  // im Excel-Patch v2.1 angeglichen — Folgeaufgabe).
  //
  // Werte 05.05.2026:
  //   Gas-BW 2,0 %  (JSON: 2,5 %)
  //   Hybrid 3,5 %  (JSON: 3,0 %)
  //   WP     1,5 %  (JSON: 2,0 %)
  //   FW     1,0 %  (JSON: 1,5 %)
  //   Pellets 3,0 % (JSON: 3,5 %)
  const map = {
    gas:     0.020,
    hybrid:  0.035,
    wp:      0.015,
    fw:      0.010,
    pellets: 0.030,
    oel:     0.020
  };
  return map[option] ?? 0.020;
}

function _wartungsAnnuitaet(option, input, params) {
  // Wartung statisch (keine Preissteigerung) — Annuität = jährlicher Wartungs-Betrag.
  // Mathematisch: b(r=0, i, n) × a(i, n) = 1 (b ist Inverse von a bei r=0).
  return _wartungsBasis(option, input, params) * _wartungsquote(option, params);
}

/* --------------------------------------------------------------
   10) TCO Barwert (VDI 2067 — Spec §3.1 v1.1)
   -------------------------------------------------------------- */

function berechneTCO(option, input, params) {
  const T    = input.zeitraum || 25;
  const zins = _kalkzins(params);
  const a    = _annuitaetenfaktor(zins, T);

  // Kapital-Annuität: Netto-Mehrinvest × a
  const investMehr   = berechneInvestition(option, input, params);
  const foerderung   = berechneFoerderBetrag(option, input, params);
  const investNetto  = Math.max(0, investMehr - foerderung);
  const kapital_a    = investNetto * a;

  // Verbrauchs-Annuität — Hybrid getrennt nach WP-Anteil und Gas-Anteil
  const verbrauch_a = _verbrauchsAnnuitaet(option, input, params, T, zins, a);

  // Wartungs-Annuität (statisch)
  const wartung_a = _wartungsAnnuitaet(option, input, params);

  // CO₂-Annuität — Mittelwert über T Jahre, mit Energiepreis-spezifischem b
  const co2_a = _co2Annuitaet(option, input, params, T, zins, a);

  const annuitaet = kapital_a + verbrauch_a + wartung_a + co2_a;
  const tco = annuitaet * T;

  return {
    tco,
    annuitaet,
    komponenten: {
      kapital:  kapital_a * T,
      verbrauch: verbrauch_a * T,
      wartung:  wartung_a * T,
      co2:      co2_a * T,
      // Roh-Werte für Diagnose
      investMehr,
      foerderung,
      investNetto
    }
  };
}

function _verbrauchsAnnuitaet(option, input, params, T, zins, a) {
  if (option === 'hybrid') {
    const tech = _p(params, 'block3_technik') || {};
    const hybridAnteilWP = tech.HybridAnteilWP
                           ? tech.HybridAnteilWP.default
                           : 0.7;
    const v = input.verbrauch || 0;
    const jaz = (input.overrides && input.overrides.jaz)
                 || (tech.JAZ ? tech.JAZ.default : 3.8);
    const wgGas = tech.WGGasBW ? tech.WGGasBW.default : 0.96;

    const verbWP  = hybridAnteilWP * v / jaz;
    const verbGas = (1 - hybridAnteilWP) * v / wgGas;
    const preisWP  = _energiepreis('wp', input, params) / 100;
    const preisGas = _energiepreis('gas', input, params) / 100;
    const ekWP  = verbWP  * preisWP;
    const ekGas = verbGas * preisGas;
    const bWP  = _barwertfaktor(_steigung('wp', params), zins, T);
    const bGas = _barwertfaktor(_steigung('gas', params), zins, T);
    return (ekWP * bWP + ekGas * bGas) * a;
  }
  const verbEff = berechneVerbrauchEffektiv(option, input, params);
  const preis   = _energiepreis(option, input, params) / 100;
  const ek      = verbEff * preis;
  const b       = _barwertfaktor(_steigung(option, params), zins, T);
  return ek * b * a;
}

function _co2Annuitaet(option, input, params, T, zins, a) {
  const co2Jahr = _co2KostenProJahr(option, input);
  if (co2Jahr === 0) return 0;
  // b-Faktor: für CO₂ verwenden wir den Energiepreis-Steig-b der jeweiligen Option
  // (CO₂-Belastung korreliert mit Energieträger). Hybrid: gewichteter Mittel-b.
  let b;
  if (option === 'hybrid') {
    const tech = _p(params, 'block3_technik') || {};
    const a_wp = tech.HybridAnteilWP ? tech.HybridAnteilWP.default : 0.7;
    const bWP  = _barwertfaktor(_steigung('wp', params), zins, T);
    const bGas = _barwertfaktor(_steigung('gas', params), zins, T);
    b = a_wp * bWP + (1 - a_wp) * bGas;
  } else {
    b = _barwertfaktor(_steigung(option, params), zins, T);
  }
  return co2Jahr * b * a;
}

function berechneTCOAlleOptionen(input, params) {
  return {
    gas:     berechneTCO('gas',     input, params),
    hybrid:  berechneTCO('hybrid',  input, params),
    wp:      berechneTCO('wp',      input, params),
    fw:      berechneTCO('fw',      input, params),
    pellets: berechneTCO('pellets', input, params)
  };
}

function berechneEurProQmMonat(tco, wohnflaeche, zeitraum) {
  if (!wohnflaeche || !zeitraum) return 0;
  return tco / wohnflaeche / (zeitraum * 12);
}

/* --------------------------------------------------------------
   11) Cashflow-Kurve — nominal kumuliert (für Linien-Chart)
   --------------------------------------------------------------
   ABWEICHEND von TCO: Cashflow-Kurve zeigt nominale Beträge mit
   jährlicher Steigerung, NICHT die Annuität. Endwert ≠ TCO Barwert.
   Zweck: anschauliche Geschichte für Linien-Chart.
*/

function berechneCashflowKurve(option, input, params) {
  const T = input.zeitraum || 25;
  const investMehr = berechneInvestition(option, input, params);
  const foerderung = berechneFoerderBetrag(option, input, params);

  const wartProJahr = _wartungsBasis(option, input, params) * _wartungsquote(option, params);

  const jaehrlich = new Array(T + 1).fill(0);
  const kumuliert = new Array(T + 1).fill(0);

  // Energiepreis-Faktoren pro Jahr
  for (let t = 1; t <= T; t++) {
    let energieT;
    if (option === 'hybrid') {
      const tech = _p(params, 'block3_technik') || {};
      const a_wp = tech.HybridAnteilWP ? tech.HybridAnteilWP.default : 0.7;
      const v = input.verbrauch || 0;
      const jaz = (input.overrides && input.overrides.jaz)
                   || (tech.JAZ ? tech.JAZ.default : 3.8);
      const wgGas = tech.WGGasBW ? tech.WGGasBW.default : 0.96;
      const verbWP  = a_wp * v / jaz;
      const verbGas = (1 - a_wp) * v / wgGas;
      const stWP  = _steigung('wp', params);
      const stGas = _steigung('gas', params);
      const pWP  = _energiepreis('wp', input, params) / 100;
      const pGas = _energiepreis('gas', input, params) / 100;
      energieT = verbWP * pWP * Math.pow(1 + stWP, t - 1)
               + verbGas * pGas * Math.pow(1 + stGas, t - 1);
    } else {
      const verbEff = berechneVerbrauchEffektiv(option, input, params);
      const preis0  = _energiepreis(option, input, params) / 100;
      const steig   = _steigung(option, params);
      energieT = verbEff * preis0 * Math.pow(1 + steig, t - 1);
    }
    const co2T = _co2KostenProJahr(option, input);  // statisch (Mittelwert)
    let cf = -energieT - wartProJahr - co2T;
    if (t === 1) {
      cf += -investMehr + foerderung;
    }
    jaehrlich[t]  = cf;
    kumuliert[t]  = kumuliert[t - 1] + cf;
  }
  return { jaehrlich, kumuliert };
}

function berechneCashflowAlleOptionen(input, params) {
  return {
    gas:     berechneCashflowKurve('gas',     input, params),
    hybrid:  berechneCashflowKurve('hybrid',  input, params),
    wp:      berechneCashflowKurve('wp',      input, params),
    fw:      berechneCashflowKurve('fw',      input, params),
    pellets: berechneCashflowKurve('pellets', input, params)
  };
}

/* --------------------------------------------------------------
   12) Amortisation
   -------------------------------------------------------------- */

function berechneAmortisation(option, input, params, vergleich) {
  vergleich = vergleich || 'gas';
  // Status quo (Gas) amortisiert nichts; Vergleich mit sich selbst ebenso wenig.
  if (option === 'gas' || option === vergleich) return 0;
  const T = input.zeitraum || 25;
  const cfBasis  = berechneCashflowKurve(vergleich, input, params);
  const cfOption = berechneCashflowKurve(option,    input, params);
  for (let t = 1; t <= T; t++) {
    if (cfOption.kumuliert[t] >= cfBasis.kumuliert[t]) return t;
  }
  return null;
}

/* --------------------------------------------------------------
   13) Vermieter-Bilanz (Spec §5)
   -------------------------------------------------------------- */

function berechneVermieterCashflowProJahr(option, input, params) {
  const wirksam = wirksamVM(input);
  const leer = {
    posten: { mod559: 0, mietspiegel: 0, co2: 0, mieterstrom: 0,
              wartung_diff: 0, mietausfall: 0, bauprozess: 0 },
    sigma: 0
  };
  if (option === 'pellets' && !pelletsPlausibel(input, params)) {
    return { ...leer, pelletsAusgeschlossen: true };
  }
  if (!wirksam) return leer;

  const v = _p(params, 'block6_vermieter') || {};
  const def = _gebaeudedefaults(input, params);
  const T = input.zeitraum || 25;
  const investMehr  = berechneInvestition(option, input, params);
  const foerderung  = berechneFoerderBetrag(option, input, params);
  const investNetto = Math.max(0, investMehr - foerderung);

  // Posten 1: §559 Modernisierungs-Umlage (8 % p.a. × max 12 J, gemittelt auf T)
  const bgb     = (v.BGB559Korr  && v.BGB559Korr.default)  ?? 0.08;
  const dauer   = (v.Dauer559    && v.Dauer559.default)    ?? 12;
  const hf      = (v.Hf559       && v.Hf559.default)       ?? 0.10;
  const annual559  = bgb * investNetto * (1 - hf);
  const wirksam559 = Math.min(dauer, T);
  const mod559     = (annual559 * wirksam559) / T;

  // Posten 2: Mietspiegel-Klassen-Sprung
  const klassenSprung   = (v.KlassenSprung && v.KlassenSprung.default) ?? 1;
  const mietspiegelEff  = (v.MietspiegelEff && v.MietspiegelEff.default) ?? 0.30;
  const mietspiegel     = (option === 'gas')
    ? 0
    : mietspiegelEff * (input.wohnflaeche || def.Wohnflaeche || 0) * 12 * klassenSprung;

  // Posten 3: CO₂-Verschiebung (Status quo Gas trägt; Modernisierung erspart)
  const co2GasJahr = _co2KostenProJahr('gas', input);
  const co2OptJahr = _co2KostenProJahr(option, input);
  const co2 = (option === 'gas') ? -co2GasJahr : (co2GasJahr - co2OptJahr);

  // Posten 4: Mieterstrom-Erlös (bei PV aktiv, nur WP/Hybrid)
  let mieterstrom = 0;
  if (input.pv && (option === 'wp' || option === 'hybrid')) {
    const pvKWp     = def.PV_kWp || 0;
    const anteil    = def.MieterstromAnteil || 0;
    const ertragSpez = 950;     // kWh/kWp·a (Default Thüringen)
    const margePV    = 0.08;    // €/kWh
    mieterstrom = pvKWp * ertragSpez * anteil * margePV;
  }

  // Posten 5: Wartungs-Kosten-Differenz vs. Status quo
  const wartGas    = _wartungsAnnuitaet('gas',  input, params);
  const wartOption = _wartungsAnnuitaet(option, input, params);
  const wartung_diff = wartOption - wartGas;

  // Posten 6: Mietausfall durch Heizkostenanstieg (nur Status quo)
  const mietausfQ = (v.MietausfQ && v.MietausfQ.default) ?? 0.03;
  const kaltMiete = def.KaltMiete || 0;
  const mieteJahr = kaltMiete * (input.wohnflaeche || def.Wohnflaeche || 0) * 12;
  const mietausfall = (option === 'gas') ? mietausfQ * mieteJahr : 0;

  // Posten 7: Bauprozess-Mietminderung (nur Modernisierung, gemittelt auf T)
  const bauMM = (v.BauMM && v.BauMM.default) ?? 0.10;
  const bauprozess = (option === 'gas') ? 0 : (bauMM * mieteJahr) / T;

  // Σ — positiv = Vermieter-Vorteil
  const sigma = mod559 + mietspiegel + co2 + mieterstrom
              - wartung_diff - mietausfall - bauprozess;

  return {
    posten: { mod559, mietspiegel, co2, mieterstrom,
              wartung_diff, mietausfall, bauprozess },
    sigma
  };
}

function berechneVermoegensbilanz(option, input, params) {
  const v = _p(params, 'block6_vermieter') || {};
  const def = _gebaeudedefaults(input, params);
  const T = input.zeitraum || 25;
  const investMehr = berechneInvestition(option, input, params);
  const foerderung = berechneFoerderBetrag(option, input, params);
  const verkehrswert = (input.overrides && input.overrides.verkehrswert)
                      || def.Verkehrswert || 0;

  if (option === 'gas') {
    const epbdAbschlag = (v.EPBDAbschlag && v.EPBDAbschlag.default) ?? 0.07;
    const epbd = -epbdAbschlag * verkehrswert;
    const cf = berechneVermieterCashflowProJahr('gas', input, params);
    const co2_25 = cf.posten.co2 * T;
    const ersatzinvest = -(_wartungsBasis('gas', input, params));  // Heizung am Ende ersetzen
    const sigma = epbd + co2_25 + ersatzinvest;
    return {
      posten: {
        bruttoInvest: 0, bafaZuschuss: 0, kfwZuschuss: 0, afa7b: 0,
        wegfallErsatz: ersatzinvest, sigma559: 0,
        co2: co2_25, mieterstrom: 0, marktPremium: 0,
        epbdRisiko: epbd
      },
      sigma
    };
  }

  const bruttoInvest = -investMehr;
  const bafaZuschuss = +foerderung;

  const kfwQuote     = (v.KfWZuschuss && v.KfWZuschuss.default) ?? 0.20;
  const restkredit   = Math.max(0, investMehr - foerderung);
  const kfwZuschuss  = +kfwQuote * restkredit;

  const afaQuote = (v.AfA7b      && v.AfA7b.default)      ?? 0.05;
  const afaDauer = (v.AfA7bDauer && v.AfA7bDauer.default) ?? 4;
  const steuerSatzAnnahme = 0.30;
  const afa7b = +afaQuote * afaDauer * investMehr * steuerSatzAnnahme;

  const cf = berechneVermieterCashflowProJahr(option, input, params);
  const sigma559       = +cf.posten.mod559 * T;
  const co2_25         = +cf.posten.co2 * T;
  const mieterstrom_25 = +cf.posten.mieterstrom * T;

  const marktDB = (v.MarktDB && v.MarktDB.default) ?? 0.14;
  const marktPremium = +marktDB * verkehrswert;

  const sigma = bruttoInvest + bafaZuschuss + kfwZuschuss + afa7b
              + sigma559 + co2_25 + mieterstrom_25 + marktPremium;

  return {
    posten: {
      bruttoInvest, bafaZuschuss, kfwZuschuss, afa7b,
      wegfallErsatz: 0,
      sigma559, co2: co2_25, mieterstrom: mieterstrom_25,
      marktPremium,
      epbdRisiko: 0
    },
    sigma
  };
}

function berechneRisikoUebersicht() {
  return [
    { aspekt: 'CO₂-Preis-Eskalation 2027 ff.',          gas: 'rot',   mod: 'gruen' },
    { aspekt: 'EPBD-Konformitäts-Risiko 2028',           gas: 'rot',   mod: 'gruen' },
    { aspekt: 'Mietspiegel-Argumentations-Lücke',        gas: 'gelb',  mod: 'gruen' },
    { aspekt: 'Mieter-Akzeptanz Mieterhöhung',           gas: 'gruen', mod: 'gelb' },
    { aspekt: 'Förder-Streichung (politisches Risiko)',  gas: 'gruen', mod: 'gelb' },
    { aspekt: 'Bauprozess-Risiko (1 J Mietminderung)',   gas: 'gruen', mod: 'gelb' },
    { aspekt: 'Technologie-Risiko WP (JAZ-Realität)',    gas: 'gruen', mod: 'gelb' },
    { aspekt: 'Energiepreis-Volatilität (Status quo)',   gas: 'rot',   mod: 'gruen' },
    { aspekt: 'Vermarktungs-Risiko Mietausfall',         gas: 'gelb',  mod: 'gruen' }
  ];
}

function berechneSensitivitaet(szenario, input, params) {
  const refOption = 'wp';
  const baseline = berechneVermoegensbilanz(refOption, input, params).sigma;

  const klon = JSON.parse(JSON.stringify(input));
  switch (szenario) {
    case 'bafa-gestrichen':
      klon.foerderung = { grund: false, klima: false, einkommen: false, effizienz: false, master: 0 };
      break;
    case 'co2-schneller':
      klon.overrides = klon.overrides || {};
      klon.overrides.co2Pfad = 'beschleunigung';
      break;
    case 'gas-plus5pp':
      klon.preis = klon.preis || {};
      klon.preis.gas = (klon.preis.gas || 10.5) * 1.05;
      break;
    case 'epbd-10':
      // Stub: würde EPBD-Abschlag von 7 % auf 10 % erhöhen — params-Mutation
      // vermieden, daher pragmatischer Multiplikator unten.
      break;
    case 'paragraf559-haertefall':
      // Härtefall reduziert Modernisierungs-Umlage um 30 %
      break;
    case 'mietspiegel-halb':
      // Mietspiegel-Effekt halbieren
      break;
  }

  let neu = berechneVermoegensbilanz(refOption, klon, params).sigma;
  if (szenario === 'paragraf559-haertefall') {
    const cf = berechneVermieterCashflowProJahr(refOption, input, params);
    neu = neu - 0.30 * Math.abs(cf.posten.mod559) * (input.zeitraum || 25);
  }
  if (szenario === 'mietspiegel-halb') {
    const cf = berechneVermieterCashflowProJahr(refOption, input, params);
    neu = neu - 0.50 * Math.abs(cf.posten.mietspiegel) * (input.zeitraum || 25);
  }
  if (szenario === 'epbd-10') {
    const v = _p(params, 'block6_vermieter') || {};
    const epbdAlt = (v.EPBDAbschlag && v.EPBDAbschlag.default) ?? 0.07;
    const def = _gebaeudedefaults(input, params);
    const verkehrswert = def.Verkehrswert || 0;
    neu = neu - (0.10 - epbdAlt) * verkehrswert;
  }

  return neu - baseline;
}

/* --------------------------------------------------------------
   14) Empfehlung
   -------------------------------------------------------------- */

const PERSONA_GEWICHTUNG = {
  bewahrer:   { tco: 0.60, cf: 0.10, fq: 0.30 },
  optimierer: { tco: 0.50, cf: 0.30, fq: 0.20 },
  wechsler:   { tco: 0.20, cf: 0.40, fq: 0.40 }
};

function _normalize(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  if (span < 1e-9) return values.map(() => 0.5);
  return values.map(v => (v - min) / span);
}

function berechneEmpfehlung(input, params) {
  const optionen = ['gas', 'hybrid', 'wp', 'fw', 'pellets'];
  const persona = input.persona || 'optimierer';
  const w = PERSONA_GEWICHTUNG[persona] || PERSONA_GEWICHTUNG.optimierer;

  const tcoAlle = berechneTCOAlleOptionen(input, params);
  const cfAlle  = berechneCashflowAlleOptionen(input, params);

  const pelletsOK = pelletsPlausibel(input, params);
  const fwSperre = fwSatzungAktiv(input);

  // Pellets bei !pelletsPlausibel raus — technisch unsinnig (Excel-Filter).
  // Hybrid bei FW-Satzung BLEIBT drin: Befreiungswege nach §6 Erfurter
  // Fernwärmesatzung sind real, Nutzer entscheidet — Banner-Hinweis dazu.
  const aktive = optionen.filter(o => {
    if (o === 'pellets' && !pelletsOK) return false;
    // Modernisierungs-Optionen ohne eingetragene Investition (0 €) sind nicht
    // Teil des Vergleichs — sie dürfen die Empfehlung nicht gewinnen. Gas bleibt
    // als Status-quo-Anker immer drin.
    if (o !== 'gas' && berechneInvestition(o, input, params) <= 0) return false;
    return true;
  });

  const tcoArr = aktive.map(o => -tcoAlle[o].tco);  // niedrige TCO besser
  // Cashflow-Achse: Jahr 5 als "stationärer Cashflow", löst den Investitions-
  // Sprung in Jahr 1 auf. Folgeaufgabe Spec §3.6 v1.2: Methodik klarer als
  // "Jährliche Energiekosten heute" formulieren.
  const cf1Arr = aktive.map(o => cfAlle[o].jaehrlich[5]);
  const fqArr  = aktive.map(o => berechneFoerderBetrag(o, input, params)
                                 / Math.max(1, berechneInvestition(o, input, params)));

  const tcoNorm = _normalize(tcoArr);
  const cfNorm  = _normalize(cf1Arr);
  const fqNorm  = fqArr.map(v => v / 0.70);

  const scores = aktive.map((o, i) => ({
    option: o,
    score: w.tco * tcoNorm[i] + w.cf * cfNorm[i] + w.fq * fqNorm[i]
  }));
  scores.sort((a, b) => b.score - a.score);

  const sortiert = scores.map(s => s.option);
  const beste = sortiert[0];
  const zweitbeste = sortiert[1];

  const spread = (scores[0]?.score ?? 0) - (scores[1]?.score ?? 0);
  let abstandKlassen = 'mittel';
  if (spread > 0.20) abstandKlassen = 'klar';
  else if (spread < 0.05) abstandKlassen = 'eng';

  return {
    beste, zweitbeste, sortiert, abstandKlassen,
    pelletsAusgeschlossen: !pelletsOK,
    fwSperre
  };
}

/* --------------------------------------------------------------
   15) Format-Helper
   -------------------------------------------------------------- */

function formatEuro(n) {
  if (n == null || isNaN(n)) return '—';
  const sign = n < 0 ? '−' : '';
  const abs = Math.round(Math.abs(n));
  return sign + abs.toLocaleString('de-DE') + ' €';
}

function formatProzent(n, digits) {
  if (n == null || isNaN(n)) return '—';
  return (n * 100).toFixed(digits ?? 0).replace('.', ',') + ' %';
}

function formatJahre(n) {
  if (n == null) return 'nicht erreicht';
  return n + ' Jahre';
}

/* --------------------------------------------------------------
   16) Methodik-Tooltip-Inhalte (Spec §4.6 / §9)
   -------------------------------------------------------------- */

const methodikInhalte = {
  'formel-tco': {
    titel: 'TCO 25 Jahre (Barwert nach VDI 2067)',
    formel: 'TCO = (Kapital + Verbrauch + Wartung + CO₂)-Annuität × n\n' +
            '   Annuitätenfaktor a = 0,05743 (i = 3 %, n = 25)\n' +
            '   Barwertfaktor b je Energieträger\n' +
            '   Kapital_A = (Mehrinvest − Förderung) × a\n' +
            '   Verbrauch_A = Energiekosten × b × a\n' +
            '   Wartung_A = Brutto-Invest × Wartungsquote\n' +
            '   CO₂_A = CO₂-Kosten × b × a',
    annahmen: [
      'Wohnfläche und Verbrauch aus deinen Eingaben',
      'Kalkzins 3 % (VDI 2067)',
      'Energiepreis-Steigerung pro Jahr (optionsspezifisch)',
      'Modernisierungs-Mehrinvest gegenüber Status quo Gas',
      'Förderung gecappt bei 21.000 € absolut'
    ],
    quellen: ['Q-VDI-2067', 'Q-BAFA-2026', 'Q-BDEW-2026'],
    steigerung: 'Tiefer rechnen, eigene Sensitivitäten? → Excel-Edition'
  },
  'formel-eurqm': {
    titel: '€/m²/Monat',
    formel: '€/m²/Monat = TCO 25 J ÷ Wohnfläche ÷ (Zeitraum × 12)',
    annahmen: ['Anschauliche Vergleichsgröße zwischen EFH und MFH'],
    quellen: [],
    steigerung: ''
  },
  'formel-amortisation': {
    titel: 'Amortisation gegen Status quo',
    formel: 't_Amort = min { t : kumCashflow[Option, t] ≥ kumCashflow[Gas, t] }',
    annahmen: ['Vergleich gegen Beibehaltung der bestehenden Gas-Heizung',
               'Nominale Cashflows, kumuliert über die Jahre'],
    quellen: [],
    steigerung: 'Bei „nicht erreicht": → Excel-Edition für längere Horizonte'
  },
  'formel-foerderung': {
    titel: 'Förder-Quote',
    formel: 'Quote = min(BAFA-Grund + Klima(t) + Eink + Eff, 70 %)\n' +
            'Betrag = min(Mehrinvest × Quote, 21.000 €)',
    annahmen: [
      'BAFA-Grundförderung 30 % (Mai 2026)',
      'Klimabonus 20 % bis 2028, ab 2029 17 %, ab 2031 14 %',
      'Einkommensbonus nur bei Selbstnutzung & zvE ≤ 40k',
      'Effizienzbonus nur für besonders effiziente WP',
      'Förderung wirkt auf den Modernisierungs-Mehrinvest, nicht auf den Brutto-Wert'
    ],
    quellen: ['Q-BAFA-2026'],
    steigerung: 'Sinkpfad-Detail + KfW-Kombi → Excel-Edition'
  },
  'formel-cashflow': {
    titel: '25-Jahres-Cashflow-Kurve',
    formel: 'Cashflow[t] = −Energie[t] − Wartung − CO₂[t] (jedes Jahr)\n' +
            '  + (−Mehrinvest + Förderung) (nur Jahr 1)\n' +
            'Kumuliert: Σ über t. Endwert ≠ TCO Barwert (nominale Sicht).',
    annahmen: ['Negativ = Geld geht raus', 'Optionsspezifische Energiepreis-Steigerung'],
    quellen: ['Q-VDI-2067'],
    steigerung: ''
  },
  'formel-vermieter-cashflow': {
    titel: 'Vermieter-Cashflow pro Jahr (gemittelt 25 J)',
    formel: 'Σ = §559-Umlage + Mietspiegel-Aufschlag + CO₂-Vermeidung\n' +
            '    + Mieterstrom-Erlös − Wartungs-Mehrkosten\n' +
            '    − Mietausfall − Bauprozess-Minderung',
    annahmen: [
      '§559 BGB: 8 % p.a. × Modernisierungs-Investition über max. 12 Jahre',
      'Mietspiegel-Effekt 0,30 €/m²·Monat pro Klassen-Sprung',
      'CO₂-Pfad: 105 €/t Mittel (aktuell)'
    ],
    quellen: ['Q-BGB-559', 'Q-MIETSPIEGEL', 'Q-CO2-01'],
    steigerung: 'Klassen-Sprung-Lookup, Härtefall-Detail → Excel-Edition'
  },
  'formel-vermieter-vermoegen': {
    titel: 'Vermögensbilanz 25 Jahre',
    formel: 'Σ = −Mehrinvest + BAFA + KfW-Anteil + §7b-Steuereffekt\n' +
            '    + Σ §559 (25 J) + Σ CO₂-Vermeidung + Σ Mieterstrom\n' +
            '    + Marktwert-Premium D→B',
    annahmen: [
      '§7b EStG: 5 % × 4 Jahre × Mehrinvest × 30 % Steuersatz (Web-Annahme)',
      'Marktwert-Premium D→B 14 % vom Verkehrswert',
      'EPBD-Risiko (Status quo) 7 % Verkehrswert-Abschlag'
    ],
    quellen: ['Q-AFA-7B', 'Q-IMMO-DB', 'Q-EPBD'],
    steigerung: 'Persönlicher Steuersatz, AfA-Wechselwirkung → Excel + Steuerberater'
  },
  'formel-mietspiegel': {
    titel: '§559 Mietspiegel-Effekt',
    formel: 'Aufschlag = 0,30 €/m² × Wohnfläche × 12 × Klassen-Sprung',
    annahmen: ['Web-Vereinfachung: 1 Klassen-Sprung'],
    quellen: ['Q-MIETSPIEGEL'],
    steigerung: 'Klassen-Lookup nach Mietspiegel-Kategorie → Excel-Edition'
  },
  'formel-co2': {
    titel: 'CO₂-Verschiebung',
    formel: 'CO₂-Kosten = Verbrauch × Emissionsfaktor × CO₂-Preis (Mittel)\n' +
            'Pfad-Werte: stagnation 55 / aktuell 105 / beschleunigung 125 €/t',
    annahmen: [
      'Emissionsfaktoren: Gas 0,196 / Hybrid 0,059 / WP 0 / FW 0,242 / Pellets 0,023 kg/kWh',
      'Statische €/t-Werte (KEINE Steigerungs-Pfade)'
    ],
    quellen: ['Q-CO2-01', 'Q-CO2-02'],
    steigerung: ''
  },
  'formel-eigener-preis': {
    titel: 'Eigener Energiepreis',
    formel: 'Cashflow nutzt deinen Preis statt Marktdurchschnitt',
    annahmen: ['Wirkt auf den jeweiligen Energieträger im Cashflow-Pfad'],
    quellen: [],
    steigerung: ''
  },
  'formel-jaz': {
    titel: 'JAZ Wärmepumpe',
    formel: 'Verbrauch_eff WP = Verbrauch / JAZ',
    annahmen: ['Ziehe vom Hersteller-Wert ~0,3 ab — reale JAZ liegt darunter'],
    quellen: ['Q-JAZ-01'],
    steigerung: ''
  }
};

/* --------------------------------------------------------------
   17) Verifikations-Funktion gegen Spec §3.7 v1.1
   -------------------------------------------------------------- */

function _testInputMFHDefault(params) {
  const def = _p(params, 'block5_gebaeudedefaults', 'MFH') || {};
  return {
    plz: '99084', ort: 'Erfurt',
    gebaeudetyp: 'MFH',
    eigentuemerTyp: 'WEG',
    wohnflaeche: 908,           // Excel-Bezugs-Wohnfläche (Tab Rechenlogik §7)
    we: def.WE || 14,
    wohneinheiten: 14,
    heizung: 'gas-bw', baujahr: 1998,
    verbrauch: def.Verbrauch || 95000,
    sanierung: 'teilsaniert',
    nutzungsart: 'mischnutzung',
    persona: 'optimierer',
    pv: true,
    lage: 'innenstadt',
    heizlast: def.Heizlast || 65,
    zeitraum: 25,
    preis: {
      gas: _default(params, 'block1_energiepreise', 'PreisGas'),
      fw:  _default(params, 'block1_energiepreise', 'PreisFW'),
      wp:  _default(params, 'block1_energiepreise', 'PreisWP')
    },
    foerderung: { grund: true, klima: true, einkommen: false, effizienz: false, master: 50 },
    overrides: { eigenerPreis: {}, jaz: null, co2Pfad: 'aktuell', verkehrswert: null },
    // C2 v2.1 — Bruttoinvest = Wizard-Default für MFH (Spec §3)
    bruttoInvest: { hybrid: 73000, wp: 126000, fw: 33000, pellets: 63000 },
    eigeneWohnflaeche: null
  };
}

// v2.1-Soll-Werte: differieren von v1.1 (§3.7 alte Spec) durch
// Memory-Wartungsquoten-Update (Memory project_excel_reparatur_
// wartung_modell.md ist authoritative Quelle).
// Wartungsquoten heizungs-spezifisch: Gas-BW 2 %, Hybrid 3,5 %,
// WP 1,5 %, FW 1 %, Pellets 3 %. JSON-Werte werden im nächsten
// Excel-Patch v2.1 nachgezogen.
// Stand 29.06.2026: Defaults auf brutto umgestellt (Gas 10,2 / FW 19,3 / WP 25).
// Folge: im Default-Testfall (908 m²/14 WE) kippt die beste Option von Hybrid auf WP,
// weil der korrekte Brutto-Gaspreis den Gas-Anteil des Hybrids verteuert (WP-Preis unverändert).
const VERIFIKATIONS_SOLL = {
  tco_25j: { gas: 449866, hybrid: 407651, wp: 403565, fw: 845834, pellets: 358121 },
  eurQm:   { gas: 1.65,   hybrid: 1.50,    wp: 1.48,   fw: 3.11,    pellets: 1.31 },
  besteOption: 'wp',
  // Override-Test: Bruttoinvest WP 100k → erwartete TCO ~356 T€ (WP-Preis unverändert)
  override_wp_100k: 356487,
  toleranzProz: 2  // ± 2 %
};

function runVerifikation(params) {
  if (!params) {
    console.warn('[Verifikation] Keine params — übersprungen.');
    return null;
  }
  const input = _testInputMFHDefault(params);
  const tco = berechneTCOAlleOptionen(input, params);
  const empfehlung = berechneEmpfehlung(input, params);

  const rows = [];
  const tol = VERIFIKATIONS_SOLL.toleranzProz / 100;
  let alleInTol = true;

  for (const opt of ['gas', 'hybrid', 'wp', 'fw', 'pellets']) {
    const sollTCO = VERIFIKATIONS_SOLL.tco_25j[opt];
    const istTCO  = tco[opt].tco;
    const diffTCO = (istTCO - sollTCO) / sollTCO;
    const inTolTCO = Math.abs(diffTCO) <= tol;
    if (!inTolTCO) alleInTol = false;

    const sollEqm = VERIFIKATIONS_SOLL.eurQm[opt];
    const istEqm  = berechneEurProQmMonat(istTCO, input.wohnflaeche, input.zeitraum);
    const diffEqm = (istEqm - sollEqm) / sollEqm;

    rows.push({
      Option: opt.toUpperCase(),
      'TCO Soll':  formatEuro(sollTCO),
      'TCO Ist':   formatEuro(istTCO),
      'TCO Diff%': (diffTCO * 100).toFixed(2) + ' %',
      'TCO ✓':     inTolTCO ? '✓' : '✗',
      '€/m² Soll': sollEqm.toFixed(2),
      '€/m² Ist':  istEqm.toFixed(2),
      '€/m² Diff%': (diffEqm * 100).toFixed(2) + ' %'
    });
  }

  const besteOK = empfehlung.beste === VERIFIKATIONS_SOLL.besteOption;
  if (!besteOK) alleInTol = false;

  console.group('%c[Verifikation §3.7 v1.1 — VDI 2067 Annuität]',
                'color:#1a5c5a;font-weight:bold');
  console.table(rows);
  console.log('Beste Option: Soll =', VERIFIKATIONS_SOLL.besteOption,
              '| Ist =', empfehlung.beste,
              besteOK ? '✓' : '✗');
  console.log('Komponenten WP:', tco.wp.komponenten);
  console.log('Komponenten Gas:', tco.gas.komponenten);
  console.log('Komponenten Hybrid:', tco.hybrid.komponenten);
  if (alleInTol) {
    console.info('[Verifikation] Alle Werte innerhalb ± 2 %. ✓');
  } else {
    console.warn('[Verifikation] Außerhalb ± 2 %. Komponenten oben prüfen.');
  }
  console.groupEnd();

  // === C2 v2.1 — Erweiterte Verifikations-Tests (Daniel-Vorgabe 05.05.) ===
  console.group('%c[Verifikation v2.1 — Override-Test, Mieter-NK, Big Picture]',
                'color:#1a5c5a;font-weight:bold');

  // 1c) Bruttoinvest-Override-Test: WP von 126k auf 100k
  const inputOverride = _testInputMFHDefault(params);
  inputOverride.bruttoInvest = { ...inputOverride.bruttoInvest, wp: 100000 };
  const tcoOverride = berechneTCO('wp', inputOverride, params);
  const overrideSoll = VERIFIKATIONS_SOLL.override_wp_100k;
  const overrideDiff = (tcoOverride.tco - overrideSoll) / overrideSoll;
  const overrideOK = Math.abs(overrideDiff) <= tol;
  console.log('1c) WP-Override 100k → TCO Barwert:', formatEuro(tcoOverride.tco),
              '| Soll: ' + formatEuro(overrideSoll),
              '| Diff: ' + (overrideDiff * 100).toFixed(2) + ' %',
              overrideOK ? '✓' : '✗');
  console.log('   Komponenten:', tcoOverride.komponenten);

  // 1b) Mieter-Nebenkosten-Effekt MFH-Default (eigene Wohnung leer → Anteil 1/14)
  const mieterGas = berechneMieterNebenkostenEffekt('gas', input, params);
  const mieterWP  = berechneMieterNebenkostenEffekt('wp',  input, params);
  console.log('1b) Mieter-Nebenkosten-Effekt MFH-Default (Anteil 1/14 = 7,14 %):');
  console.log('     Gas:', formatEuro(mieterGas.effektProMonat), '/ Monat (Soll: 0 €)');
  console.log('     WP: ', formatEuro(mieterWP.effektProMonat),
              '/ Monat (Soll: ~5–8 € Entlastung; positiver Wert = Entlastung)',
              '| Anteil =', mieterWP.anteil.toFixed(4),
              '| Δ Energie =', formatEuro(mieterWP.deltaEnergie),
              '| Δ CO₂ =', formatEuro(mieterWP.deltaCO2));

  // Big-Picture-Wirtschaftlichkeit (TCO-basiert jetzt)
  const bp = berechneBigPictureAchsen(input, params);
  console.log('Big Picture Wirtschaftlichkeits-Achse (TCO-basiert):');
  for (const o of ['gas', 'hybrid', 'wp', 'fw', 'pellets']) {
    console.log('   ', o.padEnd(8), 'wirtsch =', String(bp[o].wirtschaftlichkeit).padStart(3),
                '| nachhal =', String(bp[o].nachhaltigkeit).padStart(3),
                '| risiko-roh =', String(bp[o].risikoRoh).padStart(3),
                '| plausibel =', bp[o].plausibel);
  }
  console.log('   Soll Daniel: WP 80–95, Hybrid knapp drüber, FW 30–40, Gas 60–70');

  console.groupEnd();

  return { rows, alleInTol, tco, empfehlung,
           overrideTest: { tcoWP100k: tcoOverride.tco, komponenten: tcoOverride.komponenten },
           mieterTest: { gas: mieterGas, wp: mieterWP },
           bigPicture: bp };
}

/* --------------------------------------------------------------
   18) Adapter rechner.html-State → Spec-§13-State
   -------------------------------------------------------------- */

function buildInput(uiState, params) {
  const sb = (uiState.overrides && uiState.overrides.schieberegler) || {};
  const fb = sb.foerderung || {};
  const profi = (uiState.overrides && uiState.overrides.profi) || {};
  const def = _p(params, 'block5_gebaeudedefaults', uiState.gebaeudetyp) || {};

  const lage = altstadtPLZ(uiState.plz) ? 'innenstadt' : 'aussen';

  const heizlast = uiState.heizlast
                   ?? (uiState.wohnflaeche
                       ? Math.round(uiState.wohnflaeche * (HEIZLAST_FAKTOR[uiState.sanierung] ?? 0.08))
                       : (def.Heizlast || 0));

  return {
    plz: uiState.plz,
    ort: uiState.ort,
    gebaeudetyp: uiState.gebaeudetyp,
    eigentuemerTyp: uiState.eigentuemerTyp,
    wohnflaeche: uiState.wohnflaeche,
    // WE aus User-Eingabe (Spec-Befund 2): vorher fix def.WE → Sonderumlage/Rücklage
    // rechneten immer mit 14 statt der eingegebenen Wohneinheiten.
    we: uiState.wohneinheiten ?? def.WE ?? (uiState.gebaeudetyp === 'MFH' ? 14 : 1),
    heizung: uiState.heizung,
    baujahr: uiState.baujahr,
    verbrauch: uiState.verbrauchUnknown
               ? (def.Verbrauch || 0)
               : uiState.verbrauch,
    sanierung: uiState.sanierung,
    nutzungsart: uiState.nutzungsart,
    persona: uiState.persona,
    pv: uiState.pv,
    lage,
    heizlast,
    zeitraum: sb.zeitraum || 25,
    preis: { gas: sb.preisGas, fw: sb.preisFW, wp: sb.preisWP },
    foerderung: {
      grund:     fb.grund,
      klima:     fb.klima,
      einkommen: fb.einkommen,
      effizienz: fb.effizienz,
      master:    fb.master
    },
    anschlusszwang: !!uiState.anschlusszwang,
    befreiung:      !!uiState.befreiung,
    profimodus: !!uiState.profimode,
    overrides: {
      eigenerPreis: profi.eigenerPreis || {},
      jaz:          profi.jaz ?? null,
      co2Pfad:      profi.co2Pfad || 'aktuell',
      verkehrswert: profi.verkehrswert ?? null
    },
    // C2 v2.0 — Wizard-Erweiterungen (Spec §3)
    jahreskostenIst:        uiState.jahreskostenIst        ?? null,
    eigenerPreisAktuell:    uiState.eigenerPreisAktuell    ?? null,
    letzteSanierung:        uiState.letzteSanierung        ?? null,
    sanierungsHorizont:     uiState.sanierungsHorizont     ?? 10,
    jaehrlReparaturen:      uiState.jaehrlReparaturen      ?? null,
    jaehrlSanierungsInvest: uiState.jaehrlSanierungsInvest ?? 0,
    ruecklageProWEMonat:    uiState.ruecklageProWEMonat    ?? 0,
    // C2 v2.1 — Wizard-Erweiterungen (Spec §3 Schritt 1+3)
    eigeneWohnflaeche:      uiState.eigeneWohnflaeche      ?? null,
    wohneinheiten:          uiState.wohneinheiten          ?? (uiState.gebaeudetyp === 'MFH' ? 14 : 1),
    bruttoInvest:           uiState.bruttoInvest           || _bruttoInvestDefaults(uiState.gebaeudetyp)
  };
}

// Wizard-Defaults für Bruttoinvestition (Spec §3 v2.1, Daniel-Bestätigung 05.05.):
// MFH 73/126/33/63 k€, EFH 24/28/18/32 k€ (sind Modernisierungs-Brutto, NICHT Mehrinvest)
function _bruttoInvestDefaults(gebaeudetyp) {
  if (gebaeudetyp === 'EFH') {
    return { hybrid: 24000, wp: 28000, fw: 18000, pellets: 32000 };
  }
  return { hybrid: 73000, wp: 126000, fw: 33000, pellets: 63000 };
}

/* --------------------------------------------------------------
   19) C2 v2.0 — Dashboard-Kennzahlen (Excel-Tab Dashboard)
   --------------------------------------------------------------
   Liefert pro Heizoption alle Excel-Dashboard-Zeilen als Objekt.
   Nutzt bestehende Berechnungs-Funktionen (TCO Annuität, VDI 2067)
   ohne sie zu verändern. Werte sind ± 2 % zur Excel.

   TCO Statisch (tcoStatisch): pragmatische Definition Σ (Energie_t +
   Wartung + CO₂_t) für t=1..n + Mehrinvest − Förderung mit Energie-
   Steigerung, aber ohne Diskontierung.
   ⚠ Daniel-Verifikation 03.05.2026 nach Schritt 3: Werte liegen
   −7 bis +4 % zur Excel-Klammer (380k Gas / 388k Hybrid / 404k WP /
   816k FW / 377k Pellets). Excel-Methodik nicht eindeutig
   rekonstruierbar. Dashboard zeigt vorerst nur TCO Barwert als Leit-
   variante. Statisch-Wert wird hier dennoch berechnet und im API
   bereitgestellt — für die Spalte-Wieder-Aktivierung sobald Excel-
   Methodik geklärt ist.
   Folgeaufgabe v2.1: Excel-Tab Rechenlogik §6 Statisch-Methodik
   entschlüsseln, dann Spalte in ergebnis.js wieder einbauen.
*/

function _berechneJahreskostenJ1(option, input, params) {
  // Energie + Wartung + CO₂ in Jahr 1 (für Dashboard "Jahreskosten heute")
  const verbEff = berechneVerbrauchEffektiv(option, input, params);
  const preis0  = (option === 'hybrid')
    ? null  // Hybrid wird unten getrennt aufgeschlüsselt
    : _energiepreis(option, input, params) / 100;

  let energieJ1;
  if (option === 'hybrid') {
    const tech = _p(params, 'block3_technik') || {};
    const hybridAnteilWP = tech.HybridAnteilWP ? tech.HybridAnteilWP.default : 0.7;
    const v = input.verbrauch || 0;
    const jaz = (input.overrides && input.overrides.jaz) || (tech.JAZ ? tech.JAZ.default : 3.8);
    const wgGas = tech.WGGasBW ? tech.WGGasBW.default : 0.96;
    const verbWP  = hybridAnteilWP * v / jaz;
    const verbGas = (1 - hybridAnteilWP) * v / wgGas;
    const pWP  = _energiepreis('wp', input, params) / 100;
    const pGas = _energiepreis('gas', input, params) / 100;
    energieJ1 = verbWP * pWP + verbGas * pGas;
  } else {
    energieJ1 = verbEff * preis0;
  }
  const wartung = _wartungsBasis(option, input, params) * _wartungsquote(option, params);
  const co2 = _co2KostenProJahr(option, input);
  return energieJ1 + wartung + co2;
}

function _berechneTCOStatisch(option, input, params) {
  // Σ aller Komponenten nominal (mit Steigerung, ohne Diskontierung)
  const T = input.zeitraum || 25;
  const investMehr = berechneInvestition(option, input, params);
  const foerderung = berechneFoerderBetrag(option, input, params);
  const verbEff = berechneVerbrauchEffektiv(option, input, params);
  const wartung = _wartungsBasis(option, input, params) * _wartungsquote(option, params);
  const co2 = _co2KostenProJahr(option, input);

  let energieSum = 0;
  if (option === 'hybrid') {
    const tech = _p(params, 'block3_technik') || {};
    const hybridAnteilWP = tech.HybridAnteilWP ? tech.HybridAnteilWP.default : 0.7;
    const v = input.verbrauch || 0;
    const jaz = (input.overrides && input.overrides.jaz) || (tech.JAZ ? tech.JAZ.default : 3.8);
    const wgGas = tech.WGGasBW ? tech.WGGasBW.default : 0.96;
    const verbWP  = hybridAnteilWP * v / jaz;
    const verbGas = (1 - hybridAnteilWP) * v / wgGas;
    const pWP  = _energiepreis('wp', input, params) / 100;
    const pGas = _energiepreis('gas', input, params) / 100;
    const stWP = _steigung('wp', params);
    const stGas = _steigung('gas', params);
    for (let t = 1; t <= T; t++) {
      energieSum += verbWP * pWP * Math.pow(1 + stWP, t - 1)
                  + verbGas * pGas * Math.pow(1 + stGas, t - 1);
    }
  } else {
    const preis0 = _energiepreis(option, input, params) / 100;
    const steig  = _steigung(option, params);
    for (let t = 1; t <= T; t++) {
      energieSum += verbEff * preis0 * Math.pow(1 + steig, t - 1);
    }
  }

  return investMehr - foerderung + energieSum + wartung * T + co2 * T;
}

function berechneAllDashboardKennzahlen(input, params) {
  const optionen = ['gas', 'hybrid', 'wp', 'fw', 'pellets'];
  const we = input.we || 1;
  const T = input.zeitraum || 25;
  const tcoAlle = berechneTCOAlleOptionen(input, params);
  const pellPlausibel = pelletsPlausibel(input, params);

  // Fernwärme ist nur ein gültiger Vergleichsmaßstab, wenn eine Anschluss-
  // Investition eingetragen wurde. Ohne Eingabe (fw-Invest = 0) wäre die
  // "Amortisation vs. Fernwärme" ein Vergleich gegen eine kostenlose Fernwärme
  // — rechnerisch sinnlos. Dann bleibt die Kennzahl null → Tabelle zeigt „—".
  const fwBeruecksichtigt = berechneInvestition('fw', input, params) > 0;

  const result = {};
  for (const opt of optionen) {
    const investMehr = berechneInvestition(opt, input, params);
    const foerder    = berechneFoerderBetrag(opt, input, params);
    const investNetto = Math.max(0, investMehr - foerder);
    const sonderumlage = we > 0 ? investNetto / we : 0;

    const jahreskosten = _berechneJahreskostenJ1(opt, input, params);
    const co2Kosten    = _co2KostenProJahr(opt, input);
    const co2Faktor    = CO2_FAKTOR[opt] ?? 0;
    const verbrauch    = input.verbrauch || 0;
    const co2EmissionenT = (verbrauch * co2Faktor) / 1000;  // Tonnen pro Jahr

    const tcoBarwert = tcoAlle[opt].tco;
    const annuitaet  = tcoAlle[opt].annuitaet;
    const tcoStatisch = _berechneTCOStatisch(opt, input, params);

    const eurQm = berechneEurProQmMonat(tcoBarwert, input.wohnflaeche, T);
    const amort   = berechneAmortisation(opt, input, params);
    const amortFW = fwBeruecksichtigt
      ? berechneAmortisation(opt, input, params, 'fw')
      : null;

    // plausibel: technische Zulässigkeit (nur Pellets kann unplausibel sein).
    //   Steuert die Inline-Editierbarkeit — bleibt für 0-Invest-Optionen true.
    // beruecksichtigt: Teil des Vergleichs? Gas immer (Status-quo-Anker).
    //   Modernisierungs-Optionen nur, wenn eine Bruttoinvestition eingetragen
    //   ist (> 0). 0 = vom Nutzer nicht gewählt → ausgegraut, aus Wertung raus.
    const plausibel = (opt === 'pellets') ? pellPlausibel : true;
    const beruecksichtigt = (opt === 'gas')
      ? true
      : (investMehr > 0 && plausibel);

    result[opt] = {
      bruttoinvest:       investMehr,
      foerderung:         foerder,
      nettoInvest:        investNetto,
      sonderumlageProWE:  sonderumlage,
      jahreskostenJ1:     jahreskosten,
      co2KostenP_a:       co2Kosten,
      co2EmissionenP_a_t: co2EmissionenT,
      gesamtAnnuitaet:    annuitaet,
      tcoBarwert,
      tcoStatisch,
      eurProQmMonat:      eurQm,
      amortisationVsGas:  amort,
      amortisationVsFW:   amortFW,
      plausibel,
      beruecksichtigt
    };
  }
  return result;
}

/* --------------------------------------------------------------
   20) Pastell-Bewertung pro Zelle (Memory project_designsystem.md §2)
   -------------------------------------------------------------- */

function bewerteZelle(wert, alleWerteZeile, optionPlausibel, kennzahlTyp) {
  // C2 v2.1 — Schwellwert-Pastell-Logik (Memory project_designsystem.md §2)
  //   diff = abs(wert - best) / best × 100
  //   ≤ 5 %       → pastell-vorteil
  //   5 % – 25 %  → pastell-hinweis
  //   > 25 %      → pastell-risiko
  //   alle innerhalb 5 % zur Best-Option → pastell-neutral (transparent)
  //   Pellets bei !plausibel → pastell-ausgeschlossen
  //
  // kennzahlTyp: 'kosten' (niedrig = best) | 'foerderung' (hoch = best)
  if (!optionPlausibel) return 'pastell-ausgeschlossen';
  if (wert == null || isNaN(wert)) return 'pastell-neutral';

  const aktive = alleWerteZeile.filter(v => v != null && !isNaN(v));
  if (aktive.length < 2) return 'pastell-neutral';

  const istKosten = (kennzahlTyp || 'kosten') === 'kosten';
  const best = istKosten ? Math.min(...aktive) : Math.max(...aktive);
  if (best === 0 || Math.abs(best) < 1e-9) {
    // Wenn beste Option 0 (z. B. Status quo Investition): jede Diff darüber ist
    // ein Hinweis/Risiko. Pragmatik: alle anderen aktiven Werte als Hinweis,
    // 0-Werte selbst als vorteil.
    return wert === best ? 'pastell-vorteil' : (wert > best * 0.25 || true ? 'pastell-hinweis' : 'pastell-vorteil');
  }

  // Spezialfall: alle Werte innerhalb 5 % zur Best-Option → keine Färbung
  const alleEng = aktive.every(v => Math.abs(v - best) / Math.abs(best) <= 0.05);
  if (alleEng) return 'pastell-neutral';

  const diffProzent = Math.abs(wert - best) / Math.abs(best);
  if (diffProzent <= 0.05) return 'pastell-vorteil';
  if (diffProzent <= 0.25) return 'pastell-hinweis';
  return 'pastell-risiko';
}

/* --------------------------------------------------------------
   21) Big-Picture-Achsen (Spec §9, Eco-2050-Ansatz)
   -------------------------------------------------------------- */

// Heuristik für die qualitativen Achsen (Resilienz, Erweiterbarkeit,
// Zukunftsfähigkeit, Risiko-Roh) — Werte gemäß Spec §9 Tabelle.
// Folgeaufgabe v2.1: aus Excel-Tab pflegen, dann build_json.py exportieren.
//
// Mapping qualitativ → numerisch:
//   niedrig: 25, niedrig-mittel: 35, mittel: 50, mittel-hoch: 65, hoch: 80
//
// Risiko-Roh: hoher Wert = mehr Risiko. Wird beim Render in ergebnis.js
// zu (100 - risiko) invertiert, damit alle Achsen "weit außen = gut".
const BIG_PICTURE_HEURISTIK_FIX = {
  gas:     { resil: 25, erweit: 25, zukunft: 25, risiko: 80 },
  hybrid:  { resil: 50, erweit: 50, zukunft: 50, risiko: 65 },
  wp:      { resil: 80, erweit: 80, zukunft: 80, risiko: 50 },
  fw:      { resil: 25, erweit: 25, zukunft: 50, risiko: 50 },
  pellets: { resil: 50, erweit: 50, zukunft: 50, risiko: 50 }
};

// C2 v2.1 — Skala mit Bodensatz 20 (Daniel 05.05.):
//   wert = 100 - ((wert - best) / range) * 80
// Spreizung 80, Boden 20 — visuell weicher als Min-Max mit Boden 0.
// "best" = niedrigste TCO bzw. niedrigste CO₂-Emission (kosten-/emissions-Logik).
function _skaliereMitBodensatz(wertAbsolut, alleAktiveAbsolut) {
  const best  = Math.min(...alleAktiveAbsolut);
  const worst = Math.max(...alleAktiveAbsolut);
  const range = worst - best;
  if (range < 1e-9) return 100;
  return 100 - ((wertAbsolut - best) / range) * 80;
}

function berechneBigPictureAchsen(input, params) {
  // C2 v2.1 — TCO-basierte Wirtschaftlichkeit + Bodensatz-Skalierung 20 für
  // Wirtschaftlichkeit und Nachhaltigkeit. Risiko bleibt Heuristik-Roh-Wert
  // (Heuristik-Werte 25–80 → beim Render zu „Risiko-Schutz" 100−risikoRoh =
  // 20–75, liegt also im selben Wertebereich wie Bodensatz-Achsen).
  // Pellets bei !plausibel: aus Skalierung raus.
  const optionen = ['gas', 'hybrid', 'wp', 'fw', 'pellets'];
  const tcoAlle = berechneTCOAlleOptionen(input, params);
  const pellPlausibel = pelletsPlausibel(input, params);

  const aktive = optionen.filter(o => o !== 'pellets' || pellPlausibel);

  // Werte absolut (positive Größe — niedrig = besser)
  const tcoAktiv = aktive.map(o => tcoAlle[o].tco);
  const verb = input.verbrauch || 0;
  const co2Aktiv = aktive.map(o => (verb * (CO2_FAKTOR[o] ?? 0)) / 1000);

  const result = {};
  optionen.forEach(opt => {
    const istAktiv = aktive.includes(opt);
    const heur = BIG_PICTURE_HEURISTIK_FIX[opt] || { resil: 50, erweit: 50, zukunft: 50, risiko: 50 };
    const tcoVal = tcoAlle[opt].tco;
    const co2Val = (verb * (CO2_FAKTOR[opt] ?? 0)) / 1000;
    const wirtsch = istAktiv ? _skaliereMitBodensatz(tcoVal, tcoAktiv) : 0;
    const nachhal = istAktiv ? _skaliereMitBodensatz(co2Val, co2Aktiv) : 0;

    result[opt] = {
      wirtschaftlichkeit: Math.round(wirtsch),
      nachhaltigkeit:     Math.round(nachhal),
      resilienz:          heur.resil,
      erweiterbarkeit:    heur.erweit,
      zukunftsfaehigkeit: heur.zukunft,
      risikoRoh:          heur.risiko,
      plausibel:          (opt === 'pellets') ? pellPlausibel : true
    };
  });
  return result;
}

/* --------------------------------------------------------------
   22a) C2 v2.1 — Mieter-Nebenkosten-Effekt (Spec §6.3)
   --------------------------------------------------------------
   Dynamisch aus User-State, nicht pauschal.
   Mieter-Anteil-CO₂ = 0,5 (BEHG-Stufenmodell, Default für teilsanierte
                            MFH-Klasse C-D)
   Mieter-Anteil-Energie = 1,0 (HeizkostenV §7, voll umlagefähig)
   Wohnflächen-Anteil = eigeneWohnflaeche / wohnflaeche
   Fallback bei leerer eigeneWohnflaeche: 1/wohneinheiten (z. B. MFH 14 WE = 7,14 %)
*/

function berechneMieterNebenkostenEffekt(option, input, params) {
  // Wenn Status quo Gas: Effekt für Mieter ist die Mehrbelastung gegenüber
  // einer Referenz (= Status quo selbst, also 0). Wir definieren:
  // - Modernisierung gegen Status quo Gas: positiv = Mieter-Entlastung
  // - Status quo Gas: 0 € (Referenz)
  if (option === 'gas') {
    return { effektProMonat: 0, deltaEnergie: 0, deltaCO2: 0,
             anteil: 0, fallbackAnteil: false };
  }

  // CO₂-Kosten und Energiekosten Jahr 1 für Status quo Gas und Modernisierung
  const co2Gas    = _co2KostenProJahr('gas',  input);
  const co2Option = _co2KostenProJahr(option, input);
  const deltaCO2  = co2Gas - co2Option;  // positiv wenn Modernisierung weniger CO₂

  // Energiekosten Jahr 1 (ohne Steigerung — aktueller Mehrwert für den Mieter)
  const verbGas    = berechneVerbrauchEffektiv('gas',  input, params);
  const verbOption = berechneVerbrauchEffektiv(option, input, params);
  const preisGas   = _energiepreis('gas', input, params) / 100;
  let energieGas    = verbGas * preisGas;
  let energieOption;
  if (option === 'hybrid') {
    const tech = _p(params, 'block3_technik') || {};
    const a_wp = tech.HybridAnteilWP ? tech.HybridAnteilWP.default : 0.7;
    const v = input.verbrauch || 0;
    const jaz = (input.overrides && input.overrides.jaz) || (tech.JAZ ? tech.JAZ.default : 3.8);
    const wgGas = tech.WGGasBW ? tech.WGGasBW.default : 0.96;
    const verbWP  = a_wp * v / jaz;
    const verbGasH = (1 - a_wp) * v / wgGas;
    const pWP  = _energiepreis('wp', input, params) / 100;
    const pGas = _energiepreis('gas', input, params) / 100;
    energieOption = verbWP * pWP + verbGasH * pGas;
  } else {
    const preisOpt = _energiepreis(option, input, params) / 100;
    energieOption = verbOption * preisOpt;
  }
  const deltaEnergie = energieGas - energieOption;

  // Wohnflächen-Anteil: eigeneWohnflaeche oder Fallback 1/wohneinheiten
  const we = input.we || input.wohneinheiten || 1;
  const wohnflaeche = input.wohnflaeche || 1;
  const eigeneFl = (input.eigeneWohnflaeche != null && input.eigeneWohnflaeche > 0)
                   ? input.eigeneWohnflaeche : null;
  const anteil = eigeneFl != null
                 ? (eigeneFl / wohnflaeche)
                 : (1 / Math.max(1, we));
  const fallbackAnteil = (eigeneFl == null);

  // Effekt: Modernisierung entlastet Mieter um (ΔCO₂ × Mieter-Anteil-CO₂ + ΔEnergie × 1.0) × Wohnflächen-Anteil
  const MIETER_ANTEIL_CO2 = 0.5;
  const MIETER_ANTEIL_ENERGIE = 1.0;
  const effektProJahr = (deltaCO2 * MIETER_ANTEIL_CO2 + deltaEnergie * MIETER_ANTEIL_ENERGIE) * anteil;
  const effektProMonat = effektProJahr / 12;

  return {
    effektProMonat,    // > 0 = Mieter-Entlastung; < 0 = Mehrbelastung
    deltaEnergie,
    deltaCO2,
    anteil,
    fallbackAnteil
  };
}

/* --------------------------------------------------------------
   22b) C2 v2.1 — Zukunftsszenario-Aussagen (Spec §9.3)
   --------------------------------------------------------------
   5 Aussagen Vorher/Nachher zwischen Default-Markt-Werten und
   aktuellem Schieberegler-State. Bei Default-Zustand (keine Schieberegler
   bewegt) ist ist == neu, kein Delta.
*/

function _kennzahlen(input, params) {
  const dash = berechneAllDashboardKennzahlen(input, params);
  const empf = berechneEmpfehlung(input, params);
  const eqms = ['gas', 'hybrid', 'wp', 'fw', 'pellets']
    .filter(o => dash[o].beruecksichtigt)
    .map(o => ({ option: o, eurQm: dash[o].eurProQmMonat, tco: dash[o].tcoBarwert }));
  eqms.sort((a, b) => a.eurQm - b.eurQm);
  return {
    bestesEurQm: eqms[0]?.eurQm ?? 0,
    bestOption: eqms[0]?.option ?? 'gas',
    ranking: eqms.map(e => e.option),
    amortWP: dash.wp.amortisationVsGas,
    betriebskosten: dash.gas.jahreskostenJ1,  // Status quo Jahr 1
    eqms
  };
}

function berechneZukunftsszenarioAussagen(input, params) {
  // "ist": Default-Werte (Markt-Schnitt aus Preishistorie, Standard-Förderung)
  // "neu": aktueller State (mit allen Schieberegler-Overrides)
  const inputDefault = JSON.parse(JSON.stringify(input));
  // Default-Preise = JSON-Block-1-Defaults (Modell-Annahme aus Excel)
  inputDefault.preis = {
    gas: _default(params, 'block1_energiepreise', 'PreisGas') ?? 8.57,
    fw:  _default(params, 'block1_energiepreise', 'PreisFW')  ?? 17.5,
    wp:  _default(params, 'block1_energiepreise', 'PreisWP')  ?? 25
  };
  // Default-Förderung = Grund + Klima
  inputDefault.foerderung = { grund: true, klima: true, einkommen: false, effizienz: false, master: 50 };

  const ist = _kennzahlen(inputDefault, params);
  const neu = _kennzahlen(input, params);

  // 1) €/m²/Monat beste Option
  const eurQmAussage = {
    ist: ist.bestesEurQm,
    neu: neu.bestesEurQm,
    bestOptionIst: ist.bestOption,
    bestOptionNeu: neu.bestOption,
    delta: neu.bestesEurQm - ist.bestesEurQm
  };

  // 2) Beste-Option-Ranking (kippen erkennen)
  const rankingAussage = {
    ist: ist.ranking,
    neu: neu.ranking,
    kippt: ist.bestOption !== neu.bestOption
  };

  // 3) Mieter-Nebenkosten-Effekt (für die empfohlene Option neu)
  const mieterIst  = berechneMieterNebenkostenEffekt(ist.bestOption, inputDefault, params);
  const mieterNeu  = berechneMieterNebenkostenEffekt(neu.bestOption, input, params);
  const mieterAussage = {
    ist: mieterIst.effektProMonat,
    neu: mieterNeu.effektProMonat,
    delta: mieterNeu.effektProMonat - mieterIst.effektProMonat,
    optionNeu: neu.bestOption,
    fallbackAnteil: mieterNeu.fallbackAnteil
  };

  // 4) Amortisation WP vs. Gas
  const amortAussage = {
    ist: ist.amortWP,
    neu: neu.amortWP,
    delta: (neu.amortWP != null && ist.amortWP != null)
           ? (neu.amortWP - ist.amortWP) : null
  };

  // 5) Betriebskosten Jahresgesamt (Status quo Gas)
  const betriebsAussage = {
    ist: ist.betriebskosten,
    neu: neu.betriebskosten,
    delta: neu.betriebskosten - ist.betriebskosten
  };

  return {
    eurQmAussage,
    rankingAussage,
    mieterAussage,
    amortAussage,
    betriebsAussage,
    // Default-Zustand (keine Overrides aktiv)?
    imDefaultZustand: Math.abs(eurQmAussage.delta) < 0.01
                       && Math.abs(betriebsAussage.delta) < 1
                       && !rankingAussage.kippt
  };
}

/* --------------------------------------------------------------
   22) Erhaltungsrücklage-Status (GdW-Plausibilität)
   -------------------------------------------------------------- */

function berechneErhaltungsruecklageStatus(input, params) {
  if (input.gebaeudetyp !== 'MFH') return null;  // bei EFH kein GdW-Vergleich
  const ruecklage = input.ruecklageProWEMonat;
  if (ruecklage == null || ruecklage === 0) return null;

  const we = input.we || 14;
  const flaeche = input.wohnflaeche || 908;
  const horizont = input.sanierungsHorizont || 10;

  const proQmJahr = (ruecklage * we * 12) / flaeche;
  const tech = _p(params, 'block3_technik') || {};
  const gdwUnter = (tech.GdWUntergrenze && tech.GdWUntergrenze.default) ?? 13;
  const gdwOber  = (tech.GdWObergrenze  && tech.GdWObergrenze.default)  ?? 17;

  let klassifikation;
  if (proQmJahr < gdwUnter)      klassifikation = 'unter';
  else if (proQmJahr <= gdwOber) klassifikation = 'im';
  else                            klassifikation = 'ueber';

  // Sanierungshorizont-Bewertung: bei kürzerem Horizont braucht man mehr
  // Rücklage pro Jahr, sonst reicht es nicht.
  let horizontBewertung;
  const verhaeltnis = proQmJahr / gdwUnter;
  if (horizont <= 5) {
    horizontBewertung = klassifikation === 'ueber' ? 'gut' : 'reicht-nicht';
  } else if (horizont <= 10) {
    if (klassifikation !== 'unter')   horizontBewertung = 'gut';
    else if (verhaeltnis >= 0.5)      horizontBewertung = 'knapp';
    else                              horizontBewertung = 'reicht-nicht';
  } else if (horizont <= 15) {
    if (klassifikation !== 'unter')   horizontBewertung = 'gut';
    else if (verhaeltnis >= 0.3)      horizontBewertung = 'knapp';
    else                              horizontBewertung = 'reicht-nicht';
  } else {  // 20+
    horizontBewertung = verhaeltnis >= 0.5 ? 'gut' : 'knapp';
  }

  return { proQmJahr, gdwUnter, gdwOber, klassifikation, horizontBewertung, horizont };
}

/* --------------------------------------------------------------
   19) Export
   -------------------------------------------------------------- */

export {
  // Berechnungen
  berechneTCO,
  berechneTCOAlleOptionen,
  berechneEurProQmMonat,
  berechneAmortisation,
  berechneCashflowKurve,
  berechneCashflowAlleOptionen,
  berechneFoerderQuote,
  berechneFoerderBetrag,
  berechneInvestition,
  berechneVerbrauchEffektiv,
  berechneVermieterCashflowProJahr,
  berechneVermoegensbilanz,
  berechneRisikoUebersicht,
  berechneSensitivitaet,
  berechneEmpfehlung,
  // Plausibilität
  pelletsPlausibel,
  wirksamVM,
  fwSatzungAktiv,
  altstadtPLZ,
  // Helper
  formatEuro,
  formatProzent,
  formatJahre,
  // Methodik
  methodikInhalte,
  // Adapter + Verifikation
  buildInput,
  runVerifikation,
  // Konstanten (für Profi-Pille-Editor)
  CO2_PREIS_PFAD,
  PERSONA_GEWICHTUNG,
  // C2 v2.0 — Dashboard, Pastell, Big Picture, Erhaltungsrücklage
  berechneAllDashboardKennzahlen,
  bewerteZelle,
  berechneBigPictureAchsen,
  berechneErhaltungsruecklageStatus,
  BIG_PICTURE_HEURISTIK_FIX,
  // C2 v2.1 — Mieter-Nebenkosten, Zukunftsszenario, Bruttoinvest-Defaults
  berechneMieterNebenkostenEffekt,
  berechneZukunftsszenarioAussagen,
  _bruttoInvestDefaults as bruttoInvestDefaults
};
