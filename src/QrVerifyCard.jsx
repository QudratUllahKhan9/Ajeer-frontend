import React, { useEffect, useState } from 'react'
import './qr-verify.css'

/**
 * QrVerifyCard — neutral card: QR + record id + rows. Koi logo / claim nahi.
 *
 * QR kahaan se aaye (koi naya npm package lazmi nahi):
 *   1) qrSrc     — seedha image URL (backend /qr/:id  ya Cloudinary)
 *   2) generate  — function (text) => Promise<dataUrl>  (agar aap ne
 *                  `npm i qrcode` kiya ho to App me banayein, dekho README)
 *   3) kuch bhi na ho to skeleton + "QR unavailable" dikhta hai (crash nahi)
 */
export default function QrVerifyCard({
  title = 'Record check',
  titleAr = 'التحقق من السجل',
  recordId = 'DEMO-0001',
  verifyUrl = '',
  qrSrc = '',
  generate = null,
  rows = [],
  note = 'Test record — demo data only. / سجل تجريبي — بيانات تجريبية فقط.'
}) {
  const [dataUrl, setDataUrl] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setFailed(false)

    if (qrSrc) { setDataUrl(''); return }

    if (!generate || !verifyUrl) { setDataUrl(''); setFailed(!qrSrc); return }

    Promise.resolve()
      .then(() => generate(verifyUrl))
      .then((d) => { if (alive) { setDataUrl(d || ''); setFailed(!d) } })
      .catch(() => { if (alive) { setDataUrl(''); setFailed(true) } })

    return () => { alive = false }
  }, [verifyUrl, qrSrc, generate])

  const src = qrSrc || dataUrl
  const shortUrl = String(verifyUrl).replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <section className="qvc">
      <div className="qvc__wm" aria-hidden="true">DEMO</div>

      <header className="qvc__head">
        <div className="qvc__headtxt">
          <h1 className="qvc__title">{titleAr}</h1>
          <span className="qvc__sub">{title}</span>
        </div>
        <span className="qvc__demo">DEMO</span>
      </header>

      <div className="qvc__body">
        <div className="qvc__qrbox">
          <div className="qvc__qrframe">
            {qrSrc
              ? <img src={qrSrc} alt={`QR ${recordId}`} width="176" height="176" />
              : dataUrl
                ? <img src={dataUrl} alt={`QR ${recordId}`} width="176" height="176" />
                : <div className="qvc__qrskel" aria-hidden="true" />}
            <span className="qvc__qrdemo">DEMO</span>
          </div>
          <code className="qvc__id">{recordId}</code>
          {shortUrl && <span className="qvc__url" dir="ltr">{shortUrl}</span>}
          <span className="qvc__scan">
            {failed ? 'QR: qrSrc ya generate dein' : 'امسح الرمز · scan to open'}
          </span>
        </div>

        <dl className="qvc__rows">
          {rows.map((r) => (
            <div className="qvc__r" key={r.label}>
              <dt>{r.label}</dt>
              <dd className={r.ltr ? 'is-ltr' : ''}>{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="qvc__foot">{note}</p>
    </section>
  )
}
