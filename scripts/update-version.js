import fs from 'node:fs/promises'

const APP_VERSION_META_RE = /<meta name="app-version" content=".*?"/
const INDEX_HTML_URL = new URL('../src/option/index.html', import.meta.url)

async function run() {
  const v = Date.now()
  let c = await fs.readFile(INDEX_HTML_URL, 'utf8')
  c = c.replace(APP_VERSION_META_RE, `<meta name="app-version" content="${v}"`)
  await fs.writeFile(INDEX_HTML_URL, c, 'utf8')
  console.log('✅ 版本已更新')
}
run()
