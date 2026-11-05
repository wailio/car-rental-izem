import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function snap(outFile, width = 1440, height = 900) {
  const profileDir = path.resolve('temp_snap_profile');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9333',
    `--user-data-dir=${profileDir}`,
    `--window-size=${width},${height}`,
    'http://localhost:3000'
  ]);

  await new Promise((r) => setTimeout(r, 3000));

  try {
    const listRes = await fetch('http://127.0.0.1:9333/json');
    const targets = await listRes.json();
    const pageTarget = targets.find((t) => t.type === 'page' && t.url.includes('3000'));
    if (!pageTarget) {
      console.error('No page target', targets);
      return;
    }

    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    await new Promise((resolve) => (ws.onopen = resolve));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const id = msgId++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await new Promise((r) => setTimeout(r, 2000));

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(outFile, Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot to:', outFile);
    ws.close();
  } finally {
    chromeProc.kill('SIGKILL');
    setTimeout(() => {
      try {
        fs.rmSync(profileDir, { recursive: true, force: true });
      } catch (e) {}
    }, 1000);
  }
}

const target = process.argv[2] || 'screenshot.png';
const w = parseInt(process.argv[3] || '1440', 10);
const h = parseInt(process.argv[4] || '950', 10);
snap(target, w, h);
