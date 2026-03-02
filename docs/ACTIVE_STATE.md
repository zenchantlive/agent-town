# Agent Town — Active State (2026-02-22)

## Phase 1: Backend Core 🚧
We have successfully implemented the core dependencies using strict TDD and the Linus Workflow.

### Completed (Passed Tests):
- ✅ **AIRuntime:** Wrapper for AI SDK v6 ToolLoopAgent.
- ✅ **BeadsAdapter:** Bridge to the `bd` CLI for task management.
- ✅ **StateMachine:** Strict transition logic (idle, working, moving, blocked).

### Next Steps:
- 🔄 **AT-lgl (Agent Runtime):** Integrate AIRuntime + StateMachine into a unified agent class.
- 🔄 **AT-xgl (Pixi.js Map):** Start Phase 2 Frontend work.

## Blockers
- 🛑 **Gateway Pairing:** Spawning sub-agents via `sessions_spawn` is currently blocked by a persistent `pairing required (1008)` error, even on loopback.
- **Workaround:** Continue implementation in the main session until the pairing logic is reset.
