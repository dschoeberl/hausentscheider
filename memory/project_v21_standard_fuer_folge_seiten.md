---
name: v2.1-Standard für Folge-Seiten — Ranking, Wegweiser, Startseite
description: Was wir in der Rechner-v2.1-Schleife als verbindliche Standards entwickelt haben. Basis für alle künftigen Seiten-Anpassungen, damit Folge-Seiten gleiche Professionalität und Ausstrahlungskraft erreichen.
type: project
originSessionId: 52097a10-d458-4dd2-bcd6-840318e0388d
---
**Kondensat aus den C2-v2.1-Sitzungen 03.–05.05.2026.** Im Rechner-System haben wir Designsystem, Methodik-Trennung, Kommunikations-Pattern und Aussagen-Struktur soweit entwickelt, dass alle Folge-Seiten (Ranking, Wegweiser, Startseite, künftige Profilseiten) hier andocken sollen. Cowork-Claude und Claude Code haben damit eine klare Basis, um Folge-Seiten in höherer Geschwindigkeit auf gleichem Standard zu liefern.

## Verbindliche Designsystem-Pattern (Memory `project_designsystem.md` ist die Quelle)

**Farb-Hintergrund-Matrix:** kein Dunkel-auf-dunkel, kein Petrol-auf-Kontextblau ohne Kontrast-Override. Kontextblau (#cce0e8) als Akzent, Petrol-Light/Mid/Dark (#a3bcc3 / #5b797f / #2d3e3f) hierarchisch.

**Schwellwert-Pastell-Bewertung statt Min-Max:** ≤ 5 % grün (#d4ead4), 5–25 % gelb (#f5e8c4), > 25 % rot (#f4c8c8), bei !plausibel ausgegraut (#ededed, opacity 0.6). Bei allen innerhalb 5 %: keine Färbung. Min-Max-Skalierung verzerrt kommunikativ, Schwellwert ist konsistent zu menschlicher Wahrnehmung.

**Smart-Icon „Glühbirne mit Strahlen-Aura":** Marken-Element. Sparsam einsetzen — am Anfang von Kontextblau-Hinweis-Boxen oder Sensibilisierungs-Texten. NICHT als Box-Titel-Schmuck (wirkt wie PowerPoint-Anmutung).

**Tooltip-Pattern:** dynamisch aus Kontext, nicht statische Texte. Bei Pastell-Zellen: Erklärung „Warum diese Farbe?" mit Diff-zur-besten-Option. Bei Achs-Beschriftungen: „Was misst diese Achse?". Bei Methodik-Begriffen: Glossar-Lookup über `js/glossar.js`.

**Container-Mitte:** alle Sektionen `max-width 1100px` plus `margin: 0 auto`. Linkslastiges Kleben war ein Daniel-Bug (04.05.), Format-Hygiene durchgesetzt.

**Lese-Hilfe-Box-Pattern:** prominent unter Daten-Tabellen, NICHT klappbar. Pastell-Legende + Status-Quo-Hinweis + Plausibilitäts-Aussage in einer Box.

**Sondersituations-CTA-Format:** Kontextblau-Hintergrund (#7e9696, dunkler), Text mittig, Signal-Grün-Button als Akzent. Kein Smart-Icon im Titel. Format-Vorlage für jeden „Schreib-uns"-Block am Seitenende.

## Verbindliche Inhalts-Struktur (kein Panel-Schema mehr)

**Aussagen-Bündel statt Panel-Schema.** Im Rechner haben wir die Fünf-Panel-Struktur (Wirtschaftlichkeit / Radar / FRI / Cashflow / Risiko) verworfen zugunsten von drei Aussagen-Bündeln:

1. **Wirtschaftlichkeit** — Tabelle + Vermieter-Bilanz + WEG-Hinweise + Sensibilisierungs-Block
2. **Was-wäre-wenn** — drei Spalten Energiepreise / Förderung / Zukunftsszenario
3. **Big Picture** — 6-Achsen-Netzdiagramm mit Eco-2050-Future-Readiness-Methodik

Folge-Seiten sollten diese Reduktion übernehmen: drei klare Aussagen, kein Panel-Schema-Zwang. Beispiele:

- **Ranking-Seite:** drei Aussagen — „Wo stehst du?" / „Wer steht ähnlich?" / „Was bewegt das Ranking?"
- **Wegweiser:** drei Aussagen — „Welche Förderung passt?" / „Welcher Versorger?" / „Welche Beratung?"
- **Startseite:** drei Aussagen — „Was leistet die Plattform?" / „Wie funktioniert der Rechner?" / „Wie geht es weiter (Ranking, Profile, Wegweiser, Excel-Edition)?"

## Verbindliche Methodik-Trennung (Steigerungs-Heuristik)

**Web (Gefühl) → Excel (Tiefe) → Beratung (Begleitung).** Verbindlich für jedes Feature.

| Ebene | Was zeigt sie | Wann |
|---|---|---|
| Web | Aussagen-Bündel, Gefühl, Augenhöhe, Mittelwerte | Erstkontakt, Sondierung |
| Excel | Volle Tiefe, eigene Sensitivitäten, AfA-Detail, alle Hebel | Profis, Analysten, Vermieter mit Zahlenblick |
| Beratung | WEG-Begleitung, Steuerberater-Brücke, Sondersituationen | Wenn Web und Excel nicht reichen |

**Konsequenz:** Wenn auf Folge-Seiten ein Feature einen Profihaftigkeits-Geschmack bekommt, gehört es ins Excel, nicht ins Web. Web ist sondierend, nicht analytisch.

## Verbindliche Daten-Architektur

**Excel = Single Source of Truth.** parameter.json und preishistorie.json werden aus der Excel via `build_json.py` regeneriert. Web-Engine zieht daraus. Keine doppelte Buchhaltung im Code.

**Memory ist authoritative für Methodik.** Bei Diskrepanz Memory ↔ JSON gewinnt Memory, JSON wird im nächsten Excel-Patch nachgezogen (bidirektionale Optimierung). Beispiel aus v2.1: heizungs-spezifische Wartungs-Quoten aus Memory `project_excel_reparatur_wartung_modell.md` setzen sich gegen uniform 2 % im JSON durch.

**State-Architektur:** `input` für User-Pflicht-Eingaben (z. B. Bruttoinvest), `overrides` nur für Was-wäre-wenn-Schieberegler. Saubere Trennung verhindert Architektur-Drift.

## Verbindliche Tonalität

**Kein Marketing-Sprech.** Erklärend, nicht belehrend. Direkt, nicht wertend. Empathisch, nicht distanziert. Humor in Maßen.

**Belegbarkeit als USP.** A/B/C-Badges (siehe v3-Spec C1) bei methodisch belegbaren Aussagen. Quellen-Tooltips an Methodik-Begriffen. „Warum diese Zahl?"-Tooltip an Pastell-Zellen.

**Antizipation als Differenzierung.** Sensibilisierungs-Block plus Risiko-Banner heben uns von Status-quo-Rechnern ab. Folge-Seiten sollten diese Sicht halten — nicht nur „heute" zeigen, sondern „in 10–20 Jahren" sichtbar machen.

## Verbindliches Geschäftsmodell-Bild (Stand 05.05.2026)

**Drei Geschäftsmodell-Säulen:**

1. **Web kostenlos** — sondierende Plattform, Reichweite + Vertrauen
2. **Excel-Edition 49 € jährlich** — Tiefe für Profis, Update-Modell vereinfacht (kein 19-€-Update-Modell mehr)
3. **Beratung projektbasiert** — Sondersituationen, WEG-Versammlungen, Steuerberater-Brücke

**Plus interner Bereich:**
- **Steuerungs-Excel** — interne Datei für Daniel zur Inhalts-Steuerung der Website (Texte pro Seite, Versions-Verwaltung, Update-Tracking)
- Verkaufte Excel = neutrale öffentlich-bezahlbare Version, Steuerungs-Excel = interne unentgeltlich

## Verbindliche Marktstrategie

**Erstmarkt Erfurt, MFH-Fokus.** Pellets konditional ausgeblendet (Memory `project_marktstrategie_erfurt_zuerst.md`). Folge-Seiten sollten Erfurt-Spezifika klar markieren (FW-Satzung, Erfurt-Effektivpreis), Regional-Switch perspektivisch vorbereiten für München und ländlichen Raum.

## Was als Nächstes auf Folge-Seiten

**Ranking-Seite:**
- Drei-Aussagen-Bündel
- Pastell-Schwellwert-Bewertung der eigenen Position
- Big-Picture-Mini-Diagramm pro Profil-Karte
- Wegweiser-Verweis am Seitenende

**Wegweiser-Seite:**
- Scroll-Regal-Pattern (siehe Designsystem § 5) bleibt
- Drei-Aussagen-Bündel als Strukturierung
- Pastell-Markierung für gut-passende vs. nicht-passende Förderungen

**Startseite:**
- Big-Picture-Grafik (echte Visualisierung, nicht Platzhalter) als emotionaler Anker
- Drei-Aussagen-Bündel zur Plattform
- Steigerungs-Heuristik Web/Excel/Beratung als visuelles Drei-Stufen-Bild
- Sondersituations-CTA-Format am Ende

**Profilseiten (siehe Memory `project_profilseiten_spec.md`):**
- Stammdaten + Live-Kennzahl + Ranking-Position + Verlinkung
- Kein Investitionsrechner mehr im Profil

## How to apply

- **Beim Start jeder Folge-Seiten-Sitzung:** Dieser Memory ist die Basis-Lektüre. Designsystem-Memory plus Steigerungs-Heuristik-Memory plus Designsystem § 1–7 plus dieser hier.
- **Bei Konzept-Diskussion:** Drei-Aussagen-Bündel als Default-Frage („Welche drei Aussagen leistet diese Seite?").
- **Bei Implementation:** Pastell-Schwellwert + Container-Mitte + Lese-Hilfe-Box-Pattern + Sondersituations-CTA-Format aus dem Rechner übernehmen.
- **Bei Methodik-Frage:** Memory ist authoritative, JSON wird nachgezogen.
- **Bei UX-Schleifen:** drei strukturelle Konsolidierungs-Schleifen wie im Rechner-System (initial → erste Browser-Schleife → finale Konsolidierung) als Default-Prozess.
