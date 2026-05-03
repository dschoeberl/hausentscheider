---
name: Zusammenarbeit Pfade — Repo vs OneDrive für Claude Code
description: Claude Code arbeitet ausschließlich im Repo, kann nicht auf OneDrive zugreifen. Memory-Snapshot im Repo ist Pflicht. Verhindert Ressourcen-Verschwendung in Folge-Sitzungen.
type: project
originSessionId: 52097a10-d458-4dd2-bcd6-840318e0388d
---
**Lehre aus den C2-v2.1-Sitzungen 03.–05.05.2026.** Cowork-Claude und Claude-Code-Claude arbeiten in zwei verschiedenen Datei-Universen. Klarheit darüber spart in jeder Folge-Sitzung Zeit.

## Wer arbeitet wo

**Claude Code (CLI-Tool, Daniels Terminal):**
- Arbeitet ausschließlich im Repo unter `C:\Users\dscho\Documents\Projekte\hausentscheider`
- Kann NICHT auf OneDrive `C:\Users\dscho\OneDrive\Daniel\Hausentscheider Website\` zugreifen — das ist außerhalb des Repos
- Liest Memory-Files nur, wenn sie im Repo unter `memory/` als Snapshot liegen
- Liest Spec-Dokumente nur, wenn sie im Repo unter `docs/` als Snapshot liegen
- Pusht via Git nach GitHub `dschoeberl/hausentscheider`, Netlify deployt automatisch von `main`

**Cowork-Claude (Desktop-App, Anthropic Cowork-Mode):**
- Hat Zugriff auf Repo + OneDrive + Cowork-Memory-Speicher
- Cowork-Memory unter `C:\Users\dscho\AppData\Roaming\Claude\local-agent-mode-sessions\…\spaces\…\memory\`
- Kann Repo-Memory + OneDrive-Master-Konzepte parallel pflegen
- Spielt die Rolle: Konzept-Sparring, Memory-Pflege, Spec-Schreibung, Verifikations-Review, Git-Commit-Anleitung

## Datei-Konvention

| Inhalts-Typ | Master | Repo-Snapshot |
|---|---|---|
| Memory (Cowork-Sicht) | Cowork-Speicher | `memory/*.md` (Pflicht für Claude Code) |
| Spec-Dokumente | OneDrive `00_Projektsteuerung/` | `docs/*.md` (Pflicht für Claude Code) |
| Stand.md | OneDrive `00_Projektsteuerung/Stand.md` | nicht im Repo |
| Konzept-Dokumente | OneDrive `00_Projektsteuerung/` | nicht im Repo |
| Code | Repo | — |
| Excel | OneDrive (Workspace) | nicht im Repo |
| parameter.json + Generator | Repo `daten/` + `build_json.py` | — |

## Konsequenz für Cowork-Claude

**Bei jedem Spec- oder Memory-Update:**
1. Master schreiben (Cowork-Speicher für Memory, OneDrive für Spec/Konzept)
2. Repo-Snapshot parallel schreiben — sonst sieht Claude Code den Update nicht

**Bei Sitzungs-Übergabe an Claude Code:**
- Vor Claude-Code-Start prüfen: Sind alle für die Spec referenzierten Memorys als Repo-Snapshot da?
- Spec referenziert Memory `memory/foo.md` → Memory MUSS unter `C:\Users\dscho\Documents\Projekte\hausentscheider\memory\foo.md` existieren
- Andernfalls: Claude Code stoppt korrekt mit „Datei nicht gefunden" — Sitzungs-Zeit verloren

**Workflow für neue Memory-Datei:**
1. `Write` ins Cowork-Speicher (Master)
2. `Write` ins Repo unter `memory/foo.md` (Snapshot)
3. Eintrag in `MEMORY.md` (Cowork-Index, eine Zeile)

**Workflow für Spec-Update:**
1. `Edit` oder `Write` ins OneDrive `00_Projektsteuerung/260XYZ_C2_BlockSpec_vX.md` (Master)
2. `Edit` oder `Write` ins Repo `docs/C2_BlockSpec_vX.md` (Snapshot)

## Pfade-Quick-Reference

```
REPO (Claude Code arbeitet hier):
C:\Users\dscho\Documents\Projekte\hausentscheider
├── docs/                  ← Spec-Snapshots
├── memory/                ← Memory-Snapshots
├── js/, daten/, ...       ← Code + Daten
├── rechner.html, *.html
└── build_json.py

ONEDRIVE (Master für Konzept + Stand):
C:\Users\dscho\OneDrive\Daniel\Hausentscheider Website\
├── 00_Projektsteuerung/   ← Stand.md, Spec-Master, Konzept-Master
└── (Excel-Arbeitsdateien etc.)

COWORK-MEMORY (Master für Memory):
C:\Users\dscho\AppData\Roaming\Claude\local-agent-mode-sessions\
└── …\spaces\…\memory\
    ├── MEMORY.md         ← Index
    └── *.md              ← einzelne Memorys
```

## Was nicht funktioniert (vermieden in Zukunft)

- Memory nur im Cowork-Speicher pflegen → Claude Code findet sie nicht → Zeit verloren
- Spec nur im OneDrive pflegen, nicht im Repo → Claude Code findet sie nicht
- Git-Push aus dem OneDrive-Klon → Doppel-Repo-Falle (siehe Memory `feedback_doppelrepo_falle.md`)
- Excel direkt nach OneDrive von Claude schreiben → Sync-Risiko (Memory `feedback_excel_workflow_onedrive.md`: outputs/ first)

## How to apply

- **In jeder Sitzung mit Claude-Code-Übergabe:** Vor dem Übergabe-Prompt prüfen, dass alle in der Spec referenzierten Memory-Files als Repo-Snapshot existieren
- **Bei Memory-Update mitten in der Sitzung:** Cowork und Repo parallel updaten — niemals nur einen Ort
- **Bei Spec-Update:** OneDrive-Master + Repo-Snapshot synchron halten, kein Drift
- **Beim Sitzungs-Abschluss:** Stand.md im OneDrive aktualisieren (sie ist NICHT im Repo, daher von Claude Code nicht sichtbar — aber Cowork-Claude und Daniel arbeiten beide damit als Anker)
