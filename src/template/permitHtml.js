import { staticText } from './defaults.js'

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** newlines become <br/> so a typed line break is a real break in the PDF */
const nl = (s) => esc(s).replace(/\r?\n/g, '<br/>')

/**
 * permitHtml(record, opts) -> inner markup of the A4 permit page.
 * One template for all three outputs: in-app preview, print sheet, and the
 * stand-alone HTML written by verify/render-html.mjs — so they can never drift.
 *
 * opts.asset(fn)   -> url of public/assets/<fn>
 * opts.qrOverride  -> data-url of an uploaded QR (wins over the bundled one)
 *
 * NOTE: text colour and the optional header frame are applied by the wrapper:
 *   <div class="page" style="--ink:#000000">            no header box (default)
 *   <div class="page frame" style="--ink:#000000">      PDF's 0.72pt boxes
 */
export function permitHtml(record, opts = {}) {
  const d = record || {}
  const asset = opts.asset || ((f) => `/assets/${f}`)
  const S = staticText
  const L = S.labels
  const qr = opts.qrOverride || asset('qr-permit.png')

  const cell = (label, value, cls = '') =>
    `<td class="lbl">${esc(label)}</td><td class="val ${cls}">${nl(value)}</td>`

  // one div per MEASURED line of the original PDF; bullet only on line 1
  const item = (lines) => (Array.isArray(lines) ? lines : [lines])
    .map((ln, i) => `<div class="ln">${i === 0 ? '<span class="b">•</span> ' : ''}${esc(ln)}</div>`)
    .join('\n    ')

  return `
<div class="hcell h1">
  <img class="qr" src="${qr}" alt="QR" />
  <div class="pno">${esc(d.permitNo)}</div>
  <div class="phint">${esc(d.qrHint)}</div>
</div>
<div class="hcell h2"><div class="ptitle">${esc(d.title)}</div></div>
<div class="hcell h3">
  <img class="lg1" src="${asset('ajeer-logo.png')}" alt="Ajeer" />
  <img class="lg2" src="${asset('hrdf-logo.png')}" alt="HRSD" />
</div>

<div class="para">
  ${S.intro.map((l) => `<div>${esc(l)}</div>`).join('\n  ')}
</div>

<table class="tbl">
  <colgroup>
    <col style="width:123.83pt" /><col style="width:123.83pt" />
    <col style="width:123.82pt" /><col style="width:123.83pt" />
  </colgroup>

  <tr style="height:24.45pt"><td class="sec" colspan="4">${esc(S.sections.worker)}</td></tr>
  <tr style="height:19.05pt">${cell(L.workerName, d.workerName, 'name')}${cell(L.profession, d.profession)}</tr>
  <tr style="height:19.05pt">${cell(L.idNumber, d.idNumber)}${cell(L.nationality, d.nationality)}</tr>

  <tr style="height:24.45pt"><td class="sec" colspan="4">${esc(S.sections.provider)}</td></tr>
  <tr style="height:29.85pt">${cell(L.providerCompany, d.providerCompany)}${cell(L.providerCr, d.providerCr)}</tr>

  <tr style="height:24.45pt"><td class="sec" colspan="4">${esc(S.sections.beneficiary)}</td></tr>
  <tr style="height:29.85pt">${cell(L.beneficiaryCompany, d.beneficiaryCompany)}${cell(L.beneficiaryCr, d.beneficiaryCr)}</tr>

  <tr style="height:24.45pt"><td class="sec" colspan="4">${esc(S.sections.permit)}</td></tr>
  <tr style="height:19.05pt"><td class="lbl">${esc(L.contractNote)}</td><td class="val" colspan="3">${nl(d.contractNote)}</td></tr>
  <tr style="height:19.05pt">${cell(L.startDate, d.startDate)}${cell(L.endDate, d.endDate)}</tr>
  <tr style="height:19.05pt"><td class="lbl">${esc(L.workSites)}</td><td class="val" colspan="3">${nl(d.workSites)}</td></tr>
</table>

<div class="decl">
  <div class="h">${esc(S.declTitle)}</div>
  <div class="intro">${esc(S.declIntro)}</div>
  <div class="items">
    ${S.declItems.map(item).join('\n    ')}
  </div>
</div>

<div class="f1">${esc(S.footer1)}</div>
<div class="f2">${esc(S.footer2)}</div>
`
}
