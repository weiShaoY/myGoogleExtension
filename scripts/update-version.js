import fs from 'node:fs/promises'
import path from 'node:path'

async function run() {
  const file = path.resolve('/src/option/index.html')
  const v = Date.now()
  let c = await fs.readFile(file, 'utf8')
  c = c.replace(/<meta name="app-version" content=".*?"/, `<meta name="app-version" content="${v}"`)
  await fs.writeFile(file, c, 'utf8')
  console.log('✅ 版本已更新')
}
run()
