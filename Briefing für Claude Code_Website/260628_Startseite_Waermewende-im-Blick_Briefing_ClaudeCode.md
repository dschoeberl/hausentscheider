# Briefing für Claude Code — „Wärmewende im Blick" (Startseiten-Modul)

**Stand:** 28.06.2026 · **Seite:** `index.html` (Startseite) · **Phase:** neues Modul, eigenes Arbeitspaket

---

## 0. Rahmen — bitte zuerst lesen

**Arbeitsverzeichnis (Repo-Root, Laufwerk C):** `C:\Users\dscho\Documents\Projekte\hausentscheider\`

**Verbindliche Arbeitsweise (siehe `CLAUDE.md`):** im Hauptzweig arbeiten · bestehende Dateien editieren, nicht duplizieren · minimalinvasiv · **Vorschlag vor Ausführung, auf OK warten** · ein Commit pro Arbeitspaket · bei Unsicherheit stoppen und fragen.

> Eigenständiger neuer Block. Erst umsetzen, wenn ausdrücklich freigegeben. **Vor dem Bauen:** 2–4 Vorschläge zur visuellen Verstärkung (Abschnitt 5).

---

## 1. Gesamtkontext & klare Abgrenzung

*(Hintergrund, den du aus den vorigen Dialogen nicht kennst.)*

Hausentscheider ist eine unabhängige Initiative aus Erfurt für Eigentümer in der Wärmewende — **neutral, belegt statt behauptet, Einordnung statt Empfehlung, einfache Sprache statt Fachjargon.**

Auf der Seite gibt es zwei verwandte, aber **klar getrennte** Elemente — bitte nicht vermischen:

- **Wegweiser** (`wegweiser.html`): das **Grundsätzliche** — zeitlose Fragen & Antworten (20 Fragen, Offen/Belegt). Ändert sich selten.
- **„Wärmewende im Blick"** (dieses Modul, **Startseite**): das **Lebendige** — ein fortlaufend ergänzter Zeitstrahl der lokalen Berichterstattung. Leitfunktion: gibt Besuchern durch laufende Aktualisierung einen Grund, **wiederzukommen**. Ein **Catcher** weit oben auf der Startseite.

Grundlage: eine eigene Analyse der lokalen Berichterstattung — Quellen: `08_Analyse/260606_TA-Berichterstattung_Waermewende_Erfurt_Analyse_extern.docx` und `08_Analyse/260627_Medien-_und_Kommunikationsanalyse_KWP_Erfurt_Gesamt.docx` (Verfasser: Daniel Schöberl). Aussage: **so wird über die KWP berichtet — gut erklärt, aber nicht geprüft, nicht durchgerechnet, und an den entscheidenden Terminen zu dünn.**

**Urheberrecht — strikt:** keine Original-Artikel, Scans oder Volltexte. Eigene, zugespitzte Überschriften (keine TA-Titel), sinngemäße Zusammenfassung in eigenen Worten, plus Kommentar. Kurze Zitate (z. B. „Wundertüte", „Das geht wahrscheinlich fast geräuschlos") nur mit Quelle. Optional Deep-Link aufs Original. Zulässige Auseinandersetzung, kein Nachdruck.

**Tonalität:** mittel — Muster klar benennen; Namen nur, wo sie zur Sache gehören (z. B. ein Kommentar). Strukturelles (eine Redaktion trägt fast allein die Last) entschärft andeuten, ohne den Medienkonzern an den Pranger zu stellen. Haltung: Einladung, nicht Vorführung.

---

## 2. Name, Überschrift & Einleitung

**Modulname / Überschrift:** **Wärmewende im Blick**

> **Wärmewende im Blick**
> Nah dran an dem, was über die Erfurter Wärmewende berichtet wird — wann, von wem, und was fehlt. Laufend ergänzt.

Dazu eine dezente Marke „**zuletzt ergänzt am …**" (verstärkt den Wiederkehr-Anreiz). Eyebrow-Label z. B. „Medien-Resonanz · Erfurt".

---

## 3. Einfache Sprache: die drei Töne (Glossar)

| Ton | Bedeutung (einfach) | Farbe (vorläufig) |
|---|---|---|
| **zustimmend** | übernimmt die offizielle Sicht (Stadt/Versorger), ohne sie zu hinterfragen | Petrol `#2e8b80` |
| **erklärend / sachlich** | informiert neutral, hilft verstehen | Grau `#bcc1bf` |
| **kritisch / Meinung** | hinterfragt, bezieht Position | Ocker/Rot `#d2542a` |

Bewusst **kein** „affirmativ", „institutionell" o. Ä. auf der Seite. Daten-Schlüssel technisch (`zustimmend|sachlich|erklaerend|kritisch`), Anzeige immer einfach.

**Farbwerte sind vorläufig.** Die drei Töne brauchen **starken, sofort lesbaren Kontrast** — man muss auf einen Blick „zustimmend" von „kritisch" unterscheiden. Das macht die zentrale Aussage sichtbar: wie selten kritisch berichtet wird (im Startbestand nur 2 von 9). Finale Palette → Claude-Code-Vorschlag, Abschnitt 5.

---

## 4. Zeitlich offen — ein lebendiges Medium

**Zentral:** nicht abgeschlossen. Daniel ergänzt fortlaufend neue Artikel:

- **Offenes Ende:** Achse läuft sichtbar weiter (gestrichelte Verlängerung + „wird laufend ergänzt"). Die kommende Phase (ab Inkrafttreten 30.06.) ist Teil der Aussage.
- **Leichte Pflege:** neuer Eintrag = **ein Objekt anhängen**, sonst nichts. Achse, Abstände, Layout rechnen sich automatisch aus dem Datum.
- **Datenhaltung:** ausgelagert in `daten/medien-zeitstrahl.json` (nicht inline).

---

## 5. Frage an dich, Claude Code: visuell noch stärker?

Daniel möchte ausdrücklich deine Ideen, **wie sich dieses Modul als Startseiten-Catcher visuell noch stärker machen lässt** — auf einen Blick wirksam, trotzdem einfach. **Vor dem Bauen** 2–4 konkrete Vorschläge. Denkanstöße:

- Wie werden die **Lücken** (z. B. 17 Tage Funkstille in der Auslegungsfrist) elegant, aber deutlich sichtbar?
- Lohnt eine dezente **Scroll-Animation** (Einträge erscheinen nacheinander)?
- Hilft eine kleine **Dichte-/Aktualitäts-Anzeige** („zuletzt ergänzt", Artikel pro Woche)?
- Wie wird das **offene Ende** am stärksten lesbar (Pfeil, Verblassen, „heute"-Marke)?
- Bleibt es auf dem **Smartphone** ruhig und einfach?
- Reicht eine **kompakte Höhe**, die zum Weiterscrollen einlädt?
- **Farbgebung (wichtig):** Ton-Palette mit **starkem Kontrast** (zustimmend / erklärend-sachlich / kritisch auf einen Blick unterscheidbar), zugleich **im Gesamt-Farbsystem** (Cockpit-Excel Tab `38_Farbsystem_Design`, bestehendes `oz-timeline`, Petrol/Signal). Barrierefreiheit (WCAG-Kontrast). **Begründeten Vorschlag im Gesamtkontext, bevor du baust.**

Marke: flach, ruhig, Petrol/Signal, kein Effekt-Feuerwerk. Stärke durch Klarheit.

---

## 6. Visualisierungsvorschlag (Ausgangspunkt)

- **Achse:** vertikale Linie links, Datum als Beschriftung, Y-Position **proportional zum Datum** (Abstände echt). Offenes Ende unten.
- **Eintrag:** Punkt in Ton-Farbe; rechts kernige Überschrift + Datum. Klick öffnet Zusammenfassung + Einordnung.
- **Meilenstein-Marker:** gestrichelte Querlinie mit Label.
- **Detail-Panel:** weiße Karte, Zusammenfassung als Fließtext, darunter Einordnung mit Signal-Strich links und Label „Einordnung".
- **Konsistenz:** bestehendes Zeitstrahl-Schema (`oz-timeline` auf `index.html`) als Referenz.

Interaktive Vorschau der Mechanik wird separat bereitgestellt.

---

## 7. Datenmodell

Ausgelagert in `daten/medien-zeitstrahl.json`:

```js
{
  "datum": "2026-05-06",
  "datumLabel": "6. Mai",
  "headline": "…",                  // eigene, zugespitzte Überschrift (kein TA-Titel)
  "ton": "erklaerend",              // zustimmend | sachlich | erklaerend | kritisch
  "quelle": "TA · Lokalteil",
  "zusammenfassung": "…",           // 3–5 Sätze, eigene Worte, konkrete Fakten/Zahlen
  "kommentar": "…",                 // 3–5 Sätze, Einordnung, mittlere Tonalität
  "link": ""                        // optional: Deep-Link
}
```

Meilensteine: `{ "datum":"2026-05-04", "label":"Pressekonferenz: KWP-Ergebnisse", "berichtet":true }`

**Texttiefe (verbindlich):** Zusammenfassung **und** Kommentar je **3–5 Sätze**. Zusammenfassung mit konkreten Zahlen/Belegen aus dem Artikel; kurze wörtliche Zitate nur mit Quelle. Kommentar = eigenständige Einordnung mit erkennbarem Mehrwert (Muster benennen, was fehlt, Konsequenz für den Eigentümer). **Neuer Artikel = ein Objekt ans Array anhängen.**

**Datenqualität:** o.-D.-Einträge auf Monatsmitte setzen und „ca." kennzeichnen; 06.06.-Häufung nicht als reale Tagesdichte überzeichnen.

---

## 8. Startbestand: die 9 Einträge (finale Texte)

*Überschriften = eigene Zuspitzungen (keine TA-Titel). Zusammenfassung & Einordnung je 3–5 Sätze.*

**① 30.04. — „‚Auf dem Weg zur grünen Wärme' – sagt die Tagung"** · Ton: zustimmend
- *Zusammenfassung:* Zur 2. Thüringer Wärmetagung wird die Erfurter Wärmewende als Aufbruch erzählt: Fernwärme-Ausbau, grüne Quellen, Zuversicht. Konkrete Termine oder Zahlen zur Dekarbonisierung bleiben im Hintergrund. Der Ton setzt das Framing für den ganzen Mai.
- *Einordnung:* Eine Tagung darf Aufbruch feiern — aber für eine Entscheidung über 20 Jahre zählt nicht die Stimmung, sondern der Beleg. Welche grüne Quelle kommt wann, mit welcher Sicherheit und zu welchem Preis? Genau die Übersetzung von der Absicht zur belastbaren Zahl fehlt. Wer den Optimismus für eine Zusage hält, verwechselt Richtung mit Fahrplan.

**② 06.05. — „Der Bund lockert — am selben Tag legt die Stadt fest"** · Ton: sachlich
- *Zusammenfassung:* Im Wirtschaftsteil kippt Bundesministerin Reiche das geplante 2045-Betriebsverbot für fossile Heizungen; das neue Gebäudemodernisierungsgesetz sieht nur noch eine schrittweise Erneuerbaren-Quote vor (10 % ab 2029 bis 60 % ab 2040) und ist erst Referentenentwurf. Ein Energieberater rät im Interview wörtlich: „Im Moment würde ich abwarten." Im Lokalteil derselben Ausgabe steht dagegen die kommunale Festlegung zum 30.06.
- *Einordnung:* Beide Meldungen sind für sich korrekt — zusammen ergeben sie ein Dilemma, das niemand auflöst. Der Bund signalisiert „abwarten", die Kommune „jetzt festlegen"; wer dazwischensteht, trägt das Risiko allein. Heikel wird der Rat zum Abwarten dort, wo im Satzungsgebiet ein neuer Gaskessel schon nicht mehr zulässig sein kann. Die eigentliche Denkaufgabe — was gilt für mein Gebäude, wenn Bund und Stadt gegenläufig steuern? — bleibt vollständig beim Leser.

**③ 06.05. — „‚Welche Heizung wohin?' — der Plan, gut erklärt"** · Ton: erklärend
- *Zusammenfassung:* Das große Frage-Antwort-Stück erklärt den Plan so klar wie kein anderes: die Farblogik der Gebiete, 3.800 Häuserblocks, 115.000 Haushalte, eine Fernwärmemenge, die von 540 auf 720 GWh wachsen soll — heute zu 95 % aus Erdgas —, 1,5 Mrd. € Investitionen bis 2045. Auch die offene Stelle wird benannt: In den „Prüfgebieten" (rund ein Drittel der Stadt) bleibt bis zu fünf Jahre offen, wie geheizt wird; ein adressgenauer Stadtplan ist für den 30.06. angekündigt.
- *Einordnung:* Handwerklich das stärkste Stück — und trotzdem der Kern des Musters: Es erklärt den Plan, aber es prüft ihn nicht. Die 1,5 Milliarden, die 95 % Erdgas, die fünf Jahre offenen Prüfgebiete werden referiert, nicht hinterfragt: Wie entwickelt sich der Preis, wenn so viel investiert wird? Was passiert, wenn die Geothermie nicht trägt? Und die eine Zahl, die der Eigentümer wirklich braucht — Euro pro Quadratmeter und Monat über 20 Jahre — kommt nicht vor. Gut erklärt ist noch nicht durchgerechnet.

**④ 08.05. — „Das Heizungsgesetz, vom Schornsteinfeger übersetzt"** · Ton: erklärend
- *Zusammenfassung:* Ein Schornsteinfeger-Meister übersetzt die Bundesreform alltagsnah: was das neue Heizungsrecht praktisch für Hausbesitzer bedeutet, welche Fristen und Pflichten gelten. Handwerksnah und verständlich — ausgelöst durch den Gesetzentwurf.
- *Einordnung:* Ein nützlicher Service — und zugleich typisch für das ereignisgetriebene Muster: Aufklärung passiert, weil ein Gesetzentwurf den Anlass liefert, nicht als laufende Begleitung. Der Beitrag erklärt die Regeln, aber nicht die Wirtschaftlichkeit der Optionen. Für die eigentliche Frage — welche Lösung rechnet sich für mein Gebäude — verweist auch dieses Stück implizit auf andere. Hilfreich beim „Was gilt", offen beim „Was lohnt".

**⑤ 11.05. — „‚Verbraucher brauchen Klarheit' — die Zeitung benennt die Lücke selbst"** · Ton: kritisch
- *Zusammenfassung:* Die Funke-Textchefin Birgitta Stauber bringt die Lage im Kommentar auf den Punkt: „Wer investiert, braucht Planungssicherheit. Doch die ist nicht in Sicht." Verbraucher bräuchten viel mehr Informationen — und finanzielle Unterstützung —, wenn sie dämmen, die Heizung tauschen oder auf Fernwärme umstellen sollen.
- *Einordnung:* Bemerkenswert, weil die Diagnose aus dem Haus selbst kommt — an prominenter Stelle, nicht in einem ausgelagerten Vortrag. Stauber benennt präzise, was der ganze Korpus zeigt: Es fehlt die Planungssicherheit und die belastbare Information für die einzelne Entscheidung. Der Kommentar fordert sie ein, kann sie aber nicht liefern — das ist nicht seine Aufgabe. Genau diese Lücke zwischen berechtigter Forderung und fehlender Antwort ist der Raum, den ein unabhängiger Wegweiser füllen muss.

**⑥ 16.05. — „Bauchschmerzen erlaubt — aber bitte beruhigt"** · Ton: zustimmend (beruhigend)
- *Zusammenfassung:* Unter der volkstümlichen Überschrift „Bauchschmerzen und kalte Füße" steckt der härteste Stoff des Zeitraums: Der SWE-Netz-Chef räumt ein, dass die Leistung von Wärmepumpen bei Netzengpässen aus der Ferne um über 40 % gedrosselt werden kann (§ 14a EnWG). Und der Plan selbst sagt für rund ein Drittel der Stadt — die „Prüfgebiete" — offen: „Wir wissen es nicht."
- *Einordnung:* Hier liegt der härteste Stoff — und er wird durch den Ton entschärft. Dass eine Wärmepumpe bei Netzengpässen um über 40 % ferngedrosselt werden darf, ist eine zentrale Information für jeden, der dezentral plant — sie verdient mehr als eine volkstümliche Überschrift. Und das „Wir wissen es nicht" für ein Drittel der Stadt ist ein ehrliches, aber gravierendes Eingeständnis. Wer nur die Schlagzeile liest, nimmt „Bauchschmerzen" mit, nicht die Tragweite. Beide Punkte gehören nüchtern auf den Tisch, nicht beruhigt.

**⑦ 02.06. — „Steigende Mieten — erzählt ohne die Heizung"** · Ton: sachlich
- *Zusammenfassung:* „Ein Zimmer weniger fürs gleiche Geld" — der Artikel rechnet Baukosten, Zinsen und Nebenkosten vor, ganz ohne die Heizungs- und Infrastrukturentscheidung, die genau diese Nebenkosten über 20 Jahre treibt. Wohnen und Wärme stehen als zwei getrennte Geschichten nebeneinander.
- *Einordnung:* Korrekt gerechnet — aber in der falschen Schublade. Baukosten, Zinsen und Nebenkosten erscheinen ohne die eine Entscheidung, die die Nebenkosten über zwei Jahrzehnte prägt: das Wärmesystem. Gerade für die zwei Drittel der Erfurter, die zur Miete wohnen, ist die Heizung von heute die „zweite Miete" von morgen. Solange Wohnen und Wärme getrennt erzählt werden, bleibt die wichtigste Stellschraube unsichtbar.

**⑧ 06.06. — „120 km Leitungen: beschlossen. Die grüne Quelle: erhofft."** · Ton: zustimmend (technisch)
- *Zusammenfassung:* Der Ausbau wird konkret und verbindlich: 120 km neue Leitungen, verdoppelte Anschlussfläche. Die grüne Begründung dagegen bleibt im Möglichkeitsmodus — Geothermie „sollte möglich sein", werde „eher auf der Langstrecke" helfen, die Vorlauftemperatur „soll abgesenkt werden". Der SWE-Geschäftsführer zur Umstellung: „Das geht wahrscheinlich fast geräuschlos."
- *Einordnung:* Das Reinstück des Konjunktiv-Musters: Was beschlossen ist, steht im Indikativ (120 km, jetzt), was es rechtfertigt, im Möglichkeitsmodus. „Fast geräuschlos" beschreibt die Umstellung — nicht ihre Sicherheit. Für eine 20-Jahres-Entscheidung ist genau der Unterschied zwischen zugesagter und erhoffter grüner Wärme entscheidend, weil er über CO₂- und Kostenbilanz bestimmt. Ohne verbindlichen Emissionspfad 2030/35/40 bleibt der Ausbau sicher und die grüne Begründung ein Versprechen ohne Termin.

**⑨ ca. 06.06. — „‚Eine Wundertüte' — Gegenrede, aber nur zum Stichtag"** · Ton: kritisch
- *Zusammenfassung:* Anlässlich der städtischen Treibhausgasbilanz titelt die Zeitung „Die Stadt Erfurt verfehlt ihr Klimaziel": Erfurt senkte die Pro-Kopf-Emissionen 2021–2023 nur um 5,3 %, bundesweit waren es 11,7 %. Der Klimaentscheid kommt zu Wort — das Ziel werde „krachend" verfehlt — und nennt die Wärmeplanung für jemanden, der jetzt zwischen Fernwärme und Wärmepumpe entscheiden muss, eine „Wundertüte".
- *Einordnung:* Endlich echte Gegenrede — aber sie erscheint, weil ein offizielles Zahlenwerk den Anlass liefert, nicht als laufende Prüfung. Die Zahlen sind hart: 5,3 % statt 11,7 % Minderung, das Ziel „krachend" verfehlt. Das Bild der „Wundertüte" trifft die Eigentümerlage präzise — man entscheidet, ohne zu wissen, was drin ist. Bliebe es bei anlassgetakteter Kritik, fehlt genau das, was Vertrauen schafft: eine kontinuierliche, unabhängige Begleitung mit Nachfragen zu Preisen und Annahmen.

---

## 9. KWP-Meilenstein-Marker (Achse)

| Datum | Termin | Im Startbestand aufgegriffen? |
|---|---|---|
| 04.05. | Pressekonferenz: KWP-Ergebnisse vorgestellt | ja (Service-Stücke 06.–08.05.) |
| 04.05.–03.06. | Öffentliche Auslegung / Frist für Stellungnahmen | kaum als Beteiligungsaufruf |
| 30.06. | Inkrafttreten KWP + adressgenauer Stadtplan (M16) | offene Phase — Zeitstrahl läuft hier weiter |
| 01.07. | Gebäudemodernisierungsgesetz tritt in Kraft | Bundesreform berichtet, lokale Folge offen |

Aussage: **Berichtet wird zu Terminen — die Beteiligungsfrist und die entscheidende Phase ab 30.06. bleiben dünn.**

---

## 10. Abschluss-Block „Was im Bild fehlt" (Entwurf)

> Über zwei Drittel der Erfurter wohnen zur Miete — auf 502 Planseiten steht „Mieter" zweimal. Die Berichterstattung erklärt den Plan gut, aber sie prüft ihn nicht und rechnet ihn nicht durch: Es gibt Milliarden­zahlen und 40.000-Euro-Schlagzeilen, aber nie die eine Größe, die ein Haushalt braucht — Euro pro Quadratmeter und Monat. Die Zukunft steht im Konjunktiv, die Infrastruktur im Indikativ. Genau diese Lücke füllt Hausentscheider.

---

## 11. Platzierung, Artikel-Ersatz & Akzeptanz

- **Platzierung:** neues Modul in `index.html` **direkt nach den drei Kernaussagen, VOR der Sektion „Aktuelle Energiepreise"** (`#energiepreise`, aktuell ab Zeile ~574).
- **Artikel-Karten ersetzen:** bisherige Sektion **„Aktuell"** (`#aktuell`, 3 Artikel-Karten, ab Zeile ~693) **entfernen**. Vorher sichern:
  - „Future Readiness — Executive Summary" → bereits im „Ansatz" verlinkt ✔
  - „Warum Hausentscheider" → bereits beim Autor verlinkt ✔
  - **„Eigentümer-Einschätzung / Gastkommentar"** (`dokumente/gastkommentar-waermewende-erfurt-2026.pdf`) → **umziehen** zum Autor-Block.
- **Akzeptanzkriterien:** Modul vor den Energiepreisen; markante Überschrift + Einleitung + „zuletzt ergänzt"-Marke; proportionale Abstände; offenes Ende; Einträge auf-/zuklappbar (Zusammenfassung + Einordnung je 3–5 Sätze, getrennt); Meilenstein-Marker; Ton-Legende in einfacher Sprache mit starkem Farbkontrast; Daten aus `daten/medien-zeitstrahl.json`; neuer Artikel ohne HTML-Eingriff ergänzbar; „Aktuell"-Sektion entfernt, Gastkommentar umgezogen; visuell konsistent mit `oz-timeline`; mobil ruhig; keine Volltexte/Scans; keine Konsolenfehler.
- **Reihenfolge:** erst Vorschläge zur visuellen Verstärkung (Abschnitt 5), auf OK warten, dann bauen.
- **Commit:** ein Commit, z. B. `Startseite: Modul „Wärmewende im Blick" ergänzt, Artikel-Karten ersetzt`.

---

## Anhang — Quellen
- `08_Analyse/260606_TA-Berichterstattung_Waermewende_Erfurt_Analyse_extern.docx` + `08_Analyse/260627_Medien-_und_Kommunikationsanalyse_KWP_Erfurt_Gesamt.docx` (Datengrundlage, Verfasser D. Schöberl)
- Cockpit-Excel `Website_Hausentscheider_Content-Cockpit_v1.4.xlsx`, Tab `39_Quellen_Links`
- Bestehendes Zeitstrahl-Schema: `index.html` → `oz-timeline`
