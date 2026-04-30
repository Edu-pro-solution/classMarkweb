import React, { Fragment, useContext, useRef } from "react";
import { Box } from "@mui/system";
import { Button, styled, LinearProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import { SessionContext } from "../../../components/MatxLayout/Layout1/SessionContext";
import FirstTermRep from "./FirstTermRep";
import TermRep from "./TermRep";
import ThirdTermRep from "./ThirdTermRep";

import "./report.css";
import "./print.css";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const TERM_CONFIG = {
  "first-term":  { label: "First Term",  Component: FirstTermRep },
  "second-term": { label: "Second Term", Component: TermRep },
  "third-term":  { label: "Third Term",  Component: ThirdTermRep },
};

const BulkPrintClass = () => {
  const { classId, term } = useParams();
  const navigate = useNavigate();
  const { currentSession } = useContext(SessionContext);
  const printRef = useRef();

  const termConfig = TERM_CONFIG[term] ?? TERM_CONFIG["first-term"];
  const { label: termLabel, Component: ReportComponent } = termConfig;

  // Same endpoint pattern your Info.jsx uses
  const { data, loading } = useFetch(
    currentSession ? `/student/${classId?.toUpperCase()}/${currentSession._id}` : null
  );

  const allStudents = Array.isArray(data) ? data : [];

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (!printWindow) {
      alert("Please allow popups for bulk printing to work.");
      return;
    }

    // Copy all stylesheets exactly like your existing handlePrintInNewTab does
    const styleSheets = [...document.styleSheets]
      .map((styleSheet) => {
        try {
          return [...styleSheet.cssRules]
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.error("Error accessing stylesheet:", e);
          return "";
        }
      })
      .join("\n");

    const pageBreakCSS = `
      @media print {
        .page-break { 
          page-break-after: always; 
          break-after: page; 
        }
        .dont-print { display: none !important; }
        body { margin: 0; padding: 0; }
      }
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${termLabel} Report Cards — ${classId?.toUpperCase()}</title>
          <style>${styleSheets}${pageBreakCSS}</style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    // Wait for images/styles to load before printing — same approach as your TermRep
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 2000);
  };

  return (
    <Fragment>
      <ContentBox className="analytics">

        {/* ── Toolbar — hidden when printing ── */}
        <div
          className="dont-print"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: "white",
              border: "1px solid black",
              padding: "8px 14px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ← Back
          </button>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, color: "#042954", fontSize: "20px" }}>
              Bulk Print — {termLabel} Report Cards
            </h2>
            <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
              Class:{" "}
              <strong style={{ color: "#042954" }}>
                {classId?.toUpperCase()}
              </strong>{" "}
              ·{" "}
              {loading ? (
                "Loading students..."
              ) : (
                <strong>{allStudents.length} students found</strong>
              )}
            </p>
          </div>

          {/* Print All button */}
          <button
            onClick={handlePrint}
            disabled={loading || allStudents.length === 0}
            style={{
              backgroundColor:
                loading || allStudents.length === 0 ? "#ccc" : "#042954",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              cursor:
                loading || allStudents.length === 0 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "15px",
            }}
          >
            🖨 Print All {allStudents.length > 0 ? `(${allStudents.length})` : ""} Report Cards
          </button>
        </div>

        {/* ── Loading bar ── */}
        {loading && (
          <div className="dont-print" style={{ marginBottom: "20px" }}>
            <LinearProgress />
            <p style={{ color: "#555", fontSize: "14px", marginTop: "8px" }}>
              Loading students for {classId?.toUpperCase()}…
            </p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && allStudents.length === 0 && (
          <div
            className="dont-print"
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#555",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            No students found in class {classId?.toUpperCase()}.
          </div>
        )}

        {/* ── Warning notice ── */}
        {!loading && allStudents.length > 0 && (
          <div
            className="dont-print"
            style={{
              backgroundColor: "#fff8e1",
              border: "1px solid #ffe082",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#7a5f00",
            }}
          >
            ⚠️ <strong>Wait</strong> for all {allStudents.length} report cards
            to fully load below before clicking <strong>Print All</strong>.
            Scroll down to confirm all cards have rendered.
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
              }}
            >
              {allStudents.map((s, i) => (
                <span
                  key={s._id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    backgroundColor: "white",
                    fontSize: "12px",
                    color: "#042954",
                  }}
                >
                  {i + 1}. {s.studentName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── All report cards stacked — this is what gets printed ── */}
        <div ref={printRef}>
          {allStudents.map((student, index) => (
            <div
              key={student._id}
              className={index < allStudents.length - 1 ? "page-break" : ""}
              style={{
                pageBreakAfter:
                  index < allStudents.length - 1 ? "always" : "auto",
                breakAfter:
                  index < allStudents.length - 1 ? "page" : "auto",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <ReportComponent studentId={student._id} />
            </div>
          ))}
        </div>

      </ContentBox>
    </Fragment>
  );
};

export default BulkPrintClass;