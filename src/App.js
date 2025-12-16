import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UploadSection from "./components/UploadSection";
import ReportSection from "./components/ReportSection";
import { base64EncodeFile } from "./utils/base64EncodeFile";
import "./styles/App.css";
import LoginPage from "./MEDraxLogin/LoginPage.jsx";

const App = () => {
  const [imageFile, setImageFile] = useState(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyId, setHistoryId] = useState(null);
  const [question, setQuestion] = useState("");
  const [qaList, setQaList] = useState([]); // stores Q&A history


  const handleImageUpload = async (file) => {
    setImageFile(file);
    setReport("");
    setLoading(true);

    try {
      const base64ImageData = await base64EncodeFile(file);
      const mimeType = file.type;

      const systemPrompt =
        "You are a professional AI Medical Diagnostic Assistant. Analyze the provided X-ray and produce structured sections: Findings, Impression, and Recommendations.";
      const userQuery = "Analyze this X-ray medical image and provide the report.";

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: userQuery },
              { inlineData: { mimeType, data: base64ImageData } },
            ],
          },
        ],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.1 },
      };

      /*const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );*/
      const response = await fetch(
  `${process.env.REACT_APP_BACKEND_URL}/analyze-image-json`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload }),
  }
);

      /*const result = await response.json();
      const text = result?.text;
      console.log("Full API Response:", result);
      setReport(text || "No report generated. Try again.");*/
      const result = await response.json();
console.log("Full API Response:", result);

// 1️⃣ Extract text
const text = result?.text;

// 2️⃣ Extract history_id
const history_id = result?.history_id;

// 3️⃣ Show report
setReport(text || "No report generated. Try again.");

// 4️⃣ Save history_id for future use
if (history_id) {
  setHistoryId(history_id);
  console.log("History ID stored:", history_id);
}

    }  catch (error) {
  console.error("Error while generating report:", error);
  setReport("⚠️ Error generating report. Please check your API key or try another image.");
}


    setLoading(false);
  };
  const askFollowUpQuestion = async () => {
  if (!question || !historyId) {
    alert("Please generate report first and enter a question");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/ask-followup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history_id: historyId,
          question: question,
        }),
      }
    );

    const result = await response.json();
    const answer = result?.answer;

    // save Q&A locally for display
    setQaList((prev) => [
      ...prev,
      { question: question, answer: answer },
    ]);

    setQuestion(""); // clear input box
  } catch (error) {
    console.error("Error asking follow-up question:", error);
    alert("Failed to get answer. Try again.");
  }
};


  // Main app content wrapped in a component for routing
  const MainApp = () => (
    <div>
      <header className="navbar">
        <div className="logo">
          <div className="logo-badge">💙</div>
          <div className="logo-text">MedRAX AI</div>
        </div>
        <button className="new-diagnosis-btn" onClick={() => setImageFile(null)}>
          <span className="plus">+</span> New Diagnosis
        </button>
      </header>

      <div className="container">
        <div className="left-panel">
          <UploadSection image={imageFile} onImageUpload={handleImageUpload} />
        </div>
        <div className="right-panel">
          <ReportSection report={report} loading={loading} question={question}
  setQuestion={setQuestion}
  qaList={qaList}
  askFollowUpQuestion={askFollowUpQuestion}/>
        </div>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/reports"
          element={<MainApp />}
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
