/* --------------------------------------------------------------
   Zentraler Stand-Hinweis für alle Stellen mit Förderbezug (K-08)

   Verwendung in der Seite:
     <p data-foerderstand>Fallback-Text, falls das Skript nicht lädt</p>
     <p data-foerderstand data-dunkel>…</p>          auf dunklem Grund
     <p data-foerderstand data-pruefvermerk>…</p>    zusätzlich der Prüfvermerk

   Gepflegt wird ausschließlich daten/parameter.json, Block "foerderstand".
   Der Fallback-Text im HTML bleibt stehen, wenn der Abruf scheitert —
   die Seite ist damit auch ohne Skript korrekt.
   -------------------------------------------------------------- */
(function () {
  'use strict';

  var CSS =
    '.hs-stand{font-family:"Inter",sans-serif;font-size:11.5px;line-height:1.65;' +
    'color:#5a6b67;background:rgba(20,45,42,0.045);border-left:3px solid #8ba888;' +
    'border-radius:0 5px 5px 0;padding:0.55rem 0.85rem;margin:0.9rem 0 0;}' +
    '.hs-stand b{color:#1a3535;font-weight:600;}' +
    '.hs-stand em{font-style:italic;}' +
    '.hs-stand[data-dunkel]{color:#b9c6c3;background:rgba(255,255,255,0.06);border-left-color:#CFF77F;}' +
    '.hs-stand[data-dunkel] b{color:#ffffff;}';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* Basispfad aus dem eigenen <script src> ableiten, damit die Datei auch
     aus Unterordnern (objekte/) heraus gefunden wird. */
  function basis() {
    var s = document.currentScript;
    if (s && s.src) {
      var m = s.src.match(/^(.*\/)js\/foerderstand\.js(?:\?.*)?$/);
      if (m) return m[1];
    }
    return '';
  }

  var BASIS = basis();

  function ziele() {
    return document.querySelectorAll('[data-foerderstand]');
  }

  function fuellen(f) {
    if (!f || !f.label) return;
    var nodes = ziele();
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var html = '<b>' + esc(f.label) + '.</b> ' + esc(f.text || '');
      if (el.hasAttribute('data-pruefvermerk') && f.pruefvermerk) {
        html += ' <em>' + esc(f.pruefvermerk) + '</em>';
      }
      el.innerHTML = html;
      el.classList.add('hs-stand');
      if (f.quelle) el.setAttribute('title', f.quelle);
    }
  }

  function start() {
    if (!ziele().length) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    /* Die Klasse sofort setzen, damit auch der Fallback-Text ruhig aussieht. */
    var nodes = ziele();
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.add('hs-stand');

    fetch(BASIS + 'daten/parameter.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) { fuellen(d && d.foerderstand); })
      .catch(function (err) {
        console.warn('[Förderstand] Hinweis konnte nicht geladen werden, Fallback bleibt stehen:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
