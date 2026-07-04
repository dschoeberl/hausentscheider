/* ============================================================
   Zentrale Kanal-URL — die EINE Stelle.
   Hier die echte WhatsApp-Kanal-URL eintragen, sobald der Kanal
   freigeschaltet ist. Speist auf allen Seiten:
   - window.KANAL_URL (fuer Skripte, z. B. radar.html)
   - jedes Element mit class="js-kanal-link" (Buttons, Footer-Links)
   ============================================================ */
(function () {
  var KANAL_URL = "https://whatsapp.com/channel/0029Vb8h6wX77qVYequg7c0s";
  window.KANAL_URL = KANAL_URL;

  function apply() {
    var links = document.querySelectorAll(".js-kanal-link");
    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute("href", KANAL_URL);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
