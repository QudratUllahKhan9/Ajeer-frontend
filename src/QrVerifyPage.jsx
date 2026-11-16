import React, { useEffect, useMemo, useState } from 'react'
import './qr-verify.css'

/* Neutral record page — koi logo/ministry mark nahi, DEMO hamesha visible.
   Data aap ke backend se: GET {apiBase}/api/records/:id
   QR: {apiBase}/qr/:id.png  (ya qrSrc / generate prop) */

const EMPTY = {
  permitNo: '', permitType: '', startDate: '', endDate: '',
  workerName: '', idNumber: '', nationality: '', profession: '',
  gender: '', birthDate: '', establishmentNo: '', establishmentName: ''
}

function statusOf(rec) {
  const t = Date.now()
  const s = rec.startDate ? Date.parse(rec.startDate) : NaN
  const e = rec.endDate ? Date.parse(rec.endDate) : NaN
  if (Number.isNaN(e)) return { key: 'unknown', ar: 'غير محدد', en: 'unknown' }
  if (!Number.isNaN(s) && t < s) return { key: 'pending', ar: 'لم يبدأ بعد', en: 'not started' }
  if (t > e) return { key: 'expired', ar: 'منتهي', en: 'expired' }
  return { key: 'active', ar: 'ساري', en: 'active' }
}

function Row({ label, value, ltr }) {
  return (
    <tr>
      <td className="rvp__label">{label}</td>
      <td className={`rvp__value${ltr ? ' is-ltr' : ''}`}>{value || '—'}</td>
    </tr>
  )
}

function Band({ children }) {
  return <tr><th className="rvp__band" colSpan={2} scope="colgroup">{children}</th></tr>
}

export default function QrVerifyPage({
  apiBase = '',
  recordId = 'DEMO-0001',
  record = null,
  qrSrc = '',
  generate = null,
  orgName = 'YOUR ORGANISATION',
  titleAr = 'بيانات السجل',
  titleEn = 'Record details'
}) {
  const [rec, setRec] = useState(record || EMPTY)
  const [state, setState] = useState(record ? 'ready' : 'loading')
  const [qr, setQr] = useState('')

  useEffect(() => {
    if (record) { setRec({ ...EMPTY, ...record }); setState('ready'); return }
    if (!apiBase) { setState('ready'); return }
    let alive = true
    setState('loading')
    fetch(`${apiBase}/api/records/${recordId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((d) => { if (alive) { setRec({ ...EMPTY, ...d }); setState('ready') } })
      .catch(() => { if (alive) setState('error') })
    return () => { alive = false }
  }, [apiBase, recordId, record])

  const src = qrSrc || (apiBase ? `${apiBase}/qr/${recordId}.png` : '')

  useEffect(() => {
    if (src) { setQr(''); return }
    if (!generate) return
    let alive = true
    Promise.resolve()
      .then(() => generate(`${window.location.origin}/v/${recordId}`))
      .then((d) => { if (alive && d) setQr(d) })
      .catch(() => {})
    return () => { alive = false }
  }, [src, generate, recordId])

  const st = useMemo(() => statusOf(rec), [rec])
  const qrImage = src || qr
  const shortUrl = String(src || `${recordId}`).replace(/^https?:\/\//, '')

  return (
    <div className="rvp">
      <div className="rvp__demo-bar">DEMO / TEST — بيانات وهمية للاختبار فقط</div>

      <section className="rvp__card">
        <div className="rvp__wm" aria-hidden="true">DEMO</div>

        <header className="rvp__head">
          <div className="rvp__headline">
            <span className="rvp__org">{orgName}</span>
            <h1 className="rvp__title">{titleAr}</h1>
            <span className="rvp__sub">{titleEn}</span>
          </div>
          <div className="rvp__headright">
            <span className="rvp__demo">DEMO</span>
            <span className={`rvp__status rvp__status--${st.key}`}>{st.ar}</span>
          </div>
        </header>

        {state === 'loading' && <p className="rvp__note">…</p>}
        {state === 'error' && <p className="rvp__note rvp__note--err">ریکارڈ نہیں ملا / record not found</p>}

        {state === 'ready' && (
          <>
            <div className="rvp__qrwrap">
              <div className="rvp__qrframe">
                {qrImage
                  ? <img src={qrImage} alt={`QR ${recordId}`} width="150" height="150" />
                  : <div className="rvp__qrskel" aria-hidden="true" />}
                <span className="rvp__qrdemo">DEMO</span>
              </div>
              <div className="rvp__qrside">
                <code className="rvp__id">{recordId}</code>
                <span className="rvp__url" dir="ltr">{shortUrl}</span>
                <span className="rvp__scan">امسح الرمز · scan to open</span>
              </div>
            </div>

            <table className="rvp__tbl">
              <colgroup><col style={{ width: '38%' }} /><col style={{ width: '62%' }} /></colgroup>
              <tbody>
                <Band>بيانات السجل</Band>
                <Row label="رقم السجل" value={rec.permitNo} ltr />
                <Row label="نوع السجل" value={rec.permitType} />
                <Row label="تاريخ البداية" value={rec.startDate} ltr />
                <Row label="تاريخ النهاية" value={rec.endDate} ltr />

                <Band>بيانات العامل</Band>
                <Row label="الاسم" value={rec.workerName} ltr />
                <Row label="رقم الهوية / الإقامة" value={rec.idNumber} ltr />
                <Row label="الجنسية" value={rec.nationality} />
                <Row label="المهنة" value={rec.profession} />
                <Row label="الجنس" value={rec.gender} />
                <Row label="تاريخ الميلاد" value={rec.birthDate} ltr />

                <Band>بيانات المنشأة</Band>
                <Row label="رقم المنشأة" value={rec.establishmentNo} ltr />
                <Row label="اسم المنشأة" value={rec.establishmentName} />
              </tbody>
            </table>
          </>
        )}

        <p className="rvp__foot">
          سجل تجريبي — ليس بيانًا حكوميًا ولا يصلح للتحقق الرسمي.
          <br />
          Demo record, not a government document. Official verification: ajeer.sa
        </p>
      </section>
    </div>
  )
}
