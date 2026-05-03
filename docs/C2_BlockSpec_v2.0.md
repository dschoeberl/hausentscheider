# Block C2 — Spec v2.0: Konzeptionelle Neuausrichtung der Ergebnis-Seite

**Stand:** 4. Mai 2026 (v2.0 — folgt auf v1.1 nach zwei Feedback-Schleifen mit Daniel am 03.05.2026 abend)

**Datengrundlage:**
- Excel `Der_Entscheider_Testsystem_v2.0_neutral.xlsx` (Single Source of Truth, Tab `Rechenlogik` als TCO-Methodik, Tab `Dashboard` als Wirtschaftlichkeits-Vergleich)
- `daten/parameter.json` + `daten/preishistorie.json` (Datenbrücke, produktiv)
- v1.1 Spec für Berechnungs-Logik (§3.1–§3.7 unverändert übernommen, hier nur Verweis)

**Architektur:** Modell Z, IIFE in `rechner.html` + Module-Bridge zu `js/engine.js` und `js/ergebnis.js` (aus v1.1 unverändert), neuer Render-Layer für Dashboard-Tab, Big Picture, Sensibilisierungs-Block, Vorgeschmack-Aufklapper

**Ziel:** Konzeptionelle Neuausrichtung — Web liefert klares „Gefühl" mit Pastell-Bewertung und antizipativem Kontext, statt Excel-Tiefe zu duplizieren. Excel-Edition wird durch 4 Referenzbild-Kacheln visuell begehrlich. Big Picture wird zum didaktischen Highlight mit Eco-2050-Bezug.

**Verbindliche Memory-Verweise:**
- `memory/project_designsystem.md` — Farb-Hintergrund-Matrix, Pastell-Bewertung, Smart-Icon, Tooltip-Pattern. **„Dunkel-auf-dunkel" ist No-Go**.
- `memory/project_hybrid_risiko_modellierung.md` — 11 Sensibilisierungs-Punkte plus Investitionsplan-Belege

---

## 0 — Was sich gegenüber v1.1 ändert (Überblick)

v1.1 hatte das Skelett technisch sauber implementiert (TCO Annuität, alle Werte ± 2 % zur Excel, Vermieter-Bilanz + WEG-Hinweise konditional, Risiko-Banner, drei Schieberegler). v2.0 macht aus diesem technisch sauberen Stand eine **didaktisch durchdachte, redaktionell klare** Web-Plattform.

**Sieben strukturelle Verschiebungen:**

1. **Wirtschaftlichkeits-Panel = Excel-Dashboard-Tab als Vergleichs-Tabelle** (statt 3 Headline-Pillen). Kompakte Tabelle mit Pastell-Bewertung pro Zelle (Grün/Gelb/Rot).

2. **Zeitraum-Schieberegler nach oben** als zentrale Eingabe (statt unten als Was-wäre-wenn-Hebel). Fließend, nicht 5-Jahres-Raster.

3. **TCO-Detail-Charts wandern in den Vorgeschmack-Aufklapper** (statt großem Profi-Modus mit aufklappbaren Detail-Tabellen). Cashflow-Kurve, TCO-Komponenten-Säulen, Vermögensbilanz-Detail werden zum „Auszug aus der Excel-Edition".

4. **Big Picture mit 6 Achsen als Highlight** (statt Stub). Pro Heizoption eine Farbfläche, dynamisch auf Schieberegler reagierend. Mit Eco-2050-Bezug. Wird gleichzeitig Referenzbild auf der Startseite rechts neben „Zum Entscheider".

5. **Sensibilisierungs-Block fossile Energie** als neue Standard-Komponente unter Wirtschaftlichkeit (statt Risiko-Übersicht/Sensitivität, die in die Excel verschoben werden). 11 Punkte in Kontextblau mit Smart-Icon.

6. **Wizard erweitert** auf 4 Schritte mit ~19 Eingaben (statt 9 Pflichtfelder + PV-Toggle). PV raus, dafür Energiepreis-Eingabe + aktuelle Jahreskosten + Sanierungs-Daten + Erhaltungsrücklage rein.

7. **Excel-Edition als 4 Referenzbild-Kacheln + Tarif-Vergleich** (statt nur Verkaufs-Sektion). Kacheln zeigen visuell, was die Excel kann. Tarif-Vergleich Web kostenlos / Excel-Edition 49 € / jährliches Update 19 €.

**Plus zwei UX-Hygiene-Punkte:**

- Wegweiser horizontales Scroll-Regal (statt 4-Spalten-Grid)
- Sondersituations-CTA einmal am Ende, generisch (statt zweimal — bei WEG-Hinweise oben + am Ende)

**Was unverändert aus v1.1 bleibt:**
- Berechnungs-Logik in `js/engine.js` (TCO Annuität, VDI 2067, alle Verifikations-Werte)
- IIFE-Architektur in `rechner.html` mit `window.HE` + `he:state-changed`
- Vermieter-Bilanz Block 1–3 (qualitative Vorteile, Cashflow, Vermögensbilanz)
- WEG-Hinweise (3 Stub-Inhalte)
- Risiko-Banner pro empfohlener Option (kontextsensitiv)
- 4 Profi-Hebel im Vorgeschmack-Aufklapper (3 Hebel, da „Eigener Energiepreis" jetzt im Wizard)

---

## 0.5 — Steigerungs-Heuristik (übernommen aus v1.1, geschärft)

Web (Gefühl) → Excel (Tiefe) → Beratung (Begleitung). v2.0 setzt diese Heuristik konsequenter um:

- **Web** zeigt Dashboard-Tab + Big Picture + Sensibilisierungs-Block + Vorgeschmack-Aufklapper. Klar, visuell, antizipativ.
- **Excel-Edition** zeigt volle Jahrestabellen, Sensitivitäten, Komponenten-Detail, Tab Risiken, Tab CO₂-Aufteilung, Tab Sanierungspfad — sichtbar gemacht durch 4 Referenzbild-Kacheln.
- **Beratung** für individuelle WEG-Versammlungs-Vorbereitung, Sondersituationen, Steuerberater-Brücke.

**Antizipation als USP (neu in v2.0 explizit verankert):**

Hausentscheider unterscheidet sich von Status-quo-Rechnern (Heizungsbauer, Versorger, Stadtwerke) durch Antizipation. Der Web-Sensibilisierungs-Block macht zukünftige Entwicklungen explizit — CO₂-Preis-Pfade, geopolitische Risiken, Klima-Realität, Generationen-Verantwortung. Das ist nicht Werbung, sondern fachlicher Anspruch.

---

## 1 — Konzeptioneller Rahmen — was C2 v2.0 fachlich leistet

Nach v2.0 hat der Nutzer:

1. **Eine substantielle Eingabe-Maske** (4 Schritte, ~19 Felder), die das Gefühl vermittelt: hier wird ganzheitlich gerechnet
2. **Eine kompakte Ergebnis-Antwort** als Headline plus Risiko-Banner pro empfohlener Option
3. **Eine Vergleichs-Tabelle** im Wirtschaftlichkeits-Panel, die alle 5 Optionen mit Pastell-Bewertung gegenüberstellt
4. **Eine Vermieter-Sicht** mit qualitativen Vorteilen, Cashflow, Vermögensbilanz (konditional bei Vermietung)
5. **WEG-Hinweise** mit Beschluss/Mehrheit/Frist (konditional bei MFH+WEG)
6. **Eine Sensibilisierungs-Erweiterung** mit 11 Punkten zu fossilen Risiken (sichtbar bei jeder Empfehlung)
7. **Drei interaktive Schieberegler** (Energiepreise + Förderung — nicht mehr Zeitraum, der ist oben)
8. **Ein Big-Picture-Netzdiagramm** mit 6 Achsen, das die ganze Berechnung visuell integriert
9. **Einen Vorgeschmack-Aufklapper** mit TCO-Detail-Charts und Vermögensbilanz-Tabelle
10. **Eine Excel-Edition-Brücke** mit 4 visuellen Referenzbild-Kacheln und Tarif-Vergleich
11. **Einen Wegweiser** mit BAFA / KfW / Solarrechner / Verbraucherzentrale
12. **Einen Sondersituations-CTA** am Ende, generisch und einbeziehend

**Was C2 v2.0 explizit nicht leistet:**
- Risiko-Übersicht-Tabelle (Block 4) — in Excel
- Risiko-Sensitivität-Tabelle (Block 5) — in Excel
- IRR-Detail (statisch + dynamisch) — in Excel
- Volle Cashflow-Jahrestabellen — in Excel
- Detail-Komponenten-Aufschlüsselung pro Jahr — in Excel
- PV-Verstärker / Batterie / Solarthermie-Konfiguration — in Excel
- WEG-Beschluss-Vorlage mit Mehrheits-Lookup nach Maßnahmen-Art — in Beratung
- §7b Sonder-AfA Detail-Berechnung — in Excel + Steuerberater
- Mietspiegel-Klassen-Sprung-Lookup — in Excel

---

## 2 — Scope + Akzeptanz-Kriterien

**Im Scope von v2.0:**

- Wizard-Restrukturierung (4 Schritte, ~19 Felder, PV raus, Sanierungs-Daten + Energiepreise rein)
- Zeitraum-Schieberegler oben statt unten
- Wirtschaftlichkeits-Panel als Excel-Dashboard-Tab-Tabelle mit Pastell-Bewertung
- Risiko-Übersicht / Risiko-Sensitivität raus aus Web
- Sensibilisierungs-Block fossile Energie (11 Punkte) als neue Standard-Komponente
- Big Picture mit 6 Achsen und Eco-2050-Bezug
- Vorgeschmack-Aufklapper mit TCO-Charts + Vermögensbilanz-Detail
- Excel-Edition-Sektion mit 4 Referenzbild-Kacheln + Tarif-Vergleich
- Wegweiser horizontales Scroll-Regal
- Sondersituations-CTA am Ende, generisch
- Smart-Icon (Glühbirne mit Strahlen-Aura) als Marken-Komponente
- Designsystem-Konformität: keine „Dunkel-auf-dunkel"-Stellen, Pastell-Bewertung in allen Tabellen, einheitliche Tooltip-Pattern für Abkürzungen
- Glossar `daten/glossar.json` für Tooltip-Inhalte (zentral, aus Excel-Tab `Begriffe`)

**Akzeptanz-Kriterien (am Ende der Sitzung erfüllt):**

1. **Wizard-Schritt 1 (Gebäude, 4 Felder):** PLZ/Ort, EFH/MFH, Wohneinheiten (bei MFH), Eigentümer-Typ (bei MFH)
2. **Wizard-Schritt 2 (Heizung & Verbrauch, 7 Felder):** Aktuelle Heizung, Baujahr Heizung, Wohnfläche, Heizlast (mit Smart-Default + ⓘ), Jahresverbrauch, Aktuelle Jahreskosten aus Abrechnung, Aktueller Energiepreis (ct/kWh, energieträger-spezifisch)
3. **Wizard-Schritt 3 (Sanierung & Erhaltung, 6 Felder):** Sanierungsstand (ohne Jahreszahlen), Letzte Sanierung (Jahr, optional), Sanierungshorizont (5/10/15/20 J), Reparatur-Pauschale/Jahr, Jährliche Sanierungs-Investition, Erhaltungsrücklage pro WE pro Monat (Live-Umrechnung auf €/m²/a)
4. **Wizard-Schritt 4 (Kontext, 2 Felder):** Nutzungsart, Persona-Picker
5. **PV-Toggle ist nicht im Wizard.** Stattdessen Hinweis-Box auf der Ergebnis-Seite: „PV / Batteriespeicher / Solarthermie als Verstärker → siehe Excel-Edition"
6. **Zeitraum-Schieberegler** sitzt oben unter dem Mini-Cockpit, fließend (1–30 Jahre, Default 25, Sprünge 1)
7. **Wirtschaftlichkeits-Panel** rendert die Excel-Dashboard-Tabelle (Spalten: Gas/Hybrid/WP/FW/Pellets, Zeilen-Gruppen wie in Excel-Tab `Dashboard`):
   - Investitions-Block (Brutto / Förderung / Netto / Sonderumlage)
   - Jahreskosten-Block (Energie+Wartung+CO₂ / CO₂-Kosten / CO₂-Emissionen)
   - Wirtschaftlichkeit-Block (Gesamt-Annuität / TCO Barwert / TCO Statisch)
   - Belastung-Block (€/m²/Monat / Amortisation vs. Gas)
   - Plausibilität (Pellets-Spalte ausgegraut bei `pelletsPlausibel = false`)
8. **Pastell-Bewertung pro Zelle** in der Wirtschaftlichkeits-Tabelle (Grün/Gelb/Rot) — Algorithmus: Min-Max-Skalierung über alle 5 Optionen einer Kennzahl, Top-1+2 = grün, Bottom-1+2 = rot, Mitte = gelb
9. **Erläuterungs-Box rechts oben** an der Wirtschaftlichkeits-Tabelle (klappbar, Smart-Icon-Trigger), mit Lese-Hilfe und Plausibilitäts-Aussage zur Erhaltungsrücklage
10. **Risiko-Banner** pro empfohlener Option rendert in **Kontextblau (nicht Signal-Gelb)** mit Smart-Icon (Glühbirne mit Strahlen-Aura)
11. **Sensibilisierungs-Block fossile Energie** wird unter Wirtschaftlichkeits-Panel sichtbar, in Kontextblau, mit den 11 Punkten aus Memory `project_hybrid_risiko_modellierung.md`
12. **Vermieter-Bilanz Block 1–3** bleibt unverändert (qualitative Vorteile, Cashflow gemittelt, Vermögensbilanz kumuliert) — mit **Pastell-Bewertung pro Zelle** in den Cashflow- und Vermögensbilanz-Tabellen
13. **Vermieter-Bilanz Block 4 (Risiko-Übersicht) und Block 5 (Risiko-Sensitivität)** sind aus dem Web entfernt, nur in Excel
14. **WEG-Hinweise** (3 Stub-Inhalte) bleiben mit `<details open>`, **ohne** doppelten Beratungs-CTA (der wandert ans Ende)
15. **Big Picture Netzdiagramm** mit 6 Achsen, eine Farbfläche pro Heizoption, dynamisch auf Schieberegler reagierend. Achsen: Wirtschaftlichkeit / Nachhaltigkeit / Resilienz / Erweiterbarkeit / Zukunftsfähigkeit / Risiko (invers). Methodik-Tooltip pro Achse.
16. **Vorgeschmack-Aufklapper** vor Excel-Edition-Sektion: kompakter Block mit Titel „Auszug aus der Excel-Edition: TCO 25 J im Detail". Enthält die TCO-Komponenten-Säulen-Grafik aus v1.1 + Vermögensbilanz-Detail-Tabelle. Klappbar.
17. **Excel-Edition-Sektion** mit 4 Referenzbild-Kacheln (TCO-Detail / Cashflow-25-J-Tabelle / Sanierungspfad / Sensitivitäts-Analyse) und 3-Spalten-Tarif-Vergleich (Web kostenlos / Excel 49 € einmalig / jährliches Update 19 €)
18. **Wegweiser** als horizontales Scroll-Regal (mindestens 5 Karten: BAFA / KfW / Solarrechner Thüringen / Verbraucherzentrale / SWE)
19. **Sondersituations-CTA** am Ende, generisch formuliert
20. **Ein Button** „Meine Analyse senden" (mailto mit vorausgefülltem Subject und Body aus State). „Link teilen"-Button ist NICHT auf der Seite.
21. **Smart-Icon** (Glühbirne mit Strahlen-Aura, Filament als Hausdach) als SVG-Komponente, verwendet bei Risiko-Banner-Titel, Sensibilisierungs-Block-Titel, Methodik-Tooltip-Triggern wo Antizipations-Inhalt
22. **Designsystem-Konformität:** alle Schrift-auf-Hintergrund-Kombinationen erfüllen Memory `project_designsystem.md` §1. Insbesondere: keine dunkle Schrift auf petrol-dunkel-Hintergrund, kein weiß-auf-weiß. Audit beim Browser-Test mit Devtools.
23. **Tooltip-Pattern für Abkürzungen** einheitlich aus `daten/glossar.json` (zentral, aus Excel-Tab `Begriffe`)
24. **Erhaltungsrücklage-Plausibilität:** wenn User-Eingabe pro Monat × 12 / Wohnfläche < 13 €/m²/a → Hinweis-Box „GdW-Richtwert 13–17 €/m²/a, deine Rücklage liegt darunter"
25. **Energiepreis-Vergleich:** wenn User-Eingabe Energiepreis von Markt-Schnitt um >10 % abweicht → Hinweis im Wizard „dein Vertrag liegt X% über/unter Markt-Schnitt"
26. **Persona-Picker** wirkt auf Empfehlungs-Berechnung wie in v1.1, mit angepassten Score-Texten passend zu neuem Dashboard
27. **Mobile (< 768 px):** Wirtschaftlichkeits-Tabelle wird als Karten-Stack gerendert (eine Karte pro Heizoption), Big Picture rendert mit 80 % Container-Breite, Wegweiser-Scroll-Regal funktioniert mit Touch
28. **Verifikations-Werte aus v1.1 §3.7** treffen weiterhin ± 2 % (TCO-Methodik unverändert, nur UI ändert sich)
29. **Re-Render-Performance:** Schieberegler-Move löst Re-Render in < 100 ms aus (wie v1.1)
30. **Excel-Edition-Hinweis-Texte:** in jedem Methodik-Tooltip Closer-Satz „Tiefer rechnen? → Excel-Edition" (analog v1.1)

---

## 3 — Wizard (4 Schritte, ~19 Eingaben)

**Schritt 1 — Dein Gebäude (4 Felder):**

| # | Feld | Typ | Defined-Name | Default |
|---|---|---|---|---|
| 1 | PLZ/Ort | Text + Suggestion | `PLZ`, `Ort` | leer |
| 2 | Gebäudetyp | Toggle EFH/MFH | `Gebaeudetyp` | „MFH" |
| 3 | Wohneinheiten (nur bei MFH) | Numerik 2–100 | `Wohneinheiten` | 14 |
| 4 | Eigentümer-Typ (nur bei MFH) | Dropdown: Einzelvermieter / WEG / Selbstnutzer | `EigentuemerTyp` | „WEG" |

**Schritt 2 — Heizung & Verbrauch (7 Felder):**

| # | Feld | Typ | Defined-Name | Default |
|---|---|---|---|---|
| 5 | Aktuelle Heizung | Dropdown 6 Optionen | `HeizungAktuell` | „Gas-Brennwert" |
| 6 | Baujahr Heizung | Year Input | `BaujahrHeizung` | 1998 |
| 7 | Wohnfläche | Slider 50–3000 m² | `Wohnflaeche` | 908 (MFH) / 140 (EFH) |
| 8 | Heizlast | Slider 5–500 kW + ⓘ-Tooltip | `HeizlastKW` | Wohnfläche × Sanierungsfaktor |
| 9 | Jahresverbrauch | Slider 5.000–500.000 kWh | `VerbrauchIst` | 95.000 (MFH) / 18.000 (EFH) |
| 10 | Aktuelle Jahreskosten aus Abrechnung | €-Eingabe | `JahreskostenIst` | leer |
| 11 | Aktueller Energiepreis | ct/kWh-Eingabe (energieträger-spezifisch) | `EigenerPreisAktuell` | Markt-Schnitt aus `preishistorie.json` |

**Plausibilitäts-Hinweis Schritt 2 (live):**
- Wenn `Verbrauch × Energiepreis ≠ Jahreskosten ± 5%` → Hinweis: „Plausibilitätscheck: deine Abrechnung passt nicht zu den Werten — bitte prüfe."
- Wenn `EigenerPreisAktuell` von Markt-Schnitt um > 10 % abweicht → Hinweis: „dein Vertrag liegt X% über/unter Markt-Schnitt"

**Schritt 3 — Sanierung & Erhaltung (6 Felder):**

| # | Feld | Typ | Defined-Name | Default |
|---|---|---|---|---|
| 12 | Sanierungsstand | Toggle „unsaniert / teilweise saniert / saniert" + ⓘ-Erläuterung | `Sanierungsstand` | „teilsaniert" |
| 13 | Letzte Sanierung (Jahr, optional) | Year Input | `LetzteSanierung` | leer |
| 14 | Geplanter Sanierungshorizont | Toggle 5/10/15/20 Jahre | `SanierungsHorizont` | 10 |
| 15 | Erwartete Reparatur-Pauschale pro Jahr | €-Slider | `JaehrlReparaturen` | 8.000 (MFH) / 1.500 (EFH) |
| 16 | Jährliche Sanierungs-Investition | €-Slider + ⓘ-Tooltip | `JaehrlSanierungsInvest` | 0 |
| 17 | Erhaltungsrücklage pro WE pro Monat | €-Eingabe + Live-Umrechnung auf €/m²/a | `RuecklageProWEMonat` | 0 |

**Plausibilitäts-Hinweis Schritt 3 (live):**
- Live-Umrechnung Erhaltungsrücklage: User trägt €/WE/Monat ein → UI zeigt „= X €/m²/a (GdW-Richtwert 13–17 €/m²/a)"
- Wenn umgerechneter Wert < 13 €/m²/a → Hinweis: „deine Rücklage liegt unter dem GdW-Richtwert für Bestandsgebäude"

**Schritt 4 — Kontext (2 Felder):**

| # | Feld | Typ | Defined-Name | Default |
|---|---|---|---|---|
| 18 | Nutzungsart | Dropdown 3 Optionen | `Nutzungsart` | „Mischnutzung" (bei MFH) / „Selbstnutzung" (bei EFH) |
| 19 | Persona | 3 Buttons mit Beschriftung + Untertext | `Persona` | „Optimierer" |

**Konditionale Verzweigungen im Wizard (live, beim Eingeben):**
- PLZ Erfurt-Altstadt → FW-Satzungs-Hinweis (wie v1.1)
- MFH-Auswahl → Wohneinheiten-Feld + Eigentümer-Typ-Feld erscheinen
- EFH-Auswahl → Wohneinheiten + Eigentümer-Typ-Feld bleiben ausgeblendet
- Sanierungsstand → Heizlast-Smart-Default neu berechnen
- Verbrauch + Wohnfläche + Sanierungsstand → Plausibilitätscheck

**Sanierungsstand-Erläuterung (ⓘ-Tooltip):**
> **Wann gilt mein Gebäude als saniert?**
>
> - **Saniert:** Dämmung + Fenster + ggf. Lüftung modernisiert, Effizienzklasse C oder besser
> - **Teilweise saniert:** mindestens eine wesentliche Maßnahme (Dämmung ODER Fenster) erfolgt
> - **Unsaniert:** Bestand wie ursprünglich gebaut, keine wesentliche Modernisierung

(Keine Jahreszahlen mehr — Daniel-Befund 03.05.2026: Jahreszahlen irritieren.)

---

## 4 — Ergebnis-Seite Reihenfolge (v2.0)

```
┌──────────────────────────────────────────────────────────────┐
│  1. Annahmen-Transparenz-Box (klappbar, aus C1)             │
├──────────────────────────────────────────────────────────────┤
│  2. Headline-Antwort (algorithmisch)                        │
├──────────────────────────────────────────────────────────────┤
│  3. Risiko-Banner (Kontextblau, Smart-Icon)                 │
├──────────────────────────────────────────────────────────────┤
│  4. Persona-Toggle  +  Mini-Cockpit                         │
├──────────────────────────────────────────────────────────────┤
│  5. ZEITRAUM-SCHIEBEREGLER (oben, fließend 1–30 J)          │
├──────────────────────────────────────────────────────────────┤
│  6. PANEL 1 — WIRTSCHAFTLICHKEIT (Dashboard-Tabelle)        │
│     mit Pastell-Bewertung + Erläuterungs-Box                │
├──────────────────────────────────────────────────────────────┤
│  7. SENSIBILISIERUNGS-BLOCK fossile Energie (11 Punkte)     │
│     in Kontextblau mit Smart-Icon                           │
├──────────────────────────────────────────────────────────────┤
│  8. SICHT FÜR EIGENTÜMER MIT VERMIETUNG (konditional)       │
│     - Block 1: Qualitative Vorteile                         │
│     - Block 2: Jahres-Cashflow (Pastell-Tabelle)            │
│     - Block 3: Vermögensbilanz (Pastell-Tabelle)            │
├──────────────────────────────────────────────────────────────┤
│  9. WEG-HINWEISE (konditional bei MFH+WEG, open)            │
├──────────────────────────────────────────────────────────────┤
│  10. PANEL 2 — ENTSCHEIDUNGS-RADAR  → C3-Stub               │
│  11. PANEL 3 — ZUKUNFTSFÄHIGKEIT FRI → C4-Stub              │
├──────────────────────────────────────────────────────────────┤
│  12. WAS-WÄRE-WENN — Schieberegler                          │
│      Energiepreise + Förderung (KEIN Zeitraum mehr)         │
├──────────────────────────────────────────────────────────────┤
│  ╔══════════════════════════════════════════════════════╗   │
│  ║  13. BIG PICTURE — NETZDIAGRAMM (6 Achsen)          ║   │
│  ║  Highlight, mit Eco-2050-Bezug                       ║   │
│  ╚══════════════════════════════════════════════════════╝   │
├──────────────────────────────────────────────────────────────┤
│  14. VORGESCHMACK-AUFKLAPPER                                │
│      „Auszug aus der Excel-Edition: TCO 25 J im Detail"    │
│      Klappbar — Cashflow-Kurve, TCO-Komponenten-Säulen     │
├──────────────────────────────────────────────────────────────┤
│  15. EXCEL-EDITION                                          │
│      4 Referenzbild-Kacheln + 3-Spalten-Tarif-Vergleich    │
├──────────────────────────────────────────────────────────────┤
│  16. WEGWEISER (horizontales Scroll-Regal)                  │
├──────────────────────────────────────────────────────────────┤
│  17. SONDERSITUATIONEN-CTA (am Ende, EINMAL, generisch)     │
│      [Meine Analyse senden]                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 5 — Wirtschaftlichkeits-Panel = Excel-Dashboard-Tab (NEU)

**Quelle:** Excel-Tab `Dashboard`, Sektion „Kernkennzahlen aller fünf Optionen" plus „€/m²/Monat-Vergleich" plus „Plausibilität".

**Struktur als Tabelle (Spalten Heizoptionen, Zeilen Kennzahlen):**

```
                          Gas-BW  Hybrid    WP      FW      Pellets
─────────────────────────────────────────────────────────────────────
INVESTITION
Bruttoinvestition          0 €    73.000  126.000  33.000   63.000
Fördersumme                0 €    21.000   21.000      0    21.000
Netto-Investition          0 €    52.000  105.000  33.000   42.000
Sonderumlage pro Einheit   0 €         0    2.875       0        0

JAHRESKOSTEN HEUTE
Energie + Wartung + CO₂   10.424  9.238    8.766  18.804    9.818
CO₂-Kosten p.a.            1.949    585        0   2.412      229
CO₂-Emissionen p.a.        18,6 t  5,6 t   0,0 t   23,0 t   2,2 t

WIRTSCHAFTLICHKEIT
Gesamt-Annuität           16.138  15.000  16.767  31.118   14.633
TCO Barwert (Zeitraum)   403.447  375.012 419.168 777.949  365.816
TCO Statisch             380.054  388.815 404.411 816.120  377.356

BELASTUNG
€/m²/Monat ★              1,48 €  1,38 €  1,54 €  2,86 €   1,34 €
Amortisation vs. Gas        —     43,8 J  63,3 J   n/a     69,3 J

PLAUSIBILITÄT
Pellets plausibel?        —      —       —       —        nein
                                                          (ausgegraut)
```

**Pastell-Bewertung pro Zelle (siehe Memory `memory/project_designsystem.md` §2):**
- Algorithmus: Min-Max-Skalierung über alle 5 Optionen einer Zeile
- Top-1+2 Werte → Pastell-Grün (Vorteil)
- Bottom-1+2 Werte → Pastell-Rot (teuer/Risiko)
- Mitte → Pastell-Gelb (durchschnittlich)
- Pellets bei `pelletsPlausibel = false` → grau (ausgeschlossen aus Skalierung)
- Bei „— / n/a"-Werten → keine Färbung (transparent)

**Erläuterungs-Box rechts oben (klappbar, ⓘ-Trigger mit Smart-Icon):**

```
ⓘ Lese-Hilfe für die Tabelle

Grün = günstigere Option für diese Kennzahl
Gelb = mittlere Position
Rot = teurere Option

Sortier-Empfehlung: schau auf die €/m²/Monat-Zeile —
das ist die anschauliche Vergleichs-Kennzahl pro 
Quadratmeter Wohnfläche pro Monat.

Pellets ist in deiner Lage nicht plausibel
(Innenstadt + > 30 kW Heizlast).

Plausibilitäts-Hinweis Erhaltungsrücklage:
Deine Rücklage X €/m²/a liegt {unter / im / über} GdW-
Richtwert 13–17 €/m²/a. Bei {Sanierungshorizont}-Jahres-
Plan reicht das {nicht / knapp / gut}.
```

(Plausibilitäts-Hinweis dynamisch aus User-State.)

**Render-Funktion in `js/ergebnis.js`:**

```javascript
function renderWirtschaftlichkeitsTabelle(state, params) {
  const dashboard = berechneAllDashboardKennzahlen(state, params);
  // Bewerte jede Zeile (Min-Max über 5 Spalten)
  // Render als <table> mit Pastell-Klassen
}

function bewerteZelle(wert, alleWerteZeile, optionPlausibel) {
  // returns: 'pastell-vorteil' | 'pastell-hinweis' | 'pastell-risiko' | 'neutral'
}
```

**Wichtig:** Tabelle ist responsive — auf Mobile (< 768 px) wird sie als Karten-Stack gerendert (eine Karte pro Heizoption mit allen Kennzahlen vertikal).

---

## 6 — Vermieter-Bilanz + WEG-Hinweise (in einfacher Sicht, mit Pastell)

**Vermieter-Bilanz Block 1 (qualitative Vorteile, 9 Punkte):** unverändert aus v1.1.

**Vermieter-Bilanz Block 2 (Jahres-Cashflow gemittelt 25 J):**
- Tabelle wie v1.1
- **NEU:** Pastell-Bewertung pro Zelle (Grün/Gelb/Rot)
- Σ-Zeile in Petrol-Dark-Hintergrund mit weißer Schrift (deutlich abgesetzt)

**Vermieter-Bilanz Block 3 (Vermögensbilanz 25 J kumuliert):**
- Tabelle wie v1.1
- **NEU:** Pastell-Bewertung pro Zelle
- §7b AfA-Hinweis-Box bleibt unverändert
- Σ-Zeile prominent

**Vermieter-Bilanz Block 4 (Risiko-Übersicht):** **RAUS** aus Web. In Excel verschoben.

**Vermieter-Bilanz Block 5 (Risiko-Sensitivität):** **RAUS** aus Web. In Excel.

**WEG-Hinweise (Stub, 3 Inhalte):**
- Inhalt unverändert aus v1.1 (Beschluss / Mehrheit / Frist)
- **NEU:** Beratungs-CTA-Box am Ende der WEG-Hinweise **wird entfernt** — der CTA wandert ans Ende der Seite (Sondersituations-CTA)
- `<details>` mit `open` (siehe v1.1-Bug-Fix)
- Listen-Padding korrigieren (mindestens 1.5 rem padding-left)
- „muss" → „sollte" („was sollte beschlossen werden")

---

## 7 — Sensibilisierungs-Block fossile Energie (NEU)

Standard-Komponente direkt unter dem Wirtschaftlichkeits-Panel. Sichtbar bei jeder Empfehlung, unabhängig von Heizoption.

**Position:** zwischen Wirtschaftlichkeits-Panel (§5) und Vermieter-Bilanz (§6).

**Visuell:**
- Hintergrund: Kontextblau (Pastell-Blau-Petrol)
- Smart-Icon (Glühbirne mit Strahlen-Aura) groß im Titel
- Klare Typografie, leicht lesbar

**Inhalt (11 Punkte aus Memory `memory/project_hybrid_risiko_modellierung.md`, finalisierte Version):**

```
[Smart-Icon] Bedenke bei der Bewertung dieser Zahlen

Die Berechnung basiert auf heutigen Marktpreisen.
Diese Faktoren können die Wirklichkeit über 25 Jahre
verschieben:

1. CO₂-Preis steigt ab 2027 (EU-ETS2) — heute 55 €/t,
   bis 2035 realistisch 130–200 €/t

2. Gas-Subventionen können entfallen — Gaspreis-Bremse,
   reduzierte MwSt., gestreckter CO₂-Preis sind politische
   Entscheidungen

3. Geopolitische Konflikte verursachen Gas-Spikes
   (2022 kurzzeitig 30 ct/kWh; Pipeline-Sabotage,
   Hormuz-Beispiel)

4. Grüngasquote ab 2029 (10 %) macht Gas pro kWh teurer

5. Stranded-Asset-Risiko Gasnetz — kommunale Wärmeplanung
   könnte Gasnetz vor 2040 stilllegen

6. Wasserstoff-Umstellung — bestehende Brenner brauchen
   Anpassung, Umrüst-Kosten 10–15 T€ pro MFH

7. EPBD-Klassen-Anforderungen ab 2028 — schwächste Klassen
   können Marktwert-Abschlag bringen

8. Mietspiegel-Argumentation wird mit Energie-Effizienz-
   Verschlechterung schwieriger

9. Klima-Realität — CO₂-Gehalt der Atmosphäre bei ~422 ppm,
   bereits über planetarer Grenze. 2024 global wärmstes
   Jahr; Europa erhitzt sich am schnellsten

10. Generationen-Verantwortung — Klimaneutralität 2045 als
    Voraussetzung für die nächste Generation. Was 2026
    eingebaut wird, prägt den Klima-Beitrag des Gebäudes
    für 18–25 Jahre

11. Mieter-Vermieter-Aufteilungs-Trend — der Vermieter trägt
    zunehmend Mit-Verantwortung für die Folgekosten seiner
    Heizungs-Wahl. Beschlossen: CO₂-Preis-Aufteilung nach
    BEHG-Stufenmodell seit 2023 (Vermieter-Anteil bis 95 %
    bei schwachen Effizienzklassen). In Diskussion: Gas-
    Netzentgelte-Aufteilung. Trend: weitere Kosten-Komponenten
    (Grüngasquote-Aufschlag) werden ggf. künftig anteilig
    umgelegt.

Diese Faktoren sind bewusst nicht in der Default-Berechnung —
die Excel-Edition modelliert sie als Sensitivitäts-Szenarien
explizit.
```

**Tonalität:** sachlich, ruhig, nicht alarmistisch (siehe Memory `memory/project_designsystem.md` §6).

---

## 8 — Was-wäre-wenn Schieberegler (reduziert auf 2 Blöcke)

Da der Zeitraum-Schieberegler nach oben gewandert ist, bleiben hier nur zwei Blöcke:

**Block A — Energiepreise (3 Slider):**
- Gas-Preis: min/max aus block1.PreisGas, Default = User-Eingabe oder Markt-Schnitt
- FW-Preis: min/max aus block1.PreisFW, Default = User-Eingabe oder Markt-Schnitt
- WP-Strom-Preis: min/max aus block1.PreisWP, Default = User-Eingabe oder Markt-Schnitt

**Block B — Förderung (4 Toggles + Master + 3 Presets):** unverändert aus v1.1

---

## 9 — Big Picture Netzdiagramm (NEU, Highlight)

**Position:** nach Was-wäre-wenn-Schieberegler, vor Vorgeschmack-Aufklapper.

**Visuell:**
- Container mit Petrol-Light-Hintergrund-Akzent (Highlight-Charakter)
- Großes Netzdiagramm (Radar-Chart via Chart.js)
- 6 Achsen, eine Farbfläche pro Heizoption, dynamisch reagierend auf Schieberegler

**Die 6 Achsen (mit Methodik-Tooltip pro Achse, ⓘ-Trigger):**

| Achse | Was sie misst | Methodik-Tooltip |
|---|---|---|
| **Wirtschaftlichkeit** | TCO ganzheitlich, normalisiert über 5 Optionen | „Berücksichtigt Investition, Förderung, Energie, Wartung, CO₂ über deinen Zeitraum." |
| **Nachhaltigkeit** | CO₂-Bilanz pro Jahr, normalisiert | „Niedrige CO₂-Emissionen pro Jahr. Bezug zu planetaren Grenzen — 422 ppm CO₂ in der Atmosphäre, Klimaneutralität 2045." |
| **Resilienz** | Robustheit gegen Marktschocks und Versorgungsstörungen | „Wie unabhängig bist du von Gas-Netz, Strom-Netz, Versorger-Monopol? Beispiel Hormuz-Versorgungssicherheit, Pipeline-Sabotage." |
| **Erweiterbarkeit** | Integrierbarkeit von PV, Batteriespeicher, Solarthermie, Wallbox | „Kannst du dein System schrittweise erweitern? Innovation und Umsetzung." |
| **Zukunftsfähigkeit** | Politische Konformität (EPBD, GMG, kommunale Wärmeplanung) | „Wie gut passt deine Lösung zu kommenden gesetzlichen Anforderungen?" |
| **Risiko** *(invers — niedrig auf Achse = gut)* | Stranded-Asset, Sanierungs-Schuld, regulatorische Sprünge, Kostenexplosion | „Welche spezifischen €-Risiken bist du in den nächsten 25 Jahren ausgesetzt?" |

**Achs-Belegung pro Heizoption (heuristisch — fachliche Diskussion mit Daniel + Becker für v2.1):**

| Option | Wirtsch. | Nachhal. | Resil. | Erweit. | Zukunft. | Risiko |
|---|---|---|---|---|---|---|
| Status quo Gas | mittel | niedrig | niedrig | niedrig | niedrig | hoch |
| Hybrid | mittel-hoch | mittel | mittel | mittel | mittel | mittel-hoch |
| Wärmepumpe | mittel-hoch | hoch | hoch | hoch | hoch | mittel |
| Fernwärme | niedrig-mittel | mittel | niedrig | niedrig | mittel | mittel |
| Pellets | mittel | mittel | mittel | mittel | mittel | mittel |

(Die Werte werden algorithmisch in `engine.js` berechnet.)

**Interaktivität:**
- Schieberegler-Wirkung: Energiepreis-Erhöhung Gas → Wirtschaftlichkeit Gas sinkt, Risiko Gas steigt → Big Picture rendert neu
- Persona-Wirkung: ändert die Achsen-Gewichtung im Empfehlungs-Score (nicht die Achs-Werte selbst)
- Pellets bei `pelletsPlausibel = false` → Pellets-Fläche gestrichelt, ausgegraut

**Bezug zu Daniels Eco-2050-Future-Readiness-Ansatz:**
Methodik-Box unter dem Diagramm:
> Diese 6 Achsen folgen dem Future-Readiness-Ansatz aus dem Eco-2050-Institut — eine ganzheitliche Sicht auf Nachhaltigkeit, Resilienz, Anpassung, Innovation und wirtschaftliche Fairness.

**Wird Referenzbild auf der Startseite:**
Das fertige Big-Picture-SVG wird als statisches Bild rechts neben „Zum Entscheider" auf der Startseite eingebunden.

**Render-Funktion in `js/ergebnis.js`:**

```javascript
function renderBigPicture(state, params) {
  const achsen = berechneBigPictureAchsen(state, params);
  // Chart.js Radar-Chart, 5 Datasets (Heizoptionen), 6 Achsen
}

function berechneBigPictureAchsen(state, params) {
  // returns: {
  //   gas: [wirtsch, nachhal, resil, erweit, zukunft, risiko],
  //   ...
  // }
  // Werte normalisiert auf 0–100
}
```

---

## 10 — Vorgeschmack-Aufklapper (NEU)

**Position:** zwischen Big Picture und Excel-Edition-Sektion.

**Konzept:** Ein einziger aufklappbarer Block, der dem User einen kompakten Vorgeschmack auf die Excel-Tiefe gibt.

**HTML-Struktur:**

```html
<details class="vorgeschmack-aufklapper">
  <summary>
    [Smart-Icon] Auszug aus der Excel-Edition: TCO 25 J im Detail
    <span class="hint">— klicke, um TCO-Komponenten und Cashflow-Kurve zu sehen</span>
  </summary>

  <div class="vorgeschmack-content">
    <!-- TCO-Komponenten-Säulen-Grafik (aus v1.1, Chart.js Bar gestapelt) -->
    <h3>TCO 25 J nach Komponenten</h3>
    <div id="vorgeschmack-tco-komponenten"></div>

    <!-- 25-J-Cashflow-Kurve (aus v1.1, Chart.js Line) -->
    <h3>25-Jahres-Cashflow kumuliert</h3>
    <div id="vorgeschmack-cashflow-kurve"></div>

    <!-- Vermögensbilanz-Detail-Tabelle (5 Optionen × 11 Posten) -->
    <h3>Vermögensbilanz 25 Jahre — alle Posten</h3>
    <div id="vorgeschmack-vermoegensbilanz-tabelle"></div>

    <p class="vorgeschmack-closer">
      Die volle Sensitivitäts-Tiefe und alle Hebel findest du in der
      <a href="#excel-edition">Excel-Edition</a>.
    </p>
  </div>
</details>
```

**Wichtig:** Kein neuer State, keine eigenen Schieberegler. Der Aufklapper rendert mit dem aktuellen State der Wirtschaftlichkeits-Tabelle.

---

## 11 — Excel-Edition-Sektion (NEU)

**Position:** direkt nach Vorgeschmack-Aufklapper, vor Wegweiser.

### 11.1 Einleitungs-Block

```
Du willst noch tiefer rechnen — für Profis und Analysten

Wenn der Web-Rechner zu wenig ist und du selbst rechnen
möchtest, in Ruhe, zu Hause, mit allen Hebeln und Quellen —
hier ist deine Werkzeug-Erweiterung.
```

### 11.2 Vier Referenzbild-Kacheln

Jede Kachel zeigt einen Excel-Tab als Bild plus 1–2 Sätze Beschreibung. Inhalte: TCO Detail / Cashflow 25 J / Sanierungspfad / Sensitivitäts-Analyse.

**Bilder:** statische PNG/SVG-Screenshots aus der Excel, 4 Kacheln. Ablage: `assets/excel-vorschau/{tco|cashflow|sanierung|sensitivitaet}.png`. Erstellung als Folgeaufgabe.

### 11.3 Drei-Spalten-Tarif-Vergleich

```
WEB KOSTENLOS (0 €)  |  EXCEL EDITION (49 € einmalig)  |  JÄHRLICHES UPDATE (19 €/J)
─────────────────────────────────────────────────────────────────────────────────
✓ Dashboard          |  ✓ Alle Web-Inhalte             |  ✓ Aktualisierte Marktpreise
✓ Sensibilisierung   |  ✓ TCO Detail Annuität          |  ✓ Neue Quellen
✓ Big Picture        |  ✓ Volle Cashflow-Tabelle       |  ✓ Methodik-Verfeinerung
✓ Was-wäre-wenn      |  ✓ Sanierungspfad-Tab           |  ✓ Neue Sensitivitäts-Szenarien
                     |  ✓ Sensitivität frei wählbar    |  ✓ E-Mail Direktversand
✗ Volle TCO-Tabellen |  ✓ §7b AfA-Detail
✗ Sensitivität frei  |  ✓ Mietspiegel-Klassen-Lookup
✗ §7b AfA Detail     |  ✓ KfW-Kombi-Modell
✗ Mietspiegel        |  ✓ Tab Risiken
                     |  ✓ Tab CO₂-Aufteilung
                     |  ✓ Tab Fernwärme-Logik
                     |  [Jetzt kaufen]                  |  [Update bestellen]
```

**Wichtig:**
- 3 gleichgroße Spalten
- Web-Spalte zeigt auch ✗ (was Excel mehr kann)
- Layout responsive — auf Mobile vertikal gestapelt
- Tonalität: kein Verkaufs-Stil, sondern Werkzeug-Übersicht

---

## 12 — Wegweiser (Scroll-Regal, NEU)

**Position:** nach Excel-Edition-Sektion, vor Sondersituations-CTA.

**Pattern:** horizontales Scroll-Regal (siehe Memory `memory/project_designsystem.md` §5).

**Initiale Karten (5+):** BAFA / KfW / Solarrechner Thüringen / Verbraucherzentrale / SWE Erfurt.

---

## 13 — Sondersituations-CTA (am Ende, generisch)

**Position:** ganz am Ende der Seite.

**Inhalt:**

```
[Smart-Icon]  Du hast eine Sondersituation?

Vielleicht planst du eine Eigentümerversammlung zur
Heizungs-Modernisierung. Oder du fragst dich, wie deine
WEG die Sonderumlage verteilt nach MEA-Anteilen. Oder du
möchtest dein Sanierungs-Konzept mit Energieberater
abstimmen, bevor du eine Investition tätigst. Oder du
hast eine ganz andere Frage, die der Web-Rechner nicht
beantwortet.

Schreib uns — wir lesen, wir antworten, wir begleiten dich.

dialog@hausentscheider.de

[Meine Analyse senden]

Erste Antwort kostenlos — tiefere Beratung sprechen wir
projektbasiert ab.
```

**Wichtig:**
- Generisch formuliert
- KEIN Beratungs-CTA mehr in den WEG-Hinweisen oben
- KEIN „Link teilen"-Button
- Nur ein Button: „Meine Analyse senden" (mailto mit Subject + State-Body)

---

## 14 — Designsystem-Konformität (verbindlich)

**Vollständig in Memory `memory/project_designsystem.md` dokumentiert.** Drei kritische Punkte:

1. **„Dunkle Schrift auf dunklem Hintergrund" ist No-Go.** Audit beim Browser-Test mit DevTools.
2. **Pastell-Bewertung in allen Vergleichs-Tabellen.** Algorithmus zentral in `engine.js`.
3. **Smart-Icon (Glühbirne mit Strahlen-Aura)** als Marken-Element — bis SVG erstellt: Platzhalter `<icon name="hausentscheider-glühbirne">` oder Unicode-Kombi „💡✦".

---

## 15 — Datei-Struktur nach v2.0

```
hausentscheider/
├── index.html                    (existiert, Big-Picture-Bild als Referenz hinzu — Folgeaufgabe)
├── rechner.html                  (überschrieben — Wizard 4 Schritte, neue Ergebnis-Reihenfolge)
├── objekte/index.html            (existiert, unverändert)
├── preishistorie.html            (existiert, unverändert)
├── js/
│   ├── engine.js                 (erweitert — Dashboard-Tabelle, Big-Picture-Achsen, Pastell-Bewertung)
│   ├── ergebnis.js               (erweitert — neue Render-Funktionen)
│   └── glossar.js                (NEU — Lookup für Tooltip-Inhalte)
├── memory/
│   ├── project_designsystem.md   (NEU — verbindliches Designsystem)
│   └── project_hybrid_risiko_modellierung.md  (NEU — 11 Sensibilisierungs-Punkte)
├── daten/
│   ├── parameter.json            (existiert)
│   ├── preishistorie.json        (existiert)
│   └── glossar.json              (NEU — aus Excel-Tab Begriffe via build_json.py)
├── assets/
│   ├── icons/
│   │   └── hausentscheider-glühbirne.svg   (NEU — Marken-Smart-Icon)
│   └── excel-vorschau/
│       ├── tco-detail.png        (NEU — Excel-Screenshot)
│       ├── cashflow-25j.png      (NEU)
│       ├── sanierungspfad.png    (NEU)
│       └── sensitivitaet.png     (NEU)
├── docs/
│   ├── C1_BlockSpec_v3.md
│   ├── C2_BlockSpec_v1.md        (alt v1)
│   └── C2_BlockSpec_v2.0.md      (NEU — Snapshot dieser Spec)
├── README.md                     (existiert)
└── build_json.py                 (existiert)
```

---

## 16 — Was NICHT in v2.0

- **Risiko-Übersicht / Risiko-Sensitivität als Web-Tabellen** → in Excel verschoben
- **Volle Cashflow-Jahrestabellen** (25 Zeilen × 5 Optionen) → Excel-Inhalt
- **§7b Sonder-AfA Detail-Berechnung** → Excel + Steuerberater
- **Mietspiegel-Klassen-Sprung-Lookup** → Excel-Edition
- **KfW-Kombi-Modell** → Excel-Edition
- **Freie Sensitivitäts-Analyse** → Excel-Edition
- **PV/Batterie/Solarthermie-Konfiguration** → Excel-Edition (Wizard hat KEIN PV-Toggle mehr)
- **IRR-Berechnung statisch + dynamisch** → Excel-Edition
- **Panel 2 Entscheidungs-Radar** → C3
- **Panel 3 Future Readiness Index** → C4 (Bezug auf Eco-2050-Ansatz)
- **WEG-Beschluss-Vorlage mit Mehrheits-Lookup** → Beratung
- **PNG-Download** für Diagramme → C5
- **Profilseiten-Anbindung** → eigener späterer Sync-Block

---

## 17 — Prompt für die Claude-Code-Sitzung

```
Bitte implementiere Block C2 v2.0 der Web-Implementation „Der Entscheider".
Spec: docs/C2_BlockSpec_v2.0.md (vollständig lesen).

Memory-Files (verbindlich):
- memory/project_designsystem.md — Farb-Hintergrund-Matrix, Pastell-
  Bewertung, Smart-Icon, Tooltip-Pattern, Scroll-Regal, Tonalität,
  Format-Hygiene
- memory/project_hybrid_risiko_modellierung.md — 11 Sensibilisierungs-
  Punkte plus Investitionsplan-Belege

Auslöser: Daniel hat nach C2 v1.1-Live-Test eine konzeptionelle
Neuausrichtung gewählt. Sieben strukturelle Verschiebungen — siehe
Spec §0.

Datengrundlage:
- daten/parameter.json (existiert produktiv, wird konsumiert)
- daten/preishistorie.json (existiert produktiv)
- daten/glossar.json (NEU — kann erstmal als JS-Konstante in
  glossar.js angelegt werden, build_json.py-Erweiterung folgt)
- v1.1 Berechnungs-Logik in js/engine.js (TCO Annuität — bleibt
  unverändert, alle Verifikations-Werte ± 2 % treffen)

Ergebnis dieser Sitzung:

1. rechner.html — Wizard restrukturieren auf 4 Schritte, ~19 Felder
   (siehe Spec §3). PV-Toggle raus, Energiepreis + Jahreskosten +
   Sanierungs-Daten + Erhaltungsrücklage rein.

2. rechner.html — Ergebnis-Seite-Reihenfolge nach Spec §4.

3. js/engine.js — erweitert um:
   - berechneAllDashboardKennzahlen(state, params)
   - bewerteZelle(wert, alleWerteZeile, optionPlausibel)
   - berechneBigPictureAchsen(state, params)
   - berechneErhaltungsruecklageStatus(state)

4. js/ergebnis.js — erweitert um:
   - renderWirtschaftlichkeitsTabelle (NEU)
   - renderSensibilisierungsBlock (NEU)
   - renderBigPicture (NEU, Chart.js Radar)
   - renderVorgeschmackAufklapper (NEU)
   - renderExcelEditionSektion (NEU)
   - renderWegweiserScrollRegal (NEU)
   - renderSondersituationsCTA (NEU)
   - renderTooltipFromGlossar (NEU)
   Plus: Vermieter-Bilanz Tabellen Block 2+3 auf Pastell.

5. js/glossar.js — NEU, Lookup-Konstante für Abkürzungen und Begriffe.

6. Verbindliche Memory-Regeln beachten (Pflicht):
   - memory/project_designsystem.md §1 — Farb-Hintergrund-Matrix, KEIN
     Dunkel-auf-dunkel
   - §2 — Pastell-Bewertung in allen Tabellen
   - §3 — Smart-Icon (Platzhalter „💡✦" bis SVG erstellt)
   - §4 — Tooltip-Pattern einheitlich
   - §5 — Scroll-Regal bei > 4 Karten
   - §6 — Tonalität (Du-Form, „sollte" statt „muss")
   - §7 — Listen-Padding ≥ 1.5rem, <details> open bei dynamischen
     Inhalten

Akzeptanz-Kriterien siehe Spec Abschnitt 2 — alle 30 Punkte. Insbesondere:
- Wizard 4 Schritte funktional
- Wirtschaftlichkeits-Tabelle mit Pastell-Bewertung, Mobile als
  Karten-Stack
- Sensibilisierungs-Block mit 11 Punkten in Kontextblau
- Big Picture mit 6 Achsen, dynamisch reagierend
- Vorgeschmack-Aufklapper kompakt
- Excel-Edition mit 4 Kacheln (zunächst Platzhalter) + Tarif-Vergleich
- Wegweiser-Scroll-Regal funktional auf Touch
- Sondersituations-CTA einmal am Ende, generisch
- Designsystem-Konformität (DevTools-Audit, kein Dunkel-auf-dunkel)
- Verifikations-Werte aus v1.1 §3.7 treffen weiterhin ± 2 %

Wichtig:
- TCO-Methodik UNVERÄNDERT (VDI 2067 Annuität aus v1.1)
- IIFE-Architektur in rechner.html UNVERÄNDERT (window.HE +
  he:state-changed)
- Berechnungs-Funktionen aus engine.js UNVERÄNDERT — nur erweitern
- Pellets-Filter: bleibt wie v1.1
- §559 BGB 8 % (gesetzlich)
- Cashflow-Methodik kumulativ + optionsspezifisch

Bitte zuerst Plan vorlegen (Regel 7 der CLAUDE.md), warten auf OK,
dann umsetzen.

Erwartete UX-Schliff-Schleifen: 2–3 Schleifen mit Daniel. Aufwand
6–8 h.
```

---

## 18 — Erwarteter Ablauf der Sitzung

1. Daniel öffnet Claude Code, kopiert den Prompt aus §17.
2. Claude Code legt Plan vor.
3. Daniel prüft Plan im Vier-Augen-Prinzip mit Cowork-Claude.
4. Nach OK: Claude Code setzt um. Erwarteter Umfang: rechner.html ~+500 Zeilen, engine.js ~+200 Zeilen, ergebnis.js ~+400 Zeilen, glossar.js NEU ~150 Zeilen.
5. Daniel testet im Browser via `http://localhost:3000/rechner.html`.
6. UX-Schliff-Schleifen 1–3.
7. Commit + Push durch Daniel.
8. Tagesabschluss.

**Geschätzter Aufwand Daniel:** 6–8 h.

---

## 19 — Versions-History

| Version | Datum | Änderung |
|---|---|---|
| v1.0 | 03.05.2026 | Initial — folgt auf C1 v3. |
| v1.1 | 03.05.2026 (Spätnachmittag) | Patch nach Excel-Lektüre Tab Rechenlogik. §3.1 TCO-Methodik komplett neu auf VDI 2067 Annuität, Reparaturen aus TCO entfernt, CO₂ in TCO ergänzt, §3.8 Sonderumlage + IRR + Modernisierungs-Anteil neu. |
| v2.0 | 04.05.2026 | **Konzeptionelle Neuausrichtung** nach zwei Feedback-Schleifen mit Daniel. Sieben strukturelle Verschiebungen: Wirtschaftlichkeits-Panel = Excel-Dashboard-Tabelle mit Pastell, Zeitraum-Schieberegler oben, TCO-Detail in Vorgeschmack-Aufklapper, Big Picture mit 6 Achsen als Highlight, Sensibilisierungs-Block fossile Energie (11 Punkte), Wizard 4 Schritte ~19 Felder, Excel-Edition mit 4 Referenzbild-Kacheln + Tarif-Vergleich. Plus Wegweiser-Scroll-Regal, Sondersituations-CTA einmal generisch, Smart-Icon Glühbirne als Marken-Element. Verbindliches Designsystem-Memory. Bidirektionale Excel-Optimierung: Excel-Patch v2.1 als parallele Folge-Bauphase. |

---

**Spec-Ende.** Repo-Snapshot. Original im OneDrive `00_Projektsteuerung/260504_C2_BlockSpec_v2.0.md`.
