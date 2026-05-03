# Block C2 — Spec v2.1: Webansicht-Konsolidierung nach zweiter Browser-Schleife

**Stand:** 5. Mai 2026 (v2.1 — folgt auf v2.0 nach Daniels zweiter Browser-Schleife am 04.05.2026)

**Datengrundlage:** Excel `Der_Entscheider_Testsystem_v2.0_neutral.xlsx`, `daten/parameter.json`, `daten/preishistorie.json`. v1.1-Berechnungs-Logik bleibt unverändert.

**Architektur:** IIFE in `rechner.html` + Module-Bridge zu `js/engine.js` + `js/ergebnis.js` (additiv erweitert), `js/glossar.js` (existiert). Memory-Snapshots im Repo unter `memory/`.

**Verbindliche Memory-Verweise:**
- `memory/project_designsystem.md` — **Pflicht**: Schwellwert-Pastell-Logik §2, Farb-Matrix §1, Smart-Icon §3, Tooltip-Pattern §4, Scroll-Regal §5, Tonalität §6, Layout-Hygiene §7
- `memory/project_hybrid_risiko_modellierung.md` — 11 Sensibilisierungs-Punkte
- `memory/project_excel_patch_v2_1.md` — Folgeaufgaben Excel (Vermögensbilanz Block 3, Mieter-Nebenkosten, Big-Picture-Achsen-Tab)

**Ziel:** Webansicht auf drei klare Aussagen-Bündel reduzieren — **Wirtschaftlichkeit / Was-wäre-wenn / Big Picture**. Panels 2+3, Erweiterter Modus, Vorgeschmack-Aufklapper, Vermögensbilanz Block 3 raus. Pastell-Schwellwert-Logik korrigiert kommunikative Verzerrung.

---

## 0 — Was sich gegenüber v2.0 ändert (Überblick)

**Strukturell raus aus dem Web (in Excel verschoben):**

1. **Panel 2 (Entscheidungs-Radar) und Panel 3 (FRI) komplett raus.** FRI-Methodik ist über die 6 Big-Picture-Achsen integriert — keine eigenen Panels mehr nötig.
2. **Erweiterter Modus komplett raus.** Eigener Energiepreis ist im Wizard, andere Hebel waren überflüssig.
3. **Vorgeschmack-Aufklapper „TCO 25 J im Detail" komplett raus.** Die 4 Excel-Vorschau-Kacheln allein reichen.
4. **Vermögensbilanz Block 3 raus** aus Vermieter-Bilanz. Block 1 (qualitative Vorteile) und Block 2 (Cashflow + Mieter-Nebenkosten neu) bleiben.

**Strukturell neu / präzisiert:**

5. **Pastell-Bewertung jetzt Schwellwert-basiert** (≤5 % grün, 5–25 % gelb, >25 % rot, alle innerhalb 5 % keine Färbung). Min-Max-Skalierung war kommunikativ irreführend (WP +11,7 % wirkte gleich rot wie FW +107 %).
6. **Investitionskosten anpassbar** — als Pflichteingabe im Wizard (4 Felder Hybrid/WP/FW/Pellets-Brutto, Smart-Defaults) UND als Inline-Editor in der Wirtschaftlichkeits-Tabelle.
7. **Eigene Wohnungsgröße + Gesamtfläche** als Eingabe im Wizard Schritt 1 (Pflicht Gesamt, optional eigene Wohnung bei Vermietung).
8. **Mieter-Nebenkosten-Effekt dynamisch** in Vermieter-Bilanz Block 2 als zusätzliche Zeile (€/Monat für die eigene Wohnung).
9. **Was-wäre-wenn bekommt drittes Feld „Zukunftsszenario"** rechts neben A (Energiepreise) und B (Förderung). 5 dynamische Aussagen mit Vorher/Nachher-Effekt.
10. **Big-Picture-Achsen korrigiert:** Wirtschaftlichkeit jetzt TCO-basiert (statt Investitions-basiert, was WP fälschlich schwach zeigte). „Risiko-invers" → **„Risiko-Schutz"** (hoch = gut, konsistent zu allen Achsen). Tooltip pro Achse Pflicht.
11. **Markt-Durchschnittspreise im Wizard** als Inline-Hint am Energiepreis-Feld + Link zur Preishistorie.
12. **Tooltip pro Pastell-Zelle** mit dynamischer Erklärung „Warum diese Farbe?".
13. **Lese-Hilfe-Box prominent** direkt unter der Wirtschaftlichkeits-Tabelle (nicht nur klappbar rechts oben).

**Format-Bugs gefixt:**

14. WEG-Hinweise: Kontextblauer Rand unten geschlossen
15. Was-wäre-wenn + „Du willst noch tiefer rechnen": mittig statt linkslastig
16. Empfehlungs-Banner-Kommentar unter Big Picture komplett raus („Für dein Bewahrer-Profil tragen..." → weg)
17. Sondersituations-CTA: Kontextblau wie „Sicht für Eigentümer und Vermietung" (dunkler), Text mittig, „Meine Analyse senden"-Button in Signal-Grün, ohne PowerPoint-Glühbirne

**Geschäftsmodell-Klarstellung:**

18. **Excel-Edition: 49 € jährlich.** Kein Update-Preis-Modell. Wer eine aktuelle Excel will, zahlt 49 €. Pragmatisch, kein Tracking.

**Was unverändert aus v2.0 bleibt:**

- TCO-Methodik VDI 2067 Annuität (alle Verifikations-Werte ± 2 %)
- IIFE-Architektur mit `window.HE` + `he:state-changed`
- Wizard-Grundstruktur (4 Schritte, jetzt mit ~22 Felder)
- Sensibilisierungs-Block fossile Energie (11 Punkte)
- Risiko-Banner pro Empfehlung in Kontextblau mit Smart-Icon
- Pellets konditional ausgeblendet bei `!plausibel`
- Glossar `js/glossar.js` mit Tooltip-Lookup
- TCO Barwert bleibt als eine Zeile in der Wirtschaftlichkeits-Tabelle (mit Methodik-Tooltip)

---

## 0.5 — Steigerungs-Heuristik (übernommen aus v2.0)

Web (Gefühl) → Excel (Tiefe) → Beratung (Begleitung). v2.1 setzt das noch konsequenter um:

**Web zeigt drei zentrale Aussagen-Bündel:**
1. **Wirtschaftlichkeit** (Dashboard-Tabelle + Vermieter-Bilanz Block 1+2 + WEG-Hinweise + Sensibilisierungs-Block)
2. **Was-wäre-wenn** (drei Spalten: Energiepreise + Förderung + Zukunftsszenario)
3. **Big Picture** (6-Achsen-Netzdiagramm mit Eco-2050-Bezug)

Plus Excel-Edition-Brücke (4 Referenzbild-Kacheln + Tarif-Vergleich) und Wegweiser. Sondersituations-CTA am Ende.

**Excel zeigt die Tiefe** (Vermögensbilanz Block 3, Risiko-Sensitivität, freie Hebel, AfA-Detail, Mietspiegel-Klassen, KfW-Kombi, Sanierungspfad-Tab, Big-Picture-Achsen-Pflege).

**Beratung** für Sondersituationen, WEG-Versammlungs-Vorbereitung, Steuerberater-Brücke.

**Antizipation als USP:** Sensibilisierungs-Block + Risiko-Banner machen zukünftige Entwicklungen explizit. Differenzierungs-Achse gegenüber Status-quo-Rechnern.

---

## 1 — Konzeptioneller Rahmen

Nach v2.1 hat der Nutzer im Web:

1. **Eine substantielle Eingabe-Maske** (4 Schritte, ~22 Felder, inkl. Investitionskosten und Wohnungsgröße)
2. **Eine kompakte Ergebnis-Antwort** als Headline plus Risiko-Banner
3. **Eine Wirtschaftlichkeits-Tabelle** mit allen 5 Optionen (Pellets konditional), Schwellwert-Pastell-Bewertung, Tooltip pro Zelle, Lese-Hilfe-Box
4. **Eine Vermieter-Sicht** mit qualitativen Vorteilen + Cashflow + Mieter-Nebenkosten-Effekt (konditional)
5. **WEG-Hinweise** mit Beschluss/Mehrheit/Frist (konditional)
6. **Eine Sensibilisierungs-Erweiterung** mit 11 Punkten zu fossilen Risiken
7. **Drei interaktive Schieberegler-Spalten** (Energiepreise + Förderung + Zukunftsszenario-Aussagen)
8. **Ein Big-Picture-Netzdiagramm** mit 6 Achsen (Wirtschaftlichkeit / Nachhaltigkeit / Resilienz / Erweiterbarkeit / Zukunftsfähigkeit / Risiko-Schutz)
9. **Eine Excel-Edition-Brücke** mit 4 Referenzbild-Kacheln + Tarif-Vergleich
10. **Einen Wegweiser** als Scroll-Regal
11. **Einen Sondersituations-CTA** am Ende, generisch

**Was C2 v2.1 explizit nicht leistet:**
- Vermögensbilanz Block 3 (in Excel)
- Risiko-Übersicht / Risiko-Sensitivität (in Excel)
- IRR-Detail (in Excel)
- Volle Cashflow-Jahrestabellen (in Excel)
- Panel 2 Entscheidungs-Radar (komplett raus, FRI integriert in Big Picture)
- Panel 3 FRI als eigenes Panel (komplett raus, Achsen ins Big Picture)
- Erweiterter Modus (raus)
- Vorgeschmack-Aufklapper TCO-Detail (raus)
- PV/Batterie/Solarthermie-Konfiguration (Excel)
- §7b Sonder-AfA Detail / Mietspiegel-Klassen-Lookup / KfW-Kombi (Excel)

---

## 2 — Scope + Akzeptanz-Kriterien

**Im Scope von v2.1:**

- Wizard-Erweiterung (4 Schritte, ~22 Felder, Investitionskosten + Wohnungsgröße + Markt-Hint)
- Wirtschaftlichkeits-Tabelle mit Schwellwert-Pastell + Tooltip pro Zelle + prominenter Lese-Hilfe-Box
- Vermieter-Bilanz Block 2 erweitert um Mieter-Nebenkosten-Effekt-Zeile
- Vermieter-Bilanz Block 3 raus
- Panels 2+3 komplett raus
- Erweiterter Modus komplett raus
- Vorgeschmack-Aufklapper komplett raus
- Was-wäre-wenn als Drei-Spalten-Layout (A Energie, B Förderung, C Zukunftsszenario neu)
- Big-Picture-Achsen korrigiert (Wirtschaftlichkeit TCO-basiert, Risiko-Schutz statt invers, Tooltip pro Achse)
- Format-Bugs gefixt (WEG-Hinweise, Linkslastigkeit, Sondersituations-CTA-Format)
- Excel-Edition-Sektion: 49 € jährlich, ohne ✗-Liste in der Web-Spalte (TCO ist Web-drin)

**Akzeptanz-Kriterien (am Ende erfüllt):**

1. **Wizard Schritt 1 (Gebäude, 5 Felder):** PLZ/Ort, EFH/MFH, Wohneinheiten (bei MFH), Eigentümer-Typ (bei MFH), **eigene Wohnungsgröße m² (NEU, optional bei Vermietung)**
2. **Wizard Schritt 2 (Heizung & Verbrauch, 7 Felder):** Heizung, Baujahr, Wohnfläche, Heizlast, Jahresverbrauch, Jahreskosten aus Abrechnung, Energiepreis (mit **Markt-Hint inline + Link zu Preishistorie**)
3. **Wizard Schritt 3 (Sanierung & Investition, 10 Felder):** Sanierungsstand, Letzte Sanierung, Sanierungshorizont, Reparatur-Pauschale, Sanierungs-Investition jährlich, Erhaltungsrücklage pro WE/Monat (mit Live-Umrechnung €/m²/a), **Investitionskosten Hybrid/WP/FW/Pellets brutto (NEU, 4 Felder mit Smart-Defaults)**
4. **Wizard Schritt 4 (Kontext, 2 Felder):** Nutzungsart, Persona
5. **PV-Toggle nicht im Wizard.** Hinweis-Box auf Ergebnis-Seite: „PV / Batterie / Solarthermie als Verstärker → Excel-Edition"
6. **Zeitraum-Schieberegler oben** (1–30 J, fließend, Default 25)
7. **Wirtschaftlichkeits-Tabelle** mit Excel-Dashboard-Tab-Struktur (Investitions-Block / Jahreskosten-Block / Wirtschaftlichkeit-Block / Belastung-Block / Plausibilität)
8. **Pastell-Bewertung Schwellwert-basiert** (siehe Memory `project_designsystem.md` §2): ≤5 % grün, 5–25 % gelb, >25 % rot, alle innerhalb 5 % transparent, Pellets bei !plausibel ausgegraut
9. **Tooltip pro Pastell-Zelle** mit dynamischer Erklärung „Warum diese Farbe?" — Klick/Hover zeigt: hohe/niedrige Investition, Kostenanteil, Differenz in % zur besten Option, Dynamik-Hinweis
10. **Lese-Hilfe-Box prominent** unter Tabelle (nicht klappbar): Pastell-Legende + Status-Quo-Hinweis + Plausibilitäts-Aussage Erhaltungsrücklage
11. **Bruttoinvestitions-Zeilen-Inline-Editor:** klick auf Zelle → Eingabefeld mit Pfeil rauf/runter (Schritt 5.000 €) oder direkter Zahl-Eingabe → Tabelle und Big Picture rechnen live um
12. **Risiko-Banner** in Kontextblau mit Smart-Icon (wie v2.0)
13. **Sensibilisierungs-Block** mit 11 Punkten in Kontextblau (wie v2.0)
14. **Vermieter-Bilanz Block 1** (qualitative Vorteile, 9 Punkte) — unverändert
15. **Vermieter-Bilanz Block 2** (Jahres-Cashflow gemittelt 25 J) mit Pastell-Bewertung + **NEUE Zeile „Mieter-Nebenkosten-Effekt p.m." pro Heizoption**
16. **Mieter-Nebenkosten-Effekt-Berechnung** dynamisch aus User-State (siehe §6.3)
17. **Vermieter-Bilanz Block 3 raus** aus Web — komplett in Excel
18. **WEG-Hinweise** (3 Stub-Inhalte) mit `<details open>`, Format-Fix Listen-Padding, Kontextblauer Rand unten geschlossen, kein doppelter Beratungs-CTA (der ist am Ende)
19. **Was-wäre-wenn DREI Spalten-Layout** (Desktop): A Energiepreise (3 Slider) | B Förderung (Toggles+Master+Presets) | **C Zukunftsszenario (NEU, 5 Aussagen)**. Mobile: gestapelt.
20. **Zukunftsszenario-Feld 5 Aussagen** dynamisch aus Schieberegler-State (siehe §9.3)
21. **Big Picture nach Was-wäre-wenn**, dynamisch reagierend, mit 6 Achsen
22. **Big-Picture-Wirtschaftlichkeits-Achse: TCO-basiert** (niedrige TCO = hoher Achs-Wert, normalisiert über 5 Optionen)
23. **Big-Picture-Risiko-Achse: „Risiko-Schutz"** (hoch = gut, gegenteil von Risiko)
24. **Hover-Tooltip pro Achs-Beschriftung** mit Erklärung „Was misst diese Achse?"
25. **Empfehlungs-Banner-Kommentar unter Big Picture raus** — nur Eco-2050-Methodik-Hinweis mit Link zum Startseiten-Summary
26. **Excel-Edition-Sektion** mit 4 Referenzbild-Kacheln + 3-Spalten-Tarif-Vergleich. Web-Spalte zeigt was im Web ist, Excel-Spalte zeigt zusätzliche Tiefe inkl. PV/Batterie/Solarthermie. **Update-Spalte zeigt: 49 € jährlich** (kein Update-Preis-Modell). Web-Spalte ohne ✗-Liste.
27. **Wegweiser** horizontales Scroll-Regal (siehe Memory `project_designsystem.md` §5)
28. **Sondersituations-CTA** am Ende, **Kontextblau-Hintergrund** (wie „Sicht für Eigentümer"), Text mittig, **„Meine Analyse senden"-Button in Signal-Grün**, kein PowerPoint-Glühbirne-Icon
29. **Format-Hygiene durchgesetzt:** Container mittig (`max-width` + `margin: 0 auto`), Listen-Padding ≥1.5rem, Whitespace 1.5–2rem
30. **Designsystem-Konformität:** DevTools-Audit, kein Dunkel-auf-dunkel
31. **Verifikations-Werte aus v1.1 §3.7** treffen weiterhin ± 2 %
32. **Re-Render-Performance** < 100 ms pro Schieberegler-Move

---

## 3 — Wizard (4 Schritte, ~22 Eingaben)

**Schritt 1 — Dein Gebäude (5 Felder):**

| # | Feld | Typ | Default |
|---|---|---|---|
| 1 | PLZ/Ort | Text + Suggestion | leer |
| 2 | Gebäudetyp | Toggle EFH/MFH | „MFH" |
| 3 | Wohneinheiten (nur MFH) | Numerik 2–100 | 14 |
| 4 | Eigentümer-Typ (nur MFH) | Dropdown | „WEG" |
| 5 | **Eigene Wohnungsgröße m² (NEU, optional bei Vermietung)** | Numerik | leer; Hint „Falls du Eigentümer einer Wohnung im MFH bist und vermietest — für Mieter-Nebenkosten-Effekt-Berechnung" |

**Schritt 2 — Heizung & Verbrauch (7 Felder):**

| # | Feld | Typ | Default |
|---|---|---|---|
| 6 | Aktuelle Heizung | Dropdown 6 Optionen | „Gas-Brennwert" |
| 7 | Baujahr | Year Input | 1998 |
| 8 | Wohnfläche | Slider | 908 (MFH) / 140 (EFH) |
| 9 | Heizlast | Slider + ⓘ | aus Hilfsregel |
| 10 | Jahresverbrauch | Slider | 95.000 (MFH) / 18.000 (EFH) |
| 11 | Jahreskosten aus Abrechnung | €-Eingabe | leer |
| 12 | Energiepreis (energieträger-spezifisch) | ct/kWh-Eingabe | Markt-Schnitt |

**Inline-Hint bei Energiepreis (NEU):**
- Direkt unter dem Eingabefeld: „Markt-Schnitt aktuell: Gas 8,57 ct/kWh • FW 17,5 ct/kWh • WP-Strom 25 ct/kWh — Stand Mai 2026"
- Klein-Link rechts: „mehr unter [Preishistorie](/preishistorie.html) →"
- Bei User-Eingabe-Diff > 10 % vom Markt: „dein Vertrag liegt X% über/unter Markt-Schnitt"

**Schritt 3 — Sanierung, Erhaltung & Investitionskosten (10 Felder):**

| # | Feld | Typ | Default |
|---|---|---|---|
| 13 | Sanierungsstand | Toggle + ⓘ | „teilsaniert" |
| 14 | Letzte Sanierung (Jahr, optional) | Year Input | leer |
| 15 | Sanierungshorizont | Toggle 5/10/15/20 | 10 |
| 16 | Reparatur-Pauschale/J | €-Slider | 8.000 (MFH) / 1.500 (EFH) |
| 17 | Sanierungs-Investition jährlich | €-Slider + ⓘ | 0 |
| 18 | Erhaltungsrücklage pro WE/Monat | €-Eingabe + Live-Umrechnung €/m²/a | 0 |
| 19 | **Bruttoinvestition Hybrid (NEU)** | €-Slider + ⓘ | 73.000 (MFH) / 24.000 (EFH) |
| 20 | **Bruttoinvestition WP (NEU)** | €-Slider + ⓘ | 126.000 (MFH) / 28.000 (EFH) |
| 21 | **Bruttoinvestition FW (NEU)** | €-Slider + ⓘ | 33.000 (MFH) / 18.000 (EFH) |
| 22 | **Bruttoinvestition Pellets (NEU)** | €-Slider + ⓘ | 63.000 (MFH) / 32.000 (EFH); ausgeblendet wenn `!pelletsPlausibel` |

**ⓘ-Tooltip an Investitionskosten:**
> „Wir haben hier {Wert} € geschätzt — das ist ein typischer Wert für ein {EFH/MFH} mit deiner Heizlast. Wenn du ein konkretes Angebot vom Heizungsbauer hast, trag den genauen Wert ein. Du kannst die Werte auch in der Ergebnis-Tabelle nochmal ändern."

**Plausibilitäts-Hinweis:**
- Wenn Bruttoinvestition WP < 50 % der Default: „Sehr niedriger Wert — bist du sicher? Typisch sind 100–180k für ein MFH 14 WE."
- Wenn Erhaltungsrücklage × 12 / Wohnfläche < 13 €/m²/a: „Deine Rücklage liegt unter dem GdW-Richtwert (13–17 €/m²/a)."

**Schritt 4 — Kontext (2 Felder):**

| # | Feld | Typ | Default |
|---|---|---|---|
| 23 | Nutzungsart | Dropdown | „Mischnutzung" (MFH) / „Selbstnutzung" (EFH) |
| 24 | Persona | 3 Buttons | „Optimierer" |

(22 Felder bei MFH+Vermietung, weniger bei EFH-Selbstnutzung — Pellets-Investition wird konditional ausgeblendet)

---

## 4 — Ergebnis-Seite Reihenfolge (v2.1)

```
1. Annahmen-Transparenz-Box (klappbar)
2. Headline-Antwort
3. Risiko-Banner (Kontextblau, Smart-Icon)
4. Persona-Toggle + Mini-Cockpit
5. Zeitraum-Schieberegler (oben, fließend)
6. WIRTSCHAFTLICHKEITS-TABELLE (Schwellwert-Pastell + Tooltip pro Zelle + Inline-Editor Investition)
7. Lese-Hilfe-Box (prominent, dauerhaft sichtbar)
8. SENSIBILISIERUNGS-BLOCK fossile Energie (11 Punkte, Kontextblau)
9. SICHT FÜR EIGENTÜMER MIT VERMIETUNG (konditional)
   - Block 1: Qualitative Vorteile (9 Punkte)
   - Block 2: Jahres-Cashflow + Mieter-Nebenkosten-Effekt (NEU)
   [Block 3 RAUS]
10. WEG-HINWEISE (konditional bei MFH+WEG, open, Format-Fix)
[Panel 2 RAUS]
[Panel 3 RAUS]
11. WAS-WÄRE-WENN — DREI SPALTEN
    A: Energiepreise | B: Förderung | C: Zukunftsszenario (NEU)
12. BIG PICTURE — NETZDIAGRAMM (6 Achsen, Risiko-Schutz statt invers)
[Empfehlungs-Banner-Kommentar RAUS]
[Vorgeschmack-Aufklapper RAUS]
[Erweiterter Modus RAUS]
13. EXCEL-EDITION (4 Referenzbild-Kacheln + 3-Spalten-Tarif-Vergleich, 49 € jährlich)
14. WEGWEISER (horizontales Scroll-Regal)
15. SONDERSITUATIONEN-CTA (Kontextblau, mittig, Signal-Grün-Button)
```

---

## 5 — Wirtschaftlichkeits-Tabelle (Schwellwert-Pastell + Tooltip + Lese-Hilfe-Box)

**Struktur:** wie v2.0 (Excel-Dashboard-Tab-Spiegelung), aber mit drei Korrekturen.

**Kernzeilen:**
```
                          Gas-BW  Hybrid    WP      FW      [Pellets]*
INVESTITION
Bruttoinvestition          0 €    73.000  126.000  33.000   [Inline-Editor]
Fördersumme                0 €    21.000   21.000      0
Netto-Investition          0 €    52.000  105.000  33.000
Sonderumlage pro Einheit   0 €         0    2.875       0

JAHRESKOSTEN HEUTE
Energie + Wartung + CO₂   10.424  9.238    8.766  18.804
CO₂-Kosten p.a.            1.949    585        0   2.412
CO₂-Emissionen p.a.        18,6 t  5,6 t   0,0 t   23,0 t

WIRTSCHAFTLICHKEIT
Gesamt-Annuität           16.138  15.000  16.767  31.118
TCO Barwert (Zeitraum) ⓘ 403.447 375.012 419.168 777.949

BELASTUNG
€/m²/Monat ★              1,48 €  1,38 €  1,54 €  2,86 €
Amortisation vs. Gas        —     43,8 J  63,3 J   n/a
```
*Pellets-Spalte nur wenn `pelletsPlausibel = true`

### 5.1 Schwellwert-Pastell-Bewertung (gemäß Memory §2)

```
Pro Zeile:
  best = Min (für Kosten) oder Max (für Förderung)
  Pellets bei !plausibel: aus Best-Bestimmung raus

Pro Option:
  diff = abs(wert - best) / best × 100
  ≤ 5 %       → pastell-vorteil
  5 % – 25 %  → pastell-hinweis
  > 25 %      → pastell-risiko

Spezialfall:
  Wenn alle innerhalb 5 % → keine Färbung
```

### 5.2 Tooltip pro Pastell-Zelle (PFLICHT)

Klick/Hover auf Zelle → dynamischer Tooltip:

```
[Smart-Icon] Warum hat diese Zahl diese Farbe?

{Wert} €/m²/Monat (gelb)

Zur besten Option {beste_option} ({best_wert} €/m²/Monat) liegt diese
Option {diff_prozent} % höher.

Komponenten-Erklärung:
- Hohe/Niedrige Investition: {wert}
- Energiekosten-Anteil: {wert}/Jahr
- {kontext-spezifischer Hinweis}

Bei realistischeren Annahmen (siehe Was-wäre-wenn unten) kippt diese
Bewertung typischerweise.
```

### 5.3 Inline-Editor für Bruttoinvestition

Jede Bruttoinvestitions-Zelle ist klickbar:

```
Klick auf Zelle (z. B. WP 126.000 €):
  → Inline-Editor öffnet sich an der Zelle
  → Pfeil rauf/runter (Schritt 5.000 €) oder direkte Eingabe
  → „Übernehmen" (oder Enter) bestätigt
  → Tabelle UND Big Picture UND Zukunftsszenario rechnen live um
  → State.overrides.bruttoInvest[option] = neuerWert
```

UI: Tabelle bleibt, Wert wird durch Eingabefeld mit Auf/Ab-Pfeilen ersetzt. Bestätigen-Button im Mini-Format. „Zurück auf Default"-Link unter dem Editor.

### 5.4 Lese-Hilfe-Box (PROMINENT unter Tabelle, nicht klappbar)

```html
<div class="lese-hilfe-box" hintergrund="bg-light">
  <h4>Lese-Hilfe für die Tabelle</h4>
  
  <div class="pastell-legende">
    <span class="pastell-vorteil">Vorteil (≤ 5 % Abstand zur besten Option)</span>
    <span class="pastell-hinweis">Hinweis (5–25 % Abstand)</span>
    <span class="pastell-risiko">Risiko (> 25 % Abstand)</span>
  </div>
  
  <p class="status-quo-hinweis">
    [Smart-Icon] Diese Bewertung gilt bei heutigen Marktpreisen.
    Bei realistischeren Risiko-Annahmen (siehe Was-wäre-wenn unten)
    kippt sie typischerweise zugunsten der Wärmepumpe.
  </p>
  
  <p class="erhaltung-status" data-state="dynamisch">
    [Plausibilitäts-Aussage Erhaltungsrücklage:
     „Deine Rücklage X €/m²/a liegt {unter / im / über} GdW-Richtwert
     13–17 €/m²/a. Bei {Sanierungshorizont}-Jahres-Plan reicht das
     {nicht / knapp / gut}."]
  </p>
</div>
```

**Wichtig:** dauerhaft sichtbar, nicht klappbar. Mobile responsive.

---

## 6 — Vermieter-Bilanz (Block 1+2, Block 3 raus)

**Block 1 — Qualitative Vorteile:** unverändert (9 Punkte aus v2.0).

**Block 2 — Jahres-Cashflow Vermieter (Pastell + Mieter-Nebenkosten):**

| Posten | Gas | Hybrid | WP | FW |
|---|---|---|---|---|
| §559 Modernisierungs-Umlage | 0 | +X | +X | +X |
| Mietspiegel-Klassen-Sprung | 0 | +Y | +Y | +Y |
| CO₂-Verschiebung (Wirksam_VM) | −Z | +Z' | +Z' | +Z' |
| Mieterstrom-Erlös (PV) | 0 | 0 | 0 | 0 |
| Wartungs-Kosten-Differenz | 0 | −W | −W | −W |
| Mietausfall-Quote | −A | −A | −A | −A |
| Bauprozess-Mietminderung | 0 | −B | −B | −B |
| **Σ Cashflow Vermieter (€/a)** | −2.778 | +544 | +2.046 | +859 |
| **Mieter-Nebenkosten-Effekt €/Monat (NEU)** | +X | −Y | −Y | −Y |

Pastell-Bewertung pro Zelle (gemäß Memory §2). Σ-Zeile prominent, Petrol-Dark-Hintergrund mit weißer Schrift.

### 6.3 Mieter-Nebenkosten-Effekt-Berechnung (NEU)

Dynamisch aus User-State, nicht pauschal:

```
Schritt 1: Berechne Differenz Status quo Gas vs. jede Modernisierung
  ΔCO₂-Kosten/a = CO₂-Kosten[Gas] - CO₂-Kosten[Modernisierung]
  ΔEnergiekosten/a = Energiekosten[Gas] - Energiekosten[Modernisierung]

Schritt 2: Mieter-Anteil nach BEHG-Stufenmodell
  Default für teilsanierte MFH (Klasse C-D): 50/50
  → Mieter-Anteil-CO₂ = 0,5
  → Mieter-Anteil-Energiekosten = 1,0 (über Heizkostenabrechnung)

Schritt 3: Wohnflächen-Anteil
  anteil = eigeneWohnflaeche / gesamtWohnflaeche
  (wenn eigeneWohnflaeche leer: anteil = 1/Wohneinheiten)

Schritt 4: Mieter-Effekt
  effektProJahr = (ΔCO₂ × 0,5 + ΔEnergie × 1,0) × anteil
  effektProMonat = effektProJahr / 12

Anzeige:
  Bei Status quo Gas: positiv (Mehrbelastung Mieter steigt mit CO₂)
  Bei Modernisierung: negativ (Entlastung)
```

**Tooltip an der Mieter-Nebenkosten-Zeile:**
> „Berechnung dynamisch aus deiner Wohnungs-Konstellation. CO₂-Aufteilung Vermieter/Mieter folgt BEHG-Stufenmodell (Default 50/50 bei teilsaniertem MFH). Energiekosten gehen voll in die Heizkostenabrechnung (HeizkostenV). Quellen: BEHG, HeizkostenV §7, Verbraucherzentrale Energieberatung."

**Funktion in `engine.js`:**
```javascript
function berechneMieterNebenkostenEffekt(option, input, params) {
  // returns: € pro Monat für die eigene Wohnung
}
```

**Block 3 (Vermögensbilanz):** RAUS aus Web. Komplett in Excel.

---

## 7 — Sensibilisierungs-Block fossile Energie

Unverändert aus v2.0 mit 11 Punkten aus Memory `project_hybrid_risiko_modellierung.md`. Position: zwischen Wirtschaftlichkeits-Lese-Hilfe-Box und Vermieter-Bilanz. Kontextblau, Smart-Icon.

---

## 8 — WEG-Hinweise (Format-Fix)

Inhalt unverändert (3 Stub-Inhalte: was beschlossen / Mehrheit / Frist). Format-Fixes:

- Listen-Padding ≥ 1.5rem
- `<details open>` für dynamisch eingeblendete Inhalte
- **Kontextblauer Rand am unteren Container-Rand schließen** (Daniel-Bug 04.05.)
- „muss" → „sollte" („was sollte beschlossen werden")
- Beratungs-CTA-Box am Ende der WEG-Hinweise weg (CTA wandert ans Ende der Seite)

---

## 9 — Was-wäre-wenn (Drei-Spalten-Layout, NEU)

**Position:** zwischen WEG-Hinweise (oder Vermieter-Bilanz, wenn keine WEG) und Big Picture.

**Layout Desktop:** 3 Spalten nebeneinander. Mobile: gestapelt.

**Wichtig:** Container mittig zentriert (`max-width 1200px, margin: 0 auto`). Daniel-Bug 04.05.: aktuell linkslastig.

### 9.1 Spalte A — Energiepreise (3 Slider)

- Gas-Preis (min/max aus block1.PreisGas)
- FW-Preis (min/max aus block1.PreisFW)
- WP-Strom-Preis (min/max aus block1.PreisWP)

Default = User-Eingabe oder Markt-Schnitt aus `preishistorie.json`.

### 9.2 Spalte B — Förderung (4 Toggles + Master + 3 Presets)

Unverändert aus v1.1.

### 9.3 Spalte C — Zukunftsszenario (NEU, 5 Aussagen)

Hintergrund: Kontextblau (Pastell-Blau-Petrol). Smart-Icon im Titel. Live-Update bei jeder Schieberegler-Bewegung.

**Inhalt:**

```
[Smart-Icon] Was sich verändert

1. €/m²/Monat beste Option
   Hybrid 1,38 € → 1,44 € (+0,06 €)
   Markt-Vergleich: ø 1,42 €/m²/Monat MFH-Innenstadt

2. Beste Option kippt
   [Mini-Ranking visuell]
   1. Hybrid (war 1.)  
   2. Wärmepumpe (war 3.) ↑
   3. Status quo Gas (war 2.) ↓

3. Mieter-Nebenkosten-Effekt
   bei deiner 50 m²-Wohnung: 26 € → 31 €/Monat (+5 €)
   bei Status quo Gas Mehrbelastung

4. Amortisation Wärmepumpe vs. Gas
   17 Jahre → 14 Jahre (3 Jahre kürzer)

5. Betriebskosten Jahresgesamt für dein Gebäude
   10.424 € → 11.560 €/Jahr (+1.136 €)
   (was würde 5 ct mehr Gas pro kWh bewirken)
```

**Berechnungs-Logik in `engine.js`:**

```javascript
function berechneZukunftsszenarioAussagen(state, params) {
  const ist = berechneAlleKennzahlen(state, params);
  const stateMitOverrides = applyOverrides(state, params);
  const neu = berechneAlleKennzahlen(stateMitOverrides, params);

  return {
    eurProQmMonat: { ist: ist.bestes_eur_qm, neu: neu.bestes_eur_qm, marktVergleich: ... },
    besteOptionRanking: { ist: ist.ranking, neu: neu.ranking, kippWarning: ... },
    mieterNebenkostenEffekt: { ist: ..., neu: ... },
    amortisationWPvsGas: { ist: ..., neu: ... },
    betriebskostenJahresgesamt: { ist: ..., neu: ... }
  };
}
```

**Render:** dynamisch in `ergebnis.js` `renderZukunftsszenarioFeld(state, params)`. Live-Update bei `he:state-changed`.

---

## 10 — Big Picture (6 Achsen, korrigiert)

**Position:** nach Was-wäre-wenn. Highlight, dynamisch reagierend auf Schieberegler.

**Visuell:** Container mit Petrol-Light-Akzent, großes Radar-Chart via Chart.js, eine Farbfläche pro Heizoption.

**Die 6 Achsen (mit Hover-Tooltip pro Achse):**

| Achse | Was sie misst | Tooltip |
|---|---|---|
| **Wirtschaftlichkeit** *(NEU TCO-basiert)* | TCO Barwert normalisiert (niedrige TCO = hoher Achs-Wert) | „Berücksichtigt Investition, Förderung, Energie, Wartung, CO₂ über deinen Zeitraum. Hoch = wirtschaftlich." |
| **Nachhaltigkeit** | CO₂-Bilanz pro Jahr, normalisiert | „Niedrige CO₂-Emissionen. Bezug zu planetaren Grenzen — 422 ppm CO₂, Klimaneutralität 2045." |
| **Resilienz** | Robustheit gegen Marktschocks und Versorgungsstörungen | „Wie unabhängig bist du von Gas-Netz, Strom-Netz, Versorger-Monopol?" |
| **Erweiterbarkeit** | Integrierbarkeit von PV, Batterie, Solarthermie, Wallbox | „Kannst du dein System schrittweise erweitern?" |
| **Zukunftsfähigkeit** | Politische Konformität (EPBD, GMG, Wärmeplanung) | „Wie gut passt deine Lösung zu kommenden gesetzlichen Anforderungen?" |
| **Risiko-Schutz** *(NEU, war Risiko-invers)* | Stranded-Asset, Sanierungs-Schuld, regulatorische Sprünge — gegenteil von Risiko | „Wie gut bist du gegen Stranded-Asset, regulatorische Sprünge, Kostenexplosion abgesichert? Hoch = geschützt." |

**Achs-Werte algorithmisch + Heuristik (gemäß `BIG_PICTURE_HEURISTIK_FIX` in engine.js, Folgeaufgabe Excel-Tab):**

- Wirtschaftlichkeit: aus TCO-Barwert-Werten normalisiert (0-100, niedrige TCO = hoch)
- Nachhaltigkeit: aus CO₂-Emissionen normalisiert (niedrig = hoch)
- Resilienz, Erweiterbarkeit, Zukunftsfähigkeit, Risiko-Schutz: aus `BIG_PICTURE_HEURISTIK_FIX`-Konstante mit per-Option-Werten

**Empfehlungs-Banner-Kommentar unter Big Picture: KOMPLETT RAUS** (Daniel-Befund 04.05.).

**Stattdessen Methodik-Box unter Big Picture:**

```html
<div class="bigpicture-methodik">
  <p>
    Diese 6 Achsen folgen dem Future-Readiness-Ansatz aus dem
    <a href="/index.html#ansatz">Eco-2050-Institut</a> —
    eine ganzheitliche Sicht auf Wirtschaftlichkeit, Nachhaltigkeit,
    Resilienz, Erweiterbarkeit, Zukunftsfähigkeit und Risiko-Schutz.
  </p>
</div>
```

**Render:** Chart.js Radar-Chart, 5 Datasets, 6 Achsen, dynamisch.

**Folgeaufgabe Excel-Patch v2.1 (siehe Memory):** Big-Picture-Achsen-Tab in der Excel anlegen, JSON-Export, JS-Konstante durch JSON-Lookup ersetzen.

---

## 11 — Excel-Edition-Sektion (49 € jährlich)

**Position:** nach Big Picture (vor Wegweiser).

### 11.1 Einleitung

```
Du willst noch tiefer rechnen — für Profis und Analysten

Wenn der Web-Rechner zu wenig ist und du selbst rechnen
möchtest, in Ruhe, zu Hause, mit allen Hebeln und Quellen —
hier ist deine Werkzeug-Erweiterung.
```

(Container mittig zentriert, Daniel-Bug 04.05.: aktuell linkslastig.)

### 11.2 Vier Referenzbild-Kacheln

Unverändert aus v2.0: TCO Detail / Cashflow 25 J / Sanierungspfad / Sensitivitäts-Analyse. SVG-Platzhalter, später echte Screenshots.

### 11.3 Drei-Spalten-Tarif-Vergleich (vereinfacht)

```
WEB KOSTENLOS (0 €)              EXCEL EDITION (49 € jährlich)
────────────────────────         ────────────────────────
✓ Dashboard-Vergleich             ✓ Alle Web-Inhalte
✓ Sensibilisierung                ✓ Vermögensbilanz Block 3
✓ Big Picture                     ✓ Volle Cashflow-Tabelle
✓ Was-wäre-wenn                   ✓ Sanierungspfad-Tab
✓ Mieter-Nebenkosten-Effekt       ✓ §7b AfA-Detail
✓ TCO Barwert                     ✓ Mietspiegel-Klassen-Lookup
                                  ✓ KfW-Kombi-Modell
                                  ✓ Tab Risiken
                                  ✓ Tab CO₂-Aufteilung
                                  ✓ Tab Fernwärme-Logik
                                  ✓ PV / Batterie / Solarthermie
                                  ✓ Sensitivität frei wählbar
                                  ✓ Direktversand per E-Mail

                                  [Excel kaufen — 49 €]
```

**Wichtig (NEU):**
- Web-Spalte ohne ✗-Liste (TCO ist Web-drin, andere Sachen sind explizit als Excel-Mehrwert)
- Excel-Spalte enthält **PV / Batterie / Solarthermie** explizit als Mehrwert
- **Geschäftsmodell: 49 € jährlich**, kein Update-Preis-Modell. Pragmatisch, kein Tracking. Wer aktuelle Datenbasis will, kauft jährlich neu.
- Tonalität: Werkzeug-Übersicht, kein Verkaufs-Stil

---

## 12 — Wegweiser (Scroll-Regal, unverändert)

Position nach Excel-Edition. Pattern aus Memory §5. Initiale Karten: BAFA / KfW / Solarrechner Thüringen / Verbraucherzentrale / SWE Erfurt.

---

## 13 — Sondersituations-CTA (Format-Fix)

**Position:** ganz am Ende.

**Format-Korrekturen:**

- **Hintergrund: Kontextblau** wie bei „Sicht für Eigentümer und Vermietung" (NICHT das hellere Pastell-Blau-Erklärung)
- **Container mittig zentriert** (max-width, margin: 0 auto). Text mittig statt von-links-bis-rechts
- **Kein Smart-Icon im Titel** (Glühbirne+Stern wirkt wie PowerPoint-Icon, Daniel-Befund). Stattdessen: nur Textzeile mit großer Schrift
- **Button „Meine Analyse senden" in Signal-Grün** (Hintergrund), nicht Petrol — bessere Akzent-Heberolle

**Inhalt:**

```
Du hast eine Sondersituation?

Vielleicht planst du eine Eigentümerversammlung zur
Heizungs-Modernisierung. Oder du fragst dich, wie deine
WEG die Sonderumlage verteilt nach MEA-Anteilen. Oder du
möchtest dein Sanierungs-Konzept mit Energieberater
abstimmen, bevor du eine Investition tätigst. Oder du
hast eine ganz andere Frage, die der Web-Rechner nicht
beantwortet.

Schreib uns — wir lesen, wir antworten, wir begleiten dich.

dialog@hausentscheider.de

[Meine Analyse senden]   ← Signal-Grün-Button

Erste Antwort kostenlos — tiefere Beratung sprechen wir
projektbasiert ab.
```

---

## 14 — Designsystem-Konformität (verbindlich)

**Vollständig in `memory/project_designsystem.md` dokumentiert.**

**Drei kritische Punkte für v2.1:**

1. **Schwellwert-Pastell-Logik §2** — verbindlich, ersetzt Min-Max
2. **Container-Mitte §7** — alle Sektionen mittig, kein Linkslastig-Kleben
3. **Sondersituations-CTA-Format §7** — Kontextblau, mittig, Signal-Grün-Button

DevTools-Audit beim Browser-Test: kein Dunkel-auf-dunkel, alle Pastell-Klassen korrekt, Container-Mitte überall.

---

## 15 — Datei-Struktur nach v2.1

```
hausentscheider/
├── rechner.html                  (überschrieben)
├── js/
│   ├── engine.js                 (erweitert: Schwellwert-Pastell, Mieter-Nebenkosten, Zukunftsszenario, Big-Picture-TCO-basiert)
│   ├── ergebnis.js               (erweitert: Tooltip-pro-Zelle, Lese-Hilfe-Box, Inline-Editor Investition, Drei-Spalten-Was-wäre-wenn, Sondersituations-CTA-Format)
│   └── glossar.js                (existiert)
├── memory/
│   ├── project_designsystem.md         (aktualisiert mit Schwellwert-Logik)
│   ├── project_hybrid_risiko_modellierung.md  (existiert)
│   └── project_excel_patch_v2_1.md     (NEU im Repo, Excel-Folgeaufgaben)
├── docs/
│   ├── C1_BlockSpec_v3.md
│   ├── C2_BlockSpec_v1.md
│   ├── C2_BlockSpec_v2.0.md
│   └── C2_BlockSpec_v2.1.md           (NEU)
├── daten/
│   ├── parameter.json
│   ├── preishistorie.json
│   └── glossar.json (oder als js/glossar.js-Konstante)
└── ...
```

---

## 16 — Was NICHT in v2.1

- **Panel 2 Entscheidungs-Radar — KOMPLETT RAUS** (FRI integriert in Big Picture)
- **Panel 3 FRI als eigenes Panel — KOMPLETT RAUS**
- **Erweiterter Modus mit Profi-Hebeln — KOMPLETT RAUS** (Eigener Energiepreis ist im Wizard, andere obsolet)
- **Vorgeschmack-Aufklapper TCO-Detail — KOMPLETT RAUS** (4 Excel-Vorschau-Kacheln reichen)
- **Vermieter-Bilanz Block 3 (Vermögensbilanz) — KOMPLETT RAUS** (in Excel)
- **Risiko-Übersicht / Risiko-Sensitivität (Block 4+5) — bleibt RAUS** (in Excel)
- **Empfehlungs-Banner-Kommentar unter Big Picture — RAUS**
- **PV/Batterie/Solarthermie-Konfiguration** (Excel-Edition als Mehrwert)
- **§7b AfA / Mietspiegel-Klassen / KfW-Kombi** (Excel)

---

## 17 — Prompt für die Claude-Code-Sitzung

```
Bitte implementiere Block C2 v2.1 der Web-Implementation „Der Entscheider".
Spec: docs/C2_BlockSpec_v2.1.md (vollständig lesen).

Memory-Files (verbindlich, im Repo unter memory/):
- memory/project_designsystem.md — PFLICHT, insbesondere §2 Schwellwert-
  Pastell-Logik (statt Min-Max), §7 Container-Mitte und Sondersituations-
  CTA-Format
- memory/project_hybrid_risiko_modellierung.md — 11 Sensibilisierungs-Punkte
- memory/project_excel_patch_v2_1.md — Excel-Folgeaufgaben (Vermögensbilanz
  wandert in Excel, Mieter-Nebenkosten-Methodik, Big-Picture-Achsen-Tab)

Auslöser: Daniels zweite Browser-Schleife am 04.05.2026. Strukturelle
Konsolidierung — drei zentrale Web-Aussagen-Bündel statt fünf Panels.
Acht strukturelle Änderungen — siehe Spec §0.

WICHTIG vorab:
- TCO-Methodik UNVERÄNDERT aus v1.1 (alle Verifikations-Werte ± 2 % treffen)
- IIFE in rechner.html UNVERÄNDERT (window.HE + he:state-changed)
- Berechnungs-Funktionen aus engine.js NUR ERWEITERN, nicht umschreiben
- Pellets-Filter wie v2.0 (konditional ausgeblendet)

Ergebnis dieser Sitzung:

1. rechner.html — Wizard auf 4 Schritte, ~22 Felder erweitern (Spec §3):
   - NEU Wizard Schritt 1: eigene Wohnungsgröße (optional bei Vermietung)
   - NEU Wizard Schritt 2: Markt-Hint inline am Energiepreis-Feld
   - NEU Wizard Schritt 3: 4 Bruttoinvestitions-Felder (Hybrid/WP/FW/Pellets)

2. rechner.html — Ergebnis-Seite umbauen (Spec §4):
   - Panel 2 + 3 ENTFERNEN
   - Erweiterter Modus + Profi-Pills ENTFERNEN
   - Vorgeschmack-Aufklapper ENTFERNEN
   - Vermögensbilanz Block 3 ENTFERNEN
   - Empfehlungs-Banner-Kommentar unter Big Picture ENTFERNEN
   - Was-wäre-wenn auf 3 Spalten umstellen (A | B | C neu)
   - Lese-Hilfe-Box prominent unter Wirtschaftlichkeits-Tabelle (nicht klappbar)
   - Format-Fixes: Container-Mitte, Listen-Padding, WEG-Hinweise unten
     Rand schließen, Sondersituations-CTA Format

3. js/engine.js — additive Erweiterungen:
   - bewerteZelle umstellen auf Schwellwert-Logik (Memory §2 exakt)
   - berechneMieterNebenkostenEffekt(option, input, params) NEU
   - berechneZukunftsszenarioAussagen(state, params) NEU (5 Aussagen)
   - berechneBigPictureAchsen ANPASSEN: Wirtschaftlichkeit TCO-basiert,
     Risiko-Schutz statt Risiko-invers (Skala umkehren, sodass hoch = gut)
   - applyInvestitionsOverride(option, neuerWert) NEU
   - Verifikations-Werte aus v1.1 §3.7 müssen weiterhin ± 2 % treffen

4. js/ergebnis.js — additive Erweiterungen:
   - renderTooltipProZelle (NEU, dynamisch je Pastell-Klassifikation)
   - renderLeseHilfeBox (NEU, prominent unter Tabelle)
   - renderInlineEditorInvestition (NEU, klickbare Zelle → Eingabe)
   - renderZukunftsszenarioFeld (NEU, 5 Aussagen Vorher/Nachher)
   - renderBigPictureAchsTooltip (NEU, Hover pro Achs-Beschriftung)
   - renderMieterNebenkostenZeile (NEU, in Vermieter-Block 2)
   - Entfernen: renderPanel2, renderPanel3, renderProfiPills,
     renderVorgeschmackAufklapper, renderVermoegensbilanz (Block 3),
     renderEmpfehlungsBannerKommentar
   - Format-Fixes in CSS: Container-Mitte, Sondersituations-CTA Kontextblau

5. CSS in rechner.html:
   - Pastell-Klassen aus Memory §2 (#d4ead4 / #f5e8c4 / #f4c8c8 / #cce0e8 /
     #ededed mit opacity 0.6)
   - Container-Mitte: max-width + margin: 0 auto für alle Sektionen
   - Sondersituations-CTA: Kontextblau-Hintergrund, mittig, Signal-Grün-
     Button

Akzeptanz-Kriterien siehe Spec §2 (alle 32 Punkte). Insbesondere:
- Schwellwert-Pastell trifft (WP TCO Barwert wird gelb statt rot)
- Mieter-Nebenkosten-Effekt-Zeile berechnet sich korrekt (Tooltip mit Quellen)
- Investitionskosten-Inline-Editor funktional, Live-Update Tabelle + Big Picture
- Zukunftsszenario-Feld zeigt 5 Aussagen dynamisch
- Big-Picture-Achsen: Wirtschaftlichkeit TCO-basiert (WP nicht mehr 43, sondern
  je nach TCO-Verhältnis), Risiko-Schutz mit umgekehrter Skala
- Hover-Tooltip pro Achs-Beschriftung
- Sondersituations-CTA: Kontextblau, mittig, Signal-Grün-Button
- DevTools-Audit: kein Dunkel-auf-dunkel, alle Container mittig
- Verifikations-Werte aus v1.1 §3.7 weiter ± 2 %

Bitte zuerst Plan vorlegen (Regel 7 der CLAUDE.md), warten auf OK,
dann umsetzen. Verifikations-Stop nach Schritt 3 (engine.js):
TCO-Werte für alle 5 Optionen melden, dann erst weiter.

Erwartete UX-Schliff-Schleifen: 2–3. Aufwand: 5–7 h.
```

---

## 18 — Erwarteter Ablauf

1. Daniel öffnet Claude Code, kopiert Prompt aus §17
2. Claude Code legt Plan vor (Vier-Augen-Prinzip mit Cowork-Claude)
3. Nach OK: Implementation in 5 Schritten:
   - Wizard-Erweiterung (rechner.html)
   - engine.js-Erweiterungen + Verifikations-Stop
   - ergebnis.js-Erweiterungen + Entfernungen
   - CSS-Anpassungen
   - Browser-Test mit DevTools-Audit
4. UX-Schliff-Schleifen 1–3
5. Commit + Push, Live-Check
6. Tagesabschluss

**Geschätzter Aufwand:** 5–7 h.

---

## 19 — Versions-History

| Version | Datum | Änderung |
|---|---|---|
| v1.0 | 03.05.2026 | Initial |
| v1.1 | 03.05.2026 (Spätnachmittag) | TCO-Methodik VDI 2067 Annuität, §3.8 Sonderumlage |
| v2.0 | 04.05.2026 | Konzeptionelle Neuausrichtung |
| v2.1 | 05.05.2026 | **Webansicht-Konsolidierung nach zweiter Browser-Schleife.** Panels 2+3 raus, Erweiterter Modus raus, Vorgeschmack-Aufklapper raus, Vermögensbilanz Block 3 raus. Pastell-Bewertung Schwellwert-basiert (statt Min-Max). Investitionskosten anpassbar (Wizard + Inline-Tabelle). Eigene Wohnungsgröße + Mieter-Nebenkosten-Effekt dynamisch. Was-wäre-wenn Drei-Spalten-Layout mit Zukunftsszenario-Feld neu. Big-Picture-Achsen korrigiert (Wirtschaftlichkeit TCO-basiert, „Risiko-Schutz" statt invers, Tooltip pro Achse). Markt-Hint im Wizard. Format-Bugs gefixt (WEG-Hinweise unten, Linkslastigkeit, Sondersituations-CTA Kontextblau + mittig + Signal-Grün-Button). Geschäftsmodell vereinfacht: 49 € jährlich. |

---

**Spec-Ende.** Repo-Snapshot. Original im OneDrive `00_Projektsteuerung/260505_C2_BlockSpec_v2.1.md`.
