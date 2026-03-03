import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)
const BD_PATH = '/home/linuxbrew/.linuxbrew/bin/bd'
const REPO_PATH = '/home/clawdbot/clawd/repos/agent-town'

// Parse issue line: ○ AT-123 ● P0 Some title
function parseIssueLine(line: string) {
  const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '')
  const match = cleanLine.match(/([○●◎])\s*([A-Z]{2}-\w+)\s*[●]\s*(P[0-4])\s*(.+)/)
  if (!match) return null

  const statusMap: Record<string, string> = {
    '○': 'ready',
    '●': 'in_progress',
    '◎': 'blocked',
  }

  return {
    id: match[2],
    title: match[4].trim(),
    status: statusMap[match[1]] || 'ready',
    priority: match[3],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action') || 'list'

  try {
    // Health check
    if (action === 'health') {
      const { stdout } = await execAsync(`${BD_PATH} --version`, { cwd: REPO_PATH })
      const version = stdout.match(/bd version (\d+\.\d+\.\d+)/)?.[1] || 'unknown'
      return NextResponse.json({ healthy: true, version })
    }

    // Get all issues
    if (action === 'list') {
      const { stdout } = await execAsync(`${BD_PATH} list --format json`, { cwd: REPO_PATH })
      const lines = stdout.trim().split('\n').filter(Boolean)
      const issues = lines.map(parseIssueLine).filter(Boolean)
      return NextResponse.json({ issues })
    }

    // Get ready tasks
    if (action === 'ready') {
      const { stdout } = await execAsync(`${BD_PATH} ready --format json`, { cwd: REPO_PATH })
      const lines = stdout.trim().split('\n').filter(Boolean)
      const issues = lines.map(parseIssueLine).filter(Boolean)
      return NextResponse.json({ issues })
    }

    // Get single issue
    if (action === 'get') {
      const id = searchParams.get('id')
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

      const { stdout } = await execAsync(`${BD_PATH} get ${id}`, { cwd: REPO_PATH })
      const issue = parseIssueLine(stdout.trim())
      return NextResponse.json({ issue })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Beads API error:', error)
    return NextResponse.json(
      { error: error.message || 'Beads command failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id, title, priority } = body

    if (action === 'start' && id) {
      await execAsync(`${BD_PATH} start ${id}`, { cwd: REPO_PATH })
      return NextResponse.json({ success: true })
    }

    if (action === 'done' && id) {
      await execAsync(`${BD_PATH} done ${id}`, { cwd: REPO_PATH })
      return NextResponse.json({ success: true })
    }

    if (action === 'create' && title) {
      const { stdout } = await execAsync(`${BD_PATH} create "${title}" --priority ${priority || 'P2'}`, { cwd: REPO_PATH })
      const match = stdout.match(/([A-Z]{2}-\d+)/)
      return NextResponse.json({ success: true, id: match?.[1] })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Beads POST error:', error)
    return NextResponse.json(
      { error: error.message || 'Beads command failed' },
      { status: 500 }
    )
  }
}