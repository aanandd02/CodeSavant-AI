import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import "./RightPanel.css";

function RightPanel({ isReviewing, review, applyCorrectedCode }) {
  if (isReviewing) {
    return (
      <section className="right-panel">
        <div className="loading-state">
          <div className="spinner" />
          <div>
            <h2>Analyzing your code…</h2>
            <p>Finding bugs, edge cases and improvement opportunities.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!review) {
    return (
      <section className="right-panel">
        <div className="welcome-card">
          <div className="welcome-badge">AI REVIEW WORKSPACE</div>
          <h2>Get a senior engineer-style code review in seconds.</h2>
          <p>
            Paste any function, file or snippet on the left and hit{" "}
            <strong>Run Review</strong>. You&apos;ll see:
          </p>
          <ul>
            <li>🔴 Clear explanation of mistakes</li>
            <li>💡 Suggestions & best practices</li>
            <li>🛠 A corrected, production-ready version</li>
          </ul>
          <div className="welcome-footnote">
            Designed for JavaScript, C, C++ and Java codebases.
          </div>
        </div>
      </section>
    );
  }

  const codeMatch = review.match(/```[\s\S]*?```/);
  const fixedCode = codeMatch
    ? codeMatch[0].replace(/```[a-z]*\n?|\n?```/g, "")
    : "";
  const textReview = review.replace(/```[\s\S]*?```/g, "").trim();

  const sections = textReview
    .split(/\n(?=[🔴💡🛠])/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="right-panel">
      <div className="review-text">
        {sections.map((section, idx) => {
          let className = "section-neutral";
          if (section.startsWith("🔴")) className = "section-errors";
          else if (section.startsWith("💡")) className = "section-suggestions";
          else if (section.startsWith("🛠")) className = "section-fix";

          const cleanText = section.replace(/^[🔴💡🛠]\s?/, "").trim();

          return (
            <div key={idx} className={`review-section ${className}`}>
              <ReactMarkdown>{cleanText}</ReactMarkdown>
            </div>
          );
        })}
      </div>

      {fixedCode && (
        <div className="fixed-code-block">
          <div className="fixed-header">
            <h3>✅ Corrected / Improved Code</h3>
            <p>Copy or apply the fix directly to your editor.</p>
          </div>
          <div className="scrollable-code">
            <SyntaxHighlighter
              language="javascript"
              style={vscDarkPlus}
              showLineNumbers
            >
              {fixedCode}
            </SyntaxHighlighter>
          </div>
          <div className="button-group">
            <button
              className="copy-code-btn"
              onClick={() => navigator.clipboard.writeText(fixedCode)}
            >
              Copy to clipboard
            </button>
            <button
              className="apply-code-btn"
              onClick={() => applyCorrectedCode(fixedCode)}
            >
              Apply to editor
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default RightPanel;
