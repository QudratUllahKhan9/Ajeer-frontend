# تصريح أجير — React + CSS form → exact A4 PDF

Ajeer work permit generator. The A4 sheet is a **measured clone** of the source
PDF (`MUHAMMAD KASHIF KHAN ZAMAN.pdf`, permit `TQ5491374`) — every box, font
size, line break and colour was extracted from the PDF itself, not estimated.

---

## Run

```bash
npm install
npm run dev            # http://localhost:5173  → form + live A4 preview
```

Make the PDF:

| Method | Steps |
| --- | --- |
| **Browser (vector, recommended)** | Fill the form → button `PDF بنائیں / پرنٹ` → Destination **Save as PDF** → Paper **A4** → Margins **None** → Scale **100%** |
| **CLI** | `node verify/render-html.mjs` → writes `out/permit.html` → convert with the one-liner below |

```bash
node verify/render-html.mjs
python3 -c "from weasyprint import HTML; HTML('out/permit.html').write_pdf('out/permit.pdf')"
```

`npm run build` produces the static site in `dist/`.

---

## What is measured (no guessing)

| Item | Value | How it was obtained |
| --- | --- | --- |
| Page | **594.96 × 841.92 pt** (A4), 1 page | `pdfinfo` |
| Original font | `FrutigerLTArabic-45Light` (commercial) | `pdffonts` |
| **Text colour** | **`#000000`** — all 13 text spans | `page.get_text("dict")` → `span["color"]` |
| Table border | `#CECFD5` = rgb(206,207,213), **0.75 pt** | `page.get_drawings()` |
| Section / label fill | `#EBF0F1` = rgb(235,240,241) | same |
| Header frame | `#CECFD5`, **0.72 pt**, cells at x 58.49 / 135.52 / 137.68 / 389.01 / 391.18 / 550.48, y 30.15–114.20 | same |
| Table frame | x 57.07 → 552.38 (495.31 pt), top 197.37 | same |
| Row heights | 24.45 / 19.05 / 19.05 / 24.45 / 29.85 / 24.45 / 29.85 / 24.45 / 19.05 / 19.05 / 19.05 → ends 450.12 | same |
| QR matrix | 68.42, 34.23, **57.80 × 57.42 pt** | vector path bounding box |
| Font sizes | table 8.99 · worker name 8.36 · section head 9.05 · permit no 8.65 · QR hint 6.20 · intro 10.55 · إقرارات 9.70 · declaration 10.45 · footer 9.60 / 9.35 | span-wise |

**Font substitution.** Frutiger LT Arabic is a paid Monotype font, so
**IBM Plex Sans Arabic** (Light / Regular / SemiBold) ships in `public/fonts/`.
Its widths were tuned per block so each line breaks exactly where the PDF
breaks. If you own Frutiger LT Arabic, drop the `.ttf` into `public/fonts/`
and add `@font-face` named `Frutiger LT Arabic` — the layout will get closer
still (`font-family` already lists it before the fallback).

---

## Header box

The PDF *does* draw three faint 0.72 pt boxes around the header cells. On screen
they read as one big "box", so they are **off by default**:

```js
headerFrame: false      // src/template/defaults.js
```

Turn them back on with the checkbox **«ہیڈر کے گرد باکس دکھائیں»** in the form,
or `out/permit-frame.html`. The frame is drawn with an `::after` overlay, so
toggling it never shifts the QR, the title or the two logos by even 0.1 pt.

## Text colour

Default `#000000` — the PDF's real colour. The earlier grey look came from the
font, not the colour: `-webkit-font-smoothing: antialiased` thins small Arabic
text. It is removed, and `--ink-stroke: 0.012em` adds back the measured weight.
Change the colour in the form (picker + hex field) → it propagates to preview,
print sheet **and** the exported HTML, because all three read the same
`--ink` CSS variable.

---

## Files

```
src/template/permitCss.js     all measured numbers + the whole A4 stylesheet
src/template/permitHtml.js    markup (form values flow in here)
src/template/defaults.js      default record (your PDF's values) + fixed legal text
src/App.jsx                   React form + live preview + print
src/App.css                   UI only (never touches the A4 sheet)
verify/render-html.mjs        writes out/permit.html for headless PDF export
public/fonts/                 3 × IBM Plex Sans Arabic
public/assets/                qr-permit.png (1200 dpi), ajeer-logo.png, hrdf-logo.png
```

All three outputs — preview, print, exported HTML — call **one** template
function and **one** CSS function, so they cannot drift apart.

---

## Note

This is a layout replica for data entry / printing, not an official Ajeer
document. The permit number and QR must be the real ones — a copied QR will
fail verification at <https://ajeer.com.sa>. Use the **«اپنا QR اپ لوڈ کریں»**
button to attach each new permit's own QR.
