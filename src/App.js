import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker.js";
import mammoth from "mammoth";
import logo from "./logo.png";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const theme = {
  bg: "#161616",
  panel: "#292000",
  yellow: "#ffcb05",
  text: "#fff"
};

const predefinedSkills = [
  "AI", "ML", "NLP", "Generative AI", "MEARN Stack", "Full Stack", "PHP", "Laravel", "Node.js", "Transflow",
  "Python", "Microsoft Dynamics", "Oracle Netsuit", "Deep Learning", "React", "Angular", "Vue.js", "TypeScript", "JavaScript",
  "Java", "C#", "C++", "Go", "Rust", "Kotlin", "Swift", "Dart", "Flutter", "Spring Boot",
  "ASP.NET", "Ruby on Rails", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Redis", "GraphQL", "REST API",
  "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "CI/CD", "Git", "Jenkins", "Terraform", "Ansible",
  "Linux", "Bash", "PowerShell", "Agile", "Scrum", "JIRA", "Confluence", "Data Science", "Big Data", "Hadoop",
  "Spark", "Pandas", "NumPy", "TensorFlow", "PyTorch", "OpenCV", "Matplotlib", "Scikit-learn", "LLMs", "ChatGPT API",
  "Prompt Engineering", "LangChain", "Vector DBs", "Pinecone", "Qdrant", "Weaviate", "Cybersecurity", "Penetration Testing", "Ethical Hacking", "SIEM",
  "SOC", "DevSecOps", "ISO 27001", "Blockchain", "Solidity", "Smart Contracts", "Web3.js", "NFTs", "Metaverse", "Digital Twins",
  "IoT", "Edge Computing", "Robotic Process Automation", "Power BI", "Tableau", "Looker", "Salesforce", "HubSpot", "Shopify", "WordPress"
];

const certificationOptions = {
  "HR": ["SHRM-CP", "SHRM-SCP", "PHR", "SPHR", "aPHR"],
  "IT": ["CompTIA A+", "Azure Fundamentals", "AWS Cloud Practitioner", "Google IT Support", "CCNA"],
  "Cybersecurity": ["Security+", "CEH", "CISSP", "CISM", "GSEC"],
  "Finance": ["ACCA", "CPA", "CFA", "CIMA", "CMA"],
  "Project Management": ["PMP", "PRINCE2", "CAPM", "PMI-ACP", "Scrum Master"]
};

const educationOptions = ["Bachelor's", "Master's", "Above Master's"];

function App() {
  const [results, setResults] = useState([]);
  const [highlightedText, setHighlightedText] = useState([]);
  const [showText, setShowText] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [selectedEdu, setSelectedEdu] = useState([]);

  const toggle = (item, list, setter) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((v) => v !== item) : [...prev, item]
    );
  };

  const handleFiles = (e) => {
    setSelectedFiles(Array.from(e.target.files));
    setResults([]);
    setHighlightedText([]);
  };

  const extractField = (text, regex) => {
    const match = text.match(regex);
    return match ? match[0] : "Not found";
  };

  const highlightKeywords = (text, keywords) => {
    let highlighted = text;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      highlighted = highlighted.replace(regex, (match) => `<mark>${match}</mark>`);
    });
    return highlighted;
  };

  const extractText = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async function () {
        let text = "";
        if (file.type.includes("pdf")) {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((s) => s.str).join(" ") + " ";
          }
        } else {
          const { value } = await mammoth.extractRawText({ arrayBuffer: this.result });
          text = value;
        }
        resolve(text);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const exportCSV = () => {
    const csvContent = [
      Object.keys(results[0]).join(","),
      ...results.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "screening_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startScreening = async () => {
    if (!selectedFiles.length) return alert("Please upload at least one file!");
    setProcessing(true);

    const allKeywords = [...new Set([
      ...selectedSkills,
      ...selectedCerts,
      ...selectedEdu,
      ...keywords.split(",").map(k => k.trim()).filter(Boolean)
    ])].map(k => k.toLowerCase());

    const jdKeywords = jobDescription
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(/\s+/).map(k => k.toLowerCase()).filter(k => k.length > 3);

    const output = [];
    const highlightedSnippets = [];

    for (const file of selectedFiles) {
      const text = await extractText(file);
      const lower = text.toLowerCase();

      const email = extractField(text, /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const phone = extractField(text, /\+?\d[\d\s().-]{7,}\d/);

      const matched = allKeywords.filter(k => lower.includes(k));
      const missing = allKeywords.filter(k => !lower.includes(k));
      const score = allKeywords.length ? `${Math.round((matched.length / allKeywords.length) * 100)}%` : "";

      const matchedJD = jdKeywords.filter(k => lower.includes(k));
      const missingJD = jdKeywords.filter(k => !lower.includes(k));
      const jobScore = jdKeywords.length ? `${Math.round((matchedJD.length / jdKeywords.length) * 100)}%` : "";

      output.push({
        File: file.name,
        Email: email,
        Phone: phone,
        Matched: matched.join(", "),
        Missing: missing.join(", "),
        Score: score,
        JDMatch: matchedJD.join(", "),
        JDScore: jobScore,
        JDMissing: missingJD.join(", ")
      });

      highlightedSnippets.push(highlightKeywords(text, [...matched, ...matchedJD]));
    }

    setResults(output);
    setHighlightedText(highlightedSnippets);
    setProcessing(false);
  };

  return (
    <div style={{ background: theme.bg, color: theme.text, padding: 20, fontFamily: "Arial" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", background: theme.panel, padding: 30, borderRadius: 10 }}>
        <img src={logo} alt="Banner" style={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
        <h2 style={{ color: theme.yellow, textAlign: "center" }}>Resume Screening App</h2>

        <textarea placeholder="Paste job description here (optional)" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} style={{ width: "100%", height: 100, padding: 10, borderRadius: 6, marginBottom: 10 }} />
        <input type="text" placeholder="Enter comma-separated keywords (optional)" value={keywords} onChange={(e) => setKeywords(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 6 }} />

        <label style={{ fontWeight: "bold", color: theme.yellow }}>Or select from common skills:</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {predefinedSkills.map(skill => (
            <label key={skill}><input type="checkbox" checked={selectedSkills.includes(skill)} onChange={() => toggle(skill, selectedSkills, setSelectedSkills)} /> {skill}</label>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: "bold", color: theme.yellow }}>Certifications (optional):</label>
          {Object.entries(certificationOptions).map(([cat, certs]) => (
            <fieldset key={cat}><legend>{cat}</legend>{certs.map(cert => (
              <label key={cert}><input type="checkbox" checked={selectedCerts.includes(cert)} onChange={() => toggle(cert, selectedCerts, setSelectedCerts)} /> {cert}</label>
            ))}</fieldset>
          ))}
        </div>

        <label style={{ fontWeight: "bold", color: theme.yellow }}>Education (optional):</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {educationOptions.map(edu => (
            <label key={edu}><input type="checkbox" checked={selectedEdu.includes(edu)} onChange={() => toggle(edu, selectedEdu, setSelectedEdu)} /> {edu}</label>
          ))}
        </div>

        <input type="file" accept=".pdf,.docx" multiple onChange={handleFiles} style={{ display: "block", margin: "20px 0" }} />
        <button onClick={startScreening} disabled={processing || !selectedFiles.length} style={{ background: theme.yellow, padding: "10px 20px", border: "none", borderRadius: 5, cursor: "pointer" }}>
          {processing ? "Processing..." : "Start Screening"}
        </button>

        {results.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <button onClick={exportCSV} style={{ marginBottom: 10, background: theme.yellow, padding: "8px 16px", border: "none", borderRadius: 4, cursor: "pointer" }}>Download CSV</button>
            <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
              <thead>
                <tr>
                  {Object.keys(results[0]).map(key => <th key={key}>{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <>
                    <tr key={i}>{Object.values(r).map((v, j) => <td key={j}>{v}</td>)}</tr>
                    <tr><td colSpan="8"><button onClick={() => setShowText((prev) => ({ ...prev, [i]: !prev[i] }))}>Toggle Resume View</button></td></tr>
                    {showText[i] && (
                      <tr><td colSpan="8" dangerouslySetInnerHTML={{ __html: highlightedText[i] }} style={{ backgroundColor: "#222", color: theme.text, padding: 10 }} /></tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
