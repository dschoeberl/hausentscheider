# Block C1 — Spec v3: Wizard + Ergebnis-Seite „Der Entscheider"

**Stand:** 2. Mai 2026 (v3 — überschreibt v2)
**Datengrundlage:** `02_Finalisierung_Pruefung_Benchmark/Der_Entscheider_Testsystem_v2.0_neutral.xlsx` (22 Tabs, 154 Defined Names — Mai-Update mit Heizlast-Hilfsregel und eigenem Bezugspreis)
**Architektur:** Modell Z (Wizard + Ergebnis-Seite), Reduktions-Linie, vier-Schichten-Pattern, zentrale Datenarchitektur Excel → JSON → Web (Datenbrücke produktiv seit 02.05.2026)
**Ziel der Sitzung:** `rechner.html` aufsetzen mit Hero, dreischrittigem Wizard (9 Pflichtfelder), Ergebnis-Seite-Skelett mit Annahmen-Transparenz-Box, Mini-Cockpit, drei Panel-Platzhaltern, drei Schieberegler-Blöcken, Big Picture, Pressetext-Block, Wegweiser, Footer. Plus konditionale Verzweigungen funktional. JSON-Anbindung an `daten/parameter.json` + `daten/preishistorie.json`. Keine Berechnung in C1, keine Visualisierung in den Panels.

---

## 0. Was sich gegenüber v2 geändert hat

**Strukturelle Erweiterungen (Vier-Schichten-Pattern aus Rechnerkonzept v1.0):**

```
┌─────────────────────────────────────────────────────┐
│  SCHICHT 1 — Pflicht-Wizard (9 Felder, 3 Schritte) │
│    → Aha-Moment garantiert, auch ohne Detail        │
├─────────────────────────────────────────────────────┤
│  SCHICHT 2 — „Ich-weiß-das-nicht"-Hilfen           │
│    → Smart Defaults im Feld (Heizlast-Hilfsregel)   │
├─────────────────────────────────────────────────────┤
│  SCHICHT 3 — Detail-Aufklappung (Ergebnis-Seite)   │
│    → Override-Felder für Power-User                 │
├─────────────────────────────────────────────────────┤
│  SCHICHT 4 — Erläuterungen + Dialog-Mail           │
│    → PV-Tiefe, IRR-Methodik, Vermieter-Steuer       │
└─────────────────────────────────────────────────────┘
```

**Neu in v3:**
- 9-Felder-Wizard (statt 7+1) mit PLZ/Ort, Eigentümer-Typ, Sanierungsstand, Persona
- Drei Schieberegler-Blöcke auf Ergebnis-Seite (Zeitraum / Energiepreise / Förderung)
- Persona-Picker (Bewahrer/Optimierer/Wechsler) doppelt platziert
- Big Picture Netzdiagramm am Seitenende
- Pressetext-Block für Journalisten (vierte Zielgruppe)
- Belegbarkeits-Badges A/B/C an zentralen Werten
- Annahmen-Transparenz-Box im Kopf der Ergebnis-Seite
- Heizlast-Hilfsregel als Smart Default
- Eigener Bezugspreis als Override (`EigenerPreisAktuell`)
- Konditionale Verzweigungen (FW-Satzung, Pellets-Filter, MFH-Vermieter)
- Wegweiser-Block + Dialog-CTA
- 154 Defined Names (statt 150)

**Aus v2 erhalten:** Modell Z, Phase-State-Maschine, Mini-Cockpit-Pill-Leiste, Übergangs-Banner A+, Methodik-Glasbox-Tooltip, Profi-Modus-Toggle, Teilen-Funktion, Footer-Block "Tiefer einsteigen", Konsistenz-Linie.

---

## 1. Konzeptioneller Rahmen — was Web hier leistet

Die Excel ist Tiefen-Werkzeug (alle 154 Defined Names, alle Hebel, Methodik-Glasbox als Tabellen, kaufbar als Geschäftsmodell). Der Web-Entscheider ist **nicht die Excel im Browser**, sondern eine Übersetzung mit eigenen Stärken — **Orientierung wie ein Auto-Magazin vor dem Händlerbesuch.** Der Nutzer soll auf Augenhöhe mit Versorger / Ingenieurbüro / Stadtwerken in ein Gespräch gehen können.

**Vier Zielgruppen (gleichberechtigt):**

1. **Privat-Eigentümer** (EFH oder Einzelvermieter). Beispiel: 75-Jähriger außerhalb Erfurt, Erbe-Perspektive, alte Gasheizung + Ofen, kein Satzungszwang.
2. **WEG-Beirat** in Mehrfamilienhaus. Beispiel: 14-WE-WEG Erfurt-Innenstadt, Heizung 1998, Satzungsgebiet, heterogene Investor-Typen.
3. **Naive Neugierige.** Brauchen Aha-Moment ohne Vorbildung.
4. **Journalisten.** Brauchen griffige Werte, Antizipations-Funktion, belegbare Zahlen, Screenshot-taugliche Diagramme.

**Zehn Web-USPs (Begründung der Architektur):**

1. Echtzeit-Reaktion auf Eingaben
2. Animierte Wirkungs-Verläufe über 25 Jahre
3. Direkte Vergleichbarkeit aller fünf Optionen simultan
4. Geführter Eingabe-Pfad (Wizard) statt Zellen-Suche
5. Kontext-sensitive Reduktion (irrelevante Felder verschwinden)
6. Visuelle Hierarchie der Ergebnisse (Triptychon statt Tabs)
7. Methodik-Glasbox per Hover an jedem KPI
8. Mobil verfügbar — Entscheidung dort, wo sie entsteht
9. Eintrittsbarriere null (Link öffnen, in 15 s erstes KPI)
10. Teilen via URL mit eingegebenem Stand

---

## 2. Scope C1 + Akzeptanz-Kriterien

**Im Scope:**

- `rechner.html` mit Hero, dreischrittigem Wizard (9 Pflichtfelder + PV-Toggle), Berechnungs-Übergang, Ergebnis-Seite-Skelett, Footer
- JSON-Anbindung an existierende `daten/parameter.json` + `daten/preishistorie.json` (sind seit 02.05.2026 produktiv mit Mai-Werten)
- Annahmen-Transparenz-Box (klappbar, im Kopf der Ergebnis-Seite)
- Mini-Cockpit als Pill-Leiste (klickbar, leerer State in C1)
- Drei Panel-Platzhalter-Sektionen (Wirtschaftlichkeit, Radar, FRI) — Inhalt-Stubs
- Drei Schieberegler-Blöcke (Zeitraum / Energiepreise / Förderung) — UI funktional, Berechnungs-Wirkung in C2
- Persona-Picker (Wizard-Ende + Ergebnis-Seite-Toggle) — UI funktional, Säulen-Gewichtung in C2/C3/C4
- Konditionale Verzweigungen funktional: FW-Satzungs-Hinweis bei Erfurt-Altstadt-PLZ, Pellets-Filter bei Innenstadt+>30kW, Vermieter-Bilanz-Container bei MFH+Vermietung, WEG-Hinweise bei MFH+WEG
- Big Picture Netzdiagramm-Container am Seitenende (Stub mit Empfehlungs-Banner-Platzhalter)
- Pressetext-Block für Journalisten (auto-generierter Klartext aus Wizard-State, drei Knöpfe)
- Wegweiser-Block (BAFA / KfW / Tega-Solarrechner / Verbraucherzentrale / SWE)
- Dialog-CTA (dialog@hausentscheider.de)
- Belegbarkeits-Badges A/B/C als wiederverwendbare Komponente (Platzhalter-Werte in C1)
- Übergangs-Hinweis-Komponente für URL-Parameter aus Mini-Rechner / Ranking (Variante A+)
- Profi-Modus-Toggle auf Ergebnis-Seite (UI in C1, Funktion in C2)
- Methodik-Glasbox-Komponente als wiederverwendbarer Tooltip
- Teilen-Funktion via URL-Encoding (Button generiert Link mit Wizard-Eingaben + Schieberegler-Stand als Parameter)
- Responsive: Wizard nativ Mobile, Ergebnis-Seite mit Pill-Scroll und Panel-Anker-Navigation
- Konsistenz zur bestehenden Website (Farbsystem, Typografie aus index.html)

**Akzeptanz-Kriterien (am Ende der Sitzung erfüllt):**

1. `rechner.html` öffnet ohne Konsolen-Fehler.
2. Visuelle Konsistenz zu `index.html` und `objekte/index.html` (Petrol, Signal-Gelb, Stone-Gray, Playfair Display, Inter).
3. Hero zeigt Titel "Der Entscheider", Investitionsrechner-Subtext, Drei-Sätze-Erklärung, CTA-Button.
4. **Wizard-Schritt 1 (Gebäude, 3 Felder):** PLZ/Ort-Eingabe (Text + Suggestion), Toggle EFH/MFH, bei MFH: Eigentümer-Typ-Dropdown.
5. **Wizard-Schritt 2 (Heizung & Verbrauch, 4 Felder):** Aktuelle Heizung + Baujahr, Wohnfläche-Slider, Verbrauch-Slider (mit Heizlast-Hilfsregel-Hint bei leerem Feld), Sanierungsstand-Toggle.
6. **Wizard-Schritt 3 (Kontext, 2 Felder):** Nutzungsart-Dropdown, Persona-Picker (Bewahrer/Optimierer/Wechsler).
7. **PV-Toggle** als zusätzlicher Schalter im Wizard (Schritt 1 oder 2, sichtbar als "PV mitdenken? ja/nein").
8. Konditionale Verzweigungen funktionieren live im Wizard:
   - PLZ Erfurt-Altstadt → FW-Satzungs-Hinweis "Anschlusszwang gemäß Satzung 3.008"
   - MFH-Auswahl → Eigentümer-Typ-Feld erscheint
   - Wohnfläche × Sanierungsfaktor > 30 kW + Lage Innenstadt → Pellets-Option grau gerendert
9. Übergangs-Animation (1–2 s) beim Klick "Berechnen", danach Ergebnis-Seite.
10. **Ergebnis-Seite zeigt (von oben nach unten):**
    - Annahmen-Transparenz-Box (klappbar, im Kopf, klein gesetzt)
    - Headline-Antwort-Platzhalter
    - Persona-Picker (oben rechts, frei umschaltbar)
    - Mini-Cockpit als Pill-Leiste mit allen Wizard-Werten
    - Profi-Modus-Toggle
    - Drei Panel-Platzhalter mit Inhalt-Stubs
    - Drei Schieberegler-Blöcke unter den Panels (Zeitraum / Energiepreise / Förderung)
    - Big Picture Netzdiagramm-Container
    - Wegweiser-Block
    - Pressetext-Block ("Für die Presse") mit drei Knöpfen
    - Footer-Block "Tiefer einsteigen"
    - Dialog-CTA + Teilen-Button
11. Klick auf Pill öffnet Inline-Editor zum Anpassen, Wert-Update aktualisiert State.
12. Konditionale Vermieter-Bilanz-Sektion unter Panel 1 wird sichtbar bei Nutzungsart ≠ Selbstnutzung.
13. WEG-Block "Hinweise für die Eigentümerversammlung" wird sichtbar bei MFH + Eigentümer-Typ "WEG".
14. Drei Schieberegler-Blöcke: UI funktional (verschieben, Default-Werte aus parameter.json/preishistorie.json), aber Wirkung auf Panels wird in C2/C3/C4 implementiert. Wert-Updates loggen in Console.
15. Persona-Picker auf Ergebnis-Seite: drei Buttons, aktiver State visualisiert, Klick aktualisiert State.
16. Pressetext-Block: auto-generierter Platzhalter-Text aus Wizard-State (z. B. "Für ein {Gebäudetyp} in {PLZ} mit {Wohnfläche} m² ..."), drei Knöpfe (Kopieren in Zwischenablage / "PNG-Download (folgt in C5)" / "Mailto:redaktion@..."-Vorbereitung).
17. URL-Parameter beim Aufruf `rechner.html?flaeche=908&kosten=11500&heizung=gas` lösen Übergangs-Banner aus mit "Übernehmen / Neu starten"-Buttons. Default ohne Klick: leere Maske.
18. Teilen-Button generiert URL mit Wizard-State + Schieberegler-Stand + Persona als Parameter, Klick kopiert in Zwischenablage.
19. Mobile (< 768 px): Wizard ist Vollbild pro Schritt, Ergebnis-Seite mit horizontalem Pill-Scroll, Panels und Schieberegler-Blöcke gestackt mit Anker-Sprung-Navigation.
20. JSON-Daten werden geladen: parameter.json (154 Defined Names im Index, 8 Block-Sektionen) + preishistorie.json (Mai 2026 als aktueller Monat).
21. Belegbarkeits-Badges-Komponente angelegt mit drei States A/B/C, in C1 mit Platzhalter-Werten an je einem KPI pro Panel.
22. Keine Berechnung, keine Visualisierung, keine Panel-Inhalte über Stubs hinaus — Platzhalter "Inhalt folgt in C2/C3/C4".

---

## 3. Datei-Struktur nach C1

```
hausentscheider/
├── index.html                    (existiert, unverändert)
├── rechner.html                  (überschrieben — neue Version v3 mit 9-Felder-Wizard + Ergebnis)
├── objekte/index.html            (existiert, unverändert in C1)
├── preishistorie.html            (existiert, unverändert in C1)
├── daten/
│   ├── parameter.json            (existiert produktiv seit 02.05. — wird in C1 geladen, nicht überschrieben)
│   ├── preishistorie.json        (existiert produktiv seit 02.05. — wird in C1 geladen, nicht überschrieben)
│   └── …
├── build_json.py                 (existiert, committet — Generator nicht angefasst in C1)
└── …
```

Die existierende `rechner.html` wird vollständig überschrieben (Stylesheet bleibt vom Stil her erhalten, Struktur ist neu). `daten/parameter.json` und `daten/preishistorie.json` sind seit dem Mai-Update bereits im Repo und werden in C1 nur **konsumiert**, nicht regeneriert.

`objekte/index.html` und `preishistorie.html` werden in einem späteren Block (vermutlich F oder eigener Sync-Block) auf JSON-Bezug umgestellt — nicht in C1.

---

## 4. `daten/parameter.json` — Stand und Schlüssel

Datei existiert bereits produktiv im Repo (Stand 02.05.2026, generiert aus Excel v2.0_neutral mit 154 Defined Names). Claude Code muss in C1 nur:

- Datei via `fetch('daten/parameter.json')` laden
- Block-5-Defaults für EFH/MFH-Wechsel im Wizard auslesen
- Block-1-Energiepreise als Defaults für Schieberegler-Block B
- Block-7-Lebensdauer als Lookup (in C2 für Berechnung)
- Block-8-Heizlast-Faktoren als Defaults für Heizlast-Hilfsregel

**Block-Struktur (zur Orientierung):**

```json
{
  "version": "2.0",
  "stand": "2026-05-02",
  "_defined_names_index": [ /* 154 Einträge */ ],

  "block1_energiepreise": {
    "PreisGas":     { "default": …, "min": …, "max": …, "steigerung": …, "einheit": "ct/kWh", "belegbarkeit": "B" },
    "PreisFW":      { "default": 17.5, "kontext": "Erfurt-Effektivpreis 17,5 ct/kWh real belegt", "belegbarkeit": "A" },
    "PreisWP":      { …, "belegbarkeit": "B" },
    "PreisPellets": { …, "belegbarkeit": "B" },
    "PreisOel":     { …, "belegbarkeit": "B" },
    "EigenerPreisAktuell": { "default": null, "kontext": "Override aus Eingaben Z37", "belegbarkeit": "A" }
  },
  "block2_rahmen":      { "Kalkzins": …, "BGB559Korr": 0.08, "Hf559": …, "Dauer559": …, "AfA7b": …, "AfA7bDauer": …, "KfWZuschuss": … },
  "block3_technik":     { "JAZ": …, "WGFW": …, "WGGas": …, "Wartungsquote": … },
  "block4_plausi":      { "PelletsMaxWE": 6, "PelletsAusschluss": "Innenstadt", "PelletsHeizlastSchwelle": 30 },
  "block5_gebaeudedefaults": {
    "EFH": { "Wohnflaeche": 140, "WE": 1, …, "Verkehrswert": 500000, "Lage": "Vorort", "FW_Satzung": "nein" },
    "MFH": { "Wohnflaeche": 950, "WE": 14, …, "Verkehrswert": 1800000, "Lage": "Innenstadt", "FW_Satzung": "ja" }
  },
  "block6_vermieter":   { "MietspiegelEff": …, "MarktDC": …, "MarktDB": …, "EPBDAbschlag": …, "MietausfQ": …, "BauMM": …, "KaltMiete": 8.50, "KlassenSprung": 1 },
  "block7_lebensdauer": { "L_GasBW": 18, "L_Hybrid": 18, "L_WP": 18, "L_FW": 25, "L_Pellets": 20, "L_Oel": 20 },
  "block8_heizlast_hilfsregel": {
    "HeizlastFaktor_unsaniert":   0.12,
    "HeizlastFaktor_teilsaniert": 0.08,
    "HeizlastFaktor_saniert":     0.05,
    "_kontext": "DIN EN 12831-1 + empirisch. kW/m²"
  },
  "foerderung_mai_2026": {
    "BAFA_Grundfoerderung":     { "default": 0.30, "belegbarkeit": "A", "quelle": "Q-BAFA-2026" },
    "Klimageschwindigkeitsbonus":{ "default": 0.20, "sinkpfad": [{"jahr": 2029, "wert": 0.17}, {"jahr": 2031, "wert": 0.14}], "belegbarkeit": "A", "quelle": "Q-BWP-2026" },
    "Einkommensbonus":          { "default": 0.30, "bedingung": "Selbstnutzung & zvE ≤ 40k", "belegbarkeit": "A" },
    "Effizienzbonus":           { "default": 0.05, "belegbarkeit": "A" },
    "Foerderdeckel":            { "default": 0.70, "max_euro": 21000, "belegbarkeit": "A" }
  }
}
```

**Hinweis für Claude Code:** Schlüssel sind 1:1 zu Excel-Defined-Names. Werte aus existierender `parameter.json` ziehen — nicht in C1 neu generieren. Der `belegbarkeits`-Schlüssel ist neu in v3 und in der existierenden JSON unter Umständen noch nicht vollständig befüllt — bei fehlendem Wert "C" als Fallback annehmen. Belegbarkeits-Pflege erfolgt im Excel-Tab `Quellen` und wandert beim nächsten `build_json.py`-Lauf in die JSON.

---

## 5. `daten/preishistorie.json` — Stand und Nutzung

Datei existiert produktiv (Mai 2026 als aktueller Monat, Werte: Gas 10,5 / FW 17,5 Erfurt-Effektivpreis / Heizöl 13,5 / WP-Strom 26,0 / Pellets 7,5 ct/kWh).

**Nutzung in C1:**
- Wizard-Schritt 2 unter dem Verbrauchs-Slider: Inline-Hinweis "Aktueller Markt-Durchschnittspreis Gas: 10,5 ct/kWh (Mai 2026). Dein Verbrauch entspricht ca. {Verbrauch × 10,5 ct = X €} Jahresheizkosten."
- Schieberegler-Block B (Energiepreise) auf Ergebnis-Seite: Default-Werte = Mai-Stand
- Methodik-Tooltip an jedem Energiepreis-KPI: Quelle und Stand

---

## 6. HTML-Skelett `rechner.html`

Single-Page-Application mit JS-State-Maschine. Drei sichtbare Phasen: Hero/Intro, Wizard, Ergebnis. Übergänge per JS, kein Routing nötig.

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Der Entscheider — Hausentscheider</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* Inline-CSS — Farbsystem und Typografie aus index.html / objekte/index.html.
       Zusätzliche Styles für Wizard, Pill-Cockpit, Schieberegler, Methodik-Tooltip,
       Übergangs-Animation, Belegbarkeits-Badges, Persona-Picker, Pressetext-Block. */
  </style>
</head>
<body>
  <!-- NAV: aus index.html übernehmen -->
  <nav>…</nav>

  <!-- Phase 1: Hero/Intro -->
  <header id="phase-hero" class="phase phase--active">
    <div class="hero-image-slot"><!-- Cover-Bild Platzhalter --></div>
    <div class="hero-content">
      <h1>Der Entscheider</h1>
      <p class="hero-subtitle"><em>Investitionsrechner für Ihre Heizungsentscheidung — damit sich Ihre Investition lohnt, nach den Maßstäben, die Ihnen wichtig sind.</em></p>
      <p>Drei Sichten auf dieselbe Frage. Keine einzelne gibt eine Antwort — alle drei zusammen machen die Entscheidung sichtbar.</p>
      <p>Kein Ersatz für eine Ingenieursplanung. Aber eine belastbare Grundlage, bevor Sie eine in Auftrag geben.</p>
      <button class="cta-start">Jetzt durchrechnen →</button>

      <div id="urlParamBanner" hidden>
        <p>Du hast vorher Wohnfläche <strong>{X} m²</strong>, Heizung <strong>{Z}</strong>, Jahreskosten <strong>{Y} €</strong> eingegeben.</p>
        <button class="cta-übernehmen">Werte übernehmen</button>
        <button class="cta-neustart">Neu starten</button>
      </div>
    </div>
  </header>

  <!-- Phase 2: Wizard (drei Schritte, 9 Pflichtfelder + PV-Toggle) -->
  <section id="phase-wizard" class="phase" hidden>
    <div class="wizard-progress">
      <span class="step step--active">1 · Gebäude</span>
      <span class="step">2 · Heizung &amp; Verbrauch</span>
      <span class="step">3 · Kontext</span>
    </div>

    <div class="wizard-step" data-step="1">
      <h2>Dein Gebäude</h2>
      <!-- Feld 1: PLZ/Ort (Text mit Suggestion, FW-Satzungs-Hinweis bei Erfurt-Altstadt-PLZ) -->
      <!-- Feld 2: Toggle EFH/MFH (Segmented Control) -->
      <!-- Feld 3: Eigentümer-Typ (nur sichtbar bei MFH): Einzelvermieter / WEG / Selbstnutzer -->
      <!-- PV-Toggle: "PV mitdenken? ja/nein" -->
      <div class="hint" id="fw-satzung-hint" hidden>
        <strong>Hinweis:</strong> Anschlusszwang gemäß Erfurter Fernwärmesatzung 3.008.
        Hybrid und Pellets in der Innenstadt ausgeschlossen, Befreiungswege nach §6 möglich.
      </div>
      <button class="wizard-next">Weiter</button>
    </div>

    <div class="wizard-step" data-step="2" hidden>
      <h2>Heizung &amp; Verbrauch</h2>
      <!-- Feld 4: Aktuelle Heizung + Baujahr (Dropdown 6 Optionen + Year Input) -->
      <!-- Feld 5: Wohnfläche-Slider (Default je nach EFH/MFH aus parameter.json) -->
      <!-- Feld 6: Verbrauch-Slider (optional, mit Heizlast-Hilfsregel-Hint bei leerem Feld) -->
      <!-- Feld 7: Sanierungsstand-Toggle (unsaniert / teilsaniert / saniert) -->
      <div class="hint" id="markt-hinweis">
        Aktueller Markt-Durchschnittspreis Gas: <strong>10,5 ct/kWh</strong> (Mai 2026).
        Dein Verbrauch entspricht ca. <strong id="markt-jahreskosten">…</strong> Jahresheizkosten.
      </div>
      <div class="hint hilfsregel-hint" hidden>
        Du kannst das Feld leer lassen — wir schätzen deine Heizlast aus Wohnfläche und Sanierungsstand.
        Aktuell geschätzt: <strong id="heizlast-schaetzung">…</strong> kW.
      </div>
      <button class="wizard-back">Zurück</button>
      <button class="wizard-next">Weiter</button>
    </div>

    <div class="wizard-step" data-step="3" hidden>
      <h2>Dein Kontext</h2>
      <!-- Feld 8: Nutzungsart (Selbstnutzung / Mischnutzung / Vermietung) -->
      <!-- Feld 9: Persona-Picker (Bewahrer / Optimierer / Wechsler) -->
      <div class="persona-picker">
        <button class="persona" data-persona="bewahrer">
          <strong>Bewahrer</strong>
          <small>langfristig, 25+ Jahre Horizont</small>
        </button>
        <button class="persona persona--active" data-persona="optimierer">
          <strong>Optimierer</strong>
          <small>mittelfristig, ausgewogen</small>
        </button>
        <button class="persona" data-persona="wechsler">
          <strong>Wechsler</strong>
          <small>kurzfristig, 5–10 Jahre</small>
        </button>
      </div>
      <button class="wizard-back">Zurück</button>
      <button class="wizard-calculate">Berechnen →</button>
    </div>
  </section>

  <!-- Phase 3: Berechnungs-Übergang -->
  <section id="phase-calculating" class="phase" hidden>
    <div class="calc-spinner"></div>
    <p>Wir berechnen deinen Vergleich …</p>
  </section>

  <!-- Phase 4: Ergebnis -->
  <section id="phase-ergebnis" class="phase" hidden>

    <!-- Annahmen-Transparenz-Box (klappbar, im Kopf) -->
    <details class="annahmen-box">
      <summary>Annahmen, mit denen wir rechnen ⓘ</summary>
      <table class="annahmen-tabelle">
        <thead><tr><th>Eingabe / Annahme</th><th>Wert</th><th>Quelle</th><th>Belegbarkeit</th></tr></thead>
        <tbody id="annahmen-tabelle-body">
          <!-- Auto-gefüllt: jeder Wizard-Wert + jede Smart-Default-Annahme + Persona + Schieberegler-Stand -->
        </tbody>
      </table>
      <p class="annahmen-disclaimer">
        Diese Berechnung ist eine Orientierungshilfe. Sie ersetzt keine Fachberatung.
      </p>
    </details>

    <!-- Headline-Antwort -->
    <div class="headline-antwort">
      <p class="placeholder">Inhalt folgt in C2 — algorithmisch generierte Klartext-Antwort aus den drei Sichten.</p>
    </div>

    <!-- Persona-Picker (Toggle, oben rechts auf Desktop, oben auf Mobile) -->
    <div class="persona-toggle">
      <span>Sichtweise:</span>
      <button class="persona-mini" data-persona="bewahrer">Bewahrer</button>
      <button class="persona-mini persona-mini--active" data-persona="optimierer">Optimierer</button>
      <button class="persona-mini" data-persona="wechsler">Wechsler</button>
    </div>

    <!-- Mini-Cockpit als Pill-Leiste -->
    <div class="mini-cockpit">
      <button class="pill" data-key="plz">99084 Erfurt</button>
      <button class="pill" data-key="gebaeudetyp">MFH</button>
      <button class="pill" data-key="eigentuemer">WEG</button>
      <button class="pill" data-key="wohnflaeche">950 m²</button>
      <button class="pill" data-key="heizung">Gas-BW (1998)</button>
      <button class="pill" data-key="verbrauch">95.000 kWh</button>
      <button class="pill" data-key="sanierung">teilsaniert</button>
      <button class="pill" data-key="nutzungsart">Mischnutzung</button>
      <button class="pill" data-key="pv">PV: ja</button>
    </div>

    <!-- Profi-Modus-Toggle -->
    <div class="profi-toggle">
      <label><input type="checkbox" id="profimode"> Profi-Modus</label>
    </div>

    <!-- Sprung-Navigation (Mobile) -->
    <nav class="panel-anchors">
      <a href="#panel-1">Wirtschaftlichkeit</a>
      <a href="#panel-2">Radar</a>
      <a href="#panel-3">Zukunftsfähigkeit</a>
      <a href="#schieberegler">Was-wäre-wenn</a>
      <a href="#big-picture">Gesamt</a>
    </nav>

    <!-- Panel 1 -->
    <section id="panel-1" class="panel">
      <h2>1 — Wirtschaftlichkeit</h2>
      <p class="panel-placeholder">Inhalt folgt in C2 — Headline-KPIs (TCO 25 J · €/m²/Monat · Amortisation), 25-Jahres-Kostenkurve, Vergleich aller fünf Optionen.</p>
      <!-- Belegbarkeits-Badge-Beispiel -->
      <div class="kpi-stub">
        TCO 25 J <span class="badge badge--A">A</span>
      </div>

      <!-- Konditionale Vermieter-Bilanz (eingeblendet bei Nutzungsart ≠ Selbstnutzung) -->
      <details id="vermieter-bilanz" hidden>
        <summary>Sicht für Eigentümer mit Vermietung</summary>
        <p class="panel-placeholder">Inhalt folgt in C2/C5 — fünf Blöcke aus Excel-Tab Vermieter-Sicht.</p>
      </details>

      <!-- Konditionale WEG-Hinweise (eingeblendet bei MFH + Eigentümer-Typ "WEG") -->
      <details id="weg-hinweise" hidden>
        <summary>Hinweise für die Eigentümerversammlung</summary>
        <p class="panel-placeholder">Inhalt folgt in C2/C5 — was muss beschlossen werden, welche Mehrheit, welche Fristen.</p>
      </details>
    </section>

    <!-- Panel 2 -->
    <section id="panel-2" class="panel">
      <h2>2 — Entscheidungs-Radar</h2>
      <p class="panel-placeholder">Inhalt folgt in C3 — fünf Bewertungsachsen als SVG, Persona-abhängige Gewichtung.</p>
    </section>

    <!-- Panel 3 -->
    <section id="panel-3" class="panel">
      <h2>3 — Zukunftsfähigkeit (FRI)</h2>
      <p class="panel-placeholder">Inhalt folgt in C4 — sechs FRI-Dimensionen, drei Erklär-Ebenen.</p>
    </section>

    <!-- Drei Schieberegler-Blöcke -->
    <section id="schieberegler" class="schieberegler-cluster">
      <h2>Was-wäre-wenn — drei Hebel</h2>

      <!-- Block A: Zeitraum -->
      <div class="schieberegler-block">
        <h3>A — Zeitraum</h3>
        <input type="range" id="slider-zeitraum" min="5" max="25" step="5" value="25">
        <output for="slider-zeitraum">25 Jahre</output>
        <p class="caption">Sortiert TCO, Cashflow, Vermögensbilanz live um.</p>
      </div>

      <!-- Block B: Energiepreise -->
      <div class="schieberegler-block">
        <h3>B — Energiepreise</h3>
        <div class="slider-row">
          <label>Gas <input type="range" id="slider-preis-gas" min="6" max="20" step="0.1" value="10.5"> <output>10,5 ct/kWh</output></label>
          <label>FW <input type="range" id="slider-preis-fw" min="14" max="30" step="0.1" value="17.5"> <output>17,5 ct/kWh</output></label>
          <label>WP-Strom <input type="range" id="slider-preis-wpstrom" min="22" max="40" step="0.1" value="26.0"> <output>26,0 ct/kWh</output></label>
        </div>
        <p class="caption">Marktwerte aus Preishistorie Mai 2026 — BDEW/AGFW/DEPV. Quelle: Q-BDEW-2026, Q-AGFW-2026.</p>
      </div>

      <!-- Block C: Förderung -->
      <div class="schieberegler-block">
        <h3>C — Förderung</h3>
        <div class="foerderung-toggles">
          <label><input type="checkbox" id="bafa-grund" checked> BAFA-Grundförderung 30 %</label>
          <label><input type="checkbox" id="bafa-klima" checked> Klimageschwindigkeitsbonus 20 %</label>
          <label><input type="checkbox" id="bafa-einkommen"> Einkommensbonus 30 % (nur Selbstnutzung &amp; zvE ≤ 40k)</label>
          <label><input type="checkbox" id="bafa-effizienz"> Effizienzbonus 5 %</label>
        </div>
        <input type="range" id="slider-foerderung-master" min="0" max="70" step="5" value="50">
        <output for="slider-foerderung-master">50 %</output>
        <div class="foerderung-presets">
          <button class="preset-btn" data-preset="heute">Heute (Mai 2026)</button>
          <button class="preset-btn" data-preset="2029">Klimabonus 2029 −3 Pp</button>
          <button class="preset-btn" data-preset="gestrichen">Förderung komplett gestrichen</button>
        </div>
        <p class="caption">Grundlage: BAFA-Förderverordnung Stand Mai 2026. Quelle: Q-BAFA-2026, Q-BWP-2026.</p>
      </div>
    </section>

    <!-- Big Picture Netzdiagramm -->
    <section id="big-picture" class="big-picture">
      <h2>Big Picture</h2>
      <div class="netzdiagramm-container">
        <p class="placeholder">Inhalt folgt in C4 — Radar mit allen drei Panel-Achsen überlagert. Pro Heizoption eine Farbfläche.</p>
      </div>
      <div class="empfehlungs-banner">
        <p class="placeholder">Inhalt folgt in C2 — algorithmische Empfehlung à la "Für dein Profil tragen WP und Hybrid gleich gut, FW liegt eine Klasse darunter."</p>
      </div>
    </section>

    <!-- Wegweiser-Block -->
    <section class="wegweiser">
      <h2>Wo du als Nächstes hingehen solltest</h2>
      <div class="wegweiser-grid">
        <a href="https://www.bafa.de" target="_blank" class="wegweiser-item">
          <strong>Förderung beantragen</strong>
          <p>BAFA-Förderportal — Antrag online stellen.</p>
        </a>
        <a href="https://www.kfw.de" target="_blank" class="wegweiser-item">
          <strong>KfW-Kredit prüfen</strong>
          <p>Ergänzungskredit zu BAFA-Zuschuss.</p>
        </a>
        <a href="#" class="wegweiser-item">
          <strong>Solarpotenzial prüfen</strong>
          <p>Tega-Solarrechner Thüringen.</p>
        </a>
        <a href="#" class="wegweiser-item">
          <strong>Beratung suchen</strong>
          <p>Verbraucherzentrale Energieberatung — kostenlos.</p>
        </a>
      </div>
    </section>

    <!-- Pressetext-Block (für Journalisten) -->
    <section class="pressetext">
      <h2>Für die Presse</h2>
      <p class="pressetext-vorab">
        Du bist Journalist:in oder schreibst gerade einen Artikel? Hier der auto-generierte Text mit aktuellen Werten:
      </p>
      <blockquote id="pressetext-body">
        <!-- Auto-generiert aus Wizard-State + Schieberegler-Stand -->
        Stand Mai 2026: Für ein <strong>{Gebäudetyp}</strong> in <strong>{PLZ}</strong> mit <strong>{Wohnfläche} m²</strong>
        und <strong>{WE} Wohneinheiten</strong> ist die <strong>{beste Option}</strong> über <strong>{Zeitraum} Jahre</strong>
        wirtschaftlich die Option mit der niedrigsten Total-Cost. Bei aktuell <strong>{Förder-Quote} BAFA-Förderung</strong>
        beträgt die Belastung <strong>{€/m²·Monat}</strong>. Würde der Klimageschwindigkeitsbonus 2029 wie geplant um 3 Pp sinken,
        läge die Belastung bei <strong>{€/m²·Monat 2029}</strong>. Quellen: BAFA, AGFW, BDEW, Stand 1.5.2026.
        Mehr unter hausentscheider.de/methodik.
      </blockquote>
      <div class="pressetext-aktionen">
        <button class="btn-kopieren" data-target="pressetext-body">Pressetext kopieren</button>
        <button class="btn-png" disabled>Diagramme als PNG (folgt in C5)</button>
        <button class="btn-mail">An Redaktion mailen</button>
      </div>
    </section>

    <!-- Footer-Block "Tiefer einsteigen" -->
    <section class="tiefer-einsteigen">
      <h3>Tiefer einsteigen</h3>
      <div class="optionen">
        <a class="option" href="#" onclick="document.getElementById('profimode').click(); return false;">
          <strong>Werte ausführlich anpassen</strong>
          <p>Profi-Modus aktivieren — weitere Hebel im Cockpit.</p>
        </a>
        <a class="option" href="/excel-edition.html">
          <strong>Excel-Edition (49 €)</strong>
          <p>Alle Hebel, alle Quellen, monatliche Updates. Geschäftsmodell-CTA.</p>
        </a>
        <a class="option" href="/methodik.html">
          <strong>Methodik &amp; Ingenieurbüro</strong>
          <p>Wie wir rechnen, und wo Sie eine echte Planung in Auftrag geben.</p>
        </a>
      </div>
    </section>

    <!-- Dialog-CTA + Teilen-Button -->
    <section class="dialog-cta">
      <p>
        <strong>Du willst tiefer rechnen oder hast eine Sondersituation?</strong>
        Schreib uns an <a href="mailto:dialog@hausentscheider.de">dialog@hausentscheider.de</a>.
      </p>
      <button class="teilen-btn">Link mit deinen Werten teilen</button>
    </section>
  </section>

  <!-- Footer: aus index.html übernehmen -->
  <footer>…</footer>

  <script>
    /* Inline-JS:
     * 1. parameter.json + preishistorie.json laden (fetch, beide existieren produktiv)
     * 2. State-Objekt: { phase, plz, gebaeudetyp, eigentuemer, wohnflaeche, heizung, baujahr, verbrauch,
     *                    sanierung, nutzungsart, persona, pv,
     *                    overrides: { schieberegler-stand, foerderung-toggles, eigener-preis }, ... }
     * 3. URL-Parameter parsen, Übergangs-Banner ggf. anzeigen
     * 4. Wizard-Logik:
     *    - Phase-Wechsel
     *    - Default-Werte je Gebäudetyp aus parameter.json laden
     *    - Konditionale Verzweigungen:
     *      - PLZ Erfurt-Altstadt (99084 + LNK-Tabelle Innenstadt) → fw-satzung-hint einblenden
     *      - MFH-Auswahl → eigentuemer-Feld einblenden
     *      - Heizlast (Wohnfläche × HeizlastFaktor[Sanierung]) > 30 + Lage Innenstadt → Pellets-Option grau
     *    - Smart Defaults: Verbrauch leer → Heizlast-Hilfsregel-Hint einblenden, geschätzten Wert anzeigen
     * 5. Berechnungs-Übergang (1.5 s Spinner)
     * 6. Ergebnis-Phase:
     *    - Annahmen-Tabelle befüllen aus State (jeder Wert + Quelle + Belegbarkeit)
     *    - Pills aus State rendern, Pill-Klick öffnet Inline-Editor
     *    - Konditionale: Vermieter-Bilanz bei Nutzungsart ≠ Selbstnutzung,
     *      WEG-Hinweise bei Eigentümer-Typ "WEG"
     *    - Persona-Toggle (in C1: nur Visual State, Gewichtungs-Wirkung in C2/C3/C4)
     *    - Schieberegler-Blöcke: Default-Werte aus parameter.json, Änderungen loggen in Console
     *      (Wirkung auf Panels in C2/C3/C4)
     *    - Profi-Modus-Toggle (in C1: nur Visual State, Funktion in C2)
     *    - Pressetext-Block: auto-generierter Klartext aus State, Kopier-Button
     *      (navigator.clipboard.writeText), Mail-Button mit mailto-Link
     *    - Methodik-Tooltips (data-tip Attribut)
     *    - Belegbarkeits-Badges (Komponente: <span class="badge badge--A|B|C">A|B|C</span>)
     * 7. Teilen-Funktion: URLSearchParams aus State, navigator.clipboard.writeText
     */
  </script>
</body>
</html>
```

---

## 7. Wizard — 9 Pflichtfelder im Detail

**Schritt 1 — Dein Gebäude (3 Felder + PV-Toggle):**

| # | Feld | Typ | Defined Name | Default-Quelle |
|---|---|---|---|---|
| 1 | PLZ/Ort | Text-Input mit Suggestion | `PLZ`, `Ort` | leer |
| 2 | Gebäudetyp | Toggle EFH/MFH | `Gebaeudetyp` | "MFH" als Voreinstellung |
| 3 | Eigentümer-Typ (nur bei MFH) | Dropdown 3 Optionen | `EigentuemerTyp` | "WEG" als Voreinstellung |
|   | PV-Toggle | "PV mitdenken? ja/nein" | `PVAktiv` | "ja" als Voreinstellung |

Optionen Eigentümer-Typ: Einzelvermieter / WEG / Selbstnutzer.

**Konditionale Verzweigung Schritt 1:**
- Bei PLZ-Match auf Erfurter Altstadt-Versorgungsgebiet (99084 + Tabelle in `block4_plausi.AltstadtPLZ`): `fw-satzung-hint` einblenden mit Verweis auf Satzung 3.008
- EFH-Auswahl: Eigentümer-Typ-Feld bleibt verborgen (impliziert Selbstnutzung)

**Schritt 2 — Heizung & Verbrauch (4 Felder):**

| # | Feld | Typ | Defined Name | Default-Quelle |
|---|---|---|---|---|
| 4 | Aktuelle Heizung + Baujahr | Dropdown 6 Optionen + Year Input | `HeizungStatusquo`, `HeizungBaujahr` | "Gas-Brennwert", 1998 |
| 5 | Wohnfläche | Slider 50–3000 m² | `Wohnflaeche` | parameter.json block5[type].Wohnflaeche |
| 6 | Verbrauch | Slider 5.000–500.000 kWh, optional | `Verbrauch` | parameter.json block5[type].Verbrauch |
| 7 | Sanierungsstand | Toggle 3 Optionen | `Sanierungsstand` | "teilsaniert" als Voreinstellung |

Optionen Heizung: Gas-Brennwert / Gas-Niedertemperatur / Öl / Fernwärme / Wärmepumpe / Sonstige.
Optionen Sanierungsstand: unsaniert (vor 1977) / teilsaniert (1977–2002) / saniert (nach 2002).

**Smart Default Heizlast-Hilfsregel:**
Wenn das Verbrauch-Feld leer gelassen wird:
```
Heizlast (kW) = Wohnfläche × HeizlastFaktor[Sanierungsstand]
  HeizlastFaktor_unsaniert   = 0,12 kW/m²
  HeizlastFaktor_teilsaniert = 0,08 kW/m²
  HeizlastFaktor_saniert     = 0,05 kW/m²
```
`hilfsregel-hint` einblenden mit aktueller Schätzung.

**Inline-Hinweis Markt-Preis** (immer sichtbar):
Aus preishistorie.json (Mai-Stand): "Aktueller Markt-Durchschnittspreis Gas: 10,5 ct/kWh. Dein Verbrauch entspricht ca. {Verbrauch × 10,5 ct = X €} Jahresheizkosten."

**Schritt 3 — Dein Kontext (2 Felder):**

| # | Feld | Typ | Defined Name | Default-Quelle |
|---|---|---|---|---|
| 8 | Nutzungsart | Dropdown 3 Optionen | `Nutzungsart` (leitet `Wirksam_VM` ab) | parameter.json block5[type].Nutzungsart |
| 9 | Persona-Picker | Drei Buttons | `Persona` | "Optimierer" als Voreinstellung |

Optionen Nutzungsart: Selbstnutzung / Mischnutzung / Vollvermietung.

---

## 8. Persona-Picker — Bewahrer / Optimierer / Wechsler

**Drei Personas mit Bedeutung statt Demografie:**

| Persona | Horizont | Schwerpunkt-Säule | Beispiel |
|---|---|---|---|
| **Bewahrer** | langfristig (25+ J) | Future Readiness, Nachhaltigkeit | 75-jährige Erbe-Perspektive |
| **Optimierer** | mittelfristig (10–20 J) | Wirtschaftlichkeit, ausgewogen | WEG-Beirat, plant nicht zu verkaufen |
| **Wechsler** | kurzfristig (5–10 J) | Marktwirkung, Förderattraktivität | will in 5–10 J verkaufen |

**Wirkung:** Die Persona verändert nur die **Gewichtung** der drei Panel-Säulen, nicht die Datenbasis. Damit kann der Nutzer auf der Ergebnis-Seite frei mit der Persona spielen und sieht, wie die Empfehlung kippt — ohne Berechnungs-Manipulation.

**Platzierung doppelt:**
- *Im Wizard:* Schritt 3, Feld 9, drei Buttons mit Beschriftung + Untertext
- *Auf der Ergebnis-Seite:* als Toggle oben rechts (Desktop) bzw. oben (Mobile), drei Mini-Buttons, frei umschaltbar

**Inhaltliche Konsistenz:** deckt sich mit den drei Eigentümer-Typen aus der WEG-Beirats-Entscheidungsgrundlage Theaterstraße v2 Kap. 6.

**Implementation in C1:** UI-State funktional (aktiver Button visualisiert, State-Update beim Klick). Gewichtungs-Wirkung auf Panels wird in C2 (Panel 1), C3 (Panel 2 Radar), C4 (Panel 3 FRI) implementiert.

---

## 9. Annahmen-Transparenz-Box

Sichtbar oberhalb des Headline-Antwort-Blocks, klein gesetzt, klappbar (`<details>`-Element). Pattern aus dem NET-Sachstandsbericht 2023 — schafft Vertrauen, macht Excel-Logik web-konform, ist gegen Experten-Bashing belastbar.

**Inhalt:** Tabelle mit allen Eingabewerten + allen Smart-Default-Annahmen + Quelle + Belegbarkeit.

**Beispiel-Zeilen (auto-generiert aus State):**

| Eingabe / Annahme | Wert | Quelle | Belegbarkeit |
|---|---|---|---|
| Gebäudetyp | MFH | Eingabe | A |
| Wohnfläche | 950 m² | Eingabe | A |
| Verbrauch | 95.000 kWh | Eingabe | A |
| Heizlast (geschätzt) | 76 kW | DIN EN 12831-1, Faktor teilsaniert | C |
| Sanierungsstand | teilsaniert | Eingabe | A |
| Persona | Optimierer | Eingabe | A |
| Energiepreis Gas | 10,5 ct/kWh | preishistorie.json Mai 2026 | B |
| Energiepreis FW | 17,5 ct/kWh | Erfurt-Effektivpreis (Techem-Realabrechnung) | A |
| BAFA-Förderquote | 50 % | BAFA-Förderverordnung Mai 2026 | A |
| Zeitraum | 25 Jahre | Default | A |

**Disclaimer am Ende der Box:** "Diese Berechnung ist eine Orientierungshilfe. Sie ersetzt keine Fachberatung."

---

## 10. Belegbarkeits-Badges A/B/C

Wiederverwendbare Komponente. Jeder zentrale Wert auf der Plattform bekommt ein kleines Badge:

- **A** — real belegt durch Primärquelle (z. B. SWE-Preisblatt, BAFA-Verordnung, eigene Abrechnung)
- **B** — Marktwert/Bundesmedian (z. B. AGFW-Median, BDEW-Statistik)
- **C** — Schätzung/Modell (z. B. Heizlast-Faktor, Default-Investitionskosten)

Pattern aus Vorab-Analyse Fernwärme Erfurt v2 — macht Schwächen offen sichtbar, statt sie zu verstecken. Schwächt Experten-Angriffe, weil Transparenz vorgeschoben wird.

**HTML:**
```html
<span class="badge badge--A" title="Primärquelle">A</span>
<span class="badge badge--B" title="Marktwert/Median">B</span>
<span class="badge badge--C" title="Schätzung/Modell">C</span>
```

**CSS-Vorgaben:**
- Petrol-Hintergrund für A
- Stone-Gray für B
- Signal-Gelb-Outline für C
- klein (8 × 8 px), kompakt platziert neben dem KPI-Wert

**In `parameter.json`** als zusätzliches Feld pro Wert: `"belegbarkeit": "A"`. Bei fehlendem Wert: Fallback auf "C".

**In C1:** Komponente angelegt, an je einem KPI pro Panel mit Platzhalter-Wert demonstriert.

---

## 11. Drei Schieberegler-Blöcke auf Ergebnis-Seite

Cluster unter den drei Panels. Alle drei Blöcke wirken live auf alle Panels (in C2/C3/C4 implementiert). In C1: UI funktional, Wert-Updates loggen in Console.

**Block A — Zeitraum (1 Slider):**
- Range 5 / 10 / 15 / 20 / 25 Jahre, Default 25
- Sortiert TCO, Cashflow, Vermögensbilanz live um

**Block B — Energiepreise (3 Slider):**
- Gas-Preis: min/max aus block1.PreisGas, Default = preishistorie aktuell (10,5 ct/kWh)
- FW-Preis: min/max aus block1.PreisFW, Default = preishistorie aktuell (17,5 ct/kWh)
- WP-Strom-Preis: min/max aus block1.PreisWP, Default = preishistorie aktuell (26,0 ct/kWh)
- Quellen-Footer: "Marktwerte aus Preishistorie Mai 2026 — BDEW/AGFW/DEPV. Quelle: Q-BDEW-2026, Q-AGFW-2026."

**Block C — Förderung (4 Toggles + Master-Slider + 3 Preset-Buttons):**

*Komponenten-Toggles:*
- BAFA-Grundförderung 30 % (default an)
- Klimageschwindigkeitsbonus 20 % (default an)
- Einkommensbonus 30 % (default aus, Bedingung: Selbstnutzung & zvE ≤ 40k)
- Effizienzbonus 5 % (default aus)

*Master-Schieberegler:* 0–70 %, ergibt sich aus den aktiven Toggles, kann manuell überschrieben werden.

*Drei Schnell-Buttons:*
- "Heute (Mai 2026)" → setzt alle aktuellen Defaults
- "Klimabonus 2029 −3 Pp" → setzt Klima-Bonus auf 17 % (Sinkpfad aus parameter.json)
- "Förderung komplett gestrichen" → alle Toggles aus, Master auf 0 %

*Quellen-Footer:* "Grundlage: BAFA-Förderverordnung Stand Mai 2026. Quelle: Q-BAFA-2026, Q-BWP-2026."

**State-Schlüssel:** `state.overrides.schieberegler = { zeitraum, preisGas, preisFW, preisWP, foerderung: { grund, klima, einkommen, effizienz, master } }`.

---

## 12. Big Picture Netzdiagramm

Am Seitenende, unter den drei Schieberegler-Blöcken. Container-Stub in C1, vollständige Implementation in C4.

**Geplant (C4):** Radar-Chart mit allen drei Panel-Achsen überlagert. Pro Heizoption eine Farbfläche.

**In C1:** Container mit Platzhalter-Text + Empfehlungs-Banner-Stub.

---

## 13. Pressetext-Block "Für die Presse"

Auf Ergebnis-Seite zwischen Wegweiser und Footer. Adressiert die vierte Zielgruppe (Journalisten) — Hebelgruppe für organische Reichweite ohne Marketing-Budget.

**Inhalt:** Auto-generierter Klartext aus aktuellen State-Werten + Schieberegler-Stand.

**Template (C1, Platzhalter befüllt):**
> Stand Mai 2026: Für ein **{Gebäudetyp}** in **{PLZ}** mit **{Wohnfläche} m²** und **{WE} Wohneinheiten** ist die **{beste Option}** über **{Zeitraum} Jahre** wirtschaftlich die Option mit der niedrigsten Total-Cost. Bei aktuell **{Förder-Quote} BAFA-Förderung** beträgt die Belastung **{€/m²·Monat}**. Würde der Klimageschwindigkeitsbonus 2029 wie geplant um 3 Pp sinken, läge die Belastung bei **{€/m²·Monat 2029}**. Quellen: BAFA, AGFW, BDEW, Stand 1.5.2026. Mehr unter hausentscheider.de/methodik.

**Drei Knöpfe:**
1. "Pressetext kopieren" — `navigator.clipboard.writeText(text)`
2. "Diagramme als PNG laden" — disabled in C1, aktiv in C5 (PNG-Generierung der Panels)
3. "An Redaktion mailen" — `mailto:` mit Subject + Body vorausgefüllt

**Wirkung in C1:** Template-Engine funktional, beste-Option-Berechnung wird in C2 ergänzt (in C1: "{beste Option}" als Stub).

---

## 14. Wegweiser-Block

Kuratierte Links, aufgaben-spezifisch sortiert:

| Block | Ziel | Link |
|---|---|---|
| Förderung beantragen | BAFA-Förderportal | `https://www.bafa.de/DE/Energie/Effiziente_Gebaeude/...` |
| KfW-Kredit prüfen | KfW Ergänzungskredit | `https://www.kfw.de` |
| Solarpotenzial prüfen | Tega-Solarrechner Thüringen | (Platzhalter-Link) |
| Beratung suchen | Verbraucherzentrale Energieberatung | (Platzhalter-Link) |
| Erfurter Versorger | SWE-Preisblatt | `https://www.stadtwerke-erfurt.de/...` |

**In C1:** Vier bis fünf Karten, externe Links mit `target="_blank" rel="noopener"`.

---

## 15. Dialog-CTA

Aufruf zum Dialog am Ende der Ergebnis-Seite:

> **Du willst tiefer rechnen oder hast eine Sondersituation?** Schreib uns an [dialog@hausentscheider.de](mailto:dialog@hausentscheider.de).

Plus Hinweis auf die Excel-Edition als bezahlbares Werkzeug (existiert auch im Footer-Block "Tiefer einsteigen", hier nochmal als CTA-Kontext).

---

## 16. Methodik-Glasbox-Tooltip

Wiederverwendbare Komponente, an jedem zentralen KPI verfügbar.

**HTML:**
```html
<span class="kpi-mit-info">
  <strong>47.500 €</strong> Ersparnis 25 J
  <span class="badge badge--A">A</span>
  <span class="info-tip" data-tip="formel-tco-ersparnis">ⓘ</span>
</span>
```

**Verhalten:** Hover (Desktop) / Tap (Mobile) auf das ⓘ-Icon öffnet Tooltip-Popover.

**Inhalt-Schema:**
- Formel-Ausschnitt
- Annahmen
- Quellen-Verweis

**In C1:** Komponente angelegt mit Platzhalter-Inhalten. Echte Formeln und Quellen kommen in C2/C3/C4.

---

## 17. Profi-Modus-Toggle

Auf Ergebnis-Seite oberhalb der Panels. In C1 nur visueller Toggle, Funktion in C2.

**Geplant für C2:**
- Aktivierung blendet zusätzliche Pills ins Mini-Cockpit ein (Energiepreis-Override pro Energieträger, JAZ-Slider, CO₂-Pfad-Auswahl, Verkehrswert-Anpassung, eigener Bezugspreis-Override über Excel-Defined-Name `EigenerPreisAktuell`)
- Aktivierung blendet zusätzliche Detail-Sektionen in den Panels ein (Cashflow-Tabellen, IRR-Methodik, Vermögensbilanz)

---

## 18. Übergangs-Banner (Variante A+)

Beim Aufruf `rechner.html?flaeche=908&kosten=11500&heizung=gas`:

- JS liest URLSearchParams beim DOMContentLoaded
- Bei ≥ 1 Parameter: Banner im Hero einblenden
- Inhalt: "Du hast vorher Wohnfläche {X} m², Heizung {Z}, Jahreskosten {Y} € eingegeben. Übernehmen oder neu starten?"
- Zwei Buttons:
  - "Werte übernehmen" → Werte ins State-Objekt schreiben, Wizard starten mit vorbefüllten Schritten 1+2
  - "Neu starten" → Banner ausblenden, Wizard startet leer
- Default-Verhalten ohne Klick: Wizard startet leer, Banner bleibt sichtbar bis Klick

---

## 19. Teilen-Funktion

Button "Link mit deinen Werten teilen" in der Dialog-CTA-Sektion.

**Verhalten:**
- Klick generiert URL mit komplettem State (inkl. Schieberegler-Stand und Persona) als URLSearchParams: `rechner.html?gt=MFH&plz=99084&et=WEG&wf=950&hz=gas-bw&bj=1998&vb=95000&san=teil&nu=misch&pers=opt&pv=ja&zr=25&pg=10.5&pfw=17.5&pwp=26&fdr=50`
- `navigator.clipboard.writeText(url)`
- Toast-Meldung: "Link kopiert. Sie können ihn jetzt teilen."
- Empfänger öffnet Link → Wizard wird mit allen Werten vorbefüllt → direkt zur Ergebnis-Seite (oder Hero mit Übergangs-Banner, je nach Implementation)

---

## 20. Responsive Layout

**Desktop ≥ 1024 px:**
- Hero: Cover-Bild links, Text rechts
- Wizard: zentriert, max-width 600 px, ein Schritt pro Bildschirm
- Ergebnis-Seite: Annahmen-Box + Headline + Persona-Toggle + Mini-Cockpit + Profi-Toggle ganz oben, Panels gestackt mit max-width 900 px, Schieberegler-Cluster mit drei Spalten (alle drei Blöcke nebeneinander), Big Picture vollbreit, Pressetext-Block gestackt, Wegweiser als 4-Spalten-Grid

**Tablet 768–1023 px:**
- Wizard: max-width 90 %
- Mini-Cockpit als Wrap-Pill-Cluster (kein horizontaler Scroll)
- Schieberegler-Cluster: zwei Spalten (A oben quer, B + C nebeneinander)
- Wegweiser als 2-Spalten-Grid

**Mobile < 768 px:**
- Wizard: Vollbild, große Touch-Targets, Progress-Bar fix oben
- Mini-Cockpit: horizontaler Scroll-Container mit Pills (`overflow-x: auto`, snap-points)
- Panels und Schieberegler-Blöcke gestackt, Anker-Sprung-Navigation oben
- Methodik-Tooltips: Tap statt Hover, öffnet Modal-Overlay
- Slider haben min. 44 px Touch-Höhe
- Persona-Toggle: oben über dem Mini-Cockpit, drei Mini-Buttons in Reihe

---

## 21. Konsistenz zur bestehenden Website

**Übernehmen aus existierender `rechner.html`, `index.html`, `objekte/index.html`:**

- Farbsystem: `--petrol #1a5c5a`, `--petrol-dark #1a3535`, `--petrol-light #7ab8b5`, `--signal #CFF77F`, `--bg-light #f5f4f2`, `--text-primary #1a1a1a` etc.
- Typografie: Playfair Display (Headlines, Serif), Inter (Text, Sans-Serif)
- Header-Navigation: SVG-Logo "hausentscheider" mit Petrol-Linie
- Footer-Block: Petrol-Dark-Hintergrund, Daniel Schöberl, Erfurt/München, Impressum-Link
- Spacing-Konventionen: max-width 900 px, padding 0 2rem

**Hinweis:** Die existierende `rechner.html` (548 Zeilen) enthält bereits Hero und Subtext im richtigen Stil — Inhalt der neuen Hero-Phase übernehmen. Wizard-Phase und Ergebnis-Phase sind neu.

---

## 22. Was NICHT in C1

- Berechnungen (Annuität, TCO, IRR, Cashflow) → C2
- Panel-1-Inhalte (KPIs, Tabellen, 25-Jahres-Kurve, Vergleichs-Visualisierung) → C2
- Vermieter-Bilanz-Inhalte (5 Blöcke) → C2/C5
- WEG-Hinweis-Inhalte (Beschluss-Schwellen, Mehrheiten, Fristen) → C2/C5
- SVG-Radar Panel 2 → C3
- SVG-Radar Panel 3 (FRI) → C4
- Big Picture SVG-Implementation → C4
- Persona-Gewichtungs-Wirkung auf Panels → C2/C3/C4
- Schieberegler-Wirkung auf Panels → C2/C3/C4
- Profi-Modus-Funktion (zusätzliche Hebel) → C2
- Methodik-Tooltip-Inhalte (echte Formeln und Quellen) → C2/C4
- Pressetext-PNG-Download → C5
- Beste-Option-Berechnung im Pressetext → C2
- Cover-Bild generieren oder einbinden — Slot bleibt mit Platzhalter
- Verkaufsseite Excel-Edition → späterer Block, evtl. eigener Block G
- Methodik-Seite → mittelfristig, evtl. C4 oder F
- Anpassung von `objekte/index.html` und `preishistorie.html` auf JSON-Bezug → späterer Block (Sync-Block oder F)
- Tests, E2E-Validierung — Smoke-Test im Browser durch Daniel reicht

---

## 23. Prompt für die Claude-Code-Sitzung

```
Bitte arbeite Block C1 v3 der Web-Implementation „Der Entscheider" um.
Spec: 00_Projektsteuerung/260501_C1_BlockSpec.md (vollständig lesen, v3).

Datengrundlage:
- daten/parameter.json (existiert produktiv im Repo, 154 Defined Names,
  Stand 02.05.2026, 8 Block-Sektionen + Förderung Mai 2026 +
  Belegbarkeits-Felder)
- daten/preishistorie.json (existiert produktiv im Repo, Mai 2026 als
  aktueller Monat: Gas 10,5 / FW 17,5 / Heizöl 13,5 / WP-Strom 26,0 /
  Pellets 7,5 ct/kWh)
- Bestehende Seiten als Stil-Referenz: rechner.html (existiert, wird
  überschrieben), index.html, objekte/index.html

Ergebnis dieser Sitzung:

1. rechner.html überschrieben — Hero, Wizard 3 Schritte mit 9
   Pflichtfeldern + PV-Toggle, Berechnungs-Übergang, Ergebnis-Seite
   mit Annahmen-Transparenz-Box + Headline-Antwort + Persona-Toggle
   + Mini-Cockpit + Profi-Toggle + drei Panel-Platzhaltern + drei
   Schieberegler-Blöcken + Big Picture + Wegweiser + Pressetext-Block
   + Footer + Dialog-CTA + Teilen-Button. Phase-Wechsel per JS-State.

2. Konditionale Verzweigungen funktional:
   - PLZ Erfurt-Altstadt → FW-Satzungs-Hinweis
   - MFH-Auswahl → Eigentümer-Typ-Feld erscheint
   - Heizlast > 30 kW + Innenstadt → Pellets-Option grau
   - Nutzungsart ≠ Selbstnutzung → Vermieter-Bilanz-Container sichtbar
   - Eigentümer-Typ "WEG" → WEG-Hinweise-Container sichtbar

3. Smart Defaults:
   - Verbrauch leer + Wohnfläche + Sanierungsstand → Heizlast-Hilfsregel-Hint
     mit geschätztem Wert
   - EFH/MFH-Wechsel → Defaults aus parameter.json laden

4. URL-Parameter-Banner funktional (Variante A+).

5. Annahmen-Transparenz-Box: Tabelle wird beim Berechnen-Klick
   aus State + Smart-Defaults befüllt.

6. Belegbarkeits-Badges A/B/C als wiederverwendbare Komponente,
   in C1 mit Platzhalter-Werten.

7. Drei Schieberegler-Blöcke: UI funktional, Default-Werte aus JSON,
   State-Updates loggen in Console (Wirkung in C2/C3/C4).

8. Persona-Picker doppelt platziert (Wizard-Ende + Ergebnis-Toggle):
   UI-State funktional, Gewichtungs-Wirkung in C2/C3/C4.

9. Pressetext-Block: Template-Engine, Auto-Befüllung aus State,
   Kopier-Button (clipboard), Mail-Button (mailto), PNG-Button disabled.

10. Methodik-Glasbox als Tooltip-Komponente angelegt.

11. Teilen-Funktion: URL-Encoding aller State-Felder + Schieberegler-Stand
    + Persona, navigator.clipboard.writeText.

12. Mobile-Verhalten: Wizard Vollbild, Ergebnis-Seite mit Pill-Scroll
    und Anker-Sprung-Navigation.

13. KEINE Berechnungen, keine echten Panel-Inhalte, keine SVG-Visualisierungen.

Akzeptanz-Kriterien siehe Spec Abschnitt 2 — alle 22 Punkte müssen
erfüllt sein.

Wichtig:
- Single-File HTML mit Inline-CSS und Inline-JS (kein Framework)
- Defined-Name-Schlüssel in JSON sind 1:1 aus Excel
- Farbsystem und Typografie aus existierenden Seiten übernehmen
- Wizard-Defaults beim EFH/MFH-Wechsel automatisch aus parameter.json
- Konditionale Komponenten-Sichtbarkeit per JS-State, kein CSS-Trick
- Persona-Picker und Schieberegler-Blöcke State-Schlüssel sauber
  trennen von Wizard-State (overrides-Subobjekt)

Bitte zuerst Plan vorlegen (Regel 7 der CLAUDE.md im Repo-Root),
warten auf OK, dann umsetzen.
```

---

## 24. Erwarteter Ablauf der Sitzung

1. Daniel öffnet Claude Code, kopiert den Prompt aus Abschnitt 23.
2. Claude Code legt Plan vor (Datei-Struktur, Phase-State-Maschine, Komponenten-Hierarchie, JSON-Lade-Strategie, konditionale Verzweigungs-Logik).
3. Daniel kopiert Plan in Chat zur gemeinsamen Prüfung (Vier-Augen-Prinzip).
4. Nach OK: Claude Code setzt um.
5. Daniel öffnet `rechner.html` lokal (oder via Netlify-Preview), prüft die 22 Akzeptanz-Kriterien (am besten mit Mobile-Emulation in Chrome DevTools).
6. Iteration falls nötig.
7. Commit und Push durch Daniel über GitHub Desktop.

**Geschätzter Aufwand Daniel:** 4 Stunden inkl. Plan-Prüfung, Browser-Tests, Mobile-Check, Iterationen. Mehr als bei v2 wegen erweitertem Scope (9 Pflichtfelder, drei Schieberegler-Blöcke, Persona-Picker, Big Picture, Pressetext-Block, Belegbarkeits-Badges, Annahmen-Transparenz-Box, konditionale Verzweigungen) — aber dafür ist das Skelett für C2/C3/C4 deutlich besser vorbereitet.

---

## 25. Versions-History

| Version | Datum | Änderung |
|---|---|---|
| v1.0 | 30.04.2026 | Initial — Single-Page-Cockpit, 7 Eingaben |
| v2.0 | 01.05.2026 | Modell Z (Wizard + Ergebnis-Seite), 7+1 Pflichtfelder, drei Panel-Platzhalter, JSON-Datenarchitektur |
| v3.0 | 02.05.2026 | 9-Pflichtfelder-Wizard, drei Schieberegler-Blöcke, Persona-Picker, Big Picture, Pressetext-Block für Journalisten, Belegbarkeits-Badges A/B/C, Annahmen-Transparenz-Box, Heizlast-Hilfsregel als Smart Default, eigener Bezugspreis als Override, konditionale Verzweigungen (FW-Satzung / Pellets-Filter / Vermieter / WEG), Wegweiser-Block, Dialog-CTA, 154 Defined Names |
