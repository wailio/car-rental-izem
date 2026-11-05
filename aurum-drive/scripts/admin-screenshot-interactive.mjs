import { spawn, execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SESSION_SECRET = 'chateau_art_secret_hmac_token_key_2026'

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function getAdminToken() {
  const payload = {
    u: 'wailio',
    r: 'developer',
    perms: ['dashboard', 'products', 'orders', 'sales', 'website-info', 'users'],
    iat: Date.now(),
  }
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64')
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64')
  return `${payloadStr}.${hmac}`
}

async function takeInteractiveScreenshot(urlPath, outputPath, actionFn, width = 1440, height = 900) {
  const token = await getAdminToken()
  const port = Math.floor(9300 + Math.random() * 500)
  const tempProfile = path.join(process.cwd(), `.chrome-tmp-${Date.now()}-${Math.floor(Math.random()*1000)}`)

  const chromeProc = spawn(CHROME, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--user-data-dir=${tempProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
  ])

  try {
    let pageWsUrl = null
    for (let i = 0; i < 30; i++) {
      await sleep(300)
      try {
        const listRes = await fetch(`http://127.0.0.1:${port}/json/list`)
        if (listRes.ok) {
          const list = await listRes.json()
          const page = list.find(t => t.type === 'page')
          if (page) {
            pageWsUrl = page.webSocketDebuggerUrl
            break
          }
        }
      } catch {}
    }

    if (!pageWsUrl) throw new Error('Chrome page target did not respond')

    const ws = new WebSocket(pageWsUrl)
    let msgId = 1
    const pending = new Map()

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.id && pending.has(data.id)) {
        pending.get(data.id)(data.result)
        pending.delete(data.id)
      }
    }

    await new Promise(r => ws.onopen = r)

    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++
        pending.set(id, resolve)
        ws.send(JSON.stringify({ id, method, params }))
      })
    }

    await send('Network.enable')
    await send('Network.setCookie', {
      name: 'admin_session',
      value: token,
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
    })
    await send('Network.setCookie', {
      name: 'admin_session',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
    })

    await send('Page.enable')
    await send('Runtime.enable')
    await send('Page.navigate', { url: `http://127.0.0.1:3000${urlPath}` })

    await sleep(2500)

    if (actionFn) {
      await send('Runtime.evaluate', { expression: actionFn })
      await sleep(1000)
    }

    const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
    const buffer = Buffer.from(shot.data, 'base64')
    fs.writeFileSync(outputPath, buffer)
    console.log(`Saved screenshot to ${outputPath}`)

    ws.close()
  } finally {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /T /PID ${chromeProc.pid}`, { stdio: 'ignore' })
      } else {
        chromeProc.kill()
      }
    } catch {}
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true })
    } catch {}
  }
}

async function main() {
  console.log('1. Capturing Users with selected user and iOS permission toggles...')
  await takeInteractiveScreenshot(
    '/admin/users',
    'after_admin_users_selected_v3.png',
    `document.querySelector('.user-row')?.click()`
  )

  console.log('2. Capturing Users with iOS context popover menu open (Image 5 style)...')
  await takeInteractiveScreenshot(
    '/admin/users',
    'after_admin_users_ios_menu_v3.png',
    `document.querySelector('button[title="Actions"]')?.click()`
  )

  console.log('3. Capturing Orders with iOS context popover menu open (Image 5 style)...')
  await takeInteractiveScreenshot(
    '/admin/orders',
    'after_admin_orders_ios_menu_v3.png',
    `document.querySelector('button[title="Actions & Options"]')?.click()`
  )

  console.log('4. Capturing Dashboard with light grey #F5F5F7...')
  await takeInteractiveScreenshot('/admin/dashboard', 'after_admin_dashboard_v3.png')

  console.log('5. Capturing Sales with light grey #F5F5F7...')
  await takeInteractiveScreenshot('/admin/sales', 'after_admin_sales_v3.png')

  console.log('6. Capturing Products with light grey #F5F5F7...')
  await takeInteractiveScreenshot('/admin/products', 'after_admin_products_v3.png')

  console.log('7. Capturing Settings with light grey #F5F5F7...')
  await takeInteractiveScreenshot('/admin/settings', 'after_admin_settings_v3.png')

  console.log('All interactive screenshots captured!')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
