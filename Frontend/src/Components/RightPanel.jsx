import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import "./RightPanel.css";

function RightPanel({ isReviewing, review, applyCorrectedCode }) {
  if (isReviewing) {
    return (
      <div className="right-panel">
        <div className="loading">🔍 Analyzing code...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="right-panel">
        <div className="welcome-text">
          👋 Welcome to <b>CodeSavant-AI</b>! Paste your code on the left and click <b>Review</b>.
        </div>
      </div>
    );
  }

  // Extract corrected code
  const codeMatch = review.match(/```[\s\S]*?```/);
  const fixedCode = codeMatch ? codeMatch[0].replace(/```[a-z]*\n?|\n?```/g, "") : "";
  const textReview = review.replace(/```[\s\S]*?```/g, "").trim();

  // Split review into sections by heading emojis
  const sections = textReview.split(/\n(?=[🔴💡🛠])/).map((s) => s.trim());

  return (
    <div className="right-panel">
      {sections.length > 0 && (
        <div className="review-text">
          {sections.map((section, idx) => {
            let className = "";
            if (section.startsWith("🔴")) className = "mistakes";
            else if (section.startsWith("💡")) className = "suggestions";
            else if (section.startsWith("🛠")) className = "correction";

            // Remove emoji for clean text
            const cleanText = section.replace(/🔴|💡|🛠/g, "").trim();

            return (
              <div key={idx} className={className}>
                <ReactMarkdown>{cleanText}</ReactMarkdown>
              </div>
            );
          })}
        </div>
      )}

      {fixedCode && (
        <div className="fixed-code-block">
          <h3>✅ Corrected / Improved Code</h3>
          <div className="scrollable-code">
            <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
              {fixedCode}
            </SyntaxHighlighter>
          </div>
          <div className="button-group">
            <button
              className="copy-code-btn"
              onClick={() => navigator.clipboard.writeText(fixedCode)}
            >
              Copy
            </button>
            <button
              className="apply-code-btn"
              onClick={() => applyCorrectedCode(fixedCode)}
            >
              Fix
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightPanel;
