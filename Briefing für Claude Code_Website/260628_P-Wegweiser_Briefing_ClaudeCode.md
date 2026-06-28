# Briefing für Claude Code — Wegweiser (Feedbackschleife 2)

**Stand:** 28.06.2026 · **Seite:** `wegweiser.html` · **Phase:** Überarbeitung Wegweiser nach neuen Erkenntnissen

---

## 0. Rahmen — bitte zuerst lesen

**Arbeitsverzeichnis (Repo-Root, Laufwerk C):**
`C:\Users\dscho\Documents\Projekte\hausentscheider\` *(lokaler Git-Repo-Ordner, in dem Claude Code + GitHub arbeiten — von Daniel bestätigt. PDFs/Excel ggf. aus dem OneDrive-Spiegel hierher syncen.)*

> Alle Pfade in diesem Briefing sind **relativ zum Repo-Root**. Die PDFs unter `dokumente/` und die externen Links sind redaktionell gepflegt — Inhalte können sich noch ändern. **Die Website ist noch nicht online.**

**Verbindliche Arbeitsweise (siehe `CLAUDE.md`):**
- Im Hauptzweig arbeiten, keine neuen Branches.
- Bestehende Datei editieren, **nicht** duplizieren.
- **Minimalinvasiv** — kleinstmögliche Änderung pro Ziel, keine Zusatz-Features, keine Begleit-Refactorings.
- **Vor jeder Änderung: kurzer Vorschlag, dann auf OK warten.** Danach genau das ausführen.
- Ein Commit pro abgeschlossenem Arbeitspaket, Nachricht kurz und deutsch.
- Bei Unsicherheit oder stillen Nebenwirkungen: stoppen und fragen.

**Reihenfolge der Arbeitspakete:** AP0 → AP1 → AP2 → AP3 → AP4 → AP5 → AP6. Jeweils einzeln vorschlagen, umsetzen, committen.

---

## 1. Gesamtkontext — warum es Hausentscheider und den Wegweiser gibt

*(Dieser Abschnitt gibt dir den Hintergrund, den du aus den vorausgegangenen Dialogen, E-Mails und Dokumenten nicht kennen kannst. Er erklärt das „Warum" hinter den Aufträgen — damit deine Umsetzung und deine Verbesserungsvorschläge zum Ganzen passen.)*

**Was Hausentscheider ist.** Eine unabhängige Initiative aus Erfurt für Eigentümer in der Wärmewende. Kein Ratgeberportal, kein Verkauf, keine Lobby — sondern eine Stimme für die, die am Ende entscheiden und die Konsequenzen 20–30 Jahre tragen: die Eigentümer. Gegründet von Daniel Schöberl (Transformationsforscher, Wohnungseigentümer in der Erfurter Altstadt, Beirat einer WEG, Forschung am eco2050 Institut zum „Future Readiness Index" für kommunale Wärmepläne).

**Die Haltung — und damit das Wording.** Der Markenkern ist Glaubwürdigkeit durch Neutralität: *belegt statt behauptet, Einordnung statt Empfehlung, Klarheit statt Komplexität.* Jede Aussage muss belegbar sein. Kein Marketing, keine Superlative, keine Buzzwords, keine Alarmrhetorik. Ruhig, sachlich, aus Eigentümerperspektive. Wer das liest, soll denken: *Hier ordnet jemand neutral ein, statt mir etwas zu verkaufen.* Dieses Vertrauen ist das wertvollste Gut der Seite — ein toter Link oder eine unbelegte Zahl beschädigt es überproportional.

**Was der Wegweiser im Ganzen leistet.** Er beantwortet für den Erstbesucher: *Wo steht die Erfurter Wärmewende gerade, wer prägt die Debatte, und welche Fragen sind offen?* Dramaturgie: Stimmfeld („wer spricht, wer wird nicht gehört") → 20 belegte Fragen mit Offen/Belegt-Status → Quellenboden. Die 20 Fragen sollen **sauber, neutral und perspektivisch vollständig** sein — alle relevanten Aspekte abdecken, sodass ein Interessierter ein ehrliches Gefühl für Status quo und offene Punkte bekommt. Das Offen/Belegt-System ist das Alleinstellungsmerkmal: Es macht Lücken sichtbar, ohne anzuklagen.

**Warum gerade diese Überarbeitung (die „neuen Erkenntnisse").** Seit der ersten Fassung sind belegte Quellen und Fakten dazugekommen, die in die Fragen einfließen: die Stellungnahme zur KWP Erfurt (v6), die Gebäude-Future-Readiness-Analyse (v2.4) und die Medien-/Kommunikationsanalyse; die von der SWE bestätigte Möglichkeit, die bestellte Fernwärme-Leistung nach Sanierung jährlich anzupassen (Stand 06/2026); die belegte Begründung zum Solarthermie-Ausschluss; und das Thema neutrale Beratung, das durch den Wegfall der gesetzlichen Beratungspflicht mit dem GMG (ab 01.07.2026) an Gewicht gewinnt.

**Vertraulichkeit — bitte strikt beachten.** Das „Referenzgebäude" in den Antworten ist bewusst anonymisiert (reales Objekt, laufendes WEG-Verfahren). Veröffentlicht werden **ausschließlich** die freigegebenen PDFs aus `dokumente/`. Interne Analyse-Quellen (z. B. aus einem `08_Analyse`-Bestand) gehören **nicht** auf die Seite. Im Zweifel: nicht veröffentlichen, sondern nachfragen.

**Übergeordnete Arbeitsweise (ab jetzt Standard).** Jeder Website-Bereich wird über eine solche Briefing-Markdown vorbereitet, geprüft und dann von dir umgesetzt. Ziel über alle Briefings hinweg: eine ganzheitlich zusammenhängende, stimmige, rhetorisch kluge und wirksame Website mit konsistentem Wording — bei der bewusst **nur die wichtigsten Fragen, Punkte und Dokumente** veröffentlicht werden. Achte deshalb auf Anschlussfähigkeit: Wording, Tonalität und Aussagen sollen zu den anderen Bereichen passen.

---

## 2. Für Claude Code: Mitdenken ausdrücklich erwünscht

1. **Erst vollständig analysieren, dann umsetzen.** Lies dieses Briefing und `wegweiser.html` ganz, bevor du startest.
2. **Vorschlag vor Ausführung** (siehe `CLAUDE.md`): Beschreibe je Arbeitspaket kurz, was du tun wirst und welche Dateien betroffen sind — warte auf OK.
3. **Bring deine Ideen ein.** Wenn dir eine bessere Formulierung, eine sauberere Struktur oder eine Lücke auffällt: sag es, bevor du baust. Gute Verbesserungsvorschläge sind erwünscht — nur nicht eigenmächtig umsetzen.
4. **Bei Wording-Fragen** orientiere dich am Haltungs-Absatz oben (neutral, belegt, ruhig, kein Marketing).
5. **Stoppen bei Unklarheit oder stillen Nebenwirkungen**, statt zu raten.

---

## 3. Technischer Kontext: Wie der Wegweiser aufgebaut ist

Die 20 Fragen stehen **inline als JS-Array `FRAGEN`** direkt in `wegweiser.html` (im `<script>` ab ca. Zeile 609), gruppiert über `BLOCK_ORDER` in fünf Blöcke. Die Anzeige-Nummer kommt aus dem Feld `f.nr`; die Reihenfolge ergibt sich aus `BLOCK_ORDER` + Filter je Block.

**Wichtig:** `daten/wegweiser.json` enthält eine **alte, ungenutzte** Fragen-Fassung (7 Fragen, mehrstimmig). Sie wird **nicht** gerendert. Nicht verwechseln — gepflegt wird ausschließlich das Inline-Array in `wegweiser.html`.

Frage-Objekte über das Feld `frage:` (Titeltext) identifizieren, **nicht** über Zeilennummern (verschieben sich).

---

## AP0 — Hygiene: tote lokale Links & ungenutzte Datei

**Problem:** In `wegweiser.html` stehen mehrfach absolute lokale Pfade `file:///C:/Users/dscho/Documents/Projekte/hausentscheider/…` (in der Nav, in der Quellenliste, im CTA). Diese sind live tot und leaken den lokalen Pfad in den Quelltext.

**Auftrag:**
1. Alle `file:///C:/Users/dscho/Documents/Projekte/hausentscheider/` durch **relative Pfade** ersetzen:
   - `…/index.html#ansatz` → `index.html#ansatz`
   - `…/wegweiser.html` → `wegweiser.html`
   - `…/index.html#dialog` → `index.html#dialog` (Anker prüfen — heißt auf der Startseite `#kontakt`; falls ja, auf `index.html#kontakt` setzen)
   - `…/dokumente/xxx.pdf` → `dokumente/xxx.pdf`
2. `daten/wegweiser.json` ist tote Altlast → **ins Archiv verschieben** (`Archiv/`) oder löschen. Vorher kurz prüfen, dass keine andere Datei sie lädt (`grep -r "wegweiser.json"`).

**Akzeptanz:** Kein `file:///` mehr im Quelltext; Seite lädt unverändert; keine Konsolenfehler.

---

## AP1 — Frage 4 neu: „Wie wirtschaftlich ist Fernwärme wirklich?"

**Warum:** Die isolierte Zahl „rund 30.000 €" (Anschluss) irritiert ohne Referenzobjekt. Stattdessen kommt der belegte Leistungspreis-Mechanismus inkl. der nachträglichen Leistungsanpassung (SWE, Stand 06/2026) hinein — der Sachkern der bisherigen Frage 11 wandert hierher.

**Zieldatei:** `wegweiser.html`, `FRAGEN`-Objekt mit `nr:4` (`frage:"Wie wirtschaftlich ist Fernwärme wirklich?"`). Status bleibt `belegt`.

**Neuer `antwort`-Text:**

> Der oft genannte Arbeitspreis (11,76 ct/kWh) ist nicht der reale Preis. Hinzu kommen ein fixer Leistungspreis (73,64 €/kW·a), Mess- und Betriebskosten — am Referenzgebäude ergibt das einen Effektivpreis von rund 17,5 ct/kWh, im Sommer bis 23. Der fixe Leistungspreis hat eine Tücke: Wer saniert und weniger verbraucht, verteilt ihn auf weniger Kilowattstunden — der Preis pro kWh kann dann sogar steigen. Vermeidbar, aber selten erklärt: Die bestellte Anschlussleistung ist nach Auskunft der SWE einmal jährlich in Stufen von rund 50 kW reduzierbar (Stand 06/2026). Wer die gesunkene Heizlast nach einer Sanierung aktiv anmeldet, senkt den Leistungspreis dauerhaft. Die SWE-eigene Strategie 2040 prognostiziert zudem eine Preisverdopplung — über 25 Jahre ist Fernwärme am Referenzgebäude die teuerste der drei Optionen. Das macht sie nicht falsch, aber die Entscheidung braucht die Vollkosten, nicht den Anschlusspreis.

**Akzeptanz:** Keine „30.000" mehr in F4; 50-kW-Regel und Effektivpreis stehen drin.

---

## AP2 — Frage 9 ergänzen: „Wird die Fernwärme grün …?"

**Warum:** Die Solarthermie wird bisher nur als ungenutztes Potenzial genannt. Belegte Begründung des Nicht-Ausbaus ergänzen (Stellungnahme v6: Sommer-Maximum bei minimalem Bedarf, Flächenkonkurrenz, SWE-Masterarbeit zugunsten Abwärme).

**Zieldatei:** `wegweiser.html`, `FRAGEN`-Objekt `nr:9`. Status bleibt `offen`.

**Den Solarthermie-Teil** (im bestehenden Text der Abschnitt ab „Gleichzeitig bleibt die Solarthermie …") **ersetzen durch:**

> Gleichzeitig bleibt die Solarthermie mit dem zwölffachen Potenzial nahezu ungenutzt (heute 0,09 % der Erfurter Fernwärme). Das ist kein Zufall: Solarthermie liefert ihr Maximum im Sommer — genau dann, wenn der Wärmebedarf am geringsten ist und die bestehende KWK-Grundlast ihn bereits deckt. Dazu kommt die Flächenkonkurrenz. In einer von der SWE betreuten Masterarbeit wurde Großsolarthermie geprüft und zugunsten eines Abwärmeprojekts verworfen. Nachvollziehbar — aber die KWP sollte diese Abwägung offenlegen, statt das Potenzial nur zu nennen.

(Der Schlusssatz „Ohne verbindlichen Emissionsfaktor-Zielpfad …" bleibt unverändert stehen.)

**Akzeptanz:** Begründung steht; Zahl 0,09 % korrekt; keine unbelegte KWK-Zuspitzung.

---

## AP3 — Frage 11 ersetzen + Frage neu einordnen (Beratung)

**Warum:** Das „Effizienz-Paradoxon"-Framing ist veraltet (Sachkern ist in AP1/F4 aufgegangen). An seine Stelle tritt die fehlende neutrale Beratung — thematisch gehört sie in den Block **„Umwelt, Mieter & Hilfe"**, nicht in „Optionen & Technik". Dadurch entsteht zugleich die saubere Trennung von alter F15/F20 (siehe AP4).

**Auftrag:**
1. Das `FRAGEN`-Objekt der alten F11 (`frage:"Was bringt Sanierung — und das Effizienz-Paradoxon der Fernwärme?"`, Block „Optionen & Technik") **entfernen**.
2. **Neues** Frage-Objekt anlegen, Block `"Umwelt, Mieter & Hilfe"`, Status `offen`, als **letzte** Frage:

```js
{ nr:20, block:"Umwelt, Mieter & Hilfe", status:"offen",
  frage:"Wer berät mich neutral — und woran erkenne ich ein unabhängiges Gutachten?",
  antwort:`Mit dem Gebäudemodernisierungsgesetz entfällt zum 1. Juli 2026 auch die gesetzliche Beratungspflicht — neutrale Orientierung wird knapper, gerade wenn tausende Eigentümer entscheiden müssen. Wer eine WEG zu einem 20-Jahres-System berät, sollte unabhängig sein — doch „Energieberater" ist kein geschützter Beleg für Neutralität. Zwei Register helfen: Öffentlich bestellte und vereidigte Sachverständige (IHK-Sachverständigenverzeichnis, svv.ihk.de) sind per Bestellung zu Unabhängigkeit und Unparteilichkeit verpflichtet — die höchste belegbare Neutralitätsstufe für Gutachten. Für förderfähige Beratung führt die dena die Energie-Effizienz-Experten-Liste (energie-effizienz-experten.de), Voraussetzung für BAFA- und KfW-Förderung. Ergänzend: Verbraucherzentrale Thüringen und die BAFA-geförderte Vor-Ort-Beratung. Faustregel: Wer am Ergebnis verdient, ist kein neutraler Gutachter.` }
```

3. **Alle `nr`-Felder neu durchnummerieren** entsprechend der finalen Liste in Abschnitt „Anhang A" (Reihenfolge folgt `BLOCK_ORDER`, fortlaufend 1–20). Die Anzeige muss 1.–20. ohne Lücke ergeben.

**Akzeptanz:** 20 Fragen, lückenlose Nummerierung 1–20; Beratungsfrage im Hilfe-Block; kein „Effizienz-Paradoxon" mehr.

---

## AP4 — Frage 15 & 20 (alt) differenzieren

**Warum:** Alte F15 (GMG) und alte F20 (Beratung + Prüfung) überschnitten sich beim Thema „Beratung". Nach AP3 trägt die neue Beratungsfrage (F20) das Beratungsthema allein. Jetzt:

1. **GMG-Frage** (alt F15, `frage:"Was ändert das Gebäudemodernisierungsgesetz (ab 01.07.2026)?"`) auf das **reine Rechtsthema** fokussieren — Beratungspflicht-Wegfall nur als Überleitung mit Querverweis. Neuer `antwort`-Text:

> Ab dem 1. Juli 2026 entfällt die 65-%-Erneuerbaren-Pflicht für neu eingebaute Heizungen. Das klingt nach Freiheit, verschiebt aber das Risiko zu Ihnen: Sie entscheiden künftig in der Lücke zwischen Bundesrecht und kommunaler Steuerung. Wer jetzt eine fossile Anlage einbaut, sollte mögliche spätere Nachrüst- oder Stilllegungspflichten mitdenken — und die rechtliche Lage des Grundstücks (Satzungsgebiet, M6) kennen. Mit dem GMG entfällt zugleich die gesetzliche Beratungspflicht — wo Sie trotzdem neutrale Hilfe finden, steht weiter unten unter „Wer berät mich neutral?".

2. **Prüf-Frage** (alt F20) auf **„Wer prüft die KWP unabhängig?"** verengen (Beratungsteil ist jetzt in der neuen Frage). `frage:` umbenennen in `"Wer prüft die kommunale Wärmeplanung unabhängig?"`, Status `offen`, neuer `antwort`-Text:

> Eine unabhängige Prüfung des 502-Seiten-Plans findet bisher nicht statt. Der Thüringer Klimarat und Wohnen im Eigentum wären naheliegende Instanzen, sind aber nicht eingebunden. Ohne externe Prüfung bleiben zentrale Annahmen — Geothermie-Erfolg, Wasserstoff-Verfügbarkeit, Emissionspfad — unwidersprochen im Raum. Ein jährliches öffentliches Monitoring-Dashboard und eine unabhängige Prüfinstanz wären das Mindeste, um auf dem Plan aufbauen zu können.

**Akzeptanz:** GMG-Frage ohne Beratungs-Dopplung; Prüf-Frage rein auf unabhängige Kontrolle.

---

## AP5 — Quellenboden umbauen

**Warum:** Falsche/tote externe Links, fehlende eigene Belege, neue Beratungs-Quellen. **Quelle der Wahrheit:** Tab `39_Quellen_Links` in `Website_Hausentscheider_Content-Cockpit_v1.4.xlsx`.

**Zieldatei:** `wegweiser.html`, Abschnitt „Quellen & Links" (`<section class="quellen">`). Gruppen und Einträge wie folgt setzen:

**Gruppe „Kommunale Planung"**
- Kommunale Wärmeplanung Erfurt → `https://www.erfurt.de/ef/de/leben/oekoumwelt/kommunale_waermeplanung/index.html` *(verifiziert; Kurzform `erfurt.de/waermeplanung`)*
- Amtlicher KWP-Bericht Erfurt (26.03.2026, PDF) → `https://www.erfurt.de/mam/ef/leben/oekologie_und_umwelt/kommunale_waermeplanung/20260326_bericht_kommunale_waermeplanung_2026.pdf` *(offizielle 502-Seiten-Grundlage — als zentrale Quelle empfohlen)*

**Gruppe „Eigene Analysen & Stellungnahmen" (NEU anlegen)**
- Stellungnahme KWP Erfurt v6 → `dokumente/260514_Stellungnahme_KWP_Erfurt_v6.pdf`
- Gebäude-Future-Readiness v2.4 → `dokumente/260622_Gebäude-Future-Readiness_v2.4.pdf` *(Hinweis: Umlaut im Dateinamen — für Web ASCII-Variante empfohlen, dann Link mitziehen)*
- Medien- & Kommunikationsanalyse KWP → `dokumente/260628_Medien-_und_Kommunikationsanalyse_KWP_Erfurt_Gesamt.pdf` *(Datei legt Daniel in `dokumente/` ab)*

**Gruppe „Fernwärme & Versorger"**
- SWE Fernwärme → `https://www.swe-energie.de/energie/home/produkte/fernwaerme` *(ersetzt stadtwerke-erfurt.de)*
- TEAG — Wärmepumpe → `https://www.thueringerenergie.de/Privatkunden/Energieloesungen/Umweltenergie/Waermepumpe` *(ersetzt mein-zuhause.teag.de)*
- SWE Energiejournal → `dokumente/SWE_Energiejournal.pdf`

**Gruppe „Förderung & Finanzierung"**
- BAFA — Bundesförderung BEG → `https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/effiziente_gebaeude_node.html`
- KfW — Energieeffizient Sanieren → `https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestandsimmobilie/Energieeffizient-Sanieren/`
- BAFA — Energieberatung Wohngebäude → `https://www.bafa.de/DE/Energie/Energieberatung/Energieberatung_Wohngebaeude/energieberatung_wohngebaeude_node.html`

**Gruppe „Technik & Forschung"**
- Fraunhofer ISE — Wärmepumpen im Bestand → `https://www.ise.fraunhofer.de`
- Thüringer Solarrechner (ThEGA) → `https://www.thega.de/themen/erneuerbare-energien/servicestelle-solarenergie/thueringer-solarrechner/` *(ersetzt falsch beschrifteten ISE-„Solarrechner"-Link)*
- Solarkataster Erfurt → `https://www.erfurt.de/solarkataster`

**Gruppe „Neutrale Beratung" (NEU anlegen)**
- IHK-Sachverständigenverzeichnis → `https://svv.ihk.de`
- Energie-Effizienz-Experten-Liste (dena) → `https://www.energie-effizienz-experten.de`
- Verbraucherzentrale Thüringen → `https://www.verbraucherzentrale-thueringen.de`

**Entfernen** aus dem Quellenboden: „Eigentümer-Einschätzung 2026" und „Future Readiness — Executive Summary" (die bleiben anderswo auf der Startseite, nicht hier).

**Akzeptanz:** Alle Links wie oben; zwei neue Gruppen vorhanden; keine toten/falschen Domains; externe Links öffnen in neuem Tab (`target="_blank" rel="noopener"`).

---

## AP6 — WhatsApp-CTA entfernen + Abschluss-Anker

**Warum:** Es gibt aktuell keinen WhatsApp-Kanal.

**Auftrag:**
1. Den `<div class="wa-cta">…</div>`-Block am Ende der Quellen-Section **entfernen**.
2. Auch im Stimmfeld/sonst etwaige WhatsApp-Verweise prüfen und entfernen (`grep -i whatsapp wegweiser.html`).
3. **Ersatz-Abschluss** (damit die Seite nicht im Nichts endet): ein ruhiger Hinweis-Block mit Verweis auf Dialog und Rechner, z. B. „Fragen, die hier offen sind, gehören auf den Tisch — schreiben Sie mir: dialog@hausentscheider.de" + Link zum Entscheider/Rechner. Schlicht, im bestehenden Stil.

**Akzeptanz:** Kein „WhatsApp" mehr im Quelltext; Seite endet mit einem klaren, ruhigen Handlungsanker.

---

## Anhang A — Finale Fragenliste (Soll-Zustand, 20 Fragen)

| nr | Block | Frage | Änderung |
|----|-------|-------|----------|
| 1 | Der Rahmen | Wer spricht über die Wärmewende …? | unverändert |
| 2 | Der Rahmen | Warum ein Wegweiser …? | unverändert |
| 3 | Geld & Preise | Werden die Energiepreise weiter steigen? | unverändert |
| 4 | Geld & Preise | Wie wirtschaftlich ist Fernwärme wirklich? | **Text neu (AP1)** |
| 5 | Geld & Preise | Was kostet die Wärmewende mein Gebäude …? | unverändert |
| 6 | Geld & Preise | Was amortisiert sich am schnellsten …? | unverändert |
| 7 | Optionen & Technik | Ist Gas noch eine Option …? | unverändert |
| 8 | Optionen & Technik | Ist Wasserstoff eine realistische Heiz-Option …? | unverändert |
| 9 | Optionen & Technik | Wird die Fernwärme grün …? | **Text ergänzt (AP2)** |
| 10 | Optionen & Technik | Was ist langfristig am krisensichersten? | unverändert |
| 11 | Stadt, Plan & Recht | Ist die kommunale Wärmeplanung gut für Erfurt? | unverändert (war 12) |
| 12 | Stadt, Plan & Recht | Wo stehe ich auf der KWP-Karte …? | unverändert (war 13) |
| 13 | Stadt, Plan & Recht | Bin ich im Anschlusszwang … (M6)? | unverändert (war 14) |
| 14 | Stadt, Plan & Recht | Was ändert das GMG (ab 01.07.2026)? | **Text angepasst (AP4)** (war 15) |
| 15 | Stadt, Plan & Recht | Wie sicher ist die Förderung …? | unverändert (war 16) |
| 16 | Umwelt, Mieter & Hilfe | Womit tue ich wirklich etwas für die Umwelt? | unverändert (war 17) |
| 17 | Umwelt, Mieter & Hilfe | Wie entwickeln sich die Nebenkosten für Mieter? | unverändert (war 18) |
| 18 | Umwelt, Mieter & Hilfe | Wer trägt den CO₂-Preis …? | unverändert (war 19) |
| 19 | Umwelt, Mieter & Hilfe | Wer prüft die kommunale Wärmeplanung unabhängig? | **Text angepasst (AP4)** (war 20) |
| 20 | Umwelt, Mieter & Hilfe | Wer berät mich neutral …? | **NEU (AP3)** |

*Die alte F11 „Was bringt Sanierung — Effizienz-Paradoxon" entfällt; ihr Sachkern ist in F4 aufgegangen.*

---

## Anhang B — Was NICHT angefasst wird

- Stimmfeld-Grafik (EKG/Stimmen-SVG) — bleibt.
- Die fünf Block-Namen und das Offen/Belegt-System — bleiben.
- Rechner, Startseite, andere Seiten — außerhalb dieses Briefings.
- Sensible Quelldokumente aus `08_Analyse/` — kommen **nicht** auf die Seite; nur die freigegebenen PDFs aus `dokumente/`.
