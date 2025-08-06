import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker.js";
import mammoth from "mammoth";
import logo from "./logo.png"; // Make sure logo.png is in your src folder

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const theme = {
  bg: "#161616",
  panel: "#292000",
  yellow: "#ffcb05",
  text: "#fff"
};

function App() {
  const [results, setResults] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [keywords, setKeywords] = useState("");

  // Helper to read PDF
  const handlePDF = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((s) => s.str).join(" ") + " ";
        }
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Helper to read DOCX
  const handleDOCX = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async function () {
        const arrayBuffer = this.result;
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        resolve(value);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // File selection
  const handleFiles = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setResults([]);
  };

  // Main processing
  const startScreening = async () => {
    if (!selectedFiles.length) {
      alert("Please upload at least one file!");
      return;
    }
    setProcessing(true);

    // Prepare keywords (optional)
    const keywordArr = keywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const resultsList = [];

    for (const file of selectedFiles) {
      let resumeText = "";
      try {
        if (file.type === "application/pdf") {
          resumeText = await handlePDF(file);
        } else if (
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.name.endsWith(".docx")
        ) {
          resumeText = await handleDOCX(file);
        } else {
          resultsList.push({
            error: "Unsupported file type",
            email: "",
            phone: "",
            text: "",
            matched: "",
            missing: "",
            score: ""
          });
          continue;
        }

        // Email extraction
        const emails = resumeText.match(
          /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        );
        const email = emails ? emails.join("; ") : "Not found";

        // Phone extraction (simple pattern)
        const phones = resumeText.match(
          /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?[\d\-.\s]{7,}/g
        );
        const phonesClean = phones
          ? phones.filter((num) => num.replace(/\D/g, "").length >= 7)
          : [];
        const phone = phonesClean.length ? phonesClean.join("; ") : "Not found";

        // Keyword screening (optional)
        const resumeLower = resumeText.toLowerCase();
        const matched = keywordArr.length
          ? keywordArr.filter((k) => resumeLower.includes(k))
          : [];
        const missing = keywordArr.length
          ? keywordArr.filter((k) => !resumeLower.includes(k))
          : [];
        const score =
          keywordArr.length > 0
            ? Math.round((matched.length / keywordArr.length) * 100)
            : "";

        resultsList.push({
          email,
          phone,
          text: resumeText,
          matched: matched.join(", "),
          missing: missing.join(", "),
          score:
            keywordArr.length > 0
              ? isNaN(score)
                ? "N/A"
                : `${score}%`
              : "",
          error: ""
        });
      } catch (error) {
        resultsList.push({
          email: "",
          phone: "",
          text: "",
          matched: "",
          missing: "",
          score: "",
          error: "Error reading file"
        });
      }
    }

    setResults(resultsList);
    setProcessing(false);

    // Reset keyword and file input after screening
    setKeywords("");
    setSelectedFiles([]);
    if (document.getElementById("fileInput")) {
      document.getElementById("fileInput").value = "";
    }
  };

  // CSV export
  const exportToCSV = () => {
    if (!results.length) return;
    const header = [
      "Email",
      "Phone",
      "Matched Keywords",
      "Missing Keywords",
      "Score",
      "Full Text",
      "Error"
    ];
    const csvRows = [header.join(",")];

    results.forEach((res) => {
      const escapeCSV = (value) => {
        if (!value) return "";
        let clean = value.replace(/\r?\n|\r/g, " ").replace(/"/g, '""').trim();
        return `"${clean}"`;
      };
      csvRows.push(
        [
          escapeCSV(res.email),
          escapeCSV(res.phone),
          escapeCSV(res.matched),
          escapeCSV(res.missing),
          escapeCSV(res.score),
          escapeCSV(res.text),
          escapeCSV(res.error)
        ].join(",")
      );
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "resume_screening_results.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // TXT export (all full texts, one per file)
  const exportToTXT = () => {
    if (!results.length) return;
    results.forEach((res, idx) => {
      const blob = new Blob([res.text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `resume_${idx + 1}.txt`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, Arial, sans-serif"
      }}
    >
      <div
        style={{
          background: theme.panel,
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          padding: 40,
          maxWidth: 1000,
          width: "100%"
        }}
      >
        {/* Logo at the top */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img
            src={logo}
            alt="Company Logo"
            style={{ height: 70, margin: "0 auto", borderRadius: 12 }}
          />
        </div>
        <h2 style={{ textAlign: "center", color: theme.yellow, marginBottom: 24 }}>
          Resume Screening Tool
        </h2>
        <p style={{ textAlign: "center", marginBottom: 20 }}>
          <b style={{ color: theme.yellow }}>Upload PDF or DOCX resumes</b> to extract emails, phone numbers, and (optionally) keyword scores.<br />
          Download results as CSV or TXT. Results open in Excel.
        </p>
        <div style={{ marginBottom: 14, textAlign: "center" }}>
          <input
            type="text"
            style={{
              width: "100%",
              borderRadius: 7,
              border: `1.5px solid ${theme.yellow}`,
              padding: 9,
              fontSize: "1rem",
              color: "#222",
              marginBottom: 8
            }}
            placeholder="Enter keywords, separated by commas (optional)"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            disabled={processing}
          />
        </div>
        <div style={{ marginBottom: 16, textAlign: "center" }}>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx"
            multiple
            onChange={handleFiles}
            disabled={processing}
            style={{
              marginBottom: 8,
              background: "#222",
              border: `1.5px solid ${theme.yellow}`,
              borderRadius: 7,
              color: theme.text,
              padding: 8
            }}
          />
        </div>
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <button
            onClick={startScreening}
            disabled={processing || !selectedFiles.length}
            style={{
              background: theme.yellow,
              color: "#111",
              border: "none",
              padding: "12px 34px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor:
                processing || !selectedFiles.length ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(50, 50, 0, 0.25)",
              marginRight: 8
            }}
          >
            {processing ? "Processing..." : "Start Screening"}
          </button>
        </div>
        {results.length > 0 && (
          <>
            <div style={{ marginBottom: 18, textAlign: "right" }}>
              <button
                onClick={exportToCSV}
                style={{
                  background: theme.yellow,
                  color: "#111",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginRight: 8
                }}
              >
                Export Results (CSV)
              </button>
              <button
                onClick={exportToTXT}
                style={{
                  background: "transparent",
                  color: theme.yellow,
                  border: `1.5px solid ${theme.yellow}`,
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Export Full Text (TXT)
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#2d2100" }}>
                    <th style={cellStyle}>Email(s)</th>
                    <th style={cellStyle}>Phone(s)</th>
                    <th style={cellStyle}>Matched Keywords</th>
                    <th style={cellStyle}>Missing Keywords</th>
                    <th style={cellStyle}>Score</th>
                    <th style={cellStyle}>Full Resume Text</th>
                    <th style={cellStyle}>Error</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((res, i) => (
                    <tr key={i}>
                      <td style={cellStyle}>{res.email || ""}</td>
                      <td style={cellStyle}>{res.phone || ""}</td>
                      <td style={cellStyle}>{res.matched || ""}</td>
                      <td style={cellStyle}>{res.missing || ""}</td>
                      <td style={cellStyle}>{res.score || ""}</td>
                      <td style={{ ...cellStyle, fontSize: "0.92em", maxWidth: 340, whiteSpace: "pre-wrap" }}>
                        <div style={{ maxHeight: 130, overflowY: "auto" }}>{res.text.slice(0, 250)}{res.text.length > 250 && "..."}
                          <br />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(res.text);
                              alert("Full text copied!");
                            }}
                            style={{
                              background: theme.yellow,
                              color: "#111",
                              border: "none",
                              padding: "3px 12px",
                              borderRadius: "5px",
                              fontSize: "0.9em",
                              marginTop: 6,
                              cursor: "pointer"
                            }}
                          >Copy Full Text</button>
                        </div>
                      </td>
                      <td style={cellStyle}>{res.error || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const cellStyle = {
  border: "1.5px solid #ffcb05",
  padding: "10px",
  textAlign: "left",
  fontSize: "1rem",
  background: "#191406",
  color: "#fff"
};

export default App;
