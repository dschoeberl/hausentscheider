---
name: Hausentscheider Designsystem (Farben, Pastell, Smart-Icon, Tooltip, Scroll-Regal)
description: Verbindliche Design-Regeln für Web und Print. Farb-Hintergrund-Matrix, Pastell-Bewertungs-System (Schwellwert-Logik), Smart-Icon, Tooltip-Pattern, Scroll-Regal. „Dunkel-auf-dunkel" als No-Go.
type: project
---
**Verbindliches Designsystem für Hausentscheider-Plattform (Web + Print).** Stand 05.05.2026 nach drei Designdiskussionen mit Daniel (03./04./05.05.). „Dunkel-auf-dunkel", „Pastell ist Pflicht in Bewertungs-Tabellen" und „Schwellwert-Logik statt Min-Max" sind nicht-verhandelbare Regeln.

## 1 — Farb-Hintergrund-Matrix (verbindlich)

Bei jedem Hintergrund muss die Schriftfarbe so gewählt werden, dass sie eindeutig lesbar ist.

| Hintergrund | Erlaubte Schriftfarbe | NICHT erlauben |
|---|---|---|
| Weiß (`--white` / `--bg-light`) | Petrol-Dark (`--petrol-dark` `#1a3535`), Petrol (`--petrol` `#1a5c5a`), Stone-Gray (`--text-primary`) | Weiß, Petrol-Light auf Weiß |
| Petrol-Dark (`--petrol-dark` `#1a3535`) | Weiß (`--white`), Signal-Gelb-Hervorhebung erlaubt | Stone-Gray, Petrol-Light, Petrol-Dark |
| Petrol (`--petrol` `#1a5c5a`) | Weiß (`--white`) | Stone-Gray, Petrol-Light, Petrol-Dark |
| Petrol-Light (`--petrol-light` `#7ab8b5`) | Petrol-Dark, Weiß | Petrol, Petrol-Light |
| Signal-Gelb (`--signal` `#CFF77F`) | Petrol-Dark, Stone-Gray | Weiß, Signal-Gelb, Petrol-Light |
| Kontextblau (Hellblau-Petrol-Pastell) | Petrol-Dark, Stone-Gray | Petrol-Light, Petrol auf Kontextblau |
| Pastell-Grün (Vorteil-Marker) | Petrol-Dark, Stone-Gray | Weiß, Pastell-Grün |
| Pastell-Gelb (Hinweis-Marker) | Petrol-Dark, Stone-Gray | Weiß, Pastell-Gelb |
| Pastell-Rot (Risiko-Marker) | Petrol-Dark, Stone-Gray | Weiß, Pastell-Rot |

**Why-Background:** Daniel hat am 03.05.2026 nach C2-Live-Test mehrfach „dunkle Schrift auf dunklem Hintergrund" gefunden. Designsystem-Brüche, die nicht passieren dürfen.

## 2 — Pastell-Bewertungs-System für Tabellen (Schwellwert-basiert, verbindlich)

In allen Vergleichs-Tabellen wird jede Zelle mit Pastell-Hintergrund versehen, die das Vorteil/Hinweis/Risiko-Profil sichtbar macht.

| Marker | Pastell-Farbe | Bedeutung | Beispiel |
|---|---|---|---|
| Vorteil / günstig | `#d4ead4` (Pastell-Grün) | innerhalb 5 % der besten Option | Hybrid 1,38 €/m²/Monat (beste TCO) |
| Hinweis / durchschnittlich | `#f5e8c4` (Pastell-Gelb) | 5 %–25 % Abstand zur besten Option | WP 1,54 €/m²/Monat (+11,6 %) |
| Risiko / teuer | `#f4c8c8` (Pastell-Rot) | mehr als 25 % Abstand zur besten Option | FW 2,86 €/m²/Monat (+107 %) |
| Erklärung / Information | `#cce0e8` (Pastell-Blau-Kontext) | Erläuternder Text, kein Wert | Methodik-Tooltip-Inhalt |
| Ausgeschlossen | `#ededed` mit `opacity: 0.6` | Wert ist aus dem Vergleich ausgeschlossen (nicht plausibel) | Pellets bei `pelletsPlausibel = false`, falls Spalte sichtbar |

**Pattern:** keine kräftigen Excel-Default-Farben (rot/grün/gelb voll gesättigt). Pastell wirkt ästhetisch, nicht alarmierend, ist Print-tauglich, leserfreundlich.

**Algorithmus — Schwellwert-basiert (NEU 05.05.2026, korrigiert):**

Statt strikter Min-Max-Skalierung pro Zeile (zu hart bei kleinen Differenzen): prozentuale Schwellwerte zur besten Option in der Zeile.

```
Schritt 1: Bestimme Best-Option-Wert in der Zeile
  - Bei Kosten-Kennzahlen (TCO, €/m²/Monat, Annuität, Amortisation): Min = beste
  - Bei Förder-Kennzahlen: Max = beste
  - Pellets bei !plausibel: aus der Best-Bestimmung ausschließen

Schritt 2: Pro Option Diff in % zur Best-Option
  diff = abs(wert - best) / best × 100

Schritt 3: Klassifikation
  diff ≤ 5 %       → pastell-vorteil (grün)
  diff 5 % – 25 %  → pastell-hinweis (gelb)
  diff > 25 %      → pastell-risiko (rot)

Schritt 4: Spezialfall „alle eng beieinander"
  Wenn ALLE Optionen innerhalb 5 % → keine Färbung (transparent)
  Begründung: Ranking ist statistisch wenig aussagekräftig

Schritt 5: Pellets bei !plausibel
  → pastell-ausgeschlossen (#ededed, opacity 0.6)
  → kein Pastell, aus Skalierung raus
```

**Begründung Schwellwert statt Min-Max (Daniel-Befund 05.05.2026):**

Min-Max-Skalierung erzeugt kommunikative Verzerrung. Beispiel MFH-Default TCO Barwert:
- Hybrid 375k (Min, beste)
- WP 419k (+11,7 %)
- FW 778k (+107 %)

Mit Min-Max: WP und FW beide rot — gleiche Farbe für 11,7 % und 107 % Diff. WP wirkt fälschlich „schlecht", obwohl nur knapp über der besten Option. Mit Schwellwert: WP gelb (Hinweis), FW rot (Risiko) — kommunikativ sauberer.

**Tooltip pro Zelle (PFLICHT):**

Jede Pastell-bewertete Zelle bekommt ein Hover/Click-Tooltip mit dynamischer Erklärung „Warum diese Farbe?":

```
Beispiel WP TCO Barwert (gelb):
„Hohe Investition (126.000 € brutto, 105.000 € netto), aber niedrige
Energiekosten. Über 25 J liegt WP 11,7 % über der besten Option Hybrid
bei aktuellen Marktpreisen. Bei steigenden Gas-Preisen oder höherem
CO₂-Preis kippt das oft — siehe Schieberegler unten."
```

Der Tooltip-Text wird in `ergebnis.js` aus dem Klassifikations-Ergebnis dynamisch zusammengebaut.

**Lese-Hilfe-Box prominent unter Tabelle (NICHT nur klappbar rechts oben):**

Direkt unter der Wirtschaftlichkeits-Tabelle ein dauerhaft sichtbarer kompakter Block mit:
- Pastell-Legende (Vorteil/Hinweis/Risiko mit Hex-Werten)
- Status-Quo-Hinweis: „Diese Bewertung gilt bei heutigen Marktpreisen. Bei realistischeren Risiko-Annahmen (siehe Was-wäre-wenn unten) kippt sie typischerweise zugunsten der Wärmepumpe."
- Plausibilitäts-Hinweis Erhaltungsrücklage (dynamisch aus User-State)

Das macht die Pastell-Sicht zur Status-Quo-Aussage und das Was-wäre-wenn-Feld zum Dynamik-Beweis.

**Implementation:** als CSS-Klassen `.pastell-vorteil`, `.pastell-hinweis`, `.pastell-risiko`, `.pastell-erklaerung`, `.pastell-ausgeschlossen`. Render-Funktion `bewerteZelle(wert, alleWerteZeile, optionPlausibel, kennzahlTyp) → 'vorteil' | 'hinweis' | 'risiko' | 'neutral' | 'ausgeschlossen'` zentral in `engine.js`, in `ergebnis.js` aufgerufen. `kennzahlTyp` bestimmt ob Min oder Max die beste Option ist.

## 3 — Smart-Icon „Glühbirne mit Strahlen-Aura" (verbindlich)

**Definition:** Stilisierte Glühbirne mit sichtbarem Filament (geformt als kleines Hausdach als Marken-Bezug) und 4–6 ausstrahlenden Linien drumherum (Strahlen-Aura).

**Verwendung:**
- Risiko-Banner-Titel
- Sensibilisierungs-Block fossile Energie
- Methodik-Tooltip-Trigger bei Antizipations-Inhalt
- Marketing: Logo-Element auf Flyer/Visitenkarte/Social-Media

**Funktionalität:**
- SVG-Format, skalierbar 16 px bis Plakat
- Funktioniert in jeder Hintergrundfarbe (Stroke-only für dunkle Hintergründe, Filled für helle)

**Erstellung:** SVG-Datei wird in nächster Sitzung professionell entwickelt. Bis dahin Platzhalter `<icon name="hausentscheider-glühbirne">` oder Unicode-Kombi „💡✦". Lucide/Phosphor-Icons NICHT verwenden — eigene Marken-Glühbirne.

## 4 — Tooltip-Pattern für Abkürzungen und Begriffe

**HTML-Struktur:**
```html
<span class="begriff-tooltip" data-tip="epbd">
  EPBD
  <span class="info-icon">ⓘ</span>
</span>
```

**Tooltip-Inhalt** (Lookup in `glossar.js` zentral): Vollform, 1–2 Sätze laienverständliche Erklärung, ggf. Quellen-Verweis.

**Visualisierung:**
- `ⓘ` in Petrol-Light, lesbar
- Hover (Desktop) / Tap (Mobile) öffnet Popover mit Pastell-Blau-Hintergrund
- Mobile-Modal-Variante via `@media (max-width: 768px)` mit `position: fixed`

**Smart-Icon-Variante:** bei Antizipations-Inhalt statt `ⓘ` das Smart-Icon (Glühbirne).

## 5 — Horizontales Scroll-Regal-Pattern

Bei mehr als 4 Karten/Kacheln: kein Grid, sondern horizontales Scroll-Regal.

**Pattern:**
- `overflow-x: auto`, `scroll-snap-type: x mandatory`
- Karten `scroll-snap-align: start`, feste Breite (280 px Desktop, 240 px Mobile)
- Touch-Devices: natives Scrollen

**Wo verwendet:** Wegweiser-Block, Excel-Edition-Referenzbild-Kacheln, künftige Profilseiten-Cluster.

## 6 — Sprache und Tonalität

**Verbindlich für alle Web-Inhalte:**
- Du-Form (siehe Daniels Profil)
- Klar, ruhig, sachlich
- Keine Marketing-Buzzwords, keine Superlative
- Nicht alarmistisch
- „Voraussetzungen für gute Entscheidungen schaffen" als Leitlinie
- „Sollte" statt „muss" bei Empfehlungen
- „Wir" für Hausentscheider, „du" für den Nutzer

**Was nicht passieren darf:**
- Modernisierung als Nachteil framen
- Risiken als Drohung
- Wirtschaftlichkeit als alleinige Achse
- „Beste Option" als unumstößliche Wahrheit

## 7 — Format und Layout-Hygiene

**Listen und Tabellen:**
- Listen-Punkte (ol, ul) `padding-left ≥ 1.5 rem`
- Tabellen-Pastell-Bewertung pro Zelle, nicht pro Zeile (siehe §2)
- Tabellen-Köpfe in Petrol-Dark auf Bg-Light

**Aufklapper:**
- `<details>` bei dynamisch eingeblendeten Inhalten standardmäßig `open`
- Aufklapp-Indikator klar sichtbar

**Whitespace:**
- Container-Innenabstand 1.5–2 rem
- Listen-Items 0.5–0.75 rem vertikal
- Block-Trennungen 1.5–3 rem

**Container-Mitte (NEU 05.05.):** Container/Sektionen müssen mittig in der Seite stehen, nicht linkslastig klemmen. `margin: 0 auto` mit `max-width`. Daniel-Befund 05.05.: „Was-wäre-wenn" und „Du willst noch tiefer rechnen" klemmen am linken Rand.

**Sondersituations-CTA Hintergrund (NEU 05.05.):** Kontextblau wie bei „Sicht für Eigentümer und Vermietung" (dunkler), nicht das hellere Pastell-Blau-Erklärung. Text mittig zentriert, nicht von ganz links bis ganz rechts. „Meine Analyse senden"-Button in Signal-Grün (Akzent-Heberolle), nicht in Petrol.

## How to apply

- Bei jedem Spec-Schreiben: dieses Memory referenzieren
- Bei Code-Auftrag an Claude Code: explizit auf Designsystem-Memory verweisen, „dunkel-auf-dunkel No-Go"-Regel nennen
- Bei jedem CSS-Block-Edit: Farb-Hintergrund-Matrix prüfen
- Bei jeder Tabelle: Schwellwert-Pastell-Bewertung anwenden (Render-Funktion zentral)
- Bei jedem Tooltip: einheitliches Pattern
- Bei mehr als 4 Karten: Scroll-Regal

## Folgeaufgabe SVG-Erstellung Smart-Icon

Eigene Marken-Glühbirne als SVG:
- Filament als kleines Hausdach
- 4–6 Strahlen-Linien als Aura
- Stroke + Filled-Variante
- 24 px Standard, skalierbar bis 200+ px
- Petrol-Stroke / Signal-Gelb-Filled-Akzent

Nach Erstellung: `assets/icons/hausentscheider-icon.svg`.
