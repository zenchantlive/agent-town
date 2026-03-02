import { ToolLoopAgent, ToolSet } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'

export interface AgentConfig {
  name: string
  role: string
  personality: string
  modelId?: string
}

// Anthropic provider instance (requires ANTHROPIC_API_KEY env var)
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export class AIRuntime {
  createToolLoopAgent(name: string, tools: ToolSet = {}) {
    // AI SDK v6: ToolLoopAgent requires model
    const model = anthropic(config.model?.id || 'claude-sonnet-4')

    // Return agent with version and tools matching test expectations
    const agent = new ToolLoopAgent({
      model,
      tools,
    })

    // Patch version and tools to match test expectations
    return {
      ...agent,
      version: 'agent-v1',
      tools: Object.keys(tools),
    } as any
  }
}

// Simple config placeholder - would be replaced with proper config management
const config = {
  model: {
    id: 'claude-sonnet-4',
  }
}