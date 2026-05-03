---
name: Hybrid-Risiko-Modellierung — Lücken und Folgeaufgaben
description: Excel-Default rechnet konservativ-optimistisch für Hybrid. Sechs nicht abgebildete Risiken plus Folgeaufgaben für Spec v1.2, Excel-Patch und Web-Risiko-Banner.
type: project
---
**Daniel-Befund 03.05.2026 nach C2-Implementation und Hybrid-Empfehlung im MFH-Default:**

Die Excel rechnet die Hybrid-Option mathematisch sauber (70 % WP + 30 % Gas-BW, gewichteter Wirkungsgrad 2,948, gewichteter Preis 0,2007 €/kWh, Wartungsquote 3,0 %, CO₂-Faktor 0,059 kg/kWh = 30 % von Gas). Die Default-Werte sind aber **konservativ-optimistisch** — neun Hybrid-spezifische Risiken sind nicht oder nur statisch abgebildet:

**USP der Plattform — Antizipation als Alleinstellungsmerkmal (Daniel-Formulierung 03.05.2026 abend):**

> „Das ist ja auch das Alleinstellungsmerkmal, dass man nicht nur den Status quo hat, sondern dass man auch antizipiert tatsächlich mit Gaspreissteigerungen, mit Grüngasquote, mit Wasserstoff, mit politischen Spannungen, Knappheit oder geopolitischen Konflikten. Mögliche Faktoren, die dazu führen, dass nicht ständig künstlich günstig gehalten werden kann."

Das Web differenziert sich von Status-quo-Rechnern (Heizungsbauer, Versorger, Stadtwerke), die die heutige Kostenrechnung als ewige Wahrheit präsentieren. Die Hausentscheider-Plattform macht zukünftige Entwicklungen explizit und transparent — das ist nicht nur fachlich richtig, sondern das **Verkaufs-Argument** gegenüber Status-quo-Wettbewerbern und gegenüber der Excel-Edition (Excel hat die volle Sensitivitäts-Tiefe, Web hat die didaktische Antizipations-Klarheit).

**Sechs Modellierungs-Lücken:**

1. **CO₂-Preis statisch über 25 Jahre.** Excel rechnet konstant 105 €/t (Pfad „mittel"). Real: 55 €/t (BEHG 2025) → EU-ETS2 ab 2027 → realistisch 130–200+ €/t bis 2035. Konstanter CO₂-Preis unterschätzt das Hybrid-Risiko systematisch, weil der Gas-Anteil über die Zeit überproportional teurer wird.

2. **Gas-Preis-Steigerung 3 %/a Default.** Konservativ. Aktuell politisch gedämpft (Gaspreis-Bremse, reduzierte MwSt., CO₂-Preis-Streckung). Realistische 25-J-Annahme bei Subventions-Auslauf eher 4–6 %/a. Range geht bis 8 %/a — User kann Schieberegler nutzen, aber Default unterschätzt.

3. **Wasserstoff-/H2-Umstellung der Gas-Infrastruktur.** Nicht modelliert. Wenn Gasnetz auf H2 umgestellt wird (politisch unklar, technisch teuer), braucht es H2-fähige Brenner — Folge-Investition in 10–20 J Horizont. Bei reiner WP irrelevant, bei Hybrid relevant.

4. **Grüngasquote-Steigerung über Zeit.** Excel hat `Gruengas.default = 0.03` statisch. GMG sieht ab 2029 10 % Grüngasquote vor. Grüngas ist 2–3× teurer als fossiles Gas → 3–5 ct/kWh Mehrkosten ab 2029. Excel hat keinen Sinkpfad/Steigerungs-Pfad.

5. **Stranded-Asset-Risiko Gasnetz.** Kommunale Wärmeplanung schreibt vor 2028 Gas-Stilllegungs-Plan vor. Wenn Gasnetz Erfurt-Altstadt 2035–2040 stillgelegt wird, ist Hybrid-Investition 2026 ein Stranded Asset (Restwert 0, Folge-Investition WP/FW erforderlich). Risiko-Aufschlag fehlt komplett.

6. **„Zwei Systeme" — Komplexitäts-Reparatur-Risiko.** Wartungsquote 3,0 % deckt routinemäßige Wartung ab. Aber: zwei Komplexitäts-Quellen → höheres Ausfall-Risiko, höhere Reparatur-Kosten bei Defekt. Excel-Reparatur ist gebäudebezogen pauschal — unterschätzt den Hybrid-Reparatur-Pfad.

7. **Geopolitische Konflikte und Versorgungs-Knappheit (NEU 03.05. abend).** Pipeline-Sabotage, LNG-Engpässe, Sanktionen, Handelskonflikte → Gas-Preis-Spikes wie 2022 (auf bis 30 ct/kWh kurzzeitig). Excel-Modell mit fester 3 %/a-Steigerung kann das nicht abbilden. Bei Hybrid trifft das die Gas-30 %-Komponente direkt; Wärmepumpe ist über Strom-Mix indirekt betroffen, aber gedämpft.

8. **Politische Volatilität — Subventions-Pfade können wechseln (NEU).** Aktuelle Gas-Preis-Bremse, reduzierte MwSt., gestreckte CO₂-Preis-Pfade sind politische Entscheidungen, die auslaufen können. Bei Regierungs-Wechsel oder Haushalts-Druck können Gas-Subventionen entfallen → Sprung-Anstieg statt linearer Steigerung. Das Excel-Modell rechnet linear-prognostisch, nicht ereignis-basiert.

9. **Strom-Gas-Korrelation für Wärmepumpe (NEU, betrifft auch WP, nicht nur Hybrid).** WP-Strom kommt zu ~30–40 % aus Gas-Verstromung (Mittellast). Steigt der Gas-Preis, steigt auch der Strom-Preis — wenn auch gedämpfter. Die Excel rechnet WP-Strom-Steigerung 2,5 %/a unabhängig von Gas-Steigerung. Tatsächlich ist die Korrelation positiv: Gas +5 % → Strom-Mittellast +2 bis 3 %. Das ist ein systemisches Risiko, das die Modellierung nicht abbildet.

**Stress-Test-Heuristik:**

Mit zwei zusätzlichen Risiko-Annahmen (CO₂ 125 €/t, Gas-Steigerung 5 %/a, Stranded-Asset-Aufschlag 30k) kippt die Empfehlung im MFH-Default von Hybrid zu WP. Die Default-Hybrid-Empfehlung ist also **nicht falsch**, aber **eine konservative Sicht** unter mehreren legitimen Modell-Annahmen.

**Folgeaufgaben (Priorisierung):**

**Spec v1.2 (NEU §3.9 Risiko-Banner-Logik):**
Pro Empfehlungs-Option ein Risiko-Banner mit den modell-spezifischen Grenzen:
- Hybrid: CO₂-Preis-Volatilität, Grüngasquote, Stranded Asset, H2-Umstellung
- WP: Strom-Sondertarif-Risiko, JAZ-Realität-Abschlag
- FW: Versorger-Monopol, Effizienz-Paradoxon, keine Wechsel-Option
- Gas: EPBD-Risiko, CO₂-Verteuerung, kommunale Wärmeplanung

Plus Methodik-Tooltip-Ergänzung: „wir rechnen statisch, real ist es dynamisch — Schieberegler nutzen für Risiko-Szenarien".

**Excel (bidirektionale Optimierung):**
1. CO₂-Preis als Pfad-Kurve (z. B. 55 €/t 2026, 95 €/t 2027 EU-ETS2, 130 €/t 2030, 180 €/t 2035, dann linear) — methodischer Excel-Patch
2. Stranded-Asset-Sensitivität in Vermieter-Bilanz Block 5 als 7. Szenario: „Gasnetz Innenstadt vor 2040 stillgelegt — Hybrid-Restwert 0"
3. Grüngasquote-Sinkpfad — ab 2029 10 % im `Gruengas.default`, dann steigend
4. Hybrid-Reparatur-Aufschlag prüfen — entweder Wartungsquote auf 3,5 % oder eigener „Komplexitäts-Aufschlag"

**Web (im aktuellen C2-Stand schon möglich):**
- Schieberegler im Web (CO₂-Pfad, Gas-Preis-Steigerung) erlauben dem User eigene Risiko-Szenarien
- Pellets-Filter und FW-Satzungs-Hinweis sind bereits konditional eingebaut
- Risiko-Banner kommt in v1.2

**Iterations-Plan (Daniel-Frage 03.05. abend „ab wann tatsächlich"):**

Drei Schritte, gestaffelt nach Komplexität und Dringlichkeit:

1. **Web-Schnell-Patch Risiko-Banner (1–2 Stunden, nicht-blockierend für C2-Live):**
   Statisches HTML/JS, keine JSON- oder Excel-Anpassung nötig. Einfacher Banner-Block in `rechner.html`, der je nach Empfehlungs-Option einen Risiko-Block aus einem Lookup zieht. Nutzt den bestehenden `bestOption`-Wert aus der Empfehlung.
   → Sofort umsetzbar, nicht-blockierend für jeden anderen Pfad.

2. **Excel-Patch v2.1 (gebündelt mit nächstem Excel-Update, ~2–4 Wochen):**
   Strukturelle Methodik-Erweiterung — CO₂-Preis als Pfad-Kurve, Stranded-Asset-Sensitivität, Grüngasquote-Sinkpfad, Komplexitäts-Aufschlag Hybrid, Strom-Gas-Korrelations-Faktor. Build_json.py exportiert die neuen Werte, JSON wird automatisch ausgewählt aktualisiert. Web-Engine zieht neue Werte ohne Code-Änderung.
   → Größerer Eingriff, aber methodisch sauber. Diskussion mit Becker oder externem Energie-Wirtschaftler vor Excel-Edit empfehlenswert.

3. **Spec-Patch v1.2 (Spec §3.9 Risiko-Banner-Logik formal spezifizieren, parallel zu Excel-Patch):**
   Saubere Doku, was ein Banner ist, welche Texte je Option, welche Trigger. Wird Bestandteil der nächsten Code-Implementations-Sitzung (C3 oder eigener Block).
   → Folgt Schritt 1, übernimmt das dort entstandene Pattern in die Spec.

**Strategische Empfehlung:**

Schritt 1 jetzt einbauen. Macht den USP transparent ohne Modell-Eingriff. Schritte 2 + 3 parallel als nächste Bauphasen. Excel-Patch v2.1 ist das größere Vorhaben, weil es fachliche Diskussion erfordert (welche CO₂-Pfad-Kurve? Welcher Stranded-Asset-Aufschlag? Welche Strom-Gas-Korrelation?). Hier kommt Anstoß für Beratungs-Service auf — Daniel kann als Hausentscheider-Berater diese Diskussion mit Kunden aktiv führen.

---

## Inhaltliche Belege aus Daniels Investitionsplan-Dokument 2025 (Theaterstraße 4, Erfurt)

Ergänzung 03.05.2026 abend nach Daniels Hinweis auf das Dokument `251124_Investitionsplan_2025-2035_Theaterstr.4_Erfurt.docx` in `03_Referenzobjekt_Theaterstrasse_4/Heizung_Sachstand_und_Angebote/`.

**Risiken Hybrid (Verbraucherzentrale-Bezug):**
- Höhere Anfangsinvestition als reine WP
- Gas-Notanker-Funktion bei WP-Ausfall oder extremen Minusgraden
- Doppelte Abhängigkeit (Gas + Strom) über Ressourcen, Technologie-Entwicklungen, Regulierungen, Wartungen, Infrastrukturen, politische Rahmenbedingungen, Zukunftsaussichten
- Hybrid als Übergangstechnologie kann Stranded Asset werden

**Klima- und politische Termine:**
- Deutschland Klimaneutralität bis 2035 (Ziel-Korridor)
- Verbot Öl-/Gas-Heizungen ab 2045
- Bereits ab 2040 keine fossilen Heizkessel mehr
- Klimavertrag-Bindung Deutschlands

**Gas-spezifische Auslauf-Risiken:**
- Erdgas wird zum Auslaufmodell — Netzentgelte verteilen sich auf weniger Verbraucher → steigend
- Großer Teil des Gasnetzes wird 2045 stillgelegt, kleiner Teil auf H₂ umgerüstet
- LNG-Anteil aus den USA steigt — Fracking-Gas, lange Transportwege, Tankschiffe bei −162 °C
- LNG-Risiken: leicht entzündlich, Methan-Leckage (klima-schädlicher als CO₂), volatil im Marktpreis
- Gas-Herkunfts-Transparenz nicht 100 %

**Wasserstoff-Umstellung — DVGW + Agora-Werte:**
- Bestehende Stahl-/PE-Leitungen: bis 20 % H₂-Beimischung sicher transportierbar
- 100 %-H₂-Umstellung erfordert Anpassung an Druckregelstationen, Hausanschluss, Armaturen, Dichtungen, Brennertechnik
- Wasserstoff-Kernnetz-Ausbau (BNetzA-Genehmigung 2025) betrifft primär Fernleitungen
- Wohnquartiere/Verteilnetze: Umstellung erst nach 2035–2040 schrittweise
- Bis dahin bleibt der lokale Gasanschluss faktisch fossil
- **Umbaukosten Bestand: 250–400 € pro m Leitung** (Prüfung, Dichtheit, Ventil-/Brennerwechsel, ggf. neue Abgasführung)
- **Pro MFH (30–40 m Anschlussstrecke): 10.000–15.000 € Zusatzaufwand** — in Hybrid-Kalkulation aktuell nicht enthalten
- H₂-Energiedichte 1/3 von CH₄ → höhere Volumenströme, größere Rohrquerschnitte oder Druckerhöhungen erforderlich

**Konsequenz für Hybrid-Wirtschaftlichkeit (Daniels Rechnung):**
Mit konservativen +10–15 T€ Umrüstkosten bis 2040 steigt die Hybrid-Investition von ~96 T€ auf ~110 T€ brutto — wirtschaftlich fast gleichauf mit reiner WP, aber ohne deren Förder-Vorteile oder CO₂-Befreiung.

**H2-ready Gasbrennwertkessel (kritisch):**
- Viele „H2-ready"-Kessel sind nur auf 20 % H₂-Anteil ausgelegt
- Vollständige Umstellung erfordert teure Anpassungen oder Neukauf

**Wasserstoff-Betriebskosten-Unsicherheit:**
- Grüner Wasserstoff aktuell noch teurer als fossiles Gas oder WP-Strom
- Infrastruktur-Kosten, Betriebskosten und Verfügbarkeit unsicher

**Klima-Realität (Stand 2025):**
- CO₂-Gehalt der Atmosphäre liegt bei ~422 ppm — bereits über planetaren Grenzen für Klimastabilität
- 2024 global wieder das wärmste Jahr seit Aufzeichnungen
- Europa erhitzt sich am schnellsten unter allen Kontinenten
- Erfurt: zunehmend mehr Sonnentage und Hitzeperioden am Stück
- Meeresspiegel-Anstieg, Kipppunkte werden erreicht

**Generationen-Verantwortung als moralischer Anker:**
- Heizungs-System lebt 18–25 Jahre
- Was 2026 eingebaut wird, prägt den Klima-Beitrag des Gebäudes für die nächste Generation
- Klimaneutralität 2045 als Voraussetzung für die nächste Generation, nicht als technisches Ziel

**Versorgungs-Unabhängigkeits-Dimension:**
- Geopolitische Konflikte als reale Versorgungs-Risiken (Beispiel Straße von Hormuz, Pipeline-Sabotage)
- Dezentral und lokal = unabhängiger
- Strom-Mix wird zunehmend erneuerbar, Gas bleibt importabhängig

**Linksammlung (für Web-Quellen-Tooltip und Excel-Quellen-Tab):**
- FAZ — „Auf Gasverbraucher kommen höhere Preise zu: Erdgas wird zum Auslaufmodell": https://www.faz.net/aktuell/wirtschaft/klima-nachhaltigkeit/auf-gasverbraucher-kommen-hoehere-preise-zu-erdgas-wird-zum-auslaufmodell-110007912.html
- n-tv — „Energieagentur sorgt sich um Gasversorgung im Winter": https://www.n-tv.de/wirtschaft/Energieagentur-sorgt-sich-um-Gasversorgung-im-Winter-article25268762.html
- Merkur — „Gaspreise seit 2021 um über zwei Drittel gestiegen": https://www.merkur.de/wirtschaft/gaspreise-seit-2021-um-ueber-zwei-drittel-gestiegen-und-der-anstieg-geht-auch-ab-2025-weiter-zr-93333958.html
- Enpal — „Gaspreisentwicklung 2024": https://www.enpal.de/waermepumpe/gaspreisentwicklung
- Thüringer Allgemeine — „Gaspreis in Thüringen auf bundesdeutschem Rekordniveau": https://www.thueringer-allgemeine.de/wirtschaft/article407486031/gaspreis-in-thueringen-auf-bundesdeutschem-rekordniveau.html
- science.lu — „Studie weltweite CO₂-Emissionen werden 2024 neuen Rekordwert erreichen": https://www.science.lu/de/studie-weltweite-co2-emissionen-werden-2024-neuen-rekordwert-erreichen
- YouTube — „Energiewende: Kriegen wir noch die Kurve? (2024)": https://www.youtube.com/watch?v=_PGMqXQnuHY

**Wichtig für Web-Risiko-Banner und Sensibilisierungs-Block:**
Die Auflistung soll **nicht** als grünes Bashing wirken. Pattern „logisch, konsequent, fachlich, vorausschauend" — der Unterschied zwischen Status-quo-Rechnern (die nur mit aktuellen Gaspreisen rechnen) und Hausentscheider (der die Risiken im Blick hat). Balance ist wichtig: Antizipation als Service, nicht als Drohung.

## 10 Punkte Sensibilisierungs-Block (Web, fossile Energie)

Finalisierter Block für Spec v2.0. Pattern: Standard-Basisaussage, sichtbar bei jeder Empfehlung, in Kontextblau mit Smart-Icon (Glühbirne mit Strahlen-Aura).

1. **CO₂-Preis steigt** ab 2027 (EU-ETS2) — heute 55 €/t, bis 2035 realistisch 130–200 €/t
2. **Gas-Subventionen können entfallen** — Gaspreis-Bremse, reduzierte MwSt., gestreckter CO₂-Preis sind politische Entscheidungen
3. **Geopolitische Konflikte** verursachen Gas-Spikes (2022 kurzzeitig 30 ct/kWh; Pipeline-Sabotage, Hormuz-Beispiel)
4. **Grüngasquote ab 2029** (10 %) macht Gas pro kWh teurer
5. **Stranded-Asset-Risiko Gasnetz** — kommunale Wärmeplanung könnte Gasnetz vor 2040 stilllegen
6. **Wasserstoff-Umstellung** — bestehende Brenner brauchen Anpassung, Umrüst-Kosten 10–15 T€ pro MFH
7. **EPBD-Klassen-Anforderungen** ab 2028 — schwächste Klassen können Marktwert-Abschlag bringen
8. **Mietspiegel-Argumentation** wird mit Energie-Effizienz-Verschlechterung schwieriger
9. **Klima-Realität** — CO₂-Gehalt der Atmosphäre bei ~422 ppm bereits über planetarer Grenze. 2024 global wärmstes Jahr; Europa erhitzt sich am schnellsten
10. **Generationen-Verantwortung** — Klimaneutralität 2045 als Voraussetzung für die nächste Generation. Was 2026 eingebaut wird, prägt den Klima-Beitrag des Gebäudes für 18–25 Jahre

11. **Mieter-Vermieter-Aufteilungs-Trend** — der Vermieter trägt zunehmend Mit-Verantwortung für die Folgekosten seiner Heizungs-Wahl. **Beschlossen:** CO₂-Preis-Aufteilung nach BEHG-Stufenmodell seit 2023 (Vermieter-Anteil bis 95 % bei schwachen Effizienzklassen). **In Diskussion:** Gas-Netzentgelte-Aufteilung (Bundesnetzagentur-Eckpunkte 2024 zur „verursachergerechten Verteilung" — aktuell trägt Mieter alles, künftig vermutlich anteilig). **Strategischer Trend:** Grüngasquote-Aufschlag und weitere Kosten-Komponenten werden ggf. künftig anteilig auf Vermieter umgelegt. Wer in fossile Heizung investiert, kann nicht mehr darauf vertrauen, dass alle Folgekosten Mieter-Sache bleiben.

Closer-Satz: *„Diese Faktoren sind bewusst nicht in der Default-Berechnung — die Excel-Edition modelliert sie als Sensitivitäts-Szenarien explizit."*

**Why:** Daniel hat das Prinzip am 03.05.2026 verankert: „Es geht hier wirklich um vorausschauende Entscheidungen, die jetzt getroffen werden müssen. Es muss auch Antizipation rein, die noch nicht in Stein gemeißelt sind. Aber das macht's authentisch." Die Excel ist die methodische Wahrheit, aber die Wahrheit der Welt entwickelt sich — und das Web sollte transparent machen, was die Excel an Risiken nicht abbildet, statt sie zu verstecken.

**How to apply:**
- Bei jeder Empfehlung im Web (TCO, IRR, Persona-Score): die spezifischen Risiken der empfohlenen Option transparent machen
- Schieberegler-CTA: „Probiere die Schieberegler" als Standard-Verweis bei Risiko-Banner
- Excel-Patches sammeln und in einem gebündelten v2.1-Update der Excel umsetzen — nicht stückweise, weil Methodik zusammenhängend ist
- Memory `feedback_excel_kontinuierliche_optimierung.md` ist die übergeordnete Konvention dafür
