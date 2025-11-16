import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import "./RightPanel.css";

function RightPanel({ isReviewing, review, applyCorrectedCode }) {
  // ------------ LOADING STATE ------------
  if (isReviewing) {
    return (
      <section className="right-panel">
        <motion.div
          className="loading-state"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <div className="spinner" />
          <div>
            <h2>Analyzing your code…</h2>
            <p>Finding bugs, edge cases, and improvements.</p>
          </div>
        </motion.div>
      </section>
    );
  }

  // ------------ INITIAL EMPTY VIEW ------------
  if (!review) {
    return (
      <section className="right-panel">
        <motion.div
          className="welcome-card"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <div className="welcome-badge">AI REVIEW WORKSPACE</div>
          <h2>Get a senior engineer-style code review in seconds.</h2>
          <p>
            Paste code on the left and click <strong>Run Review</strong>. AI will provide:
          </p>
          <ul>
            <li>🔴 Mistakes explained clearly</li>
            <li>💡 Good suggestions & best practices</li>
            <li>🛠 A fully corrected version</li>
          </ul>
        </motion.div>
      </section>
    );
  }

  // ------------ PARSE REVIEW DATA ------------
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
      <AnimatePresence mode="sync">
        <motion.div
          className="review-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {sections.map((section, idx) => {
            let className = "section-neutral";
            if (section.startsWith("🔴")) className = "section-errors";
            else if (section.startsWith("💡")) className = "section-suggestions";
            else if (section.startsWith("🛠")) className = "section-fix";

            const cleanText = section.replace(/^[🔴💡🛠]\s?/, "").trim();

            return (
              <motion.div
                key={idx}
                className={`review-section ${className}`}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 1, 0.5, 1],
                  delay: idx * 0.07,
                }}
              >
                <ReactMarkdown>{cleanText}</ReactMarkdown>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ------------ FIXED CODE BLOCK ------------ */}
        {fixedCode && (
          <motion.div
            className="fixed-code-block glow-on-enter"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="fixed-header">
              <h3>✨ Corrected / Improved Code</h3>
              <p>Click apply to replace your code automatically.</p>
            </div>

            <motion.div
              className="scrollable-code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.45 }}
            >
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                showLineNumbers
              >
                {fixedCode}
              </SyntaxHighlighter>
            </motion.div>

            <div className="button-group">
              <motion.button
                className="copy-code-btn"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigator.clipboard.writeText(fixedCode)}
              >
                Copy
              </motion.button>

              <motion.button
                className="apply-code-btn"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => applyCorrectedCode(fixedCode)}
              >
                Apply Fix
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default RightPanel;
