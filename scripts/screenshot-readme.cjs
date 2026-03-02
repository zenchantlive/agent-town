/* eslint-disable no-console */
const { chromium } = require('playwright')

const BASE_URL = process.env.SCREENSHOT_URL || 'http://localhost:3000'
const OUT_DIR = 'docs/screenshots'

async function run() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log(`Opening ${BASE_URL}...`)
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  // Wait for core UI
  await page.locator('[data-testid="animated-town-canvas"]').waitFor({ timeout: 15000 })
  await page.locator('[data-testid="tab-tasks"]').waitFor({ timeout: 15000 })
  await page.locator('text=Town Crier').waitFor({ timeout: 15000 })

  // Full page (optional reference)
  await page.screenshot({ path: `${OUT_DIR}/full-page.png`, fullPage: true })

  // Town Canvas
  const canvas = page.locator('[data-testid="animated-town-canvas"]')
  await canvas.screenshot({ path: `${OUT_DIR}/town-canvas.png` })

  // Agent Sprites (use canvas again for a dedicated shot)
  await canvas.screenshot({ path: `${OUT_DIR}/agent-sprites.png` })

  // Task Panel (ancestor container of the tabs)
  const taskPanel = page
    .locator('[data-testid="tab-tasks"]')
    .locator('xpath=ancestor::div[contains(@class,"bg-gray-800")]')
    .first()
  await taskPanel.screenshot({ path: `${OUT_DIR}/task-panel.png` })

  // Town Crier Feed
  const townCrier = page
    .locator('text=Town Crier')
    .locator('xpath=ancestor::div[contains(@class,"bg-gray-800")]')
    .first()
  await townCrier.screenshot({ path: `${OUT_DIR}/town-crier-feed.png` })

  await browser.close()
  console.log('Screenshots complete.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
