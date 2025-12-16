import React, { useState, useEffect } from "react";

const ReportSection = ({ report, loading }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [qLoading, setQLoading] = useState(false);

  useEffect(() => setAnswer(""), [report]);

  const handleFollowUp = async () => {
    if (!question.trim() || !report) return;
    setQLoading(true);
    setAnswer("");

    let finalAnswer = "";
    let attempts = 0;
    const maxAttempts = 3;
    let success = false;

    const systemPrompt =
      "You are a helpful, concise AI medical assistant. You will be given a diagnostic report and a follow-up question. Answer strictly based on the report content.";
    const userQuery = `Diagnostic Report:\n---\n${report}\n---\n\nFollow-up Question: ${question}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: 0.1 },
    };

    const apiUrl = `https://medrax-backend.onrender.com/ask/`;

    while (attempts < maxAttempts && !success) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.status === 429) {
          await new Promise((r) => setTimeout(r, (2 ** attempts) * 1000));
          attempts++;
          continue;
        }

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          finalAnswer = text;
          success = true;
        }
      } catch (err) {
        console.error(err);
        if (attempts === maxAttempts - 1)
          finalAnswer = "Error: Unable to get an answer.";
        await new Promise((r) => setTimeout(r, (2 ** attempts) * 1000));
        attempts++;
      }
    }

    setAnswer(finalAnswer);
    setQLoading(false);
    setQuestion("");
  };

  return (
    <div className="report-box">
      <div className="report-header">
        <div className="report-icon">✦</div>
        <div className="report-title">AI-Generated Report</div>
      </div>

      <div className="report-content">
        {loading ? (
          <div className="skeleton">
            <div className="skeleton-line w90" />
            <div className="skeleton-line w70" />
            <div className="skeleton-line w95" />
            <div className="skeleton-line w60" />
            <div className="skeleton-paragraph" />
          </div>
        ) : (
          <div className="report-text" style={{ whiteSpace: "pre-wrap" }}>
            {report || "No report generated yet. Upload an image to begin."}
          </div>
        )}
      </div>

      <div className="qa-area">
        <div className="qa-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              stroke="#9cc3ff"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Ask a follow-up question</span>
        </div>

        <div className="qa-input-row">
          <input
            className="follow-up-input"
            placeholder="e.g., What are the key findings?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFollowUp()}
            disabled={!report || loading || qLoading}
          />
          <button
            className={`follow-up-btn ${qLoading ? "loading" : ""}`}
            onClick={handleFollowUp}
            disabled={!question.trim() || !report || loading || qLoading}
          >
            ➤
          </button>
        </div>

        <div className="qa-answer-area">
          {qLoading && <div className="ai-bubble loading">Thinking...</div>}
          {!qLoading && answer && (
            <div className="ai-bubble" style={{ whiteSpace: "pre-wrap" }}>
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportSection;

