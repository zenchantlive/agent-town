# Agent Town V1 — Design Doc (2026-02-21)

## 0) Summary
Agent Town is a web-based, pixel‑art “town” where 6 fixed‑role agents (plus a visible Mayor/orchestrator) plan, work, and chat around Beads tasks. You approve recommended tasks; agents execute and report status. V1 is a fixed single‑screen map, toggleable panels, minimal idle chatter, and no audio/day‑night cycles.

## 1) Goals & Constraints
**Goals**
- Observe agent work in a living town UI
- See task flow, comms, and status clearly
- Keep idle chatter low‑token; work mode full‑token
- Beads is the source of truth

**Constraints**
- V1: web‑based, fixed map, teleport movement
- No auto model switching; user chooses per agent
- No audio; no day/night cycles

## TECH STACK
**Frontend:** Next.js + React + Pixi.js (High-Fidelity Canvas)
**Backend:** Node + AI SDK v6 + WebSocket
**Deploy:** Vercel
**Visuals:** 32x32 Pixel Art (refer to `pixel-art-spec.md`)

## 3) ROLES & CHARACTERS
**Fixed roles (6):** Architect, Builder, Critic, Verifier, Scout, Designer
**Orchestrator:** Mayor (visible, friendly facilitator)
**Visual Identity:** Unique palettes and silhouettes per role (refer to `pixel-art-spec.md`)

## 4) Communication Model (Hybrid)
- **Proximity chat**: only when agents are in same location
- **Directed DMs**: for blockers / coordination
- **Town‑Crier Feed**: major events + status changes

## 5) Town Map (V1)
- **Locations:** Plaza, Office, Chat
- **Fixed single-screen map**
- **Agent movement:** teleport between locations (V2 adds walking)

## 6) UI Layout
- **Canvas town view** (center)
- **Toggleable panels:**
  - Task panel (Beads + approvals)
  - Chat transcript
- **Agent profile** shows only on click (editable)
- **Speech bubbles** on hover/click only

## 7) Task Flow (Beads)
1) Mayor pulls from `bd ready`
2) Mayor **recommends** tasks → Jordan **approves**
3) Assigned agent sets `in_progress`
4) Completion → `closed` or `blocked`

**Dependencies**
- Strict dependencies for execution
- **Research mode** allowed even when deps not closed
- Mayor can **push back** if risky

## 8) Idle Mode
- Agents live non‑work life (banter/ideas/life talk)
- **Minimal tokens** during idle
- Work mode has no token limit

## 9) Error Handling
- Agent status = **Blocked** + DM to Mayor
- Town‑Crier logs errors

## 10) Testing & Verification (V1)
- Task assignment flow (recommend → approve)
- Beads status updates reflect in UI
- Chat + town‑crier updates
- Idle mode emits low‑token chatter

## 11) V2 Deferred
- Day/night cycle
- Movement animations
- Audio
- Dynamic role switching
- Agent creation UI

## 12) Open Questions (if any)
- None outstanding; awaiting implementation plan
