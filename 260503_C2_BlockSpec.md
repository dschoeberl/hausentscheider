# Block C2 — Spec v1: Wirtschaftlichkeits-Panel mit Berechnungen, Vermieter-Bilanz, Erweiterter Modus, Methodik-Tooltips

**Stand:** 3. Mai 2026 (v1 — folgt auf C1 v3, der seit 02.05.2026 abend live ist)
**Datengrundlage:** `daten/parameter.json` (154 Defined Names, 8 Block-Sektionen, Stand Mai 2026) + `daten/preishistorie.json` (Mai 2026 als aktueller Monat)
**Architektur:** Modell Z, Vier-Schichten-Pattern, Berechnungs-Layer in `js/engine.js` (NEU), Visualisierungs-Layer in `js/ergebnis.js` (NEU), Single Source of Truth bleibt Excel `Der_Entscheider_Testsystem_v2.0_neutral.xlsx`
**Ziel der Sitzung:** Aus den C1-Stubs werden gerechnete Werte. Panel 1 Wirtschaftlichkeit funktional mit Headline-KPIs, 25-Jahres-Cashflow-Kurve und 5er-Vergleich. Vermieter-Bilanz mit fünf Blöcken konditional sichtbar. Erweiterter Modus mit vier funktionalen Hebeln. Methodik-Tooltips mit echten Formeln und Quellen.

---

## 0 — Was sich gegenüber C1 ändert

C1 hat das Skelett gestellt: Wizard mit 9 Pflichtfeldern, Ergebnis-Seite mit allen Sektionen, Stubs für Panel 1/2/3, drei Schieberegler-Blöcke ohne Wirkung, Belegbarkeits-Badges mit Platzhalter-Werten.

C2 macht aus den Stubs für **Panel 1 Wirtschaftlichkeit** und **Vermieter-Bilanz** echte Inhalte. Die Schieberegler bekommen Wirkung. Der Erweiterte-Modus-Toggle wird funktional. Methodik-Tooltips werden befüllt.

**Strukturelle Erweiterungen:**

- Neuer JS-Layer `js/engine.js`: reine Berechnungs-Funktionen, testbar, ohne DOM-Bezug
- Neuer JS-Layer `js/ergebnis.js`: Chart.js-Visualisierungen, DOM-Updates, Re-Rendering
- `rechner.html` lädt beide Module zusätzlich zum Inline-JS
- Chart.js via CDN eingebunden

**Was C1-Stubs verlässt:**

- Panel 1: Headline-KPIs (TCO 25 J, €/m²/Monat, Amortisation), 25-J-Cashflow-Kurve, gestapelter 5er-Vergleich, Belegbarkeits-Badges aus parameter.json statt Platzhalter
- Drei Schieberegler-Blöcke: Wirkung auf Panel 1 live
- Persona-Picker: Wirkung auf Empfehlungs-Berechnung (für Headline-Antwort und Big-Picture-Banner)
- Vermieter-Bilanz-Container (war hidden + Stub): konditional sichtbar mit fünf befüllten Blöcken
- Erweiterter-Modus-Toggle: aktiviert vier Hebel im Mini-Cockpit
- Methodik-Tooltips: pro KPI Formel + Annahmen + Quelle
- Empfehlungs-Banner unter dem Big Picture: algorithmisch befüllt

**Was C1-Stubs bleibt (für C3/C4):**

- Panel 2 Entscheidungs-Radar
- Panel 3 Future Readiness Index
- Big Picture Netzdiagramm (nur Empfehlungs-Banner befüllt in C2)
- WEG-Hinweise (Stub-Inhalt in C2 — drei Standard-Antworten — Vollausarbeitung in C5 oder Beratung)

---

## 0.5 — Steigerungs-Heuristik Web / Excel / Beratung (Designgrundlage)

**Drei Ebenen, drei Versprechen, jede mit eigenem Mehrwert:**

| Ebene | Versprechen | C2-Inhalt |
|---|---|---|
| **Web** (kostenlos) | Gefühl bekommen, Aha-Moment, Augenhöhe gegen Versorger / Ingenieurbüro / Stadtwerke | Mittelwerte, Kurven, drei Schieberegler-Sensitivitäten, Standardfälle, klare Empfehlungen |
| **Excel-Edition** (49 € + 19 €/J Update) | Unabhängig vom Internet in Ruhe rechnen, eigene Werte einrechnen, alle Hebel sichtbar | Volle Jahrestabellen, Sinkpfade, Cap-Logik, AfA-Berechnung, Mietspiegel-Klassen, KfW-Kombi, freie Sensitivitäten |
| **Beratung** (perspektivisch) | Persönliche Begleitung in Sondersituationen | WEG-Versammlungs-Begleitung, individuelle Beschluss-Vorlagen, Sondersituationen, Verweis auf Steuerberater |

**Wirkung auf C2:** bei jeder einzelnen Funktion bewusst entscheiden, in welcher Ebene sie liegt. Web limitiert auf Mittelwerte und Standardfälle. Vertiefungen kommen nicht ins Web — sondern in Hinweis-Boxen mit Verweis auf die nächste Ebene. So entsteht klare Steigerung statt überladenes kostenloses Werkzeug.

**Konkrete Aufteilung in C2 (Auszug):**

| Baustein | Web (C2) | Excel | Beratung |
|---|---|---|---|
| TCO 25 J / €/m²/Monat / Amortisation | Headline-KPIs ✓ | identisch + Komponenten-Detail | — |
| 25-J-Cashflow-Kurve | Linien-Chart, 5 Optionen ✓ | volle Jahrestabelle 25 × 5 | — |
| 5er-Vergleich gestapelter Balken | ✓ | identisch + Komponenten-Tooltip | — |
| Förder-Slider (Block C) | Master + 4 Toggles + 3 Schnell-Buttons ✓ | freier Sinkpfad, Cap-Berechnung, Effizienzbonus-Detail | — |
| Vermieter-Bilanz Block 1 (qualitativ) | 9 Punkte ✓ | identisch | Vertiefung im Dialog |
| Vermieter-Bilanz Block 2 (Jahres-Cashflow) | nur Mittelwerte gemittelt 25 J ✓ | Jahres-Tabelle 25 × Posten | — |
| Vermieter-Bilanz Block 3 (Vermögensbilanz) | 25-J-Saldo pro Option ✓ | Jahres-Tabelle aller 11 Posten | — |
| Vermieter-Bilanz Block 4 (Risiko qualitativ) | 9 Aspekte als Ampel ✓ | identisch | Vertiefung |
| Vermieter-Bilanz Block 5 (Risiko sensitiv) | 6 Szenarien als Tabelle ✓ | freie Sensitivität | — |
| §559 Mietspiegel-Effekt | sichtbarer €-Posten in Bilanz, Tooltip „Klassen-Lookup → Excel" | volles Klassen-Sprung-Lookup | — |
| §7b Sonder-AfA | Hinweis-Box mit Disclaimer | volle Berechnung | „Steuerberater fragen" |
| KfW-Kombi-Modell | Hinweis-Box | volle Berechnung | — |
| Erweiterter Modus | 4 Hebel: Energiepreis, JAZ, CO₂-Pfad (3 Szenarien), Verkehrswert ✓ | beliebig viele Sensitivitäten, freie Pfade | — |
| WEG-Hinweise | **Stub mit 3 Inhalten:** was beschlossen / Mehrheit / Frist ✓ | volle Beschluss-Vorlage, Mehrheits-Lookup | persönliche Versammlungs-Begleitung als Service |
| IRR | NICHT im Web (zu komplex, Excel-Steigerung) | ✓ | — |

---

## 1 — Konzeptioneller Rahmen — was C2 fachlich leistet

C2 ist der fachliche Kern der gesamten Plattform. Nach C2 hat der Nutzer:

1. **Eine Antwort** auf die Frage „Was kostet mich die Heizungsentscheidung über 25 Jahre?" — als Headline-KPI, in einer einzigen Zahl, mit Belegbarkeits-Badge und Methodik-Tooltip.
2. **Eine Empfehlung** über die fünf Optionen — algorithmisch berechnet aus TCO + Persona-Gewichtung, sichtbar im Empfehlungs-Banner unter dem Big Picture.
3. **Eine Cashflow-Geschichte** über 25 Jahre — als visuelle Kurve, die zeigt, wie sich Investition, Förderung und Energie-Preise über die Zeit auswirken.
4. **Eine direkte Vergleichbarkeit** aller fünf Heizoptionen — als gestapelter Balken mit den fünf Komponenten Investition − Förderung + Energie + Wartung + Reparatur.
5. **Eine Vermieter-Sicht**, falls relevant — fünf Blöcke mit Cashflow, Vermögensbilanz, Risiko und Sensitivität, alle quantifiziert.
6. **Vier Hebel** im Erweiterten Modus — eigener Energiepreis, JAZ-Override, CO₂-Pfad, Verkehrswert — die das Ergebnis im persönlich relevanten Bereich anpassen.

**Was C2 explizit nicht leistet** (Steigerungs-Heuristik):

- Keine vollständige Jahrestabelle pro Option — das ist Excel-Inhalt
- Keine IRR-Berechnung mit Konvergenz-Detail — das ist Excel-Inhalt und für Web zu komplex
- Keine §7b Sonder-AfA-Berechnung — Hinweis-Box reicht, „Steuerberater fragen" als Brücke
- Keine KfW-Kombi-Modell-Berechnung — Hinweis-Box mit Verweis auf BAFA + KfW + Excel-Edition
- Keine Mietspiegel-Klassen-Sprung-Lookup-Tabelle — Tooltip-Verweis auf Excel reicht

---

## 2 — Scope C2 + Akzeptanz-Kriterien

**Im Scope:**

- `js/engine.js` neu — alle Berechnungen als reine Funktionen, ohne DOM-Bezug, testbar
- `js/ergebnis.js` neu — Chart.js-Visualisierungen, DOM-Updates für Panel 1, Re-Rendering bei State-Änderung
- Chart.js via CDN eingebunden in `rechner.html`
- Panel 1 Wirtschaftlichkeit: Headline-KPIs, 25-J-Cashflow-Kurve, gestapelter 5er-Vergleich, Belegbarkeits-Badges aus parameter.json
- Drei Schieberegler-Blöcke wirken live auf Panel 1 (Zeitraum / Energiepreise / Förderung)
- Vermieter-Bilanz konditional sichtbar bei Nutzungsart ≠ Selbstnutzung — fünf Blöcke befüllt
- WEG-Hinweise konditional sichtbar bei Eigentümer-Typ „WEG" — drei Stub-Inhalte (was beschlossen / Mehrheit / Frist)
- Erweiterter-Modus-Toggle aktiviert vier Hebel im Mini-Cockpit (eigener Energiepreis, JAZ-Override, CO₂-Pfad, Verkehrswert)
- Methodik-Tooltips an jedem KPI mit echter Formel + Annahmen + Quelle aus Excel-Tab `Quellen`
- Empfehlungs-Banner unter dem Big Picture algorithmisch befüllt aus TCO-Min + Persona-Gewichtung
- Headline-Antwort über dem Cockpit befüllt
- Pellets-Filter sichtbar in Panel 1 (graue Säule + Tooltip-Hinweis bei `Pellets_Plausibel = nein`)

**Akzeptanz-Kriterien (am Ende der Sitzung erfüllt):**

1. `rechner.html` lädt ohne Konsolen-Fehler. Chart.js-CDN eingebunden, `js/engine.js` und `js/ergebnis.js` geladen.
2. **TCO 25 J** wird für jede der fünf Heizoptionen berechnet aus parameter.json + Wizard-State. Verifikations-Werte gegen Excel v2.0_neutral MFH-Default (siehe §3.7).
3. **€/m²/Monat** = TCO 25 J ÷ Wohnfläche ÷ (Zeitraum × 12). Wert je Option in der Headline-Pille sichtbar.
4. **Amortisation gegen Status quo** = Schnittpunkt der kumulativen Cashflows. Wert je Option in Jahren, ggf. „nicht erreicht in 25 J" als Fallback.
5. **Förder-Quote** wird berechnet aus den vier BEG-Komponenten-Toggles + Master-Slider + Cap (70 % / 21.000 €). Master-Slider zeigt aggregierte Quote, kann manuell überschrieben werden.
6. **Cashflow-Kurve** als Chart.js-Line-Chart mit fünf Linien (eine pro Heizoption), 25 Jahre x-Achse, kumulativer Cashflow in € y-Achse. Farben aus Petrol-System.
7. **5er-Vergleich** als Chart.js-Bar-Chart, gestapelt mit Komponenten Investition (negativ) − Förderung (positiv) + Energie + Wartung + Reparatur. Beste Option visuell markiert (z. B. Rahmen oder Sortierung).
8. **Pellets-Filter:** bei Innenstadt + Heizlast > 30 kW wird Pellets-Säule grau gerendert mit Tooltip „in dieser Lage nicht plausibel".
9. **Belegbarkeits-Badges:** jeder Headline-KPI bekommt das Badge aus parameter.json (Fallback „C" bei fehlendem Feld).
10. **Methodik-Tooltips:** Klick/Hover auf ⓘ-Icon öffnet Popover mit Formel-Ausschnitt, Annahmen-Liste, Quellen-Verweis (Q-Kürzel aus Excel-Tab `Quellen`).
11. **Schieberegler Block A (Zeitraum):** Verschieben löst Re-Render aller Panel-1-KPIs aus. Cashflow-Kurve passt x-Achse an.
12. **Schieberegler Block B (Energiepreise):** Verschieben löst Neuberechnung der Cashflow-Pfade aus, mit der entsprechenden optionsspezifischen Steigerung.
13. **Schieberegler Block C (Förderung):** Toggle-Kombi → Master + €-Cap → Re-Render aller TCO-Werte.
14. **Persona-Picker:** Wechsel löst Neuberechnung der Empfehlung aus (Reihenfolge der Optionen kann sich ändern). KPI-Rohwerte ändern sich nicht.
15. **Vermieter-Bilanz** wird konditional sichtbar bei Nutzungsart ≠ Selbstnutzung. Alle fünf Blöcke befüllt mit Werten aus parameter.json + State.
16. **WEG-Hinweise** werden konditional sichtbar bei Eigentümer-Typ „WEG". Drei Stub-Inhalte (was muss beschlossen werden / welche Mehrheit / welche Frist).
17. **Erweiterter Modus** aktiviert: vier zusätzliche Pills im Mini-Cockpit (eigener Energiepreis / JAZ / CO₂-Pfad / Verkehrswert). Pill-Klick öffnet Inline-Editor.
18. **Eigener Energiepreis** überschreibt den Status-quo-Cashflow-Pfad und blendet eine Vergleichszeile ein („Du zahlst X — Marktdurchschnitt Y — Differenz Z%").
19. **JAZ-Override** wirkt auf WP- und Hybrid-Cashflow-Pfade.
20. **CO₂-Pfad-Auswahl** (drei Szenarien: Politik aktuell / Beschleunigung / Stagnation) wirkt auf den CO₂-Verschiebungs-Posten in der Vermieter-Bilanz.
21. **Verkehrswert-Override** wirkt nur auf Vermieter-Bilanz Block 3 (EPBD-Risiko, Marktwert-Premium).
22. **Empfehlungs-Banner** unter dem Big Picture befüllt mit algorithmisch generiertem Klartext: „Für dein Profil tragen {Option A} und {Option B} gleich gut, {Option C} liegt eine Klasse darunter."
23. **Headline-Antwort** über dem Cockpit befüllt mit einem Satz: „Die wirtschaftlichste Option für dein Profil ist {Option} mit {€/m²/Monat} über {Zeitraum} Jahre."
24. **§559 Mietspiegel-Effekt** als sichtbarer €-Posten in Vermieter-Bilanz Block 2. Tooltip-Verweis auf Excel-Klassen-Lookup.
25. **§7b Sonder-AfA** als Hinweis-Box in Vermieter-Bilanz Block 3 mit Disclaimer „Steuerberater fragen, Detail-Berechnung in Excel-Edition".
26. **KfW-Kombi-Modell** als Hinweis-Box im Förder-Slider-Footer mit Verweis auf KfW + Excel-Edition.
27. **Mobile (< 768 px):** Chart.js-Visualisierungen rendern korrekt, Touch-Interaktion funktioniert (Pinch-Zoom optional). Belegbarkeits-Badges, Tooltips bleiben tap-bar.
28. **Verifikations-Werte** gegen Excel v2.0_neutral MFH-Default in `js/engine.js` als Test-Konstanten dokumentiert (siehe §3.7).
29. **Reine Funktionen in `js/engine.js`:** keine DOM-Manipulation, kein State-Schreiben — alle Eingaben über Funktions-Parameter, alle Ausgaben über Return-Werte. Damit testbar via einfachen `console.assert`.
30. **Re-Render-Performance:** State-Änderung (z. B. Schieberegler-Move) führt zu Re-Render in < 100 ms. Chart.js-Update statt Re-Erzeugen.

---

## 3 — Berechnungs-Logik je Kennzahl

Die Excel ist Single Source of Truth. Jede Web-Berechnung muss exakt der Excel-Formel folgen — sonst läuft der Web-Wert vom Excel-Wert weg, und die Excel-Edition als Steigerung wird unglaubwürdig.

**Defined-Names-Konvention:** alle Variablen-Namen entsprechen 1:1 den Excel-Defined-Names aus `parameter.json`. Beispiel: `params.block1_energiepreise.PreisGas.default` entspricht Excel-Defined-Name `PreisGas`.

---

### 3.1 — TCO 25 Jahre pro Heizoption

**Formel (entspricht Excel-Tab `Investor-KPIs` Zeile TCO 25 J):**

```
TCO[option] = Investition[option]
            − Förderung[option]
            + Σ(t=1..T) Energiekosten[option, t]
            + Σ(t=1..T) Wartungskosten[option, t]
            + Σ(t=1..T) Reparaturkosten[option, t]
```

mit:
- `T = state.zeitraum` (Default 25, aus Schieberegler Block A)
- `Investition[option]` aus `params.block5_gebaeudedefaults[type].Investition_{option}` × Wohnflächen-Skalierung
- `Förderung[option]` = `Investition[option] × foerderQuote(option, state)` (siehe §3.5)
- `Energiekosten[option, t] = Verbrauch_eff[option] × Preis[option] × (1 + Steigerung[option])^(t-1)`
- `Wartungskosten[option, t] = params.block3_technik.Wartungsquote × Investition[option]`, optional steigend mit Inflation
- `Reparaturkosten[option, t]` aus `params.block5.Reparaturen_{option}`, gestaffelt über Lebensdauer aus Block 7

**Cashflow-Methodik (kumulativ + optionsspezifisch — Excel-Bug-Fix vom 01.05.2026, dokumentiert in Memory `project_cashflow_methodik.md`):**

Jede Heizoption nutzt ihre eigene Steigerungs-Variable:

| Option | Steigerungs-Variable | Energie-Defined-Name |
|---|---|---|
| Status quo Gas | `SteigGas` | `PreisGas` |
| Hybrid (WP + Gas-BW) | gewichtetes Mittel: `HybridAnteilWP × SteigWP + (1 − HybridAnteilWP) × SteigGas` | gemischt |
| Wärmepumpe | `SteigWP` | `PreisWP` |
| Fernwärme | `SteigFW` | `PreisFW` |
| Pellets | `SteigPellets` | `PreisPellets` |
| Öl (nur als Status-quo-Variante) | `SteigOel` | `PreisOel` |

Steigerung wird kumulativ angewendet: `Preis[t] = Preis[0] × (1 + Steigerung)^(t−1)`, t = 1 .. T.

**Verbrauchs-Effizienz pro Option (entspricht Excel-Tab `Investor-KPIs` Verbrauchs-Wirkungsgrad):**

| Option | Effektiv-Verbrauch |
|---|---|
| Status quo Gas | `Verbrauch / params.block3_technik.WGGas` (Default WG = 0,90) |
| Hybrid | `(0,7 × Verbrauch / params.block3_technik.JAZ) + (0,3 × Verbrauch / WGGas)` |
| Wärmepumpe | `Verbrauch / params.block3_technik.JAZ` (Default JAZ = 3,5) |
| Fernwärme | `Verbrauch / params.block3_technik.WGFW` (Default WG = 1,00) |
| Pellets | `Verbrauch / 0,85` (Pellets-WG ~ 0,85) |

**Funktions-Signatur in `engine.js`:**

```javascript
function berechneTCO(option, input, params) {
  // option: 'gas' | 'hybrid' | 'wp' | 'fw' | 'pellets' | 'oel'
  // input: vollständiger State (Wizard + Overrides + Schieberegler-Stand)
  // params: parameter.json
  // returns: { tco: number, komponenten: { investition, foerderung, energie, wartung, reparatur } }
}

function berechneTCOAlleOptionen(input, params) {
  return {
    gas: berechneTCO('gas', input, params),
    hybrid: berechneTCO('hybrid', input, params),
    wp: berechneTCO('wp', input, params),
    fw: berechneTCO('fw', input, params),
    pellets: berechneTCO('pellets', input, params)
  };
}
```

---

### 3.2 — €/m²/Monat als Vergleichs-Kennzahl

**Formel:**

```
EurProQmMonat[option] = TCO[option] / Wohnfläche / (Zeitraum × 12)
```

Anschauliche Vergleichs-Kennzahl. Ermöglicht Vergleich zwischen EFH und MFH (TCO in absoluten Beträgen ist sonst nicht vergleichbar).

**Funktions-Signatur:**

```javascript
function berechneEurProQmMonat(tco, wohnflaeche, zeitraum) {
  return tco / wohnflaeche / (zeitraum * 12);
}
```

---

### 3.3 — Amortisation gegen Status quo

**Definition:** Jahr, in dem der kumulative Cashflow der Option den kumulativen Cashflow des Status quo schneidet.

**Formel:**

```
Amortisation[option] = min{ t ∈ [1..T] : kumCashflow[option, t] >= kumCashflow[gas_status_quo, t] }
```

mit `kumCashflow[option, t] = Σ(s=1..t) (Cashflow[option, s])` und Cashflow als jährlicher Zufluss/Abfluss inkl. Investition (Jahr 1) und Energie/Wartung/Reparatur in jedem Jahr.

**Edge Case:** Wenn die Schwelle in T Jahren nicht erreicht wird, gibt die Funktion `null` zurück. Web-UI rendert dann „nicht erreicht in {T} Jahren".

**Funktions-Signatur:**

```javascript
function berechneAmortisation(option, input, params) {
  const cfStatusQuo = berechneCashflowKurve('gas', input, params);
  const cfOption = berechneCashflowKurve(option, input, params);
  for (let t = 1; t <= input.zeitraum; t++) {
    if (cfOption.kumuliert[t] >= cfStatusQuo.kumuliert[t]) return t;
  }
  return null;
}
```

---

### 3.4 — 25-Jahres-Cashflow-Kurve

**Definition:** Jährlicher Cashflow je Option, kumuliert über T Jahre, für die Visualisierung.

**Formel pro Jahr:**

```
Cashflow[option, t] = -Investition[option] (nur Jahr 1)
                    + Förderung[option] (nur Jahr 1)
                    - Energiekosten[option, t]
                    - Wartungskosten[option, t]
                    - Reparaturkosten[option, t]
```

Vorzeichen: negativ = Abfluss (Geld weg), positiv = Zufluss (Geld zurück, z. B. Förderung in Jahr 1).

Kumulierter Cashflow: `kumCashflow[option, t] = Σ(s=1..t) Cashflow[option, s]`.

**Funktions-Signatur:**

```javascript
function berechneCashflowKurve(option, input, params) {
  // returns: { jaehrlich: number[], kumuliert: number[] } (beide Arrays haben Länge T+1, Index 0 = Startwert 0)
}
```

---

### 3.5 — Förder-Quote (vier BEG-Komponenten + Cap)

**Formel:**

```
foerderQuote(option, state) = min(
  BAFA_Grund × on(state.foerderung.grund)
  + BAFA_Klima(t) × on(state.foerderung.klima) × klimaSinkpfad(t)
  + BAFA_Einkommen × on(state.foerderung.einkommen) × bedingung(state)
  + BAFA_Effizienz × on(state.foerderung.effizienz),
  Foerderdeckel
)
```

mit:
- `BAFA_Grund = 0.30` (params.foerderung_mai_2026.BAFA_Grundfoerderung.default)
- `BAFA_Klima = 0.20` mit Sinkpfad ab 2029 (0.17) und 2031 (0.14) — siehe `params.foerderung_mai_2026.Klimageschwindigkeitsbonus.sinkpfad`
- `BAFA_Einkommen = 0.30` — Bedingung: Selbstnutzung & zvE ≤ 40k (im Web nicht direkt prüfbar, wird als Toggle „nur Selbstnutzung" angeboten — siehe §6 Web-Vereinfachung)
- `BAFA_Effizienz = 0.05`
- `Foerderdeckel = 0.70` (Cap auf Quote) und `21.000 €` (Cap auf €-Betrag) — der niedrigere wirkt
- `t` = Jahr ab heute (für Klimabonus-Sinkpfad — Default heute = Mai 2026)
- `bedingung(state)` = 1 wenn Selbstnutzung, sonst 0

**Wichtig — nur für Wärmepumpe, Hybrid, Pellets, Fernwärme:** Status quo Gas und Öl bekommen keine BAFA-Förderung. Bei Status quo Gas wird `Förderung[gas] = 0`.

**Web-Vereinfachung:** Einkommensbonus ist Toggle, nicht über Einkommens-Eingabe. Begründung: Einkommens-Abfrage = Datenschutz-Risiko + Umfangs-Aufblähung, Steigerungs-Heuristik → Excel.

**Cap-Logik (Web):**
1. Quote-Cap: Summe der Komponenten ist auf 70 % begrenzt (`Math.min(quote, 0.70)`)
2. €-Cap: `tatsaechlicheFoerderung = Math.min(Investition × quote, 21000)`

Im Web wird die Quote angezeigt, der €-Cap wirkt erst in der TCO-Berechnung. Tooltip am Master-Slider erläutert: „Cap: max 70 % der Investition oder 21.000 €, was zuerst greift."

**Funktions-Signatur:**

```javascript
function berechneFoerderQuote(state, params) {
  // returns: { quote: number, capped: boolean, sinkpfadAktiv: boolean }
}

function berechneFoerderBetrag(option, state, params) {
  const investition = berechneInvestition(option, state, params);
  const { quote } = berechneFoerderQuote(state, params);
  return Math.min(investition * quote, params.foerderung_mai_2026.Foerderdeckel.max_euro);
}
```

---

### 3.6 — Empfehlungs-Berechnung (für Headline-Antwort und Big-Picture-Banner)

**Definition:** Algorithmische Empfehlung der besten Option auf Basis von TCO + Persona-Gewichtung.

**Persona-Gewichtungs-Matrix (für C2 nur Wirtschafts-Achse, Radar/FRI in C3/C4):**

| Persona | Gewicht TCO 25 J | Gewicht Cashflow Jahr 1 | Gewicht Förder-Attraktivität |
|---|---|---|---|
| Bewahrer | 0.60 | 0.10 | 0.30 |
| Optimierer | 0.50 | 0.30 | 0.20 |
| Wechsler | 0.20 | 0.40 | 0.40 |

Pro Option wird ein Score berechnet:

```
Score[option] = w_tco × normalize(−TCO[option])
              + w_cf  × normalize(Cashflow[option, 1])
              + w_fq  × foerderQuote(option) / 0.70
```

`normalize()` ist Min-Max-Skalierung über alle fünf Optionen, damit alle Achsen vergleichbar sind. Vorzeichen: −TCO, weil niedrige TCO besser ist.

**Empfehlungs-Output:**

```javascript
function berechneEmpfehlung(tcoAlle, cashflowAlle, foerderAlle, persona) {
  // returns: {
  //   beste: 'wp',
  //   sortiert: ['wp', 'hybrid', 'fw', 'pellets', 'gas'],
  //   abstandKlassen: 'eng' | 'mittel' | 'klar' (bestimmt Banner-Wording)
  // }
}
```

**Banner-Text-Templates:**

- `klar`: „Für dein Profil ist {beste} klar die wirtschaftlichste Option."
- `mittel`: „Für dein Profil tragen {beste} und {zweitbeste} ähnlich gut. {abgeschlagen} liegt eine Klasse darunter."
- `eng`: „Drei Optionen liegen eng beieinander: {top3}. Die Wahl hängt von Detail-Faktoren ab — wirf einen Blick in die Excel-Edition oder den Dialog."

---

### 3.7 — Verifikations-Werte gegen Excel v2.0_neutral MFH-Default

Bei Implementation in `js/engine.js` als Test-Konstanten am Ende der Datei dokumentieren. Claude Code muss in der Implementation-Schleife gegen diese Werte verifizieren:

**MFH-Default Input** (aus `parameter.json` block5_gebaeudedefaults.MFH):
- Wohnfläche 950 m², 14 WE
- Verbrauch 95.000 kWh/a
- Sanierungsstand teilsaniert
- Lage Innenstadt
- Heizung Status quo Gas-BW Baujahr 1998

**Förderung-Default:** Grund + Klima aktiv (50 % Quote), Einkommen + Effizienz aus.

**Erwartete TCO 25 J pro Option (aus Excel v2.0_neutral, gerundet auf Tausender):**

| Option | TCO 25 J | Quelle |
|---|---|---|
| Status quo Gas | ~404.000 € | Excel `Investor-KPIs!E25` |
| Hybrid | ~360.000 € | Excel `Investor-KPIs!F25` |
| WP | ~340.000 € | Excel `Investor-KPIs!G25` |
| FW | ~395.000 € | Excel `Investor-KPIs!H25` |
| Pellets | ~410.000 € (aber `Pellets_Plausibel = nein` für Innenstadt) | Excel `Investor-KPIs!I25` |

**Erwartete Cashflow-Werte WP Jahr 1 + Jahr 25 (Bug-Fix vom 01.05.2026):**

- Cashflow WP Jahr 1: ~ 2.230 €
- Cashflow WP Jahr 25: ~ 5.935 €
- IRR dynamisch ~ 6,7 % (Excel-Wert, nicht im Web angezeigt)

**Toleranz für Web-Werte:** ± 2 % (Rundungs-Toleranz). Bei Abweichung > 2 % ist die Web-Formel falsch und muss gegen die Excel-Defined-Names gegengeprüft werden.

---

## 4 — Panel 1 Wirtschaftlichkeit — UI

### 4.1 — Aufbau (von oben nach unten)

```
┌──────────────────────────────────────────────────────────┐
│  Headline-Pille-Cluster (3 Pillen)                      │
│   [TCO 25 J: 340.000 € A]  [€/m²/Monat: 12,30 € B]     │
│   [Amortisation: 11 J A]                                 │
├──────────────────────────────────────────────────────────┤
│  25-Jahres-Cashflow-Kurve (Chart.js Line)               │
│   5 Linien (Gas, Hybrid, WP, FW, Pellets)               │
│   Pellets ggf. grau gerendert                           │
├──────────────────────────────────────────────────────────┤
│  5er-Vergleich gestapelter Balken (Chart.js Bar)        │
│   5 Säulen, gestapelt mit Komponenten                   │
│   Beste Option visuell markiert                         │
├──────────────────────────────────────────────────────────┤
│  (konditional) Vermieter-Bilanz — 5 Blöcke              │
├──────────────────────────────────────────────────────────┤
│  (konditional) WEG-Hinweise — 3 Stub-Inhalte            │
└──────────────────────────────────────────────────────────┘
```

### 4.2 — Headline-Pille-Cluster

Drei Pillen mit den Headline-KPIs pro **bester Option** (algorithmisch ermittelt). Die Pille ist klickbar und öffnet Methodik-Tooltip.

**HTML-Struktur:**

```html
<div class="headline-pillen">
  <div class="pille pille--primary">
    <span class="label">TCO über {Zeitraum} Jahre</span>
    <strong class="wert">340.000 €</strong>
    <span class="badge badge--A">A</span>
    <span class="info-tip" data-tip="formel-tco">ⓘ</span>
  </div>
  <div class="pille">
    <span class="label">Belastung €/m²/Monat</span>
    <strong class="wert">12,30 €</strong>
    <span class="badge badge--B">B</span>
    <span class="info-tip" data-tip="formel-eurqm">ⓘ</span>
  </div>
  <div class="pille">
    <span class="label">Amortisation gegen Status quo</span>
    <strong class="wert">11 Jahre</strong>
    <span class="badge badge--A">A</span>
    <span class="info-tip" data-tip="formel-amortisation">ⓘ</span>
  </div>
</div>
```

**Belegbarkeit:** TCO und Amortisation sind A (Berechnung aus belegten Eingaben), €/m²/Monat ist B (enthält Marktwert-Komponente Energiepreise).

### 4.3 — 25-Jahres-Cashflow-Kurve (Chart.js Line)

**Konfiguration:**

```javascript
{
  type: 'line',
  data: {
    labels: [0, 1, 2, ..., zeitraum],  // x-Achse Jahre
    datasets: [
      { label: 'Status quo Gas',  data: kumCashflow.gas,    borderColor: '#7a7a7a' },
      { label: 'Hybrid',          data: kumCashflow.hybrid, borderColor: '#7ab8b5' },
      { label: 'Wärmepumpe',      data: kumCashflow.wp,     borderColor: '#1a5c5a' },
      { label: 'Fernwärme',       data: kumCashflow.fw,     borderColor: '#CFF77F' },
      { label: 'Pellets',         data: kumCashflow.pellets, borderColor: '#a87a4a',
        borderDash: pelletsPlausibel ? [] : [5, 5] }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: { display: true, text: '25-Jahres-Cashflow kumuliert' },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { title: { display: true, text: 'Jahr' } },
      y: { title: { display: true, text: 'Kumulierter Cashflow (€)' } }
    }
  }
}
```

**Mobile-Anpassung:** auf Mobil legend ausblenden, stattdessen Sprung-Buttons unter der Kurve („Gas / Hybrid / WP / FW / Pellets" — Klick highlightet eine Linie).

### 4.4 — 5er-Vergleich gestapelter Balken (Chart.js Bar)

**Konfiguration:**

```javascript
{
  type: 'bar',
  data: {
    labels: ['Status quo Gas', 'Hybrid', 'WP', 'FW', 'Pellets'],
    datasets: [
      { label: 'Investition', data: [...], backgroundColor: '#1a3535' },
      { label: 'Förderung (−)', data: [...], backgroundColor: '#CFF77F' },  // negativ als Reduktor
      { label: 'Energie (25 J)', data: [...], backgroundColor: '#1a5c5a' },
      { label: 'Wartung (25 J)', data: [...], backgroundColor: '#7ab8b5' },
      { label: 'Reparatur (25 J)', data: [...], backgroundColor: '#7a7a7a' }
    ]
  },
  options: {
    responsive: true,
    scales: { x: { stacked: true }, y: { stacked: true } },
    plugins: {
      title: { display: true, text: 'TCO 25 J nach Komponenten' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${formatEuro(ctx.parsed.y)}`
        }
      }
    }
  }
}
```

**Beste Option markieren:** Säulen-Border in Petrol-Dark, andere ohne Border. JavaScript-seitig setzt der Render dies anhand des Empfehlungs-Outputs.

**Förderung-Visualisierung:** Förderung wird als negativer Wert (Reduktor) dargestellt, sodass die Säule visuell „verkürzt" wird. Alternative: separate Spalte „mit/ohne Förderung" — entscheiden in Implementation.

### 4.5 — Pellets-Filter

**Logik (entspricht Excel `Pellets_Plausibel`):**

```javascript
function pelletsPlausibel(input, params) {
  if (input.lage === 'innenstadt' && input.heizlast > params.block4_plausi.PelletsHeizlastSchwelle) return false;
  if (input.we > params.block4_plausi.PelletsMaxWE) return false;
  if (input.gebaeudetyp === 'MFH' && input.lage === 'innenstadt') return false;  // Erfurter Fernwärmesatzung
  return true;
}
```

**UI-Wirkung:**
- Pellets-Säule grau gerendert (`opacity: 0.4`)
- Pellets-Linie in Cashflow-Kurve gestrichelt (`borderDash: [5, 5]`)
- Pellets-Pille (falls in Headline-Cluster) ausgeblendet
- Tooltip auf Pellets-Säule: „Pellets in dieser Lage nicht plausibel — Erfurter Fernwärmesatzung, Heizlast > 30 kW oder > 6 WE."

### 4.6 — Methodik-Tooltips (Befüllung der C1-Stubs)

Jeder ⓘ-Icon-Klick öffnet einen Methodik-Tooltip mit drei Sektionen:

1. **Formel** (Code-Block, kopiert aus `engine.js`-Kommentar)
2. **Annahmen** (Liste mit konkreten Werten und Quellen-Verweisen)
3. **Quellen** (Q-Kürzel, klickbar zur Quelle)

**Beispiel TCO 25 J:**

```
Formel:
TCO = Investition − Förderung
    + Σ Energiekosten (25 J, mit optionsspezifischer Steigerung)
    + Σ Wartungskosten + Σ Reparaturkosten

Annahmen:
• Wohnfläche 950 m², 14 WE
• Verbrauch 95.000 kWh/a
• JAZ Wärmepumpe: 3,5 (Default)
• Energiepreis-Steigerung pro Jahr:
  Gas 3,5 % • WP-Strom 2,5 % • FW 4,0 % • Pellets 2,5 %
• Lebensdauer 25 J, Abschreibung linear

Quellen:
• Q-BAFA-2026 (Förder-Verordnung Mai 2026)
• Q-BDEW-2026 (Gas/Strom-Preise)
• Q-AGFW-2026 (Fernwärme-Median)
• Q-VDI-2067 (Lebensdauer-Norm)

Tiefer rechnen? → Excel-Edition.
```

**Wiederverwendbare Tooltip-Komponente** (bereits in C1 angelegt) wird in C2 mit Inhalten gefüllt aus einem Lookup `methodik-tooltips.js` (im engine.js oder eigene Datei):

```javascript
const tooltipInhalte = {
  'formel-tco': { formel: '...', annahmen: [...], quellen: [...] },
  'formel-eurqm': { ... },
  'formel-amortisation': { ... },
  'formel-foerderung': { ... },
  'formel-vermieter-cashflow': { ... },
  'formel-vermieter-vermoegen': { ... }
};
```

---

## 5 — Vermieter-Bilanz (konditional, fünf Blöcke)

**Konditional sichtbar bei** `state.nutzungsart !== 'selbstnutzung'`. Container war in C1 als `<details id="vermieter-bilanz" hidden>` angelegt. C2 entfernt `hidden` bei Bedingungs-Erfüllung und befüllt Inhalte.

**Wirksam_VM-Logik:**

```javascript
function wirksamVM(input) {
  if (input.nutzungsart === 'selbstnutzung') return 0;
  if (input.nutzungsart === 'mischnutzung') return 1;  // Vermieter-Posten greifen
  if (input.nutzungsart === 'vollvermietung') return 1;
  return 0;
}
```

### 5.1 — Block 1: Qualitative Vorteile (9 Punkte)

**Inhalt** (statischer Text aus Excel-Tab `Vermieter-Sicht` Block 1, Web-konform formuliert):

> **Was du als Vermieter durch eine Heizungs-Modernisierung gewinnst:**
>
> 1. Mietspiegel-Klassen-Sprung (1 Klasse, ca. 0,30 €/m²/Monat) durch energetische Modernisierung
> 2. Modernisierungs-Umlage nach §559 BGB (8 % der Investition pro Jahr, max. 12 Jahre)
> 3. Wegfall des Risikos durch CO₂-Preis-Verschiebung (CO₂-Verschiebung 2027 ff.)
> 4. Marktwert-Steigerung durch energetische Klasse (DC → DB ca. 8–14 %)
> 5. Schutz vor EPBD-Abschlag (~7 % Marktwert-Reduktion bei nicht-konformen Gebäuden ab 2028)
> 6. KfW-Zinszuschuss zusätzlich zur BAFA-Förderung (ca. 20 % auf Restkredit)
> 7. §7b Sonder-AfA für 4 Jahre (5 %/J) — verbesserte steuerliche Abschreibung
> 8. Vermarktungs-Vorteil bei Neuvermietung (Energiekosten-Argument)
> 9. Risikominderung durch Reduktion der Sanierungs-Schuld vor Übergabe an Erben

**Visualisierung:** Aufzählung mit Petrol-Akzent, jede Zeile 1–2 Zeilen. Keine Berechnung, kein Tooltip.

**Steigerungs-Heuristik:** vollständig im Web. Excel hat dieselben 9 Punkte mit Detail-Quellen. Beratung kann persönliche Gewichtung machen.

### 5.2 — Block 2: Jahres-Cashflow Vermieter (€/a, gemittelt 25 J)

**Tabelle 5 Optionen × 7 Posten** (entspricht Excel-Tab `Vermieter-Sicht` Block 2, Σ-Zeile gemittelt):

| Posten | Status quo Gas | Hybrid | WP | FW | Pellets |
|---|---|---|---|---|---|
| §559 Modernisierungs-Umlage (8 % p.a., 12 J) | 0 € | +X € | +X € | +X € | +X € |
| Mietspiegel-Klassen-Sprung-Übergang | 0 € | +Y € | +Y € | +Y € | +Y € |
| CO₂-Verschiebung (2027 ff., Wirksam_VM) | −Z € | +Z' € | +Z' € | +Z' € | +Z' € |
| Mieterstrom-Erlös (bei PV aktiv) | 0 € | +M € | +M € | 0 € | 0 € |
| Wartungs-Kosten-Differenz vs. Status quo | 0 € | −W € | −W € | −W € | −W € |
| Mietausfall-Quote × MietausfQ | −A € | −A € | −A € | −A € | −A € |
| Bauprozess-Mietminderung (1 J × 10 %) | 0 € | −B € | −B € | −B € | −B € |
| **Σ Cashflow Vermieter (€/a, 25 J)** | **−2.778 €** | **+544 €** | **+2.046 €** | **+859 €** | **+183 €** |

(Beispiel-Werte aus v1.6 Theaterstraße — entsprechen v2.0 MFH-Default näherungsweise. Konkrete Werte rechnet `engine.js` aus parameter.json.)

**Pellets-Filter:** Σ-Zeile-Wert wird durch `Wirksam_VM × Pellets_Plausibel` konditioniert. Bei Pellets nicht plausibel: Σ-Spalte zeigt 0 € + Hinweis-Tooltip.

**Funktions-Signatur in `engine.js`:**

```javascript
function berechneVermieterCashflowProJahr(option, input, params) {
  const wirksam = wirksamVM(input);
  if (option === 'pellets' && !pelletsPlausibel(input, params)) return { posten: {...}, sigma: 0 };

  const mod559 = (input.investition[option] * params.block2_rahmen.BGB559Korr) / params.block2_rahmen.Dauer559;
  const mietspiegel = wirksam * params.block6_vermieter.MietspiegelEff * input.wohnflaeche * 12 * params.block6_vermieter.KlassenSprung;
  const co2 = ...
  // ...

  return {
    posten: { mod559, mietspiegel, co2, mieterstrom, wartung_diff, mietausfall, bauprozess },
    sigma: mod559 + mietspiegel + co2 + mieterstrom - wartung_diff - mietausfall - bauprozess
  };
}
```

**Methodik-Tooltip an §559-Zeile:** „Mietspiegel-Klassen-Sprung im Detail (Klassen DA → DB, Kategorie-spezifisch) findest du in der Excel-Edition. Im Web rechnen wir mit einem typischen Klassen-Sprung von 1."

### 5.3 — Block 3: Vermögensbilanz 25 Jahre (kumuliert)

**Tabelle 5 Optionen × 11 Posten** (entspricht Excel-Tab `Vermieter-Sicht` Block 3, kumulierter 25-J-Saldo):

| Posten | Status quo | Modernisierung |
|---|---|---|
| Brutto-Investition (Investitions-Posten) | 0 € | −Investition € |
| BAFA-Zuschuss | 0 € | +Förder-Betrag € |
| KfW-Zinszuschuss (20 % auf Restkredit) | 0 € | +KfW-Zuschuss € |
| §7b Sonder-AfA (Steuer-Effekt 5 % × 4 J) | 0 € | +AfA-Effekt € |
| Wegfall Ersatzinvest (Heizung am Ende der Lebensdauer) | −Ersatzinvest € | 0 € |
| Modernisierungs-Umlage (Σ §559 über 25 J) | 0 € | +Σ §559 € |
| CO₂-Verschiebung (Σ über 25 J) | −Σ CO₂ € | 0 € |
| Mieterstrom-Erlös (Σ bei PV) | 0 € | +Σ Mieterstrom € |
| Marktwert-Premium (DC → DB) | 0 € | +Premium € |
| EPBD-Risiko (~ 7 % Marktwert-Abschlag) | −EPBD € | 0 € |
| **Σ Vermögens-Saldo 25 J** | **+126.000 €** | **−170.000 € (WP)** ... |

**Vorzeichen-Konvention:** negativ = Belastung, positiv = Vermögensgewinn aus Modernisierung. Status quo Gas ist „belastet" durch EPBD-Risiko und CO₂-Verschiebung — daher zeigt die Σ-Zeile einen positiven Wert (= Vermögensverlust durch Nicht-Modernisierung).

**Erwartete Werte v2.0_neutral MFH-Default:**

| Option | Σ Vermögens-Saldo 25 J |
|---|---|
| Status quo Gas | +126.000 € (Belastung durch EPBD) |
| Hybrid | −198.000 € (Vermögensgewinn aus Modernisierung) |
| WP | −168.000 € |
| FW | −191.000 € |
| Pellets | −204.000 € (aber Pellets_Plausibel = nein) |

**§7b AfA als Hinweis-Box:** unter der Tabelle eine Box im Petrol-Light-Hintergrund:

> **§7b Sonder-AfA — wichtig für Vermieter:**
> Bei energetischer Modernisierung kannst du nach §7b EStG eine Sonder-Abschreibung von 5 % über 4 Jahre nutzen. Wir haben den Effekt im Saldo überschlägig berücksichtigt (5 % × 4 J × Investition × dein Steuersatz).
>
> **Detail-Berechnung mit deinem persönlichen Steuersatz, deiner AfA-Methodik und der Wechselwirkung mit der Modernisierungs-Umlage findest du in der Excel-Edition.**
>
> Wichtig: Wir sind keine Steuerberater. Bevor du auf §7b setzt, frag deinen Steuerberater.

### 5.4 — Block 4: Risiko-Übersicht (qualitativ, 9 Aspekte)

**Tabelle Risiko-Aspekt × Status quo / Modernisierung mit Ampeln:**

| Risiko-Aspekt | Status quo Gas | Modernisierung |
|---|---|---|
| CO₂-Preis-Eskalation 2027 ff. | 🔴 | 🟢 |
| EPBD-Konformitäts-Risiko 2028 | 🔴 | 🟢 |
| Mietspiegel-Argumentations-Lücke | 🟡 | 🟢 |
| Mieter-Akzeptanz Mieterhöhung | 🟢 | 🟡 |
| Förder-Streichung (politisches Risiko) | 🟢 | 🟡 |
| Bauprozess-Risiko (1 J Mietminderung) | 🟢 | 🟡 |
| Technologie-Risiko Wärmepumpe (JAZ-Realität) | 🟢 | 🟡 |
| Energiepreis-Volatilität (Status quo Gas) | 🔴 | 🟢 |
| Vermarktungs-Risiko Mietausfall | 🟡 | 🟢 |

**Ampel-Logik:** statisch aus Excel-Tab `Vermieter-Sicht` Block 4 übernommen. Im Web ohne Berechnung.

### 5.5 — Block 5: Risiko-Sensitivität quantifiziert (6 Szenarien)

**Tabelle Szenario × €-Effekt 25 J Vermögensbilanz:**

| Szenario | Effekt 25 J |
|---|---|
| BAFA-Förderung wird komplett gestrichen (statt 50 %) | +X € (Belastung WP) |
| CO₂-Preis steigt schneller als angenommen (5 €/t/J statt 3) | −Y € (Belastung Status quo) |
| Energiepreis-Steigerung Gas +5 Pp p.a. | −Z € (Belastung Status quo) |
| EPBD-Abschlag 10 % statt 7 % | −A € (Belastung Status quo) |
| §559-Mieterhöhung scheitert an Härtefall | +B € (Belastung WP) |
| Mietspiegel-Effekt nur 0,15 €/m² statt 0,30 € | +C € (Belastung WP) |

**Berechnung:** für jedes Szenario ändert `engine.js` die entsprechende Variable und berechnet die Vermögensbilanz neu. Differenz zur Default-Bilanz = €-Effekt.

**Funktions-Signatur:**

```javascript
function berechneSensitivitaet(szenario, input, params) {
  const inputVar = anwendenSzenario(szenario, input);
  const bilanzNeu = berechneVermoegensbilanz(inputVar, params);
  const bilanzDefault = berechneVermoegensbilanz(input, params);
  return bilanzNeu - bilanzDefault;
}
```

**Steigerungs-Heuristik:** im Web nur diese 6 vorgegebenen Szenarien. In Excel kann der Nutzer beliebige Sensitivitäten frei rechnen.

---

## 6 — Erweiterter Modus — vier funktionale Hebel

**Aktivierung:** Toggle „Profi-Modus" auf der Ergebnis-Seite (war in C1 angelegt). Aktivierung blendet vier zusätzliche Pills im Mini-Cockpit ein.

**Steigerungs-Heuristik:** vier Hebel — bewusst nicht mehr. Wer mehr will, geht zur Excel.

### 6.1 — Eigener Energiepreis (`EigenerPreisAktuell`)

**Pill im Mini-Cockpit (nur Profi-Modus):**

```
[Eigener Gas-Preis: 11,2 ct/kWh]
```

**Pill-Klick öffnet Inline-Editor:**

```
Aktueller Bezugspreis Gas (ct/kWh):
┌─────────────┐
│ 11,2        │
└─────────────┘
Marktdurchschnitt Mai 2026: 10,5 ct/kWh
Differenz: +6,7 % über Markt
[Übernehmen] [Zurück auf Markt]
```

**Wirkung:** Status-quo-Cashflow nutzt den eigenen Preis statt des Markt-Preises. Vergleichszeile in Headline-Antwort: „Du zahlst 11,2 ct/kWh — Marktdurchschnitt 10,5 ct/kWh — Differenz +6,7 %."

**State-Schlüssel:** `state.overrides.eigenerPreis = { gas: 11.2, fw: null, wp: null, ... }`. Default: `null` (= Markt).

**Excel-Bezug:** Defined Name `EigenerPreisAktuell` → Eingaben Z37.

### 6.2 — JAZ-Override

**Pill im Mini-Cockpit (nur Profi-Modus):**

```
[JAZ Wärmepumpe: 3,2]
```

**Pill-Klick öffnet Slider:**

```
JAZ Wärmepumpe (Jahresarbeitszahl):
Slider 2,0 — 5,0, Schrittweite 0,1, Default 3,5
[Übernehmen] [Zurück auf Default]
```

**Wirkung:** WP- und Hybrid-Cashflow-Pfade nutzen den eigenen JAZ-Wert. Wirkung ist groß — JAZ ist die zentrale WP-Effizienz-Variable.

**State-Schlüssel:** `state.overrides.jaz` (default null = Excel-Default 3,5).

**Excel-Bezug:** Defined Name `JAZ` → Parameter Block 3.

**Hinweis-Tooltip an der Pill:**

> JAZ ist die zentrale Effizienz-Kennzahl der Wärmepumpe. Eine real gemessene JAZ liegt oft unter dem Hersteller-Wert. Hol dir den Wert aus dem Datenblatt und ziehe einen Sicherheits-Abschlag von 0,3 ab — oder vertraue dem Default 3,5.

### 6.3 — CO₂-Pfad (drei Szenarien)

**Pill im Mini-Cockpit (nur Profi-Modus):**

```
[CO₂-Pfad: Politik aktuell]
```

**Pill-Klick öffnet Auswahl:**

```
CO₂-Preis-Pfad (€/tCO₂ über 25 J):
( ) Politik aktuell — Steigerung 3 €/t/J
( ) Beschleunigung — Steigerung 5 €/t/J (Klimaziel-konform)
( ) Stagnation — Steigerung 1 €/t/J (politische Verzögerung)
[Übernehmen]
```

**Wirkung:** ändert den CO₂-Verschiebungs-Posten in Vermieter-Bilanz Block 2 + 3 + 5 (Sensitivität).

**State-Schlüssel:** `state.overrides.co2Pfad ∈ { 'aktuell', 'beschleunigung', 'stagnation' }`. Default: `'aktuell'`.

### 6.4 — Verkehrswert-Override

**Pill im Mini-Cockpit (nur Profi-Modus):**

```
[Verkehrswert: 1,8 Mio €]
```

**Pill-Klick öffnet Inline-Editor:**

```
Verkehrswert deines Gebäudes (€):
┌──────────────────┐
│ 1.800.000        │
└──────────────────┘
Default-Annahme MFH 14 WE Innenstadt: 1,8 Mio €
[Übernehmen] [Zurück auf Default]
```

**Wirkung:** ändert die Berechnung des EPBD-Risikos und des Marktwert-Premiums in Vermieter-Bilanz Block 3.

**State-Schlüssel:** `state.overrides.verkehrswert` (default null = Block-5-Default je Gebäudetyp).

**Excel-Bezug:** Defined Name `Verkehrswert` → Parameter Block 6.

---

## 7 — Schieberegler-Wirkung in Panel 1 (live)

Die drei Schieberegler-Blöcke aus C1 bekommen in C2 Wirkung.

### 7.1 — Block A: Zeitraum (1 Slider)

**Wirkung:**
- TCO-Berechnung mit neuem T (5/10/15/20/25 Jahre)
- Cashflow-Kurve x-Achse passt sich an
- Amortisations-Berechnung läuft bis neuem T
- €/m²/Monat skaliert sich entsprechend
- Vermieter-Bilanz wird auf neuen Zeitraum umgerechnet

**Re-Render-Trigger:** `state.zeitraum` ändert sich → `engine.js` rechnet alle KPIs neu, `ergebnis.js` aktualisiert UI und Charts.

### 7.2 — Block B: Energiepreise (3 Slider)

**Wirkung:**
- Gas-Preis-Slider → Status-quo-Cashflow + Hybrid-Cashflow neu
- FW-Preis-Slider → Fernwärme-Cashflow neu
- WP-Strom-Preis-Slider → WP-Cashflow + Hybrid-Cashflow neu

**Wichtig:** der Slider-Wert ist der **aktuelle** Preis. Die Steigerung über die 25 Jahre folgt weiterhin der `Steig*`-Variable aus parameter.json.

**State-Schlüssel:** `state.overrides.preis = { gas, fw, wp }`.

### 7.3 — Block C: Förderung (4 Toggles + Master + 3 Presets)

**Wirkung:**
- Toggle-Kombi → Master-Slider zeigt aggregierte Quote
- Master-Slider kann manuell überschrieben werden (überschreibt Toggle-Aggregation)
- 3 Preset-Buttons setzen alle Toggles auf vordefinierten Stand:
  - „Heute (Mai 2026)" → Grund + Klima ON, Einkommen + Effizienz OFF, Master = 50 %
  - „Klimabonus 2029 −3 Pp" → Grund + Klima(17%) ON, Master = 47 %
  - „Förderung komplett gestrichen" → alle OFF, Master = 0 %

**Cap-Anzeige unter dem Master:** „Cap 70 % oder 21.000 € (was zuerst greift)."

**Hinweis-Box unter dem Förder-Block:**

> Detaillierter Sinkpfad nach Maßnahmen-Art und KfW-Ergänzungskredit-Modell findest du in der Excel-Edition.

**State-Schlüssel:** `state.overrides.foerderung = { grund: bool, klima: bool, einkommen: bool, effizienz: bool, master: number, capWirksam: bool }`.

---

## 8 — Persona-Wirkung in Panel 1

**Wirkung in C2 — nur Empfehlungs-Berechnung, nicht KPI-Werte:**

KPI-Rohwerte (TCO, €/m²/Monat, Amortisation) bleiben gleich, unabhängig von der Persona.

Die **Empfehlung** im Banner unter dem Big Picture und die **Headline-Antwort** über dem Cockpit ändern sich, weil die Persona-Gewichtung den Score pro Option beeinflusst (siehe §3.6).

**Wechsel-Wirkung:**
- Bewahrer wählt → langfristige TCO dominiert → Empfehlung tendenziell WP/FW
- Optimierer wählt → ausgewogene Wirtschaftlichkeit → Empfehlung tendenziell Hybrid/WP
- Wechsler wählt → Cashflow Jahr 1 + Förderung dominieren → Empfehlung tendenziell mit hoher Förder-Quote (WP, Hybrid)

**Keine Wirkung in C2:** Panel 2 Radar (folgt in C3), Panel 3 FRI (folgt in C4) — beide haben eigene Gewichtungs-Matrizen mit allen 5 bzw. 6 Achsen.

---

## 9 — Methodik-Tooltips (Befüllung)

In C1 als Komponente angelegt mit Platzhalter-Inhalten. C2 befüllt jeden Tooltip mit:

1. Formel (Code-Block, ~3–5 Zeilen)
2. Annahmen (3–6 konkrete Werte mit Quellen-Verweis)
3. Quellen (Q-Kürzel, klickbar)
4. Steigerungs-Verweis: „Tiefer rechnen? → Excel-Edition"

**Tooltip-Inhalte für alle KPIs:**

| Tooltip-ID | KPI | Datei |
|---|---|---|
| `formel-tco` | TCO 25 J | `methodik-tooltips.js` |
| `formel-eurqm` | €/m²/Monat | gleich |
| `formel-amortisation` | Amortisation | gleich |
| `formel-foerderung` | Förder-Quote | gleich |
| `formel-cashflow` | Cashflow-Kurve | gleich |
| `formel-vermieter-cashflow` | Vermieter Block 2 | gleich |
| `formel-vermieter-vermoegen` | Vermieter Block 3 | gleich |
| `formel-mietspiegel` | §559 Mietspiegel | gleich |
| `formel-co2` | CO₂-Verschiebung | gleich |
| `formel-eigener-preis` | Override Energiepreis | gleich |
| `formel-jaz` | JAZ-Override | gleich |

---

## 10 — Konditionale Logik in Panel 1

**Pellets-Filter** — bereits in §4.5 dokumentiert. Pellets-Säule grau + Linie gestrichelt + Tooltip.

**FW-Satzung-Konsequenz** — bei PLZ Erfurt-Altstadt + MFH:
- Der FW-Satzungs-Hinweis bleibt in Wizard-Schritt 1 sichtbar (C1)
- Im Empfehlungs-Banner kommt ein zusätzlicher Satz: „In deiner Lage besteht Anschlusszwang an die Erfurter Fernwärme. Hybrid und Pellets sind ausgeschlossen, Befreiungswege nach §6 Satzung 3.008 möglich."
- Hybrid-Säule ggf. grau gerendert (analog Pellets-Filter), wenn Lage = Innenstadt

**Vermieter-Bilanz-Konditional** — siehe §5.

**WEG-Hinweise-Konditional** — siehe §11.

---

## 11 — WEG-Hinweise (Stub-Inhalt für C2)

**Konditional sichtbar bei** `state.eigentuemerTyp === 'WEG'`. Container war in C1 als `<details id="weg-hinweise" hidden>` angelegt.

**C2-Inhalt: drei Standard-Antworten** (Stub, Vollausarbeitung in Beratung):

```html
<details id="weg-hinweise">
  <summary>Hinweise für die Eigentümerversammlung</summary>

  <h4>Was muss beschlossen werden?</h4>
  <p>Bei einer Heizungs-Erneuerung in einer WEG sind drei Beschlüsse zu fassen:</p>
  <ol>
    <li><strong>Modernisierungs-Maßnahme</strong> — Auswahl der Heizungs-Option</li>
    <li><strong>Investitions-Volumen</strong> — Zustimmung zur Finanzierung (Sonderumlage oder Kreditaufnahme über die WEG)</li>
    <li><strong>Auftrags-Vergabe</strong> — Auswahl des Heizungsbauers / Versorgers</li>
  </ol>

  <h4>Welche Mehrheit?</h4>
  <p>Nach WEG-Reform 2020 (§ 19 ff. WEG):</p>
  <ul>
    <li>Modernisierende Erhaltungsmaßnahmen: einfache Mehrheit</li>
    <li>Modernisierungen i. S. v. § 22 WEG (z. B. Heizungs-Erneuerung): einfache Mehrheit, aber Kostenverteilung kann mit doppelt qualifizierter Mehrheit geändert werden</li>
    <li>Bauliche Veränderungen mit „grundlegender Umgestaltung": doppelt qualifizierte Mehrheit (drei Viertel der Eigentümer + mehr als die Hälfte der Miteigentumsanteile)</li>
  </ul>

  <h4>Welche Frist?</h4>
  <p>Die Einberufungs-Frist beträgt mindestens 3 Wochen. Bei Modernisierungs-Beschlüssen empfehlen wir 6 Wochen, um den Eigentümern Zeit zur Vorbereitung zu geben.</p>

  <div class="hinweis-box">
    <p><strong>Du planst eine Eigentümerversammlung zur Heizungs-Modernisierung?</strong></p>
    <p>Wir bieten persönliche Begleitung — Beschluss-Vorlage, Diskussions-Material, Versammlungs-Begleitung. <a href="mailto:dialog@hausentscheider.de?subject=WEG-Beratung%20Heizung">Schreib uns an dialog@hausentscheider.de</a>.</p>
    <p>Die volle Beschluss-Vorlagen-Logik mit Mehrheits-Lookup nach Maßnahmen-Art findest du in der <a href="/excel-edition.html">Excel-Edition</a>.</p>
  </div>
</details>
```

**Steigerungs-Heuristik:** das Web liefert die drei Standard-Antworten als Orientierung. Die Beschluss-Vorlage selbst ist explizit Beratungs-Output, weil sie individuelles Urteilsvermögen erfordert (welche Klausel, welche Beschluss-Variante, welche Argumentation gegenüber welchen Eigentümern).

---

## 12 — Chart.js-Konfiguration (Detail)

**CDN-Einbindung in `rechner.html`:**

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

**Farbsystem für Chart.js:**

```javascript
const chartFarben = {
  gas:     '#7a7a7a',  // Stone-Gray
  hybrid:  '#7ab8b5',  // Petrol-Light
  wp:      '#1a5c5a',  // Petrol
  fw:      '#CFF77F',  // Signal-Gelb
  pellets: '#a87a4a',  // Brown
  oel:     '#4a4a4a',  // Dark-Gray
  components: {
    investition: '#1a3535',
    foerderung:  '#CFF77F',
    energie:     '#1a5c5a',
    wartung:     '#7ab8b5',
    reparatur:   '#7a7a7a'
  }
};
```

**Performance-Optimierung:**

- Chart-Instanzen werden beim ersten Render erzeugt und in einer Map gehalten:
  ```javascript
  const charts = new Map();
  charts.set('cashflow', new Chart(ctx, config));
  ```
- Bei State-Änderung wird das Chart-Update genutzt:
  ```javascript
  charts.get('cashflow').data.datasets[0].data = neueDaten;
  charts.get('cashflow').update('none');  // 'none' deaktiviert Animation für schnellere Re-Renders
  ```
- Re-Render-Ziel: < 100 ms

**Mobile-Responsiveness:**

- `responsive: true` in Chart-Options
- Min-Höhe Container 250 px
- Legend auf Mobil ausblenden, Sprung-Buttons unter dem Chart als Alternative

**Keine localStorage-Verwendung:** alle State-Daten liegen im Memory (window-Object), Chart.js erzeugt keine eigenen Persistenz-Mechanismen.

---

## 13 — State-Schema `engine.js`

**State-Objekt nach Wizard-Abschluss + Schieberegler-Setup:**

```javascript
const state = {
  // Wizard-Eingaben
  plz: '99084',
  ort: 'Erfurt',
  gebaeudetyp: 'MFH',           // 'EFH' | 'MFH'
  eigentuemerTyp: 'WEG',         // 'einzelvermieter' | 'WEG' | 'selbstnutzer'
  wohnflaeche: 950,
  we: 14,
  heizung: 'gas-bw',             // 'gas-bw' | 'gas-nt' | 'oel' | 'fw' | 'wp' | 'sonstige'
  heizungBaujahr: 1998,
  verbrauch: 95000,
  sanierung: 'teilsaniert',      // 'unsaniert' | 'teilsaniert' | 'saniert'
  nutzungsart: 'mischnutzung',   // 'selbstnutzung' | 'mischnutzung' | 'vollvermietung'
  persona: 'optimierer',         // 'bewahrer' | 'optimierer' | 'wechsler'
  pv: true,
  lage: 'innenstadt',            // abgeleitet aus PLZ

  // Schieberegler-Stand
  zeitraum: 25,
  preis: { gas: 10.5, fw: 17.5, wp: 26.0 },
  foerderung: {
    grund: true,
    klima: true,
    einkommen: false,
    effizienz: false,
    master: 50,
    capWirksam: false
  },

  // Erweiterter-Modus-Overrides
  profimodus: false,
  overrides: {
    eigenerPreis: { gas: null, fw: null, wp: null, pellets: null, oel: null },
    jaz: null,
    co2Pfad: 'aktuell',          // 'aktuell' | 'beschleunigung' | 'stagnation'
    verkehrswert: null
  },

  // Abgeleitete Werte (von engine berechnet)
  computed: {
    heizlast: 76,                // aus Wohnfläche × HeizlastFaktor[Sanierung]
    pelletsPlausibel: false,     // aus Lage + Heizlast
    wirksamVM: 1                 // aus Nutzungsart
  }
};
```

**Funktions-Schema in `engine.js`:**

```javascript
// Reine Funktionen, keine DOM-Manipulation, keine Side-Effects

// Berechnungen
function berechneTCO(option, state, params) → { tco, komponenten }
function berechneTCOAlleOptionen(state, params) → { gas, hybrid, wp, fw, pellets }
function berechneEurProQmMonat(tco, wohnflaeche, zeitraum) → number
function berechneAmortisation(option, state, params) → number | null
function berechneCashflowKurve(option, state, params) → { jaehrlich, kumuliert }
function berechneCashflowAlleOptionen(state, params) → { gas, hybrid, wp, fw, pellets }
function berechneFoerderQuote(state, params) → { quote, capped, sinkpfadAktiv }
function berechneFoerderBetrag(option, state, params) → number
function berechneInvestition(option, state, params) → number
function berechneVerbrauchEffektiv(option, state, params) → number

// Vermieter-Bilanz
function berechneVermieterCashflowProJahr(option, state, params) → { posten, sigma }
function berechneVermoegensbilanz(option, state, params) → { posten, sigma }
function berechneRisikoUebersicht(state) → 9 Aspekte mit Ampel-Status
function berechneSensitivitaet(szenario, state, params) → number

// Empfehlung
function berechneEmpfehlung(state, params) → { beste, sortiert, abstandKlassen, banner-text }

// Plausibilität
function pelletsPlausibel(state, params) → boolean
function wirksamVM(state) → 0 | 1
function fwSatzungAktiv(state, params) → boolean
function altstadtPLZ(plz, params) → boolean

// Helper
function formatEuro(n) → string ('340.000 €')
function formatProzent(n) → string ('70 %')
function formatJahre(n) → string ('11 Jahre' | 'nicht erreicht in 25 J')
```

**Funktions-Schema in `ergebnis.js`:**

```javascript
// DOM-Manipulation, Chart-Updates, Re-Rendering
import * as engine from './engine.js';

function renderHeadlineKPIs(state, params)         // schreibt in #panel-1 .headline-pillen
function renderCashflowKurve(state, params)        // erzeugt/updated Chart 'cashflow'
function renderTCOVergleich(state, params)         // erzeugt/updated Chart 'tco-vergleich'
function renderVermieterBilanz(state, params)      // schreibt in #vermieter-bilanz
function renderWEGHinweise(state, params)          // schreibt in #weg-hinweise
function renderEmpfehlungsBanner(state, params)    // schreibt in #big-picture .empfehlungs-banner
function renderHeadlineAntwort(state, params)      // schreibt in .headline-antwort
function renderMethodikTooltips(state, params)     // befüllt alle Tooltip-Inhalte
function renderProfiPills(state, params)           // blendet/aktualisiert Profi-Pills

function aktualisiereAllePanels(state, params)     // ruft alle Renderer auf

// Event-Handlers
function bindeSchiebereglerHandlers(state, params)
function bindePersonaPickerHandlers(state, params)
function bindeProfiModusHandler(state, params)
function bindePillEditors(state, params)
```

---

## 14 — Datei-Struktur nach C2

```
hausentscheider/
├── index.html                    (existiert, unverändert)
├── rechner.html                  (überschrieben — Chart.js + engine.js + ergebnis.js eingebunden)
├── objekte/index.html            (existiert, unverändert in C2)
├── preishistorie.html            (existiert, unverändert in C2)
├── js/
│   ├── engine.js                 (NEU — alle Berechnungen, reine Funktionen)
│   └── ergebnis.js               (NEU — Chart.js, DOM, Re-Rendering)
├── daten/
│   ├── parameter.json            (existiert produktiv, unverändert in C2)
│   └── preishistorie.json        (existiert produktiv, unverändert in C2)
├── docs/
│   ├── C1_BlockSpec_v3.md        (existiert)
│   └── C2_BlockSpec_v1.md        (NEU — Snapshot dieser Spec im Repo)
├── build_json.py                 (existiert, committet)
└── …
```

**Hinweis:** `js/engine.js` und `js/ergebnis.js` sind native ES-Module (`<script type="module">`). Kein Bundler, kein Webpack, kein Tooling. Funktioniert direkt in modernen Browsern, Netlify deployt unverändert.

**Spec-Snapshot ins Repo:** beim Commit der Implementation legt Claude Code eine Kopie der Spec als `docs/C2_BlockSpec_v1.md` ab — analog zur C1-Konvention.

---

## 15 — Was NICHT in C2

- **Panel 2 Entscheidungs-Radar** → C3
- **Panel 3 Future Readiness Index** → C4
- **Big Picture Netzdiagramm SVG** → C4 (in C2 nur das Empfehlungs-Banner darunter)
- **Persona-Gewichtungs-Matrix für Radar/FRI** → C3/C4
- **PNG-Download** für Diagramme → C5
- **WEG-Hinweise Vollausarbeitung** (Beschluss-Vorlagen, Mehrheits-Lookup nach Maßnahmen-Art) → Beratung
- **§7b Sonder-AfA Detail-Berechnung** → Excel-Edition + Steuerberater
- **Mietspiegel-Klassen-Sprung-Lookup-Tabelle** → Excel-Edition
- **KfW-Kombi-Modell** → Excel-Edition
- **Freie Sensitivitäts-Analyse** (beliebige Variablen, beliebige Pfade) → Excel-Edition
- **Jährliche Cashflow-Tabelle** (25 Zeilen × 5 Optionen als Tabelle) → Excel-Edition (Web zeigt nur Kurve)
- **IRR-Berechnung** → Excel-Edition (Steigerungs-Heuristik, vom User explizit ausgeschlossen)
- **Profil-Seiten-Anbindung** (objekte/index.html) → späterer Sync-Block
- **Mini-Rechner auf Startseite** auf neue Engine umstellen → späterer Block
- **Methodik-Seite** (`methodik.html`) → mittelfristig, evtl. C4 oder eigener Block
- **Excel-Edition-Verkaufsseite** → eigener Block G

---

## 16 — Prompt für die Claude-Code-Sitzung

```
Bitte implementiere Block C2 v1 der Web-Implementation „Der Entscheider".
Spec: 00_Projektsteuerung/260503_C2_BlockSpec.md (vollständig lesen, v1).

Datengrundlage:
- daten/parameter.json (existiert produktiv im Repo, 154 Defined Names,
  Stand Mai 2026 — wird NUR konsumiert, nicht verändert)
- daten/preishistorie.json (existiert produktiv im Repo, Mai 2026)
- Bestehende rechner.html (C1 v3 live) als Ausgangspunkt — Stubs werden
  durch echte Inhalte ersetzt

Ergebnis dieser Sitzung:

1. js/engine.js (NEU) — alle Berechnungen als reine Funktionen ohne DOM-Bezug:
   - berechneTCO, berechneTCOAlleOptionen, berechneCashflowKurve,
     berechneAmortisation, berechneEurProQmMonat, berechneFoerderQuote,
     berechneFoerderBetrag, berechneInvestition, berechneVerbrauchEffektiv
   - berechneVermieterCashflowProJahr, berechneVermoegensbilanz,
     berechneRisikoUebersicht, berechneSensitivitaet
   - berechneEmpfehlung
   - pelletsPlausibel, wirksamVM, fwSatzungAktiv, altstadtPLZ
   - Helper: formatEuro, formatProzent, formatJahre
   - Verifikations-Werte gegen Excel v2.0_neutral MFH-Default als
     Test-Konstanten am Ende der Datei (Spec §3.7 — TCO 25 J ~404k Gas /
     ~340k WP / ~395k FW, Cashflow WP Jahr 1 ~2.230 € / Jahr 25 ~5.935 €,
     Toleranz ± 2 %)

2. js/ergebnis.js (NEU) — Chart.js + DOM + Re-Rendering:
   - renderHeadlineKPIs, renderCashflowKurve, renderTCOVergleich,
     renderVermieterBilanz, renderWEGHinweise, renderEmpfehlungsBanner,
     renderHeadlineAntwort, renderMethodikTooltips, renderProfiPills
   - bindeSchiebereglerHandlers, bindePersonaPickerHandlers,
     bindeProfiModusHandler, bindePillEditors
   - Chart.js 4.4 via CDN, Performance-Optimierung mit Chart.update('none')

3. rechner.html — Anpassungen:
   - Chart.js-CDN eingebunden
   - js/engine.js und js/ergebnis.js als Module geladen
   - Stub-Texte in Panel 1 entfernt
   - Container für Headline-Pillen, Cashflow-Kurve, TCO-Vergleich, Vermieter-
     Bilanz (5 Blöcke), WEG-Hinweise, Profi-Pills, Empfehlungs-Banner sind
     aufgenommen
   - Stil-Konsistenz zu C1 v3 gewahrt

4. docs/C2_BlockSpec_v1.md (NEU) — Snapshot der Spec ins Repo

Akzeptanz-Kriterien siehe Spec Abschnitt 2 — alle 30 Punkte müssen
erfüllt sein. Insbesondere:
- TCO-Verifikations-Werte gegen Excel ± 2 % (Spec §3.7)
- Schieberegler wirken live auf Panel 1 (Re-Render < 100 ms)
- Vermieter-Bilanz sichtbar bei Nutzungsart ≠ Selbstnutzung, alle 5 Blöcke
  befüllt
- WEG-Hinweise sichtbar bei Eigentümer-Typ „WEG", drei Stub-Inhalte
- Erweiterter Modus aktiviert vier Pills, Pill-Klicks öffnen Inline-Editor
- Methodik-Tooltips an jedem KPI mit echten Formeln + Quellen
- Pellets-Filter funktional (graue Säule + gestrichelte Linie + Tooltip)
- Empfehlungs-Banner unter Big Picture algorithmisch befüllt
- Headline-Antwort über dem Cockpit befüllt

Steigerungs-Heuristik beachten (Spec §0.5):
- Web liefert Mittelwerte und Standardfälle, nicht Jahres-Detail
- §7b AfA, KfW-Kombi, Mietspiegel-Klassen-Lookup nur als Hinweis-Box
- Vermieter-Bilanz Block 2/3 nur als 25-J-Mittelwerte/Saldo, keine
  Jahrestabelle
- WEG-Hinweise nur als Stub mit drei Standard-Antworten + Beratungs-CTA
- IRR explizit NICHT im Web (zu komplex, Excel-Steigerung)

Wichtig:
- Defined-Name-Schlüssel in JSON sind 1:1 aus Excel — bei Abweichung
  zwischen Spec und parameter.json: Spec hat Vorrang, parameter.json
  korrigieren ist Folgeaufgabe
- Cashflow-Methodik kumulativ + optionsspezifisch (Spec §3.1 — Bug-Fix
  vom 01.05.2026: jede Option nutzt eigene Steigerungs-Variable)
- §559 BGB 8 % (gesetzlich seit 2019), KEINE 6 %
- Pellets-Filter: bei Innenstadt + Heizlast > 30 kW oder > 6 WE oder MFH
  Innenstadt
- Eigene Energiepreise-Override durch State, nicht durch Mutieren von
  parameter.json
- Reine Funktionen in engine.js: keine DOM-Manipulation, keine globalen
  Variablen-Schreibvorgänge — testbar via console.assert
- Re-Render-Performance < 100 ms pro Schieberegler-Move

Bitte zuerst Plan vorlegen (Regel 7 der CLAUDE.md im Repo-Root),
warten auf OK, dann umsetzen.
```

---

## 17 — Erwarteter Ablauf der Sitzung

1. Daniel öffnet Claude Code, kopiert den Prompt aus §16.
2. Claude Code legt Plan vor (Datei-Struktur, Funktions-Hierarchie, Chart.js-Anbindung, Re-Render-Strategie, Verifikations-Strategie gegen Excel).
3. Daniel prüft Plan im Vier-Augen-Prinzip mit Daniel + Cowork-Claude.
4. Nach OK: Claude Code setzt um.
5. Daniel öffnet `rechner.html` lokal, prüft die 30 Akzeptanz-Kriterien — vor allem:
   - TCO-Verifikations-Werte gegen Excel (im Browser-Console: `engine.berechneTCOAlleOptionen(testStateMFH, params)` und Vergleich gegen Excel-Werte)
   - Schieberegler-Wirkung in allen drei Blöcken
   - Vermieter-Bilanz-Konditional (Wechsel Selbstnutzung ↔ Mischnutzung im Wizard)
   - Erweiterter-Modus-Hebel funktional
   - Methodik-Tooltips öffnen und Inhalte stimmig
6. Iteration falls nötig (UX-Schliff-Schleifen wie bei C1, ggf. 2–3 Schleifen).
7. Commit + Push durch Daniel über GitHub Desktop.
8. Live-Check auf hausentscheider.de.
9. Tagesabschluss: Stand.md, Memory, ggf. Workflow-Versionsstring.

**Geschätzter Aufwand Daniel:** 5–6 h inkl. Plan-Prüfung, Implementation-Iteration, Browser-Tests gegen Excel, Mobile-Check, Verifikation.

**Erwartete UX-Schliff-Schleifen (analog C1):**
- Schleife 1: Initial-Implementation, erste Verifikation gegen Excel
- Schleife 2: UX-Refinement nach erstem Browser-Test (Tooltip-Wording, Pille-Layout, Chart-Achsen)
- Schleife 3: Performance + Mobile-Check
- Optional Schleife 4: Feinschliff Empfehlungs-Banner-Wording, Persona-Wirkung-Plausibilität

---

## 18 — Folgeaufgaben nach C2

**Vor C3 (Panel 2 Radar) zu klären:**

- Belegbarkeits-Felder in parameter.json vollständig pflegen (aktuell teilweise mit Fallback „C") — Excel-Tab `Quellen` als Quelle, build_json.py-Folgeaufgabe (siehe Memory `project_build_json_folgeaufgaben.md`)
- AltstadtPLZ-Tabelle aus C1-JS-Hardcode in parameter.json zurückführen (Memory `project_build_json_folgeaufgaben.md`)
- Block 8 Heizlast-Hilfsregel aus C1-JS-Hardcode in parameter.json zurückführen (Memory `project_build_json_folgeaufgaben.md`)
- foerderung_mai_2026-Sektion vollständig im JSON (statt JS-Hardcode) — Memory dito

**Nicht-blockierend, aber für Tagesabschluss vermerken:**

- C1-Spec v3 §13 (Pressetext-Block) ist nach UX-Schleife 2 nicht mehr live (durch „Tiefer rechnen"-Sektion ersetzt). Spec auf v3.1 patchen oder als „durch UX-Schleife 2 ersetzt" markieren.
- Methodik-Seite (`methodik.html`) als Landing für Quellen-Liste vorbereiten — wird ab C3 attraktiver, weil Belegbarkeits-Badges auf eine Methodik-Seite verlinken sollen.

---

## 19 — Versions-History

| Version | Datum | Änderung |
|---|---|---|
| v1.0 | 03.05.2026 | Initial — folgt auf C1 v3, deckt Wirtschaftlichkeits-Panel + Vermieter-Bilanz + Erweiterter Modus + Methodik-Tooltips ab. Steigerungs-Heuristik Web/Excel/Beratung als §0.5 verankert. 30 Akzeptanz-Kriterien. Verifikations-Werte gegen Excel v2.0_neutral MFH-Default. Aufteilung in js/engine.js + js/ergebnis.js. |

---

**Spec-Ende.** Schreibvorgang am 03.05.2026. Pfad: `00_Projektsteuerung/260503_C2_BlockSpec.md`.
