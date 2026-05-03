---
name: Excel-Patch v2.1 — gebündelte Folgeaufgaben für nächstes Excel-Update
description: Sammlung der Excel-Erweiterungen aus Web-Erkenntnissen 03.-05.05.2026. Mehrere neue Tabs, methodische Erweiterungen, build_json.py-Anpassungen.
type: project
originSessionId: 52097a10-d458-4dd2-bcd6-840318e0388d
---
**Gesammelte Excel-Folgeaufgaben aus den Web-Erkenntnissen 03.-05.05.2026 (C2-Implementation + drei Feedback-Schleifen).** Bidirektionale Optimierung in Aktion: Web schärft Excel, Excel bleibt Single Source of Truth.

Pattern: Diese Aufgaben werden gebündelt beim nächsten regulären Excel-Update (Juni 2026 Preishistorie-Pflege oder dediziertem v2.1-Update) abgearbeitet. Excel-Edition-Käufer bekommen damit ein substantielles Update — das ist Geschäftsmodell-Inhalt für die 49 € jährlich (Stand 05.05.2026, ersetzt früheres 19 €-Update-Modell).

## Neue Tabs in Excel v2.1

### Tab „Risiken" (analog Quellen-Tab)
Sammlung der Risiken pro Heizoption als belegbare Liste mit Quellen.

**Strukturvorschlag pro Eintrag:**
- Risiko-Bezeichnung
- Betroffene Heizoptionen (Gas / Hybrid / WP / FW / Pellets — eine oder mehrere)
- Mechanismus (kurze Erläuterung, woraus das Risiko entsteht)
- Quantifizierung (€/a oder €-Effekt 25 J, falls modellierbar)
- Quelle (Q-Kürzel, Verlinkung)
- Bewertungs-Stufe (gering / mittel / hoch)

**Initiale Einträge** (aus Memory `project_hybrid_risiko_modellierung.md` und Daniels Investitionsplan-Dokument):
- CO₂-Preis-Eskalation EU-ETS2 ab 2027
- Gas-Subventions-Auslauf
- Geopolitische Konflikte / Versorgungs-Spikes
- Grüngasquote-Steigerung GMG
- Stranded-Asset-Risiko Gasnetz
- Wasserstoff-Umstellung (DVGW + Agora-Bezug, 250–400 €/m, 10–15 T€ pro MFH)
- H2-ready-Kessel-Limitierung (nur 20 % H₂)
- LNG-Risiken (Methan-Leckage, Fracking, Versorgungs-Volatilität)
- EPBD-Klassen-Anforderungen 2028
- Mietspiegel-Argumentations-Lücke
- Hybrid-Komplexitäts-Aufschlag (zwei Systeme)
- Strom-Gas-Korrelation (WP-Strom 30–40 % Mittellast aus Gas-Verstromung)
- Klima-Realität 422 ppm CO₂ + Generationen-Verantwortung

### Tab „Kosten-Aufteilung Vermieter/Mieter" (erweitert von „CO₂-Aufteilung")
Daniel-Hinweis 04.05.2026: nicht nur CO₂ wird aufgeteilt, sondern systematisch erweiterte Aufteilungs-Mechanik. Tab umbenennen auf „Kosten-Aufteilung Vermieter/Mieter" und drei Sektionen:

**Sektion 1 — CO₂-Preis-Aufteilung (BESCHLOSSEN, BEHG seit 2023):**
- Stufenmodell nach Energieausweis-Klasse: A++/A+/A → 0 % Vermieter, 100 % Mieter; B/C → 30/70; D → 50/50; E → 70/30; F → 90/10; G/H → 95 % Vermieter, 5 % Mieter
- Berechnungs-Formel pro Heizoption (CO₂-Emission × CO₂-Preis × Aufteilungsquote pro Seite)
- Aktuelle Default-Werte: Default-Klasse aus Block 5 ableiten

**Sektion 2 — Gas-Netzentgelte-Aufteilung (IN DISKUSSION, nicht beschlossen):**
- Aktuell: Netzentgelte vollständig über Heizkostenabrechnung an Mieter
- Bundesnetzagentur-Eckpunkte 2024 zur „verursachergerechten Verteilung"
- Mögliche zukünftige Aufteilungs-Quote: analog BEHG-Stufenmodell oder separate Regelung
- Excel-Modellierung: als Sensitivitäts-Szenario („Annahme: ab 2030 Vermieter-Anteil 30/50/70 %")
- Quellen-Hinweis: politische Diskussion — bei Excel-Update prüfen, ob Gesetzes-Initiative gestartet

**Sektion 3 — Grüngasquote / Biogas-Aufschlag-Aufteilung (STRATEGISCHER TREND):**
- Aktuell: über Gas-Effektivpreis verteilt, Mieter trägt alles
- Politische Forderungen nach Vermieter-Anteil bei nicht-modernisierten Gebäuden
- Excel-Modellierung: als Sensitivitäts-Szenario („Annahme: ab 2032 Aufschlag aufgeteilt")

**Konsequenz für Web (in Spec v2.0 §7 Punkt 11):**
Vermieter trägt zunehmend Mit-Verantwortung für Folgekosten der Heizungs-Wahl. Argument gegen das Narrativ „Heizkosten sind nur Mieter-Sache". Wichtig für Vermieter-Bilanz-Argumentation und Sensibilisierungs-Block.

**Folgeaufgabe vor Excel-Patch:** Quellen-Recherche zu Bundesnetzagentur-Eckpunkten 2024 + politischen Initiativen zur Netzentgelte-Aufteilung. Belege im Excel-Tab `Quellen` ablegen.

### Tab „Sanierungspfad"
Tab existiert bereits (siehe parameter.json `_tabs[]`-Liste). Erweitern um:
- Sanierungs-Investitions-Pfad pro Jahr
- GdW-Erhaltungsrücklage-Plausibilität-Berechnung (eingegebene Rücklage vs. Richtwert 13–17 €/m²/a)
- Konsequenz: „bei aktueller Rücklage und 10-Jahres-Horizont reichen X € nicht — du brauchst Y €/Monat zusätzlich"

### Tab „Fernwärme-Logik"
Tab existiert bereits. Erweitern um:
- Heizlast-Abhängigkeit des Effektivpreises (Leistungspreis dominiert bei kleinem Verbrauch)
- Erfurt-Effektivpreis 17,5 ct/kWh als Referenz
- AGFW-Median 15,7 ct/kWh als Bundesschnitt
- Effizienz-Paradoxon erläutern
- Versorger-Monopol-Aussage

### Tab „Investor-KPIs" (existiert) — Cashflow-Bug fixen
**Kritisch — Bug-Fix:**
Cashflow-Tabellen pro Option (Spalten K–L unter §5) zeigen `#BEZUG!` ab Jahr 1 für alle 5 Optionen. IRR-dynamisch ist deshalb für alle `n/a`. Vermutlich Tab-Rename-Aftereffekt vom 01.05.2026 Tab-Hygiene.

**Reparatur:** Quell-Zellen-Refs in den Cashflow-Formeln neu setzen, gegen die aktuell gültigen Tab-Namen.

**Zusätzlich:** TCO-Block aus Tab `Rechenlogik` in Investor-KPIs spiegeln (TCO Barwert + Statisch pro Option). Aktuell hat der Tab kein TCO — das ist konzeptionell unsauber, weil TCO eine zentrale Investor-Kennzahl ist.

## Methodische Erweiterungen

### CO₂-Preis als Pfad-Kurve statt statischem €/t
Aktuell: `CO2Pfad` als String-Switch (konservativ/mittel/hoch/Custom) + `CO2PreisCustom_def` als €/t-Wert.

**Neu:** CO₂-Preis als Steigerungs-Kurve über die 25 Jahre — z. B.:
- 2026: 55 €/t (BEHG)
- 2027: 95 €/t (EU-ETS2-Start)
- 2030: 130 €/t
- 2035: 180 €/t
- 2040+: linear weiter

Excel-Konzept-Diskussion notwendig: drei Pfade (vorsichtig/realistisch/aggressiv) mit jeweils eigener Kurve. Nicht statischer Wert, sondern Jahres-Wert.

### Stranded-Asset-Sensitivität in Vermieter-Bilanz Block 5
Bestehende Risiko-Sensitivität Block 5 erweitern um 7. Szenario:
- „Gasnetz Innenstadt vor 2040 stillgelegt — Hybrid-Restwert 0 + Folge-Investition WP/FW erforderlich"

Berechnung: Hybrid-Investition als Verlust + Folge-Investitions-Annuität ab Jahr 14 (2040 - 2026).

### Grüngasquote-Sinkpfad
Aktuell: `Gruengas.default = 0.03` (3 %) statisch.

**Neu:** Sinkpfad als Liste:
- 2026: 3 %
- 2029: 10 % (GMG)
- 2032: 15 %
- 2035: 25 %
- 2040: 40 %

Effekt: Gas-Preis pro kWh steigt überproportional, weil Grüngas teurer ist (2–3× fossiles Gas).

### Hybrid-Reparatur-Aufschlag
Wartungsquote 3 % deckt routinemäßige Wartung ab. „Zwei-Systeme"-Komplexitäts-Risiko (höheres Ausfall-Risiko, höhere Reparatur bei Defekt) ist nicht abgebildet.

**Optionen:**
- (a) Wartungsquote auf 3,5 %
- (b) Eigener „Komplexitäts-Aufschlag" pro Hybrid-System (z. B. 500–800 €/a pauschal)
- (c) Reparatur-Pauschale für Hybrid leicht erhöhen (gegen Standard-MFH-Pauschale)

Diskussion mit Becker oder Verbraucherzentrale empfehlenswert.

### Strom-Gas-Korrelations-Faktor für WP-Strom
Aktuell: WP-Strom-Steigerung 2,5 %/a unabhängig von Gas-Steigerung.

**Realistisch:** Strom-Mittellast hat 30–40 % Anteil aus Gas-Verstromung. Gas +5 % → Strom +1,5–2 %.

**Neu:** Korrelations-Faktor in Block 1 — `StromGasKorrelation = 0.35`. WP-Strom-Effektiv-Steigerung = `WPStromBasis × (1 + Gas-Steigerung × 0.35)`.

### Risiko-Übersicht Block 4 neu konzipieren
Bisher: Modernisierung-vs.-Status-quo-Ampel-Tabelle. Daniel hat am 03.05.2026 abend zu Recht moniert: „Modernisierung als Nachteil wirkt falsch".

**Neu:** Aussage pro Risiko-Aspekt für jede Heizoption (nicht Status-quo-vs.-Mod).

| Risiko-Aspekt | Gas | Hybrid | WP | FW | Pellets |
|---|---|---|---|---|---|
| CO₂-Preis-Eskalation | hoch | mittel | gering | mittel | gering |
| Stranded-Asset Gasnetz | hoch | hoch | gering | gering | gering |
| ... | ... | ... | ... | ... | ... |

Als Pastell-Tabelle (rot/gelb/grün) pro Zelle. Im Web NICHT angezeigt (siehe Spec v2.0 §3.X — Risiko-Übersicht raus aus Web), nur in Excel.

## build_json.py-Folgeaufgaben (alte Liste, jetzt hier konsolidiert)

Bisher in eigenem Memory `project_build_json_folgeaufgaben.md` — die Aufgaben gehören thematisch hier rein.

1. **Block 8 Heizlast-Hilfsregel exportieren** (war C1-JS-Hardcode)
2. **`foerderung_mai_2026`-Sektion vollständig in JSON** (war C1-JS-Hardcode)
3. **`AltstadtPLZ`-Tabelle in `block4_plausi`** (war C1-JS-Hardcode)
4. **Investitions-Diskrepanz** parameter.json (180k WP) ↔ Excel-Tab Rechenlogik (126k WP) klären — Modernisierungs-Mehrinvest vs. absolute Heizungs-Investition. Defined Names im Eingaben-Tab `InvWP` etc. (`Eingaben!$E$44` ff.) als operative User-Eingabe-Werte exportieren
5. **Wohnflächen-Diskrepanz** parameter.json (950 m²) ↔ Excel-Tab Rechenlogik (908 m²) — auf 908 m² synchronisieren oder als bewusst gerundeten Default kennzeichnen
6. **Glossar-Tab → glossar.json** für Web-Tooltips (EPBD, BAFA, KfW, GMG, FRI, BEG, BEHG, EU-ETS, MEA, JAZ, DVGW, AGFW, Annuität, Barwertfaktor, Sanierungsstand, Sondereigentum, Vermögensbilanz, …)
7. **Belegbarkeits-Felder** (`belegbarkeit: A/B/C`) pro Wert konsequent pflegen — Spec v2.0 fordert Badges auf Werten

## Fernwärme-Logik-Klarstellung im Web

Daniel-Hinweis 03.05.2026 abend: Fernwärme-Preise sind nicht transparent wie Gas-Preise (ct/kWh). Effektivpreis hängt von Heizlast ab (Leistungspreis-Anteil dominiert bei kleinem Verbrauch).

**Konsequenz für Web:**
- Bei FW-Wahl im Wizard: Hinweis „Fernwärme-Preise sind tarifabhängig — der Effektivpreis ergibt sich aus Heizlast und Verbrauch. Wir rechnen mit dem Erfurt-Effektivpreis 17,5 ct/kWh."
- Im Wizard Schritt 2: Heizlast-Eingabe mit ⓘ-Erläuterung, warum sie für FW besonders relevant ist
- Im Dashboard: Zeile „Effektivpreis FW" als ausweisbare Kennzahl, mit Methodik-Tooltip-Link

## CO₂-Aufteilung Vermieter/Mieter im Web

Im Wizard nicht abgefragt, aber im Methodik-Tooltip erläutert. Bei Vermietung: ⓘ-Hinweis „CO₂-Kosten werden nach BEHG-Stufenmodell aufgeteilt — typisch 70 % Vermieter / 30 % Mieter bei schwachen Klassen, 0 % / 100 % bei starken Klassen. Default in der Berechnung: 50/50."

## Reihenfolge der Excel-Patches (Empfehlung)

**Hochprioritär (vor breitem Live-Gang):**
1. Cashflow-Tabellen-Bug Investor-KPIs reparieren
2. Investitions- und Wohnflächen-Diskrepanz parameter.json ↔ Excel klären
3. Tab „Risiken" anlegen mit initialer Sammlung
4. CO₂-Preis als Pfad-Kurve

**Mittelprioritär:**
5. Stranded-Asset-Sensitivität Block 5
6. Grüngasquote-Sinkpfad
7. Risiko-Übersicht Block 4 neu (Excel-only)
8. Strom-Gas-Korrelations-Faktor

**Niedrigprioritär (nach Live-Gang):**
9. Hybrid-Reparatur-Aufschlag (Diskussion mit Fachexperten)
10. Tab „CO₂-Aufteilung" formal anlegen
11. Tab „Sanierungspfad" erweitern
12. Tab „Fernwärme-Logik" erweitern

**Neu hinzugefügt 04.05.2026 (Befunde aus C2 v2.0-Implementation Schritt 3 Verifikations-Stop):**

13. **TCO-Statisch-Methodik exakt entschlüsseln (NEU 04.05.).** Claude Codes Berechnung nach Spec §5 (Netto-Invest + Σ jährl. Kosten × Preissteigerung, ohne Diskontierung) trifft Excel-Werte mit Diff −7 bis +4 % — außerhalb ± 2 %. Excel hat eine andere Behandlung (vermutlich CO₂-Pfad oder Wartungs-Inflation oder Zeit-Faktor n=24 statt 25). Statisch-Spalte wurde aus dem Web-Dashboard für jetzt rausgenommen, nur TCO Barwert wird gezeigt. Folgeaufgabe: Excel-Formel im Tab Rechenlogik §6 Zeile „TCO Statisch" entschlüsseln, dann Statisch-Spalte ins Web nachziehen.

14. **Big-Picture-Achsen aus Heuristik-Konstante in Excel-Tab überführen (NEU 04.05.).** Claude Codes Implementation nutzt `BIG_PICTURE_HEURISTIK_FIX` als JS-Konstante für die qualitativen Achsen (Resilienz, Erweiterbarkeit, Zukunftsfähigkeit, Risiko). Die quantitativen Achsen (Wirtschaftlichkeit, Nachhaltigkeit) kommen algorithmisch aus TCO/CO₂. Folgeaufgabe: Excel-Tab „Big Picture Achsen" anlegen mit Werten 0–100 pro Heizoption × 6 Achsen, in `parameter.json` als `block9_big_picture_achsen` exportieren, JS-Konstante durch JSON-Lookup ersetzen.

15. **Pellets-Konditional-Render im Web (NEU 04.05.).** Strategische Entscheidung Daniel: Hausentscheider startet in Erfurt, Pellets ist meistens nicht plausibel (Innenstadt + > 30 kW). Web-UI rendert Pellets-Spalte nur wenn `pelletsPlausibel = true`, sonst komplett ausblenden (nicht ausgrauen). Engine berechnet Pellets weiterhin (Methodik intakt). Excel bleibt vollständig mit Pellets. Bei späterer Marktausweitung (München, ländlicher Raum) wird Pellets automatisch wieder sichtbar — kein Engine-Change nötig.

**Neu 05.05.2026 (Befunde aus C2 v2.1-Spec-Vorbereitung):**

16. **Vermögensbilanz Block 3 wandert komplett in die Excel.** Daniels Befund: zu profihaft für Web. Inhalte (5 Optionen × 11 Posten kumuliert über 25 J) bleiben Excel-Edition-Inhalt. Web zeigt nur Block 1 (qualitative Vorteile) + Block 2 (Jahres-Cashflow gemittelt + Mieter-Nebenkosten-Erweiterung neu).

17. **Mieter-Nebenkosten-Methodik (NEU im Web).** Berechnet sich dynamisch aus dem User-State, nicht pauschal. Excel-Tab `Vermieter-Sicht` muss um diese Berechnung erweitert werden:
    - ΔCO₂-Kosten/a = CO₂-Kosten[Status_quo_Gas] − CO₂-Kosten[Modernisierung]
    - ΔEnergiekosten/a = Energiekosten[Status_quo_Gas] − Energiekosten[Modernisierung]
    - Mieter-Anteil-CO₂ = abhängig von Effizienzklasse (BEHG-Stufenmodell, Default 50/50 für Klasse C-D bei teilsaniert)
    - Mieter-Anteil-Energiekosten = 1,0 (Mieter trägt typischerweise 100 % über Heizkostenabrechnung nach HeizkostenV)
    - Wohnflächen-Anteil = Eigene_Wohnfläche / Gesamt-Wohnfläche
    - Mieter-Effekt/Monat = (ΔCO₂ × 0,5 + ΔEnergie × 1,0) × Wohnflächen-Anteil / 12
    - Quellen für Tooltip: BEHG-Stufenmodell 2023, HeizkostenV §7, Verbraucherzentrale Energieberatung
    - Excel-Folgeaufgabe: Tab `CO₂-Aufteilung` erweitern um Mieter-Nebenkosten-Block, mit Effizienzklassen-Lookup für die exakte BEHG-Quote
    - Web-Anzeige: Cashflow-Tabelle Block 2 bekommt zusätzliche Zeile „Mieter-Nebenkosten-Effekt p.m." (pro Monat, intuitiver als pro Jahr — Daniel-Wunsch)

18. **Big-Picture-Wirtschaftlichkeits-Achse: TCO-basiert statt Investitions-basiert.** Aktuelle Heuristik-Konstante zeigt WP wirtschaftlich schwächer als Gas — verzerrt, weil nur Investitionskosten betrachtet. Excel-Folgeaufgabe: Wirtschaftlichkeits-Achse explizit aus TCO-Werten normalisieren (niedrige TCO = hoher Achs-Wert), nicht aus Investitions-Inversion. Pattern-Tausch in `engine.js` `berechneBigPictureAchsen`.

19. **Big-Picture-Risiko-Achse: Begriff-Wechsel auf „Risiko-Schutz".** „Risiko invers" verwirrt. Neuer Begriff: „Risiko-Schutz" — hoch = gut (analog zu allen anderen Achsen). Tooltip: „Wie gut bist du gegen Stranded-Asset, regulatorische Sprünge, Kostenexplosion abgesichert?". Achs-Werte invertiert, sodass Hybrid/WP hoch (geschützt), Gas niedrig (ungeschützt).

20. **Pastell-Bewertungs-Logik im Web: Schwellwert statt Min-Max.** Min-Max erzeugt Verzerrung bei kleinen Differenzen (WP +11,7 % wirkt gleich rot wie FW +107 %). Schwellwert-Logik: ≤5 % grün, 5–25 % gelb, >25 % rot. Bei allen innerhalb 5 % keine Färbung. Excel kann analoge Visualisierungs-Logik im Dashboard-Tab übernehmen (statt voll-gesättigte rot/grün — Pastell macht es leserfreundlicher und konsistent zu Web).

21. **Drei-Panel-Struktur aufgehoben (Wirtschaftlichkeit / Radar / FRI).** Daniel-Strategieentscheidung 05.05.2026: Panels 2 (Entscheidungs-Radar) und 3 (Future Readiness Index) raus aus Web. Big Picture mit 6 Achsen integriert die FRI-Methodik. Konsequenz für Excel: Tab `Panel 2 - Radar` und Tab `Panel 3 - FRI` bleiben in der Excel-Edition als Tiefen-Inhalt (für Profis), aber im Web spielen sie keine Rolle mehr. Memory `project_etappe_iii_architektur.md` entsprechend aktualisieren.

22. **Excel-Edition Geschäftsmodell vereinfacht: 49 € jährlich (Stand 05.05.2026).** Ersetzt das frühere 19 €-Update-Modell. Wer eine aktuelle Excel will, zahlt 49 €. Pragmatisch, kein Tracking, kein Update-Preis. Web-Tarif-Vergleich zeigt zwei Spalten (Web kostenlos / Excel 49 €), keine Update-Spalte mehr.

**Neu hinzugefügt 05.05.2026 abend (Befunde aus C2 v2.1 Implementation Verifikations-Stop und Browser-Test):**

23. **JSON-Wartungs-%-Angleich auf Memory-Werte (Methodik-Korrektur).** Aktuelle JSON-Werte führen uniform 2 % Wartungsquote, Memory `project_excel_reparatur_wartung_modell.md` ist authoritative für heizungs-spezifische Werte: Gas-BW 2,0 %, Hybrid 3,5 %, WP 1,5 %, FW 1,0 %, Pellets 3,0 %. Engine.js wurde am 05.05.2026 auf Memory-Werte korrigiert (bidirektionale Optimierung). Excel-Folgeaufgabe: Tab `Eingaben` Wartungs-Quoten heizungs-spezifisch differenzieren, build_json.py-Lauf, parameter.json regeneriert. Konsequenz: alte v1.1-§3.7-TCO-Soll-Werte sind in v2.1 obsolet. Neue v2.1-Soll-Werte (mit korrigierten Wartungs-%):
    - Gas      393.657 €
    - Hybrid   390.789 € (beste Option, unverändert)
    - WP       403.565 €
    - FW       778.758 €
    - Pellets  358.121 €
    Diese Werte sind in `js/engine.js` `runVerifikation` als Konstante eingetragen mit Code-Kommentar zum Stand. Bei nächstem Excel-Patch v2.1 → JSON regeneriert → Verifikations-Werte können sich nochmal leicht verschieben (innerhalb ± 2 %).

24. **UX-Detail Default-State Zukunftsszenario klarer machen (UX-Schliff für nächste Sitzung).** Im Default-State zeigt Was-wäre-wenn Spalte C zwischen JSON-Modellpreisen (Hybrid 1,43 €/m²/Monat beste) und rechner.html-Marktpreisen (WP 1,51 € beste, da höhere Gas-Preise die Hybrid-Komponente belasten) den Kipppunkt — methodisch genau, was das Feld leisten soll, aber UX-mäßig irritierend, weil User keine Schieberegler bewegt hat und trotzdem Vorher/Nachher-Pfeile sieht. Lösung-Vorschlag für nächste UX-Schleife: initialen Default-Zustand klarer machen mit Hinweis „wenn du nichts veränderst, vergleichst du Modellpreise vs. Marktpreise" oder Default auf „ist = neu" mit blasser Anzeige bis erste Schieberegler-Bewegung.

## How to apply

- Beim nächsten Excel-Update: Liste durchgehen, gebündelt abarbeiten
- Diskussion mit Becker oder externem Energie-Wirtschaftler vor methodischen Änderungen empfehlenswert
- Nach Excel-Patch: build_json.py-Lauf, parameter.json regenerieren, Web-Engine zieht automatisch neue Werte
- Excel-Edition-Käufer per E-Mail informieren über v2.1-Update (Geschäftsmodell-Bestandteil 49 € jährlich)
