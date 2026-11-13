/**
 * verify/render-html.mjs
 * ---------------------------------------------------------------------------
 * Writes TWO self-contained, print-ready files using the SAME template module
 * the React app imports — so preview and PDF can never drift apart.
 *
 *   out/permit.html         no box on top   (default, matches your request)
 *   out/permit-frame.html   with the PDF's own faint 0.72pt header boxes
 *
 *   node verify/render-html.mjs
 *   node verify/render-html.mjs --pdf     # prints the PDF-export commands
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const out = resolve(root, 'out')

const { permitHtml } = await import(pathToFileURL(resolve(root, 'src/template/permitHtml.js')).href)
const { permitCss } = await import(pathToFileURL(resolve(root, 'src/template/permitCss.js')).href)
const { defaultPermit } = await import(pathToFileURL(resolve(root, 'src/template/defaults.js')).href)

const pub = pathToFileURL(resolve(root, 'public')).href + '/'
const inner = permitHtml(defaultPermit, { asset: (f) => pub + 'assets/' + f })
const css = permitCss(pub)

const doc = (frame) => `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<title>${defaultPermit.permitNo}</title>
<style>
${css}
@page{size:594.96pt 841.92pt;margin:0}
html,body{margin:0;padding:0;background:#fff}
</style></head><body>
<div class="page${frame ? ' frame' : ''}" style="--ink:${defaultPermit.inkColor}">${inner}</div>
</body></html>`

mkdirSync(out, { recursive: true })
writeFileSync(resolve(out, 'permit.html'), doc(false), 'utf8')
writeFileSync(resolve(out, 'permit-frame.html'), doc(true), 'utf8')
console.log('✔ out/permit.html        (no header box — default)')
console.log('✔ out/permit-frame.html  (with the PDF 0.72pt boxes)')

if (process.argv.includes('--pdf')) {
  console.log(`
PDF export:
  python3 -c "from weasyprint import HTML; HTML('out/permit.html').write_pdf('out/permit.pdf')"
  # or: open out/permit.html -> Print -> Save as PDF -> A4, Margins: None, Scale 100%
`)
}
