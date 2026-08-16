# Sicherungen

Keine Laufzeitdaten. Nichts hier wird von der Seite gelesen.

## parameter_2026-08-16.json

Kopie von `daten/parameter.json`, Stand 16.08.2026, vor dem Umbau von
`build_json.py`.

**Grund:** `build_json.py` schreibt `parameter.json` vollständig neu, aus einem
festen Schlüsselsatz. Die beiden handgepflegten Blöcke **`foerdersaetze`** und
**`foerderstand`** stehen nicht darin — ein Lauf des Generators löscht sie.

Die Folge wäre nicht sichtbar: `js/engine.js` fiele auf `FS_FALLBACK` zurück,
`js/foerdermatrix.js` auf seine Notlaufwerte, `js/foerderstand.js` fände nichts,
die Einkommensauswahl im Rechner bliebe leer. Die Seite liefe mit alten Zahlen
weiter.

Diese Kopie enthält beide Blöcke vollständig: alle Fördersätze, die Stichtage
01.01.2027 und 01.01.2028, die Höchstkosten-Staffel samt halbjährlicher
Absenkung, Obergrenze, Klimabonus-Sinkpfad, Einkommensbonus mit drei Stufen,
Wertschöpfungsbonus und den zentralen Stand-Hinweis.

Wiederherstellen: Datei nach `daten/parameter.json` zurückkopieren.
