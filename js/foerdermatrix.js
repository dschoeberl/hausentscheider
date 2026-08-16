/* --------------------------------------------------------------
   Fördermatrix — rechenbare Darstellung statt Förder-Prosa

   Einbau in der Seite:
     <div data-foerdermatrix></div>              auf hellem Grund
     <div data-foerdermatrix data-dunkel></div>  auf dunklem Grund

   Kein Fördersatz und kein Stichtag steht in dieser Datei.
   Sätze, Stichtage und Höchstkosten kommen aus
   daten/parameter.json, Block "foerdersaetze".
   Vorbelegung der Eingaben aus daten/theaterstrasse-4.json, Block "wirtschaft".
   Nicht aus Block "rechner" — der gehoert dem Objektprofil-Rechner und fuehrt
   bewusst andere Investitionswerte (siehe Kommentare in der JSON).
   -------------------------------------------------------------- */
(function () {
  'use strict';

  var CSS = [
    '.fm{font-family:"Inter",sans-serif;margin:1.2rem 0 0;color:var(--fm-text);}',
    '.fm__satz{color:var(--fm-text);}',
    '.fm__vorbelegung{margin:0 0 0.7rem;font-size:11.5px;line-height:1.5;color:var(--fm-lbl);}',
    '.fm__eingaben{display:flex;flex-wrap:wrap;gap:0.75rem 1.1rem;align-items:flex-end;margin:0 0 0.9rem;}',
    '.fm__feld{display:flex;flex-direction:column;gap:3px;}',
    '.fm__feld label{font-size:10.5px;letter-spacing:0.4px;text-transform:uppercase;color:var(--fm-lbl);}',
    '.fm__feld input[type=number]{width:8.5rem;padding:0.35rem 0.5rem;font-family:inherit;font-size:13px;',
    'border:1px solid var(--fm-rand);border-radius:4px;background:var(--fm-feld-bg);color:var(--fm-text);}',
    '.fm__schalter{display:flex;align-items:center;gap:0.45rem;font-size:12px;color:var(--fm-text);padding-bottom:0.35rem;}',
    '.fm__schalter input{accent-color:var(--petrol);}',
    '.fm__schalter small{color:var(--fm-lbl);font-size:10.5px;}',
    '.fm table{width:100%;border-collapse:collapse;font-size:13px;}',
    '.fm th,.fm td{padding:0.5rem 0.6rem;text-align:left;vertical-align:top;border:1px solid var(--fm-rand);}',
    '.fm thead th{font-size:11px;letter-spacing:0.4px;text-transform:uppercase;color:var(--fm-lbl);font-weight:600;background:var(--fm-kopf);}',
    '.fm thead th small{display:block;margin-top:3px;font-size:10px;letter-spacing:0;text-transform:none;font-weight:400;line-height:1.4;opacity:0.85;}',
    '.fm__bed{display:block;margin-top:6px;padding-top:5px;border-top:1px solid var(--fm-rand);font-size:11px;line-height:1.4;color:var(--fm-lbl);}',
    '.fm__bed b{color:var(--fm-text);font-weight:700;}',
    '.fm tbody th{font-weight:600;color:var(--fm-text);font-size:12.5px;line-height:1.35;background:var(--fm-kopf);}',
    '.fm tbody th small{display:block;font-weight:400;color:var(--fm-lbl);font-size:11px;margin-top:2px;}',
    '.fm__satz{display:block;font-size:19px;font-weight:700;line-height:1.1;}',
    '.fm__netto{display:block;font-size:12.5px;color:var(--fm-text);margin-top:3px;}',
    '.fm__abw{display:block;font-size:11px;color:var(--fm-lbl);margin-top:1px;}',
    '.fm td.is-voll{background:var(--fm-gruen);}',
    '.fm td.is-halb{background:var(--fm-ocker);}',
    '.fm td.is-null{background:var(--fm-rot);}',
    '.fm__heute{display:inline-block;margin-top:4px;font-size:9.5px;letter-spacing:1px;text-transform:uppercase;',
    'font-weight:700;color:#fff;background:var(--tommy-rot,#D81E34);padding:1px 6px;border-radius:3px;}',
    '.fm__band{margin:0.9rem 0 0;padding:0.75rem 0.9rem;border-left:3px solid var(--petrol,#1a5c5a);',
    'background:var(--fm-band);border-radius:0 5px 5px 0;font-size:12.5px;line-height:1.6;color:var(--fm-text);}',
    '.fm__band b{font-weight:700;}',
    '.fm__zeile{font-size:11.5px;color:var(--fm-lbl);line-height:1.6;margin:0.55rem 0 0;}',
    '.fm__zeile b{color:var(--fm-text);font-weight:600;}',
    '.fm details{margin-top:0.9rem;border-top:1px solid var(--fm-rand);padding-top:0.6rem;}',
    '.fm summary{cursor:pointer;font-size:12.5px;font-weight:600;color:var(--fm-text);}',
    '.fm dl{margin:0.7rem 0 0;font-size:12px;line-height:1.6;}',
    '.fm dt{font-weight:700;color:var(--fm-text);margin-top:0.6rem;}',
    '.fm dd{margin:0.1rem 0 0;color:var(--fm-lbl);}',
    '.fm__quelle{font-size:11px;color:var(--fm-lbl);line-height:1.55;margin:0.9rem 0 0;}',
    /* helles Grundschema */
    '.fm{--fm-text:#1a1a1a;--fm-lbl:#5a5956;--fm-rand:#e0dedd;--fm-kopf:#f5f4f2;--fm-feld-bg:#fff;',
    '--fm-gruen:rgba(26,92,90,0.11);--fm-ocker:rgba(224,149,74,0.16);--fm-rot:rgba(216,30,52,0.10);',
    '--fm-band:rgba(26,92,90,0.06);}',
    /* dunkles Schema */
    '.fm[data-dunkel]{--fm-text:#eef3f1;--fm-lbl:#9fb0ac;--fm-rand:rgba(255,255,255,0.16);',
    '--fm-kopf:rgba(255,255,255,0.05);--fm-feld-bg:rgba(255,255,255,0.08);',
    '--fm-gruen:rgba(122,184,181,0.18);--fm-ocker:rgba(224,149,74,0.20);--fm-rot:rgba(216,30,52,0.20);',
    '--fm-band:rgba(255,255,255,0.06);}',
    '@media(max-width:600px){',
    '.fm th,.fm td{padding:0.4rem 0.4rem;}',
    '.fm table{font-size:11.5px;}',
    '.fm thead th{font-size:9.5px;}',
    '.fm tbody th{font-size:11px;}',
    '.fm__satz{font-size:15px;}',
    '.fm__netto{font-size:11px;}',
    '.fm__abw{font-size:10px;}',
    '.fm__feld input[type=number]{width:7rem;}',
    '}'
  ].join('');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function eur(n) { return Math.round(n).toLocaleString('de-DE') + ' €'; }
  function tsd(n) { return Math.round(n / 1000).toLocaleString('de-DE') + '.000 €'; }
  function pct(n) { return Math.round(n * 100) + ' %'; }

  function basis() {
    var s = document.currentScript;
    if (s && s.src) {
      var m = s.src.match(/^(.*\/)js\/foerdermatrix\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return '';
  }
  var BASIS = basis();

  function heuteISO() {
    var n = new Date();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-01';
  }
  function tagDavor(iso) {
    var t = iso.split('-'), d = new Date(Number(t[0]), Number(t[1]) - 1, Number(t[2]));
    d.setDate(d.getDate() - 1);
    return String(d.getDate()).padStart(2, '0') + '.' +
           String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
  }
  function deDatum(iso) {
    var t = iso.split('-');
    return t[2] + '.' + t[1] + '.' + t[0];
  }

  /* Höchstgrenze der förderfähigen Ausgaben, gestaffelt je Wohneinheit.
     Die halbjährliche Absenkung der ersten Wohneinheit ist in den Daten
     hinterlegt und wird zum jeweiligen Stichtag mitgenommen. */
  function hoechstkosten(we, iso, fs) {
    var h = (fs && fs.hoechstkosten) || {};
    var erste = h.erste_we || 28000;
    if (Array.isArray(h.erste_we_stufen)) {
      erste = h.erste_we_stufen[0].wert;
      h.erste_we_stufen.forEach(function (s) { if (iso >= s.ab) erste = s.wert; });
    }
    var n = Math.max(1, Math.round(Number(we) || 1));
    return erste + Math.min(Math.max(n - 1, 0), 5) * (h.we_2_bis_6 || 15000) +
           Math.max(n - 6, 0) * (h.ab_we_7 || 8000);
  }

  function zuschuss(invest, we, iso, satz, fs) {
    return Math.min(Number(invest) || 0, hoechstkosten(we, iso, fs)) * satz;
  }

  /* Gesamtkosten über die Laufzeit — gleiche Methodik wie der Entscheider-
     Rechner: Energiekosten mit jährlicher Steigerung plus Netto-Investition. */
  function laufzeitkosten(r, nettoFW, nettoWP) {
    var preis = r.preise_ct_brutto, steig = r.steigerung_pa;
    if (!preis || !steig || !r.verbrauch_kwh) return null;
    var v = r.verbrauch_kwh, n = r.zeitraum_j || 25;
    var eFW = v * (preis.fernwaerme / 100);
    var eWP = (v / (r.jaz || 3.8)) * (preis.wp_strom / 100);
    var sum = function (j, e) { return e === 0 ? j * n : j * (Math.pow(1 + e, n) - 1) / e; };
    return {
      fw: sum(eFW, steig.fernwaerme) + nettoFW,
      wp: sum(eWP, steig.wp_strom) + nettoWP,
      jahre: n
    };
  }

  function baueZeilen(fs) {
    var wpAb = fs.grundfoerderung_wp_ab || {};
    var kalt = fs.kaeltemittel_pflicht_ab || {};
    return [
      { id: 'a', bis: wpAb.ab,
        titel: 'bis ' + tagDavor(wpAb.ab),
        sub: 'heutige Lage',
        satz: (fs.grundfoerderung || {}).wert, stichtagISO: heuteISO() },
      { id: 'b', ab: wpAb.ab, bis: kalt.ab,
        titel: 'ab ' + deDatum(wpAb.ab),
        sub: 'Grundförderung halbiert',
        satz: wpAb.wert, stichtagISO: wpAb.ab },
      // Zeile c ist keine reine Zeitstufe: Ab dem Stichtag entscheidet das
      // Kaeltemittel. Mit natuerlichem Kaeltemittel gilt der dann geltende
      // Satz weiter, ohne faellt die Foerderung auf null. Deshalb zwei Werte.
      { id: 'c', ab: kalt.ab,
        titel: 'ab ' + deDatum(kalt.ab),
        sub: 'Kältemittel entscheidet',
        satz: (kalt.ab >= wpAb.ab ? wpAb.wert : (fs.grundfoerderung || {}).wert),
        bedingung: { label: 'ohne natürliches Kältemittel', satz: 0 },
        stichtagISO: kalt.ab }
    ];
  }

  function klasse(satz, voll) {
    if (satz <= 0) return 'is-null';
    return satz >= voll - 1e-6 ? 'is-voll' : 'is-halb';
  }

  function render(el, daten) {
    var fs = daten.parameter.foerdersaetze || {};
    var r  = daten.objekt.wirtschaft || {};
    var zustand = el.__fm;

    var investWP = zustand.investWP, investFW = zustand.investFW, we = zustand.we;
    var wsBonus  = zustand.wsBonus;
    var wsWert   = (fs.wertschoepfungsbonus || {}).wert || 0.15;
    // Obergrenze des Gesamtfoerdersatzes, nicht die Grundfoerderung.
    var maxSatz  = (fs.obergrenze || {}).standard || 0.70;
    var satzFW   = (fs.grundfoerderung_waermenetz || {}).wert || 0.30;
    var vollSatz = (fs.grundfoerderung || {}).wert || 0.30;

    var zeilen = baueZeilen(fs);
    var heute  = heuteISO();

    // beste Lage = erste Zeile, Spalte "Ausschluss greift nicht"
    var bestSatz = zeilen[0].satz;
    var bestNetto = investWP - zuschuss(investWP, we, zeilen[0].stichtagISO, bestSatz, fs);

    var zeilenHtml = zeilen.map(function (z) {
      var satz = z.satz;
      // Wertschöpfungsbonus wirkt erst ab dem Stichtag und nur, wo überhaupt gefördert wird
      if (wsBonus && satz > 0 && z.id !== 'a') satz = Math.min(satz + wsWert, maxSatz);
      var netto = investWP - zuschuss(investWP, we, z.stichtagISO, satz, fs);
      var abw   = netto - bestNetto;
      var istHeute = (!z.ab || heute >= z.ab) && (!z.bis || heute < z.bis);

      // Zweiter Wert, wo die Zeile an eine Anlageneigenschaft geknuepft ist
      // und nicht nur an ein Datum.
      var bedHtml = '';
      if (z.bedingung) {
        var bNetto = investWP - zuschuss(investWP, we, z.stichtagISO, z.bedingung.satz, fs);
        bedHtml = '<span class="fm__bed">' + esc(z.bedingung.label) + ': <b>' +
                  pct(z.bedingung.satz) + '</b> · ' + eur(bNetto) + '</span>';
      }
      var zelleFrei =
        '<td class="' + klasse(satz, vollSatz) + '">' +
          '<span class="fm__satz">' + pct(satz) + '</span>' +
          '<span class="fm__netto">' + eur(netto) + '</span>' +
          '<span class="fm__abw">' + (abw > 0.5 ? '+' + eur(abw) : '—') + '</span>' +
          bedHtml +
        '</td>';
      var zelleZwang =
        '<td class="is-null">' +
          '<span class="fm__satz">0 %</span>' +
          '<span class="fm__netto">' + eur(investWP) + '</span>' +
          '<span class="fm__abw">+' + eur(investWP - bestNetto) + '</span>' +
        '</td>';

      return '<tr><th scope="row">' + esc(z.titel) +
             '<small>' + esc(z.sub) + '</small>' +
             (istHeute ? '<span class="fm__heute">gilt heute</span>' : '') +
             '</th>' + zelleFrei + zelleZwang + '</tr>';
    }).join('');

    var nettoFW = investFW - zuschuss(investFW, we, heute, satzFW, fs);
    var hk = hoechstkosten(we, heute, fs);
    // Die Laufzeitrechnung gehört an die Stelle, die auch die Investitionen zeigt,
    // aus denen sie folgt. Seiten mit abweichenden Investitionswerten verweisen
    // stattdessen dorthin — lieber ein Link als eine zweite Zahl.
    var verweis = el.getAttribute('data-laufzeit-verweis');
    var lz = verweis ? null : laufzeitkosten(r, nettoFW, bestNetto);

    var html =
      '<p class="fm__vorbelegung">Eigene Werte einsetzen: Die Tabelle rechnet mit. ' +
        'Vorbelegt mit den Werten des Referenzgebäudes.</p>' +
      '<div class="fm__eingaben">' +
        feld('wp', 'Wärmepumpe brutto', investWP) +
        feld('we', 'Wohneinheiten', we) +
        feld('fw', 'Fernwärme-Anschluss brutto', investFW) +
        '<label class="fm__schalter">' +
          '<input type="checkbox" data-fm-ws' + (wsBonus ? ' checked' : '') + '>' +
          '<span>Wertschöpfungsbonus ' + pct(wsWert) + '<br><small>ab 2027, Anspruch ungeprüft</small></span>' +
        '</label>' +
      '</div>' +
      '<table>' +
        '<thead><tr>' +
          '<th scope="col">Antrag geht ein</th>' +
          '<th scope="col">Wärmepumpe · Förderung möglich' +
            '<small>wenn das Wärmenetzgebiet die Förderung nicht sperrt</small></th>' +
          '<th scope="col">Wärmepumpe · Förderung ausgeschlossen' +
            '<small>wenn es sie sperrt · rechtlich offen</small></th>' +
        '</tr></thead>' +
        '<tbody>' + zeilenHtml + '</tbody>' +
      '</table>' +
      '<p class="fm__band">' + eur(investFW) + ' brutto minus ' + pct(satzFW) + ' Förderung ergeben <b>' + eur(nettoFW) + '</b>. ' +
        'So viel kostet der Fernwärme-Anschluss in <b>jedem</b> dieser Fälle: Die Absenkung 2027 und die ' +
        'Kältemittelpflicht 2028 treffen die Wärmepumpe, nicht den Wärmenetzanschluss. ' +
        'Der günstigere Einstieg entscheidet die Sache aber nicht: ' +
        (lz
          ? 'Über ' + lz.jahre + ' Jahre liegt die Fernwärme am Referenzobjekt bei rund <b>' + tsd(lz.fw) + '</b>, ' +
            'die Wärmepumpe bei rund <b>' + tsd(lz.wp) + '</b> — nominal, mit jährlicher Preissteigerung ' +
            '(Fernwärme +' + Math.round(r.steigerung_pa.fernwaerme * 1000) / 10 + ' %, WP-Strom +' +
            String(Math.round(r.steigerung_pa.wp_strom * 1000) / 10).replace('.', ',') + ' %; ' +
            'im Rahmen der SWE-Prognose „Verdopplung bis 2040").'
          // Namen statt Ortsangaben: "der Block darüber" wird beim naechsten
          // Umsortieren still falsch, ein Abschnittsname nicht.
          : 'Über die Laufzeit dreht sich das Bild. Den Vergleich samt Preisannahmen zeigt ' +
            (verweis.charAt(0) === '#'
              ? 'der Abschnitt <a href="' + esc(verweis) + '">Kosten über 25 Jahre</a>.'
              : 'das <a href="' + esc(verweis) + '">Referenzgebäude auf der Startseite</a>.')) + '</p>' +
      '<p class="fm__zeile">Förderfähige Höchstkosten bei ' + we + (we === 1 ? ' Wohneinheit' : ' Wohneinheiten') + ': <b>' + eur(hk) + '</b> — ' +
        (investWP <= hk
          ? 'die Investition liegt darunter, die Grenze greift hier nicht.'
          : 'die Investition liegt darüber, gefördert wird nur bis zu dieser Grenze.') + '</p>' +
      '<p class="fm__zeile">Die Beträge sind die Investition nach Abzug der Förderung. ' +
        'Abweichung jeweils gegenüber der besten Lage.</p>' +
      details(fs) +
      '<p class="fm__quelle">Grundlage: Richtlinie für die Bundesförderung für effiziente Gebäude — ' +
        'Einzelmaßnahmen (BMWE), Fassung vom 17.07.2026, wirksam ab 21.07.2026, sowie das Merkblatt zum ' +
        'KfW-Programm 458. Fördersätze und Höchstkosten am Originaltext geprüft. ' +
        'Keine Förder- oder Rechtsberatung.</p>';

    el.innerHTML = html;
    verdrahte(el, daten);
  }

  function feld(key, label, wert) {
    var id = 'fm-' + key + '-' + Math.random().toString(36).slice(2, 7);
    return '<span class="fm__feld">' +
      '<label for="' + id + '">' + esc(label) + '</label>' +
      '<input type="number" inputmode="numeric" min="0" step="500" id="' + id + '" ' +
      'data-fm-feld="' + key + '" value="' + wert + '">' +
    '</span>';
  }

  function details(fs) {
    var wpAb = fs.grundfoerderung_wp_ab || {};
    var kalt = fs.kaeltemittel_pflicht_ab || {};
    var h    = fs.hoechstkosten || {};
    return '<details>' +
      '<summary>Woran die Unterschiede hängen</summary>' +
      '<dl>' +
        '<dt>' + deDatum(wpAb.ab) + '</dt><dd>Grundförderung für Wärmepumpen fällt von ' +
          pct((fs.grundfoerderung || {}).wert) + ' auf ' + pct(wpAb.wert) + ', für den Wärmenetzanschluss bleibt sie bei ' +
          pct((fs.grundfoerderung_waermenetz || {}).wert) + '. Maßgeblich ist der Tag der Antragstellung, nicht der Tag der Entscheidung.</dd>' +
        '<dt>' + deDatum(kalt.ab) + '</dt><dd>Förderfähig sind nur noch Wärmepumpen mit natürlichem Kältemittel ' +
          '(R290, R600a, R1270, R717, R718, R744). Kein Abschlag, sondern ein Ausschluss.</dd>' +
        '<dt>Der Ausschluss</dt><dd>Er hängt nicht an einer gebauten Leitung, sondern an einer kommunalen ' +
          'Entscheidung, die getroffen und transparent gemacht wurde. Ob die Ausweisung als Ausbaugebiet das ' +
          'erfüllt, ist ungeklärt und anwaltlich in Prüfung.</dd>' +
        '<dt>Boni</dt><dd>Klimageschwindigkeits- und Einkommensbonus hängen an einzelnen selbstnutzenden ' +
          'Eigentümern, nicht am Gebäude. Der Klimageschwindigkeitsbonus läuft bis August 2028 aus.</dd>' +
        '<dt>Höchstkosten</dt><dd>' + eur(h.erste_we || 28000) + ' für die erste Wohneinheit, je ' +
          eur(h.we_2_bis_6 || 15000) + ' für die zweite bis sechste, je ' + eur(h.ab_we_7 || 8000) +
          ' ab der siebten. Der Betrag für die erste Einheit sinkt halbjährlich um ' +
          eur(h.absenkung_betrag || 750) + '; die Termine sind hinterlegt und werden mitgerechnet. ' +
          'Am Referenzobjekt liegt die Investition unter der Grenze, deshalb wirkt sich die Absenkung hier nicht aus.</dd>' +
      '</dl>' +
    '</details>';
  }

  function verdrahte(el, daten) {
    el.querySelectorAll('[data-fm-feld]').forEach(function (inp) {
      inp.addEventListener('input', function () {
        var v = Number(inp.value);
        if (!isFinite(v) || v < 0) return;
        var k = inp.getAttribute('data-fm-feld');
        if (k === 'wp') el.__fm.investWP = v;
        if (k === 'fw') el.__fm.investFW = v;
        if (k === 'we') el.__fm.we = Math.max(1, Math.round(v));
        var fokus = inp.getAttribute('data-fm-feld');
        render(el, daten);
        var neu = el.querySelector('[data-fm-feld="' + fokus + '"]');
        if (neu) { neu.focus(); neu.setSelectionRange(neu.value.length, neu.value.length); }
      });
    });
    var ws = el.querySelector('[data-fm-ws]');
    if (ws) ws.addEventListener('change', function () {
      el.__fm.wsBonus = ws.checked;
      render(el, daten);
    });
  }

  function start() {
    var ziele = document.querySelectorAll('[data-foerdermatrix]');
    if (!ziele.length) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    ziele.forEach(function (el) { el.classList.add('fm'); });

    Promise.all([
      fetch(BASIS + 'daten/parameter.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }),
      fetch(BASIS + 'daten/theaterstrasse-4.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
    ]).then(function (res) {
      var daten = { parameter: res[0], objekt: res[1] };
      var r = daten.objekt.wirtschaft || {};
      ziele.forEach(function (el) {
        el.__fm = {
          investWP: (r.invest_eur || {}).wp || 130000,
          investFW: (r.invest_eur || {}).fernwaerme || 31500,
          we: r.we || 14,
          wsBonus: false
        };
        render(el, daten);
      });
    }).catch(function (err) {
      console.warn('[Fördermatrix] Daten konnten nicht geladen werden:', err);
      ziele.forEach(function (el) {
        el.innerHTML = '<p class="fm__zeile">Die Fördermatrix wird gerade aktualisiert.</p>';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
