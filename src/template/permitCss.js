/**
 * permitCss(baseUrl, tune)
 * ===========================================================================
 * ALL coordinates are MEASURED from the source PDF (PyMuPDF), never eyeballed.
 * Page: A4 = 594.96 x 841.92 pt  (Adobe Illustrator export, 1 page)
 *
 *  TEXT COLOUR ....... every span in the PDF is rgb(0,0,0)  -> #000000
 *                      (verified with page.get_text("dict") -> span["color"])
 *  table border ...... rgb(206,207,213) = #CECFD5, 0.75 pt
 *  header frame ...... rgb(206,207,213) = #CECFD5, 0.72 pt   <- OPTIONAL, see below
 *  cell / section fill rgb(235,240,241) = #EBF0F1
 *  table frame ....... x 57.07 .. 552.38 (495.31pt), top 197.37pt
 *  rows .............. 24.45 / 19.05 / 19.05 / 24.45 / 29.85 / 24.45 / 29.85
 *                       / 24.45 / 19.05 / 19.05 / 19.05  -> ends 450.12
 *
 * HEADER FRAME
 *   The PDF draws 3 faint 0.72pt boxes around the header cells. Because they
 *   read as a "box" on screen, they are OFF by default (`frame:false`) and
 *   drawn with an ::after overlay when ON — so switching never moves the QR,
 *   the title or the logos by even 0.1pt.
 *
 * TEXT WEIGHT
 *   Original font = Frutiger LT Arabic 45 Light. The free match bundled here
 *   (IBM Plex Sans Arabic Light) renders ~1 step lighter in browsers, which is
 *   what made the text look grey. `-webkit-font-smoothing` is NOT used (it
 *   thins text) and `--ink-stroke` adds the measured amount of weight back.
 */
const TUNE = {
  fsTitle: 13.1, // pt — original outlined title ink is 120.0pt wide
  fsIntro: 10.30, // pt
  lhIntro: 14.65, // pt
  fsDeclH: 9.86, // pt  (إقرارات)
  fsDeclI: 9.98, // pt  (أقر أنا المنشأة …)
  fsDecl: 10.28, // pt  (bullet body)
  lhDecl: 16.20, // pt
  fsTable: 8.99, // pt
  fsName: 8.36, // pt  (worker-name cell)
  ink: '#000000', // pt-colour of all text (measured)
  inkStroke: '0.019em', // browser weight compensation (see note above)
  frame: false // header box: ON only if you want the PDF's 0.72pt lines
}

export function permitCss(baseUrl = '/', tune = {}) {
  const T = { ...TUNE, ...tune }
  const f = (n) => `url('${baseUrl}fonts/${n}') format('truetype')`
  return `
@font-face{font-family:'PlexArabic';font-style:normal;font-weight:300;src:${f('IBMPlexSansArabic-Light.ttf')};}
@font-face{font-family:'PlexArabic';font-style:normal;font-weight:400;src:${f('IBMPlexSansArabic-Regular.ttf')};}
@font-face{font-family:'PlexArabic';font-style:normal;font-weight:600;src:${f('IBMPlexSansArabic-SemiBold.ttf')};}
@font-face{font-family:'PlexArabic';font-style:normal;font-weight:700;src:${f('IBMPlexSansArabic-SemiBold.ttf')};}

.page{
  --line:#CECFD5;
  --fill:#EBF0F1;
  --ink:${T.ink};
  --ink-stroke:${T.inkStroke};
  position:relative;
  width:594.96pt;
  height:841.92pt;
  background:#ffffff;
  color:var(--ink);
  overflow:hidden;
  direction:rtl;
  font-family:'PlexArabic','Frutiger LT Arabic',Arial,Helvetica,sans-serif;
  font-weight:300;
  text-rendering:geometricPrecision;
  font-synthesis:none;
  -webkit-text-stroke:var(--ink-stroke) currentColor;
}
.page *{box-sizing:border-box;margin:0;padding:0;color:inherit;}
.page img{display:block;}

/* ------------------------------ HEADER ------------------------------
   no border by default — exactly like the PDF's clean letterhead.
   .page.frame puts the PDF's own 0.72pt boxes back (overlay, no reflow). */
.hcell{position:absolute;top:30.15pt;height:84.05pt;border:0;}
.page.frame .hcell::after{
  content:'';position:absolute;left:0;top:0;right:0;bottom:0;
  border:0.72pt solid var(--line);pointer-events:none;
}
.h1{left:58.49pt;width:77.03pt;}
.h2{left:137.68pt;width:251.33pt;}
.h3{left:391.18pt;width:159.30pt;}

.qr   {position:absolute;left:9.93pt;top:4.07pt;width:57.80pt;height:57.42pt;}
.pno  {position:absolute;left:0;top:60.60pt;width:77.03pt;text-align:center;
       font-size:8.65pt;line-height:11.2pt;font-weight:400;}
.phint{position:absolute;left:0;top:73.20pt;width:77.03pt;text-align:center;
       font-size:6.20pt;line-height:8.4pt;font-weight:600;}

.ptitle{position:absolute;left:0;top:0;width:251.33pt;height:84.05pt;
        line-height:84.05pt;text-align:center;font-weight:600;
        font-size:${T.fsTitle}pt;white-space:nowrap;}

.lg1{position:absolute;left:8.29pt;top:27.13pt;width:36.04pt;height:29.78pt;}
.lg2{position:absolute;left:56.58pt;top:27.13pt;width:93.71pt;height:28.79pt;}

/* --------------------------- INTRO PARAGRAPH ------------------------- */
.para{position:absolute;left:57.07pt;top:139.30pt;width:492.60pt;
      text-align:right;font-size:${T.fsIntro}pt;line-height:${T.lhIntro}pt;font-weight:300;}
.para div{white-space:nowrap;}

/* ------------------------------- TABLE ------------------------------- */
.tbl{position:absolute;left:57.07pt;top:197.37pt;width:495.31pt;
     table-layout:fixed;border-collapse:collapse;}
.tbl td{border:0.75pt solid var(--line);padding:0 4pt;
        font-size:${T.fsTable}pt;line-height:9.6pt;
        vertical-align:middle;text-align:right;font-weight:300;}
.tbl td.sec{background:var(--fill);text-align:center;font-weight:600;
            font-size:9.05pt;line-height:10pt;}
.tbl td.lbl{background:var(--fill);}
.tbl td.name{font-size:${T.fsName}pt;line-height:9.5pt;}

/* --------------------------- DECLARATIONS ---------------------------- */
.decl{position:absolute;left:57.07pt;top:455.00pt;width:489.13pt;text-align:right;}
.decl .ln{white-space:nowrap;}
.decl .h{position:absolute;left:0;top:3.10pt;width:100%;text-align:center;
         font-size:${T.fsDeclH}pt;line-height:12pt;font-weight:600;}
.decl .intro{position:absolute;left:0;top:25.40pt;width:100%;
             font-size:${T.fsDeclI}pt;line-height:15.2pt;font-weight:600;}
.decl .items{position:absolute;left:0;top:41.60pt;width:100%;
             font-size:${T.fsDecl}pt;line-height:${T.lhDecl}pt;font-weight:300;}
.decl .items .ln{line-height:16.20pt;}
.decl .it{margin:0;padding:0;}
.decl .b{font-weight:400;}

/* ------------------------------- FOOTER ------------------------------ */
.f1{position:absolute;left:57.07pt;top:786.50pt;width:495.31pt;text-align:center;
    font-size:9.60pt;line-height:12pt;}
.f2{position:absolute;left:57.07pt;top:798.00pt;width:495.31pt;text-align:center;
    font-size:10.25pt;line-height:11pt;}
`
}
