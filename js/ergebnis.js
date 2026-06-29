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
    cta: 'Profi-Modus aktivieren: JAZ-Override mit Ihrem Datenblatt-Wert minus 0,3 testen.'
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
    cta: 'Schauen Sie sich Hybrid und Wärmepumpe als Alternative an — Schieberegler nutzen.'
  }
};

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
  const dash = berechneAllDashboardKennzahlen(input, params);
  const beste = empf.beste;
  const tcoBeste = tcoAlle[beste].tco;
  const eqm = berechneEurProQmMonat(tcoBeste, input.wohnflaeche, input.zeitraum);

  // KPI „Tendenz": Abstand zur Status-quo-Gas-Option aus vorhandenen TCO-Werten (keine neue Rechnung).
  const tcoGas = (tcoAlle['gas'] && tcoAlle['gas'].tco) ? tcoAlle['gas'].tco : null;
  let tendenz;
  if (beste !== 'gas' && tcoGas) {
    const deltaPct = Math.round((tcoGas - tcoBeste) / tcoGas * 100);
    tendenz = (deltaPct >= 0
      ? '<span class="kpi3__arrow kpi3__arrow--down">&#8595;</span> '
      : '<span class="kpi3__arrow kpi3__arrow--up">&#8593;</span> ') + Math.abs(deltaPct) + ' %';
  } else {
    tendenz = 'Status quo';
  }

  // KPI CO₂ der besten Option (t/a)
  const co2t = (dash[beste] && dash[beste].co2EmissionenP_a_t != null) ? dash[beste].co2EmissionenP_a_t : null;
  const co2Txt = (co2t != null) ? (co2t.toFixed(1).replace('.', ',') + ' t/a') : '—';

  // Heizspiegel-Einordnung des €/m²/Monat (Bundesschnitt Gas-MFH ≈ 1,2–1,4)
  const hsLabel = eqm < 1.0 ? 'niedrig' : (eqm <= 1.5 ? 'im Schnitt' : 'erhöht');

  wrap.innerHTML = `
    <h2>Ihre Antwort</h2>
    <p>Die wirtschaftlichste Option für Ihr Profil ist
      <strong>${escapeHtml(OPTION_LABELS[beste])}</strong> — drei Kennzahlen über
      <strong>${input.zeitraum} Jahre</strong>:</p>
    <div class="kpi3">
      <div class="kpi3__item">
        <div class="kpi3__val">${eqm.toFixed(2).replace('.', ',')}<span class="kpi3__unit"> €/m²·Mon.</span></div>
        <div class="kpi3__lbl">Wärmekosten — <strong>${hsLabel}</strong></div>
      </div>
      <div class="kpi3__item">
        <div class="kpi3__val">${tendenz}</div>
        <div class="kpi3__lbl">ggü. Gas (Status quo)</div>
      </div>
      <div class="kpi3__item">
        <div class="kpi3__val">${co2Txt}</div>
        <div class="kpi3__lbl">CO₂-Ausstoß</div>
      </div>
    </div>
    <p class="kpi3__ref">Heizspiegel-Einordnung: Bundesschnitt Gas im Mehrfamilienhaus ≈ 1,2–1,4 €/m²·Monat (Heizung inkl. Warmwasser, 2024/25).</p>
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
    { gruppe: 'Wirtschaftlichkeit', tip: 'Vergleich der Gesamtbelastung je Option — je niedriger, desto wirtschaftlicher über die gewählte Betrachtungszeit.' },
    { key: 'gesamtAnnuitaet',    label: 'Gesamt-Annuität (€/a)',        fmt: 'euro',   kennzahlTyp: 'kosten',
      tip: 'Die jährliche Gesamtbelastung aus Investition und Betrieb, gleichmäßig über die Betrachtungszeit verteilt (Methode nach VDI 2067).' },
    { key: 'tcoBarwert',         label: 'TCO Barwert über Zeitraum',    fmt: 'euro',   kennzahlTyp: 'kosten',
      tip: 'TCO = Total Cost of Ownership: alle Kosten über die Betrachtungszeit, auf heute abgezinst (Barwert). Macht Optionen mit unterschiedlichem Investitions- und Betriebskosten-Mix vergleichbar.' },
    { gruppe: 'Belastung' },
    { key: 'eurProQmMonat',      label: '€/m²/Monat ★',                 fmt: 'euroQm', kennzahlTyp: 'kosten' },
    { key: 'amortisationVsGas',  label: 'Amortisation vs. Gas',         fmt: 'jahre',  kennzahlTyp: 'kosten',
      tip: 'Nach wie vielen Jahren die Mehr-Investition gegenüber einer Gasheizung durch niedrigere Betriebskosten wieder eingespielt ist.' }
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
    if (klasse === 'pastell-ausgeschlossen') return 'Pellets ist in Ihrer Lage nicht plausibel und daher nicht Teil des Vergleichs.';
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

  // Kurz-Erklärung als „?"-Tooltip (inline, kein Glossar-Lookup nötig)
  function tipSpan(text){
    return ' <span class="info-tip" tabindex="0" aria-label="Erklärung">ⓘ<span class="info-tip__pop">'
      + escapeHtml(text) + '</span></span>';
  }

  // Header
  let thead = '<tr><th>Kennzahl</th>'
    + optionen.map(o => `<th>${escapeHtml(OPTION_LABELS[o])}</th>`).join('')
    + '</tr>';

  // Body
  let tbody = '';
  for (const zeile of ZEILEN) {
    if (zeile.gruppe) {
      tbody += `<tr class="dashboard-gruppe"><td colspan="${optionen.length + 1}">${escapeHtml(zeile.gruppe)}${zeile.tip ? tipSpan(zeile.tip) : ''}</td></tr>`;
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
    tbody += `<tr><td>${escapeHtml(zeile.label)}${zeile.tip ? tipSpan(zeile.tip) : ''}</td>${cells}</tr>`;
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
      Ihre Rücklage ${er.proQmJahr.toFixed(2).replace('.',',')} €/m²/a liegt ${klassText} dem
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
    ${!pelletsOK ? '<p style="font-size:12px;color:var(--text-secondary);margin:0.4rem 0 0;">Pellets ist in Ihrer Lage nicht plausibel und nicht Teil des Vergleichs.</p>' : ''}
  `;
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
    ? '<p class="imdefault-hinweis">Bewegen Sie links die Schieberegler — hier sehen Sie den Effekt.</p>'
    : '';

  function pfeil(delta, einheit, kostenLogik) {
    if (delta == null || Math.abs(delta) < 1e-9) return '<span class="aussage__delta aussage__delta--neutral">±0</span>';
    const schlecht = (delta > 0 && kostenLogik === 'kosten') || (delta < 0 && kostenLogik !== 'kosten');
    const klasse = schlecht ? 'aussage__delta--schlecht' : 'aussage__delta--gut';
    const pf = delta > 0 ? '↑' : '↓';
    return `<span class="aussage__delta ${klasse}">${pf} ${einheit(Math.abs(delta))}</span>`;
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
        ${z.imDefaultZustand ? '' : pfeil(a1.delta, eqm, 'kosten')}
      </div>
    </div>
  `;

  // 2) Beste-Option-Ranking
  const a2 = z.rankingAussage;
  const aussage2 = `
    <div class="aussage"${dimm}>
      <div class="aussage__titel">Beste Option ${a2.kippt ? '<span class="aussage__delta aussage__delta--schlecht">↻ kippt!</span>' : ''}</div>
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
        ${z.imDefaultZustand ? '' : pfeil(a3.delta, eqm, 'foerderung')}
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
        ${z.imDefaultZustand || a4.delta == null ? '' : pfeil(a4.delta, jahre, 'kosten')}
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
        ${z.imDefaultZustand ? '' : pfeil(a5.delta, eu, 'kosten')}
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
    <div class="beratung-box">
      <h2>Bevor Sie eine große Entscheidung treffen — eine neutrale Einordnung</h2>
      <p>Zwischen einer allgemeinen Energieberatung (oft zu unverbindlich) und einem beauftragten
        Ingenieurbüro (gründlich, aber teuer und komplex) klafft eine Lücke.
        <strong>Genau dort setze ich an — unabhängig, neutral, ohne eigenes Produkt.</strong></p>
      <p>Ein Heizungsbauer verkauft, was er im Sortiment hat. Ich verkaufe nichts. Ich helfe Ihnen,
        aus Ihren Gebäudedaten und einem ehrlichen Vergleich die <strong>bestmögliche, langfristig
        tragfähige Entscheidung</strong> abzuleiten — auf Basis belegter Zahlen und meiner
        Forschungsarbeit zur ganzheitlichen Zukunftsfähigkeit von Gebäuden.</p>
      <p class="beratung-box__sub">Womit ich Sie begleite:</p>
      <ul class="beratung-box__liste">
        <li><strong>Entscheidungsgrundlagen</strong> für langfristige Investitionen — verständlich aufbereitet</li>
        <li><strong>Eigentümerversammlungen</strong> vor- und nachbereiten; verschiedene Perspektiven zu einer gemeinsamen Grundlage verbinden</li>
        <li><strong>Orientierung</strong> im ständig wechselnden Rahmen (Energiewende, Heizungs- und Gebäudemodernisierungs-Anforderungen)</li>
      </ul>
      <p>Für Eigentümergemeinschaften wie für einzelne Eigentümer — eine ruhige, neutrale Orientierung,
        bevor viel Geld in die falsche Richtung fließt.</p>
      <p>Schreiben Sie mir — die <strong>erste Antwort ist kostenlos</strong>, tiefere Begleitung sprechen wir projektbasiert ab.</p>
      <p class="beratung-box__mail"><a href="mailto:dialog@hausentscheider.de">dialog@hausentscheider.de</a></p>
      <button type="button" class="btn--analyse" id="cta-beratung-senden">Meine Analyse senden</button>
    </div>
  `;
  const btn = $('#cta-beratung-senden');
  if (btn) {
    btn.addEventListener('click', () => {
      const orig = $('#cta-dialog-mail');
      if (orig) orig.click();
    });
  }
  wrap.dataset.gerendert = 'true';
}

/* --------------------------------------------------------------
   renderSondersituationsCTA (Spec §13)
   Generischer CTA am Ende der Seite, ein Button "Meine Analyse senden".
   -------------------------------------------------------------- */

function renderSondersituationsCTA() {
  // P2-B4: in die Beratungs-Box (oben) konsolidiert — separater CTA entfällt.
  const wrap = $('#sondersituations-cta');
  if (wrap) { wrap.innerHTML = ''; wrap.hidden = true; }
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
    renderZukunftsszenarioFeld(input, params);
    renderExcelEditionSektion();
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
