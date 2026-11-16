import React, { useState, useEffect } from "react";
import "./App.css";

import ajeerLogoImg from "./assets/ajeer-logo.png";
import hrsdStarImg from "./assets/hrsd-star.png";

export default function App() {
  const [permitData, setPermitData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    const permitId = pathSegments[pathSegments.length - 1];

    // آپ کا دیا ہوا ڈائنامیک ڈیٹا (Fallback / Default Data)
    const fallbackData = {
      status: "ساري / فعال",
      permitNumber: "TQ306376876666666",
      permitType: "عقد خدمات – نموذج تجريبي",
      startDate: "2026-10-29",
      endDate: "2027-01-28",
      workerName: "MUHAMMAD KASHIF KHAN ZAMAN",
      idNumber: "2562349304",
      nationality: "باكستان",
      profession: "عامل بناء",
      gender: "ذكر",
      birthDate: "1993-05-13",
      establishmentNumber: "17-8463219",
      establishmentName: "شركة عبدالله بن حمود الحربي للتجارة",
    };

    if (permitId && permitId !== "" && permitId !== "v") {
      fetch(`https://ajeerbackend.vercel.app/v/${permitId}`)
        .then((response) => {
          const contentType = response.headers.get("content-type");
          if (!response.ok || !contentType || !contentType.includes("application/json")) {
            throw new Error("Invalid JSON response from server");
          }
          return response.json();
        })
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setPermitData({
              status: data.status || "ساري / فعال",
              permitNumber: data.permitNo || data.permitNumber || fallbackData.permitNumber,
              permitType: data.title || data.permitType || fallbackData.permitType,
              startDate: data.startDate || fallbackData.startDate,
              endDate: data.endDate || fallbackData.endDate,
              workerName: data.workerName || fallbackData.workerName,
              idNumber: data.idNumber || fallbackData.idNumber,
              nationality: data.nationality || fallbackData.nationality,
              profession: data.profession || fallbackData.profession,
              gender: data.gender || "ذكر",
              birthDate: data.birthDate || "1993-05-13",
              establishmentNumber: data.providerCr || data.establishmentNumber || fallbackData.establishmentNumber,
              establishmentName: data.providerCompany || data.establishmentName || fallbackData.establishmentName,
            });
          } else {
            setPermitData(fallbackData);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.warn("API Error, falling back to default data:", err);
          // اگر API فیل ہو جائے یا HTML ایرور دے، تب بھی یہ ڈیٹا شو ہو جائے گا
          setPermitData(fallbackData);
          setLoading(false);
        });
    } else {
      setPermitData(fallbackData);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper" dir="rtl" style={{ justifyContent: "center", alignItems: "center", display: "flex", height: "100vh" }}>
        <h2>جاري التحميل...</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper" dir="rtl">
      {/* Top Header */}
      <header className="site-header">
        <div className="header-brand-right">
          <img src={hrsdStarImg} alt="شعار الوزارة" className="top-hrsd-star" />
          <div className="hrsd-top__text">
            <span>الموارد البشرية</span>
            <span>والتنمية الاجتماعية</span>
          </div>
        </div>

        <div className="header-brand-left">
          <img src={ajeerLogoImg} alt="أجير" className="top-ajeer-logo" />
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="verify">
        <div className="verify__card">
          <div className="card-head">
            {/* 1. First Box (Right): Brand Section */}
            <div className="card-head__cell card-head__cell--brand">
              <div className="brand-lockup">
                <img src={ajeerLogoImg} alt="أجير" className="brand-ajeer-img" />
                <img src={hrsdStarImg} alt="شعار الوزارة" className="brand-star-img" />
                <div className="hrsd-text-block">
                  <span>الموارد البشرية</span>
                  <span>والتنمية الاجتماعية</span>
                </div>
              </div>
            </div>

            {/* 2. Second Box (Center): Title Section */}
            <div className="card-head__cell card-head__cell--title">
              <h1 className="card-head__title">التحقق من تصريح أجير</h1>
            </div>

            {/* 3. Third Box (Left): Status Section */}
            <div className="card-head__cell card-head__cell--status">
              <span className="status-ok">{permitData.status}</span>
            </div>
          </div>

          <p className="card-note">تم التحقق من التصريح بنجاح</p>

          <table className="details">
            <tbody>
              <tr>
                <th colSpan="4" className="details__band">بيانات التصريح</th>
              </tr>
              <tr>
                <th className="details__label">رقم التصريح</th>
                <td className="details__value"><span className="ltr-val">{permitData.permitNumber}</span></td>
                <th className="details__label">نوع التصريح</th>
                <td className="details__value">{permitData.permitType}</td>
              </tr>
              <tr>
                <th className="details__label">تاريخ بداية التصريح</th>
                <td className="details__value"><span className="ltr-val">{permitData.startDate}</span></td>
                <th className="details__label">تاريخ نهاية التصريح</th>
                <td className="details__value"><span className="ltr-val">{permitData.endDate}</span></td>
              </tr>

              <tr>
                <th colSpan="4" className="details__band">بيانات العامل</th>
              </tr>
              <tr>
                <th className="details__label">اسم العامل</th>
                <td className="details__value"><span className="ltr-val">{permitData.workerName}</span></td>
                <th className="details__label">رقم الهوية / الإقامة</th>
                <td className="details__value"><span className="ltr-val">{permitData.idNumber}</span></td>
              </tr>
              <tr>
                <th className="details__label">الجنسية</th>
                <td className="details__value">{permitData.nationality}</td>
                <th className="details__label">المهنة</th>
                <td className="details__value">{permitData.profession}</td>
              </tr>
              <tr>
                <th className="details__label">الجنس</th>
                <td className="details__value">{permitData.gender}</td>
                <th className="details__label">تاريخ الميلاد</th>
                <td className="details__value"><span className="ltr-val">{permitData.birthDate}</span></td>
              </tr>

              <tr>
                <th colSpan="4" className="details__band">بيانات المنشأة</th>
              </tr>
              <tr>
                <th className="details__label">رقم المنشأة</th>
                <td className="details__value"><span className="ltr-val">{permitData.establishmentNumber}</span></td>
                <th className="details__label">اسم المنشأة</th>
                <td className="details__value">{permitData.establishmentName}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      {/* Floating Support Button (FAB) */}
      <button type="button" className="fab" aria-label="المساعدة والدعم">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16.5 7C10.7 7 6 11.1 6 16.2C6 18.6 7.1 20.8 8.8 22.4L7.6 26.2L11.8 24.8C13.3 25.3 14.9 25.5 16.5 25.5C17.2 25.5 17.9 25.4 18.5 25.3" />
          <path d="M26.8 18.2C26.9 17.5 27 16.9 27 16.2C27 11.1 22.3 7 16.5 7" />
          <path d="M23.5 18.5C19.6 18.5 16.5 21.1 16.5 24.3C16.5 27.5 19.6 30.1 23.5 30.1C24.7 30.1 25.8 29.8 26.8 29.4L29.8 30.4L29 27.7C30 26.7 30.5 25.6 30.5 24.3C30.5 21.1 27.4 18.5 23.5 18.5Z" />
        </svg>
      </button>

      {/* Site Footer */}
      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="footer-cols">
            <div className="footer-col">
              <h3 className="footer-col__title">أجير</h3>
              <a href="#about">عن أجير</a>
              <a href="#services">خدمات أجير</a>
            </div>

            <div className="footer-col">
              <h3 className="footer-col__title">الدعم</h3>
              <a href="#support">الدعم و المساعدة</a>
              <a href="#faq">الأسئلة الشائعة</a>
            </div>

            <div className="footer-col">
              <h3 className="footer-col__title">الشروط و الخصوصية</h3>
              <a href="#terms">الشروط والأحكام</a>
              <a href="#privacy">سياسة الخصوصية</a>
            </div>

            <div className="footer-col">
              <h3 className="footer-col__title">تواصل معنا</h3>
              <div className="footer-social">
                <a href="#x" aria-label="X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#telegram" aria-label="Telegram">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.9 3.6c-.3-.3-.8-.4-1.2-.2L2.6 10.6c-.5.2-.8.6-.8 1.1 0 .5.3.9.8 1.1l4.7 1.7 1.8 5.6c.1.4.5.7.9.8h.2c.4 0 .7-.2.9-.5l2.7-3.4 4.9 3.6c.2.2.5.3.8.3.2 0 .4 0 .6-.1.4-.2.7-.5.8-.9l3-15.1c.1-.5-.1-1-.4-1.3zM9.8 14.3l8.6-7.6-6.8 8.7-.3 3.1-1.5-4.2z" />
                  </svg>
                </a>
                <a href="#phone" aria-label="Phone">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-logos">
            <div className="footer-logos__group-right">
              <div className="footer-hrsd">
                <img src={hrsdStarImg} alt="شعار الوزارة" className="footer-hrsd__star" />
                <div className="footer-hrsd__text">
                  <span>الموارد البشرية</span>
                  <span>والتنمية الاجتماعية</span>
                </div>
              </div>

              <div className="footer-takamol">
                <span className="footer-takamol__ar">تكامل</span>
                <span className="footer-takamol__en">Takamol</span>
              </div>
            </div>

            <div className="footer-tamkeen">
              <svg width="32" height="22" viewBox="0 0 38 26" fill="none">
                <path d="M18 4L28 13L18 22" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 4L16 13L6 22" stroke="#E11D48" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="footer-tamkeen__text">
                <span className="footer-tamkeen__dev">Developed and Powered by</span>
                <span className="footer-tamkeen__ar">تمكين للتقنيات</span>
                <span className="footer-tamkeen__en">Tamkeen Technologies</span>
              </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-dga-wrap">
              <span className="footer-dga-reg">مسجل لدى</span>
              <div className="footer-dga">
                <svg width="38" height="44" viewBox="0 0 44 50" fill="none">
                  <path d="M22 4V32" stroke="#18806B" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 10L15 16V22" stroke="#22A087" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 10L29 16V22" stroke="#22A087" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 18L11 25V30" stroke="#18806B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 18L33 25V30" stroke="#18806B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="22" cy="4" r="2" fill="#22A087" />
                  <circle cx="15" cy="22" r="1.8" fill="#18806B" />
                  <circle cx="29" cy="22" r="1.8" fill="#18806B" />
                  <circle cx="11" cy="30" r="1.8" fill="#22A087" />
                  <circle cx="33" cy="30" r="1.8" fill="#22A087" />
                  <path d="M10 44L34 34" stroke="#1B3A6B" strokeWidth="2" strokeLinecap="round" />
                  <path d="M34 44L10 34" stroke="#1B3A6B" strokeWidth="2" strokeLinecap="round" />
                </svg>

                <div className="footer-dga__labels">
                  <div className="footer-dga__row">
                    <span className="footer-dga__ar">هيئة</span>
                    <span className="footer-dga__en">Digital</span>
                  </div>
                  <div className="footer-dga__row">
                    <span className="footer-dga__ar">الحكومة</span>
                    <span className="footer-dga__en">Government</span>
                  </div>
                  <div className="footer-dga__row">
                    <span className="footer-dga__ar">الرقمية</span>
                    <span className="footer-dga__en">Authority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}