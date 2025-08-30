import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileUp, FileText, CheckCircle, Download } from "lucide-react";
import jsPDF from "jspdf";

export default function App() {
  const [step, setStep] = useState(0);
  const [rfpText, setRfpText] = useState("");
  const [extractedQuestions, setExtractedQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: "Upload / Paste RFP", icon: <FileUp size={40} />, desc: "Paste RFP text here. The system will extract key questions." },
    { title: "Extract Questions", icon: <FileText size={40} />, desc: "Mock AI extracts key questions for review." },
    { title: "Draft Responses", icon: <CheckCircle size={40} />, desc: "Generate mock AI answers for the extracted questions." },
    { title: "Export Proposal", icon: <Download size={40} />, desc: "Download a polished proposal in PDF format." }
  ];

  const handleExtractQuestions = () => {
    if (!rfpText.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const mockQuestions = [
        "What is your pricing?",
        "What is your timeline?",
        "How do you ensure quality?",
        "How will you handle data migration?",
        "Can you provide references?"
      ];
      setExtractedQuestions(mockQuestions);
      setLoading(false);
      setStep(2);
    }, 500);
  };

  const generateResponse = (question) => {
    setLoading(true);
    setTimeout(() => {
      let answer = "This is a mock answer.";
      if (question.toLowerCase().includes("pricing")) {
        answer = "We offer a flexible pricing model tailored to your needs.";
      } else if (question.toLowerCase().includes("timeline")) {
        answer = "Our implementation timeline aligns with your requested milestones.";
      } else if (question.toLowerCase().includes("quality")) {
        answer = "We follow strict quality standards to ensure success.";
      } else if (question.toLowerCase().includes("data migration")) {
        answer = "We handle data migration with minimal downtime and full data integrity.";
      } else if (question.toLowerCase().includes("references")) {
        answer = "We can provide references from similar projects completed in the last three years.";
      }
      setResponses(prev => ({ ...prev, [question]: answer }));
      setLoading(false);
    }, 500);
  };

  const downloadProposal = () => {
    const doc = new jsPDF();
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0,0,0);
    doc.rect(0,0,210,297,'F');
    doc.text("Proposal\n\n", 10, 10);
    extractedQuestions.forEach((q, i) => {
      doc.text(`${i+1}. Q: ${q}`, 10, 20 + i*20);
      doc.text(`   A: ${responses[q] || "Not answered"}`, 10, 25 + i*20);
    });
    doc.save("proposal.pdf");
  };

  return (
    <div className="app-container">
      <div className="card">
        <motion.div key={step} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2>{steps[step].icon} {steps[step].title}</h2>
          <p>{steps[step].desc}</p>

          {step === 0 && (
            <>
              <textarea placeholder="Paste your RFP text here..." value={rfpText} onChange={(e) => setRfpText(e.target.value)} />
              <button onClick={handleExtractQuestions} style={{ marginTop: "10px" }}>Extract Questions</button>
            </>
          )}

          {step === 2 && (
            <>
              {loading && <p>Generating response...</p>}
              {!loading && extractedQuestions.map((q, i) => (
                <div key={i} style={{ marginBottom: "15px" }}>
                  <strong>Q: {q}</strong>
                  <p>A: {responses[q] || "-"}</p>
                  <button onClick={() => generateResponse(q)}>Generate Response</button>
                </div>
              ))}
            </>
          )}

          {step === 3 && <button onClick={downloadProposal}>Download Proposal PDF</button>}
        </motion.div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
        <button onClick={() => setStep(step === steps.length - 1 ? 0 : step + 1)}>{step === steps.length - 1 ? "Restart" : "Next"}</button>
      </div>
    </div>
  );
}