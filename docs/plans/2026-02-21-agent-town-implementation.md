# Agent Town V1 — Implementation Plan (2026-02-21)

## Phase 0 — Repo & Baseline
1) Initialize repo structure
2) Add basic README + docs index

## Phase 1 — Backend Core
1) AI SDK v6 setup (ToolLoopAgent)
2) Beads adapter (bd list/show/ready/update)
3) Mayor orchestrator (recommendations + approval state)
4) Agent runtime (roles, personalities, state machine)
5) Idle mode engine (low‑token chatter)

## Phase 2 — Frontend UI
1) Town canvas (fixed map + locations)
2) Agent sprites + status indicators
3) Clickable agent profile (editable)
4) Toggleable task panel + approval UI
5) Toggleable chat transcript
6) Town‑Crier feed

## Phase 3 — Integration
1) WebSocket events (state sync)
2) Beads status updates reflect in UI
3) Approval pipeline end‑to‑end

## Phase 4 — Verification
- Smoke: task recommend → approve → in_progress → closed
- UI: panels toggle, bubble on hover/click
- Idle mode: low token chatter
- Error: blocked shows DM + crier entry

## Notes
- No audio/day‑night/movement animations in V1
- Fixed map; teleport movement
