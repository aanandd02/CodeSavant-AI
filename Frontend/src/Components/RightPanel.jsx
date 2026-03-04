import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import "./RightPanel.css";

function RightPanel({ isReviewing, review, language, applyCorrectedCode }) {
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
  const hasFixSection = sections.some((section) => section.startsWith("🛠"));
  const displaySections =
    fixedCode && !hasFixSection ? [...sections, "🛠 Corrected Code"] : sections;

  const highlighterLanguage = language === "mysql" ? "sql" : language;

  return (
    <section className="right-panel">
      <AnimatePresence mode="sync">
        <motion.div
          className="review-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {displaySections.map((section, idx) => {
            let className = "section-neutral";
            let sectionTitle = "Review";
            let sectionEmoji = "🧾";
            if (section.startsWith("🔴")) className = "section-errors";
            else if (section.startsWith("💡")) className = "section-suggestions";
            else if (section.startsWith("🛠")) className = "section-fix";

            if (className === "section-errors") {
              sectionTitle = "Mistakes";
              sectionEmoji = "🔴";
            } else if (className === "section-suggestions") {
              sectionTitle = "Improvements";
              sectionEmoji = "💡";
            } else if (className === "section-fix") {
              sectionTitle = "Corrected Code";
              sectionEmoji = "🛠️";
            }

            const removeDuplicateHeading = (text) => {
              const lines = text
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean);

              if (lines.length === 0) return "";

              const firstLine = lines[0]
                .toLowerCase()
                .replace(/^[^a-z]+/, "")
                .replace(/[:\-\s]+$/, "")
                .trim();

              const headingLabels = [
                "mistake",
                "mistakes",
                "improvement",
                "improvements",
                "suggestion",
                "suggestions",
                "corrected code",
                "fixed code",
              ];

              if (headingLabels.includes(firstLine)) {
                lines.shift();
              }

              return lines.join("\n").trim();
            };

            const cleanText = removeDuplicateHeading(
              section.replace(/^[🔴💡🛠]\s?/, "").trim()
            );

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
                <h4 className="review-section-title">
                  <span>{sectionEmoji}</span> {sectionTitle}
                </h4>
                <ReactMarkdown>{cleanText}</ReactMarkdown>

                {className === "section-fix" && fixedCode && (
                  <div className="fixed-code-block">
                    <p className="inline-fix-note">
                      Click apply to replace your code automatically.
                    </p>

                    <motion.div
                      className="scrollable-code"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.35 }}
                    >
                      <SyntaxHighlighter
                        language={highlighterLanguage}
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
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export default RightPanel;
