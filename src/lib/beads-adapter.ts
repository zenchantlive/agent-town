export class BeadsAdapter {
  constructor(
    private repoPath: string,
    private execFn?: any // Dependency injection for testing
  ) {}

  async listReady(): Promise<any[]> {
    try {
      const exec = this.execFn || (await import('util')).promisify((await import('child_process')).exec)
      const { stdout } = await exec('bd ready', { cwd: this.repoPath })
      return this.parseIssuesOutput(stdout)
    } catch (error) {
      console.error('Error executing bd ready:', error)
      return []
    }
  }

  private parseIssuesOutput(output: string): any[] {
    // Strip all ANSI escape codes from output
    const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '')
    const lines = cleanOutput.split('\n')
    const issues: any[] = []

    for (const line of lines) {
      // Match: [ID] [separator] [priority] [title]
      // Format: "AT-123 ● P0 Test Issue"
      const match = line.match(/([A-Z]{2}-\w+)\s*●\s*P[0-4]\s*(.+)/)
      if (match) {
        issues.push({
          id: match[1],
          title: match[2].trim()
        })
      }
    }

    return issues
  }
}
