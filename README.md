# hausentscheider.de — Lokales Setup

Der Web-Rechner verwendet ES-Module (`<script type="module">` für `js/engine.js` und
`js/ergebnis.js`). **Doppelklick auf `rechner.html` (file://) funktioniert nicht** —
ES-Module werden vom Browser aus Sicherheitsgründen über `file://` nicht geladen.

## Lokal testen

Aus dem Repo-Root einen einfachen HTTP-Server starten — eine der drei Varianten:

**Python 3** (typischerweise vorhanden auf macOS/Linux, mit Microsoft-Store-Python auf Windows):
```bash
python -m http.server 3000
```

**PowerShell** (Windows ohne Python — eingebauter HTTP-Listener):
```powershell
$l=[Net.HttpListener]::new();$l.Prefixes.Add('http://localhost:3000/');$l.Start()
# (oder via Claude Code: aus .claude/launch.json wird der Server automatisch gestartet)
```

**Node.js** (falls installiert):
```bash
npx serve -l 3000
```

Dann im Browser öffnen: <http://localhost:3000/rechner.html>

## Entwickler-Hinweise

- Die Verifikation gegen Excel §3.7 läuft bei jedem Page-Load automatisch in der
  Browser-Konsole (`[Verifikation §3.7 v1.1 — VDI 2067 Annuität]`). Erwartung: alle
  TCO-Werte ± 2 % gegen Excel-Werte, beste Option = Hybrid für MFH-Default.
- Konditional sichtbare Bereiche (Vermieter-Bilanz, WEG-Hinweise, Profi-Pills) loggen
  beim Re-Render ihren Sichtbarkeits-Status: `[VB] nutzungsart: ... | sichtbar: true/false`.
- Schieberegler-Bewegungen, Persona-Wechsel und Profi-Modus-Toggle feuern jeweils ein
  Custom-Event `he:state-changed`. `js/ergebnis.js` re-rendert über requestAnimationFrame.
- Die Charts (Cashflow, TCO-Vergleich) werden einmal erzeugt und danach via
  `chart.update('none')` aktualisiert — Re-Render-Ziel < 100 ms.

## Aktueller Stand

- **C1 v3** (Wizard + Ergebnis-Skelett): live seit 02.05.2026
- **C2 v1** (Wirtschaftlichkeits-Panel mit Berechnungen, Vermieter-Bilanz, Erweiterter
  Modus, Methodik-Tooltips): seit 03.05.2026 — Spec-Snapshot in
  [docs/C2_BlockSpec_v1.md](docs/C2_BlockSpec_v1.md)
- **C3** (Entscheidungs-Radar, Panel 2): noch Stub — kommt im nächsten Block
- **C4** (Future Readiness Index, Panel 3): noch Stub

## Offen: Verweis auf eigentuemerstimme.de

Im Netzwerk-Block der Startseite liegt ein fertiger, **auskommentierter** Verweis auf
die gemeinnützige Schwester-Initiative:

```
git grep -n LAUNCH-EIGENTUEMERSTIMME
```

Erst einkommentieren, wenn `eigentuemerstimme.de` unter eigener Domain live ist **und**
dort das `noindex` entfernt wurde. Bis dahin läuft die Vereinsseite als unverlinkte
Vorschau — ein Link von hier würde sie öffentlich machen.

Die Richtung gilt nur so: **diese Seite darf auf den Verein zeigen, der Verein nie
zurück.** Ein gemeinnütziger Verein darf kein Gewerbe bewerben (§ 55 AO); umgekehrt
ist der Verweis unproblematisch.
