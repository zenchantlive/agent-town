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
    const lines = output.split('\n')
    const issues: any[] = []
    
    for (const line of lines) {
      const match = line.match(/([A-Z]{2}-\w+)\s*[●○]\s*[P0-4]\s*(.+)/)
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
