/* ==============================================================
   ergebnis.js — Visualisierungs-Layer C2 v1
   Chart.js + DOM + Re-Rendering. Importiert engine.js.

   Architektur:
   - Pull-based Render aus window.HE.state + window.HE.config
   - Re-Render über Custom-Event 'he:state-changed' (rAF-debounced)
   - Charts werden einmal erzeugt, dann via chart.update('none')
   ============================================================== */

'use strict';

import {
  berechneTCOAlleOptionen,
  berechneCashflowAlleOptionen,
  berechneAmortisation,
  berechneFoerderQuote,
  berechneFoerderBetrag,
  berechneInvestition,
  berechneEurProQmMonat,
  berechneVermieterCashflowProJahr,
  berechneVermoegensbilanz,
  berechneRisikoUebersicht,
  berechneSensitivitaet,
  berechneEmpfehlung,
  pelletsPlausibel,
  wirksamVM,
  fwSatzungAktiv,
  formatEuro,
  formatProzent,
  formatJahre,
  methodikInhalte,
  buildInput,
  runVerifikation,
  CO2_PREIS_PFAD,
  // C2 v2.0
  berechneAllDashboardKennzahlen,
  bewerteZelle,
  berechneBigPictureAchsen,
  berechneErhaltungsruecklageStatus,
  // C2 v2.1
  berechneMieterNebenkostenEffekt,
  berechneZukunftsszenarioAussagen
} from './engine.js';

import { GLOSSAR, getGlossarEintrag } from './glossar.js';

/* --------------------------------------------------------------
   Konstanten
   -------------------------------------------------------------- */

const CHART_FARBEN = {
  gas:     '#7a7a7a',
  hybrid:  '#7ab8b5',
  wp:      '#1a5c5a',
  fw:      '#CFF77F',
  pellets: '#a87a4a',
  components: {
    investition: '#1a3535',
    foerderung:  '#CFF77F',
    energie:     '#1a5c5a',
    wartung:     '#7ab8b5',
    co2:         '#a87a4a'
  }
};

const OPTION_LABELS = {
  gas:     'Status quo Gas',
  hybrid:  'Hybrid',
  wp:      'Wärmepumpe',
  fw:      'Fernwärme',
  pellets: 'Pellets'
};

const PERSONA_LABELS = {
  bewahrer:   'Bewahrer',
  optimierer: 'Optimierer',
  wechsler:   'Wechsler'
};

/* Risiko-Banner pro Empfehlungs-Option — Web-Schnell-Patch (Spec §3.9 v1.2 in Vorbereitung).
   Statisches Lookup, keine JSON- oder Excel-Anbindung. Texte werden mit
   Excel-Patch v2.1 synchronisiert.
   Pellets bewusst weggelassen (selten Empfehlung). */
const RISIKO_BANNER = {
  hybrid: {
    titel: 'Hybrid: behalte diese Risiken im Blick',
    punkte: [
      'CO₂-Preis steigt ab 2027 (EU-ETS2) — wir rechnen statisch 105 €/t, real eher 130–200 €/t bis 2035',
      'Grüngasquote ab 2029 (10 %) macht Gas pro kWh teurer',
      'Stranded-Asset-Risiko: kommunale Wärmeplanung könnte Gasnetz Innenstadt vor 2040 stilllegen',
      'Bei H₂-Umstellung des Gasnetzes: H₂-fähige Brenner als Folge-Investition',
      'Geopolitische Konflikte können Gas-Spikes auslösen (2022 kurzzeitig 30 ct/kWh)'
    ],
    cta: 'Probiere die Schieberegler: CO₂-Pfad „beschleunigung" + Gas-Preis 5 %/a → kippt die Empfehlung typischerweise zu Wärmepumpe.'
  },
  wp: {
    titel: 'Wärmepumpe: behalte diese Risiken im Blick',
    punkte: [
      'JAZ ist die zentrale Effizienz-Kennzahl — real gemessen oft unter Hersteller-Wert. Sicherheits-Abschlag von 0,3 sinnvoll',
      'Strom-Sondertarif WP-Strom hängt teilweise vom Gas-Preis ab (Mittellast-Korrelation ~30 %)',
      'Schallschutz nach TA Lärm im MFH ggf. relevant — Gutachten kann nötig sein'
    ],
    cta: 'Profi-Modus aktivieren: JAZ-Override mit deinem Datenblatt-Wert minus 0,3 testen.'
  },
  fw: {
    titel: 'Fernwärme: behalte diese Risiken im Blick',
    punkte: [
      'Versorger-Monopol — keine Wechsel-Option, Preise nur durch Aufsicht/Verbraucherschutz limitiert',
      'Effizienz-Paradoxon: bei kleinem Verbrauch wird der Leistungspreis-Anteil dominant, Effektivpreis steigt',
      'AGFW-Median 15,7 ct/kWh, Erfurt-Effektivpreis liegt aktuell bei 17,5 ct/kWh — also über Bundesschnitt'
    ],
    cta: 'Probiere den FW-Preis-Slider — wie sieht das mit niedrigerem oder höherem Preis aus?'
  },
  gas: {
    titel: 'Status quo Gas: behalte diese Risiken im Blick',
    punkte: [
      'EPBD-Konformitäts-Risiko ab 2028 — Effizienzklasse F/G kann zu Marktwert-Abschlag (~7 %) führen',
      'CO₂-Verteuerung trifft Gas direkt mit voller Wirkung',
      'Gas-Subventionen (Gaspreis-Bremse, reduzierte MwSt.) können auslaufen — Sprung-Anstieg möglich',
      'Kommunale Wärmeplanung schreibt vor 2028 Gas-Stilllegungs-Pläne vor'
    ],
    cta: 'Schau dir Hybrid und Wärmepumpe als Alternative an — Schieberegler nutzen.'
  }
};

/* Sensibilisierungs-Block fossile Energie — 11 finale Punkte aus
   Memory project_hybrid_risiko_modellierung.md.
   Sichtbar bei jeder Empfehlung, in Kontextblau mit Smart-Icon. */
const SENSIBILISIERUNGS_PUNKTE = [
  { titel: 'CO₂-Preis steigt ab 2027 (EU-ETS2)',
    text: 'heute 55 €/t, bis 2035 realistisch 130–200 €/t' },
  { titel: 'Gas-Subventionen können entfallen',
    text: 'Gaspreis-Bremse, reduzierte MwSt., gestreckter CO₂-Preis sind politische Entscheidungen' },
  { titel: 'Geopolitische Konflikte verursachen Gas-Spikes',
    text: '2022 kurzzeitig 30 ct/kWh; Pipeline-Sabotage, Hormuz-Beispiel' },
  { titel: 'Grüngasquote ab 2029 (10 %)',
    text: 'macht Gas pro kWh teurer' },
  { titel: 'Stranded-Asset-Risiko Gasnetz',
    text: 'kommunale Wärmeplanung könnte Gasnetz vor 2040 stilllegen' },
  { titel: 'Wasserstoff-Umstellung',
    text: 'bestehende Brenner brauchen Anpassung, Umrüst-Kosten 10–15 T€ pro MFH (DVGW)' },
  { titel: 'EPBD-Klassen-Anforderungen ab 2028',
    text: 'schwächste Klassen können Marktwert-Abschlag bringen' },
  { titel: 'Mietspiegel-Argumentation',
    text: 'wird mit Energie-Effizienz-Verschlechterung schwieriger' },
  { titel: 'Klima-Realität',
    text: 'CO₂-Gehalt der Atmosphäre bei ~422 ppm bereits über planetarer Grenze. 2024 global wärmstes Jahr; Europa erhitzt sich am schnellsten' },
  { titel: 'Generationen-Verantwortung',
    text: 'Klimaneutralität 2045 als Voraussetzung für die nächste Generation. Was 2026 eingebaut wird, prägt den Klima-Beitrag des Gebäudes für 18–25 Jahre' },
  { titel: 'Mieter-Vermieter-Aufteilungs-Trend',
    text: 'der Vermieter trägt zunehmend Mit-Verantwortung für die Folgekosten seiner Heizungs-Wahl. Beschlossen: CO₂-Aufteilung nach BEHG-Stufenmodell. In Diskussion: Gas-Netzentgelte. Wer in fossile Heizung investiert, kann nicht mehr darauf vertrauen, dass alle Folgekosten Mieter-Sache bleiben.' }
];

/* --------------------------------------------------------------
   Charts-Registry
   -------------------------------------------------------------- */

const charts = new Map();

/* --------------------------------------------------------------
   Helper
   -------------------------------------------------------------- */

const $  = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

/* Smart-Icon — Marken-Element (Memory project_designsystem.md §3).
   Platzhalter-Notation 💡✦ bis das eigene SVG entwickelt ist.
   Helper zentral, sodass beim SVG-Tausch eine Stelle reicht. */
function smartIcon(opts) {
  const klasse = (opts && opts.klein) ? 'smart-icon smart-icon--klein' : 'smart-icon';
  return '<span class="' + klasse + '" aria-hidden="true">💡✦</span>';
}

function getInput() {
  if (!window.HE || !window.HE.state || !window.HE.config) return null;
  return buildInput(window.HE.state, window.HE.config.parameter);
}

function getParams() {
  return window.HE && window.HE.config ? window.HE.config.parameter : null;
}

/* C2 v2.1: renderCashflowKurve + renderTCOVergleich GELÖSCHT
   (waren in Vorgeschmack-Aufklapper, der komplett raus ist — Spec §16). */

/* --------------------------------------------------------------
   Vermieter-Bilanz (5 Blöcke)
   -------------------------------------------------------------- */

function renderVermieterBilanz(input, params) {
  const wrap = $('#vermieter-bilanz');
  if (!wrap) return;

  // Konditional sichtbar
  const sichtbar = wirksamVM(input) === 1;
  console.log('[VB] nutzungsart:', input.nutzungsart, '| wirksamVM:', wirksamVM(input),
              '| sichtbar:', sichtbar);
  wrap.hidden = !sichtbar;
  if (!sichtbar) return;

  // Block 1 — qualitative Vorteile (statisch)
  const b1 = $('#vb-block-1');
  if (b1) {
    b1.innerHTML = `
      <h4>Was du als Vermieter durch eine Heizungs-Modernisierung gewinnst</h4>
      <ol class="vb-vorteile">
        <li>Mietspiegel-Klassen-Sprung (~ 0,30 €/m²·Monat) durch energetische Modernisierung</li>
        <li>Modernisierungs-Umlage nach §559 BGB (8 % p.a. der Investition, max. 12 Jahre)</li>
        <li>Wegfall des Risikos durch CO₂-Preis-Verschiebung (CO₂-Verschiebung 2027 ff.)</li>
        <li>Marktwert-Steigerung durch energetische Klasse (DC → DB ca. 8–14 %)</li>
        <li>Schutz vor EPBD-Abschlag (~ 7 % Marktwert-Reduktion bei nicht-konformen Gebäuden ab 2028)</li>
        <li>KfW-Zinszuschuss zusätzlich zur BAFA-Förderung (ca. 20 % auf Restkredit)</li>
        <li>§7b Sonder-AfA für 4 Jahre (5 %/J) — verbesserte steuerliche Abschreibung</li>
        <li>Vermarktungs-Vorteil bei Neuvermietung (Energiekosten-Argument)</li>
        <li>Risikominderung durch Reduktion der Sanierungs-Schuld vor Übergabe an Erben</li>
      </ol>
    `;
  }

  // Block 2 — Jahres-Cashflow (5 Optionen × 7 Posten + Σ, mit Pastell-Bewertung)
  const b2 = $('#vb-block-2');
  if (b2) {
    const pelletsOK = pelletsPlausibel(input, params);
    const optionen = pelletsOK
      ? ['gas', 'hybrid', 'wp', 'fw', 'pellets']
      : ['gas', 'hybrid', 'wp', 'fw'];
    const cfs = optionen.map(o => berechneVermieterCashflowProJahr(o, input, params));
    const posten = ['mod559', 'mietspiegel', 'co2', 'mieterstrom', 'wartung_diff', 'mietausfall', 'bauprozess'];
    const postenLabels = {
      mod559:        '§559 Modernisierungs-Umlage',
      mietspiegel:   'Mietspiegel-Klassen-Sprung',
      co2:           'CO₂-Verschiebung',
      mieterstrom:   'Mieterstrom-Erlös (PV)',
      wartung_diff:  'Wartung-Mehrkosten vs. Status quo',
      mietausfall:   'Mietausfall (Heizkostenanstieg)',
      bauprozess:    'Bauprozess-Mietminderung'
    };
    const vorzeichen = {
      mod559: 1, mietspiegel: 1, co2: 1, mieterstrom: 1,
      wartung_diff: -1, mietausfall: -1, bauprozess: -1
    };

    const headerRow = '<tr><th>Posten (€/a, gemittelt 25 J)</th>'
      + optionen.map(o => `<th>${escapeHtml(OPTION_LABELS[o])}</th>`).join('')
      + '</tr>';
    // Pastell-Bewertung pro Zeile: hoch-besser (positive Werte = Vermieter-Vorteil)
    const bodyRows = posten.map(p => {
      const werteZeile = cfs.map(cf => cf.posten[p] * vorzeichen[p]);
      const cells = cfs.map((cf, i) => {
        const wert = werteZeile[i];
        const klasse = bewerteZelle(wert, werteZeile, true, 'foerderung');
        return `<td class="${klasse}">${formatEuro(wert)}</td>`;
      }).join('');
      return `<tr><td>${escapeHtml(postenLabels[p])}</td>${cells}</tr>`;
    }).join('');
    const sigmaWerte = cfs.map(cf => cf.sigma);
    const sigmaCells = cfs.map((cf, i) => {
      const klasse = bewerteZelle(cf.sigma, sigmaWerte, true, 'foerderung');
      return `<td class="${klasse}"><strong>${formatEuro(cf.sigma)}</strong></td>`;
    }).join('');
    const sigmaRow = `<tr class="vb-sigma"><td><strong>Σ Cashflow Vermieter</strong></td>${sigmaCells}</tr>`;

    // C2 v2.1 — Mieter-Nebenkosten-Effekt-Zeile (NEU, Spec §6 / §6.3)
    const mieterEffekte = optionen.map(o => berechneMieterNebenkostenEffekt(o, input, params));
    const mieterWerte = mieterEffekte.map(m => m.effektProMonat);
    const mieterCells = mieterEffekte.map((m, i) => {
      // Höherer Mieter-Effekt = Entlastung = grün → kennzahlTyp 'foerderung'
      const klasse = bewerteZelle(m.effektProMonat, mieterWerte, true, 'foerderung');
      return `<td class="${klasse}"><strong>${formatEuro(m.effektProMonat)}</strong>/Monat</td>`;
    }).join('');
    const fallback = mieterEffekte.find(m => m.fallbackAnteil);
    const we = input.wohneinheiten || 14;
    const anteilProz = (1 / we * 100).toFixed(2).replace('.', ',');
    const mieterTooltipText = fallback
      ? 'Mieter trägt 100 % der Energiekosten über Heizkostenabrechnung (HeizkostenV §7) und 50 % der CO₂-Kosten (BEHG-Stufenmodell, Klasse C-D, teilsaniert). Annahme: gleichmäßiger Anteil 1/' + we + ' = ' + anteilProz + ' % (deine Wohnung anteilig). Trag deine konkrete Wohnungsgröße im Wizard ein, dann wird der Effekt für dich exakt berechnet.'
      : 'Mieter trägt 100 % der Energiekosten über Heizkostenabrechnung (HeizkostenV §7) und 50 % der CO₂-Kosten (BEHG-Stufenmodell, Klasse C-D, teilsaniert). Anteil: deine Wohnungsgröße / Gesamt-Wohnfläche.';
    const mieterRow = `<tr class="mieter-nk-zeile"><td>Mieter-Nebenkosten-Effekt
      <span class="info-tip" tabindex="0" aria-label="Methodik Mieter-Nebenkosten">ⓘ
        <span class="info-tip__pop">${escapeHtml(mieterTooltipText)}</span>
      </span></td>${mieterCells}</tr>`;

    b2.innerHTML = `
      <h4>Jahres-Cashflow Vermieter (€/a, gemittelt 25 J)
        <span class="info-tip" data-tip="formel-vermieter-cashflow" tabindex="0" aria-label="Methodik">ⓘ
          <span class="info-tip__pop"></span>
        </span>
      </h4>
      <div class="vb-tabelle-wrap">
        <table class="vb-tabelle">
          <thead>${headerRow}</thead>
          <tbody>${bodyRows}${sigmaRow}${mieterRow}</tbody>
        </table>
      </div>
      <p class="vb-hinweis">
        §559 Mietspiegel-Klassen-Sprung im Detail (Klassen-spezifischer Aufschlag) findest du in der
        <a href="/excel-edition.html">Excel-Edition</a>. Im Web rechnen wir mit einem typischen Klassen-Sprung von 1.
        <br>Mieter-Nebenkosten-Effekt: positiver Wert = Entlastung pro Mieter-Monat;
        bei Status quo Gas Mehrbelastung relativ zur Modernisierung.
      </p>
    `;
    befuelleTooltips(b2);
  }

  // Block 3 (Vermögensbilanz) — RAUS in v2.1 (Spec §6 / §16, in Excel verschoben)
  // Container falls noch im DOM: leeren und ausblenden.
  const b3 = $('#vb-block-3');
  if (b3) { b3.innerHTML = ''; b3.hidden = true; }
  // Block 4 + 5 schon in v2.0 raus — falls noch im DOM, ausblenden.
  const b4 = $('#vb-block-4');
  if (b4) { b4.innerHTML = ''; b4.hidden = true; }
  const b5 = $('#vb-block-5');
  if (b5) { b5.innerHTML = ''; b5.hidden = true; }
}

/* --------------------------------------------------------------
   WEG-Hinweise (3 Stub-Inhalte)
   -------------------------------------------------------------- */

function renderWEGHinweise(input) {
  const wrap = $('#weg-hinweise');
  if (!wrap) return;
  const sichtbar = (input.eigentuemerTyp === 'WEG' && input.gebaeudetyp === 'MFH');
  console.log('[WEG] eigentuemerTyp:', input.eigentuemerTyp, '| gebaeudetyp:', input.gebaeudetyp,
              '| sichtbar:', sichtbar);
  wrap.hidden = !sichtbar;
  if (!sichtbar) return;

  const content = $('#weg-hinweise-content');
  if (!content) return;
  // Spec v2.0 §6: Tonalität „sollte" statt „muss" (Memory designsystem §6).
  // Beratungs-CTA wandert ans Ende der Seite (Sondersituations-CTA, einmal generisch).
  content.innerHTML = `
    <h4>Was sollte beschlossen werden?</h4>
    <p>Bei einer Heizungs-Erneuerung in einer WEG sind in der Regel drei Beschlüsse zu fassen:</p>
    <ol>
      <li><strong>Modernisierungs-Maßnahme</strong> — Auswahl der Heizungs-Option</li>
      <li><strong>Investitions-Volumen</strong> — Zustimmung zur Finanzierung (Sonderumlage oder Kreditaufnahme über die WEG)</li>
      <li><strong>Auftrags-Vergabe</strong> — Auswahl des Heizungsbauers / Versorgers</li>
    </ol>

    <h4>Welche Mehrheit?</h4>
    <p>Nach WEG-Reform 2020 (§ 19 ff. WEG):</p>
    <ul>
      <li>Modernisierende Erhaltungsmaßnahmen: einfache Mehrheit</li>
      <li>Modernisierungen i. S. v. § 22 WEG (z. B. Heizungs-Erneuerung): einfache Mehrheit, aber Kostenverteilung kann mit doppelt qualifizierter Mehrheit geändert werden</li>
      <li>Bauliche Veränderungen mit „grundlegender Umgestaltung": doppelt qualifizierte Mehrheit (drei Viertel der Eigentümer + mehr als die Hälfte der Miteigentumsanteile)</li>
    </ul>

    <h4>Welche Frist?</h4>
    <p>Die Einberufungs-Frist beträgt mindestens 3 Wochen. Bei Modernisierungs-Beschlüssen empfehlen wir 6 Wochen, um den Eigentümern Zeit zur Vorbereitung zu geben.</p>
  `;
}

/* --------------------------------------------------------------
   Empfehlungs-Banner + Headline-Antwort
   -------------------------------------------------------------- */

/* C2 v2.1: renderEmpfehlungsBanner GELÖSCHT — der Banner-Kommentar unter dem
   Big Picture wurde komplett entfernt (Spec §10 v2.1 / Daniel-Befund 04.05.).
   Empfehlungs-Wording lebt jetzt nur in renderHeadlineAntwort. */

function renderHeadlineAntwort(input, params) {
  const wrap = $('.headline-antwort');
  if (!wrap) return;
  const empf = berechneEmpfehlung(input, params);
  const tcoAlle = berechneTCOAlleOptionen(input, params);
  const beste = empf.beste;
  const tcoBeste = tcoAlle[beste].tco;
  const eqm = berechneEurProQmMonat(tcoBeste, input.wohnflaeche, input.zeitraum);

  wrap.innerHTML = `
    <h2>Deine Antwort</h2>
    <p>Die wirtschaftlichste Option für dein Profil ist
      <strong>${escapeHtml(OPTION_LABELS[beste])}</strong> mit
      <strong>${eqm.toFixed(2).replace('.', ',')} €/m²/Monat</strong> über
      <strong>${input.zeitraum} Jahre</strong> Betrachtung.</p>
  `;
}

/* --------------------------------------------------------------
   Risiko-Banner (Web-Schnell-Patch — Spec §3.9 v1.2 in Vorbereitung)
   -------------------------------------------------------------- */

function renderRisikoBanner(input, params) {
  const wrap = $('#risiko-banner');
  if (!wrap) return;

  const empf = berechneEmpfehlung(input, params);
  const beste = empf.beste;
  const banner = RISIKO_BANNER[beste];

  if (!banner) {
    // z. B. Pellets als beste — bewusst kein Banner (selten Empfehlung)
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }

  wrap.hidden = false;
  wrap.innerHTML = `
    <h3 class="risiko-banner__titel">${smartIcon()} ${escapeHtml(banner.titel)}</h3>
    <ul class="risiko-banner__punkte">
      ${banner.punkte.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
    </ul>
    <p class="risiko-banner__cta">${escapeHtml(banner.cta)}</p>
  `;
}

/* --------------------------------------------------------------
   Methodik-Tooltips befüllen
   -------------------------------------------------------------- */

function befuelleTooltips(scope) {
  const tips = $$('.info-tip[data-tip]', scope || document);
  tips.forEach(el => {
    const id = el.dataset.tip;
    const inhalt = methodikInhalte[id];
    const pop = el.querySelector('.info-tip__pop');
    if (!pop || !inhalt) return;
    if (pop.dataset.befuellt === id) return;  // schon befüllt
    pop.innerHTML = `
      <span class="info-tip__title">${escapeHtml(inhalt.titel)}</span>
      <pre class="info-tip__formel">${escapeHtml(inhalt.formel)}</pre>
      ${inhalt.annahmen && inhalt.annahmen.length ? `
        <strong>Annahmen:</strong>
        <ul>${inhalt.annahmen.map(a => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
      ` : ''}
      ${inhalt.quellen && inhalt.quellen.length ? `
        <span class="info-tip__src">Quellen: ${inhalt.quellen.map(q => escapeHtml(q)).join(' · ')}</span>
      ` : ''}
      ${inhalt.steigerung ? `<span class="info-tip__src">${escapeHtml(inhalt.steigerung)}</span>` : ''}
    `;
    pop.dataset.befuellt = id;
  });
}

/* C2 v2.1: renderProfiPills + oeffneProfiPillEditor + bindePersonaPickerHandlers
   + bindeProfiModusHandler GELÖSCHT — Erweiterter Modus komplett raus
   (Spec §16 / Daniel-Befund 04.05., eigener Energiepreis ist im Wizard). */

/* ==============================================================
   C2 v2.0 + v2.1 — RENDER-FUNKTIONEN
   ============================================================== */

/* --------------------------------------------------------------
   renderWirtschaftlichkeitsTabelle (Spec §5)
   Excel-Dashboard-Tab als HTML-Tabelle mit Pastell-Bewertung pro Zelle.
   Mobile: Karten-Stack (eine Karte pro Heizoption).
   Pellets konditional ausblenden bei !plausibel.
   -------------------------------------------------------------- */

function renderWirtschaftlichkeitsTabelle(input, params) {
  const wrap = $('#wirtschaftlichkeit-tabelle');
  if (!wrap) return;

  const dash = berechneAllDashboardKennzahlen(input, params);
  const pelletsOK = pelletsPlausibel(input, params);
  const optionen = pelletsOK
    ? ['gas', 'hybrid', 'wp', 'fw', 'pellets']
    : ['gas', 'hybrid', 'wp', 'fw'];

  // C2 v2.1 — kennzahlTyp ('kosten' | 'foerderung' | null) ersetzt 'richtung'
  // null = keine Pastell-Bewertung (z. B. CO₂-Emissionen Tonnen rein informativ).
  // Bruttoinvestition: editierbar (Inline-Editor) — Zelle bekommt zusätzliche Klasse.
  const ZEILEN = [
    { gruppe: 'Investition' },
    { key: 'bruttoinvest',       label: 'Bruttoinvestition',           fmt: 'euro',   kennzahlTyp: 'kosten', editierbar: true },
    { key: 'foerderung',         label: 'Fördersumme',                  fmt: 'euro',   kennzahlTyp: 'foerderung' },
    { key: 'nettoInvest',        label: 'Netto-Investition',            fmt: 'euro',   kennzahlTyp: 'kosten' },
    { key: 'sonderumlageProWE',  label: 'Sonderumlage pro Einheit',     fmt: 'euro',   kennzahlTyp: 'kosten' },
    { gruppe: 'Jahreskosten heute' },
    { key: 'jahreskostenJ1',     label: 'Energie + Wartung + CO₂',      fmt: 'euro',   kennzahlTyp: 'kosten' },
    { key: 'co2KostenP_a',       label: 'CO₂-Kosten p.a.',               fmt: 'euro',   kennzahlTyp: 'kosten' },
    { key: 'co2EmissionenP_a_t', label: 'CO₂-Emissionen p.a.',          fmt: 'tonne',  kennzahlTyp: 'kosten' },
    { gruppe: 'Wirtschaftlichkeit' },
    { key: 'gesamtAnnuitaet',    label: 'Gesamt-Annuität (€/a)',        fmt: 'euro',   kennzahlTyp: 'kosten' },
    { key: 'tcoBarwert',         label: 'TCO Barwert über Zeitraum',    fmt: 'euro',   kennzahlTyp: 'kosten' },
    { gruppe: 'Belastung' },
    { key: 'eurProQmMonat',      label: '€/m²/Monat ★',                 fmt: 'euroQm', kennzahlTyp: 'kosten' },
    { key: 'amortisationVsGas',  label: 'Amortisation vs. Gas',         fmt: 'jahre',  kennzahlTyp: 'kosten' }
  ];

  function fmt(wert, format) {
    if (wert == null) return '—';
    if (format === 'euro') return formatEuro(wert);
    if (format === 'tonne') return wert.toFixed(1).replace('.', ',') + ' t';
    if (format === 'euroQm') return wert.toFixed(2).replace('.', ',') + ' €';
    if (format === 'jahre') return wert === 0 ? '—' : (formatJahre(wert));
    return String(wert);
  }

  // Tooltip-Text pro Zelle: dynamische Erklärung der Pastell-Klassifikation
  function tooltipText(opt, wert, werteZeile, klasse, zeile) {
    if (klasse === 'pastell-ausgeschlossen') return 'Pellets ist in deiner Lage nicht plausibel und daher nicht Teil des Vergleichs.';
    if (klasse === 'pastell-neutral') return null;
    const aktive = werteZeile.filter(v => v != null && !isNaN(v));
    if (aktive.length < 2 || wert == null) return null;
    const istKosten = (zeile.kennzahlTyp || 'kosten') === 'kosten';
    const best = istKosten ? Math.min(...aktive) : Math.max(...aktive);
    if (best === 0 || Math.abs(best) < 1e-9) return null;
    const diffProz = Math.abs(wert - best) / Math.abs(best) * 100;
    const bestOption = optionen.find((o, i) => werteZeile[i] === best);
    const bestLabel = OPTION_LABELS[bestOption] || bestOption;
    const farbeText = klasse === 'pastell-vorteil' ? 'grün'
                    : klasse === 'pastell-hinweis' ? 'gelb'
                    : 'rot';
    return `<strong>${escapeHtml(zeile.label)}: ${escapeHtml(fmt(wert, zeile.fmt))} (${farbeText})</strong><br>`
         + `Zur besten Option <strong>${escapeHtml(bestLabel)}</strong> `
         + `(${escapeHtml(fmt(best, zeile.fmt))}) liegt diese Option `
         + `<strong>${diffProz.toFixed(1).replace('.',',')} %</strong> ${istKosten ? 'höher' : 'darunter'}.<br>`
         + `<em>Bei realistischeren Annahmen (Was-wäre-wenn-Schieberegler unten) kippt diese Bewertung typischerweise.</em>`;
  }

  // Header
  let thead = '<tr><th>Kennzahl</th>'
    + optionen.map(o => `<th>${escapeHtml(OPTION_LABELS[o])}</th>`).join('')
    + '</tr>';

  // Body
  let tbody = '';
  for (const zeile of ZEILEN) {
    if (zeile.gruppe) {
      tbody += `<tr class="dashboard-gruppe"><td colspan="${optionen.length + 1}">${escapeHtml(zeile.gruppe)}</td></tr>`;
      continue;
    }
    const werteZeile = optionen.map(o => dash[o][zeile.key]);
    const cells = optionen.map((o, i) => {
      const wert = werteZeile[i];
      const klasse = (zeile.kennzahlTyp == null)
        ? 'pastell-neutral'
        : bewerteZelle(wert, werteZeile, dash[o].plausibel, zeile.kennzahlTyp);
      // Inline-Editor-Klasse für Bruttoinvest (nur bei Modernisierungs-Optionen)
      const editKlasse = (zeile.editierbar && o !== 'gas' && dash[o].plausibel)
                          ? ' invest-zelle' : '';
      const dataAttr = (zeile.editierbar && o !== 'gas')
                        ? ` data-invest-option="${o}"` : '';
      const tip = tooltipText(o, wert, werteZeile, klasse, zeile);
      const tipHtml = tip ? `<span class="pastell-tip-pop">${tip}</span>` : '';
      return `<td class="${klasse}${editKlasse}"${dataAttr} tabindex="${tip ? '0' : ''}">`
           + `${escapeHtml(fmt(wert, zeile.fmt))}${tipHtml}</td>`;
    }).join('');
    tbody += `<tr><td>${escapeHtml(zeile.label)}</td>${cells}</tr>`;
  }

  wrap.innerHTML = `
    <div class="dashboard-kopf">
      <h3>Wirtschaftlichkeit im Vergleich</h3>
    </div>
    <div class="dashboard-tabelle-wrap">
      <table class="dashboard-tabelle">
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
      </table>
    </div>
  `;

  // Inline-Editor: Klick-Listener auf alle .invest-zelle binden
  $$('.invest-zelle', wrap).forEach(td => {
    td.addEventListener('click', () => oeffneInvestEditor(td));
  });
}

/* --------------------------------------------------------------
   C2 v2.1 — Inline-Editor für Bruttoinvestition (Spec §5.3)
   -------------------------------------------------------------- */

function oeffneInvestEditor(td) {
  const opt = td.dataset.investOption;
  if (!opt || !window.HE || !window.HE.state) return;
  const aktuell = (window.HE.state.bruttoInvest || {})[opt] || 0;
  const originalText = td.textContent;
  // Editor-HTML
  td.innerHTML = `
    <span class="invest-inline-editor">
      <button type="button" class="step" data-step="-5000" aria-label="−5.000">−</button>
      <input type="number" min="5000" step="1000" value="${aktuell}">
      <button type="button" class="step" data-step="5000" aria-label="+5.000">+</button>
      <button type="button" class="commit">OK</button>
    </span>
  `;
  const inp = td.querySelector('input');
  inp.focus(); inp.select();
  td.classList.remove('invest-zelle');  // während Edit kein erneutes Öffnen

  const commit = () => {
    const v = Number(inp.value);
    if (!isNaN(v) && v > 0) {
      window.HE.state.bruttoInvest = window.HE.state.bruttoInvest || {};
      window.HE.state.bruttoInvest[opt] = v;
      const tKey = 'bruttoInvest' + opt[0].toUpperCase() + opt.slice(1);
      window.HE.state.touched[tKey] = true;
      // Slider im Wizard sync (falls Wizard sichtbar)
      const slider = $('#f-brutto-' + opt);
      if (slider) slider.value = String(v);
      const out = $('#val-brutto-' + opt);
      if (out) out.textContent = formatEuro(v);
    }
    if (window.HE.dispatch) window.HE.dispatch();  // löst aktualisiereAllePanels aus
  };

  td.querySelectorAll('.step').forEach(b => b.addEventListener('click', e => {
    const delta = Number(e.currentTarget.dataset.step);
    inp.value = String(Math.max(5000, Number(inp.value) + delta));
  }));
  td.querySelector('.commit').addEventListener('click', commit);
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { td.innerHTML = originalText; td.classList.add('invest-zelle'); }
  });
}

/* --------------------------------------------------------------
   C2 v2.1 — Lese-Hilfe-Box (prominent, NICHT klappbar)
   Spec §5.4 + Memory designsystem §2
   -------------------------------------------------------------- */

function renderLeseHilfeBox(input, params) {
  const wrap = $('#lese-hilfe-box');
  if (!wrap) return;

  const er = berechneErhaltungsruecklageStatus(input, params);
  let erHTML = '';
  if (er) {
    const klassText = { unter: 'unter', im: 'im', ueber: 'über' }[er.klassifikation];
    const horiText = { 'reicht-nicht': 'reicht das nicht', knapp: 'reicht das knapp', gut: 'reicht das gut' }[er.horizontBewertung];
    erHTML = `<p class="erhaltung-status">
      <strong>Plausibilitäts-Hinweis Erhaltungsrücklage:</strong>
      Deine Rücklage ${er.proQmJahr.toFixed(2).replace('.',',')} €/m²/a liegt ${klassText} dem
      GdW-Richtwert ${er.gdwUnter}–${er.gdwOber} €/m²/a. Bei ${er.horizont}-Jahres-Plan ${horiText}.
    </p>`;
  }

  const pelletsOK = pelletsPlausibel(input, params);
  wrap.innerHTML = `
    <h4>Lese-Hilfe für die Tabelle</h4>
    <div class="pastell-legende">
      <span class="pastell-vorteil">Vorteil (≤ 5 % Abstand zur besten Option)</span>
      <span class="pastell-hinweis">Hinweis (5–25 % Abstand)</span>
      <span class="pastell-risiko">Risiko (> 25 % Abstand)</span>
    </div>
    <p class="status-quo-hinweis">
      ${smartIcon({klein:true})} Diese Bewertung gilt bei heutigen Marktpreisen.
      Bei realistischeren Risiko-Annahmen (siehe Was-wäre-wenn unten)
      kippt sie typischerweise zugunsten der Wärmepumpe.
    </p>
    ${erHTML}
    ${!pelletsOK ? '<p style="font-size:12px;color:var(--text-secondary);margin:0.4rem 0 0;">Pellets ist in deiner Lage nicht plausibel und nicht Teil des Vergleichs.</p>' : ''}
  `;
}

/* --------------------------------------------------------------
   renderSensibilisierungsBlock (Spec §7, 11 Punkte)
   Kontextblau-Hintergrund, Smart-Icon im Titel, sachliche Tonalität.
   -------------------------------------------------------------- */

function renderSensibilisierungsBlock() {
  const wrap = $('#sensibilisierungs-block');
  if (!wrap) return;

  const punkteHtml = SENSIBILISIERUNGS_PUNKTE.map((p, i) => `
    <li><strong>${escapeHtml(p.titel)}</strong> — ${escapeHtml(p.text)}</li>
  `).join('');

  wrap.innerHTML = `
    <h3 class="sensibilisierung__titel">${smartIcon()} Bedenke bei der Bewertung dieser Zahlen</h3>
    <p class="sensibilisierung__intro">
      Die Berechnung basiert auf heutigen Marktpreisen. Diese Faktoren können
      die Wirklichkeit über die Betrachtungszeit verschieben:
    </p>
    <ol class="sensibilisierung__punkte">
      ${punkteHtml}
    </ol>
    <p class="sensibilisierung__closer">
      Diese Faktoren sind bewusst nicht in der Default-Berechnung — die
      <a href="#excel-edition">Excel-Edition</a> modelliert sie als Sensitivitäts-Szenarien explizit.
    </p>
  `;
}

/* --------------------------------------------------------------
   renderBigPicture (Spec §9)
   Chart.js Radar, 6 Achsen, ein Dataset pro Heizoption.
   Risiko-Achse wird beim Render invertiert (100 - risiko-roh).
   Pellets-Linie ausblenden bei !plausibel.
   -------------------------------------------------------------- */

const BIG_PICTURE_ACHSEN_LABELS = [
  'Wirtschaftlichkeit',
  'Nachhaltigkeit',
  'Resilienz',
  'Erweiterbarkeit',
  'Zukunftsfähigkeit',
  'Risiko-Schutz'   // C2 v2.1: war "Risiko (invers)" — jetzt konsistent „hoch = gut"
];

const BIG_PICTURE_ACHSEN_TOOLTIPS = [
  'Berücksichtigt Investition, Förderung, Energie, Wartung, CO₂ über deinen Zeitraum. Hoch = wirtschaftlich.',
  'Niedrige CO₂-Emissionen pro Jahr. Bezug zu planetaren Grenzen — 422 ppm CO₂ in der Atmosphäre, Klimaneutralität 2045.',
  'Robustheit gegen Marktschocks und Versorgungsstörungen. Wie unabhängig bist du von Gas-Netz, Strom-Netz, Versorger-Monopol?',
  'Integrierbarkeit von PV, Batterie, Solarthermie, Wallbox. Kannst du dein System schrittweise erweitern?',
  'Politische Konformität (EPBD, GMG, kommunale Wärmeplanung). Wie gut passt deine Lösung zu kommenden gesetzlichen Anforderungen?',
  'Wie gut bist du gegen Stranded-Asset, regulatorische Sprünge, Kostenexplosion abgesichert? Hoch = geschützt.'
];

function renderBigPicture(input, params) {
  const canvas = $('#chart-big-picture-canvas');
  if (!canvas || typeof Chart === 'undefined') return;

  const achsen = berechneBigPictureAchsen(input, params);
  const pelletsOK = pelletsPlausibel(input, params);
  const optionen = pelletsOK
    ? ['gas', 'hybrid', 'wp', 'fw', 'pellets']
    : ['gas', 'hybrid', 'wp', 'fw'];

  const datasets = optionen.map(opt => {
    const a = achsen[opt];
    return {
      label: OPTION_LABELS[opt],
      data: [
        a.wirtschaftlichkeit,
        a.nachhaltigkeit,
        a.resilienz,
        a.erweiterbarkeit,
        a.zukunftsfaehigkeit,
        100 - a.risikoRoh   // C2 v2.1 Risiko-Schutz: hoch = geschützt = gut (konsistent zu allen Achsen)
      ],
      borderColor: CHART_FARBEN[opt],
      backgroundColor: CHART_FARBEN[opt] + '33',
      borderWidth: 2,
      pointRadius: 3,
      fill: true
    };
  });

  const config = {
    type: 'radar',
    data: { labels: BIG_PICTURE_ACHSEN_LABELS, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        title: { display: true, text: 'Big Picture — sechs Achsen, fünf Optionen' },
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: { label: ctx => `${ctx.dataset.label}: ${Math.round(ctx.parsed.r)}` }
        }
      },
      scales: {
        r: {
          min: 0, max: 100,
          ticks: { display: false, stepSize: 20 },
          pointLabels: { font: { size: 11 } }
        }
      }
    }
  };

  if (charts.has('bigpicture')) {
    const c = charts.get('bigpicture');
    c.data.labels = BIG_PICTURE_ACHSEN_LABELS;
    c.data.datasets = datasets;
    c.update('none');
  } else {
    charts.set('bigpicture', new Chart(canvas.getContext('2d'), config));
  }

  // C2 v2.1: Achs-Tooltip-Liste neben/unter dem Chart rendern
  // (Chart.js v4 hat keine pointLabels-Tooltips — Pattern unter dem Chart)
  let legende = $('#bigpicture-achsen-legende');
  if (!legende) {
    legende = document.createElement('div');
    legende.id = 'bigpicture-achsen-legende';
    legende.className = 'bigpicture-achsen-legende';
    canvas.parentElement.parentElement.insertBefore(legende, canvas.parentElement.nextSibling);
  }
  if (legende.dataset.gerendert !== 'true') {
    legende.innerHTML = '<strong>Was misst welche Achse?</strong> '
      + BIG_PICTURE_ACHSEN_LABELS.map((label, i) =>
          `<span class="bp-achs-tip" tabindex="0">${escapeHtml(label)} ⓘ`
          + `<span class="bp-achs-pop">${escapeHtml(BIG_PICTURE_ACHSEN_TOOLTIPS[i])}</span></span>`
        ).join(' · ');
    legende.dataset.gerendert = 'true';
  }
}

/* --------------------------------------------------------------
   C2 v2.1 — renderZukunftsszenarioFeld (Spec §9.3)
   Spalte C im Was-wäre-wenn — 5 Aussagen Vorher/Nachher.
   Im Default-Zustand (keine Schieberegler bewegt) ist Vorher=Nachher,
   blasse "aktuelle Lage"-Anzeige. Sobald A oder B bewegt: Pfeile + Delta.
   -------------------------------------------------------------- */

function renderZukunftsszenarioFeld(input, params) {
  const wrap = $('#zukunftsszenario');
  if (!wrap) return;

  const z = berechneZukunftsszenarioAussagen(input, params);
  const dimm = z.imDefaultZustand ? ' style="opacity:0.7"' : '';
  const intro = z.imDefaultZustand
    ? '<p class="imdefault-hinweis">Bewege links die Schieberegler — hier siehst du den Effekt.</p>'
    : '';

  function pfeil(delta, einheit, kostenLogik) {
    if (delta == null || Math.abs(delta) < 1e-9) return '<span class="aussage__delta">±0</span>';
    const ist_neg_gut = (kostenLogik === 'kosten');
    const istVerschlechterung = (delta > 0 && ist_neg_gut) || (delta < 0 && !ist_neg_gut);
    const klasse = istVerschlechterung ? 'aussage__delta--rot' : '';
    const richtung = delta > 0 ? '+' : '−';
    return `<span class="aussage__delta ${klasse}">${richtung}${einheit(Math.abs(delta))}</span>`;
  }
  const eu = (n) => formatEuro(n);
  const eqm = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const jahre = (n) => n.toFixed(0) + ' J';

  // 1) €/m²/Monat beste Option
  const a1 = z.eurQmAussage;
  const aussage1 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">€/m²/Monat beste Option</div>
      <div class="aussage__werte">
        ${escapeHtml(OPTION_LABELS[a1.bestOptionNeu])} ${a1.neu.toFixed(2).replace('.', ',')} €
        ${z.imDefaultZustand ? '' : `(war ${a1.ist.toFixed(2).replace('.', ',')} €) ${pfeil(a1.delta, eqm, 'kosten')}`}
      </div>
    </div>
  `;

  // 2) Beste-Option-Ranking
  const a2 = z.rankingAussage;
  const aussage2 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">Beste Option ${a2.kippt ? '<span class="aussage__delta aussage__delta--rot">↻ kippt!</span>' : ''}</div>
      <div class="aussage__werte">
        Aktuell: ${escapeHtml(OPTION_LABELS[a2.neu[0]] || '—')}
        ${z.imDefaultZustand ? '' : ` (war: ${escapeHtml(OPTION_LABELS[a2.ist[0]] || '—')})`}
      </div>
      <div class="aussage__detail">Reihenfolge: ${a2.neu.map(o => OPTION_LABELS[o] || o).join(' › ')}</div>
    </div>
  `;

  // 3) Mieter-Nebenkosten
  const a3 = z.mieterAussage;
  const aussage3 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">Mieter-Nebenkosten-Effekt</div>
      <div class="aussage__werte">
        ${a3.neu.toFixed(2).replace('.', ',')} €/Monat
        ${z.imDefaultZustand ? '' : `(war ${a3.ist.toFixed(2).replace('.', ',')} €) ${pfeil(a3.delta, eqm, 'foerderung')}`}
      </div>
      ${a3.fallbackAnteil ? '<div class="aussage__detail">Anteil 1/Wohneinheiten — eigene Wohnungsgröße im Wizard für genaue Werte.</div>' : ''}
    </div>
  `;

  // 4) Amortisation WP vs Gas
  const a4 = z.amortAussage;
  const aussage4 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">Amortisation Wärmepumpe vs. Gas</div>
      <div class="aussage__werte">
        ${a4.neu == null ? 'nicht erreicht' : (a4.neu + ' Jahre')}
        ${z.imDefaultZustand || a4.delta == null ? '' :
          `(war ${a4.ist == null ? 'nicht erreicht' : (a4.ist + ' J')}) ${pfeil(a4.delta, jahre, 'kosten')}`}
      </div>
    </div>
  `;

  // 5) Betriebskosten Status quo Gas
  const a5 = z.betriebsAussage;
  const aussage5 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">Betriebskosten Gas-Status-quo (Jahr 1)</div>
      <div class="aussage__werte">
        ${formatEuro(a5.neu)}/Jahr
        ${z.imDefaultZustand ? '' : `(war ${formatEuro(a5.ist)}) ${pfeil(a5.delta, eu, 'kosten')}`}
      </div>
    </div>
  `;

  wrap.innerHTML = `
    <h3>${smartIcon({klein:true})} Was sich verändert</h3>
    ${intro}
    ${aussage1}${aussage2}${aussage3}${aussage4}${aussage5}
  `;
}

/* --------------------------------------------------------------
   renderExcelEditionSektion (Spec §11)
   4 Referenzbild-Kacheln + 3-Spalten-Tarif-Vergleich.
   Statisch — Inhalte ändern sich nicht durch State.
   -------------------------------------------------------------- */

function renderExcelEditionSektion() {
  const wrap = $('#excel-edition-sektion');
  if (!wrap) return;
  if (wrap.dataset.gerendert === 'true') return;  // einmal reicht

  wrap.innerHTML = `
    <div class="excel-edition__intro">
      <h2>Du willst noch tiefer rechnen — für Profis und Analysten</h2>
      <p>Wenn der Web-Rechner zu wenig ist und du selbst rechnen möchtest,
         in Ruhe, zu Hause, mit allen Hebeln und Quellen — hier ist deine
         Werkzeug-Erweiterung.</p>
    </div>

    <div class="excel-edition__kacheln">
      <a class="excel-kachel" href="/excel-edition.html">
        <img src="assets/excel-vorschau/tco-detail.svg" alt="TCO Detail" loading="lazy">
        <h4>TCO Detail</h4>
        <p>Komponenten, Annuität, Methodik nach VDI 2067.</p>
      </a>
      <a class="excel-kachel" href="/excel-edition.html">
        <img src="assets/excel-vorschau/cashflow-25j.svg" alt="Cashflow 25 J" loading="lazy">
        <h4>Cashflow 25 J</h4>
        <p>Volle Jahres-Tabelle pro Option.</p>
      </a>
      <a class="excel-kachel" href="/excel-edition.html">
        <img src="assets/excel-vorschau/sanierungspfad.svg" alt="Sanierungspfad" loading="lazy">
        <h4>Sanierungspfad</h4>
        <p>Erhaltungsrücklage, Investitions-Plan über die Zeit.</p>
      </a>
      <a class="excel-kachel" href="/excel-edition.html">
        <img src="assets/excel-vorschau/sensitivitaet.svg" alt="Sensitivitätsanalyse" loading="lazy">
        <h4>Sensitivitätsanalyse</h4>
        <p>CO₂-Pfade, Gas-Subventionen, Stranded-Asset-Szenarien.</p>
      </a>
    </div>

    <!-- C2 v2.1: 2-Spalten-Tarif-Vergleich, 49 € jährlich (kein Update-Preis-Modell),
         Web-Spalte ohne ✗-Liste, Excel-Spalte mit PV/Batterie/Solarthermie als Mehrwert. -->
    <div class="excel-edition__tarif">
      <div class="excel-tarif-spalte">
        <h4>Web</h4>
        <p class="excel-tarif-preis">kostenlos</p>
        <p class="excel-tarif-preis-sub">0 €</p>
        <ul>
          <li>✓ Dashboard-Vergleich</li>
          <li>✓ Sensibilisierung fossile Energie</li>
          <li>✓ Big Picture (6 Achsen)</li>
          <li>✓ Was-wäre-wenn (Energiepreise + Förderung + Zukunftsszenario)</li>
          <li>✓ Mieter-Nebenkosten-Effekt</li>
          <li>✓ TCO Barwert</li>
          <li>✓ Vermieter-Bilanz Block 1+2</li>
        </ul>
      </div>
      <div class="excel-tarif-spalte excel-tarif-spalte--haupt">
        <h4>Excel-Edition</h4>
        <p class="excel-tarif-preis">jährlich</p>
        <p class="excel-tarif-preis-sub">49 €</p>
        <ul>
          <li>✓ Alle Web-Inhalte</li>
          <li>✓ Vermögensbilanz Block 3</li>
          <li>✓ Volle Cashflow-Tabelle pro Jahr</li>
          <li>✓ Sanierungspfad-Tab</li>
          <li>✓ §7b AfA Detail</li>
          <li>✓ Mietspiegel-Klassen-Lookup</li>
          <li>✓ KfW-Kombi-Modell</li>
          <li>✓ Tab Risiken / CO₂-Aufteilung / Fernwärme-Logik</li>
          <li>✓ <strong>PV / Batterie / Solarthermie</strong></li>
          <li>✓ Sensitivität frei wählbar</li>
          <li>✓ Direktversand per E-Mail</li>
        </ul>
        <a class="btn btn--primary" href="/excel-edition.html">Excel kaufen — 49 €</a>
      </div>
    </div>
  `;
  wrap.dataset.gerendert = 'true';
}

/* --------------------------------------------------------------
   renderWegweiserScrollRegal (Spec §12, Memory designsystem §5)
   Horizontales Scroll-Regal mit 5 Karten.
   -------------------------------------------------------------- */

const WEGWEISER_KARTEN = [
  { titel: 'BAFA',
    sub:    'Förderung beantragen',
    text:   'Hol dir, was dir zusteht. Antrag direkt im Portal.',
    url:    'https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/effiziente_gebaeude_node.html' },
  { titel: 'KfW',
    sub:    'Kredit prüfen',
    text:   'Zinsgünstige Kredite und Tilgungszuschuss zur BAFA dazu.',
    url:    'https://www.kfw.de' },
  { titel: 'Solarrechner',
    sub:    'Thüringen',
    text:   'Wieviel Strom dein Dach realistisch erzeugen könnte.',
    url:    'https://www.solarrechner-thueringen.de/#s=startscreen' },
  { titel: 'Verbraucher-Zentrale',
    sub:    'Beratung',
    text:   'Kostenlos und unabhängig — eine zweite Meinung.',
    url:    'https://www.verbraucherzentrale-energieberatung.de/' },
  { titel: 'SWE Erfurt',
    sub:    'Stadtwerke',
    text:   'Lokaler Versorger für Strom, Gas, Fernwärme.',
    url:    'https://www.stadtwerke-erfurt.de/' }
];

function renderWegweiserScrollRegal() {
  const wrap = $('#wegweiser-regal');
  if (!wrap) return;
  if (wrap.dataset.gerendert === 'true') return;

  wrap.innerHTML = WEGWEISER_KARTEN.map(k => `
    <a class="wegweiser-karte" href="${escapeHtml(k.url)}" target="_blank" rel="noopener">
      <h4>${escapeHtml(k.titel)}</h4>
      <p class="wegweiser-karte__sub">${escapeHtml(k.sub)}</p>
      <p class="wegweiser-karte__text">${escapeHtml(k.text)}</p>
    </a>
  `).join('');
  wrap.dataset.gerendert = 'true';
}

/* --------------------------------------------------------------
   renderSondersituationsCTA (Spec §13)
   Generischer CTA am Ende der Seite, ein Button "Meine Analyse senden".
   -------------------------------------------------------------- */

function renderSondersituationsCTA() {
  const wrap = $('#sondersituations-cta');
  if (!wrap) return;
  if (wrap.dataset.gerendert === 'true') return;

  // C2 v2.1 Format-Fix (Spec §13): Kontextblau-Hintergrund, mittig, Signal-Grün-Button,
  // KEIN Smart-Icon im Titel (PowerPoint-Eindruck vermeiden — Daniel-Befund 04.05.).
  wrap.innerHTML = `
    <h2 class="sondersituation__titel">Du hast eine Sondersituation?</h2>
    <p>
      Vielleicht planst du eine Eigentümerversammlung zur Heizungs-Modernisierung.
      Oder du fragst dich, wie deine WEG die Sonderumlage verteilt nach MEA-Anteilen.
      Oder du möchtest dein Sanierungs-Konzept mit Energieberater abstimmen, bevor
      du eine Investition tätigst. Oder du hast eine ganz andere Frage, die der
      Web-Rechner nicht beantwortet.
    </p>
    <p>Schreib uns — wir lesen, wir antworten, wir begleiten dich.</p>
    <p class="sondersituation__mail"><a href="mailto:dialog@hausentscheider.de">dialog@hausentscheider.de</a></p>
    <button type="button" class="btn--analyse" id="cta-analyse-senden-v2">Meine Analyse senden</button>
    <p class="sondersituation__hint">
      Erste Antwort kostenlos — tiefere Beratung sprechen wir projektbasiert ab.
    </p>
  `;
  // Button-Click → bestehende mailto-Logik aus rechner.html (cta-dialog-mail)
  const btn = $('#cta-analyse-senden-v2');
  if (btn) {
    btn.addEventListener('click', () => {
      const orig = $('#cta-dialog-mail');
      if (orig) orig.click();
    });
  }
  wrap.dataset.gerendert = 'true';
}

/* --------------------------------------------------------------
   renderTooltipFromGlossar — einheitliches Tooltip-Pattern
   für Abkürzungen / Begriffe (Spec §17 Punkt 4, designsystem §4)
   -------------------------------------------------------------- */

function renderTooltipFromGlossar(scope) {
  // Suche nach .begriff-tooltip[data-tip] Elemente und befülle
  const tips = $$('.begriff-tooltip[data-tip]', scope || document);
  tips.forEach(el => {
    const id = el.dataset.tip;
    const eintrag = getGlossarEintrag(id);
    if (!eintrag) return;
    if (el.dataset.befuellt === id) return;
    const ikon = eintrag.smart ? smartIcon({klein:true}) : '<span class="info-icon">ⓘ</span>';
    const popOriginal = el.querySelector('.glossar-pop');
    const innerHTML = `
      ${ikon}
      <span class="glossar-pop">
        <strong>${escapeHtml(eintrag.lang)}</strong><br>
        ${escapeHtml(eintrag.text)}
        ${eintrag.quelle ? `<br><small>Quelle: ${escapeHtml(eintrag.quelle)}</small>` : ''}
      </span>
    `;
    // Original-Begriff erhalten (steht vor dem Pop-Element)
    const begriffText = el.textContent.trim();
    el.innerHTML = escapeHtml(begriffText) + innerHTML;
    el.dataset.befuellt = id;
  });
}

/* --------------------------------------------------------------
   Aktualisierung aller Panels
   -------------------------------------------------------------- */

let rafScheduled = false;
function aktualisiereAllePanels() {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    rafScheduled = false;
    const input = getInput();
    const params = getParams();
    if (!input || !params) return;
    if (window.HE.state.phase !== 'ergebnis') return;

    const t0 = performance.now();
    // C2 v2.1 — Render-Reihenfolge:
    // Headline-Antwort → Risiko-Banner → Wirtschaftlichkeits-Tabelle (mit Inline-Editor + Tooltip pro Zelle)
    // → Lese-Hilfe-Box (NEU prominent) → Sensibilisierungs-Block → Vermieter-Bilanz Block 1+2
    // → WEG-Hinweise → [keine Panel 2/3] → Was-wäre-wenn 3 Spalten (Spalte C Zukunftsszenario NEU)
    // → Big Picture (Risiko-Schutz statt invers) → Excel-Edition (49 € jährlich)
    // → Wegweiser → Sondersituations-CTA (Format-Fix Kontextblau + Signal-Grün)
    renderHeadlineAntwort(input, params);
    renderRisikoBanner(input, params);
    renderWirtschaftlichkeitsTabelle(input, params);
    renderLeseHilfeBox(input, params);
    renderSensibilisierungsBlock();
    renderVermieterBilanz(input, params);
    renderWEGHinweise(input);
    renderZukunftsszenarioFeld(input, params);
    renderBigPicture(input, params);
    renderExcelEditionSektion();
    renderWegweiserScrollRegal();
    renderSondersituationsCTA();
    renderTooltipFromGlossar();
    // ENTFERNT in v2.1: renderHeadlineKPIs, renderEmpfehlungsBanner-unter-BigPicture,
    //                   renderCashflowKurve, renderTCOVergleich, renderVorgeschmackAufklapper,
    //                   renderProfiPills, Vermögensbilanz Block 3
    const t1 = performance.now();
    if (t1 - t0 > 100) {
      console.warn('[ergebnis.js] Re-Render dauerte', Math.round(t1 - t0), 'ms (Ziel < 100 ms)');
    }
  });
}

/* --------------------------------------------------------------
   Init — Listener auf state-changed-Events
   -------------------------------------------------------------- */

function init() {
  window.addEventListener('he:state-changed', aktualisiereAllePanels);

  // Falls HE schon initialisiert ist (rechner.html hat loadJSON abgeschlossen),
  // sofort einmal rendern.
  if (window.HE && window.HE.state && window.HE.config && window.HE.config.loaded) {
    aktualisiereAllePanels();
    // Verifikations-Lauf für Daniel sichtbar in Konsole
    runVerifikation(window.HE.config.parameter);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Globale Hooks für rechner.html
window.HE_ergebnis = {
  aktualisiereAllePanels,
  runVerifikation
};
