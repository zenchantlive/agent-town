# Agent Town 🏘️

A visual multi-agent coordination interface built with Next.js 15, React 19, and TypeScript. Agent Town provides a real-time dashboard for visualizing agent activity, task management, and system events in a gamified town interface.

## Features

- **TownCanvas** - Interactive grid-based town map showing agent positions and task locations
- **AgentSprites** - Role-based agent visualization with status indicators (idle/working/thinking/error)
- **TaskPanel** - Tabbed task management with priority badges (P0/P1/P2) and approval workflow
- **TownCrierFeed** - Real-time event feed with filtering and "new" event highlighting

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Language**: TypeScript 5.8
- **Testing**: Vitest + React Testing Library
- **AI Integration**: @ai-sdk/anthropic

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/agent-town.git
cd agent-town

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run all tests with Vitest |

## Project Structure

```
agent-town/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main dashboard page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── TownCanvas/       # Interactive town map
│   │   ├── AgentSprites/     # Agent visualization
│   │   ├── TaskPanel/        # Task management UI
│   │   └── TownCrierFeed/    # Event feed
│   └── lib/
│       ├── ai-runtime.ts     # AI agent orchestration
│       ├── beads-adapter.ts  # Beads protocol adapter
│       └── agent-state-machine.ts  # State management
├── docs/                     # Documentation
├── .beads/                   # Beads workspace data
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Component Reference

### TownCanvas
Interactive grid background with clickable agent and task markers.

**Props:**
- `agents` - Array of agent positions
- `tasks` - Array of task positions
- `onAgentSelect(agentId)` - Callback when agent is clicked

### AgentSprites
Visual representation of agents with role-based emojis and status colors.

**Props:**
- `agents` - Array of agent data
- `onSelect(agentId)` - Selection callback
- `selectedId` - Currently selected agent

**Agent Roles:**
| Role | Emoji | Description |
|------|-------|-------------|
| infrastructure | 🏗️ | Build/coding tasks |
| qa | 🧪 | Testing/quality assurance |
| design | 🎨 | UI/UX and architecture |
| devops | ⚙️ | Operations/deployment |

**Status Colors:**
- 🟢 idle
- 🟡 working
- 🔵 thinking
- 🔴 error

### TaskPanel
Tabbed interface for task management and approval.

**Features:**
- Status filtering (pending/in_progress/done)
- Priority badges (P0/P1/P2)
- Approve/Reject workflow for pending tasks

### TownCrierFeed
Real-time event stream with filtering.

**Event Types:**
- `task_completed` ✅
- `approval_requested` 📋
- `agent_status_changed` 💼
- `error` ❌

## Testing

```bash
# Run tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

All components have comprehensive test suites:
- TownCanvas: 3 tests
- AgentSprites: 7 tests
- TaskPanel: 8 tests
- TownCrierFeed: 10 tests
- AI Runtime: 8 tests

**Total: 36 passing tests**

## Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Optional: AI Provider
ANTHROPIC_API_KEY=your_api_key_here
```

### Tailwind Config (`tailwind.config.ts`)

Custom colors and theme extensions for the agent town aesthetic.

### TypeScript Config (`tsconfig.json`)

Strict TypeScript configuration with Next.js defaults.

## Backend Integration

The project includes a reference implementation for connecting to backend services:

- `src/lib/ai-runtime.ts` - AI orchestration engine
- `src/lib/beads-adapter.ts` - Beads protocol integration
- `src/lib/agent-state-machine.ts` - State machine for agent behavior

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Version History

- **v0.1.0** - Initial release with full frontend dashboard

---

Built with 🦾 by Jordan Hindo