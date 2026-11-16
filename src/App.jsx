
import React, { useEffect, useState } from "react";
import "./App.css";

import ajeerLogoImg from "./assets/ajeer-logo.png";
import hrsdStarImg from "./assets/hrsd-star.png";

/* =====================================================
   API CONFIGURATION
===================================================== */

const ENV = import.meta.env || {};

const API_URL = String(ENV.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

const TIMEOUT_MS = Number(ENV.VITE_API_TIMEOUT || 12000);

/*
  Backend route candidates.
  Apne backend ke actual routes ke mutabiq ye routes
  automatically try kiye jayenge.
*/

function getPermitId() {
  const params = new URLSearchParams(window.location.search);

  const queryId =
    params.get("id") ||
    params.get("permit") ||
    params.get("permitId");

  if (queryId) return queryId;

  const segments = window.location.pathname
    .split("/")
    .filter(Boolean);

  const routeNames = ["v", "permit", "permits", "p", "pdf"];

  const routeIndex = segments.findIndex((segment) =>
    routeNames.includes(decodeURIComponent(segment).toLowerCase())
  );

  if (routeIndex !== -1 && segments[routeIndex + 1]) {
    return decodeURIComponent(segments[routeIndex + 1]);
  }

  return "";
}

/* =====================================================
   NORMALIZE DATABASE RESPONSE
===================================================== */

function normalizePermit(response) {
  let data = response;

  for (let i = 0; i < 5; i++) {
    if (Array.isArray(data)) {
      data = data[0];
      continue;
    }

    if (data && Array.isArray(data.items)) {
      data = data.items[0];
      continue;
    }

    if (
      data &&
      typeof data === "object" &&
      (data.data || data.permit || data.record || data.item)
    ) {
      data =
        data.data ||
        data.permit ||
        data.record ||
        data.item;

      continue;
    }

    break;
  }

  if (!data || typeof data !== "object") {
    throw new Error("Permit record not found.");
  }

  const getValue = (...keys) => {
    for (const key of keys) {
      const value = data[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return String(value);
      }
    }

    return "";
  };

  return {
    status: getValue("status", "permitStatus"),

    permitNumber: getValue(
      "permitNo",
      "permitNumber",
      "permitId"
    ),

    permitType: getValue(
      "title",
      "permitType",
      "type"
    ),

    startDate: getValue(
      "startDate",
      "permitStartDate"
    ),

    endDate: getValue(
      "endDate",
      "permitEndDate"
    ),

    workerName: getValue(
      "workerName",
      "worker",
      "name"
    ),

    idNumber: getValue(
      "idNumber",
      "iqama",
      "workerId",
      "iqamaNumber",
      "idNo"
    ),

    nationality: getValue("nationality"),

    profession: getValue("profession"),

    gender: getValue("gender", "sex"),

    birthDate: getValue(
      "birthDate",
      "dob",
      "dateOfBirth"
    ),

    establishmentNumber: getValue(
      "providerCr",
      "establishmentNumber",
      "establishmentNo"
    ),

    establishmentName: getValue(
      "providerCompany",
      "establishmentName",
      "providerName"
    ),

    beneficiary: getValue(
      "beneficiaryCompany",
      "beneficiary"
    ),

    location: getValue(
      "workSites",
      "location"
    ),

    qrImageUrl:
      data.qr?.imageUrl ||
      data.qrImageUrl ||
      "",

    permitId: getValue("permitId", "_id"),
  };
}

/* =====================================================
   FETCH API WITH TIMEOUT
===================================================== */

async function fetchWithTimeout(url) {
  const controller = new AbortController();

  const timer = setTimeout(
    () => controller.abort(),
    TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timer);
  }
}

/* =====================================================
   FETCH PERMIT FROM BACKEND
===================================================== */

async function fetchPermit(permitId) {
  const base = API_URL;

  const encodedId = encodeURIComponent(permitId);

  const lowerId = encodeURIComponent(
    String(permitId).toLowerCase()
  );

  const candidates = [
    `${base}/api/records/${lowerId}`,
    `${base}/api/permits/${encodedId}`,
    `${base}/api/permits/${lowerId}`,
    `${base}/api/permits?q=${encodedId}`,
    `${base}/api/v/${encodedId}`,
    `${base}/v/${encodedId}`,
  ];

  const errors = [];

  for (const url of candidates) {
    try {
      console.log("Trying API:", url);

      const response = await fetchWithTimeout(url);

      const contentType =
        response.headers.get("content-type") || "";

      const rawText = await response.text();

      console.log("API status:", response.status);
      console.log("API content type:", contentType);

      if (response.status === 404) {
        errors.push(`${url}: 404 Not Found`);
        continue;
      }

      if (!response.ok) {
        errors.push(`${url}: HTTP ${response.status}`);
        continue;
      }

      if (!/json/i.test(contentType)) {
        console.error(
          "HTML response received:",
          rawText.substring(0, 300)
        );

        errors.push(`${url}: HTML instead of JSON`);
        continue;
      }

      let json;

      try {
        json = JSON.parse(rawText);
      } catch {
        errors.push(`${url}: Invalid JSON`);
        continue;
      }

      if (json.success === false) {
        errors.push(
          `${url}: ${json.message || "Permit not found"}`
        );
        continue;
      }

      const permit = normalizePermit(json);

      if (!permit.permitNumber && !permit.workerName) {
        errors.push(`${url}: Permit fields are empty`);
        continue;
      }

      console.log("Permit successfully loaded:", permit);

      return permit;

    } catch (error) {
      if (error.name === "AbortError") {
        errors.push(`${url}: Request timeout`);
      } else {
        console.error("API request error:", error);
        errors.push(`${url}: ${error.message}`);
      }
    }
  }

  throw new Error(
    "Permit data load nahi ho saka. Backend API route check karein.\n" +
    errors.join("\n")
  );
}

/* =====================================================
   MAIN APP
===================================================== */

export default function App() {
  const [permitData, setPermitData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadPermit() {
      const permitId = getPermitId();

      setLoading(true);
      setError("");
      setPermitData(null);

      if (!permitId) {
        setError(
          "تصريح نمبر غير موجود في الرابط"
        );

        setLoading(false);
        return;
      }

      console.log("Fetching data for ID:", permitId);

      try {
        const data = await fetchPermit(permitId);

        if (!active) return;

        setPermitData(data);

      } catch (err) {
        console.error("Permit Fetch Error:", err);

        if (!active) return;

        setError(err.message || "تعذر تحميل بيانات التصريح");

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPermit();

    return () => {
      active = false;
    };
  }, [retry]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div
        className="page-wrapper"
        dir="rtl"
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          minHeight: "100vh",
        }}
      >
        <h2>جاري التحميل...</h2>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !permitData) {
    return (
      <div
        className="page-wrapper"
        dir="rtl"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "25px",
        }}
      >
        <h2>تعذر التحقق من التصريح</h2>

        <p
          style={{
            maxWidth: "600px",
            margin: "15px 0",
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
        >
          {error}
        </p>

        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          style={{
            padding: "10px 24px",
            border: "none",
            borderRadius: "5px",
            background: "#087c52",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  /* =====================================================
     MAIN DESIGN — ORIGINAL FIRST DESIGN
  ===================================================== */

  return (
    <div className="page-wrapper" dir="rtl">

      {/* Top Header */}

      <header className="site-header">

        <div className="header-brand-right">

          <img
            src={hrsdStarImg}
            alt="شعار الوزارة"
            className="top-hrsd-star"
          />

          <div className="hrsd-top__text">
            <span>الموارد البشرية</span>
            <span>والتنمية الاجتماعية</span>
          </div>

        </div>

        <div className="header-brand-left">

          <img
            src={ajeerLogoImg}
            alt="أجير"
            className="top-ajeer-logo"
          />

        </div>

      </header>

      {/* Main Verification Card */}

      <main className="verify">

        <div className="verify__card">

          <div className="card-head">

            {/* Brand Section */}

            <div className="card-head__cell card-head__cell--brand">

              <div className="brand-lockup">

                <img
                  src={ajeerLogoImg}
                  alt="أجير"
                  className="brand-ajeer-img"
                />

                <img
                  src={hrsdStarImg}
                  alt="شعار الوزارة"
                  className="brand-star-img"
                />

                <div className="hrsd-text-block">

                  <span>الموارد البشرية</span>

                  <span>والتنمية الاجتماعية</span>

                </div>

              </div>

            </div>

            {/* Title Section */}

            <div className="card-head__cell card-head__cell--title">

              <h1 className="card-head__title">
                التحقق من تصريح أجير
              </h1>

            </div>

            {/* Status Section */}

            <div className="card-head__cell card-head__cell--status">

              <span className="status-ok">
                {permitData.status || "ساري / فعال"}
              </span>

            </div>

          </div>

          <p className="card-note">
            تم التحقق من التصريح بنجاح
          </p>

          <table className="details">

            <tbody>

              {/* Permit Information */}

              <tr>
                <th colSpan="4" className="details__band">
                  بيانات التصريح
                </th>
              </tr>

              <tr>

                <th className="details__label">
                  رقم التصريح
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.permitNumber || "-"}
                  </span>
                </td>

                <th className="details__label">
                  نوع التصريح
                </th>

                <td className="details__value">
                  {permitData.permitType || "-"}
                </td>

              </tr>

              <tr>

                <th className="details__label">
                  تاريخ بداية التصريح
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.startDate || "-"}
                  </span>
                </td>

                <th className="details__label">
                  تاريخ نهاية التصريح
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.endDate || "-"}
                  </span>
                </td>

              </tr>

              {/* Worker Information */}

              <tr>
                <th colSpan="4" className="details__band">
                  بيانات العامل
                </th>
              </tr>

              <tr>

                <th className="details__label">
                  اسم العامل
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.workerName || "-"}
                  </span>
                </td>

                <th className="details__label">
                  رقم الهوية / الإقامة
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.idNumber || "-"}
                  </span>
                </td>

              </tr>

              <tr>

                <th className="details__label">
                  الجنسية
                </th>

                <td className="details__value">
                  {permitData.nationality || "-"}
                </td>

                <th className="details__label">
                  المهنة
                </th>

                <td className="details__value">
                  {permitData.profession || "-"}
                </td>

              </tr>

              <tr>

                <th className="details__label">
                  الجنس
                </th>

                <td className="details__value">
                  {permitData.gender || "-"}
                </td>

                <th className="details__label">
                  تاريخ الميلاد
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.birthDate || "-"}
                  </span>
                </td>

              </tr>

              {/* Establishment Information */}

              <tr>
                <th colSpan="4" className="details__band">
                  بيانات المنشأة
                </th>
              </tr>

              <tr>

                <th className="details__label">
                  رقم المنشأة
                </th>

                <td className="details__value">
                  <span className="ltr-val">
                    {permitData.establishmentNumber || "-"}
                  </span>
                </td>

                <th className="details__label">
                  اسم المنشأة
                </th>

                <td className="details__value">
                  {permitData.establishmentName || "-"}
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </main>

      {/* Floating Support Button */}

      <button
        type="button"
        className="fab"
        aria-label="المساعدة والدعم"
      >

        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >

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

              <h3 className="footer-col__title">
                الشروط و الخصوصية
              </h3>

              <a href="#terms">الشروط والأحكام</a>

              <a href="#privacy">سياسة الخصوصية</a>

            </div>

            <div className="footer-col">

              <h3 className="footer-col__title">
                تواصل معنا
              </h3>

              <div className="footer-social">

                <a href="#x" aria-label="X">

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>

                </a>

                <a href="#telegram" aria-label="Telegram">

                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21.9 3.6c-.3-.3-.8-.4-1.2-.2L2.6 10.6c-.5.2-.8.6-.8 1.1 0 .5.3.9.8 1.1l4.7 1.7 1.8 5.6c.1.4.5.7.9.8h.2c.4 0 .7-.2.9-.5l2.7-3.4 4.9 3.6c.2.2.5.3.8.3.2 0 .4 0 .6-.1.4-.2.7-.5.8-.9l3-15.1c.1-.5-.1-1-.4-1.3zM9.8 14.3l8.6-7.6-6.8 8.7-.3 3.1-1.5-4.2z" />
                  </svg>

                </a>

                <a href="#phone" aria-label="Phone">

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
                  </svg>

                </a>

              </div>

            </div>

          </div>

          <div className="footer-logos">

            <div className="footer-logos__group-right">

              <div className="footer-hrsd">

                <img
                  src={hrsdStarImg}
                  alt="شعار الوزارة"
                  className="footer-hrsd__star"
                />

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

              <svg
                width="32"
                height="22"
                viewBox="0 0 38 26"
                fill="none"
              >
                <path
                  d="M18 4L28 13L18 22"
                  stroke="#F59E0B"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path
                  d="M6 4L16 13L6 22"
                  stroke="#E11D48"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

              </svg>

              <div className="footer-tamkeen__text">

                <span className="footer-tamkeen__dev">
                  Developed and Powered by
                </span>

                <span className="footer-tamkeen__ar">
                  تمكين للتقنيات
                </span>

                <span className="footer-tamkeen__en">
                  Tamkeen Technologies
                </span>

              </div>

            </div>

            <div className="footer-divider"></div>

            <div className="footer-dga-wrap">

              <span className="footer-dga-reg">
                مسجل لدى
              </span>

              <div className="footer-dga">

                <svg
                  width="38"
                  height="44"
                  viewBox="0 0 44 50"
                  fill="none"
                >
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
