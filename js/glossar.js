/* ==============================================================
   glossar.js — Begriffe & Abkürzungen für Tooltip-Pattern
   ES-Modul, von ergebnis.js importiert (renderTooltipFromGlossar).

   Spec: docs/C2_BlockSpec_v2.0.md §17 Punkt 5
   Memory: project_designsystem.md §4 (Tooltip-Pattern)

   Folgeaufgabe v2.1: build_json.py exportiert Excel-Tab `Begriffe`
   nach daten/glossar.json. Bis dahin lebt das Lookup hier.

   Schlüssel = Anzeige-Form (case-sensitive). Werte:
   - lang:    Vollform / Begriffs-Auflösung
   - text:    1–2 Sätze laienverständliche Erklärung
   - quelle:  optional, Q-Kürzel oder Link
   - smart:   true = Antizipations-Inhalt (Smart-Icon statt ⓘ)
   ============================================================== */

'use strict';

const GLOSSAR = {
  EPBD: {
    lang: 'Energy Performance of Buildings Directive (EU-Gebäuderichtlinie)',
    text: 'EU-Vorgabe für die Energieeffizienz von Gebäuden. Ab 2028 sollen die '
        + 'schwächsten Effizienzklassen schrittweise modernisiert werden — bei '
        + 'Nicht-Konformität droht ein Marktwert-Abschlag von ca. 7 %.',
    quelle: 'Q-EPBD',
    smart: true
  },
  BAFA: {
    lang: 'Bundesamt für Wirtschaft und Ausfuhrkontrolle',
    text: 'Vergibt die Investitionszuschüsse für Heizungs-Modernisierung im Rahmen '
        + 'der BEG (Bundesförderung effiziente Gebäude). Grundförderung 30 %, '
        + 'Klimabonus 20 % (sinkt 2029/2031), Einkommensbonus 30 %, Effizienzbonus 5 %.',
    quelle: 'Q-BAFA-2026'
  },
  KfW: {
    lang: 'Kreditanstalt für Wiederaufbau',
    text: 'Bietet zinsgünstige Kredite und Tilgungszuschüsse zur BAFA-Förderung dazu. '
        + 'Ergänzungskredit 358/359 für Wohngebäude, Tilgungszuschuss bis 20 % auf '
        + 'den Restkredit.',
    quelle: 'Q-KFW-261'
  },
  GMG: {
    lang: 'Gebäudeenergiegesetz',
    text: 'Deutsches Gesetz zur Energieeffizienz und Heizungs-Pflicht. Ab 2024 '
        + 'mindestens 65 % erneuerbare Energie für neue Heizungen — gilt auch für '
        + 'Bestandsgebäude in Stufen.',
    quelle: 'Q-GMG'
  },
  FRI: {
    lang: 'Future Readiness Index',
    text: 'Sechsachsige Gesamtbewertung aus dem Eco-2050-Future-Readiness-Ansatz: '
        + 'Wirtschaftlichkeit, Nachhaltigkeit, Resilienz, Erweiterbarkeit, '
        + 'Zukunftsfähigkeit, Risiko. Im Big Picture als Netzdiagramm sichtbar.',
    quelle: 'Q-ECO-2050',
    smart: true
  },
  BEG: {
    lang: 'Bundesförderung effiziente Gebäude',
    text: 'Sammel-Begriff für Förderprogramme von BAFA und KfW für energetische '
        + 'Gebäude-Modernisierung — inkl. Heizung, Dämmung, Fenster, Lüftung.',
    quelle: 'Q-BEG'
  },
  BEHG: {
    lang: 'Brennstoff-Emissionshandelsgesetz',
    text: 'Regelt den nationalen CO₂-Preis für fossile Brennstoffe (2025: 55 €/t). '
        + 'Seit 2023 gilt das Stufenmodell für die Aufteilung auf Vermieter und '
        + 'Mieter — Vermieter trägt bis zu 95 % bei schwachen Effizienzklassen.',
    quelle: 'Q-BEHG',
    smart: true
  },
  'EU-ETS': {
    lang: 'European Emissions Trading System (Europäisches Emissionshandelssystem)',
    text: 'Ab 2027 erweitert auf Gebäude und Verkehr (EU-ETS2). Realistisch '
        + '130–200 €/t CO₂ bis 2035 — überlagert das nationale BEHG-Stufenmodell.',
    quelle: 'Q-EU-ETS',
    smart: true
  },
  MEA: {
    lang: 'Miteigentumsanteil',
    text: 'Anteil der einzelnen Eigentümer am Gemeinschafts-Eigentum einer WEG. '
        + 'Die Verteilung von Sonderumlagen (z. B. Heizungs-Investition) erfolgt '
        + 'nach MEA, sofern nicht durch Beschluss anders geregelt.',
    quelle: 'Q-WEG'
  },
  JAZ: {
    lang: 'Jahresarbeitszahl',
    text: 'Zentrale Effizienz-Kennzahl der Wärmepumpe: wie viel Wärme produziert '
        + 'sie pro kWh Strom übers Jahr? Hersteller-Wert oft optimistisch — '
        + 'Sicherheits-Abschlag von 0,3 sinnvoll. Default 3,8.',
    quelle: 'Q-JAZ-01'
  },
  DVGW: {
    lang: 'Deutscher Verein des Gas- und Wasserfaches',
    text: 'Technisch-wissenschaftlicher Verein. Studien zur H₂-Umstellung der '
        + 'Gas-Infrastruktur — Umrüst-Kosten 250–400 €/m Leitung, ca. 10–15 T€ '
        + 'pro MFH bei Vollumstellung.',
    quelle: 'Q-DVGW',
    smart: true
  },
  AGFW: {
    lang: 'Energieeffizienzverband für Wärme, Kälte und KWK (Branchenverband Fernwärme)',
    text: 'Veröffentlicht den AGFW-Median für Fernwärme-Effektivpreise '
        + '(bundesweit ca. 15,7 ct/kWh). Erfurt-Effektivpreis liegt aktuell '
        + 'bei ca. 17,5 ct/kWh — über dem Bundesschnitt.',
    quelle: 'Q-AGFW-2026'
  },
  'Annuität': {
    lang: 'Annuität (jährliche Belastung nach VDI 2067)',
    text: 'Konstante jährliche Zahlung, die Investition + Förderung + laufende '
        + 'Kosten + Zins über die Lebensdauer abbildet. Annuitätenfaktor a bei '
        + '3 % Zins und 25 J ≈ 0,05743.'
  },
  'Barwertfaktor': {
    lang: 'Barwertfaktor (preisdynamisch nach VDI 2067)',
    text: 'Multiplikator, der eine jährlich steigende Größe (z. B. Energiekosten) '
        + 'auf den heutigen Barwert zurückrechnet. Hängt von Preissteigerungs-Rate r '
        + 'und Kalkzins i ab. Für Gas (r=3 %, i=3 %, n=25): b ≈ 24,27.'
  },
  'Sanierungsstand': {
    lang: 'Sanierungsstand des Gebäudes',
    text: 'Saniert: Dämmung + Fenster + ggf. Lüftung modernisiert, Effizienzklasse '
        + 'C oder besser. Teilsaniert: mindestens eine wesentliche Maßnahme '
        + 'erfolgt. Unsaniert: Bestand wie ursprünglich.'
  },
  'Sondereigentum': {
    lang: 'Sondereigentum (im Gegensatz zum Gemeinschafts-Eigentum)',
    text: 'Teile einer WEG, die einem einzelnen Eigentümer allein gehören (z. B. '
        + 'Wohnung). Heizungs-Anlage in Mehrfamilienhäusern ist meist '
        + 'Gemeinschafts-Eigentum.',
    quelle: 'Q-WEG'
  },
  'Vermögensbilanz': {
    lang: 'Vermögensbilanz (kumuliert über Betrachtungszeitraum)',
    text: 'Saldo aus Investition, Förderung, KfW-Anteil, AfA-Effekt, '
        + 'Modernisierungs-Umlage, CO₂-Vermeidung, Mieterstrom-Erlös, '
        + 'Marktwert-Premium und EPBD-Risiko. Negativ = Vermögensgewinn aus '
        + 'Modernisierung gegenüber Status quo.'
  },
  'Erhaltungsrücklage': {
    lang: 'Erhaltungsrücklage (GdW-Richtwert)',
    text: 'Empfehlung des GdW für Bestandsgebäude: 13–17 €/m² Wohnfläche pro '
        + 'Jahr Rücklage. Deckt anstehende Sanierungen, Reparaturen, '
        + 'Modernisierungen ohne Sonderumlage.',
    quelle: 'Q-GDW-01'
  }
};

/* --------------------------------------------------------------
   Helper: Lookup mit Fallback
   -------------------------------------------------------------- */

function getGlossarEintrag(begriff) {
  if (begriff in GLOSSAR) return GLOSSAR[begriff];
  // Case-insensitive Fallback
  const key = Object.keys(GLOSSAR).find(k => k.toLowerCase() === String(begriff).toLowerCase());
  return key ? GLOSSAR[key] : null;
}

export { GLOSSAR, getGlossarEintrag };
