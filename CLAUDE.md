# CLAUDE.md — Hausentscheider.de

## Kontext

Dieses Repository enthält die Website hausentscheider.de — eine unabhängige
Plattform für Eigentümer in der Wärmewende. Die strategische Grundlage
ist das Gesamtkonzept (Stand v2.3) und das Farbsystem (Referenzfassung).
Beide werden im jeweiligen Chat als Referenz bereitgestellt.

## Aktuelle Phase

Umsetzung des überarbeiteten Gesamtkonzepts in die bestehende Website.
Fortschritt rund 60 Prozent. Ziel: gezielte, ressourcenarme Änderungen
Schritt für Schritt. Keine neuen Baustellen aufmachen.

## Arbeitsweise

1. **Im Hauptzweig arbeiten.** Keine neuen Branches anlegen, ohne dass
   ich es ausdrücklich anweise. Änderungen erfolgen direkt in der
   bestehenden Struktur.

2. **Bestehende Dateien editieren, nicht duplizieren.** Wenn eine Datei
   geändert werden muss, ändere sie direkt. Keine parallelen Varianten
   wie dateiname_v2.tsx oder dateiname_neu.tsx anlegen.

3. **Keine Refactorings ohne Auftrag.** Auch wenn dir auffällt, dass
   Code eleganter strukturiert werden könnte, refaktorisiere nichts,
   was nicht explizit Teil der Aufgabe ist.

4. **Minimalinvasiv.** Führe die kleinstmögliche Änderung durch, die
   das Ziel erreicht. Keine Zusatz-Features, keine vorsorglichen
   Verbesserungen, keine Begleit-Aufräumarbeiten.

5. **Bei Unsicherheit fragen, nicht spekulieren.** Wenn unklar ist,
   wie eine Änderung umgesetzt werden soll, frag nach — statt einen
   wahrscheinlichsten Weg zu wählen und Alternativen parallel zu
   probieren.

6. **Commit-Disziplin.** Ein Commit pro sauberer, abgeschlossener
   Änderung. Keine Riesen-Commits mit fünf halbfertigen Baustellen.
   Commit-Nachrichten kurz und beschreibend auf Deutsch.

7. **Vor jeder Änderung: Vorschlag, dann Ausführung.** Bevor du
   Code änderst, beschreibe in wenigen Sätzen, was du tun wirst
   und welche Dateien betroffen sind. Warte auf mein OK.
   Danach führst du genau das aus — nicht mehr.

8. **Keine stillen Nebenwirkungen.** Wenn eine Änderung an einer
   Stelle Auswirkungen an anderer Stelle hätte, weise darauf hin
   und frag, ob sie mitgezogen werden sollen. Entscheide das nicht
   selbstständig.

## Umgang mit strategischen Dokumenten

Das Gesamtkonzept und das Farbsystem sind strategische Referenz.
Sie definieren WAS umgesetzt wird. Sie sind keine technische
Spezifikation. Bei Konflikten zwischen strategischem Anspruch und
technischer Machbarkeit: frag mich.

## Bei Problemen

Wenn etwas nicht wie erwartet funktioniert (Build-Fehler, kaputte
Seite, unerwartetes Verhalten): nicht weiterbauen, sondern stoppen
und Lage schildern. Ich entscheide, wie weitergemacht wird.
