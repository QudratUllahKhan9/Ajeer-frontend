import React from "react";
import "./App.css";

/* ----------------------------------------------------------------
   بيانات التصريح — yahan backend / API ka data pass karein.
----------------------------------------------------------------- */
const permit = {
  status: "ساري / فعال",
  successMessage: "تم التحقق من التصريح بنجاح",

  permitNumber: "TW0592947",
  permitType: "تصريح تعاقد أجير",
  permitStartDate: "2026-11-08",
  permitEndDate: "2027-02-07",

  workerName: "ZAKIR HUSSAIN ABDUL QADIR",
  workerId: "2458147978",
  nationality: "باكستان",
  profession: "سائق شاحنة ثقيلة",
  gender: "ذكر",
  birthDate: "1993-05-13",

  establishmentNumber: "4-8462574",
  establishmentName: "مؤسسة الهدف الاحمر للنقليات",
};

/* ----------------------------------------------------------------
   Logos (SVG approximations — replace with official files if needed)
----------------------------------------------------------------- */
function MinistryMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 3c3.4 8.6 9.6 13 9.6 21.4S35.4 39.6 32 44c-3.4-4.4-9.6-11.2-9.6-19.6S28.6 11.6 32 3z"
        fill="#f2821d"
      />
      <path
        d="M32 61c-3.4-8.6-9.6-13-9.6-21.4S28.6 24.4 32 20c3.4 4.4 9.6 11.2 9.6 19.6S35.4 52.4 32 61z"
        fill="#1f9d61"
      />
      <path
        d="M3 32c8.6-3.4 13-9.6 21.4-9.6S39.6 28.6 44 32c-4.4 3.4-11.2 9.6-19.6 9.6S11.6 35.4 3 32z"
        fill="#2f8f4e"
        opacity="0.92"
      />
      <path
        d="M61 32c-8.6 3.4-13 9.6-21.4 9.6S24.4 35.4 20 32c4.4-3.4 11.2-9.6 19.6-9.6S52.4 28.6 61 32z"
        fill="#86c440"
        opacity="0.95"
      />
    </svg>
  );
}

function MinistryLockup({ size = 26, large = false }) {
  return (
    <div className={`ministry${large ? " ministry--lg" : ""}`}>
      <MinistryMark size={size} />
      <div className="ministry__text">
        <span className="ministry__kingdom">المملكة العربية السعودية</span>
        <span className="ministry__name">الموارد البشرية والتنمية الاجتماعية</span>
      </div>
    </div>
  );
}

function AjeerLogo({ wordSize = 25, latin = true }) {
  return (
    <div className="ajeer-logo">
      <span className="ajeer-logo__word" style={{ fontSize: wordSize }}>
        أجير
      </span>
      {latin && <span className="ajeer-logo__latin">AJEER</span>}
    </div>
  );
}

function TakamolLogo() {
  return (
    <div className="takamol">
      <span className="takamol__ar">تكامل</span>
      <span className="takamol__en">Takamol</span>
    </div>
  );
}

function TamkeenLogo() {
  return (
    <div className="tamkeen">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 12h6l3-8 4 16 3-8h4" fill="none" stroke="#e07a1f" strokeWidth="2" />
        <circle cx="12" cy="12" r="10.5" fill="none" stroke="#d8dde3" strokeWidth="1" />
      </svg>
      <div className="tamkeen__text">
        <span className="tamkeen__ar">تمكين للتقنيات</span>
        <span className="tamkeen__en">Tamkeen Technologies</span>
      </div>
    </div>
  );
}

function DgaBadge() {
  return (
    <div className="dga">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect x="2" y="2" width="9" height="9" fill="#0f7d6b" />
        <rect x="15" y="2" width="9" height="9" fill="#2f9e6d" />
        <rect x="2" y="15" width="9" height="9" fill="#0f7d6b" />
        <rect x="15" y="15" width="4" height="4" fill="#2f9e6d" />
        <rect x="20" y="20" width="4" height="4" fill="#0f7d6b" />
      </svg>
      <div className="dga__text">
        <span className="dga__ar">هيئة الحكومة الرقمية</span>
        <span className="dga__en">Digital Government Authority</span>
      </div>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <rect width="30" height="30" fill="#fff" stroke="#d8dde3" />
        <g fill="#20303f">
          <rect x="3" y="3" width="6" height="6" />
          <rect x="21" y="3" width="6" height="6" />
          <rect x="3" y="21" width="6" height="6" />
          <rect x="12" y="12" width="3" height="3" />
          <rect x="18" y="12" width="3" height="3" />
          <rect x="12" y="18" width="3" height="3" />
          <rect x="21" y="18" width="3" height="3" />
          <rect x="15" y="4" width="2" height="2" />
          <rect x="5" y="14" width="2" height="2" />
        </g>
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------
   Small building blocks
----------------------------------------------------------------- */
function Band({ children }) {
  return (
    <tr>
      <th className="details__band" colSpan={4} scope="colgroup">
        {children}
      </th>
    </tr>
  );
}

function Field({ label, value, latin = false }) {
  return (
    <>
      <td className="details__label">{label}</td>
      <td className={`details__value${latin ? " details__value--latin" : ""}`}>
        {value}
      </td>
    </>
  );
}

function ChatFab() {
  return (
    <button className="fab" type="button" aria-label="الدعم والمساعدة">
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path
          d="M13.6 5.2c-5.1 0-9.2 3.2-9.2 7.2 0 2.3 1.3 4.3 3.4 5.6l-.7 3 3.3-1.7c1 .3 2.1.4 3.2.4"
          fill="none"
          stroke="#fff"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        <path
          d="M17.6 12.4c-4.1 0-7.4 2.6-7.4 5.8s3.3 5.8 7.4 5.8c.9 0 1.8-.1 2.6-.4l3.1 1.6-.7-2.8c1.8-1 2.9-2.6 2.9-4.2 0-3.2-3.3-5.8-7.4-5.8z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function FooterLink({ children }) {
  return (
    <a href="#top" onClick={(event) => event.preventDefault()}>
      {children}
    </a>
  );
}

/* ----------------------------------------------------------------
   Page
----------------------------------------------------------------- */
export default function App() {
  return (
    <div className="ajeer-page" id="top">
      <header className="site-header">
        <div className="site-header__right">
          <AjeerLogo wordSize={23} />
        </div>
        <div className="site-header__left">
          <MinistryLockup size={22} />
        </div>
      </header>

      <main className="verify">
        <section className="verify__card" aria-labelledby="page-title">
          <div className="card-head">
            <div className="card-head__cell card-head__cell--brand">
              <div className="brand-lockup">
                <MinistryLockup size={38} large />
                <AjeerLogo wordSize={34} />
              </div>
            </div>

            <div className="card-head__cell card-head__cell--title">
              <h1 className="card-head__title" id="page-title">
                التحقق من تصريح أجير
              </h1>
            </div>

            <div className="card-head__cell card-head__cell--status">
              <span className="status-ok">{permit.status}</span>
            </div>
          </div>

          <p className="card-note">{permit.successMessage}</p>

          <table className="details">
            <colgroup>
              <col style={{ width: "19%" }} />
              <col style={{ width: "31%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "31%" }} />
            </colgroup>

            <tbody>
              <Band>بيانات التصريح</Band>
              <tr>
                <Field label="رقم التصريح" value={permit.permitNumber} latin />
                <Field label="نوع التصريح" value={permit.permitType} />
              </tr>
              <tr>
                <Field label="تاريخ بداية التصريح" value={permit.permitStartDate} />
                <Field label="تاريخ نهاية التصريح" value={permit.permitEndDate} />
              </tr>

              <Band>بيانات العامل</Band>
              <tr>
                <Field label="اسم العامل" value={permit.workerName} latin />
                <Field label="رقم الهوية / الإقامة" value={permit.workerId} />
              </tr>
              <tr>
                <Field label="الجنسية" value={permit.nationality} />
                <Field label="المهنة" value={permit.profession} />
              </tr>
              <tr>
                <Field label="الجنس" value={permit.gender} />
                <Field label="تاريخ الميلاد" value={permit.birthDate} />
              </tr>

              <Band>بيانات المنشأة</Band>
              <tr>
                <Field label="رقم المنشأة" value={permit.establishmentNumber} />
                <Field label="اسم المنشأة" value={permit.establishmentName} />
              </tr>
            </tbody>
          </table>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h2 className="footer-col__title">أجير</h2>
              <FooterLink>عن أجير</FooterLink>
              <FooterLink>خدمات أجير</FooterLink>
            </div>

            <div className="footer-col">
              <h2 className="footer-col__title">الدعم</h2>
              <FooterLink>الدعم و المساعدة</FooterLink>
              <FooterLink>الأسئلة الشائعة</FooterLink>
            </div>

            <div className="footer-col">
              <h2 className="footer-col__title">الشروط و الخصوصية</h2>
              <FooterLink>الشروط والأحكام</FooterLink>
              <FooterLink>سياسة الخصوصية</FooterLink>
            </div>

            <div className="footer-col">
              <h2 className="footer-col__title">تواصل معنا</h2>
              <div className="footer-social">
                <a href="#top" aria-label="هاتف" onClick={(e) => e.preventDefault()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6.6 3h2.5l1.6 4-2 1.4a12 12 0 0 0 5.9 5.9l1.4-2 4 1.6v2.5A2.6 2.6 0 0 1 17.4 19C9.9 18.6 5.4 14.1 5 6.6A2.6 2.6 0 0 1 6.6 3z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#top" aria-label="تليجرام" onClick={(e) => e.preventDefault()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M21 4L3 11.2l4.6 1.5L9 19l2.8-3.4 4 2.8L21 4z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <a href="#top" aria-label="إكس" onClick={(e) => e.preventDefault()}>
                  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M4 3l7.2 9.3L4.4 21h2.3l5.6-6.9 5.2 6.9H21l-7.5-9.8L19.8 3h-2.3l-5.1 6.3L7.9 3H4z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-badges">
            <div className="footer-badges__dga">
              <DgaBadge />
            </div>

            <div className="footer-badges__partners">
              <TamkeenLogo />
              <TakamolLogo />
              <MinistryLockup size={26} />
            </div>
          </div>
        </div>
      </footer>

      <ChatFab />
    </div>
  );
}
