// Downloads the licensed Wikimedia Commons demo photos into public/demo/ so the
// pitch works offline. Usage: npm run fetch-images
// Skips files that already exist. Respects Wikimedia's rate limits (one request every 3 s).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const src = fs.readFileSync(path.join(root, 'src/data/imageCredits.ts'), 'utf8')
const list = JSON.parse(src.slice(src.indexOf('['), src.lastIndexOf(']') + 1))
const outDir = path.join(root, 'public')
const UA = 'CarlayDemoSetup/1.0 (demo prototype image fetch)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ok = 0
let failed = 0
for (const item of list) {
  const out = path.join(outDir, item.local)
  if (fs.existsSync(out) && fs.statSync(out).size > 10_000) {
    ok++
    continue
  }
  let done = false
  for (let attempt = 0; attempt < 5 && !done; attempt++) {
    try {
      const res = await fetch(item.remote, { headers: { 'User-Agent': UA } })
      if (res.ok && (res.headers.get('content-type') ?? '').startsWith('image/')) {
        fs.mkdirSync(path.dirname(out), { recursive: true })
        fs.writeFileSync(out, Buffer.from(await res.arrayBuffer()))
        console.log('✓', item.local, `(${item.licence}, ${item.author})`)
        done = true
      } else {
        console.log(`… ${res.status} ${item.local}, retrying`)
        await sleep(10_000 * (attempt + 1))
      }
    } catch (e) {
      console.log(`… ${e.message} ${item.local}, retrying`)
      await sleep(10_000 * (attempt + 1))
    }
  }
  done ? ok++ : failed++
  await sleep(3000)
}
console.log(`\n${ok} images ready, ${failed} failed. ${failed ? 'Run again to retry the failed ones.' : ''}`)
process.exit(failed ? 1 : 0)
